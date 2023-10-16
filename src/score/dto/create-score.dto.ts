import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateScoreDto {
  @IsNumber()
  @IsNotEmpty()
  score: number;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsString()
  @IsNotEmpty()
  animeId: string;
}
