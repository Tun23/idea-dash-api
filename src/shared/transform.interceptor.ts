import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

export class ApiResponse {
  data?: any;
  message?: string = 'success';

  static create(data, message: string = null) {
    const apiResponse = new ApiResponse();
    apiResponse.data = data;
    if (message) {
      apiResponse.message = message;
    }
    return apiResponse;
  }
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const status = context.switchToHttp().getResponse().statusCode;
    return next.handle().pipe(
      map((data) => {
        if (data instanceof ApiResponse) {
          return data as Response<T>;
        }
        let message = '';
        if (data && data.message != '') {
          message = data.message;
          delete data.message;
        }
        return {
          success: true,
          code: status,
          message,
          data,
        };
      }),
    );
  }
}
