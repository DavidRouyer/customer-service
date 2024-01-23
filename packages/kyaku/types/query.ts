export type GetConfig<TRelations> = {
  relations?: TRelations;
};
export type FindConfig<TRelations, TSort> = {
  skip?: string;
  take?: number;
  relations: TRelations;
  sortBy?: TSort;
};
