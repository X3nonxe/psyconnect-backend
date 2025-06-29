import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateScheduleSlotCommand } from "./update-schedule-slot.command";
import { Inject, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { IScheduleRepository } from "../../../../src/domain/repositories/ischedule.repository";

@CommandHandler(UpdateScheduleSlotCommand)
export class UpdateScheduleSlotHandler implements ICommandHandler<UpdateScheduleSlotCommand> {
	constructor(
		@Inject(IScheduleRepository) private readonly scheduleRepository: IScheduleRepository
	) { }

	async execute(command: UpdateScheduleSlotCommand): Promise<void> {
		const { scheduleId, psychologistId, startTime, endTime } = command;

		const slot = await this.scheduleRepository.findById(scheduleId);
		if (!slot) {
			throw new NotFoundException('Schedule slot not found.');
		}

		if (slot.psychologistId !== psychologistId) {
			throw new ForbiddenException('You are not allowed to modify this schedule.');
		}

		if (new Date(startTime) >= new Date(endTime)) {
			throw new BadRequestException('End time must be after start time.');
		}

		// Perbarui properti
		slot.startTime = startTime;
		slot.endTime = endTime;
		slot.updatedAt = new Date();

		await this.scheduleRepository.update(slot);
	}
}