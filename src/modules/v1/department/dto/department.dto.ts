import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DepartmentCreateDTO {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}

export class DepartmentListDTO {
  limit: number;
  page: number;
  keyword?: string;
}

export class DepartmentGetDTO {
  id: number;
}

export class DepartmentUpdateDTO {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
