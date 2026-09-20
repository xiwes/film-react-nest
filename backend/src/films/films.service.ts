import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { FilmsListDto, FilmScheduleDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async getAllFilms(): Promise<FilmsListDto> {
    const items = await this.filmsRepository.findAll();
    return { total: items.length, items };
  }

  async getSchedule(filmId: string): Promise<FilmScheduleDto> {
    const schedule = await this.filmsRepository.findSchedule(filmId);
    if (!schedule) {
      throw new NotFoundException(`Film with id ${filmId} not found`);
    }
    return { total: schedule.length, items: schedule };
  }
}
