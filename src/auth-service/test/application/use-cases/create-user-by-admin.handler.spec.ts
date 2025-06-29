import 'reflect-metadata';
import * as TypeMoq from 'typemoq';
import { ConflictException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { EventBus } from '@nestjs/cqrs';
import { CreateUserByAdminHandler } from '../../../src/application/use-cases/create-user-by-admin/create-user-by-admin.handler';
import { CreateUserByAdminCommand } from '../../../src/application/use-cases/create-user-by-admin/create-user-by-admin.command';
import { IUserRepository } from '../../../src/domain/repositories/iuser.repository';
import { User, EducationDetail } from '../../../src/domain/entities/user.entity';
import { UserMapper } from '../../../src/application/mappers/user.mapper';
import { Role } from '../../../src/domain/enums/role.enum';
import { UserCreatedEvent } from '../../../src/domain/events/user-created.event';

describe('CreateUserByAdminHandler Unit Tests', () => {
	let handler: CreateUserByAdminHandler;
	const mockUserRepository: TypeMoq.IMock<IUserRepository> = TypeMoq.Mock.ofType<IUserRepository>();
	const mockEventBus: TypeMoq.IMock<EventBus> = TypeMoq.Mock.ofType<EventBus>();
	// Mapper bisa menggunakan instance nyata karena tidak memiliki dependensi eksternal
	const userMapper = new UserMapper();
	const fakeUserId = uuidv4();

	beforeEach(() => {
		handler = new CreateUserByAdminHandler(mockUserRepository.object, mockEventBus.object, userMapper);
	});

	afterEach(() => {
		mockUserRepository.reset();
		mockEventBus.reset();
	});

	// Skenario 1: Berhasil membuat Psikolog
	it('should create a new psychologist successfully with all profile fields', async () => {
		// Arrange
		const educationDetails: EducationDetail[] = [{ degree: 'S1 Psikologi', university: 'Universitas Indonesia' }];
		const command = new CreateUserByAdminCommand(
			'psikolog@mail.com',
			'Dr. Psikolog',
			'Password123',
			Role.PSYCHOLOGIST,
			['kecemasan'],
			'SIP-12345',
			'Deskripsi psikolog',
			educationDetails,
			250000,
		);

		const fakePsychologist = new User({
			id: fakeUserId,
			...command
		});

		mockUserRepository.setup((x) => x.findUserByEmail(command.email)).returns(async () => null);
		mockUserRepository.setup((x) => x.createUser(TypeMoq.It.isAnyObject(User))).returns(async () => fakePsychologist);
		mockEventBus.setup((x) => x.publish(TypeMoq.It.is((event) => event instanceof UserCreatedEvent))).verifiable(TypeMoq.Times.once());

		// Act
		const result = await handler.execute(command);

		// Assert
		expect(result.id).toBe(fakePsychologist.id);
		expect(result.role).toBe(Role.PSYCHOLOGIST);
		expect(result.specializations).toEqual(command.specializations);
		expect(result.consultation_fee).toBe(command.consultation_fee);
		mockUserRepository.verify((x) => x.createUser(TypeMoq.It.is<User>(u => u.role === Role.PSYCHOLOGIST)), TypeMoq.Times.once());
		mockEventBus.verifyAll();
	});

	// Skenario 2: Berhasil membuat Klien
	it('should create a new client successfully', async () => {
		// Arrange
		const command = new CreateUserByAdminCommand('client@mail.com', 'User Klien', 'Password123', Role.CLIENT);

		const fakeClient = new User({
			id: fakeUserId,
			email: command.email,
			full_name: command.full_name,
			role: command.role,
			password: 'hashedpassword',
		});

		mockUserRepository.setup((x) => x.findUserByEmail(command.email)).returns(async () => null);
		mockUserRepository.setup((x) => x.createUser(TypeMoq.It.isAnyObject(User))).returns(async () => fakeClient);
		mockEventBus.setup((x) => x.publish(TypeMoq.It.is((e) => e instanceof UserCreatedEvent))).verifiable(TypeMoq.Times.once());

		// Act
		const result = await handler.execute(command);

		// Assert
		expect(result.id).toBe(fakeClient.id);
		expect(result.role).toBe(Role.CLIENT);
		// Pastikan field spesifik psikolog tidak ada (null)
		expect(result.license_number).toBeUndefined();
		expect(result.specializations).toBeUndefined();
		mockUserRepository.verify((x) => x.createUser(TypeMoq.It.is<User>(u => u.role === Role.CLIENT)), TypeMoq.Times.once());
		mockEventBus.verifyAll();
	});

	// Skenario 3: Gagal karena email sudah ada
	it('should throw ConflictException if email is already registered', async () => {
		// Arrange
		const command = new CreateUserByAdminCommand('exists@mail.com', 'Existing User', 'Password123', Role.CLIENT);
		const existingUser = new User({ id: fakeUserId, email: command.email });
		mockUserRepository.setup((x) => x.findUserByEmail(command.email)).returns(async () => existingUser);

		// Act & Assert
		await expect(handler.execute(command)).rejects.toThrow(ConflictException);
		mockUserRepository.verify((x) => x.createUser(TypeMoq.It.isAny()), TypeMoq.Times.never());
		mockEventBus.verify((x) => x.publish(TypeMoq.It.isAny()), TypeMoq.Times.never());
	});
});