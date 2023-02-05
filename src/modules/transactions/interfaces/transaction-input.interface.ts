import { TransactionTypes } from '../enums';

export interface TransactionInput {
  amount: number;
  type: TransactionTypes;
  bankId: number;
  categories?: { categoryId: number }[]; // TODO: prettify
  isDeleted?: boolean;
}
