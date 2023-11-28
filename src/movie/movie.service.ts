import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { Genre } from './genre.entity';
import { MovieDto } from './movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async createMovie(MovieDto: MovieDto): Promise<Movie> {
    const { title, releaseYear, genreName } = MovieDto;

    let genre = await this.genreRepository.findOne({
      where: { name: genreName },
    });
    if (!genre) {
      genre = this.genreRepository.create({ name: genreName });
      await this.genreRepository.save(genre);
    }

    const movie = this.movieRepository.create({ title, releaseYear, genre });
    return this.movieRepository.save(movie);
  }

  async findOneMovie(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['genre'],
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  async findAllMovies(): Promise<Movie[]> {
    return this.movieRepository.find({ relations: ['genre'] });
  }

  async updateMovie(id: number, updateMovieDto: MovieDto): Promise<Movie> {
    const { title, releaseYear, genreName } = updateMovieDto;

    let genre = await this.genreRepository.findOne({
      where: { name: genreName },
    });
    if (!genre) {
      genre = this.genreRepository.create({ name: genreName });
      await this.genreRepository.save(genre);
    }

    const movie = await this.movieRepository.findOne({
      where: { id },
    });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    movie.title = title;
    movie.releaseYear = releaseYear;
    movie.genre = genre;

    return this.movieRepository.save(movie);
  }

  async removeMovie(id: number): Promise<void> {
    const movie = await this.movieRepository.findOne({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    await this.movieRepository.remove(movie);
  }
}
