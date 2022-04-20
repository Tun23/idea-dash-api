import { HttpException, HttpStatus } from '@nestjs/common'

export class CatchableApiException extends HttpException {}

export class AuthenticationException extends CatchableApiException {
  constructor(message = 'Forbidden', status = HttpStatus.FORBIDDEN) {
    super(message, status)
  }
}

export class MigrationException extends CatchableApiException {
  constructor(message = 'Internal Server Error', status = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(message, status)
  }
}

export class IndeedEntryException extends CatchableApiException {
  constructor(message = 'Internal Error Exception', status = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(message, status)
  }
}
