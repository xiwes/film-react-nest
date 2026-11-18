import { FilmDto, ScheduleItemDto } from '../films/dto/films.dto';

export const FILMS_REPOSITORY = Symbol('FILMS_REPOSITORY');

export interface FilmsRepository {
  findAll(): Promise<FilmDto[]>;
  findSchedule(filmId: string): Promise<ScheduleItemDto[] | undefined>;
  findSession(
    filmId: string,
    sessionId: string,
  ): Promise<ScheduleItemDto | undefined>;
  addTakenSeat(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<boolean>;
  releaseTakenSeat(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<void>;
}
