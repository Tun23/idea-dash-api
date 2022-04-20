import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { AuthenticationException } from 'src/shared/exception';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      return false;
    }

    request.user = this.validationToken(request.headers.authorization);
    return true;
  }

  private validationToken(bearerStr: string) {
    const bearerArr = bearerStr.split(' ');
    if (bearerArr[0] !== 'Bearer') {
      throw new AuthenticationException('Invalid token');
    }
    try {
      return jwt.verify(bearerArr[1], process.env.APP_KEY);
    } catch (err) {
      throw new AuthenticationException(`Token error: ${err.message || err.name}`);
    }
  }
}
