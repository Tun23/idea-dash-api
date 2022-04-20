import { MigrationService } from './migration.service'
import { ServersConnectGuard } from '../guard/serversConnect.guard'
import { Controller, Post, UseGuards } from '@nestjs/common'

@Controller('/migrate')
@UseGuards(ServersConnectGuard)
export class MigrationController {
  constructor(public service: MigrationService) {}

  @Post('/up')
  async migrateUp() {
    await this.service.migrateUp()
  }

  @Post('/down')
  async migrateDown() {
    return await this.service.migrateDown()
  }
}
