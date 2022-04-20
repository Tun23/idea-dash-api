import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { DepartmentEntity } from 'src/entities/department.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository, Repository, Like } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { BaseService } from 'src/common/base.service';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { DepartmentCreateDTO, DepartmentUpdateDTO } from './dto/department.dto';

@Injectable()
export class DepartmentService extends BaseService<DepartmentEntity> {
  constructor(@InjectRepository(DepartmentEntity) repo: Repository<DepartmentEntity>, @Inject(REQUEST) protected readonly request) {
    super(repo, request);
  }
  async createOne(dto: DepartmentCreateDTO): Promise<DepartmentUpdateDTO | any> {
    try {
      const entity = plainToClass(DepartmentEntity, dto);
      await this.repo.save(entity);
      return { message: 'Created successfully' };
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
  async updateOne(id: number, dto: DepartmentUpdateDTO): Promise<DepartmentUpdateDTO | any> {
    try {
      const current = await this.getOne(id);
      if (!current) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      const entity = plainToClassFromExist(current, dto);
      await this.repo.save(entity);
      return { message: 'Updated successfully' };
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}
