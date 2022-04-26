import { Injectable, Inject, UploadedFile, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { isEmpty } from '@nestjs/common/utils/shared.utils';
import * as AWS from 'aws-sdk';
import { REQUEST } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  constructor(@Inject(REQUEST) protected readonly request) {}

  private AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

  private s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  private fileUploadParams = {
    Bucket: this.AWS_S3_BUCKET_NAME,
    ACL: 'public-read',
    Key: '',
    Body: null,
  };

  private deleteParams = {
    Bucket: this.AWS_S3_BUCKET_NAME,
    Key: '',
  };
  private downloadParams = {
    Bucket: this.AWS_S3_BUCKET_NAME,
    Key: '',
  };

  async fileUpload(@UploadedFile() file) {
    const prefix = 'files';
    const params = this.fileUploadParams;
    const type = file.mimetype.split('/')[1];
    const name = uuidv4();
    params.Key = `${prefix}/${name}.${type}`;
    params.Body = file.buffer;
    try {
      await this.s3.putObject(params).promise();
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return {
      title: `${file.originalname}`,
      source: `${prefix}/${name}.${type}`,
    };
  }

  async fileDelete(filePath) {
    const params = this.deleteParams;
    params.Key = filePath;
    if (isEmpty(filePath)) {
      throw new NotFoundException();
    }
    await this.s3.deleteObject(params, (err) => {
      if (err) {
        throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  }

  async fileDownload(filePath) {
    const params = this.downloadParams;
    params.Key = filePath;
    if (isEmpty(filePath)) {
      throw new NotFoundException();
    }
    try {
      return await this.s3.getObject(params).promise();
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async multipleFileDownload(filePaths: Array<string>) {
    try {
      const promises = filePaths.map((filePath) => {
        return this.fileDownload(filePath);
      });
      return await Promise.all(promises);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
