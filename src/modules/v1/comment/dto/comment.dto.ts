import { IsNotEmpty, IsString, IsInt } from 'class-validator';
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
