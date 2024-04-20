import { AwilixContainer } from 'awilix';
import DataLoader from 'dataloader';

import { Session } from '@cs/auth';
import { User } from '@cs/kyaku/models';

import { LabelType } from '../entities/label-type';

export type Context = {
  container: AwilixContainer;
  dataloaders: {
    labelTypeLoader: DataLoader<string, LabelType, string>;
    userLoader: DataLoader<string, User, string>;
  };
  session: Session | null;
};
