import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseArrayPipe,
  Post,
  Render,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import {
  CoordinateDto,
  CoordinatesService,
} from '@ideal-octo-chainsaw/library';

import { AppService } from './app.service';

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

  @Get('api')
  getData() {
    return this.appService.getData();
  }

  @Post('coordinates')
  async addCoordinate(
    @Body(new ParseArrayPipe({ items: CoordinateDto }))
    coordinates: CoordinateDto[]
  ) {
    for (const coordinate of coordinates)
      this.messageBroker.emit('save-coordinate', coordinate);
  }

  @Delete(':mapId')
  async deleteByMapId(@Param('mapId') mapId: string) {
    await this.coordinatesService.deleteByMapId(mapId);
  }

  @Get(['json', ':mapId/json'])
  indexJson(@Param('mapId') mapId?: string): Promise<{
    mapId?: string;
    mapIds: string[];
    coordinates: number[][];
  }> {
    return this.coordinatesService.indexJson(mapId);
  }

  @Get(['', ':mapId'])
  @Render('index')
  index(@Param('mapId') mapId?: string) {
    return this.indexJson(mapId);
  }
}
