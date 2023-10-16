import { Module } from '@nestjs/common';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from './score.entitiy';

@Module({
  imports: [TypeOrmModule.forFeature([Score])],
  controllers: [ScoreController],
  providers: [ScoreService],
})
export class ScoreModule {}
