import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity('films')
export class Film {
  @PrimaryColumn('uuid')
  id: string;

  @Column('double precision')
  rating: number;

  @Column()
  director: string;

  @Column('text', { array: true, default: () => "'{}'" })
  tags: string[];

  @Column()
  title: string;

  @Column()
  about: string;

  @Column('text')
  description: string;

  @Column()
  image: string;

  @Column()
  cover: string;

  @OneToMany(() => Schedule, (schedule) => schedule.film)
  schedules: Schedule[];
}
