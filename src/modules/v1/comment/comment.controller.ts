import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from 'src/modules/v1/auth/guard/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CommentCreateDTO, CommentUpdateDTO, CommentListDTO } from './dto/comment.dto';

@Controller('api/v1/comment')
@ApiTags('Comment')
@UseGuards(AuthGuard)
export class CommentController {
  constructor(private readonly service: CommentService) {}
  @Get()
  async getMany() {
    return await this.service.getMany();
  }
  @Get('/search')
  async search(@Query() query: CommentListDTO) {
    return await this.service.search(query);
  }
  @Get(':id')
  async getOne(@Param('id') id: number) {
    return await this.service.getOne(id);
  }
  @Post()
  async createOne(@Body() dto: CommentCreateDTO) {
    return await this.service.createOne(dto);
  }

  @Put(':id')
  async updateOne(@Param('id') id: number, @Body() dto: CommentUpdateDTO) {
    return await this.service.updateOne(id, dto);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: number) {
    return await this.service.deleteOne(id);
  }
}
