import { and, eq, isNull, schema } from '@cs/database';
import { extractMentions } from '@cs/kyaku/editor';
import type {
  TicketAssignmentChanged,
  TicketChat,
  TicketNote,
  TicketPriority,
  TicketPriorityChanged,
  TicketStatusChanged,
} from '@cs/kyaku/models';
import {
  TicketStatus,
  TicketStatusDetail,
  TimelineEntryType,
} from '@cs/kyaku/models';
import type { FindConfig, GetConfig } from '@cs/kyaku/types';
import { Direction } from '@cs/kyaku/types';
import { KyakuError } from '@cs/kyaku/utils';

import type { Ticket, TicketFilters, TicketWith } from '../entities/ticket';
import { TicketSortField } from '../entities/ticket';
import type { User } from '../entities/user';
import { USER_COLUMNS } from '../entities/user';
import type TicketRepository from '../repositories/ticket';
import type TicketMentionRepository from '../repositories/ticket-mention';
import type TicketTimelineRepository from '../repositories/ticket-timeline';
import type { UnitOfWork } from '../unit-of-work';
import { BaseService } from './base-service';
import {
  filterByDirection,
  inclusionFilterOperator,
  sortByDirection,
} from './build-query';

export default class TicketService extends BaseService {
  private readonly ticketRepository: TicketRepository;
  private readonly ticketMentionRepository: TicketMentionRepository;
  private readonly ticketTimelineRepository: TicketTimelineRepository;

  constructor({
    ticketRepository,
    ticketMentionRepository,
    ticketTimelineRepository,
  }: {
    ticketRepository: TicketRepository;
    ticketMentionRepository: TicketMentionRepository;
    ticketTimelineRepository: TicketTimelineRepository;
  } & { unitOfWork: UnitOfWork }) {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
    this.ticketRepository = ticketRepository;
    this.ticketMentionRepository = ticketMentionRepository;
    this.ticketTimelineRepository = ticketTimelineRepository;
  }

  async retrieve<T extends TicketWith<T>>(
    ticketId: string,
    config?: GetConfig<T>
  ) {
    return await this.ticketRepository.find({
      where: eq(schema.tickets.id, ticketId),
      with: this.getWithClause(config?.relations),
    });
  }

  async list<T extends TicketWith<T>>(
    filters: TicketFilters = {},
    config: FindConfig<T, TicketSortField> = {
      direction: Direction.Forward,
      limit: 50,
      sortBy: TicketSortField.createdAt,
    }
  ) {
    return await this.ticketRepository.findMany({
      limit: config.limit,
      orderBy: [
        ...this.getOrderByClause(config),
        sortByDirection(config.direction)(schema.tickets.id),
      ],
      where: and(
        this.getFilterWhereClause(filters),
        this.getSortWhereClause(config),
        this.getIdWhereClause(config)
      ),
      with: this.getWithClause(config.relations),
    });
  }
  async assign(
    {
      ticketId,
      assignedToId,
    }: {
      ticketId: string;
      assignedToId: string;
    },
    userId: string
  ) {
    const ticket = await this.retrieve(ticketId);

    if (!ticket)
      throw new KyakuError(
        KyakuError.Types.NOT_FOUND,
        `Ticket with id:${ticketId} not found`,
        ['id']
      );

    if (ticket.assignedToId === assignedToId) return;

    return await this.unitOfWork.transaction(async (tx) => {
      const updatedAt = new Date();

      const updatedTicket = await this.ticketRepository.update(
        {
          id: ticketId,
          assignedToId: assignedToId,
          updatedAt: updatedAt,
          updatedById: userId,
        },
        tx
      );

      if (!updatedTicket) {
        tx.rollback();
        return;
      }

      await this.ticketTimelineRepository.create(
        {
          ticketId: ticketId,
          customerId: ticket.customerId,
          type: TimelineEntryType.AssignmentChanged,
          entry: {
            oldAssignedToId: ticket.assignedToId,
            newAssignedToId: assignedToId,
          } satisfies TicketAssignmentChanged,
          createdAt: updatedTicket.updatedAt ?? updatedAt,
          userCreatedById: userId,
        },
        tx
      );

      return updatedTicket;
    });
  }

