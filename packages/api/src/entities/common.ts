export type WithConfig<TRelations, TSort> = {
  skip?: string;
  take?: number;
  relations: TRelations;
  sortBy?: TSort;
};
