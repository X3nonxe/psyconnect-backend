import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ScheduleStatus } from '../enums/schedule-status.enum';

@Entity('schedules')
export class Schedule {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	// ID psikolog yang memiliki jadwal ini (didapat dari token JWT)
	@Column({ type: 'uuid' })
	psychologistId: string;

	@Column({ type: 'timestamp with time zone' })
	startTime: Date;

	@Column({ type: 'timestamp with time zone' })
	endTime: Date;

	@Column({
		type: 'enum',
		enum: ScheduleStatus,
		default: ScheduleStatus.AVAILABLE,
	})
	status: ScheduleStatus;

	@Column()
	createdAt: Date;

	@Column({ nullable: true })
	updatedAt?: Date | null;

	constructor(partial?: Partial<Schedule>) {
		Object.assign(this, partial);
		this.createdAt = partial?.createdAt ?? new Date();
	}
}