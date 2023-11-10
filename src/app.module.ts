import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './schemas/user.module';

// To enable cache for your mongoose models, you need to import the cache module and initialize it with mongoose.
import mongoose from 'mongoose';
import cache from 'ts-cache-mongoose';
cache.init(mongoose, {
  defaultTTL: '60 seconds',
  engine: 'memory',
});

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost/nest'),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
