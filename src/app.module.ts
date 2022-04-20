import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { MigrationModule } from './modules/common/migration/migration.module';
import { AuthModule } from './modules/v1/auth/auth.module';
import { UserModule } from './modules/v1/user/user.module';
import { DepartmentModule } from './modules/v1/department/department.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './shared/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [DatabaseModule, MigrationModule, AuthModule, UserModule, DepartmentModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
