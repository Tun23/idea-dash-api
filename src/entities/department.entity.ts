import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsEmpty } from 'class-validator';
import { UserEntity } from './user.entity';

@Entity('departments')
@Index(['id'], { unique: true })
export class DepartmentEntity{
  @IsEmpty()
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiProperty()
  @Column('varchar', { name: 'name', nullable: true, length: 255 })
  name: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column('tinyint', { name: 'delete_flag', width: 1, default: 0 })
  delete_flag: number;

  @OneToMany((type) => UserEntity, (user) => user.department)
  users: UserEntity[];
}
