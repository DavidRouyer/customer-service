import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

import { db, schema } from '.';
import {
  MessageContentType,
  MessageDirection,
  MessageStatus,
} from './schema/message';
import { TicketStatus } from './schema/ticket';
import {
  TicketActivityType,
  TicketAssignmentAdded,
} from './schema/ticketActivity';

neonConfig.webSocketConstructor = ws;

async function main() {
  await db.insert(schema.contacts).values({
    name: 'Courtney Henry',
    email: 'courtney.henry@example.com',
    avatarUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  });

  const tomUser = await db
    .insert(schema.users)
    .values({
      id: crypto.randomUUID(),
      name: 'Tom Cook',
      email: 'tom.cook@example.com',
    })
    .returning({ id: schema.users.id })
    .then((res) => res[0]);

  if (!tomUser?.id) throw new Error('Could not create user');

  const tom = await db
    .insert(schema.contacts)
    .values({
      name: 'Tom Cook',
      email: 'tom.cook@example.com',
      phone: '+12025550191',
      avatarUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      language: 'en_US',
      timezone: 'America/Los_Angeles',
      userId: tomUser.id,
    })
    .returning({ id: schema.contacts.id })
    .then((res) => res[0]);

  if (!tom?.id) throw new Error('Could not create contact');

  await db.insert(schema.contacts).values({
    name: 'Lawrence Brooks',
    email: 'lawrence.brooks@example.com',
    avatarUrl:
      'https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  });

  const jeffrey = await db
    .insert(schema.contacts)
    .values({
      name: 'Jeffrey Clark',
      email: 'jeffrey.clark@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    })
    .returning({ id: schema.contacts.id })
    .then((res) => res[0]);

  if (!jeffrey?.id) throw new Error('Could not create contact');

  const leslie = await db
    .insert(schema.contacts)
    .values({
      name: 'Leslie Alexandre',
      email: 'leslie.alexandre@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      phone: '+33606060606',
      language: 'fr_FR',
      timezone: 'Europe/Paris',
    })
    .returning({ id: schema.contacts.id })
    .then((res) => res[0]);

  if (!leslie?.id) throw new Error('Could not create contact');

  const leslieTicket = await db
    .insert(schema.tickets)
    .values({
      status: TicketStatus.Open,
      createdAt: new Date('2023-05-04T20:54:41.389Z'),
      authorId: leslie.id,
      assignedToId: tom.id,
    })
    .returning({ id: schema.tickets.id, createdAt: schema.tickets.createdAt })
    .then((res) => res[0]);

  if (!leslieTicket?.id) throw new Error('Could not create ticket');

  await db.insert(schema.ticketActivities).values({
    ticketId: leslieTicket.id,
    authorId: leslie.id,
    type: TicketActivityType.Created,
    createdAt: leslieTicket.createdAt,
  });

  await db.insert(schema.ticketActivities).values({
    ticketId: leslieTicket.id,
    authorId: tom.id,
    type: TicketActivityType.AssignmentAdded,
    extraInfo: { newAssignedToId: tom.id } satisfies TicketAssignmentAdded,
    createdAt: new Date('2023-05-20T20:54:41.389Z'),
  });

  await db
    .insert(schema.messages)
    .values([
      {
        contentType: MessageContentType.TextPlain,
        content: "My order hasn't arrived yet.",
        createdAt: new Date('2023-05-04T20:54:41.389Z'),
        direction: MessageDirection.Inbound,
        status: MessageStatus.Seen,
        authorId: leslie.id,
        ticketId: leslieTicket.id,
      },
      {
        contentType: MessageContentType.TextPlain,
        content:
          'We apologize for the inconvenience. Can you please provide your order number so we can investigate?',
        createdAt: new Date('2023-05-11T10:33:56.231Z'),
        direction: MessageDirection.Outbound,
        status: MessageStatus.Seen,
        authorId: tom.id,
        ticketId: leslieTicket.id,
      },
    ])
    .returning({ id: schema.tickets.id });

  const leslieTicket2 = await db
    .insert(schema.tickets)
    .values({
      status: TicketStatus.Open,
      createdAt: new Date('2023-05-06T11:23:45.389Z'),
      authorId: leslie.id,
    })
    .returning({ id: schema.tickets.id, createdAt: schema.tickets.createdAt })
    .then((res) => res[0]);

  if (!leslieTicket2?.id) throw new Error('Could not create ticket');

  await db.insert(schema.ticketActivities).values({
    ticketId: leslieTicket2.id,
    authorId: leslie.id,
    type: TicketActivityType.Created,
    createdAt: leslieTicket2.createdAt,
  });

  await db
    .insert(schema.messages)
    .values([
      {
        contentType: MessageContentType.TextPlain,
        content: 'can ya help me change a product of purchase?',
        createdAt: new Date('2023-06-23T14:56Z'),
        direction: MessageDirection.Inbound,
        status: MessageStatus.Seen,
        authorId: leslie.id,
        ticketId: leslieTicket2.id,
      },
      {
        contentType: MessageContentType.TextPlain,
        content: 'Can you tell me which product you would like to change?',
        createdAt: new Date('2023-03-03T22:40Z'),
        direction: MessageDirection.Outbound,
        status: MessageStatus.Seen,
        authorId: tom.id,
        ticketId: leslieTicket2.id,
      },
      {
        contentType: MessageContentType.TextPlain,
        content: 'The socks, please',
        createdAt: new Date('2023-03-03T22:40Z'),
        direction: MessageDirection.Inbound,
        status: MessageStatus.Seen,
        authorId: leslie.id,
        ticketId: leslieTicket2.id,
      },
    ])
    .returning({ id: schema.tickets.id });

  const leslieTicket3 = await db
    .insert(schema.tickets)
    .values({
      status: TicketStatus.Resolved,
      createdAt: new Date('2023-05-06T11:23:45.389Z'),
      resolvedAt: new Date('2023-06-12T06:10:45.389Z'),
      authorId: leslie.id,
    })
    .returning({
      id: schema.tickets.id,
      createdAt: schema.tickets.createdAt,
      resolvedAt: schema.tickets.resolvedAt,
    })
    .then((res) => res[0]);

  if (!leslieTicket3?.id) throw new Error('Could not create ticket');

  await db.insert(schema.ticketActivities).values({
    ticketId: leslieTicket3.id,
    authorId: leslie.id,
    type: TicketActivityType.Created,
    createdAt: leslieTicket3.createdAt,
  });

  await db.insert(schema.ticketActivities).values({
    ticketId: leslieTicket3.id,
    authorId: leslie.id,
    type: TicketActivityType.Resolved,
    createdAt: leslieTicket3.resolvedAt ?? new Date(),
  });

  await db
    .insert(schema.messages)
    .values([
      {
        contentType: MessageContentType.TextPlain,
        content: 'problems with canceling purchase',
        createdAt: new Date('2023-07-07T16:59Z'),
        direction: MessageDirection.Inbound,
        status: MessageStatus.DeliveredToDevice,
        authorId: leslie.id,
        ticketId: leslieTicket3.id,
      },
    ])
    .returning({ id: schema.tickets.id });

  const michael = await db
    .insert(schema.contacts)
    .values({
      name: 'Michael Foster',
      email: 'michael.foster@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    })
    .returning({ id: schema.tickets.id })
    .then((res) => res[0]);

  if (!michael?.id) throw new Error('Could not create contact');

  const michaelTicket = await db
    .insert(schema.tickets)
    .values({
      status: TicketStatus.Open,
      createdAt: new Date('2023-03-03T14:02Z'),
      authorId: michael.id,
    })
    .returning({ id: schema.tickets.id, createdAt: schema.tickets.createdAt })
    .then((res) => res[0]);

  if (!michaelTicket?.id) throw new Error('Could not create ticket');

  await db.insert(schema.ticketActivities).values({
    ticketId: michaelTicket.id,
    authorId: michael.id,
    type: TicketActivityType.Created,
    createdAt: michaelTicket.createdAt,
  });

  await db
    .insert(schema.messages)
    .values([
      {
        contentType: MessageContentType.TextPlain,
        content: 'I received a damaged product.',
        createdAt: new Date('2023-03-03T14:02Z'),
        direction: MessageDirection.Inbound,
        status: MessageStatus.Seen,
        authorId: michael.id,
        ticketId: michaelTicket.id,
      },
      {
        contentType: MessageContentType.TextPlain,
        content:
          'We apologize for the inconvenience. Can you please provide a photo of the damaged product so we can assist you further?',
        createdAt: new Date('2023-03-12T17:20Z'),
        direction: MessageDirection.Outbound,
        status: MessageStatus.Seen,
        authorId: jeffrey.id,
        ticketId: michaelTicket.id,
      },
    ])
    .returning({ id: schema.tickets.id });

  const dries = await db
    .insert(schema.contacts)
    .values({
      name: 'Dries Vincent',
      email: 'dries.vincent@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    })
    .returning({ id: schema.contacts.id })
    .then((res) => res[0]);

  if (!dries?.id) throw new Error('Could not create contact');

  const driesTicket = await db
    .insert(schema.tickets)
    .values({
      status: TicketStatus.Open,
      createdAt: new Date('2023-03-03T13:23Z'),
      authorId: dries.id,
    })
    .returning({ id: schema.tickets.id, createdAt: schema.tickets.createdAt })
    .then((res) => res[0]);

  if (!driesTicket?.id) throw new Error('Could not create ticket');

  await db.insert(schema.ticketActivities).values({
    ticketId: driesTicket.id,
    authorId: dries.id,
    type: TicketActivityType.Created,
    createdAt: driesTicket.createdAt,
  });

  await db
    .insert(schema.messages)
    .values([
      {
        contentType: MessageContentType.TextPlain,
        content: 'I need to return an item.',
        createdAt: new Date('2023-03-03T13:23Z'),
        direction: MessageDirection.Inbound,
        status: MessageStatus.Seen,
        authorId: dries.id,
        ticketId: driesTicket.id,
      },
      {
        contentType: MessageContentType.TextPlain,
        content:
          'Certainly. Please provide your order number and reason for return, and we will provide you with instructions on how to proceed.',
        createdAt: new Date('2023-04-01T06:06Z'),
        direction: MessageDirection.Outbound,
        status: MessageStatus.DeliveredToDevice,
        authorId: jeffrey.id,
        ticketId: driesTicket.id,
      },
    ])
    .returning({ id: schema.tickets.id });

  const lindsay = await db
    .insert(schema.contacts)
    .values({
      name: 'Lindsay Walton',
      email: 'lindsay.walton@example.com',
      phone: '+441632960050',
      avatarUrl:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      language: 'en_GB',
      timezone: 'Europe/London',
    })
    .returning({ id: schema.contacts.id })
    .then((res) => res[0]);

  if (!lindsay?.id) throw new Error('Could not create contact');

  const lindsayTicket = await db
    .insert(schema.tickets)
    .values({
      status: TicketStatus.Open,
      createdAt: new Date('2023-03-02T21:13Z'),
      authorId: lindsay.id,
    })
    .returning({ id: schema.tickets.id, createdAt: schema.tickets.createdAt })
    .then((res) => res[0]);

  if (!lindsayTicket?.id) throw new Error('Could not create ticket');

  await db
    .insert(schema.messages)
    .values([
      {
        contentType: MessageContentType.TextPlain,
        content: 'I want to change my shipping address.',
        createdAt: new Date('2023-03-02T21:13Z'),
        direction: MessageDirection.Inbound,
        status: MessageStatus.Seen,
        authorId: lindsay.id,
        ticketId: lindsayTicket.id,
      },
      {
        contentType: MessageContentType.TextPlain,
        content:
          "No problem. Can you please provide your order number and the new shipping address you'd like to use?",
        createdAt: new Date('2023-03-03T22:40Z'),
        direction: MessageDirection.Outbound,
        status: MessageStatus.DeliveredToDevice,
        authorId: tom.id,
        ticketId: lindsayTicket.id,
      },
    ])
    .returning({ id: schema.tickets.id });

  await db.insert(schema.ticketActivities).values({
    ticketId: lindsayTicket.id,
    authorId: lindsay.id,
    type: TicketActivityType.Created,
    createdAt: lindsayTicket.createdAt,
  });
}

main();
