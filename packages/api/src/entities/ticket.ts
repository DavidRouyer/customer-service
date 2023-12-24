import { db, InferSelectModel, schema } from '@cs/database';

export enum SortDirection {
  'ASC' = 'ASC',
  'DESC' = 'DESC',
}

export type FilterOperator<T> = { lt: T } | { gt: T } | { lte: T } | { gte: T };

export type Ticket = InferSelectModel<typeof schema.tickets>;
export type TicketRelations = NonNullable<
  Parameters<(typeof db)['query']['tickets']['findFirst']>[0]
>['with'];

export type TicketSort =
  | { priority: SortDirection }
  | { createdAt: SortDirection };

export type WithConfig<TRelations> = {
  skip?: string;
  take?: number;
  relations: TRelations;
  sortBy?: TicketSort;
};
