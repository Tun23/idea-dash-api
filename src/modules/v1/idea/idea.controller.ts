import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { IdeaService } from './idea.service';
import { AuthGuard } from 'src/modules/v1/auth/guard/auth.guard';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { IdeaCreateDTO, IdeaUpdateDTO, IdeaListDTO } from './dto/idea.dto';

@Controller('api/v1/idea')
@ApiTags('Idea')
@UseGuards(AuthGuard)
export class IdeaController {
  constructor(private readonly service: IdeaService) {}
  @Get()
  async getMany() {
    return await this.service.getMany();
  }
  @Get('/search')
  async search(@Query() query: IdeaListDTO) {
    return await this.service.search(query);
  }
  @Get(':id')
  async getOne(@Param('id') id: number) {
    return await this.service.getOne(id);
  }
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'document_id', maxCount: 1 },
      { name: 'image_id', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  async createOne(@UploadedFiles() files: { document_id?: any; image_id?: any }, @Body() dto: IdeaCreateDTO) {
    return await this.service.createOne(files,dto);
  }

  @Put(':id')
  async updateOne(@Param('id') id: number, @Body() dto: IdeaUpdateDTO) {
    return await this.service.updateOne(id, dto);
  }
  @Post(':id/upvote')
  upvoteIdea(@Param('id') id: number) {
    return this.service.upVote(id);
  }
  @Post(':id/downvote')
  downvoteIdea(@Param('id') id: number) {
    return this.service.downVote(id);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: number) {
    return await this.service.deleteOne(id);
  }
}
