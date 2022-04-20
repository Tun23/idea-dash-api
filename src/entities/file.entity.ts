import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsEmpty, IsInt } from 'class-validator';
import { UserEntity } from './user.entity';
import { IdeaEntity } from './idea.entity';

@Entity('files')
@Index(['id'], { unique: true })
export class FileEntity {
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

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty()
  @Column('varchar', { name: 'name', nullable: false, length: 255 })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  @Column('text', { name: 'source_url', nullable: false })
  source_url: string;

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
