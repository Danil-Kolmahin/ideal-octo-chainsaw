import { Controller, Get } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

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

  @MessagePattern('test-pattern')
  addSubscriber(@Payload() data, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    console.log(data);
    channel.ack(originalMsg);
  }
}