  async changePriority(
    {
      ticketId,
      priority,
    }: {
      ticketId: string;
      priority: TicketPriority;
    },
    userId: string
  ) {
    const ticket = await this.retrieve(ticketId);

    if (!ticket)
      throw new KyakuError(
        KyakuError.Types.NOT_FOUND,
        `Ticket with id:${ticketId} not found`,
        ['id']
      );

    if (ticket.priority === priority) return;

    return await this.unitOfWork.transaction(async (tx) => {
      const updatedAt = new Date();

      const updatedTicket = await this.ticketRepository.update(
        {
          id: ticketId,
          priority: priority,
          updatedAt: updatedAt,
          updatedById: userId,
        },
        tx
      );

      if (!updatedTicket) {
        tx.rollback();
        return;
      }

      await this.ticketTimelineRepository.create(
        {
          ticketId: ticketId,
          customerId: ticket.customerId,
          type: TimelineEntryType.PriorityChanged,
          entry: {
            oldPriority: ticket.priority,
            newPriority: priority,
          } satisfies TicketPriorityChanged,
          createdAt: updatedTicket.updatedAt ?? updatedAt,
          userCreatedById: userId,
        },
        tx
      );

      return updatedTicket;
    });
  }

  async create(
    data: Omit<
      Ticket,
      | 'id'
      | 'assignedToId'
      | 'status'
      | 'statusDetail'
      | 'statusChangedAt'
      | 'statusChangedById'
      | 'createdAt'
      | 'createdById'
      | 'updatedById'
      | 'updatedAt'
    >,
    userId: string
  ) {
    return await this.unitOfWork.transaction(async (tx) => {
      const createdAt = new Date();

      const newTicket = await this.ticketRepository.create(
        {
          ...data,
          status: TicketStatus.Open,
          statusDetail: TicketStatusDetail.Created,
          statusChangedAt: createdAt,
          statusChangedById: userId,
          createdAt: createdAt,
          createdById: userId,
        },
        tx
      );

      if (!newTicket) {
        tx.rollback();
        return;
      }

      return newTicket;
    });
  }

  async createNote(
    {
      ticketId,
      text,
      rawContent,
    }: {
      ticketId: string;
      text: string;
      rawContent: string;
    },
    userId: string
  ) {
    const ticket = await this.retrieve(ticketId);

    if (!ticket)
      throw new KyakuError(
        KyakuError.Types.NOT_FOUND,
        `Ticket with id:${ticketId} not found`,
        ['id']
      );

    const mentionIds = await extractMentions(rawContent);

    return await this.unitOfWork.transaction(async (tx) => {
      const createdAt = new Date();

      const newNote = await this.ticketTimelineRepository.create(
        {
          ticketId: ticketId,
          type: TimelineEntryType.Note,
          entry: {
            text: text,
            rawContent: rawContent,
          } satisfies TicketNote,
          customerId: ticket.customerId,
          createdAt: createdAt,
          userCreatedById: userId,
        },
        tx
      );

      if (!newNote) {
        tx.rollback();
        return;
      }

      if (mentionIds.length > 0) {
        await this.ticketMentionRepository.createMany(
          mentionIds.map((mentionId) => ({
            ticketTimelineEntryId: newNote.id,
            userId: mentionId,
            ticketId: ticket.id,
          })),
          tx
        );
      }

      await this.ticketRepository.update(
        {
          id: ticketId,
          updatedAt: newNote.createdAt,
          updatedById: userId,
        },
        tx
      );

      return newNote;
    });
  }

