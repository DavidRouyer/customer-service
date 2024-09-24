import { GraphQLError } from 'graphql';

import { TicketPriority, TimelineEntryType } from '@cs/kyaku/models';
import {
  connectionFromArray,
  validatePaginationArguments,
} from '@cs/kyaku/utils';

import { authorize } from '../../authorize';
import type { Label } from '../../entities/label';
import { TicketSortField } from '../../entities/ticket';
import type { TicketTimelineUnion } from '../../entities/ticket-timeline';
import type {
  AssignmentChangedEntry,
  ChatEntry,
  Customer,
  LabelsChangedEntry,
  NoteEntry,
  PriorityChangedEntry,
  Resolvers,
  StatusChangedEntry,
  Ticket,
  User,
} from '../../generated-types/graphql';
import type TicketService from '../../services/ticket';
import type TicketTimelineService from '../../services/ticket-timeline';
import { mapCustomer } from '../customer/resolvers';
import { handleErrors } from '../error';
import { mapLabel } from '../label/resolvers';
import typeDefs from './typeDefs';

const mapTicket = (
  ticket: Awaited<ReturnType<TicketService['list']>>[number]
): Ticket => {
  return {
    ...ticket,
    timelineEntries: {
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
    labels: [],
    assignedTo: ticket.assignedToId
      ? ({ id: ticket.assignedToId } as User)
      : null,
    customer: { id: ticket.customerId } as Customer,
    createdBy: {
      id: ticket.createdById,
    } as User,
    statusChangedBy: ticket.statusChangedById
      ? ({ id: ticket.statusChangedById } as User)
      : null,
    updatedBy: ticket.updatedById
      ? ({
          id: ticket.updatedById,
        } as User)
      : null,
  };
};

const mapTimelineEntry = (
  timelineEntry: Awaited<ReturnType<TicketTimelineService['list']>>[number]
) => {
  return {
    ...mapEntry(timelineEntry),
    customer: { id: timelineEntry.customerId } as Customer,
    customerCreatedBy: timelineEntry.customerCreatedById
      ? ({
          id: timelineEntry.customerCreatedById,
        } as Customer)
      : null,
    userCreatedBy: timelineEntry.userCreatedById
      ? ({ id: timelineEntry.userCreatedById } as User)
      : null,
  };
};

const mapEntry = (entry: TicketTimelineUnion) => {
  switch (entry.type) {
    case TimelineEntryType.AssignmentChanged:
      return {
        ...entry,
        entry: {
          oldAssignedTo: entry.entry.oldAssignedToId
            ? ({ id: entry.entry.oldAssignedToId } as User)
            : null,
          newAssignedTo: entry.entry.newAssignedToId
            ? ({ id: entry.entry.newAssignedToId } as User)
            : null,
        },
      };
    case TimelineEntryType.LabelsChanged:
      return {
        ...entry,
        entry: {
          oldLabels: entry.entry.oldLabelIds.map(
            (labelId) =>
              ({
                id: labelId,
              }) as Label
          ),
          newLabels: entry.entry.newLabelIds.map(
            (labelId) =>
              ({
                id: labelId,
              }) as Label
          ),
        },
      };
    case TimelineEntryType.Chat:
    case TimelineEntryType.Note:
    case TimelineEntryType.PriorityChanged:
    case TimelineEntryType.StatusChanged:
      return {
        ...entry,
      };
    default:
      throw new Error('Invalid timeline entry type');
  }
};

const resolvers: Resolvers = {
  Query: {
    ticket: async (_, { ticketId }, { dataloaders }) => {
      try {
        const ticket = await dataloaders.ticketLoader.load(ticketId);
        return mapTicket(ticket);
      } catch {
        return null;
      }
    },
    tickets: async (
      _,
      { filters, before, after, first, last },
      { container }
    ) => {
      const { cursor, direction, limit } = validatePaginationArguments(
        { before, after, first, last },
        { min: 1, max: 100 }
      );

      const ticketService = container.resolve('ticketService');

      const tickets = await ticketService.list(
        {
          statuses: filters?.statuses
            ? {
                in: filters.statuses,
              }
            : undefined,
          customerIds: filters?.customerIds
            ? {
                in: filters.customerIds,
              }
            : undefined,
          isAssigned: filters?.isAssigned ?? undefined,
        },
        {
          cursor: cursor ?? undefined,
          direction: direction,
          limit: limit + 1,
          sortBy: TicketSortField.createdAt,
        }
      );

      return connectionFromArray({
        array: tickets.map((ticket) => mapTicket(ticket)),
        args: { before, after, first, last },
        meta: {
          direction,
          getLastValue: (item) => item.createdAt.toISOString(),
          limit,
        },
      });
    },
  },
  Mutation: {
    assignTicket: async (_, { input }, { container, dataloaders, user }) => {
      const authorizedUser = authorize(user);

      const ticketService = container.resolve('ticketService');

      try {
        const ticket = await ticketService.assign(
          {
            ticketId: input.ticketId,
            assignedToId: input.userId,
          },
          authorizedUser.id
        );

        return {
          ticket: ticket
            ? mapTicket(await dataloaders.ticketLoader.load(ticket.id))
            : null,
        };
      } catch (error) {
        return handleErrors(error);
      }
    },
    changeTicketPriority: async (
      _,
      { input },
      { container, dataloaders, user }
    ) => {
      const authorizedUser = authorize(user);

      const ticketService = container.resolve('ticketService');

      try {
        const ticket = await ticketService.changePriority(
          {
            ticketId: input.ticketId,
            priority: input.priority,
          },
          authorizedUser.id
        );

        return {
          ticket: ticket
            ? mapTicket(await dataloaders.ticketLoader.load(ticket.id))
            : null,
        };
      } catch (error) {
        return handleErrors(error);
      }
    },
    createTicket: async (_, { input }, { container, dataloaders, user }) => {
      const authorizedUser = authorize(user);

      const ticketService = container.resolve('ticketService');

      try {
        const ticket = await ticketService.create(
          {
            ...input,
            priority: input.priority ?? TicketPriority.Medium,
          },
          authorizedUser.id
        );

        return {
          ticket: ticket
            ? mapTicket(await dataloaders.ticketLoader.load(ticket.id))
            : null,
        };
      } catch (error) {
        return handleErrors(error);
      }
    },
    createNote: async (_, { input }, { container, dataloaders, user }) => {
      const authorizedUser = authorize(user);

      const ticketService = container.resolve('ticketService');

      try {
        const ticket = await ticketService.createNote(input, authorizedUser.id);

        return {
          ticket: ticket
            ? mapTicket(await dataloaders.ticketLoader.load(ticket.id))
            : null,
        };
      } catch (error) {
        return handleErrors(error);
      }
    },
    markTicketAsDone: async (
      _,
      { input },
      { container, dataloaders, user }
    ) => {
      const authorizedUser = authorize(user);

      const ticketService = container.resolve('ticketService');

      try {
        const ticket = await ticketService.markAsDone(
          {
            ticketId: input.ticketId,
            statusDetail: input.statusDetail ?? undefined,
          },
          authorizedUser.id
        );

        return {
          ticket: ticket
            ? mapTicket(await dataloaders.ticketLoader.load(ticket.id))
            : null,
        };
      } catch (error) {
        return handleErrors(error);
      }
    },
    markTicketAsTodo: async (
      _,
      { input },
      { container, dataloaders, user }
    ) => {
      const authorizedUser = authorize(user);

      const ticketService = container.resolve('ticketService');

      try {
        const ticket = await ticketService.markAsTodo(
          {
            ticketId: input.ticketId,
            statusDetail: input.statusDetail ?? undefined,
          },
          authorizedUser.id
        );

        return {
          ticket: ticket
            ? mapTicket(await dataloaders.ticketLoader.load(ticket.id))
            : null,
        };
      } catch (error) {
        return handleErrors(error);
      }
    },
    sendChat: async (_, { input }, { container, dataloaders, user }) => {
      const authorizedUser = authorize(user);

      const ticketService = container.resolve('ticketService');

      try {
        const ticket = await ticketService.sendChat(input, authorizedUser.id);

        return {
          ticket: ticket
            ? mapTicket(await dataloaders.ticketLoader.load(ticket.id))
            : null,
        };
      } catch (error) {
        return handleErrors(error);
      }
    },
    snoozeTicket: async (_, { input }, { container, dataloaders, user }) => {
      const authorizedUser = authorize(user);

      const ticketService = container.resolve('ticketService');

      try {
        const ticket = await ticketService.snooze(
          {
            ticketId: input.ticketId,
            statusDetail: input.statusDetail ?? undefined,
          },
          authorizedUser.id
        );

        return {
          ticket: ticket
            ? mapTicket(await dataloaders.ticketLoader.load(ticket.id))
            : null,
        };
      } catch (error) {
        return handleErrors(error);
      }
    },
    unassignTicket: async (_, { input }, { container, dataloaders, user }) => {
      const authorizedUser = authorize(user);

      const ticketService = container.resolve('ticketService');

      try {
        const ticket = await ticketService.unassign(
          input.ticketId,
          authorizedUser.id
        );

        return {
          ticket: ticket
            ? mapTicket(await dataloaders.ticketLoader.load(ticket.id))
            : null,
        };
      } catch (error) {
        return handleErrors(error);
      }
    },
  },
  TimelineEntry: {
    customer: async ({ customer }, _, { dataloaders }) => {
      const c = await dataloaders.customerLoader.load(customer.id);
      return mapCustomer(c);
    },
    customerCreatedBy: async ({ customerCreatedBy }, _, { dataloaders }) => {
      if (!customerCreatedBy) {
        return null;
      }
      const c = await dataloaders.customerLoader.load(customerCreatedBy.id);
      return mapCustomer(c);
    },
    userCreatedBy: async ({ userCreatedBy }, _, { dataloaders }) => {
      if (!userCreatedBy) {
        return null;
      }
      return dataloaders.userLoader.load(userCreatedBy.id);
    },
  },
  Entry: {
    __resolveType: (obj) => {
      if (
        typeof (obj as AssignmentChangedEntry).oldAssignedTo === 'object' ||
        typeof (obj as AssignmentChangedEntry).newAssignedTo === 'object'
      ) {
        return 'AssignmentChangedEntry';
      }
      if (
        typeof (obj as ChatEntry).text === 'string' &&
        !Object.hasOwn(obj, 'rawContent')
      ) {
        return 'ChatEntry';
      }
      if (
        Array.isArray((obj as LabelsChangedEntry).oldLabels) ||
        Array.isArray((obj as LabelsChangedEntry).newLabels)
      ) {
        return 'LabelsChangedEntry';
      }
      if (
        typeof (obj as NoteEntry).text === 'string' &&
        typeof (obj as NoteEntry).rawContent === 'string'
      ) {
        return 'NoteEntry';
      }
      if (
        typeof (obj as PriorityChangedEntry).oldPriority === 'string' ||
        typeof (obj as PriorityChangedEntry).newPriority === 'string'
      ) {
        return 'PriorityChangedEntry';
      }

      if (
        typeof (obj as StatusChangedEntry).oldStatus === 'string' ||
        typeof (obj as StatusChangedEntry).newStatus === 'string'
      ) {
        return 'StatusChangedEntry';
      }
      throw new Error('Invalid entry type');
    },
  },
  AssignmentChangedEntry: {
    oldAssignedTo: async ({ oldAssignedTo }, _, { dataloaders }) => {
      if (!oldAssignedTo) {
        return null;
      }

      return dataloaders.userLoader.load(oldAssignedTo.id);
    },
    newAssignedTo: async ({ newAssignedTo }, _, { dataloaders }) => {
      if (!newAssignedTo) {
        return null;
      }
      return dataloaders.userLoader.load(newAssignedTo.id);
    },
  },
  LabelsChangedEntry: {
    oldLabels: async ({ oldLabels }, _, { dataloaders }) => {
      const labels = await dataloaders.labelLoader.loadMany(
        oldLabels.map((label) => label.id)
      );
      if (labels.some((label) => label instanceof Error)) {
        throw new GraphQLError('Failed to load labels');
      }
      const filteredLabels = labels.filter(
        (label): label is Label => !(label instanceof Error)
      );
      return filteredLabels.map((label) => mapLabel(label));
    },
    newLabels: async ({ newLabels }, _, { dataloaders }) => {
      const labels = await dataloaders.labelLoader.loadMany(
        newLabels.map((label) => label.id)
      );
      if (labels.some((label) => label instanceof Error)) {
        throw new GraphQLError('Failed to load labels');
      }
      const filteredLabels = labels.filter(
        (label): label is Label => !(label instanceof Error)
      );
      return filteredLabels.map((label) => mapLabel(label));
    },
  },
  Ticket: {
    assignedTo: async ({ assignedTo }, _, { dataloaders }) => {
      if (!assignedTo) {
        return null;
      }
      return dataloaders.userLoader.load(assignedTo.id);
    },
    createdBy: async ({ createdBy }, _, { dataloaders }) => {
      return dataloaders.userLoader.load(createdBy.id);
    },
    customer: async ({ customer }, _, { dataloaders }) => {
      const c = await dataloaders.customerLoader.load(customer.id);
      return mapCustomer(c);
    },
    labels: async ({ id }, _, { container }) => {
      const labelService = container.resolve('labelService');
      const labels = await labelService.list({
        ticketId: id,
        isArchived: false,
      });
      return labels.map((label) => mapLabel(label));
    },
    statusChangedBy: async ({ statusChangedBy }, _, { dataloaders }) => {
      if (!statusChangedBy) {
        return null;
      }
      return dataloaders.userLoader.load(statusChangedBy.id);
    },
    timelineEntries: async (
      { id },
      { before, after, first, last },
      { container }
    ) => {
      const { cursor, direction, limit } = validatePaginationArguments(
        { before, after, first, last },
        { min: 1, max: 100 }
      );

      const ticketTimelineService = container.resolve('ticketTimelineService');

      const timelineEntries = await ticketTimelineService.list(
        {
          ticketId: id,
        },
        {
          cursor: cursor ?? undefined,
          direction: direction,
          limit: limit + 1,
        }
      );

      return connectionFromArray({
        array: timelineEntries.map((timelineEntry) =>
          mapTimelineEntry(timelineEntry)
        ),
        args: { before, after, first, last },
        meta: {
          direction,
          getLastValue: (item) => item.id,
          limit,
        },
      });
    },
    updatedBy: async ({ updatedBy }, _, { dataloaders }) => {
      if (!updatedBy) {
        return null;
      }
      return dataloaders.userLoader.load(updatedBy.id);
    },
  },
};

export const ticketModule = {
  typeDefs: typeDefs,
  resolvers: resolvers,
};
