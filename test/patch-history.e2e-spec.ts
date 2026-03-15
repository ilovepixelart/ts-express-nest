import { Module } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import {
  MongooseModule,
  getConnectionToken,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';
import mongoose, { type Connection, type Model } from 'mongoose';
import { patchHistoryPlugin } from 'ts-patch-mongoose';

@Schema({ timestamps: true })
class Cat {
  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: Number })
  age?: number;
}

const CatSchema = SchemaFactory.createForClass(Cat);

CatSchema.plugin(patchHistoryPlugin, {
  omit: ['__v', 'createdAt', 'updatedAt'],
});

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest-patch-test'),
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
  ],
})
class TestModule {}

describe('Patch History — NestJS', () => {
  jest.setTimeout(30000);

  let app: INestApplication;
  let connection: Connection;
  let catModel: Model<Cat>;

  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/nest-patch-test');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    connection = moduleFixture.get<Connection>(getConnectionToken());
    catModel = connection.model<Cat>(Cat.name);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await app.close();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await catModel.deleteMany({});
    await connection.collection('history').deleteMany({});
  });

  it('should save create history', async () => {
    const cat = await catModel.create({ name: 'Whiskers', age: 3 });

    const history = await connection
      .collection('history')
      .find({ collectionId: cat._id })
      .toArray();
    expect(history).toHaveLength(1);
    expect(history[0].op).toBe('create');
    expect(history[0].modelName).toBe('Cat');
    expect(history[0].doc).toHaveProperty('name', 'Whiskers');
    expect(history[0].doc).not.toHaveProperty('__v');
    expect(history[0].doc).not.toHaveProperty('createdAt');
  });

  it('should save update history with patch', async () => {
    const cat = await catModel.create({ name: 'Whiskers', age: 3 });
    await catModel.updateOne({ _id: cat._id }, { age: 4 });

    const history = await connection
      .collection('history')
      .find({ collectionId: cat._id })
      .sort({ createdAt: 1 })
      .toArray();
    expect(history).toHaveLength(2);
    expect(history[1].op).toBe('updateOne');
    expect(history[1].version).toBe(1);
    expect(
      (history[1].patch as { path: string }[]).some((p) => p.path === '/age'),
    ).toBe(true);
  });

  it('should save delete history with document snapshot', async () => {
    const cat = await catModel.create({ name: 'Whiskers', age: 3 });
    await catModel.deleteOne({ _id: cat._id });

    const history = await connection
      .collection('history')
      .find({ collectionId: cat._id })
      .sort({ createdAt: 1 })
      .toArray();
    expect(history).toHaveLength(2);
    expect(history[1].op).toBe('deleteOne');
    expect(history[1].doc).toHaveProperty('name', 'Whiskers');
    expect(history[1].doc).toHaveProperty('age', 3);
  });

  it('should track full lifecycle with correct versions', async () => {
    const cat = await catModel.create({ name: 'Kitten', age: 1 });

    cat.age = 2;
    await cat.save();

    await catModel.updateOne({ _id: cat._id }, { name: 'Cat', age: 3 });
    await catModel.deleteOne({ _id: cat._id });

    const history = await connection
      .collection('history')
      .find({ collectionId: cat._id })
      .sort({ createdAt: 1 })
      .toArray();
    expect(history).toHaveLength(4);
    expect(history[0].op).toBe('create');
    expect(history[0].version).toBe(0);
    expect(history[1].op).toBe('update');
    expect(history[1].version).toBe(1);
    expect(history[2].op).toBe('updateOne');
    expect(history[2].version).toBe(2);
    expect(history[3].op).toBe('deleteOne');
    expect(history[3].doc).toHaveProperty('name', 'Cat');
  });
});
