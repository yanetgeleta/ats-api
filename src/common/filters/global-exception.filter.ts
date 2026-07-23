import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import path from 'path';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  // we are using unknown because we want to evaluate the type before implementing anything
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();

      if (typeof responseBody === 'object' && responseBody !== null) {
        message = (responseBody as any).message || JSON.stringify(responseBody);
      } else {
        message = exception.message;
      }
    } else {
      console.error('Unhandled System Excpetion:', exception);
    }

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      });
  }
}
