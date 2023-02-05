import { IsDefined } from 'class-validator';
import { BankDto } from './bank.dto';

export class CreateBankDto extends BankDto {
  @IsDefined()
  public title: string;
}
