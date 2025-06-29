import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';
import { CreateScheduleSlotCommand } from './create-schedule-slot.command';
import { Schedule } from '../../../../src/domain/entities/schedule.entity';
import { IScheduleRepository } from '../../../../src/domain/repositories/ischedule.repository';
import { ScheduleDto } from '../../../../src/application/dtos/schedule.dto';
import { ScheduleMapper } from '../../../../src/application/mappers/schedule.mapper';

@CommandHandler(CreateScheduleSlotCommand)
export class CreateScheduleSlotHandler implements ICommandHandler<CreateScheduleSlotCommand, ScheduleDto> {
	constructor(
		@Inject(IScheduleRepository) private readonly scheduleRepository: IScheduleRepository,
		private readonly scheduleMapper: ScheduleMapper,
	) { }

	async execute(command: CreateScheduleSlotCommand): Promise<ScheduleDto> {
		const { psychologistId, startTime, endTime } = command;

		if (new Date(startTime) >= new Date(endTime)) {
			throw new BadRequestException('End time must be after start time.');
		}

		const newSlot = new Schedule({
			psychologistId,
			startTime,
			endTime,
		});

		const savedSlot = await this.scheduleRepository.create(newSlot);

		return this.scheduleMapper.toDto(savedSlot);
	}
}