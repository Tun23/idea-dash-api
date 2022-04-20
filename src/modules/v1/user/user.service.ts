import { Injectable, Inject, HttpException, HttpStatus, Scope, InternalServerErrorException, UseGuards, BadRequestException } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';
import { DepartmentEntity } from 'src/entities/department.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import { REQUEST } from '@nestjs/core';
import { BaseService } from 'src/common/base.service';
import { AuthGuard } from 'src/modules/v1/auth/guard/auth.guard';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { UserListDTO, UserUpdateDTO, UserCreateDTO } from './dto/user.dto';
import { FileService } from 'src/modules/v1/file/file.service';
@Injectable()
@ApiTags('User')
@UseGuards(AuthGuard)
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) repo: Repository<UserEntity>,
    @Inject(REQUEST) protected readonly request,
    private readonly fileService: FileService,
  ) {
    super(repo, request);
  }
  async getCurrentUser(): Promise<any> {
    const id = this.request.user.id;
    const user = await this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.image', 'avatar')
      .leftJoinAndSelect('user.department', 'department')
      .where('user.id = :id', { id })
      .andWhere('user.delete_flag = :deleteFlag', { deleteFlag: 0 })
      .getOne();
    const { user_name, email, role, department_id, created_at, image, image_id } = user;
    return { id, user_name, email, role, department_id, created_at, image, image_id };
  }
  override async getOne(id: number): Promise<UserEntity> {
    const topic = await this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.department', 'department', 'department.delete_flag = :deleteFlag')
      .leftJoinAndSelect('user.image', 'image', 'image.delete_flag = :deleteFlag')
      .where('user.delete_flag = :deleteFlag', { deleteFlag: 0 })
      .where('user.id = :id', { id })
      .andWhere('user.delete_flag = :deleteFlag', { deleteFlag: 0 })
      .getOne();
    return topic;
  }
  override async search(query: UserListDTO): Promise<any> {
    try {
      const limit = Number(query.limit) || 10;
      const page = Number(query.page) || 1;
      const qb = this.repo
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.department', 'department', 'department.delete_flag = :deleteFlag')
        .leftJoinAndSelect('user.image', 'image', 'image.delete_flag = :deleteFlag')
        .where('user.delete_flag = :deleteFlag', { deleteFlag: 0 })
        .andWhere('user.role <> :role', { role: 9 })
        .skip(limit * (page - 1))
        .take(limit);
      if (query.keyword) qb.andWhere({ title: Like(`%${query.keyword}%`) });
      const [data, total] = await qb.getManyAndCount();
      return this.paginateResponse([data, total], page, limit);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async createOne(files: any, dto: UserCreateDTO): Promise<UserEntity | any> {
    try {
      if (files && Array.isArray(files.image_id)) {
        const e = files.image_id[0];
        const mime = e.mimetype.split('/')[1];
        const mines = ['jpeg', 'jpg', 'png', 'gif'];
        if (!mines.includes(mime)) {
          throw new BadRequestException(e.fieldname + ` is must be an image`);
        }
        if (e.size > process.env.MAX_UPLOAD_SIZE) {
          throw new BadRequestException(e.fieldname + ' is must be smaller than 5Mb');
        }
        const data = await this.fileService.createOneFile(e);
        if (data.id) {
          dto.image_id = data.id;
        }
      }
      const entity = plainToClass(UserEntity, dto);
      if (entity.department_id) {
        const dep = await this.connection.getRepository(DepartmentEntity).findOne({ where: { id: entity.department_id } });
        entity.department = dep;
        delete entity.department_id;
      }
      await this.repo.save(entity);
      return { message: 'Created successfully' };
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
  async updateOne(id: number, files: any, dto: UserUpdateDTO): Promise<UserEntity | any> {
    try {
      const current = await this.repo
        .createQueryBuilder('topic')
        .where('topic.id = :id', { id })
        .andWhere('topic.delete_flag = :deleteFlag', { deleteFlag: 0 })
        .getOne();
      if (!current) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      if (files && Array.isArray(files.image_id)) {
        const e = files.image_id[0];
        const mime = e.mimetype.split('/')[1];
        const mines = ['jpeg', 'jpg', 'png', 'gif'];
        if (!mines.includes(mime)) {
          throw new BadRequestException(e.fieldname + ` is must be an image`);
        }
        if (e.size > process.env.MAX_UPLOAD_SIZE) {
          throw new BadRequestException(e.fieldname + ' is must be smaller than 5Mb');
        }
        const data = await this.fileService.createOneFile(e);
        if (data.id) {
          dto.image_id = data.id;
        }
      }
      const entity = plainToClassFromExist(current, dto);
      if (entity.department_id) {
        const dep = await this.connection.getRepository(DepartmentEntity).findOne({ where: { id: entity.department_id } });
        entity.department = dep;
        delete entity.department_id;
      }
      await this.repo.save(entity);
      return { message: 'Updated successfully' };
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}
