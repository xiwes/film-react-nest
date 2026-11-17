import { ConfigService } from '@nestjs/config';

export interface AppConfigDatabase {
  driver: string;
  url: string;
  username: string;
  password: string;
}

export interface AppConfig {
  database: AppConfigDatabase;
}

export const configProvider = {
  provide: 'CONFIG',
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AppConfig => ({
    database: {
      driver: configService.get<string>('DATABASE_DRIVER', 'postgres'),
      url: configService.getOrThrow<string>('DATABASE_URL'),
      username: configService.get<string>('DATABASE_USERNAME', ''),
      password: configService.get<string>('DATABASE_PASSWORD', ''),
    },
  }),
};
