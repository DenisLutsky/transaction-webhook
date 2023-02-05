import { IsOptional } from 'class-validator';
import { BankDto } from './bank.dto';

export class UpdateBankDto extends BankDto {
  @IsOptional()
  public title: string;
}
