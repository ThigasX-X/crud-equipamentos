import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

type PostgresDriverError = QueryFailedError & { code: string };

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Erro interno do servidor';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'object' && 'message' in res) {
        message = (res as { message: string | string[]; error?: string }).message;
        error = (res as { error?: string }).error ?? exception.name;
      } else {
        message = res as string;
        error = exception.name;
      }
      if (status >= 500) {
        this.logger.error(exception.message, exception.stack);
      }
    } else if (exception instanceof QueryFailedError) {
      const pgError = exception as PostgresDriverError;
      status = HttpStatus.BAD_REQUEST;
      error = 'Database Error';
      if (pgError.code === '23505') {
        status = HttpStatus.CONFLICT;
        message = 'Registro duplicado — este dado já existe';
      } else {
        message = 'Erro na operação com o banco de dados';
        this.logger.error(exception.message, exception.stack);
      }
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    }

    response.status(status).json({
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
