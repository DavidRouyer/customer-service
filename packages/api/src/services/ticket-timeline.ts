import { and, desc, eq, InferSelectModel, schema } from '@cs/database';
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
import { BaseService } from './base-service';
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

export default class TicketTimelineService extends BaseService {
  private readonly labelService: LabelService;
  private readonly userService: UserService;

  constructor({
    labelService,
    userService,
  }: {
    labelService: LabelService;
    userService: UserService;
  }) {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
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

    const ticketAssigmentChangedEntries = ticketTimelineEntries
      .filter(
        (ticketTimelineEntry) =>
          ticketTimelineEntry.type === TicketTimelineEntryType.AssignmentChanged
      )
      .map(
        (ticketTimelineEntry) =>
          ticketTimelineEntry.entry as TicketAssignmentChanged
      );

    const ticketLabelsChangedEntries = ticketTimelineEntries
      .filter(
        (ticketTimelineEntry) =>
          ticketTimelineEntry.type === TicketTimelineEntryType.LabelsChanged
      )
      .map(
        (ticketTimelineEntry) =>
          ticketTimelineEntry.entry as TicketLabelsChanged
      );

    const [fetchedUsers, fetchedLabels] = await Promise.all([
      this.retrieveUsers(ticketAssigmentChangedEntries),
      this.retrieveLabels(ticketLabelsChangedEntries),
    ]);

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

    ticketTimelineEntries.forEach((ticketTimelineEntry) => {
      switch (ticketTimelineEntry.type) {
        case TicketTimelineEntryType.AssignmentChanged:
          augmentedTicketTimelineEntries.push({
            ...ticketTimelineEntry,
            entry: {
              ...(ticketTimelineEntry.entry as TicketAssignmentChanged),
              oldAssignedTo:
                fetchedUsers.find(
                  (user) =>
                    user.id ===
                    (ticketTimelineEntry.entry as TicketAssignmentChanged)
                      .oldAssignedToId
                ) ?? null,
              newAssignedTo:
                fetchedUsers.find(
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
              oldLabels: fetchedLabels.filter((label) =>
                (
                  ticketTimelineEntry.entry as TicketLabelsChanged
                ).oldLabelIds.includes(label.id)
              ),
              newLabels: fetchedLabels.filter((label) =>
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

  private async retrieveUsers(entries: TicketAssignmentChanged[]) {
    const usersToFetch = new Set<string>([
      ...entries
        .map((entry) => entry.oldAssignedToId)
        .flatMap((e) => (e ? [e] : [])),
      ...entries
        .map((entry) => entry.newAssignedToId)
        .flatMap((e) => (e ? [e] : [])),
    ]);

    return usersToFetch.size > 0
      ? await this.userService.list({
          id: {
            in: [...usersToFetch],
          },
        })
      : [];
  }

  private async retrieveLabels(entries: TicketLabelsChanged[]) {
    const labelsToFetch = new Set<string>([
      ...entries.flatMap((entry) => entry.oldLabelIds),
      ...entries.flatMap((entry) => entry.newLabelIds),
    ]);

    return labelsToFetch.size > 0
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
  }
}
