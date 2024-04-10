export type GetConfig<TRelations> = {
  relations?: TRelations;
};
export enum Direction {
  Forward = 'forward',
  Backward = 'backward',
}

export type Cursor = {
  lastId: string;
  lastValue: string;
};

export type FindConfig<TRelations, TSortField> = {
  cursor?: Cursor;
  limit: number;
  direction: Direction;
  relations?: TRelations;
  sortBy?: TSortField;
};
