import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';

import { CustomRequest } from 'shared/interfaces';
import { AuthGuard } from 'shared/guards';
import { Statistics } from '../interfaces';
import { StatisticsParamsDto } from '../dto';
import { StatisticsService } from '../services';

@UseGuards(AuthGuard)
@Controller('statistics')
export class StatisticsController {
  public constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  public async getStatistics(
    @Req() { user }: CustomRequest,
    @Query() params: StatisticsParamsDto,
  ): Promise<Statistics> {
    return this.statisticsService.getStatistics(params, user);
  }
}
