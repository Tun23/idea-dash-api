import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from 'src/entities/user.entity';
import { FileEntity } from 'src/entities/file.entity';
import { FileService } from 'src/modules/v1/file/file.service';
import { UploadService } from 'src/common/upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FileEntity])],
  controllers: [UserController],
  providers: [UserService, FileService, UploadService],
})
export class UserModule {}
