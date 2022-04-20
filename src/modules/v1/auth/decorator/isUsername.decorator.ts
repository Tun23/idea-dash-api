import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import ValidatorJS from 'validator';
@ValidatorConstraint({ name: 'isUsername', async: false })
export class UsernameConstraint implements ValidatorConstraintInterface {
  public validate(value: any) {
    return value && (value === 'admin' || ValidatorJS.isEmail(value));
  }

  public defaultMessage() {
    return `$property must be valid email or 'admin' exactly`;
  }
}

export function IsUsername(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isUsername',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UsernameConstraint,
    });
  };
}
