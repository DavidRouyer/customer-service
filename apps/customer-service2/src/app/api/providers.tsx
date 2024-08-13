import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'jotai';

const createQueryClient = () => new QueryClient();

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient();
  } else {
    // Browser: use singleton pattern to keep the same query client
    return (clientQueryClientSingleton ??= createQueryClient());
  }
};

export function QueryProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Provider>{props.children}</Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
