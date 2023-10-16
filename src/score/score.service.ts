import { Injectable } from '@nestjs/common';
import { Score } from './score.entitiy';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScoreDto } from './dto/create-score.dto';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score) private scoreRepository: Repository<Score>,
  ) {}

  async create(createScoreDto: CreateScoreDto) {
    const score = await this.scoreRepository.create(createScoreDto);
    return this.scoreRepository.save(score);
  }
}
