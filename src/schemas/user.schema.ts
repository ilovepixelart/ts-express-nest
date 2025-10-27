import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, enum: ['admin', 'manager', 'user'], required: true })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
