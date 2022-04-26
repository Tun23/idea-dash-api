import { Injectable, Inject, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CommentEntity } from 'src/entities/comment.entity';
import { UserEntity } from 'src/entities/user.entity';
import { IdeaEntity } from 'src/entities/idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { BaseService } from 'src/common/base.service';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { CommentCreateDTO, CommentUpdateDTO, CommentListDTO } from './dto/comment.dto';

@Injectable()
export class CommentService extends BaseService<CommentEntity> {
  constructor(
    @InjectRepository(CommentEntity) repo: Repository<CommentEntity>,
    @Inject(REQUEST) protected readonly request,
    private readonly mailerService: MailerService,
  ) {
    super(repo, request);
  }
  async createOne(dto: CommentCreateDTO): Promise<CommentEntity | any> {
    try {
      const entity = plainToClass(CommentEntity, dto);
      entity.creator_id = this.request.user.id;
      if (entity.creator_id) {
        const user = await this.connection.getRepository(UserEntity).findOne({ where: { id: this.request.user.id, delete_flag: 0 } });
        entity.creator = user;
        delete entity.creator_id;
      }
      if (entity.idea_id) {
        const idea = await this.connection
          .getRepository(IdeaEntity)
          .createQueryBuilder('idea')
          .leftJoinAndSelect('idea.author', 'author', 'author.delete_flag = :deleteFlag')
          .leftJoinAndSelect('idea.category', 'category', 'category.close_date > CURRENT_TIMESTAMP')
          .where('idea.id = :ideaId', { ideaId: entity.idea_id })
          .andWhere('idea.delete_flag = :deleteFlag', { deleteFlag: 0 })
          .getOne();
        if (!idea) throw new HttpException('Idea not found', HttpStatus.BAD_REQUEST);
        if (!idea.category) throw new HttpException('Cannot comment to idea in closed category.', HttpStatus.BAD_REQUEST);
        await this.mailerService.sendMail({
          from: process.env.MAIL_FROM,
          to: idea.author.email,
          subject: `Have new comment to [${idea.title}]`,
          template: __dirname + '/../../../mailer/newComment',
          context: {
            author: idea.author.user_name,
            comment: entity.comment,
            commentAuthor: entity.is_incognito ? 'Somebody' : entity.creator.user_name,
          },
        });
        entity.idea = idea;
        delete entity.idea_id;
      }
      console.log(entity);
      return await this.repo.save(entity);
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
  async updateOne(id: number, dto: CommentUpdateDTO): Promise<CommentEntity | any> {
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
  override async search(query: CommentListDTO): Promise<any> {
    try {
      const limit = Number(query.limit) || 10;
      const page = Number(query.page) || 1;
      const qb = this.repo
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.creator', 'creator', 'creator.delete_flag = :deleteFlag')
        .leftJoinAndSelect('comment.idea', 'idea', 'idea.delete_flag = :deleteFlag', { deleteFlag: 0 })
        .where('comment.delete_flag = :deleteFlag', { deleteFlag: 0 })
        .skip(limit * (page - 1))
        .take(limit)
        .orderBy('comment.created_at', 'ASC');
      if (query.keyword) qb.andWhere({ comment: Like(`%${query.keyword}%`) });
      if (query.creatorId) qb.andWhere('creator.id = :creatorId', { creatorId: query.creatorId });
      else {
        if (query.ideaId) qb.andWhere('idea.id = :ideaId', { ideaId: query.ideaId });
      }
      const [data, total] = await qb.getManyAndCount();
      data.map((comment) => this.toResponseObject(comment));

      return this.paginateResponse([data, total], page, limit);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  private toResponseObject(comment: CommentEntity) {
    return {
      ...comment,
      creator: comment.creator && comment.creator.toPublicResponseObject(),
    };
  }
}