  async markAsDone(ticketId: string, userId: string) {
    const ticket = await this.retrieve(ticketId);

    if (!ticket)
      throw new KyakuError(
        KyakuError.Types.NOT_FOUND,
        `Ticket with id:${ticketId} not found`,
        ['id']
      );

    if (ticket.status === TicketStatus.Done) return;

    return await this.unitOfWork.transaction(async (tx) => {
      const updatedAt = new Date();

      const updatedTicket = await this.ticketRepository.update(
        {
          id: ticketId,
          status: TicketStatus.Done,
          statusDetail: null,
          statusChangedAt: updatedAt,
          statusChangedById: userId,
          updatedAt: updatedAt,
          updatedById: userId,
        },
        tx
      );

      if (!updatedTicket) {
        tx.rollback();
        return;
      }

      await this.ticketTimelineRepository.create(
        {
          ticketId: ticketId,
          customerId: ticket.customerId,
          type: TimelineEntryType.StatusChanged,
          entry: {
            oldStatus: ticket.status,
            newStatus: TicketStatus.Done,
          } satisfies TicketStatusChanged,
          createdAt: updatedTicket.updatedAt ?? updatedAt,
          userCreatedById: userId,
        },
        tx
      );

      return updatedTicket;
    });
  }

  async markAsOpen(ticketId: string, userId: string) {
    const ticket = await this.retrieve(ticketId);

    if (!ticket)
      throw new KyakuError(
        KyakuError.Types.NOT_FOUND,
        `Ticket with id:${ticketId} not found`,
        ['id']
      );

    if (ticket.status === TicketStatus.Open) return;

    return await this.unitOfWork.transaction(async (tx) => {
      const updatedAt = new Date();

      const updatedTicket = await this.ticketRepository.update(
        {
          id: ticketId,
          status: TicketStatus.Open,
          statusDetail: null,
          statusChangedAt: updatedAt,
          statusChangedById: userId,
          updatedAt: updatedAt,
          updatedById: userId,
        },
        tx
      );

      if (!updatedTicket) {
        tx.rollback();
        return;
      }

      await this.ticketTimelineRepository.create(
        {
          ticketId: ticketId,
          customerId: ticket.customerId,
          type: TimelineEntryType.StatusChanged,
          entry: {
            oldStatus: ticket.status,
            newStatus: TicketStatus.Open,
          } satisfies TicketStatusChanged,
          createdAt: updatedTicket.updatedAt ?? updatedAt,
          userCreatedById: userId,
        },
        tx
      );

      return updatedTicket;
    });
  }

  async sendChat(
    {
      ticketId,
      text,
    }: {
      ticketId: string;
      text: string;
    },
    userId: string
  ) {
    const ticket = await this.retrieve(ticketId);

    if (!ticket)
      throw new KyakuError(
        KyakuError.Types.NOT_FOUND,
        `Ticket with id:${ticketId} not found`,
        ['id']
      );

    return await this.unitOfWork.transaction(async (tx) => {
      const createdAt = new Date();

      const newChat = await this.ticketTimelineRepository.create(
        {
          ticketId: ticketId,
          type: TimelineEntryType.Chat,
          entry: {
            text: text,
          } satisfies TicketChat,
          customerId: ticket.customerId,
          createdAt: createdAt,
          userCreatedById: userId,
        },
        tx
      );

      if (!newChat) {
        tx.rollback();
        return;
      }

      await this.ticketRepository.update(
        {
          id: ticketId,
          statusDetail: TicketStatusDetail.Replied,
          statusChangedAt: newChat.createdAt,
          statusChangedById: userId,
          updatedAt: newChat.createdAt,
          updatedById: userId,
        },
        tx
      );

      return {
        id: newChat.id,
      };
    });
  }

  async unassign(ticketId: string, userId: string) {
    const ticket = await this.retrieve(ticketId);

    if (!ticket)
      throw new KyakuError(
        KyakuError.Types.NOT_FOUND,
        `Ticket with id:${ticketId} not found`,
        ['id']
      );

    if (!ticket.assignedToId) return;

    return await this.unitOfWork.transaction(async (tx) => {
      const updatedAt = new Date();

      const updatedTicket = await this.ticketRepository.update(
        {
          id: ticketId,
          assignedToId: null,
          updatedAt: updatedAt,
          updatedById: userId,
        },
        tx
      );

      if (!updatedTicket) {
        tx.rollback();
        return;
      }

      await this.ticketTimelineRepository.create(
        {
          ticketId: ticketId,
          customerId: ticket.customerId,
          type: TimelineEntryType.AssignmentChanged,
          entry: {
            oldAssignedToId: ticket.assignedToId,
            newAssignedToId: null,
          } satisfies TicketAssignmentChanged,
          createdAt: updatedTicket.updatedAt ?? updatedAt,
          userCreatedById: userId,
        },
        tx
      );

      return updatedTicket;
    });
  }

