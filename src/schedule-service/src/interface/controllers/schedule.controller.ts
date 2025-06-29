import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus, Get, Patch, Param, Delete } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateScheduleSlotRequestDto } from '../../../src/application/dtos/create-schedule-slot-request.dto';
import { CreateScheduleSlotCommand } from '../../../src/application/use-cases/create-schedule-slot/create-schedule-slot.command';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../../../src/domain/enums/role.enum';
import { GetMySchedulesQuery } from '../../../src/application/use-cases/get-my-schedules/get-my-schedules.query';
import { UpdateScheduleSlotCommand } from '../../../src/application/use-cases/update-schedule-slot/update-schedule-slot.command';
import { DeleteScheduleSlotCommand } from '../../../src/application/use-cases/delete-schedule-slot/delete-schedule-slot.command';
import { UpdateScheduleSlotDto } from '../../../src/application/dtos/update-schedule-slot.dto';
import { ScheduleDto } from '../../../src/application/dtos/schedule.dto';
import { GetAvailableSchedulesQuery } from '../../../src/application/use-cases/get-available-schedules/get-available-schedules.query';

@ApiTags('Schedules')
@Controller('schedules')
export class ScheduleController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus // Inject QueryBus
	) { }

	@Post()
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(Role.PSYCHOLOGIST)
	@ApiBearerAuth()
	@HttpCode(HttpStatus.CREATED)
	createScheduleSlot(@Body() dto: CreateScheduleSlotRequestDto, @Req() req) {
		const psychologistId = req.user.userId; // Ambil ID dari token JWT

		const command = new CreateScheduleSlotCommand(
			psychologistId,
			dto.startTime,
			dto.endTime,
		);
		return this.commandBus.execute(command);
	}

	@Get('my-schedules')
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(Role.PSYCHOLOGIST)
	@ApiBearerAuth()
	getMySchedules(@Req() req) {
		const psychologistId = req.user.userId;
		return this.queryBus.execute(new GetMySchedulesQuery(psychologistId));
	}

	@Patch(':id')
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(Role.PSYCHOLOGIST)
	@ApiBearerAuth()
	@HttpCode(HttpStatus.NO_CONTENT)
	updateScheduleSlot(
		@Param('id') scheduleId: string,
		@Body() dto: UpdateScheduleSlotDto, // DTO baru untuk update
		@Req() req
	) {
		const psychologistId = req.user.userId;
		const command = new UpdateScheduleSlotCommand(scheduleId, psychologistId, dto.startTime, dto.endTime);
		return this.commandBus.execute(command);
	}

	@Delete(':id')
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(Role.PSYCHOLOGIST)
	@ApiBearerAuth()
	@HttpCode(HttpStatus.NO_CONTENT)
	deleteScheduleSlot(@Param('id') scheduleId: string, @Req() req) {
		const psychologistId = req.user.userId;
		const command = new DeleteScheduleSlotCommand(scheduleId, psychologistId);
		return this.commandBus.execute(command);
	}

	@Get('psychologist/:psychologistId/available')
	@UseGuards(AuthGuard('jwt')) // Hanya perlu login, tidak perlu peran khusus
	@ApiBearerAuth()
	getAvailableSchedules(@Param('psychologistId') psychologistId: string): Promise<ScheduleDto[]> {
		return this.queryBus.execute(new GetAvailableSchedulesQuery(psychologistId));
	}
}