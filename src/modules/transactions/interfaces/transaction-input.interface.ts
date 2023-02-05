import { TransactionTypes } from '../enums';

export interface TransactionInput {
  amount: number;
  type: TransactionTypes;
  bankId: number;
  isDeleted?: boolean;
}
