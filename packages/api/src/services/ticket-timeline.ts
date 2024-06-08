import { eq, schema } from '@cs/database';
import type {
  TicketAssignmentChanged,
  TicketChat,
  TicketLabelsChanged,
  TicketNote,
  TicketPriorityChanged,
  TicketStatusChanged,
  User,
} from '@cs/kyaku/models';
import { TimelineEntryType } from '@cs/kyaku/models';
import type { FindConfig } from '@cs/kyaku/types';
import { Direction } from '@cs/kyaku/types';

import type {
  TicketTimeline,
  TicketTimelineUnion,
  TicketTimelineWith,
} from '../entities/ticket-timeline';
import { TicketTimelineSortField } from '../entities/ticket-timeline';
import { USER_COLUMNS } from '../entities/user';
import type TicketTimelineRepository from '../repositories/ticket-timeline';
import type { UnitOfWork } from '../unit-of-work';
import { BaseService } from './base-service';
import { sortByDirection } from './build-query';

export default class TicketTimelineService extends BaseService {
  private readonly ticketTimelineRepository: TicketTimelineRepository;

  constructor({
    ticketTimelineRepository,
  }: {
    ticketTimelineRepository: TicketTimelineRepository;
  } & { unitOfWork: UnitOfWork }) {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
    this.ticketTimelineRepository = ticketTimelineRepository;
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
      with: this.getWithClause(config.relations),
    });

    return ticketTimelineEntries.map((entry) => this.mapEntry(entry));
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

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
