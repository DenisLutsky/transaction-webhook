import { Injectable, Logger } from '@nestjs/common';

import { Statistics, StatisticsFilter } from '../interfaces';
import { TransactionsService } from 'src/modules/transactions/services';

@Injectable()
export class StatisticsService {
  private readonly logger = new Logger(StatisticsService.name);

  public constructor(private readonly transactionsService: TransactionsService) {}

  public async getStatistics(filter: StatisticsFilter): Promise<Statistics> {
    this.logger.debug(`Getting statistics for categories: ${filter.categoryIds.join(', ')}`);

    const { categoryIds, fromPeriod, toPeriod } = filter;

    const categories = categoryIds.map((id) => ({ categoryId: id }));

    const transactions = await this.transactionsService.findTransactionsByDate({ categories, fromPeriod, toPeriod });

    const statistics: Statistics = {};

    for (const transaction of transactions) {
      const categories = transaction.categories.getItems();

      categories.forEach((category) => {
        if (!statistics[category.title]) {
          statistics[category.title] = 0;
        }

        statistics[category.title] += Number(transaction.amount);
      });
    }

    return statistics;
  }
}
