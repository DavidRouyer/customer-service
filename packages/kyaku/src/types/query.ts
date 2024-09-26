export interface GetConfig<TRelations> {
  relations?: TRelations;
}
export enum Direction {
  Forward = 'forward',
  Backward = 'backward',
}

export interface Cursor {
  lastId: string;
  lastValue: string;
}

export interface FindConfig<TRelations, TSortField> {
  cursor?: Cursor;
  limit: number;
  direction: Direction;
  relations?: TRelations;
  sortBy?: TSortField;
}
