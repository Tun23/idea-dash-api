import { IsNotEmpty, IsString, IsInt, IsOptional, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CommentCreateDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  idea_id: number;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  @IsString()
  comment: string | null;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  is_incognito: number;
}

export class CommentListDTO {
  limit: number;
  page: number;
  ideaId?: number;
  creatorId?: number;
  keyword?: string;
}

export class CommentGetDTO {
  id: number;
}

export class CommentUpdateDTO {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  @IsString()
  comment: string | null;
}
