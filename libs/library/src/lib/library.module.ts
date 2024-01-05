import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Coordinate } from './database/coordinate.entity';
import { CoordinatesService } from './services/coordinates.service';

@Module({
  imports: [TypeOrmModule.forFeature([Coordinate])],
  providers: [CoordinatesService],
  exports: [CoordinatesService],
})
export class LibraryModule {}
