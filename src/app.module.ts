import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from '@liaoliaots/nestjs-redis';

import { User } from './user/user.entity';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { MovieService } from './movie/movie.service';
import { MovieController } from './movie/movie.controller';
import { Movie } from './movie/movie.entity';
import { Genre } from './movie/genre.entity';
import { RedisConfigService } from './redis/redis-config.service';
import { RedisUseService } from './redis/redis.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      ssl: true,
      url:
        process.env.DB_URL ||
        'postgresql://postgres:postgres@localhost:5432/mks_db?schema=public',
      synchronize: true,
      logging: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
    }),
    TypeOrmModule.forFeature([User, Movie, Genre]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || '10',
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    RedisModule.forRootAsync({
      useClass: RedisConfigService,
    }),
  ],
  controllers: [UserController, MovieController],
  providers: [
    UserService,
    MovieService,
    RedisConfigService,
    RedisUseService,
    JwtStrategy,
  ],
})
export class AppModule {}
