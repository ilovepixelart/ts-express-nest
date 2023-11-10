import { getModels } from '../src/clients/migration.models';

export async function up() {
  const { UserModel } = await getModels();
  console.log('Migration - up');

  // Write migration here
  await UserModel.findOneAndUpdate(
    { name: 'John Doe' },
    { name: 'John Doe', role: 'admin' },
    { upsert: true, new: true },
  );
}

export async function down() {
  const { UserModel } = await getModels();
  console.log('Migration - down');

  // Write migration here
  await UserModel.deleteMany({ role: 'admin' });
}
