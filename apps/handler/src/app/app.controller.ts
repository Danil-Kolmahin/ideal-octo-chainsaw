import { Controller, Get } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import {
  CoordinateDto,
  CoordinatesService,
} from '@ideal-octo-chainsaw/library';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly coordinatesService: CoordinatesService
  ) {}
  @Get('version')
  version() {
    return process.env.npm_package_version;
  }

  @Get('api')
  getData() {
    return this.appService.getData();
  }

  @MessagePattern('save-coordinate')
  async addSubscriber(
    @Payload() coordinate: CoordinateDto,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    await this.coordinatesService.insert(coordinate);
    channel.ack(originalMsg);
  }
}
