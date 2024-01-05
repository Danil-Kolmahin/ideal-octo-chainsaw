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

  async findAltitudeMatrixByMapId(mapId: string): Promise<number[][]> {
    const coordinates = await this.coordinatesRepository.find({
      where: { mapId },
      select: { altitude: true },
      order: { latitude: 'ASC', longitude: 'ASC' },
    });
    const matrix = [];
    const matrixSize = Math.sqrt(coordinates.length);
    for (let i = 0; i < matrixSize; i++) {
      matrix.push(
        coordinates
          .slice(i * matrixSize, i * matrixSize + matrixSize)
          .map(({ altitude }) => altitude)
      );
    }
    return matrix;
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

  async deleteByMapId(mapId: string): Promise<void> {
    await this.coordinatesRepository.delete({ mapId });
  }

  async indexJson(chosenMapId?: string): Promise<{
    chosenMapId?: string;
    mapIds: string[];
    coordinates: number[][];
  }> {
    const result = await this.coordinatesRepository
      .createQueryBuilder('coordinate')
      .select('coordinate.mapId', 'mapId')
      .distinct(true)
      .getRawMany();
    const mapIds = result.map((item) => item.mapId);
    if (!chosenMapId) [chosenMapId] = mapIds;
    const coordinates = await this.findAltitudeMatrixByMapId(chosenMapId);
    return {
      chosenMapId,
      mapIds,
      coordinates,
    };
  }
}
