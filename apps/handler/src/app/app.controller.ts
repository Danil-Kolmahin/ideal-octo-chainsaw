import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('version')
  version() {
    return process.env.npm_package_version;
  }

  @Get()
  getData() {
    return this.appService.getData();
  }
}
