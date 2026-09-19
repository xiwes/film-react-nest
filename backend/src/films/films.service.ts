import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { FilmsListDto, FilmScheduleDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  getAllFilms(): FilmsListDto {
    const items = this.filmsRepository.findAll();
    return { total: items.length, items };
  }

  getSchedule(filmId: string): FilmScheduleDto {
    const schedule = this.filmsRepository.findSchedule(filmId);
    if (!schedule) {
      throw new NotFoundException(`Film with id ${filmId} not found`);
    }
    return { total: schedule.length, items: schedule };
  }
}
