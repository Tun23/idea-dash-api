import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  OneToOne,
  AfterLoad,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsEmpty, IsInt } from 'class-validator';
import { UserEntity } from './user.entity';
import { IdeaEntity } from './idea.entity';
import { CategoryEntity } from './category.entity';

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

  @OneToOne(() => UserEntity, (item) => item.image, { cascade: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  user_image: UserEntity;

  @OneToOne(() => CategoryEntity, (item) => item.image, { cascade: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  category_image: CategoryEntity;

  @OneToOne(() => IdeaEntity, (idea) => idea.image, { cascade: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  idea_image: IdeaEntity;

  @OneToOne(() => IdeaEntity, (idea) => idea.document, { cascade: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  idea_document: IdeaEntity;

  @ManyToOne((type) => UserEntity, {
    cascade: true,
  })
  @JoinColumn({ name: 'creator_id' })
  creator: UserEntity;

  @AfterLoad()
  getSource_Url() {
    const s3Source = process.env.AWS_S3_ENDPOINT + '/' + this.source_url;
    this.source_url = this.source_url ? s3Source : 'https://i.picsum.photos/id/1021/500/300.jpg';
  }
}
