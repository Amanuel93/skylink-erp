

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule }  from '@nestjs/typeorm';
import { AuthModule }  from './auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject:  [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type:       'postgres',
        host:       cfg.get<string>('POSTGRES_HOST'),
        port:       cfg.get<number>('POSTGRES_PORT'),
        username:   cfg.get<string>('POSTGRES_USER'),
        password:   cfg.get<string>('POSTGRES_PASSWORD'),
        database:   cfg.get<string>('POSTGRES_DB'),
        entities:   [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,          // ← turn off auto‑sync
        migrationsRun: true,         // ← automatically run pending migrations
        migrations:  [__dirname + '/migrations/*{.ts,.js}'],
      }),
    }),

    AuthModule,
  ],
})
export class AppModule {}
