import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MovieDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  releaseYear: number;

  @IsNotEmpty()
  @IsString()
  genreName: string;
}
