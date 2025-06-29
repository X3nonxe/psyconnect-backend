import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterUserCommand } from '../../application/use-cases/register-user/register-user.command';
import { RegisterUserRequestDto } from '../../application/dtos/register-user-request.dto';
import { UserDto } from '../../application/dtos/user.dto';
import { AuthResponseDto } from '../../../src/application/dtos/auth-response.dto';
import { LoginCommand } from '../../../src/application/use-cases/login-user/login.command';
import { AuthGuard } from '@nestjs/passport';
import { LoginRequestDto } from '../../../src/application/dtos/login-user-reques';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../../../src/domain/enums/role.enum';
import { RolesGuard } from '../guards/roles.guard';
import { CreateUserByAdminRequestDto } from '../../../src/application/dtos/create-user-by-admin-request.dto';
import { CreateUserByAdminCommand } from '../../../src/application/use-cases/create-user-by-admin/create-user-by-admin.command';
import { IpWhitelistGuard } from '../guards/ip-whitelist.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered.',
    type: UserDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already registered.',
  })
  async register(@Body() dto: RegisterUserRequestDto): Promise<UserDto> {
    const command = new RegisterUserCommand(dto.email, dto.full_name, dto.password);
    return this.commandBus.execute(command);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful.', type: AuthResponseDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Incorrect email or password.' })
  async login(@Body() dto: LoginRequestDto): Promise<AuthResponseDto> {
    const command = new LoginCommand(dto.email, dto.password);
    return this.commandBus.execute(command);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: "Returns current user's profile." })
  getProfile(@Req() req) {
    return req.user;
  }

  @Post('psycholog-register')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard, IpWhitelistGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'User created by admin successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  createUserByAdmin(@Body() dto: CreateUserByAdminRequestDto) {
    const command = new CreateUserByAdminCommand(
      dto.email,
      dto.full_name,
      dto.password,
      dto.role,
      dto.specializations,
    );
    return this.commandBus.execute(command);
  }
}
