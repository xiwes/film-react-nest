import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { FilmDto, ScheduleItemDto } from '../films/dto/films.dto';
import { FilmsRepository } from './films.repository';

@Injectable()
export class FilmsTypeOrmRepository implements FilmsRepository {
  constructor(
    @InjectRepository(Film) private readonly filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmRepository.find({ order: { title: 'ASC' } });
    return films.map((film) => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    }));
  }

  async findSchedule(filmId: string): Promise<ScheduleItemDto[] | undefined> {
    if (!isUUID(filmId)) return undefined;

    const filmExists = await this.filmRepository.existsBy({ id: filmId });
    if (!filmExists) return undefined;

    const schedules = await this.scheduleRepository.find({
      where: { filmId },
      order: { daytime: 'ASC' },
    });
    return schedules.map((item) => this.toScheduleItem(item));
  }

  async findSession(
    filmId: string,
    sessionId: string,
  ): Promise<ScheduleItemDto | undefined> {
    if (!isUUID(filmId) || !isUUID(sessionId)) return undefined;

    const session = await this.scheduleRepository.findOneBy({
      id: sessionId,
      filmId,
    });
    return session ? this.toScheduleItem(session) : undefined;
  }

  async addTakenSeat(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<boolean> {
    if (!isUUID(filmId) || !isUUID(sessionId)) return false;

    const result = await this.scheduleRepository
      .createQueryBuilder()
      .update(Schedule)
      .set({ taken: () => 'array_append(taken, :seatKey)' })
      .where('id = :sessionId AND film_id = :filmId', { sessionId, filmId })
      .andWhere('NOT (:seatKey = ANY(taken))')
      .setParameter('seatKey', seatKey)
      .execute();
    return result.affected === 1;
  }

  async releaseTakenSeat(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<void> {
    if (!isUUID(filmId) || !isUUID(sessionId)) return;

    await this.scheduleRepository
      .createQueryBuilder()
      .update(Schedule)
      .set({ taken: () => 'array_remove(taken, :seatKey)' })
      .where('id = :sessionId AND film_id = :filmId', { sessionId, filmId })
      .setParameter('seatKey', seatKey)
      .execute();
  }

  private toScheduleItem(item: Schedule): ScheduleItemDto {
    return {
      id: item.id,
      daytime: item.daytime,
      hall: item.hall,
      rows: item.rows,
      seats: item.seats,
      price: item.price,
      taken: item.taken,
    };
  }
}
