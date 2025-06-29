import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class CreateScheduleSlotRequestDto {
	@ApiProperty({ example: '2025-07-30T10:00:00.000Z' })
	@IsDateString()
	startTime: Date;

	@ApiProperty({ example: '2025-07-30T11:00:00.000Z' })
	@IsDateString()
	endTime: Date;
}