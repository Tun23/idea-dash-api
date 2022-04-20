import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsNumberString,
  ValidateIf,
  IsEmail,
  MaxLength,
  MinLength,
  IsInt,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserCreateDTO {
  @ValidateIf((q) => q.image_id && q.image_id.trim() !== '')
  @IsNumberString()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image_id: string | object | null;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  user_name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @MinLength(5)
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @MinLength(5)
  @ApiProperty()
  password_confirm: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumberString()
  department_id: number;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ required: false })
  role: number | 3;
}

export class UserListDTO {
  limit: number;
  page: number;
  keyword?: string;
}

export class UserGetDTO {
  id: number;
}

export class UserUpdateDTO {
  @ValidateIf((q) => q.image_id && q.image_id.trim() !== '')
  @IsNumberString()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image_id: string | object | null;

  @IsOptional()
  @IsString()
  @ApiProperty()
  user_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @MinLength(5)
  @ApiProperty()
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @MinLength(5)
  @ApiProperty()
  password_confirm: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsNumberString()
  department_id: number;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ required: false })
  role: number;
}
