import { Role } from "src/domain/enums/role.enum";

export class GenerateTokenCommand {
  public readonly userId: string;
  public readonly email: string;
  public readonly role: Role;

  // --- UBAH CONSTRUCTOR MENJADI SEPERTI INI ---
  constructor(partial: Partial<GenerateTokenCommand>) {
    Object.assign(this, partial);
  }
}