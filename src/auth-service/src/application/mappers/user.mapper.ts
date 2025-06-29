// auth-service/src/application/mappers/user.mapper.ts

import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserDto } from '../dtos/user.dto';

@Injectable()
export class UserMapper {
  toDto(user: User): UserDto {
    return new UserDto({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      phone_number: user.phone_number,
      specializations: user.specializations,
      license_number: user.license_number,
      description: user.description,
      education: user.education,
      consultation_fee: user.consultation_fee,
      createdAt: user.createdAt,
    });
  }
}