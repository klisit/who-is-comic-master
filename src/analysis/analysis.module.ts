import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { Anime } from './anime.entitiy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Anime]),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty', //打印日志样式优化
          options: {
            colorize: true,
          },
        },
      },
    }),
  ],
  providers: [AnalysisService],
  controllers: [AnalysisController],
  exports: [AnalysisService],
})
export class AnalysisModule {}
