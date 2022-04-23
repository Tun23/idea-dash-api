import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/modules/v1/auth/guard/auth.guard';
import { RolesGuard } from 'src/modules/v1/auth/guard/role.guard';
import { Role } from 'src/modules/v1/auth/decorator/role.decorator';
import { ERole } from 'src/enum/role.enum';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CategoryCreateDTO, CategoryUpdateDTO, CategoryListDTO } from './dto/category.dto';

@Controller('api/v1/category')
@ApiTags('Category')
@UseGuards(AuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly service: CategoryService) {}
  @Get()
  async getMany() {
    return await this.service.getMany();
  }
  @Get('/search')
  async search(@Query() query: CategoryListDTO) {
    return await this.service.search(query);
  }
  @Get(':id')
  async getOne(@Param('id') id: number) {
    return await this.service.getOne(id);
  }
  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image_id', maxCount: 1 }]))
  @ApiConsumes('multipart/form-data')
  @Role(ERole.root, ERole.admin, ERole.qa)
  async createOne(@UploadedFiles() files: { image_id?: any }, @Body() dto: CategoryCreateDTO) {
    return await this.service.createOne(files, dto);
  }
  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image_id', maxCount: 1 }]))
  @ApiConsumes('multipart/form-data')
  @Role(ERole.root, ERole.admin, ERole.qa)
  async updateOne(@Param('id') id: number, @UploadedFiles() files: { image_id?: any }, @Body() dto: CategoryUpdateDTO) {
    return await this.service.updateOne(id, files, dto);
  }
  @Delete(':id')
  @Role(ERole.root, ERole.admin, ERole.qa)
  async deleteOne(@Param('id') id: number) {
    return await this.service.deleteOne(id);
  }
}
