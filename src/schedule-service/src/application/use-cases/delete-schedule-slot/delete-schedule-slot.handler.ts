import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteScheduleSlotCommand } from "./delete-schedule-slot.command";
import { Inject, NotFoundException, ForbiddenException } from "@nestjs/common";
import { IScheduleRepository } from "../../../../src/domain/repositories/ischedule.repository";

@CommandHandler(DeleteScheduleSlotCommand)
export class DeleteScheduleSlotHandler implements ICommandHandler<DeleteScheduleSlotCommand> {
	constructor(
		@Inject(IScheduleRepository) private readonly scheduleRepository: IScheduleRepository
	) { }

	async execute(command: DeleteScheduleSlotCommand): Promise<void> {
		const { scheduleId, psychologistId } = command;

		const slot = await this.scheduleRepository.findById(scheduleId);
		if (!slot) {
			throw new NotFoundException('Schedule slot not found.');
		}

		if (slot.psychologistId !== psychologistId) {
			throw new ForbiddenException('You are not allowed to delete this schedule.');
		}

		await this.scheduleRepository.delete(scheduleId);
	}
}