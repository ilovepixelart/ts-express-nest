import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: UserDto): Promise<User> {
    const created = new this.userModel(createUserDto);
    return created.save();
  }

  async update(id: string, updateUserDto: UserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  async delete(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id);
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).cache('3 seconds').exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
