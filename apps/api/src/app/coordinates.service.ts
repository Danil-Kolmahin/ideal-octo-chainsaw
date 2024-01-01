import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CoordinateDto } from './coordinate.dto';
import { Coordinate } from './coordinate.entity';

@Injectable()
export class CoordinatesService {
  constructor(
    @InjectRepository(Coordinate)
    private coordinatesRepository: Repository<Coordinate>
  ) {}

  findByMapId(mapId: string): Promise<Coordinate[]> {
    return this.coordinatesRepository.findBy({ mapId });
  }

  findOne(coordinate: CoordinateDto): Promise<Coordinate | null> {
    return this.coordinatesRepository.findOneBy(coordinate);
  }

  async insert(coordinate: CoordinateDto): Promise<void> {
    const existingOne = await this.findOne(coordinate);
    if (existingOne) {
      await this.coordinatesRepository.update(coordinate, {
        occurrenceCount: existingOne.occurrenceCount + 1,
      });
    } else {
      await this.coordinatesRepository.insert(coordinate);
    }
  }

  async delete(id: number): Promise<void> {
    await this.coordinatesRepository.delete(id);
  }
}
