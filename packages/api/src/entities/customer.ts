import { db, InferInsertModel, InferSelectModel, schema } from '@cs/database';
import { FindConfig, SortDirection } from '@cs/kyaku/types';
import { GetConfig } from '@cs/kyaku/types/query';

export type Customer = InferSelectModel<typeof schema.customers>;
export type CustomerInsert = InferInsertModel<typeof schema.customers>;
export type DbCustomerRelations = NonNullable<
  Parameters<(typeof db)['query']['customers']['findFirst']>[0]
>['with'];
export type GetCustomerConfig = GetConfig<CustomerRelations>;
export type CustomerRelations = {
  createdBy?: boolean;
  updatedBy?: boolean;
};
export type FindCustomerConfig = FindConfig<CustomerRelations, CustomerSort>;

export type CustomerSort =
  | { createdAt: SortDirection }
  | { name: SortDirection };
