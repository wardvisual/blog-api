import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { APIResponseHelper } from '@/lib/helpers/api-response.helper';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  catch(exception: Error, host: ArgumentsHost): void {
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

    const devErrorResponse: any = {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: exception?.name,
      message: exception['response'].message,
    };

    const prodErrorResponse: any = {
      isSuccess: false,
      statusCode,
      message,
    };

    this.logger.log(
      `\nRequest Method: ${request.method}\nRequestUrl: ${
        request.url
      }\n${JSON.stringify(devErrorResponse)}}\n`,
    );

    response
      .status(statusCode)
      .json(
        process.env.NODE_ENV === 'development'
          ? APIResponseHelper.error(
              statusCode,
              message['response'].message,
              devErrorResponse,
            )
          : APIResponseHelper.error(statusCode, message),
      );
  }
}
