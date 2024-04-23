import { eq, inArray, schema } from '@cs/database';
import {
  TicketAssignmentChanged,
  TicketChat,
  TicketLabelsChanged,
  TicketNote,
  TicketPriorityChanged,
  TicketStatusChanged,
  TimelineEntryType,
  User,
} from '@cs/kyaku/models';
import { FindConfig } from '@cs/kyaku/types';
import { Direction } from '@cs/kyaku/types/query';

import {
  TicketTimeline,
  TicketTimelineSortField,
  TicketTimelineUnion,
  TicketTimelineWith,
} from '../entities/ticket-timeline';
import { USER_COLUMNS } from '../entities/user';
import LabelRepository from '../repositories/label';
import TicketTimelineRepository from '../repositories/ticket-timeline';
import UserRepository from '../repositories/user';
import { UnitOfWork } from '../unit-of-work';
import { BaseService } from './base-service';
import { sortByDirection } from './build-query';

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
  } & { unitOfWork: UnitOfWork }) {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
    this.ticketTimelineRepository = ticketTimelineRepository;
    this.labelRepository = labelRepository;
    this.userRepository = userRepository;
  }

  async list<T extends TicketTimelineWith<T>>(
    filters: { ticketId: string },
    config: FindConfig<T, TicketTimelineSortField> = {
      direction: Direction.Forward,
      limit: 50,
      sortBy: TicketTimelineSortField.createdAt,
    }
  ) {
    const ticketTimelineEntries = await this.ticketTimelineRepository.findMany({
      limit: config.limit,
      orderBy: [
        ...this.getOrderByClause(config),
        sortByDirection(config.direction)(schema.ticketTimelineEntries.id),
      ],
      where: eq(schema.ticketTimelineEntries.ticketId, filters.ticketId),
      with: this.getWithClause(config?.relations),
    });

    const blabla = ticketTimelineEntries.map((entry) => this.mapEntry(entry));
    return blabla;
    /*const ticketAssigmentChangedEntries = ticketTimelineEntries
      .filter(
        (ticketTimelineEntry) =>
          ticketTimelineEntry.type === TimelineEntryType.AssignmentChanged
      )
      .map(
        (ticketTimelineEntry) =>
          ticketTimelineEntry.entry as TicketAssignmentChanged
      );

    const ticketLabelsChangedEntries = ticketTimelineEntries
      .filter(
        (ticketTimelineEntry) =>
          ticketTimelineEntry.type === TimelineEntryType.LabelsChanged
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
        | TicketStatusChanged;
    })[] = [];

    ticketTimelineEntries.forEach((ticketTimelineEntry) => {
      switch (ticketTimelineEntry.type) {
        case TimelineEntryType.AssignmentChanged:
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
        case TimelineEntryType.Note:
          augmentedTicketTimelineEntries.push({
            ...ticketTimelineEntry,
            entry: ticketTimelineEntry.entry as TicketNote,
          });
          break;
        case TimelineEntryType.LabelsChanged:
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
        case TimelineEntryType.PriorityChanged:
          augmentedTicketTimelineEntries.push({
            ...ticketTimelineEntry,
            entry: ticketTimelineEntry.entry as TicketPriorityChanged,
          });
          break;
        case TimelineEntryType.StatusChanged:
          augmentedTicketTimelineEntries.push({
            ...ticketTimelineEntry,
            entry: ticketTimelineEntry.entry as TicketStatusChanged,
          });
          break;
        default:
          augmentedTicketTimelineEntries.push({ ...ticketTimelineEntry });
      }
    });

    return augmentedTicketTimelineEntries;*/
  }

  private mapEntry(entry: TicketTimeline): TicketTimelineUnion {
    switch (entry.type) {
      case TimelineEntryType.AssignmentChanged:
        return {
          ...entry,
          type: TimelineEntryType.AssignmentChanged,
          entry: entry.entry as TicketAssignmentChanged,
        };
      case TimelineEntryType.Chat:
        return {
          ...entry,
          type: TimelineEntryType.Chat,
          entry: entry.entry as TicketChat,
        };
      case TimelineEntryType.LabelsChanged:
        return {
          ...entry,
          type: TimelineEntryType.LabelsChanged,
          entry: entry.entry as TicketLabelsChanged,
        };
      case TimelineEntryType.Note:
        return {
          ...entry,
          type: TimelineEntryType.Note,
          entry: entry.entry as TicketNote,
        };
      case TimelineEntryType.PriorityChanged:
        return {
          ...entry,
          type: TimelineEntryType.PriorityChanged,
          entry: entry.entry as TicketPriorityChanged,
        };
      case TimelineEntryType.StatusChanged:
        return {
          ...entry,
          type: TimelineEntryType.StatusChanged,
          entry: entry.entry as TicketStatusChanged,
        };
      default:
        throw new Error('Invalid timeline entry type');
    }
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
          columns: USER_COLUMNS,
          where: inArray(schema.users.id, Array.from(usersToFetch)),
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
          where: inArray(schema.labelTypes.id, Array.from(labelsToFetch)),
          with: {
            labelType: true,
          },
        })
      : [];
  }

  private getWithClause<T extends TicketTimelineWith<T>>(
    relations: T | undefined
  ): {
    customer: T extends { customer: true } ? true : undefined;
    customerCreatedBy: T extends { customerCreatedBy: true } ? true : undefined;
    ticket: T extends { ticket: true } ? true : undefined;
    userCreatedBy: T extends { userCreatedBy: true }
      ? { columns: { [K in keyof User]: true } }
      : undefined;
  } {
    return {
      customer: (relations?.customer ? true : undefined) as T extends {
        customer: true;
      }
        ? true
        : undefined,
      customerCreatedBy: (relations?.customerCreatedBy
        ? true
        : undefined) as T extends { customerCreatedBy: true }
        ? true
        : undefined,
      ticket: (relations?.ticket ? true : undefined) as T extends {
        ticket: true;
      }
        ? true
        : undefined,
      userCreatedBy: (relations?.userCreatedBy
        ? {
            columns: USER_COLUMNS,
          }
        : undefined) as T extends { userCreatedBy: true }
        ? { columns: { [K in keyof User]: true } }
        : undefined,
    };
  }

  private getOrderByClause<T extends TicketTimelineWith<T>>(
    config: FindConfig<T, TicketTimelineSortField>
  ) {
    if (!config.sortBy) return [];

    if (config.sortBy === TicketTimelineSortField.createdAt) {
      return [
        sortByDirection(config.direction)(
          schema.ticketTimelineEntries.createdAt
        ),
      ];
    }

    return [];
  }
}
