import 'reflect-metadata';
import * as TypeMoq from 'typemoq';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import * as dotenv from 'dotenv';
import { RegisterUserHandler } from '../src/application/use-cases/register-user/register-user.handler';
import { IUserRepository } from '../src/domain/repositories/iuser.repository';
import { UserMapper } from '../src/application/mappers/user.mapper';
import { User } from '../src/domain/entities/user.entity';
import { RegisterUserCommand } from '../src/application/use-cases/register-user/register-user.command';
import { UserCreatedEvent } from '../src/domain/events/user-created.event';

dotenv.config({ path: '.env.development' });

describe('RegisterUserHandler Unit Tests', () => {
	let handler: RegisterUserHandler;
	const mockUserRepository: TypeMoq.IMock<IUserRepository> = TypeMoq.Mock.ofType<IUserRepository>();
	const mockEventBus: TypeMoq.IMock<EventBus> = TypeMoq.Mock.ofType<EventBus>();
	const userMapper = new UserMapper();

	const fakeUserId = uuidv4();
	const fakeUser = new User({ id: fakeUserId, full_name: 'John Doe', email: 'john@doe.com' });

	beforeEach(() => {
		handler = new RegisterUserHandler(mockUserRepository.object, mockEventBus.object, userMapper);
	});

	afterEach(() => {
		mockUserRepository.reset();
		mockEventBus.reset();
	});

	it('should register a new user successfully', async () => {
		const command = new RegisterUserCommand('john@doe.com', 'John Doe', 'Password123');
		mockUserRepository.setup((x) => x.findUserByEmail(command.email)).returns(async () => null);
		mockUserRepository.setup((x) => x.createUser(TypeMoq.It.isAnyObject(User))).returns(async () => fakeUser);

		mockEventBus
			.setup((x) => x.publish(TypeMoq.It.is((event) => event instanceof UserCreatedEvent)))
			.verifiable(TypeMoq.Times.once());

		const result = await handler.execute(command);

		expect(result.id).toBe(fakeUser.id);
		expect(result.email).toBe(fakeUser.email);
		mockUserRepository.verify((x) => x.createUser(TypeMoq.It.isAny()), TypeMoq.Times.once());
		mockEventBus.verifyAll();
	});

	it('should throw ConflictException if email is already registered', async () => {
		const command = new RegisterUserCommand('john@doe.com', 'John Doe', 'Password123');
		mockUserRepository.setup((x) => x.findUserByEmail(command.email)).returns(async () => fakeUser);

		await expect(handler.execute(command)).rejects.toThrow(ConflictException);
		mockUserRepository.verify((x) => x.createUser(TypeMoq.It.isAny()), TypeMoq.Times.never());
		mockEventBus.verify((x) => x.publish(TypeMoq.It.isAny()), TypeMoq.Times.never());
	});

	it('should throw BadRequestException for an invalid email', async () => {
		// Arrange
		const command = new RegisterUserCommand('invalid-email', 'John Doe', 'ValidPassword123');

		// Act & Assert
		await expect(handler.execute(command)).rejects.toThrow(BadRequestException);
		await expect(handler.execute(command)).rejects.toThrow('"email" must be a valid email');
	});

	it('should throw BadRequestException for a password that is too short', async () => {
		// Arrange
		const command = new RegisterUserCommand('john@doe.com', 'John Doe', '1234');

		// Act & Assert
		// Pesan error ini datang dari custom validator di building-blocks
		await expect(handler.execute(command)).rejects.toThrow(BadRequestException);
		await expect(handler.execute(command)).rejects.toThrow('password must be at least 8 characters');
	});

	it('should throw BadRequestException for a password without a number', async () => {
		// Arrange
		const command = new RegisterUserCommand('john@doe.com', 'John Doe', 'PasswordOnly');

		// Act & Assert
		await expect(handler.execute(command)).rejects.toThrow(BadRequestException);
		await expect(handler.execute(command)).rejects.toThrow('password must contain at least 1 letter and 1 number');
	});

	it('should throw BadRequestException for an empty full_name', async () => {
		// Arrange
		const command = new RegisterUserCommand('john@doe.com', '', 'Password123');

		// Act & Assert
		await expect(handler.execute(command)).rejects.toThrow(BadRequestException);
		await expect(handler.execute(command)).rejects.toThrow('"full_name" is not allowed to be empty');
	});
});
