import { TransactionTypes } from '../enums';

export interface Transaction {
  transactionId: number;
  amount: number;
  type: TransactionTypes;
  isDeleted?: boolean;
}
