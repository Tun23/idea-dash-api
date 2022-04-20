import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException(this.formatErrors(errors));
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: any[]) {
    return {
      type: 'Validation failed',
      contents: errors.map((err) => {
        delete err.target;
        delete err.value;
        err.children = err.children.map((child) => {
          delete child.target;
          delete child.value;
          child.children = child.children.map((p) => {
            delete p.target;
            delete p.value;
            return p;
          });
          return child;
        });
        return err;
      }),
    };
  }
}
