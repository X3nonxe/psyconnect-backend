export class CreateScheduleSlotCommand {
	constructor(
		public readonly psychologistId: string,
		public readonly startTime: Date,
		public readonly endTime: Date,
	) { }
}