import { TimelineEntryType } from '@cs/kyaku/models';
import {
  connectionFromArray,
  validatePaginationArguments,
} from '@cs/kyaku/utils/pagination';

import { TicketTimelineUnion } from '../../entities/ticket-timeline';
import { Resolvers } from '../../generated-types/graphql';
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
  },
  // TODO
  /*Entry: {
    __resolveType: (obj) => {
      if (obj as AssignmentChangedEntry) return null;
    },
  },
  ChatEntry: {
    __isTypeOf: (obj) => obj,
  },*/
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
