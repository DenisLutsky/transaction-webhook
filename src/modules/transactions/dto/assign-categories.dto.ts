import { IsInt, IsPositive } from 'class-validator';

export class AssignCategoriesDto {
  @IsInt({ each: true })
  @IsPositive({ each: true })
  public categoryIds: number[];
}
