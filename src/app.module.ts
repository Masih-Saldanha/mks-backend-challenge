import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { User } from './user/user.entity';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { MovieService } from './movie/movie.service';
import { MovieController } from './movie/movie.controller';
import { Movie } from './movie/movie.entity';
import { Genre } from './movie/genre.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url:
        process.env.DB_URL ||
        'postgresql://postgres:postgres@localhost:5432/mks_db?schema=public',
      synchronize: true,
      logging: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
    }),
    ClientsModule.register([
      {
        name: 'REDIS_CLIENT',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: +process.env.REDIS_PORT || 6379,
        },
      },
    ]),
    TypeOrmModule.forFeature([User, Movie, Genre]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || '10',
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [UserController, MovieController],
  providers: [UserService, MovieService, JwtStrategy],
})
export class AppModule {}
