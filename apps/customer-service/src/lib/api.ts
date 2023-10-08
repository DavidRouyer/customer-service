import { createTRPCReact } from '@trpc/react-query';

import type { AppRouter } from '@cs/api';

export const api = createTRPCReact<AppRouter>();

export { type RouterInputs, type RouterOutputs } from '@cs/api';
