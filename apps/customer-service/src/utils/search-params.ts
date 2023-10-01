import { ReadonlyURLSearchParams } from 'next/navigation';

export const FILTER_QUERY_PARAM = 'filter';
export const STATUS_QUERY_PARAM = 'status';
export const ORDER_BY_QUERY_PARAM = 'orderBy';

export const getUpdatedSearchParams = (
  searchParams: ReadonlyURLSearchParams,
  key: string,
  value: string
) => {
  const updatedSeachParams = new URLSearchParams(
    Array.from(searchParams.entries())
  );

  if (updatedSeachParams.get(key) !== value) {
    updatedSeachParams.set(key, value);
  }

  return updatedSeachParams;
};

export const parseFilters = (filterParams: string | null) => {
  if (filterParams === null || filterParams === 'all') {
    return 'all';
  }
  if (filterParams === 'me') {
    return 'me';
  }
  if (filterParams === 'unassigned') {
    return 'unassigned';
  }
  const filter = parseInt(filterParams);
  if (!isNaN(filter)) {
    return filter;
  }

  return 'all';
};
