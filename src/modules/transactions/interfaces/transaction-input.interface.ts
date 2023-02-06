import { TransactionTypes } from '../enums';

// TODO: prettify
export interface TransactionInput {
  amount: number;
  type: TransactionTypes;
  bankId: number;
  categories?: { categoryId: number }[];
  isDeleted?: boolean;
  fromPeriod?: string; // date ISO 8601 string
  toPeriod?: string; // date ISO 8601 string
}
