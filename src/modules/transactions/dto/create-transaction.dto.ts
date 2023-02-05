import { IsEnum, IsInt, IsPositive } from 'class-validator';
import { TransactionTypes } from '../enums';

export class CreateTransactionDto {
  @IsInt()
  @IsPositive()
  public bankId: number;

  @IsInt()
  public amount: number;

  @IsEnum(TransactionTypes)
  public type: TransactionTypes;
}
