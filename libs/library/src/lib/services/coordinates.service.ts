import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CoordinateDto } from '../dto/coordinate.dto';
import { Coordinate } from '../database/coordinate.entity';

@Injectable()
export class CoordinatesService {
  constructor(
    @InjectRepository(Coordinate)
    private coordinatesRepository: Repository<Coordinate>
  ) {}

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

  async indexJson({
    mapId,
    longitude,
  }: {
    mapId?: string;
    longitude?: number;
  }): Promise<{
    mapId: string;
    mapIds: string[];
    coordinates: number[][];
  }> {
    const result = await this.coordinatesRepository
      .createQueryBuilder('coordinate')
      .select('coordinate.mapId', 'mapId')
      .distinct(true)
      .getRawMany();
    const mapIds = result.map((item) => item.mapId);

    if (!mapId) [mapId] = mapIds;

    const entities = await this.coordinatesRepository.find({
      where: { mapId: 'example', longitude: Number(longitude || 0) },
      select: { altitude: true, occurrenceCount: true, latitude: true },
    });
    const coordinates = Array(500).fill(null);
    for (const { altitude, occurrenceCount, latitude } of entities) {
      coordinates[latitude] = occurrenceCount > 1 ? altitude : -altitude - 1;
    }

    return {
      mapId: mapId as string,
      mapIds,
      coordinates,
    };
  }
}
