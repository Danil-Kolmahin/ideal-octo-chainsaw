import {
  Body,
  Controller,
  Get,
  Inject,
  ParseArrayPipe,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { AppService } from './app.service';
import { CoordinateDto } from './coordinate.dto';
import { CoordinatesService } from './coordinates.service';

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
  async addCoordinate(
    @Body(new ParseArrayPipe({ items: CoordinateDto }))
    coordinates: CoordinateDto[]
  ) {
    await Promise.all(
      coordinates.map((coordinate) =>
        this.coordinatesService.insert(coordinate)
      )
    );
    console.log({ key: 'value' });
    this.messageBroker.emit('test-pattern', { key: 'value' });
  }
}
