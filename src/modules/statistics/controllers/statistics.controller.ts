import { Controller, Get, Query } from '@nestjs/common';

import { Statistics } from '../interfaces';
import { StatisticsParamsDto } from '../dto';
import { StatisticsService } from '../services';

@Controller('statistics')
export class StatisticsController {
  public constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  public async getStatistics(@Query() params: StatisticsParamsDto): Promise<Statistics> {
    return this.statisticsService.getStatistics(params);
  }
}
