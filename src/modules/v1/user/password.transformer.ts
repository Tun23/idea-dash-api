import * as crypto from 'crypto'
import { ValueTransformer } from 'typeorm/decorator/options/ValueTransformer'

export class PasswordTransformer implements ValueTransformer {
  to(value: any) {
    return crypto.createHmac('sha256', value + process.env.APP_KEY).digest('hex')
  }

  from(value: any) {
    return value
  }
}
