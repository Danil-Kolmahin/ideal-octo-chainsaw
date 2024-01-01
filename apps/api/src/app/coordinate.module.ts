import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Coordinate } from './coordinate.entity';
import { CoordinatesService } from './coordinates.service';

@Module({
  imports: [TypeOrmModule.forFeature([Coordinate])],
  providers: [CoordinatesService],
  exports: [CoordinatesService],
})
export class CoordinatesModule {}
