import { BaseService } from 'src/common/base.service';
import { UserEntity } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Inject, HttpException, HttpStatus } from '@nestjs/common';
import { AuthDTO, SignUpDTO } from './dto/auth.dto';
import { ERole } from 'src/enum/role.enum';
import { plainToClass } from 'class-transformer';
export class AuthService extends BaseService<UserEntity> {
  constructor(@InjectRepository(UserEntity) repo: Repository<UserEntity>, @Inject(REQUEST) protected readonly request) {
    super(repo, request);
  }
  async login(dto: AuthDTO) {
    const { email, password } = dto;
    let user: UserEntity;
    if (email === 'admin') {
      user = await this.repo
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.image', 'avatar')
        .where('user.role = :role', { role: ERole.root })
        .andWhere('user.delete_flag = :deleteFlag', { deleteFlag: 0 })
        .getOne();
    } else {
      user = await this.repo
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.image', 'avatar')
        .leftJoinAndSelect('user.department', 'department')
        .where('user.email = :email', { email })
        .andWhere('user.delete_flag = :deleteFlag', { deleteFlag: 0 })
        .getOne();
    }

    if (!user || (await user.comparePassword(password))) {
      throw new HttpException('Invalid email/password', HttpStatus.BAD_REQUEST);
    }
    return user.toResponseObject();
  }
  async signUp(dto: SignUpDTO) {
    const { email, password, password_confirm, user_name } = dto;
    try {
      const exists = await this.repo.findOne({ where: { email: email, delete_flag: 0 } });
      if (exists) {
        throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
      }
      if (password && password !== password_confirm) {
        throw new HttpException('Passwords did not match', HttpStatus.BAD_REQUEST);
      }
      const entity = plainToClass(UserEntity, dto);
      if (!entity) {
        throw new HttpException('Empty data. Nothing to save.', HttpStatus.BAD_REQUEST);
      }
      await this.repo.save(entity);
      return { message: 'Your account has been successfully created.' };
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}
