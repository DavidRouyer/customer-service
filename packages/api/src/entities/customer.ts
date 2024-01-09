import { InferInsertModel, InferSelectModel, schema } from '@cs/database';
import { FindConfig, SortDirection } from '@cs/kyaku/types';
import { GetConfig } from '@cs/kyaku/types/query';

export type Customer = InferSelectModel<typeof schema.customers>;
export type CustomerInsert = InferInsertModel<typeof schema.customers>;
export type GetCustomerConfig = GetConfig<CustomerRelations>;
export type CustomerRelations = {
  createdBy?: boolean;
  updatedBy?: boolean;
};
export type FindCustomerConfig = FindConfig<CustomerRelations, CustomerSort>;

export type CustomerSort =
  | { createdAt: SortDirection }
  | { name: SortDirection };
