import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { AuthGuard } from 'src/modules/v1/auth/guard/auth.guard';
import { RolesGuard } from 'src/modules/v1/auth/guard/role.guard';
import { Role } from 'src/modules/v1/auth/decorator/role.decorator';
import { ERole } from 'src/enum/role.enum';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/v1/report')
@ApiTags('Report')
@UseGuards(AuthGuard, RolesGuard)
export class ReportController {
  constructor(private readonly service: ReportService) {}
  @Get()
  @Role(ERole.admin, ERole.root)
  async overView() {
    return await this.service.overView();
  }
}
