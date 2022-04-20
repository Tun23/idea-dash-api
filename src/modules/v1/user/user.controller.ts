import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/modules/v1/auth/guard/auth.guard';
import { RolesGuard } from 'src/modules/v1/auth/guard/role.guard';
import { Role } from 'src/modules/v1/auth/decorator/role.decorator';
import { ERole } from 'src/enum/role.enum';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserListDTO, UserUpdateDTO, UserCreateDTO } from './dto/user.dto';

@Controller('/api/v1/user')
@ApiTags('User')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly service: UserService) {}
  @Get()
  async getMany() {
    return await this.service.getMany();
  }
  @Get('token')
  async getUserByToken() {
    return await this.service.getCurrentUser();
  }
  @Role(ERole.root, ERole.admin)
  @Get('/search')
  async search(@Query() query: UserListDTO) {
    return await this.service.search(query);
  }
  @Role(ERole.root, ERole.admin)
  @Get(':id')
  async getOne(@Param('id') id: number) {
    return await this.service.getOne(id);
  }
  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image_id', maxCount: 1 }]))
  @ApiConsumes('multipart/form-data')
  @Role(ERole.root, ERole.admin)
  async createOne(@UploadedFiles() files: { image_id?: any }, @Body() dto: UserCreateDTO) {
    return await this.service.createOne(files, dto);
  }
  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image_id', maxCount: 1 }]))
  @ApiConsumes('multipart/form-data')
  @Role(ERole.root, ERole.admin)
  async updateOne(@Param('id') id: number, @UploadedFiles() files: { image_id?: any }, @Body() dto: UserUpdateDTO) {
    return await this.service.updateOne(id, files, dto);
  }
  @Delete(':id')
  @Role(ERole.root, ERole.admin)
  async deleteOne(@Param('id') id: number) {
    return await this.service.deleteOne(id);
  }
}
