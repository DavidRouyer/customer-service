import { AwilixContainer } from 'awilix';

import { Session } from '@cs/auth';

export type Context = {
  container: AwilixContainer;
  session: Session | null;
};
