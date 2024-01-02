import { Body, Controller, Get, Inject, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { CoordinateDto } from './coordinate.dto';
import { CoordinatesService } from './coordinates.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly coordinatesService: CoordinatesService,
    @Inject('message-broker') private readonly messageBroker: ClientProxy
  ) {}
  @Get('version')
  version() {
    return process.env.npm_package_version;
  }

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('coordinates')
  getCoordinates() {
    return this.coordinatesService.findByMapId('test');
  }

  @Post('coordinates')
  async addCoordinate(@Body() coordinate: CoordinateDto) {
    await this.coordinatesService.insert(coordinate);
    console.log({ key: 'value' });
    this.messageBroker.emit('test-pattern', { key: 'value' });
  }
}
