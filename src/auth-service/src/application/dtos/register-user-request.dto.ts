import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterUserRequestDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email, must be unique',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'User password, must be at least 8 characters long',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone_number?: string;
}
