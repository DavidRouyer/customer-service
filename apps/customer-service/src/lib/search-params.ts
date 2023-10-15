import { ReadonlyURLSearchParams } from 'next/navigation';

import { TicketFilter } from '@cs/lib';

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
  if (filterParams === null || filterParams === TicketFilter.All.toString()) {
    return 'all';
  }
  if (filterParams === TicketFilter.Me.toString()) {
    return 'me';
  }
  if (filterParams === TicketFilter.Unassigned.toString()) {
    return 'unassigned';
  }
  if (filterParams === TicketFilter.Mentions.toString()) {
    return 'mentions';
  }
  const filter = parseInt(filterParams);
  if (!isNaN(filter)) {
    return filter;
  }

  return 'all';
};
