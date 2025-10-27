import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import type { UserDto } from '../dto/user.dto';
import { User } from '../schemas/user.schema';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() user: UserDto): Promise<User> {
    return this.userService.create(user);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: UserDto): Promise<User> {
    return this.userService.update(id, user);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<User> {
    return this.userService.delete(id);
  }
}
