import mongoose from 'mongoose';
import { User, UserSchema } from '../schemas/user.schema';

// Defining models here makes it easier to use them in migrations
const UserModel = mongoose.model(User.name, UserSchema);

export const getModels = async () => {
  // Since we are using the same connection, we can just return the model
  await mongoose.connect(
    process.env.MONGO_URI ?? 'mongodb://localhost:27017/nest',
  );
  return { UserModel };
};
