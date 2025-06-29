export class RegisterUserCommand {
  constructor(
    public readonly email: string,
    public readonly full_name: string,
    public readonly password: string,
  ) {}
}
