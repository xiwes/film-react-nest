import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsListDto, FilmScheduleDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getAll(): Promise<FilmsListDto> {
    return this.filmsService.getAllFilms();
  }

  @Get(':id/schedule')
  async getSchedule(@Param('id') id: string): Promise<FilmScheduleDto> {
    return this.filmsService.getSchedule(id);
  }
}
