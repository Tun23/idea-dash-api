import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CatchableApiException } from './exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    let exceptionMessage = exception.getResponse();
    let status;
    let errMessage;
    try {
      status = exception.getStatus();
      errMessage = exception.message || exception.name || 'Bad Request';
    } catch (e) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errMessage = 'Server error';
    }

    const errorResponse = {
      success: false,
      code: status,
      error: errMessage,
      message: exceptionMessage || exception.message || null,
    };

    Logger.error(`${request.method} ${request.url}`, JSON.stringify(errorResponse), 'ExceptionFilter');
    status = exception instanceof CatchableApiException ? exception.getStatus() : HttpStatus.OK;
    response.status(status).json(errorResponse);
  }
}
