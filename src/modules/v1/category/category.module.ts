import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryEntity } from 'src/entities/category.entity';
import { FileService } from 'src/modules/v1/file/file.service';
import { UploadService } from 'src/common/upload.service';
import { FileEntity } from 'src/entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, FileEntity])],
  controllers: [CategoryController],
  providers: [CategoryService, FileService, UploadService],
})
export class CategoryModule {}
