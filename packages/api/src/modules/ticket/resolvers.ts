import { TimelineEntryType } from '@cs/kyaku/models';
import {
  connectionFromArray,
  validatePaginationArguments,
} from '@cs/kyaku/utils/pagination';

import { TicketSortField } from '../../entities/ticket';
import { TicketTimelineUnion } from '../../entities/ticket-timeline';
import {
  AssignmentChangedEntry,
  ChatEntry,
  LabelsChangedEntry,
  NoteEntry,
  PriorityChangedEntry,
  Resolvers,
  StatusChangedEntry,
} from '../../generated-types/graphql';
import TicketService from '../../services/ticket';
import TicketTimelineService from '../../services/ticket-timeline';
import typeDefs from './typeDefs.graphql';

const mapEntry = (entry: TicketTimelineUnion) => {
  switch (entry.type) {
    case TimelineEntryType.AssignmentChanged:
      return {
        ...entry,
        entry: {
          oldAssignedTo: entry.entry.oldAssignedToId
            ? { id: entry.entry.oldAssignedToId }
            : null,
          newAssignedTo: entry.entry.newAssignedToId
            ? { id: entry.entry.newAssignedToId }
            : null,
        },
      };
    case TimelineEntryType.LabelsChanged:
      return {
        ...entry,
        entry: {
          oldLabels: entry.entry.oldLabelIds.map((labelId) => ({
            id: labelId,
          })),
          newLabels: entry.entry.newLabelIds.map((labelId) => ({
            id: labelId,
          })),
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
    ticket: async (_, { id }, { dataloaders }) => {
      try {
        const ticket = await dataloaders.ticketLoader.load(id);
        return {
          ...ticket,
          timelineEntries: {
            edges: [],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
            },
          },
          assignedTo: ticket.assignedToId ? { id: ticket.assignedToId } : null,
          customer: { id: ticket.customerId },
          createdBy: {
            id: ticket.createdById,
          },
          statusChangedBy: ticket.statusChangedById
            ? { id: ticket.statusChangedById }
            : null,
          updatedBy: ticket.updatedById
            ? {
                id: ticket.updatedById,
              }
            : null,
        };
      } catch (error) {
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

      const ticketService: TicketService = container.resolve('ticketService');

      const tickets = await ticketService.list(
        {
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
        array: tickets.map((ticket) => ({
          ...ticket,
          timelineEntries: {
            edges: [],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
            },
          },
          assignedTo: ticket.assignedToId ? { id: ticket.assignedToId } : null,
          customer: { id: ticket.customerId },
          createdBy: {
            id: ticket.createdById,
          },
          statusChangedBy: ticket.statusChangedById
            ? { id: ticket.statusChangedById }
            : null,
          updatedBy: ticket.updatedById
            ? {
                id: ticket.updatedById,
              }
            : null,
        })),
        args: { before, after, first, last },
        meta: {
          direction,
          getLastValue: (item) => item.createdAt.toISOString(),
          limit,
        },
      });
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
      return (
        await dataloaders.labelLoader.loadMany(
          oldLabels.map((label) => label.id)
        )
      ).map((label) => ({
        ...label,
        labelType: {
          id: label.labelTypeId,
        },
      }));
    },
    newLabels: async ({ newLabels }, _, { dataloaders }) => {
      return Promise.all(
        newLabels.map((label) => dataloaders.labelLoader.load(label.id))
      );
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
      return dataloaders.userLoader.load(customer.id);
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

      const ticketTimelineService: TicketTimelineService = container.resolve(
        'ticketTimelineService'
      );

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
        array: timelineEntries.map((timelineEntry) => mapEntry(timelineEntry)),
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
