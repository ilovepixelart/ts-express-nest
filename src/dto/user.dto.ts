import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({ description: 'User name', example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'User role',
    example: 'admin',
    enum: ['admin', 'manager', 'user'],
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['admin', 'manager', 'user'])
  role!: string;
}
