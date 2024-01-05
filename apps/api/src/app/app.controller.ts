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

  @Get('api')
  getData() {
    return this.appService.getData();
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

  @Delete(':mapId')
  async deleteByMapId(@Param('mapId') mapId: string) {
    await this.coordinatesService.deleteByMapId(mapId);
  }

  @Get(['json', ':chosenMapId/json'])
  indexJson(@Param('chosenMapId') chosenMapId?: string): Promise<{
    chosenMapId?: string;
    mapIds: string[];
    coordinates: number[][];
  }> {
    return this.coordinatesService.indexJson(chosenMapId);
  }

  @Get(['', ':chosenMapId'])
  @Render('index')
  index(@Param('chosenMapId') chosenMapId?: string) {
    return this.indexJson(chosenMapId);
  }
}
