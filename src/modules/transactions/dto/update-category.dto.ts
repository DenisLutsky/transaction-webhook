import { IsOptional } from 'class-validator';

import { CategoryDto } from './category.dto';

export class UpdateCategoryDto extends CategoryDto {
  @IsOptional()
  public title: string;
}
