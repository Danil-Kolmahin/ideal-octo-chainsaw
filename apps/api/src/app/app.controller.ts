import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Inject,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Query,
  Render,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import {
  BasicAuthGuard,
  CoordinateDto,
  CoordinatesService,
} from '@ideal-octo-chainsaw/library';

import { AppService } from './app.service';

@Controller()
@UseGuards(BasicAuthGuard)
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

  @Post()
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
  indexJson(
    @Param('mapId') mapId?: string,
    @Query('longitude', new DefaultValuePipe(0), ParseIntPipe)
    longitude?: number
  ): Promise<{
    mapId: string;
    mapIds: string[];
    coordinates: number[][];
  }> {
    return this.coordinatesService.indexJson({ mapId, longitude });
  }

  @Get(['', ':mapId'])
  @Render('index')
  index(
    @Param('mapId') mapId?: string,
    @Query('longitude', new DefaultValuePipe(0), ParseIntPipe)
    longitude?: number
  ) {
    return this.indexJson(mapId, longitude);
  }
}
