import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Coordinate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', nullable: false, update: false })
  latitude: number;

  @Column({ type: 'float', nullable: false, update: false })
  longitude: number;

  @Column({ type: 'float', nullable: false, update: false })
  altitude: number;

  @Column({ type: 'int', default: 0, insert: false })
  occurrenceCount: number;

  @Column({ type: 'varchar', nullable: false, update: false })
  mapId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
