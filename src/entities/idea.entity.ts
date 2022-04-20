import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
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
import { CommentEntity } from './comment.entity';
import { FileEntity } from './file.entity';

@Entity('ideas')
@Index(['id'], { unique: true })
export class IdeaEntity {
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
  @Column('int', { name: 'category_id', nullable: false })
  category_id: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Column('int', { name: 'image_id', nullable: true })
  image_id: number | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Column('int', { name: 'document_id', nullable: true })
  document_id: number | null;

  @IsOptional()
  @IsString()
  @ApiProperty()
  @Column('text', { name: 'title', nullable: true })
  title: string | null;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  @Column('tinyint', { name: 'is_incognito', width: 1, default: 0 })
  is_incognito: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column('tinyint', { name: 'delete_flag', width: 1, default: 0 })
  delete_flag: number;

  @ManyToOne((type) => CategoryEntity)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @ManyToOne((type) => UserEntity, {
    cascade: true,
  })
  @JoinColumn({ name: 'creator_id' })
  author: UserEntity;

  @ManyToMany((type) => UserEntity, { cascade: true })
  @JoinTable({
    name: 'upvotes',
    joinColumn: {
      name: 'idea_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  upVotes: UserEntity[];

  @ManyToMany((type) => UserEntity, { cascade: true })
  @JoinTable({
    name: 'downvotes',
    joinColumn: {
      name: 'idea_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  downVotes: UserEntity[];

  @OneToMany((type) => CommentEntity, (comment) => comment.idea)
  comments: CommentEntity[];

  @OneToOne(() => FileEntity, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'image_id' })
  image: FileEntity;

  @OneToOne(() => FileEntity, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'document_id' })
  document: FileEntity;
}
