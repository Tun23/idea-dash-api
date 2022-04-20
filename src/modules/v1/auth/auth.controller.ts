import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthDTO, SignUpDTO } from './dto/auth.dto';

@Controller('api/v1/')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}
  @Post('login')
  async login(@Body() dto: AuthDTO) {
    return await this.service.login(dto);
  }
  @Post('signup')
  async signUp(@Body() dto: SignUpDTO) {
    return await this.service.signUp(dto);
  }
}
