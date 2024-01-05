import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index(['latitude', 'longitude', 'altitude', 'mapId'], { unique: true })
export class Coordinate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', nullable: false, update: false })
  latitude: number;

  @Column({ type: 'float', nullable: false, update: false })
  longitude: number;

  @Column({ type: 'float', nullable: false, update: false })
  altitude: number;

  @Column({ type: 'int', default: 1, insert: false })
  occurrenceCount: number;

  @Column({ type: 'varchar', nullable: false, update: false })
  mapId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
