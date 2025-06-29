import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAvailableSchedulesQuery } from "./get-available-schedules.query";
import { Inject } from "@nestjs/common";
import { IScheduleRepository } from "../../../../src/domain/repositories/ischedule.repository";
import { ScheduleDto } from "../../../../src/application/dtos/schedule.dto";
import { ScheduleMapper } from "../../../../src/application/mappers/schedule.mapper";

@QueryHandler(GetAvailableSchedulesQuery)
export class GetAvailableSchedulesHandler implements IQueryHandler<GetAvailableSchedulesQuery, ScheduleDto[]> {
	constructor(
		@Inject(IScheduleRepository) private readonly scheduleRepository: IScheduleRepository,
		private readonly mapper: ScheduleMapper,
	) { }

	async execute(query: GetAvailableSchedulesQuery): Promise<ScheduleDto[]> {
		const schedules = await this.scheduleRepository.findAvailableByPsychologistId(query.psychologistId);
		return schedules.map(this.mapper.toDto);
	}
}