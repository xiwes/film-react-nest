import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FilmDto, ScheduleItemDto } from '../films/dto/films.dto';

interface FilmWithSchedule extends FilmDto {
  schedule: ScheduleItemDto[];
}

@Injectable()
export class FilmsRepository {
  private films: FilmWithSchedule[] = [
    {
      id: randomUUID(),
      rating: 7.8,
      director: 'Итан Райт',
      tags: ['Документальный'],
      title: 'Архитекторы общества',
      about: 'Документальный фильм об искусственном интеллекте.',
      description: 'Полное описание фильма про технологии и общество.',
      image: '/bg1s.jpg',
      cover: '/bg1c.jpg',
      schedule: [
        {
          id: randomUUID(),
          daytime: new Date().toISOString(),
          hall: '1',
          rows: 5,
          seats: 10,
          price: 350,
          taken: [],
        },
      ],
    },
  ];

  findAll(): FilmDto[] {
    return this.films.map((film) => ({
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

  findById(id: string): FilmWithSchedule | undefined {
    return this.films.find((f) => f.id === id);
  }

  findSchedule(filmId: string): ScheduleItemDto[] | undefined {
    return this.findById(filmId)?.schedule;
  }

  findSession(filmId: string, sessionId: string): ScheduleItemDto | undefined {
    return this.findSchedule(filmId)?.find((s) => s.id === sessionId);
  }
}
