import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Schedule } from "../../../src/domain/entities/schedule.entity";
import { IScheduleRepository } from "../../../src/domain/repositories/ischedule.repository";
import { MoreThan, Repository } from "typeorm";
import { ScheduleStatus } from "../../../src/domain/enums/schedule-status.enum";

@Injectable()
export class ScheduleRepository implements IScheduleRepository {
	constructor(
		@InjectRepository(Schedule)
		private readonly repository: Repository<Schedule>,
	) { }

	async create(schedule: Schedule): Promise<Schedule> {
		return this.repository.save(schedule);
	}

	async findByPsychologistId(psychologistId: string): Promise<Schedule[]> {
		return this.repository.find({
			where: { psychologistId },
			order: { startTime: 'ASC' },
		});
	}

	async findById(id: string): Promise<Schedule | null> {
		return this.repository.findOne({ where: { id } });
	}

	async delete(id: string): Promise<void> {
		await this.repository.delete(id);
	}

	async update(schedule: Schedule): Promise<Schedule> {
		return this.repository.save(schedule);
	}

	async findAvailableByPsychologistId(psychologistId: string): Promise<Schedule[]> {
		return this.repository.find({
			where: {
				psychologistId,
				status: ScheduleStatus.AVAILABLE, // Hanya yang statusnya tersedia
				startTime: MoreThan(new Date()), // Hanya jadwal di masa depan
			},
			order: {
				startTime: 'ASC', // Urutkan dari yang paling awal
			},
		});
	}
}