import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { configService } from '@/lib/services/env.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal Server Error';

    const prodErrorResponse: any = {
      isSuccess: false,
      statusCode,
      message,
    };

    const devErrorResponse: any = {
      ...prodErrorResponse,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: exception?.name,
    };

    this.logger.log(
      `\nRequest Method: ${request.method}\nRequestUrl: ${
        request.url
      }\n${JSON.stringify(devErrorResponse)}}\n`,
    );

    response
      .status(statusCode)
      .json(
        configService.get('NODE_ENV') === 'development'
          ? devErrorResponse
          : prodErrorResponse,
      );
  }
}
