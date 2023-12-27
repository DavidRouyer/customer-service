import {
  and,
  DataSource,
  desc,
  eq,
  InferSelectModel,
  schema,
} from '@cs/database';
import {
  TicketAssignmentChanged,
  TicketChat,
  TicketLabelsChanged,
  TicketNote,
  TicketPriorityChanged,
  TicketStatusChanged,
  TicketTimelineEntryType,
} from '@cs/lib/ticketTimelineEntries';
import { User } from '@cs/lib/users';

import { WithConfig } from '../entities/ticket';
import {
  TicketTimelineRelations,
  TicketTimelineSort,
} from '../entities/ticket-timeline';
import LabelService from './label';
import { sortDirection } from './ticket';
import UserService from './user';

export type TicketAssignmentChangedWithData = {
  oldAssignedTo?: User | null;
  newAssignedTo?: User | null;
} & TicketAssignmentChanged;

export type TicketLabelsChangedWithData = {
  oldLabels?: (InferSelectModel<typeof schema.labels> & {
    labelType: InferSelectModel<typeof schema.labelTypes>;
  })[];
  newLabels?: (InferSelectModel<typeof schema.labels> & {
    labelType: InferSelectModel<typeof schema.labelTypes>;
  })[];
} & TicketLabelsChanged;

export default class TicketTimelineService {
  private readonly dataSource: DataSource;
  private readonly labelService: LabelService;
  private readonly userService: UserService;

  constructor({
    dataSource,
    labelService,
    userService,
  }: {
    dataSource: DataSource;
    labelService: LabelService;
    userService: UserService;
  }) {
    this.dataSource = dataSource;
    this.labelService = labelService;
    this.userService = userService;
  }

  async list<T extends TicketTimelineRelations>(
    filters: { ticketId: string },
    config: WithConfig<T, TicketTimelineSort> = {
      relations: {} as T,
    }
  ) {
    const ticketTimelineEntries =
      await this.dataSource.query.ticketTimelineEntries.findMany({
        where: eq(schema.ticketTimelineEntries.ticketId, filters.ticketId),
        with: config.relations,
        limit: config.take,
        orderBy: and(
          config.sortBy
            ? 'createdAt' in config.sortBy
              ? sortDirection(config.sortBy.createdAt)(
                  schema.ticketTimelineEntries.createdAt
                )
              : undefined
            : undefined,
          config.skip ? desc(schema.tickets.id) : undefined
        ),
      });
    const augmentedTicketTimelineEntries: (Omit<
      (typeof ticketTimelineEntries)[0],
      'entry'
    > & {
      entry:
        | TicketAssignmentChangedWithData
        | TicketChat
        | TicketLabelsChangedWithData
        | TicketNote
        | TicketPriorityChanged
        | TicketStatusChanged
        | null;
    })[] = [];

    const usersToFetch = new Set<string>();
    const labelsToFetch = new Set<string>();
    ticketTimelineEntries.forEach((ticketTimelineEntry) => {
      if (
        ticketTimelineEntry.type === TicketTimelineEntryType.AssignmentChanged
      ) {
        const extraInfo = ticketTimelineEntry.entry as TicketAssignmentChanged;
        if (extraInfo.oldAssignedToId !== null)
          usersToFetch.add(extraInfo.oldAssignedToId);
        if (extraInfo.newAssignedToId !== null)
          usersToFetch.add(extraInfo.newAssignedToId);
      }
      if (ticketTimelineEntry.type === TicketTimelineEntryType.LabelsChanged) {
        const extraInfo = ticketTimelineEntry.entry as TicketLabelsChanged;
        extraInfo.oldLabelIds.forEach((labelId) => {
          labelsToFetch.add(labelId);
        });
        extraInfo.newLabelIds.forEach((labelId) => {
          labelsToFetch.add(labelId);
        });
      }
    });

    const users =
      usersToFetch.size > 0
        ? await this.userService.list({
            id: {
              in: [...usersToFetch],
            },
          })
        : [];

    const labels =
      labelsToFetch.size > 0
        ? await this.labelService.list(
            {
              id: {
                in: [...labelsToFetch],
              },
            },
            {
              relations: {
                labelType: true,
              },
            }
          )
        : [];

    ticketTimelineEntries.forEach((ticketTimelineEntry) => {
      switch (ticketTimelineEntry.type) {
        case TicketTimelineEntryType.AssignmentChanged:
          augmentedTicketTimelineEntries.push({
            ...ticketTimelineEntry,
            entry: {
              ...(ticketTimelineEntry.entry as TicketAssignmentChanged),
              oldAssignedTo:
                users.find(
                  (user) =>
                    user.id ===
                    (ticketTimelineEntry.entry as TicketAssignmentChanged)
                      .oldAssignedToId
                ) ?? null,
              newAssignedTo:
                users.find(
                  (user) =>
                    user.id ===
                    (ticketTimelineEntry.entry as TicketAssignmentChanged)
                      .newAssignedToId
                ) ?? null,
            },
          });
          break;
        case TicketTimelineEntryType.Note:
          augmentedTicketTimelineEntries.push({
            ...ticketTimelineEntry,
            entry: ticketTimelineEntry.entry as TicketNote,
          });
          break;
        case TicketTimelineEntryType.LabelsChanged:
          augmentedTicketTimelineEntries.push({
            ...ticketTimelineEntry,
            entry: {
              ...(ticketTimelineEntry.entry as TicketLabelsChanged),
              oldLabels: labels.filter((label) =>
                (
                  ticketTimelineEntry.entry as TicketLabelsChanged
                ).oldLabelIds.includes(label.id)
              ),
              newLabels: labels.filter((label) =>
                (
                  ticketTimelineEntry.entry as TicketLabelsChanged
                ).newLabelIds.includes(label.id)
              ),
            },
          });
          break;
        case TicketTimelineEntryType.PriorityChanged:
          augmentedTicketTimelineEntries.push({
            ...ticketTimelineEntry,
            entry: ticketTimelineEntry.entry as TicketPriorityChanged,
          });
          break;
        case TicketTimelineEntryType.StatusChanged:
          augmentedTicketTimelineEntries.push({
            ...ticketTimelineEntry,
            entry: ticketTimelineEntry.entry as TicketStatusChanged,
          });
          break;
        default:
          augmentedTicketTimelineEntries.push({ ...ticketTimelineEntry });
      }
    });

    return augmentedTicketTimelineEntries;
  }
}
