import { Body, Controller, Get, Param, Query, Post, Put,Delete, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { AuthGuard } from 'src/modules/v1/auth/guard/auth.guard';
import { RolesGuard } from 'src/modules/v1/auth/guard/role.guard';
import { Role } from 'src/modules/v1/auth/decorator/role.decorator';
import { ERole } from 'src/enum/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { DepartmentCreateDTO, DepartmentUpdateDTO, DepartmentListDTO } from './dto/department.dto';

@Controller('api/v1/department')
@ApiTags('Department')
@UseGuards(AuthGuard, RolesGuard)
export class DepartmentController {
  constructor(private readonly service: DepartmentService) {}
  @Get()
  async getMany() {
    return await this.service.getMany();
  }
  @Get('/search')
  async search(@Query() query: DepartmentListDTO) {
    return await this.service.search(query);
  }
  @Get(':id')
  async getOne(@Param('id') id: number) {
    return await this.service.getOne(id);
  }
  @Post()
  @Role(ERole.root, ERole.admin)
  async createOne(@Body() dto: DepartmentCreateDTO) {
    return await this.service.createOne(dto);
  }
  @Put(':id')
  @Role(ERole.root, ERole.admin)
  async updateOne(@Param('id') id: number, @Body() dto: DepartmentUpdateDTO) {
    return await this.service.updateOne(id, dto);
  }
  @Delete(':id')
  async deleteOne(@Param('id') id: number) {
    return await this.service.deleteOne(id);
  }
}
