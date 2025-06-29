import { Injectable } from "@nestjs/common";
import { Schedule } from "src/domain/entities/schedule.entity";
import { ScheduleDto } from "../dtos/schedule.dto";

@Injectable()
export class ScheduleMapper {
	toDto(entity: Schedule): ScheduleDto {
		const dto = new ScheduleDto();
		dto.id = entity.id;
		dto.psychologistId = entity.psychologistId;
		dto.startTime = entity.startTime;
		dto.endTime = entity.endTime;
		dto.status = entity.status;
		return dto;
	}
}