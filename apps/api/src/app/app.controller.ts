import { Body, Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { CoordinateDto } from './coordinate.dto';
import { CoordinatesService } from './coordinates.service';

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

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('coordinates')
  getCoordinates() {
    return this.coordinatesService.findByMapId('test');
  }

  @Post('coordinates')
  addCoordinate(@Body() coordinate: CoordinateDto) {
    return this.coordinatesService.insert(coordinate);
  }
}
