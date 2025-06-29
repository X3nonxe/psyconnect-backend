export class DeleteScheduleSlotCommand {
	constructor(
		public readonly scheduleId: string,
		public readonly psychologistId: string, // Untuk verifikasi kepemilikan
	) { }
}