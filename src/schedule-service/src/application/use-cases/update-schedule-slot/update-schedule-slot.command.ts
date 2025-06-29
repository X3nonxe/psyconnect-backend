export class UpdateScheduleSlotCommand {
	constructor(
		public readonly scheduleId: string,
		public readonly psychologistId: string, // Untuk verifikasi kepemilikan
		public readonly startTime: Date,
		public readonly endTime: Date,
	) { }
}