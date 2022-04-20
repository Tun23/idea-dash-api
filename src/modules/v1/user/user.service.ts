import { Injectable, Inject, HttpException, HttpStatus, Scope, NotFoundException, UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import { REQUEST } from '@nestjs/core';
import { BaseService } from 'src/common/base.service';
import { AuthGuard } from 'src/modules/v1/auth/guard/auth.guard';
import { plainToClass, plainToClassFromExist } from 'class-transformer';

@Injectable()
@ApiTags('User')
@UseGuards(AuthGuard)
export class UserService extends BaseService<UserEntity> {
  constructor(@InjectRepository(UserEntity) repo: Repository<UserEntity>, @Inject(REQUEST) protected readonly request) {
    super(repo, request);
  }
  async getCurrentUser(): Promise<any> {
    const id = this.request.user.id;
    const { user_name, email, role, department_id, created_at } = await this.repo.findOne({ where: { id, delete_flag: 0 } });
    return { id, user_name, email, role, department_id, created_at };
  }
}
