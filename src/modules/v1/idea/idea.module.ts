import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaController } from './idea.controller';
import { IdeaService } from './idea.service';
import { FileService } from 'src/modules/v1/file/file.service';
import { UploadService } from 'src/common/upload.service';
import { IdeaEntity } from 'src/entities/idea.entity';
import { FileEntity } from 'src/entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity, FileEntity])],
  controllers: [IdeaController],
  providers: [IdeaService, FileService, UploadService],
})
export class IdeaModule {}
