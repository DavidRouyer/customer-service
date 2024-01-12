import { and, desc, eq, inArray, schema } from '@cs/database';
import {
  TicketAssignmentChanged,
  TicketChat,
  TicketLabelsChanged,
  TicketNote,
  TicketPriorityChanged,
  TicketStatusChanged,
  TicketTimelineEntryType,
} from '@cs/kyaku/models';

import {
  FindTicketTimelineConfig,
  TicketAssignmentChangedWithData,
  TicketLabelsChangedWithData,
  TicketTimelineRelations,
} from '../entities/ticket-timeline';
import LabelRepository from '../repositories/label';
import TicketTimelineRepository from '../repositories/ticket-timeline';
import UserRepository from '../repositories/user';
import { BaseService } from './base-service';
import { sortDirection } from './build-query';

export default class TicketTimelineService extends BaseService {
  private readonly ticketTimelineRepository: TicketTimelineRepository;
  private readonly labelRepository: LabelRepository;
  private readonly userRepository: UserRepository;

  constructor({
    labelRepository,
    ticketTimelineRepository,
    userRepository,
  }: {
    labelRepository: LabelRepository;
    ticketTimelineRepository: TicketTimelineRepository;
    userRepository: UserRepository;
  }) {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
    this.ticketTimelineRepository = ticketTimelineRepository;
    this.labelRepository = labelRepository;
    this.userRepository = userRepository;
  }

  async list(
    filters: { ticketId: string },
    config: FindTicketTimelineConfig = {
      relations: {},
    }
  ) {
    const ticketTimelineEntries = await this.ticketTimelineRepository.findMany({
      columns: undefined,
      extras: {},
      where: eq(schema.ticketTimelineEntries.ticketId, filters.ticketId),
      with: this.getWithClause(config.relations),
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
        | TicketLabelsChangedWithData
        | TicketChat
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
      ? await this.userRepository.findMany({
          columns: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
          extras: {},
          where: inArray(schema.users.id, Array.from(usersToFetch)),
          with: undefined,
        })
      : [];
  }

  private async retrieveLabels(entries: TicketLabelsChanged[]) {
    const labelsToFetch = new Set<string>([
      ...entries.flatMap((entry) => entry.oldLabelIds),
      ...entries.flatMap((entry) => entry.newLabelIds),
    ]);

    return labelsToFetch.size > 0
      ? await this.labelRepository.findMany({
          columns: undefined,
          extras: {},
          where: inArray(schema.labelTypes.id, Array.from(labelsToFetch)),
          with: {
            labelType: true,
          },
        })
      : [];
  }

  private getWithClause(relations: TicketTimelineRelations) {
    const withClause = {
      customer: relations.customer ? (true as const) : undefined,
      customerCreatedBy: relations.customerCreatedBy
        ? (true as const)
        : undefined,
      ticket: relations.ticket ? (true as const) : undefined,
      userCreatedBy: relations.userCreatedBy
        ? ({
            columns: {
              id: true,
              email: true,
              name: true,
              image: true,
            },
          } as const)
        : undefined,
    };

    return withClause;
  }
}