  private getWithClause<T extends TicketWith<T>>(
    relations: T | undefined
  ): {
    assignedTo: T extends { assignedTo: true } ? true : undefined;
    createdBy: T extends { createdBy: true }
      ? { columns: { [K in keyof User]: true } }
      : undefined;
    customer: T extends { customer: true } ? true : undefined;
    labels: T extends { labels: true }
      ? {
          with: { labelType: true };
        }
      : undefined;
    updatedBy: T extends { updatedBy: true }
      ? { columns: { [K in keyof User]: true } }
      : undefined;
  } {
    return {
      assignedTo: (relations?.assignedTo ? true : undefined) as T extends {
        assignedTo: true;
      }
        ? true
        : undefined,
      createdBy: (relations?.createdBy
        ? {
            columns: USER_COLUMNS,
          }
        : undefined) as T extends { createdBy: true }
        ? { columns: { [K in keyof User]: true } }
        : undefined,
      customer: (relations?.customer ? true : undefined) as T extends {
        customer: true;
      }
        ? true
        : undefined,
      labels: (relations?.labels
        ? {
            columns: {
              id: true,
            },
            with: {
              labelType: true,
            },
            where: isNull(schema.labels.archivedAt),
          }
        : undefined) as T extends { labels: true }
        ? {
            with: { labelType: true };
          }
        : undefined,
      updatedBy: (relations?.updatedBy
        ? {
            columns: USER_COLUMNS,
          }
        : undefined) as T extends { updatedBy: true }
        ? { columns: { [K in keyof User]: true } }
        : undefined,
    };
  }

  private getFilterWhereClause(filters: TicketFilters) {
    if (!Object.keys(filters).length) return undefined;

    return and(
      filters.assignedToUser
        ? inclusionFilterOperator(
            schema.tickets.assignedToId,
            filters.assignedToUser
          )
        : undefined,
      filters.customerIds
        ? inclusionFilterOperator(
            schema.tickets.customerId,
            filters.customerIds
          )
        : undefined,
      filters.priority
        ? inclusionFilterOperator(schema.tickets.priority, filters.priority)
        : undefined,
      filters.statuses
        ? inclusionFilterOperator(schema.tickets.status, filters.statuses)
        : undefined,
      filters.ticketIds
        ? inclusionFilterOperator(schema.tickets.id, filters.ticketIds)
        : undefined
    );
  }

  private getSortWhereClause<T extends TicketWith<T>>(
    config: FindConfig<T, TicketSortField>
  ) {
    if (
      !config.sortBy ||
      !config.cursor?.lastValue ||
      config.cursor.lastValue === config.cursor.lastId
    )
      return undefined;

    if (config.sortBy === TicketSortField.createdAt) {
      return filterByDirection(config.direction)(
        schema.tickets.createdAt,
        new Date(config.cursor.lastValue)
      );
    }

    if (config.sortBy === TicketSortField.statusChangedAt) {
      return filterByDirection(config.direction)(
        schema.tickets.statusChangedAt,
        new Date(config.cursor.lastValue)
      );
    }

    return undefined;
  }

  private getIdWhereClause<T extends TicketWith<T>>(
    config: FindConfig<T, TicketSortField>
  ) {
    if (!config.cursor?.lastId) return undefined;

    return filterByDirection(config.direction)(
      schema.tickets.id,
      config.cursor.lastId
    );
  }

  private getOrderByClause<T extends TicketWith<T>>(
    config: FindConfig<T, TicketSortField>
  ) {
    if (!config.sortBy) return [];

    if (config.sortBy === TicketSortField.createdAt) {
      return [sortByDirection(config.direction)(schema.tickets.createdAt)];
    }

    if (config.sortBy === TicketSortField.statusChangedAt) {
      return [
        sortByDirection(config.direction)(schema.tickets.statusChangedAt),
      ];
    }

    return [];
  }
}
