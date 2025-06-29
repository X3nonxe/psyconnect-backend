import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject, ConflictException } from '@nestjs/common';
import { CreateUserByAdminCommand } from './create-user-by-admin.command';
import { IUserRepository } from '../../../domain/repositories/iuser.repository';
import { User } from '../../../domain/entities/user.entity';
import { encryptPassword } from '../../../../../building-blocks/utils/encryption';
import { UserCreatedEvent } from '../../../domain/events/user-created.event';
import { UserDto } from '../../dtos/user.dto';
import { UserMapper } from '../../mappers/user.mapper';
import { Role } from '../../../domain/enums/role.enum';

@CommandHandler(CreateUserByAdminCommand)
export class CreateUserByAdminHandler implements ICommandHandler<CreateUserByAdminCommand, UserDto> {
	constructor(
		@Inject(IUserRepository) private readonly userRepository: IUserRepository,
		private readonly eventBus: EventBus,
		private readonly userMapper: UserMapper,
	) { }

	async execute(command: CreateUserByAdminCommand): Promise<UserDto> {
		const { email, full_name, password, role, ...psychologistData } = command;

		if (await this.userRepository.findUserByEmail(email)) {
			throw new ConflictException('Email already registered.');
		}

		const newUser = new User({
			email,
			full_name,
			password: await encryptPassword(password),
			role,
			...(role === Role.PSYCHOLOGIST && psychologistData),
		});

		const savedUser = await this.userRepository.createUser(newUser);

		this.eventBus.publish(
			new UserCreatedEvent({
				userId: savedUser.id,
				email: savedUser.email,
				name: savedUser.full_name,
				role: savedUser.role,
			}),
		);

		return this.userMapper.toDto(savedUser);
	}
}