import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MovieService } from './movie.service';
import { MovieDto } from './movie.dto';
import { Movie } from './movie.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RedisUseService } from 'src/redis/redis.service';

@ApiTags('Movies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('movies')
export class MovieController {
  constructor(
    private readonly redisService: RedisUseService,
    private readonly movieService: MovieService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Movie has been successfully created.',
    type: Movie,
  })
  async create(@Body() MovieDto: MovieDto) {
    return this.movieService.createMovie(MovieDto);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Movie details by ID.', type: Movie })
  async findOne(@Param('id') id: number) {
    const cachedData = await this.redisService.get(`movie:${id}`);
    console.log('cachedData: ' + cachedData);

    if (cachedData) {
      console.log('JSON.parse(cachedData): ' + JSON.parse(cachedData));
      return JSON.parse(cachedData);
    }

    const movie = await this.movieService.findOneMovie(id);

    await this.redisService.set(`movie:${id}`, JSON.stringify(movie));

    return movie;
  }

  @Get()
  @ApiOkResponse({ description: 'List of all movies.', type: [Movie] })
  async findAll() {
    return this.movieService.findAllMovies();
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'Movie has been successfully updated.',
    type: Movie,
  })
  async update(@Param('id') id: number, @Body() updateMovieDto: MovieDto) {
    return this.movieService.updateMovie(id, updateMovieDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Movie has been successfully deleted.',
    type: Movie,
  })
  async remove(@Param('id') id: number) {
    return this.movieService.removeMovie(id);
  }
}
