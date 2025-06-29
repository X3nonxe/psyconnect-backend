// import { Module } from '@nestjs/common';
// import { CqrsModule } from '@nestjs/cqrs';
// import { TypeOrmModule } from '@nestjs/typeorm';
// // import { RabbitmqModule } from '../../../building-blocks/rabbitmq/rabbitmq.module';
// import { AuthController } from 'src/interface/controllers/auth.controller';
// import { RegisterUserHandler } from './use-cases/register-user/register-user.handler';
// import { IUserRepository } from 'src/domain/repositories/iuser.repository';
// import { UserRepository } from 'src/data/repositories/user.repository';
// import { User } from 'src/domain/entities/user.entity';
// import { UserMapper } from './mappers/user.mapper';
// import { GenerateTokenHandler } from './use-cases/generate-token/generate-token.handler';
// import { JwtStrategy } from 'src/interface/strategies/jwt.strategy';
// import { LoginHandler } from './use-cases/login-user/login.handler';
// import { IAuthRepository } from 'src/domain/repositories/iauth.repository';
// import { AuthRepository } from 'src/data/repositories/auth.repository';
// import { JwtModule } from '@nestjs/jwt';
// import configs from '../../../building-blocks/configs/configs';

// @Module({
//   imports: [
//     CqrsModule,
//     // RabbitmqModule.forRoot(),
//     TypeOrmModule.forFeature([User]),
//     JwtModule.register({
//       secret: configs.jwt.secret,
//       signOptions: { expiresIn: configs.jwt.refreshExpirationDays },
//     }),
//   ],
//   controllers: [AuthController],
//   providers: [
//     // Use Cases
//     RegisterUserHandler,
//     LoginHandler,
//     GenerateTokenHandler,

//     // Mappers
//     UserMapper,

//     // Strategies
//     JwtStrategy,
//     // Repositories
//     {
//       provide: IUserRepository,
//       useClass: UserRepository,
//     },
//     { 
//       provide: IAuthRepository, 
//       useClass: AuthRepository 
//     }
//   ],
//   exports: [],
// })
// export class AuthModule { }
