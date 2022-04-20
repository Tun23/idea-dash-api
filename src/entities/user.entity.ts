import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, Min, IsDateString, IsIn, IsEmpty } from 'class-validator';
import { DepartmentEntity } from './department.entity';
import { PasswordTransformer } from '../modules/v1/user/password.transformer';
import { ERole } from 'src/enum/role.enum';
import {CategoryEntity } from "./category.entity"
import { IdeaEntity } from './idea.entity';

@Entity('users')
@Index(['id'], { unique: true })
@Index(['email'])
export class UserEntity {
  @IsEmpty()
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @IsEmail({ require_tld: false })
  @ApiProperty()
  @Column('varchar', { name: 'email', nullable: true, length: 255 })
  email: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiProperty()
  @Column('varchar', { name: 'user_name', nullable: true, length: 255 })
  user_name: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @MinLength(6)
  @Column('varchar', {
    name: 'password',
    length: 255,
    nullable: false,
    transformer: new PasswordTransformer(),
  })
  @ApiProperty()
  password: string | null;

  @ApiProperty()
  password_confirm: string | null;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  @Min(1)
  @Column('int', { name: 'department_id', nullable: true })
  department_id: number | null;

  @IsOptional()
  @IsInt()
  @IsIn([1, 2, 3, 9])
  @ApiProperty()
  @Column('tinyint', { name: 'role', default: ERole.normal, nullable: true })
  role: number | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column('tinyint', { name: 'delete_flag', width: 1, default: 0 })
  delete_flag: boolean;

  @ManyToOne((type) => DepartmentEntity, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'department_id' })
  department: DepartmentEntity;

  @OneToMany((type) => CategoryEntity, (category) => category.creator)
  categories: CategoryEntity[];

  @OneToMany((type) => IdeaEntity, (idea) => idea.author)
  ideas: IdeaEntity[];

  // actions
  @BeforeUpdate()
  @BeforeInsert()
  // tslint:disable-next-line: no-empty
  private async validatePasswordConfirm() {}

  @AfterLoad()
  setDepartmentId() {
    if (this.department) this.department_id = this.department.id;
    else delete this.department_id;
  }

  async comparePassword(attempt: string) {
    return this.password !== crypto.createHmac('sha256', attempt + process.env.APP_KEY).digest('hex');
  }

  toResponseObject() {
    const { id, created_at, user_name, email, role, department_id } = this;
    const token = this.getToken();
    return { id, user_name, email, role, department_id, created_at, token };
  }

  private getToken() {
    const { id, email, user_name, role, department_id } = this;
    return jwt.sign(
      {
        id,
        email,
        user_name,
        role,
        department_id,
      },
      process.env.APP_KEY,
      {
        expiresIn: process.env.APP_TOKEN_TIME || '1d',
      },
    );
  }
}
