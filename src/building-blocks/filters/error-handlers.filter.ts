/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { ProblemDocument } from 'http-problem-details';
import { ValidationError } from 'joi';
import ApplicationException from '../types/exeptions/application.exception';
import { serializeObject } from '../utils/serilization';
import configs from '../configs/configs';

@Catch()
export class ErrorHandlersFilter implements ExceptionFilter {
  public catch(err: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let title: string;
    const type = err.constructor.name;

    switch (err.constructor) {
      case BadRequestException:
        status = err.getStatus();
        const errorResponse = err.getResponse();
        title = err.message;
        if (typeof errorResponse === 'object' && errorResponse && 'message' in errorResponse) {
          const messages = errorResponse['message'];
          title = Array.isArray(messages) ? messages.join(', ') : messages;
        }
        break;

      case ApplicationException:
      case NotFoundException:
      case ConflictException:
      case UnauthorizedException:
      case ForbiddenException:
      case HttpException:
        status = err.getStatus();
        title = err.message;
        break;

      case ValidationError:
        status = HttpStatus.BAD_REQUEST;
        title = err.message;
        break;

      default:
        status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
        title = err.message || 'Internal Server Error';
        break;
    }

    const problem = new ProblemDocument({
      type: type,
      title: title,
      status: status,
      ...(configs.env === 'development' && { detail: err.stack }),
    });

    Logger.error(serializeObject(problem));

    response.status(status).json(problem);
  }
}
