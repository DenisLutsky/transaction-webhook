import { IsString, Length } from 'class-validator';

export class CategoryDto {
  @IsString()
  @Length(1, 128)
  public title: string;
}
