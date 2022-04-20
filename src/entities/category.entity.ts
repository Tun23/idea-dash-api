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
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsEmpty, IsInt, IsDateString } from 'class-validator';
import { UserEntity } from './user.entity';
import { IdeaEntity } from './idea.entity';
import { FileEntity } from './file.entity';

@Entity('categories')
@Index(['id'], { unique: true })
export class CategoryEntity {
  @IsEmpty()
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Column('int', { name: 'creator_id', nullable: false })
  creator_id: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Column('int', { name: 'image_id', nullable: true })
  image_id: number | null;

  @IsOptional()
  @IsString()
  @ApiProperty()
  @Column('text', { name: 'name', nullable: true })
  name: string | null;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false })
  @Column('timestamp', { name: 'lock_date', nullable: true })
  lock_date: Date | null;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false })
  @Column('timestamp', { name: 'close_date', nullable: true })
  close_date: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column('tinyint', { name: 'delete_flag', width: 1, default: 0 })
  delete_flag: number;

  @OneToOne(() => FileEntity, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'image_id' })
  image: FileEntity;

  @ManyToOne((type) => UserEntity, {
    cascade: true,
  })
  @JoinColumn({ name: 'creator_id' })
  creator: UserEntity;

  @OneToMany((type) => IdeaEntity, (idea) => idea.category, { cascade: true })
  ideas: IdeaEntity[];
}
