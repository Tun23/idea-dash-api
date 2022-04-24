import { Injectable, Inject, HttpException, HttpStatus, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { IdeaEntity } from 'src/entities/idea.entity';
import { CategoryEntity } from 'src/entities/category.entity';
import { UserEntity } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { BaseService } from 'src/common/base.service';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { IdeaCreateDTO, IdeaUpdateDTO, IdeaListDTO } from './dto/idea.dto';
import { EVote } from 'src/enum/vote.enum';
import { FileService } from 'src/modules/v1/file/file.service';
import { orderBy } from 'lodash';

@Injectable()
export class IdeaService extends BaseService<IdeaEntity> {
  constructor(
    @InjectRepository(IdeaEntity) repo: Repository<IdeaEntity>,
    @Inject(REQUEST) protected readonly request,
    private readonly fileService: FileService,
  ) {
    super(repo, request);
  }
  override async getOne(id: number): Promise<IdeaEntity> {
    let data = await this.repo
      .createQueryBuilder('idea')
      .leftJoinAndSelect('idea.author', 'author', 'author.delete_flag = :deleteFlag')
      .leftJoinAndSelect('author.image', 'authorImage', 'authorImage.delete_flag = :deleteFlag')
      .leftJoinAndSelect('idea.image', 'image', 'image.delete_flag = :deleteFlag')
      .leftJoinAndSelect('idea.document', 'document', 'document.delete_flag = :deleteFlag')
      .leftJoinAndSelect('idea.comments', 'comment', 'comment.delete_flag = :deleteFlag')
      .leftJoinAndSelect('comment.creator', 'creator', 'creator.delete_flag = :deleteFlag')
      .leftJoinAndSelect('creator.image', 'commentImage', 'commentImage.delete_flag = :deleteFlag', { deleteFlag: 0 })
      .leftJoinAndSelect('idea.upVotes', 'upVotes')
      .leftJoinAndSelect('idea.downVotes', 'downVotes')
      .where('idea.id = :id', { id })
      .andWhere('idea.delete_flag = :deleteFlag', { deleteFlag: 0 })
      .getOne();
      console.log(data)
    if (data) {
      data = this.toResponseObject(data);
    }
    return data;
  }
  override async getMany(): Promise<IdeaEntity[]> {
    const data = await this.repo
      .createQueryBuilder('idea')
      .leftJoinAndSelect('idea.author', 'author', 'author.delete_flag = :deleteFlag')
      .leftJoinAndSelect('idea.image', 'image', 'image.delete_flag = :deleteFlag')
      .leftJoinAndSelect('idea.document', 'document', 'document.delete_flag = :deleteFlag')
      .leftJoinAndSelect('idea.comments', 'comment', 'comment.delete_flag = :deleteFlag')
      .leftJoinAndSelect('comment.creator', 'creator', 'creator.delete_flag = :deleteFlag', { deleteFlag: 0 })
      .leftJoinAndSelect('idea.upVotes', 'upVotes')
      .leftJoinAndSelect('idea.downVotes', 'downVotes')
      .andWhere('idea.delete_flag = :deleteFlag', { deleteFlag: 0 })
      .orderBy('idea.created_at', 'DESC')
      .getMany();
    if (data.length > 0) {
      data.map((e) => this.toResponseObject(e));
    }
    return data;
  }
  override async search(query: IdeaListDTO): Promise<any> {
    try {
      const limit = Number(query.limit) || 10;
      const page = Number(query.page) || 1;
      const qb = this.repo
        .createQueryBuilder('idea')
        .leftJoinAndSelect('idea.author', 'author', 'author.delete_flag = :deleteFlag')
        .leftJoinAndSelect('author.image', 'authorImage', 'authorImage.delete_flag = :deleteFlag')
        .leftJoinAndSelect('idea.category', 'category', 'category.delete_flag = :deleteFlag')
        .leftJoinAndSelect('idea.image', 'image', 'image.delete_flag = :deleteFlag')
        .leftJoinAndSelect('idea.document', 'document', 'document.delete_flag = :deleteFlag')
        .leftJoinAndSelect('idea.comments', 'comment', 'comment.delete_flag = :deleteFlag')
        .leftJoinAndSelect('comment.creator', 'creator', 'creator.delete_flag = :deleteFlag')
        .leftJoinAndSelect('creator.image', 'commentImage', 'commentImage.delete_flag = :deleteFlag', { deleteFlag: 0 })
        .leftJoinAndSelect('idea.upVotes', 'upVotes')
        .leftJoinAndSelect('idea.downVotes', 'downVotes')
        .where('idea.delete_flag = :deleteFlag', { deleteFlag: 0 })
        .skip(limit * (page - 1))
        .take(limit);
      if (query.categoryId) {
        qb.andWhere('category.id = :categoryId', { categoryId: query.categoryId });
      }
      if (query.rand) {
        qb.orderBy('RAND()');
      } else {
        qb.orderBy('idea.created_at', 'DESC');
      }
      if (query.keyword) qb.andWhere({ title: Like(`%${query.keyword}%`) });
      const [data, total] = await qb.getManyAndCount();
      if (data.length > 0) {
        data.map((e) => this.toResponseObject(e));
      }
      return this.paginateResponse([data, total], page, limit);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async createOne(files: any, dto: IdeaCreateDTO): Promise<IdeaEntity | any> {
    try {
      let category;
      if (dto.category_id) {
        category = await this.connection
          .getRepository(CategoryEntity)
          .createQueryBuilder('category')
          .where('category.id = :categoryId', { categoryId: dto.category_id })
          .andWhere('category.lock_date > CURRENT_TIMESTAMP')
          .andWhere('category.delete_flag = :deleteFlag', { deleteFlag: 0 })
          .getOne();
        if (!category) throw new HttpException('Topic not found or closed. ', HttpStatus.BAD_REQUEST);
      }
      if (files && (files.image_id || files.document_id)) {
        const fileArr = [];
        if (Array.isArray(files.image_id)) fileArr.push(files.image_id[0]);
        if (Array.isArray(files.document_id)) fileArr.push(files.document_id[0]);
        const filePromises = fileArr.map(async (e) => {
          const mime = e.mimetype.split('/')[1];
          const mines = e.fieldname === 'image_id' ? ['jpeg', 'jpg', 'png', 'gif'] : ['pdf', 'docx', 'doc', 'txt', 'xlsx', 'xls', 'pptx', 'ppt'];
          const type = e.fieldname === 'image_id' ? 'image' : 'document';
          if (!mines.includes(mime)) {
            throw new BadRequestException(e.fieldname + ` is must be an ${type}`);
          }
          if (e.size > process.env.MAX_UPLOAD_SIZE) {
            throw new BadRequestException(e.fieldname + ' is must be smaller than 5Mb');
          }
          const data = await this.fileService.createOneFile(e);
          if (data.id) {
            if (e.fieldname === 'image_id') {
              dto.image_id = data.id;
            } else if (e.fieldname === 'document_id') {
              dto.document_id = data.id;
            }
          }
        });
        await Promise.all(filePromises);
      }
      const entity = plainToClass(IdeaEntity, dto);
      entity.creator_id = this.request.user.id;
      entity.category = category;
      delete entity.category_id;
      if (entity.creator_id) {
        const user = await this.connection.getRepository(UserEntity).findOne({ where: { id: this.request.user.id, delete_flag: 0 } });
        entity.author = user;
        delete entity.creator_id;
      }
      await this.repo.save(entity);
      return { message: 'Created successfully' };
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
  async updateOne(id: number, dto: IdeaUpdateDTO): Promise<IdeaEntity | any> {
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

  async upVote(id: number) {
    let idea = await this.repo
      .createQueryBuilder('idea')
      .leftJoinAndSelect('idea.upVotes', 'upVotes')
      .leftJoinAndSelect('idea.downVotes', 'downVotes')
      .where('idea.id = :id', { id })
      .andWhere('idea.delete_flag = :deleteFlag', { deleteFlag: 0 })
      .getOne();
    if (idea) {
      idea = await this.vote(idea, EVote.UP);
      idea = this.toResponseObject(idea);
    }
    return idea;
  }

  async downVote(id: number) {
    let idea = await this.repo
      .createQueryBuilder('idea')
      .leftJoinAndSelect('idea.upVotes', 'upVotes')
      .leftJoinAndSelect('idea.downVotes', 'downVotes')
      .where('idea.id = :id', { id })
      .andWhere('idea.delete_flag = :deleteFlag', { deleteFlag: 0 })
      .getOne();
    if (idea) {
      idea = await this.vote(idea, EVote.DOWN);
      idea = this.toResponseObject(idea);
    }
    return idea;
  }
  private async vote(idea: IdeaEntity, vote: EVote) {
    const opposite = vote === EVote.UP ? EVote.DOWN : EVote.UP;
    const user = await this.connection.getRepository(UserEntity).findOne({ where: { id: this.request.user.id, delete_flag: 0 } });
    if (idea[opposite].filter((voter) => voter.id === user.id).length > 0 && idea[vote].filter((voter) => voter.id === user.id).length === 0) {
      idea[opposite] = idea[opposite].filter((voter) => voter.id !== user.id);
      idea[vote].push(user);
      await this.repo.save(idea);
    } else if (idea[opposite].filter((voter) => voter.id === user.id).length > 0 || idea[vote].filter((voter) => voter.id === user.id).length > 0) {
      idea[opposite] = idea[opposite].filter((voter) => voter.id !== user.id);
      idea[vote] = idea[vote].filter((voter) => voter.id !== user.id);
      await this.repo.save(idea);
    } else if (idea[vote].filter((voter) => voter.id === user.id).length < 1) {
      idea[vote].push(user);
      await this.repo.save(idea);
    } else {
      throw new HttpException('Unable to cast vote', HttpStatus.BAD_REQUEST);
    }
    return idea;
  }
  private toResponseObject(idea: IdeaEntity) {
    idea.upVoteCount = idea.upVotes.length;
    idea.downVoteCount = idea.downVotes.length;
    if (idea.comments) {
      idea.comments = orderBy(idea.comments, ['created_at'], ['desc']);
      idea.commentCount = idea.comments.length;
    }
    delete idea.upVotes;
    delete idea.downVotes;
    return idea;
  }
}
