import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  Scope,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CategoryEntity } from 'src/entities/category.entity';
import { UserEntity } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { BaseService } from 'src/common/base.service';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { CategoryCreateDTO, CategoryUpdateDTO, CategoryListDTO } from './dto/category.dto';
import { FileService } from 'src/modules/v1/file/file.service';

@Injectable()
export class CategoryService extends BaseService<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity) repo: Repository<CategoryEntity>,
    @Inject(REQUEST) protected readonly request,
    private readonly fileService: FileService,
  ) {
    super(repo, request);
  }
  override async getOne(id: number): Promise<CategoryEntity> {
    const category = await this.repo
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.creator', 'creator', 'creator.delete_flag = :deleteFlag')
      .leftJoinAndSelect('category.image', 'image', 'image.delete_flag = :deleteFlag')
      .leftJoinAndSelect('category.ideas', 'ideas', 'ideas.delete_flag = :deleteFlag')
      .leftJoinAndSelect('ideas.image', 'categoryImage', 'categoryImage.delete_flag = :deleteFlag', { deleteFlag: 0 })
      .where('category.id = :id', { id })
      .andWhere('category.delete_flag = :deleteFlag', { deleteFlag: 0 })
      .getOne();
    return category;
  }
  override async search(query: CategoryListDTO): Promise<any> {
    try {
      const limit = Number(query.limit) || 10;
      const page = Number(query.page) || 1;
      const qb = this.repo
        .createQueryBuilder('category')
        .leftJoinAndSelect('category.ideas', 'ideas', 'ideas.delete_flag = :deleteFlag', { deleteFlag: 0 })
        .leftJoinAndSelect('category.creator', 'creator', 'creator.delete_flag = :deleteFlag')
        .leftJoinAndSelect('category.image', 'image', 'image.delete_flag = :deleteFlag')
        .where('category.delete_flag = :deleteFlag', { deleteFlag: 0 })
        .skip(limit * (page - 1))
        .take(limit);
      if (query.keyword) qb.andWhere({ title: Like(`%${query.keyword}%`) });
      const [data, total] = await qb.getManyAndCount();
      return this.paginateResponse([data, total], page, limit);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async createOne(files: any, dto: CategoryCreateDTO): Promise<CategoryEntity | any> {
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
      const entity = plainToClass(CategoryEntity, dto);
      entity.creator_id = this.request.user.id;
      if (entity.creator_id) {
        const user = await this.connection.getRepository(UserEntity).findOne({ where: { id: this.request.user.id } });
        entity.creator = user;
        delete entity.creator_id;
      }
      await this.repo.save(entity);
      return { message: 'Created successfully' };
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
  async updateOne(id: number, files: any, dto: CategoryUpdateDTO): Promise<CategoryEntity | any> {
    try {
      const current = await this.repo
        .createQueryBuilder('category')
        .where('category.id = :id', { id })
        .andWhere('category.delete_flag = :deleteFlag', { deleteFlag: 0 })
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
      await this.repo.save(entity);
      return { message: 'Updated successfully' };
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
  override async deleteOne(id: number): Promise<CategoryEntity | any> {
    try {
      const exist = await this.getOne(id);
      if (!exist) {
        throw new NotFoundException();
      }
      exist.delete_flag = 1;
      exist.ideas.map((idea) => {
        idea.delete_flag = 1;
      });
      await this.repo.save(exist);
      return { message: 'Deleted successfully.' };
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}
