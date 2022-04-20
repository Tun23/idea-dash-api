import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common';
import { CatchableApiException } from '../../../shared/exception';

@Injectable()
export class ServersConnectGuard implements CanActivate {
  canActivate(context: ExecutionContext): any {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-header-key'];
    if (token !== process.env.APP_HEADER_KEY) throw new CatchableApiException('Invalid token', HttpStatus.BAD_REQUEST);
    return true;
  }
}
