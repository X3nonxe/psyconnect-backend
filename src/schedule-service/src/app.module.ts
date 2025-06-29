import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './domain/entities/schedule.entity';

import configs from '../../building-blocks/configs/configs';
import { JwtStrategy } from './interface/strategies/jwt.strategy';
import { ScheduleController } from './interface/controllers/schedule.controller';
import { CreateScheduleSlotHandler } from './application/use-cases/create-schedule-slot/create-schedule-slot.handler';
import { IScheduleRepository } from './domain/repositories/ischedule.repository';
import { ScheduleRepository } from './data/repositories/schedule.repository';
import { ScheduleMapper } from './application/mappers/schedule.mapper';
import { postgresOptions } from './data/data-source';
import { GetMySchedulesHandler } from './application/use-cases/get-my-schedules/get-my-schedules.handler';
import { UpdateScheduleSlotHandler } from './application/use-cases/update-schedule-slot/update-schedule-slot.handler';
import { DeleteScheduleSlotHandler } from './application/use-cases/delete-schedule-slot/delete-schedule-slot.handler';
import { GetAvailableSchedulesHandler } from './application/use-cases/get-available-schedules/get-available-schedules.handler';

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    JwtModule.register({ secret: configs.jwt.secret }),
    TypeOrmModule.forRoot(postgresOptions),
    TypeOrmModule.forFeature([Schedule]),
  ],
  controllers: [ScheduleController],
  providers: [
    JwtStrategy,
    CreateScheduleSlotHandler,
    GetMySchedulesHandler,
    UpdateScheduleSlotHandler,
    DeleteScheduleSlotHandler,
    GetAvailableSchedulesHandler,
    ScheduleMapper,
    {
      provide: IScheduleRepository,
      useClass: ScheduleRepository,
    },
  ],
})
export class AppModule { }
