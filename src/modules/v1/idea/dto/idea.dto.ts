import { IsNotEmpty, IsInt, IsString, IsOptional, ValidateIf, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IdeaCreateDTO {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumberString()
  category_id: number;

  @ValidateIf((q) => q.image_id && q.image_id.trim() !== '')
  @IsNumberString()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image_id: string | object | null;

  @ValidateIf((q) => q.document_id && q.document_id.trim() !== '')
  @IsNumberString()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  document_id: string | object | null;

  @IsOptional()
  @IsString()
  @ApiProperty()
  title: string | null;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  description: string | null;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ required: false })
  is_incognito: number;
}

export class IdeaListDTO {
  limit: number;
  page: number;
  categoryId?: number;
  rand?: boolean;
  keyword?: string;
}

export class IdeaGetDTO {
  id: number;
}

export class IdeaUpdateDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  title: string | null;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  description: string | null;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  is_incognito: number;
}
