import { Body, Controller, Put } from '@nestjs/common';
import { ScoreService } from './score.service';
import { CreateScoreDto } from './dto/create-score.dto';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Put('add')
  async createScore(@Body() data: CreateScoreDto) {
    this.scoreService.create(data);
  }
}
