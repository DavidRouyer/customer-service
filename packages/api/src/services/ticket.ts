import { and, eq, isNull, schema } from '@cs/database';
import { extractMentions } from '@cs/kyaku/editor';
import {
  TicketAssignmentChanged,
  TicketChat,
  TicketNote,
  TicketPriority,
  TicketPriorityChanged,
  TicketStatus,
  TicketStatusChanged,
  TicketStatusDetail,
  TicketTimelineEntryType,
} from '@cs/kyaku/models';
import { Direction, FindConfig, GetConfig } from '@cs/kyaku/types/query';
import { KyakuError } from '@cs/kyaku/utils';

import {
  Ticket,
  TicketFilters,
  TicketSortField,
  TicketWith,
} from '../entities/ticket';
import { User, USER_COLUMNS } from '../entities/user';
import TicketRepository from '../repositories/ticket';
import TicketMentionRepository from '../repositories/ticket-mention';
import TicketTimelineRepository from '../repositories/ticket-timeline';
import { UnitOfWork } from '../unit-of-work';
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
    const ticket = await this.ticketRepository.find({
      where: eq(schema.tickets.id, ticketId),
      with: this.getWithClause(config?.relations),
    });

    if (!ticket)
      throw new KyakuError(
        KyakuError.Types.NOT_FOUND,
        `Ticket with id:${ticketId} not found`
      );

    return ticket;
  }

  async list<T extends TicketWith<T>>(
    filters: TicketFilters = {},
    config: FindConfig<T, TicketSortField> = {
      direction: Direction.Forward,
      limit: 50,
      sortBy: TicketSortField.createdAt,
    }
  ) {
    const tickets = await this.ticketRepository.findMany({
      limit: config.limit + 1,
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

    const items = tickets.slice(0, config.limit);
    const hasNextPage = tickets.length > config.limit;
    return {
      items:
        config.direction === Direction.Forward ? items : items.toReversed(),
      hasNextPage: hasNextPage,
    };
  }

  async create(
    data: Omit<
      Ticket,
      | 'id'
      | 'assignedToId'
      | 'status'
      | 'statusDetail'
      | 'statusChangedAt'
      | 'createdAt'
      | 'updatedById'
      | 'updatedAt'
    >
  ) {
    return await this.unitOfWork.transaction(async (tx) => {
      const creationDate = new Date();

      const newTicket = await this.ticketRepository.create(
        {
          ...data,
          status: TicketStatus.Open,
          statusDetail: TicketStatusDetail.Created,
          statusChangedAt: creationDate,
          createdAt: creationDate,
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

  async assign(ticketId: string, assignedToId: string, userId: string) {
    const ticket = await this.retrieve(ticketId);

    return await this.unitOfWork.transaction(async (tx) => {
      const updatedTicket = await this.ticketRepository.update(
        {
          id: ticketId,
          assignedToId: assignedToId,
          updatedAt: new Date(),
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
          type: TicketTimelineEntryType.AssignmentChanged,
          entry: {
            oldAssignedToId: ticket.assignedToId,
            newAssignedToId: assignedToId,
          } satisfies TicketAssignmentChanged,
          createdAt: updatedTicket.updatedAt ?? new Date(),
          userCreatedById: userId,
        },
        tx
      );
    });
  }

  async unassign(ticketId: string, userId: string) {
    const ticket = await this.retrieve(ticketId);

    if (!ticket.assignedToId)
      throw new KyakuError(
        KyakuError.Types.NOT_ALLOWED,
        `Ticket with id:${ticketId} is not assigned`
      );

    return await this.unitOfWork.transaction(async (tx) => {
      const updatedTicket = await this.ticketRepository.update(
        {
          id: ticketId,
          assignedToId: null,
          updatedAt: new Date(),
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
          type: TicketTimelineEntryType.AssignmentChanged,
          entry: {
            oldAssignedToId: ticket.assignedToId,
            newAssignedToId: null,
          } satisfies TicketAssignmentChanged,
          createdAt: updatedTicket.updatedAt ?? new Date(),
          userCreatedById: userId,
        },
        tx
      );
    });
  }

  async changePriority(
    ticketId: string,
    priority: TicketPriority,
    userId: string
  ) {
    const ticket = await this.retrieve(ticketId);

    return await this.unitOfWork.transaction(async (tx) => {
      const updatedTicket = await this.ticketRepository.update(
        {
          id: ticketId,
          priority: priority,
          updatedAt: new Date(),
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
          type: TicketTimelineEntryType.PriorityChanged,
          entry: {
            oldPriority: ticket.priority,
            newPriority: priority,
          } satisfies TicketPriorityChanged,
          createdAt: updatedTicket.updatedAt ?? new Date(),
          userCreatedById: userId,
        },
        tx
      );
    });
  }

  async markAsDone(ticketId: string, userId: string) {
    const ticket = await this.retrieve(ticketId);

    if (ticket.status === TicketStatus.Done)
      throw new KyakuError(
        KyakuError.Types.NOT_ALLOWED,
        `Ticket with id:${ticketId} is already marked as done`
      );

    return await this.unitOfWork.transaction(async (tx) => {
      const updatedTicket = await this.ticketRepository.update(
        {
          id: ticketId,
          status: TicketStatus.Done,
          statusDetail: null,
          statusChangedAt: new Date(),
          statusChangedById: userId,
          updatedAt: new Date(),
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
          type: TicketTimelineEntryType.StatusChanged,
          entry: {
            oldStatus: ticket.status,
            newStatus: TicketStatus.Done,
          } satisfies TicketStatusChanged,
          createdAt: updatedTicket.updatedAt ?? new Date(),
          userCreatedById: userId,
        },
        tx
      );
    });
  }

  async markAsOpen(ticketId: string, userId: string) {
    const ticket = await this.retrieve(ticketId);

    if (ticket.status === TicketStatus.Open)
      throw new KyakuError(
        KyakuError.Types.NOT_ALLOWED,
        `Ticket with id:${ticketId} is already marked as open`
      );

    return await this.unitOfWork.transaction(async (tx) => {
      const updatedTicket = await this.ticketRepository.update(
        {
          id: ticketId,
          status: TicketStatus.Open,
          statusDetail: null,
          statusChangedAt: new Date(),
          statusChangedById: userId,
          updatedAt: new Date(),
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
          type: TicketTimelineEntryType.StatusChanged,
          entry: {
            oldStatus: ticket.status,
            newStatus: TicketStatus.Open,
          } satisfies TicketStatusChanged,
          createdAt: updatedTicket.updatedAt ?? new Date(),
          userCreatedById: userId,
        },
        tx
      );
    });
  }

  async sendChat(ticketId: string, text: string, userId: string) {
    const ticket = await this.retrieve(ticketId);

    return await this.unitOfWork.transaction(async (tx) => {
      const creationDate = new Date();

      const newChat = await this.ticketTimelineRepository.create(
        {
          ticketId: ticketId,
          type: TicketTimelineEntryType.Chat,
          entry: {
            text: text,
          } satisfies TicketChat,
          customerId: ticket.customerId,
          createdAt: creationDate,
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

  async sendNote(
    ticketId: string,
    text: string,
    rawContent: string,
    userId: string
  ) {
    const ticket = await this.retrieve(ticketId);

    const mentionIds = await extractMentions(rawContent);

    return await this.unitOfWork.transaction(async (tx) => {
      const creationDate = new Date();

      const newNote = await this.ticketTimelineRepository.create(
        {
          ticketId: ticketId,
          type: TicketTimelineEntryType.Note,
          entry: {
            text: text,
            rawContent: rawContent,
          } satisfies TicketNote,
          customerId: ticket.customerId,
          createdAt: creationDate,
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
      filters.customerId
        ? inclusionFilterOperator(schema.tickets.customerId, filters.customerId)
        : undefined,
      filters.priority
        ? inclusionFilterOperator(schema.tickets.priority, filters.priority)
        : undefined,
      filters.status
        ? inclusionFilterOperator(schema.tickets.status, filters.status)
        : undefined,
      filters.ticketId
        ? inclusionFilterOperator(schema.tickets.id, filters.ticketId)
        : undefined
    );
  }

  private getSortWhereClause<T extends TicketWith<T>>(
    config: FindConfig<T, TicketSortField>
  ) {
    if (
      !config.sortBy ||
      !config.cursor?.lastValue ||
      config.cursor?.lastValue === config.cursor?.lastId
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
