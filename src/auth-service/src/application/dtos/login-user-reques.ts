import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginRequestDto {
	@ApiProperty({
		example: 'client@example.com',
		description: 'User\'s email address for login',
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		example: 'Password123!',
		description: 'User\'s password (minimum 8 characters)',
	})
	@IsString()
	@MinLength(8)
	@MaxLength(64)
	password: string;
}