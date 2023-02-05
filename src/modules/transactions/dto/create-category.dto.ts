import { IsDefined } from 'class-validator';

import { CategoryDto } from './category.dto';

export class CreateCategoryDto extends CategoryDto {
  @IsDefined()
  public title: string;
}
