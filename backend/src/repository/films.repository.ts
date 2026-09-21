import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { Film, FilmDocument } from './schemas/film.schema';
import { FilmDto, ScheduleItemDto } from '../films/dto/films.dto';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<FilmDocument>,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmModel.find().lean().exec();
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
    const film = await this.filmModel.findOne({ id: filmId }).lean().exec();
    return film?.schedule;
  }

  async findSession(
    filmId: string,
    sessionId: string,
  ): Promise<ScheduleItemDto | undefined> {
    const schedule = await this.findSchedule(filmId);
    return schedule?.find((s) => s.id === sessionId);
  }

  async addTakenSeat(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<boolean> {
    const result = await this.filmModel.updateOne(
      {
        id: filmId,
        schedule: {
          $elemMatch: { id: sessionId, taken: { $ne: seatKey } },
        },
      },
      { $push: { 'schedule.$.taken': seatKey } },
    );
    return result.modifiedCount === 1;
  }

  async releaseTakenSeat(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<void> {
    await this.filmModel.updateOne(
      { id: filmId, 'schedule.id': sessionId },
      { $pull: { 'schedule.$.taken': seatKey } },
    );
  }

  async seedIfEmpty(): Promise<void> {
    const count = await this.filmModel.countDocuments();
    if (count > 0) return;

    await this.filmModel.create({
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
    });
  }
}
