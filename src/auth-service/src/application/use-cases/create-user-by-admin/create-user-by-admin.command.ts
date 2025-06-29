import { Role } from "../../../domain/enums/role.enum";
import { EducationDetail } from "src/domain/entities/user.entity";

export class CreateUserByAdminCommand {
	constructor(
		public readonly email: string,
		public readonly full_name: string, // Diperbarui
		public readonly password: string,
		public readonly role: Role,
		// Field opsional
		public readonly specializations?: string[],
		public readonly license_number?: string,
		public readonly description?: string,
		public readonly education?: EducationDetail[],
		public readonly consultation_fee?: number,
	) { }
}