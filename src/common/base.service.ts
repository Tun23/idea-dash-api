import { Injectable, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { DeepPartial, Connection, getConnection, Repository } from 'typeorm';
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
}
