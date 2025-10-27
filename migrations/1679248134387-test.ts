import type { Connection } from 'mongoose';
import { UserSchema } from '../src/schemas/user.schema';

export async function up(connection: Connection) {
  const UserModel = connection.model('User', UserSchema);
  console.log('Migration - up');

  // Write migration here
  await UserModel.findOneAndUpdate(
    { name: 'John Doe' },
    { name: 'John Doe', role: 'admin' },
    { upsert: true, new: true },
  );
}

export async function down(connection: Connection) {
  const UserModel = connection.model('User', UserSchema);
  console.log('Migration - down');

  // Write migration here
  await UserModel.deleteMany({ role: 'admin' });
}
