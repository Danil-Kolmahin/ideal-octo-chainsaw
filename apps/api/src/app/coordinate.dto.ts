import { IsNumber, IsString } from 'class-validator';

export class CoordinateDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  altitude: number;

  @IsString()
  mapId: string;
}
