import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsEmpty, IsInt, IsDateString, IsBoolean } from 'class-validator';
import { UserEntity } from './user.entity';
import { CategoryEntity } from './category.entity';
import { IdeaEntity } from './idea.entity';

@Entity('comments')
@Index(['id'], { unique: true })
export class CommentEntity {
  @IsEmpty()
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Column('int', { name: 'creator_id', nullable: false })
  creator_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Column('int', { name: 'idea_id', nullable: false })
  idea_id: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  @Column('text', { name: 'comment', nullable: true })
  comment: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column('tinyint', { name: 'delete_flag', width: 1, default: 0 })
  delete_flag: number;

  @ManyToOne((type) => IdeaEntity, {
    cascade: true,
  })
  @JoinColumn({ name: 'idea_id' })
  idea: IdeaEntity;

  @ManyToOne((type) => UserEntity, {
    cascade: true,
  })
  @JoinColumn({ name: 'creator_id' })
  creator: UserEntity;
}
