import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileEntity } from 'src/entities/file.entity';
import { UploadService } from '../../../common/upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  controllers: [FileController],
  providers: [UploadService, FileService],
  exports: [],
})
export class FiledModule {}
