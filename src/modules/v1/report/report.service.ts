import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { CategoryEntity } from 'src/entities/category.entity';
import { IdeaEntity } from 'src/entities/idea.entity';
import { CommentEntity } from 'src/entities/comment.entity';
import { UserEntity } from 'src/entities/user.entity';
import { DepartmentEntity } from 'src/entities/department.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { BaseService } from 'src/common/base.service';
import { groupBy, orderBy } from 'lodash';
import * as moment from 'moment';

@Injectable()
export class ReportService extends BaseService<CategoryEntity> {
  constructor(@InjectRepository(CategoryEntity) repo: Repository<CategoryEntity>, @Inject(REQUEST) protected readonly request) {
    super(repo, request);
  }
  async overView(): Promise<any> {
    try {
      const totalTopic = await this.repo.count({ where: { delete_flag: 0 } });
      const totalComment = await this.connection.getRepository(CommentEntity).count({ where: { delete_flag: 0 } });
      const totalUser = await this.connection.getRepository(UserEntity).count({ where: { delete_flag: 0 } });
      const departments = await this.connection.getRepository(DepartmentEntity).find({ where: { delete_flag: 0 } });
      const [data, total] = await this.connection
        .getRepository(IdeaEntity)
        .createQueryBuilder('idea')
        .leftJoinAndSelect('idea.author', 'author', 'author.delete_flag = :deleteFlag')
        .leftJoinAndSelect('author.department', 'department', 'department.delete_flag = :deleteFlag')
        .where('idea.delete_flag = :deleteFlag', { deleteFlag: 0 })
        .getManyAndCount();
      const rawDepIdea = data.map((idea) => {
        return idea.author?.department?.id;
      });
      const chartDepartmentIdea = departments.map((dep) => {
        const data = {
          id: dep.id,
          name: dep.name,
          count: rawDepIdea.filter((item) => item === dep.id).length,
        };
        return data;
      });
      const rawIdeaDay = groupBy(
        data.map((item) => {
          const data = { ...item, created_at: '' };
          data.created_at = moment(item.created_at).format('DD/MM/YYYY');
          return data;
        }),
        'created_at',
      );
      const chartIdeaByDate = {
        labels: Object.keys(rawIdeaDay),
        data: Object.values(rawIdeaDay).map((item) => item.length),
      };
      return { totalTopic, totalIdea: total, totalComment, totalUser, chartDepartmentIdea, chartIdeaByDate };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async topByIdea(): Promise<any> {
    try {
      const topView = await this.connection
        .getRepository(IdeaEntity)
        .createQueryBuilder('idea')
        .where('idea.delete_flag = :deleteFlag', { deleteFlag: 0 })
        .orderBy('idea.total_view', 'DESC')
        .take(10)
        .getMany();
      const rawData = await this.connection
        .getRepository(IdeaEntity)
        .createQueryBuilder('idea')
        .leftJoinAndSelect('idea.upVotes', 'upVotes')
        .leftJoinAndSelect('idea.downVotes', 'downVotes')
        .where('idea.delete_flag = :deleteFlag', { deleteFlag: 0 })
        .getMany();
      const rawPopular = rawData.map((item) => {
        const dt = { ...item, score: 0 };
        const score = item.upVotes.length - item.downVotes.length;
        dt.score = score <= 0 ? 0 : score;
        return dt
      });
      const topPopular = orderBy(rawPopular, ['score'], ['desc']).slice(0, 10);
      return { topView, topPopular };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
