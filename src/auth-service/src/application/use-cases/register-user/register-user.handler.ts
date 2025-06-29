import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject, ConflictException, BadRequestException } from '@nestjs/common';
import { RegisterUserCommand } from './register-user.command';
import { IUserRepository } from '../../../domain/repositories/iuser.repository';
import { User } from '../../../domain/entities/user.entity';
import { encryptPassword } from '../../../../../building-blocks/utils/encryption';
import { password } from '../../../../../building-blocks/utils/validation';
import { UserCreatedEvent } from '../../../domain/events/user-created.event';
import { UserDto } from '../../dtos/user.dto';
import { Role } from '../../../domain/enums/role.enum';
import { UserMapper } from '../../../application/mappers/user.mapper';
import * as Joi from 'joi';

const registerUserCommandSchema = Joi.object({
  email: Joi.string().email().required(),
  full_name: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(8).custom(password).required(),
}).required();

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand, UserDto> {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    private readonly eventBus: EventBus,
    private readonly userMapper: UserMapper,
  ) { }

  async execute(command: RegisterUserCommand): Promise<UserDto> {
    try {
      await registerUserCommandSchema.validateAsync(command, { abortEarly: false });
    } catch (error) {
      // Joi akan melempar error dengan detail, kita bisa melemparnya kembali sebagai BadRequestException
      throw new BadRequestException(error.message);
    }
    const { email, full_name, password } = command;

    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already registered.');
    }

    const passwordHash = await encryptPassword(password);

    const newUser = new User({
      email,
      full_name,
      password: passwordHash,
      role: Role.CLIENT, // Default role
    });

    const savedUser = await this.userRepository.createUser(newUser);

    // Publish event for other services
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
