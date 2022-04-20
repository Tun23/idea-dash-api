import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileService } from './file.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { Role } from '../auth/decorator/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ERole } from 'src/enum/role.enum';
import { ApiFile } from './file.decorator';

@Controller('api/v1/file')
@ApiTags('File')
@UseGuards(AuthGuard, RolesGuard)
export class FileController {
  constructor(private service: FileService) {}

  @Post('/')
  @Role(ERole.root, ERole.admin)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  async createOneFile(@UploadedFile() file) {
    try {
      if (file.size > process.env.MAX_UPLOAD_SIZE) {
        throw new BadRequestException(`File is too large, should be less than ${Number(process.env.MAX_UPLOAD_SIZE) / (1024 * 1024)}Mb`);
      }

      return await this.service.createOneFile(file);
    } catch (error) {
      throw error;
    }
  }
}
