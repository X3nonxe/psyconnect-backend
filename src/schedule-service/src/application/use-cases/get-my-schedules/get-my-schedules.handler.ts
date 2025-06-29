import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetMySchedulesQuery } from "./get-my-schedules.query";
import { Inject } from "@nestjs/common";
import { IScheduleRepository } from "../../../../src/domain/repositories/ischedule.repository";
import { ScheduleDto } from "../../../../src/application/dtos/schedule.dto";
import { ScheduleMapper } from "../../../../src/application/mappers/schedule.mapper";

@QueryHandler(GetMySchedulesQuery)
export class GetMySchedulesHandler implements IQueryHandler<GetMySchedulesQuery, ScheduleDto[]> {
	constructor(
		@Inject(IScheduleRepository) private readonly scheduleRepository: IScheduleRepository,
		private readonly mapper: ScheduleMapper,
	) { }

	async execute(query: GetMySchedulesQuery): Promise<ScheduleDto[]> {
		const schedules = await this.scheduleRepository.findByPsychologistId(query.psychologistId);
		return schedules.map(this.mapper.toDto);
	}
}