import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Film } from './film.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  daytime: string;

  @Column('integer')
  hall: number;

  @Column('integer')
  rows: number;

  @Column('integer')
  seats: number;

  @Column('double precision')
  price: number;

  @Column('text', { array: true, default: () => "'{}'" })
  taken: string[];

  @Column({ name: 'film_id', type: 'uuid' })
  filmId: string;

  @ManyToOne(() => Film, (film) => film.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'film_id' })
  film: Film;
}
