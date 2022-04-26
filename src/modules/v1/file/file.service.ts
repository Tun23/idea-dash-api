import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { FileEntity } from 'src/entities/file.entity';
import { UserEntity } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { BaseService } from 'src/common/base.service';
import { UploadService } from 'src/common/upload.service';
import { plainToClass } from 'class-transformer';

@Injectable()
export class FileService extends BaseService<FileEntity> {
  private uploadSrv: UploadService;
  constructor(@InjectRepository(FileEntity) repo: Repository<FileEntity>, @Inject(REQUEST) protected readonly request, uploadSrv: UploadService) {
    super(repo, request);
    this.uploadSrv = uploadSrv;
  }
  async createOneFile(fileRaw): Promise<any> {
    try {
      const data = await this.uploadSrv.fileUpload(fileRaw);
      const file = new FileEntity();
      file.source_url = data.source;
      file.name = data.title;
      const entity = plainToClass(FileEntity, file);
      entity.creator_id = this.request.user.id;
      if (entity.creator_id) {
        const user = await this.connection.getRepository(UserEntity).findOne({ where: { id: this.request.user.id, delete_flag: 0 } });
        entity.creator = user;
        delete entity.creator_id;
      }
      return await this.repo.save(entity);
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
  async downloadFiles(ids: number[]) {
    const files = await this.repo
      .createQueryBuilder()
      .where({ id: In(ids), delete_flag: 0 })
      .orderBy(`FIND_IN_SET(id, '${ids.join(',')}')`)
      .getMany();
    const filePaths = files.map((file) => {
      return file.source_url.replace(`${process.env.AWS_S3_ENDPOINT}/`, '');
    });
    return await this.uploadSrv.multipleFileDownload(filePaths);
  }
}
