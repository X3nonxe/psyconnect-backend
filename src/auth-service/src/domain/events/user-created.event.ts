import { IEvent } from '@nestjs/cqrs';
import { Role } from '../enums/role.enum';

export class UserCreatedEvent implements IEvent {
  public readonly userId: string;
  public readonly email: string;
  public readonly name: string;
  public readonly role: Role;

  // --- UBAH CONSTRUCTOR MENJADI SEPERTI INI ---
  constructor(partial: Partial<UserCreatedEvent>) {
    Object.assign(this, partial);
  }
}