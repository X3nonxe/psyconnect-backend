import 'reflect-metadata';
import * as TypeMoq from 'typemoq';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UpdateScheduleSlotHandler } from '../../../src/application/use-cases/update-schedule-slot/update-schedule-slot.handler';
import { UpdateScheduleSlotCommand } from '../../../src/application/use-cases/update-schedule-slot/update-schedule-slot.command';
import { IScheduleRepository } from '../../../src/domain/repositories/ischedule.repository';
import { Schedule } from '../../../src/domain/entities/schedule.entity';

describe('UpdateScheduleSlotHandler Unit Tests', () => {
	let handler: UpdateScheduleSlotHandler;
	const mockScheduleRepo: TypeMoq.IMock<IScheduleRepository> = TypeMoq.Mock.ofType<IScheduleRepository>();

	const psychologistId = uuidv4();
	const anotherPsychologistId = uuidv4();
	const scheduleId = uuidv4();

	const existingSlot = new Schedule({
		id: scheduleId,
		psychologistId: psychologistId,
		startTime: new Date(),
		endTime: new Date(),
	});

	beforeEach(() => {
		handler = new UpdateScheduleSlotHandler(mockScheduleRepo.object);
	});

	afterEach(() => {
		mockScheduleRepo.reset();
	});

	it('should update a schedule slot successfully', async () => {
		// Arrange
		const command = new UpdateScheduleSlotCommand(scheduleId, psychologistId, new Date(), new Date(Date.now() + 3600000));
		mockScheduleRepo.setup((x) => x.findById(scheduleId)).returns(async () => existingSlot);
		mockScheduleRepo.setup((x) => x.update(TypeMoq.It.isAnyObject(Schedule))).returns(async (s) => s);

		// Act
		await handler.execute(command);

		// Assert
		mockScheduleRepo.verify((x) => x.update(TypeMoq.It.isAnyObject(Schedule)), TypeMoq.Times.once());
	});

	it('should throw NotFoundException if schedule slot does not exist', async () => {
		// Arrange
		const command = new UpdateScheduleSlotCommand(scheduleId, psychologistId, new Date(), new Date());
		mockScheduleRepo.setup((x) => x.findById(scheduleId)).returns(async () => null);

		// Act & Assert
		await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
	});

	it('should throw ForbiddenException if psychologist tries to update another psychologist schedule', async () => {
		// Arrange
		const command = new UpdateScheduleSlotCommand(scheduleId, anotherPsychologistId, new Date(), new Date());
		mockScheduleRepo.setup((x) => x.findById(scheduleId)).returns(async () => existingSlot);

		// Act & Assert
		await expect(handler.execute(command)).rejects.toThrow(ForbiddenException);
		mockScheduleRepo.verify((x) => x.update(TypeMoq.It.isAny()), TypeMoq.Times.never());
	});
});