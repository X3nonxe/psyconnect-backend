// auth-service/src/app.module.ts
import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { postgresOptions } from './data/data-source';
import configs from '../../building-blocks/configs/configs';

// Entities
import { User } from './domain/entities/user.entity';
import { Token } from './domain/entities/token.entity';

// Repositories
import { IUserRepository } from './domain/repositories/iuser.repository';
import { UserRepository } from './data/repositories/user.repository';
import { IAuthRepository } from './domain/repositories/iauth.repository';
import { AuthRepository } from './data/repositories/auth.repository';

// Use Cases
import { RegisterUserHandler } from './application/use-cases/register-user/register-user.handler';
import { LoginHandler } from './application/use-cases/login-user/login.handler';
import { GenerateTokenHandler } from './application/use-cases/generate-token/generate-token.handler';

// Mappers & Strategies
import { UserMapper } from './application/mappers/user.mapper';
import { JwtStrategy } from './interface/strategies/jwt.strategy';

// Controllers
import { AuthController } from './interface/controllers/auth.controller';

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    JwtModule.register({
      secret: configs.jwt.secret,
    }),
    TypeOrmModule.forRoot(postgresOptions),
    TypeOrmModule.forFeature([User, Token]),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 menit dalam milidetik
      limit: 20,  // Batasi setiap IP ke 20 request per menit
    }]),
  ],
  controllers: [AuthController],
  providers: [
    // Use Cases
    RegisterUserHandler,
    LoginHandler,
    GenerateTokenHandler,

    // Mappers
    UserMapper,

    // Strategies
    JwtStrategy,

    // Repositories
    { provide: IUserRepository, useClass: UserRepository },
    { provide: IAuthRepository, useClass: AuthRepository },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }