import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/modules/v1/auth/guard/auth.guard';
import { RolesGuard } from 'src/modules/v1/auth/guard/role.guard';
import { Role } from 'src/modules/v1/auth/decorator/role.decorator';
import { ERole } from 'src/enum/role.enum';
import { ApiTags } from '@nestjs/swagger';

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
  @Get(':id')
  async getOne(@Param('id') id: number) {
    return await this.service.getOne(id);
  }
}
