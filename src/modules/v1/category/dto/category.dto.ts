import { IsNotEmpty, IsString, IsOptional, IsDateString, IsNumberString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryCreateDTO {
  @ValidateIf((q) => q.image_id && q.image_id.trim() !== '')
  @IsNumberString()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image_id: string | object | null;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  description: string | null;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  lock_date: Date;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  close_date: Date;
}

export class CategoryListDTO {
  limit: number;
  page: number;
  keyword?: string;
}

export class CategoryGetDTO {
  id: number;
}

export class CategoryUpdateDTO {
  @ValidateIf((q) => q.image_id && q.image_id.trim() !== '')
  @IsNumberString()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image_id: string | object | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  name: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  description: string | null;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false })
  lock_date: Date | null;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false })
  close_date: Date | null;
}
