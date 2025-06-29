import { ApiProperty } from "@nestjs/swagger";
import { ScheduleStatus } from "../../../src/domain/enums/schedule-status.enum";

export class ScheduleDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	psychologistId: string;

	@ApiProperty()
	startTime: Date;

	@ApiProperty()
	endTime: Date;

	@ApiProperty({ enum: ScheduleStatus })
	status: ScheduleStatus;
}