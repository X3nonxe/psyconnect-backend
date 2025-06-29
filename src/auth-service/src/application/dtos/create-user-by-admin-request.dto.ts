// auth-service/src/application/dtos/create-user-by-admin-request.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Role } from '../../../src/domain/enums/role.enum';
import { EducationDetail } from '../../../src/domain/entities/user.entity';

class EducationDto {
	@IsString()
	degree: string;

	@IsString()
	university: string;
}

export class CreateUserByAdminRequestDto {
	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	full_name: string; // Diperbarui dari 'name'

	@ApiProperty()
	@IsString()
	@MinLength(8)
	password: string;

	@ApiProperty({ enum: Role, enumName: 'Role' })
	@IsEnum(Role)
	role: Role;

	// --- Field Psikolog (Opsional) ---
	@ApiProperty({ required: false, type: [String] })
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	specializations?: string[];

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	license_number?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	description?: string;

	@ApiProperty({ required: false, type: [EducationDto] })
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => EducationDto)
	education?: EducationDetail[];

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumber()
	consultation_fee?: number;
}