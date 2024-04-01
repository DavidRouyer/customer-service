export type GetConfig<TRelations> = {
  relations?: TRelations;
};
export enum Direction {
  Forward = 'forward',
  Backward = 'backward',
}

export type FindConfig<TRelations, TSort> = {
  cursor?: string;
  limit: number;
  direction: Direction;
  relations?: TRelations;
  sortBy?: TSort;
};
