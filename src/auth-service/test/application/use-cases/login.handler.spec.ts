import 'reflect-metadata';
import * as TypeMoq from 'typemoq';
import { UnauthorizedException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { IUserRepository } from 'src/domain/repositories/iuser.repository';
import { User } from '../../../src/domain/entities/user.entity';
import { GenerateTokenCommand } from '../../../src/application/use-cases/generate-token/generate-token.command';
import { v4 as uuidv4 } from 'uuid';
import { LoginHandler } from '../../../src/application/use-cases/login-user/login.handler';
import { isPasswordMatch } from '../../../../building-blocks/utils/encryption';
import { LoginCommand } from '../../../src/application/use-cases/login-user/login.command';

// Mocking the external utility function
jest.mock('../../../../building-blocks/utils/encryption', () => ({
	isPasswordMatch: jest.fn(),
}));

describe('LoginHandler Unit Tests', () => {
	let handler: LoginHandler;
	const mockUserRepository: TypeMoq.IMock<IUserRepository> = TypeMoq.Mock.ofType<IUserRepository>();
	const mockCommandBus: TypeMoq.IMock<CommandBus> = TypeMoq.Mock.ofType<CommandBus>();

	const userId = uuidv4();
	const userEmail = 'test@user.com';
	const userPassword = 'hashedPassword';
	const fakeUser = new User({ id: userId, email: userEmail, password: userPassword });

	beforeEach(() => {
		handler = new LoginHandler(mockUserRepository.object, mockCommandBus.object);
	});

	afterEach(() => {
		mockUserRepository.reset();
		mockCommandBus.reset();
		(isPasswordMatch as jest.Mock).mockClear();
	});

	it('should successfully log in and return tokens', async () => {
		// Arrange
		const command = new LoginCommand(userEmail, 'plainPassword123');
		const fakeTokens = { accessToken: { token: 'abc' }, refreshToken: { token: 'xyz' } };

		mockUserRepository.setup((x) => x.findUserByEmail(command.email)).returns(async () => fakeUser);
		(isPasswordMatch as jest.Mock).mockResolvedValue(true);
		mockCommandBus.setup((x) => x.execute(TypeMoq.It.is<GenerateTokenCommand>(c => c instanceof GenerateTokenCommand))).returns(async () => fakeTokens);

		// Act
		const result = await handler.execute(command);

		// Assert
		expect(result).toEqual(fakeTokens);
		expect(isPasswordMatch).toHaveBeenCalledWith(command.password, userPassword);
		mockCommandBus.verify((x) => x.execute(TypeMoq.It.is<GenerateTokenCommand>(c => c instanceof GenerateTokenCommand)), TypeMoq.Times.once());
	});

	it('should throw UnauthorizedException if user is not found', async () => {
		// Arrange
		const command = new LoginCommand(userEmail, 'plainPassword123');
		mockUserRepository.setup((x) => x.findUserByEmail(command.email)).returns(async () => null);

		// Act & Assert
		await expect(handler.execute(command)).rejects.toThrow(UnauthorizedException);
	});

	it('should throw UnauthorizedException if password does not match', async () => {
		// Arrange
		const command = new LoginCommand(userEmail, 'wrongPassword');
		mockUserRepository.setup((x) => x.findUserByEmail(command.email)).returns(async () => fakeUser);
		(isPasswordMatch as jest.Mock).mockResolvedValue(false);

		// Act & Assert
		await expect(handler.execute(command)).rejects.toThrow(UnauthorizedException);
		expect(isPasswordMatch).toHaveBeenCalledWith(command.password, userPassword);
	});
});