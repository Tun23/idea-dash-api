import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error = exception.getResponse();

    response.status(status).json({
      code: status,
      error,
      message: this.getExceptionMessage(exception),
    });
  }
  protected getExceptionMessage(exception: HttpException) {
    if (typeof exception.message === 'string') {
      return exception.message;
    }
    return 'Internal Server Error';
  }
}
