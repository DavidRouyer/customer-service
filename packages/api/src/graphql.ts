import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { asClass, asValue, createContainer } from 'awilix';
import DataLoader from 'dataloader';
import type { YogaInitialContext } from 'graphql-yoga';
import { default as jwt } from 'jsonwebtoken';

import { Auth, authOptions } from '@cs/auth';
import {
  CustomerRepository,
  dbConnection,
  LabelRepository,
  LabelTypeRepository,
  TicketRepository,
  TicketTimelineRepository,
  UserRepository,
} from '@cs/database';
import type { User } from '@cs/kyaku/models';

import { commonModule } from './modules/common/resolvers';
import { customerModule } from './modules/customer/resolvers';
import { labelTypeModule } from './modules/label-type/resolvers';
import { labelModule } from './modules/label/resolvers';
import { ticketModule } from './modules/ticket/resolvers';
import { userModule } from './modules/user/resolvers';
import CustomerService from './services/customer';
import LabelService from './services/label';
import LabelTypeService from './services/label-type';
import TicketService from './services/ticket';
import TicketTimelineService from './services/ticket-timeline';
import UserService from './services/user';
import { UnitOfWork } from './unit-of-work';

interface Services {
  dbConnection: typeof dbConnection;
  unitOfWork: UnitOfWork;
  customerRepository: CustomerRepository;
  labelRepository: LabelRepository;
  labelTypeRepository: LabelTypeRepository;
  ticketRepository: TicketRepository;
  ticketTimelineRepository: TicketTimelineRepository;
  userRepository: UserRepository;
  customerService: CustomerService;
  labelService: LabelService;
  labelTypeService: LabelTypeService;
  ticketService: TicketService;
  ticketTimelineService: TicketTimelineService;
  userService: UserService;
}

const container = createContainer<Services>();
container.register({
  dbConnection: asValue(dbConnection),
  unitOfWork: asClass(UnitOfWork).scoped(),
  customerRepository: asClass(CustomerRepository).scoped(),
  labelRepository: asClass(LabelRepository).scoped(),
  labelTypeRepository: asClass(LabelTypeRepository).scoped(),
  ticketRepository: asClass(TicketRepository).scoped(),
  ticketTimelineRepository: asClass(TicketTimelineRepository).scoped(),
  userRepository: asClass(UserRepository).scoped(),
  customerService: asClass(CustomerService).scoped(),
  labelTypeService: asClass(LabelTypeService).scoped(),
  labelService: asClass(LabelService).scoped(),
  ticketService: asClass(TicketService).scoped(),
  ticketTimelineService: asClass(TicketTimelineService).scoped(),
  userService: asClass(UserService).scoped(),
});

const getUser = async (request: Request) => {
  const url = new URL('/api/auth/session', request.url);
  const response = await Auth(
    new Request(url, { headers: request.headers }),
    authOptions
  );
  const { status = 200 } = response;

  const data = await response.json();
  if (status === 200 && data && Object.keys(data).length && data.user) {
    return data.user as User;
  }

  const header = request.headers.get('authorization');
  if (header !== null) {
    const token = header.split(' ')[1];
    if (token === undefined || process.env.JWT_SECRET === undefined) {
      return null;
    }
    const tokenPayload = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as jwt.JwtPayload;

    const userId = tokenPayload.userId as string | undefined;
    if (typeof userId !== 'string') {
      return null;
    }
    const userService = container.resolve('userService');
    return (await userService.retrieve(userId)) ?? null;
  }

  return null;
};

const getContext = async (initialContext: YogaInitialContext) => ({
  container,
  dataloaders: {
    customerLoader: new DataLoader(async (ids: readonly string[]) => {
      const customerService = container.resolve('customerService');
      const rows = await customerService.list({
        customerIds: {
          in: [...ids],
        },
      });
      return ids.map(
        (id) =>
          rows.find((row) => row.id === id) ?? new Error(`Row not found: ${id}`)
      );
    }),
    labelLoader: new DataLoader(async (ids: readonly string[]) => {
      const labelService = container.resolve('labelService');
      const rows = await labelService.list({
        labelIds: {
          in: [...ids],
        },
      });
      return ids.map(
        (id) =>
          rows.find((row) => row.id === id) ?? new Error(`Row not found: ${id}`)
      );
    }),
    labelTypeLoader: new DataLoader(async (ids: readonly string[]) => {
      const labelTypeService = container.resolve('labelTypeService');
      const rows = await labelTypeService.list({
        labelTypeIds: {
          in: [...ids],
        },
      });
      return ids.map(
        (id) =>
          rows.find((row) => row.id === id) ?? new Error(`Row not found: ${id}`)
      );
    }),
    ticketLoader: new DataLoader(async (ids: readonly string[]) => {
      const ticketService = container.resolve('ticketService');
      const rows = await ticketService.list({
        ticketIds: {
          in: [...ids],
        },
      });
      return ids.map(
        (id) =>
          rows.find((row) => row.id === id) ?? new Error(`Row not found: ${id}`)
      );
    }),
    userLoader: new DataLoader(async (ids: readonly string[]) => {
      const userService = container.resolve('userService');
      const rows = await userService.list({
        userIds: {
          in: [...ids],
        },
      });
      return ids.map(
        (id) =>
          rows.find((row) => row.id === id) ?? new Error(`Row not found: ${id}`)
      );
    }),
  },
  user: await getUser(initialContext.request),
});

export type Context = Awaited<ReturnType<typeof getContext>>;

const schema = makeExecutableSchema({
  typeDefs: mergeTypeDefs([
    commonModule.typeDefs,
    customerModule.typeDefs,
    labelModule.typeDefs,
    labelTypeModule.typeDefs,
    ticketModule.typeDefs,
    userModule.typeDefs,
  ]),
  resolvers: mergeResolvers([
    commonModule.resolvers,
    customerModule.resolvers,
    labelModule.resolvers,
    labelTypeModule.resolvers,
    ticketModule.resolvers,
    userModule.resolvers,
  ]),
});

export { getContext, schema };
