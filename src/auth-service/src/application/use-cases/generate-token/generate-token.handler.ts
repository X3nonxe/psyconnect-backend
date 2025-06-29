import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import { GenerateTokenCommand } from './generate-token.command';
import { IAuthRepository } from '../../../domain/repositories/iauth.repository';
import { AuthResponseDto } from '../../dtos/auth-response.dto';
import configs from '../../../../../building-blocks/configs/configs';

@CommandHandler(GenerateTokenCommand)
export class GenerateTokenHandler implements ICommandHandler<GenerateTokenCommand, AuthResponseDto> {
	constructor(
		private readonly jwtService: JwtService,
		@Inject(IAuthRepository) private readonly authRepository: IAuthRepository,
	) {}

	async execute(command: GenerateTokenCommand): Promise<AuthResponseDto> {
		const { userId, email, role } = command;

		const payload = { sub: userId, email, role };
		
		const accessTokenExpiresIn = parseInt(configs.jwt.accessExpirationMinutes) * 60;
		const refreshTokenExpiresIn = parseInt(configs.jwt.refreshExpirationDays) * 24 * 60 * 60;

		const accessToken = this.jwtService.sign(payload, {
				secret: configs.jwt.secret,
				expiresIn: accessTokenExpiresIn
		});
		
		const refreshToken = this.jwtService.sign(payload, {
				secret: configs.jwt.secret,
				expiresIn: refreshTokenExpiresIn
		});

		return {
			accessToken: {
				token: accessToken,
				expiresIn: accessTokenExpiresIn,
			},
			refreshToken: {
				token: refreshToken,
				expiresIn: refreshTokenExpiresIn,
			}
		};
	}
}
