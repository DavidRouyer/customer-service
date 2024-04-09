export type GetConfig<TRelations> = {
  relations?: TRelations;
};
export enum Direction {
  Forward = 'forward',
  Backward = 'backward',
}

export type FindConfig<TRelations, TSortField> = {
  cursor?: {
    lastId: string;
    lastValue: string;
  };
  limit: number;
  direction: Direction;
  relations?: TRelations;
  sortBy?: TSortField;
};
