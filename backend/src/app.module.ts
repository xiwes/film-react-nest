import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';

import { FilmsController } from './films/films.controller';
import { FilmsService } from './films/films.service';
import { Film } from './films/entities/film.entity';
import { Schedule } from './films/entities/schedule.entity';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { FILMS_REPOSITORY } from './repository/films.repository';
import { FilmsTypeOrmRepository } from './repository/films.typeorm.repository';
import { OrderRepository } from './repository/order.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const driver = configService.get<string>('DATABASE_DRIVER');
        if (driver !== 'postgres') {
          throw new Error(
            `Unsupported DATABASE_DRIVER "${driver}", expected "postgres"`,
          );
        }

        const url = new URL(configService.getOrThrow<string>('DATABASE_URL'));
        return {
          type: 'postgres' as const,
          host: url.hostname,
          port: Number(url.port) || 5432,
          database: url.pathname.replace(/^\//, ''),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          entities: [Film, Schedule],
          synchronize: false,
        };
      },
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
  ],
  controllers: [FilmsController, OrderController],
  providers: [
    configProvider,
    FilmsService,
    OrderService,
    { provide: FILMS_REPOSITORY, useClass: FilmsTypeOrmRepository },
    OrderRepository,
  ],
})
export class AppModule {}
