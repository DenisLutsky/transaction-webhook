import { IsISO8601, IsInt, IsPositive } from 'class-validator';
import { StringToArray } from 'shared/decorators';

export class StatisticsParamsDto {
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @StringToArray()
  public categoryIds: number[];

  @IsISO8601()
  public fromPeriod: string;

  @IsISO8601()
  public toPeriod: string;
}
