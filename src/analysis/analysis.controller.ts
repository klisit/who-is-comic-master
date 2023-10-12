import { Controller, Get, Query, UseFilters, UseGuards } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { AdminGuard } from 'src/guards/admin/admin.guard';

@ApiTags('analysis')
@Controller('analysis')
@UseFilters(new TypeormFilter())
export class AnalysisController {
  constructor(private analysisService: AnalysisService) {}

  @Get('/parse/list')
  async parseRss(@Query('url') url: string) {
    const data = await this.analysisService.parseRssList(url);
    return data;
  }

  // @UseGuards(AdminGuard)
  // @ApiBearerAuth()
  @Get('/parse/html')
  async parseHtml(@Query('url') url: string) {
    const data = await this.analysisService.carete(url);
    return data;
  }

  @Get('/parse')
  async getHtml(@Query('url') url: string) {
    const data = await this.analysisService.findOne(url);
    return data;
  }
}
