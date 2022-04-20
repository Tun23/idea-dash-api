import { Injectable, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { DeepPartial, Connection, getConnection, Repository, Like } from 'typeorm';
@Injectable()
export class BaseService<T> {
  protected connection: Connection;
  protected repo: Repository<T>;
  protected user: any;
  constructor(repo: any, protected request: any) {
    try {
      this.request = request;
      this.user = this.request.user;
      this.connection = getConnection();
      this.repo = repo;
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
  async getOne(id: number): Promise<T> {
    return await this.repo.findOne({ where: { id, delete_flag: 0 } });
  }
  async getMany(): Promise<T[]> {
    return await this.repo.find({ where: { delete_flag: 0 } });
  }
  async deleteOne(id: number): Promise<any | T> {
    try {
      const exist = await this.repo.findOne({ where: { id, delete_flag: 0 } });
      if (!exist) {
        throw new HttpException('Data not found', HttpStatus.BAD_REQUEST);
      }
      await this.repo.update(id, { delete_flag: 1 } as any);
      return { message: 'Data has been deleted successfully.' };
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
  async search(query: any): Promise<any> {
    try {
      const limit = Number(query.limit) || 10;
      const page = Number(query.page) || 1;
      const qb = this.repo
        .createQueryBuilder()
        .where({ delete_flag: 0 })
        .skip(limit * (page - 1))
        .take(limit)
        .orderBy({ id: 'ASC' });
      if (query.keyword) qb.andWhere({ name: Like(`%${query.keyword}%`) });
      const data = await qb.getManyAndCount();
      return this.paginateResponse(data, page, limit);
    } catch (e) {}
  }
  protected paginateResponse(result: any, page: number, limit: number) {
    const [data, total] = result;
    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    return {
      limit,
      page,
      total,
      prevPage,
      nextPage,
      lastPage,
      data,
    };
  }
}
