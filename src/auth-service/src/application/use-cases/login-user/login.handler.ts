import { CommandHandler, ICommandHandler, CommandBus } from '@nestjs/cqrs';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { LoginCommand } from './login.command';
import { IUserRepository } from '../../../domain/repositories/iuser.repository';
import { isPasswordMatch } from '../../../../../building-blocks/utils/encryption';
import { GenerateTokenCommand } from '../generate-token/generate-token.command';
import { AuthResponseDto } from '../../dtos/auth-response.dto';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand, AuthResponseDto> {
	constructor(
		@Inject(IUserRepository) private readonly userRepository: IUserRepository,
		private readonly commandBus: CommandBus,
	) { }

	async execute(command: LoginCommand): Promise<AuthResponseDto> {
		const { email, password } = command;

		const user = await this.userRepository.findUserByEmail(email);
		if (!user) {
			throw new UnauthorizedException('Incorrect email or password.');
		}

		const passwordMatches = await isPasswordMatch(password, user.password);
		if (!passwordMatches) {
			throw new UnauthorizedException('Incorrect email or password.');
		}

		// Jika kredensial valid, panggil command untuk membuat token
		return this.commandBus.execute(
			new GenerateTokenCommand({
				userId: user.id,
				email: user.email,
				role: user.role
			}),
		);
	}
}