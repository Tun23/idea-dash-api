import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUsername } from '../decorator/isUsername.decorator';

export class AuthDTO {
  @IsOptional()
  @IsUsername()
  @MaxLength(255)
  @ApiProperty()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @MinLength(5)
  @ApiProperty()
  password: string;
}

export class SignUpDTO {
  @IsNotEmpty()
  @IsUsername()
  @MaxLength(255)
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty()
  user_name: string | null;

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
}
