import { Controller, Get, Query } from '@nestjs/common';
import { AnalysisService } from './analysis.service';

@Controller('analysis')
export class AnalysisController {
  constructor(private analysisService: AnalysisService) {}

  @Get('/parse/list')
  async parseRss(@Query('url') url: string) {
    const data = await this.analysisService.parseRssList(url);
    return data;
  }

  @Get('/parse/html')
  async parseHtml(@Query('url') url: string) {
    const data = await this.analysisService.parseHtml(url);
    return data;
  }
}
