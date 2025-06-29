import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../domain/enums/role.enum';

class EducationDetailDto {
  @ApiProperty()
  degree: string;

  @ApiProperty()
  university: string;
}

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  full_name: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty({ required: false, nullable: true })
  phone_number?: string | null;

  @ApiProperty({ required: false, type: [String], nullable: true })
  specializations?: string[] | null;

  @ApiProperty({ required: false, nullable: true })
  license_number?: string | null;

  @ApiProperty({ required: false, nullable: true })
  description?: string | null;

  @ApiProperty({
    required: false,
    isArray: true,
    type: EducationDetailDto,
    nullable: true
  })
  education?: EducationDetailDto[] | null;

  @ApiProperty({ required: false, nullable: true })
  consultation_fee?: number | null;

  @ApiProperty()
  createdAt: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
