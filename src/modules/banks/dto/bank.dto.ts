import { IsString, Length } from 'class-validator';

export class BankDto {
  @IsString()
  @Length(1, 128)
  public title: string;
}
