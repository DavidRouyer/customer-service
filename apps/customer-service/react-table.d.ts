import '@tanstack/react-table';

declare module '@tanstack/table-core' {
  type ColumnMeta<TData extends RowData, TValue> = {
    hideHeader: boolean;
  };
}
