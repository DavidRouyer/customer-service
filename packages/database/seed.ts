import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

import { ChatContentType, ChatDirection, ChatStatus } from '@cs/lib/chats';
import { generateEntityId } from '@cs/lib/generate-entity-id';
import {
  TicketActivityType,
  TicketAssignmentChanged,
} from '@cs/lib/ticketActivities';
import { TicketPriority, TicketStatus } from '@cs/lib/tickets';

import { db, eq, schema } from '.';

neonConfig.webSocketConstructor = ws;

async function main() {
  let botUser = await db
    .insert(schema.users)
    .values({
      id: '40cebacc-c7ae-4b5b-8072-3122d572c6d4',
      name: 'Bot',
      email: 'bot@example.com',
    })
    .onConflictDoNothing()
    .returning({ id: schema.customers.id })
    .then((res) => res[0]);

  if (!botUser?.id)
    botUser = await db.query.users.findFirst({
      where: eq(schema.users.id, '40cebacc-c7ae-4b5b-8072-3122d572c6d4'),
    });

  if (!botUser?.id) throw new Error('Could not create user');

  const bugReportLabelType = await db
    .insert(schema.labelTypes)
    .values({
      id: generateEntityId('', 'lt'),
      name: 'Bug report',
      icon: 'bug',
      createdById: botUser.id,
    })
    .returning({ id: schema.labelTypes.id })
    .then((res) => res[0]);

  if (!bugReportLabelType?.id) throw new Error('Could not create label type');

  const featureRequestLabelType = await db
    .insert(schema.labelTypes)
    .values({
      id: generateEntityId('', 'lt'),
      name: 'Feature request',
      icon: 'lightbulb',
      createdById: botUser.id,
    })
    .returning({ id: schema.labelTypes.id })
    .then((res) => res[0]);

  if (!featureRequestLabelType?.id)
    throw new Error('Could not create label type');

  const questionLabelType = await db
    .insert(schema.labelTypes)
    .values({
      id: generateEntityId('', 'lt'),
      name: 'General question',
      icon: 'help-circle',
      createdById: botUser.id,
    })
    .returning({ id: schema.labelTypes.id })
    .then((res) => res[0]);

  if (!questionLabelType?.id) throw new Error('Could not create label type');

  await db.insert(schema.customers).values({
    id: generateEntityId('', 'co'),
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
    .insert(schema.customers)
    .values({
      id: generateEntityId('', 'co'),
      name: 'Tom Cook',
      email: 'tom.cook@example.com',
      phone: '+12025550191',
      avatarUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      language: 'en_US',
      timezone: 'America/Los_Angeles',
      userId: tomUser.id,
    })
    .returning({ id: schema.customers.id })
    .then((res) => res[0]);

  if (!tom?.id) throw new Error('Could not create customer');

  const jeffUser = await db
    .insert(schema.users)
    .values({
      id: crypto.randomUUID(),
      name: 'Jeff Lacey',
      email: 'jeff.lacey@example.com',
    })
    .returning({ id: schema.users.id })
    .then((res) => res[0]);

  if (!jeffUser?.id) throw new Error('Could not create user');

  const jeff = await db
    .insert(schema.customers)
    .values({
      id: generateEntityId('', 'co'),
      name: 'Jeff Lacey',
      email: 'jeff.lacey@example.com',
      phone: '+12025550149',
      avatarUrl:
        'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8ZmFjZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      language: 'en_US',
      timezone: 'America/Los_Angeles',
      userId: tomUser.id,
    })
    .returning({ id: schema.customers.id })
    .then((res) => res[0]);

  if (!jeff?.id) throw new Error('Could not create customer');

  await db.insert(schema.customers).values({
    id: generateEntityId('', 'co'),
    name: 'Lawrence Brooks',
    email: 'lawrence.brooks@example.com',
    avatarUrl:
      'https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  });

  const jeffrey = await db
    .insert(schema.customers)
    .values({
      id: generateEntityId('', 'co'),
      name: 'Jeffrey Clark',
      email: 'jeffrey.clark@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    })
    .returning({ id: schema.customers.id })
    .then((res) => res[0]);

  if (!jeffrey?.id) throw new Error('Could not create customer');

  const leslie = await db
    .insert(schema.customers)
    .values({
      id: generateEntityId('', 'co'),
      name: 'Leslie Alexandre',
      email: 'leslie.alexandre@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      phone: '+33606060606',
      language: 'fr_FR',
      timezone: 'Europe/Paris',
    })
    .returning({ id: schema.customers.id })
    .then((res) => res[0]);

  if (!leslie?.id) throw new Error('Could not create customer');

  const leslieTicket = await db
    .insert(schema.tickets)
    .values({
      id: generateEntityId('', 'ti'),
      title: "Order hasn't arrived",
      status: TicketStatus.Open,
      priority: TicketPriority.Critical,
      customerId: leslie.id,
      createdAt: new Date('2023-05-04T20:54:41.389Z'),
      createdById: botUser.id,
      assignedToId: tomUser.id,
    })
    .returning({ id: schema.tickets.id, createdAt: schema.tickets.createdAt })
    .then((res) => res[0]);

  if (!leslieTicket?.id) throw new Error('Could not create ticket');

  await db.insert(schema.labels).values({
    id: generateEntityId('', 'lb'),
    ticketId: leslieTicket.id,
    labelTypeId: bugReportLabelType.id,
  });

  await db.insert(schema.ticketActivities).values({
    id: generateEntityId('', 'ta'),
    ticketId: leslieTicket.id,
    type: TicketActivityType.Created,
    createdAt: leslieTicket.createdAt,
    createdById: botUser.id,
  });

  await db.insert(schema.ticketActivities).values({
    id: generateEntityId('', 'ta'),
    ticketId: leslieTicket.id,
    type: TicketActivityType.AssignmentChanged,
    extraInfo: {
      oldAssignedToId: null,
      newAssignedToId: tom.id,
    } satisfies TicketAssignmentChanged,
    createdAt: new Date('2023-05-20T20:54:41.389Z'),
    createdById: botUser.id,
  });

  await db.insert(schema.ticketChats).values({
    id: generateEntityId('', 'ms'),
    contentType: ChatContentType.TextPlain,
    content: "My order hasn't arrived yet.",
    createdAt: new Date('2023-05-04T20:54:41.389Z'),
    direction: ChatDirection.Inbound,
    status: ChatStatus.Seen,
    createdById: botUser.id,
    ticketId: leslieTicket.id,
  });
  await db.insert(schema.ticketChats).values({
    id: generateEntityId('', 'ms'),
    contentType: ChatContentType.TextPlain,
    content:
      'We apologize for the inconvenience. Can you please provide your order number so we can investigate?',
    createdAt: new Date('2023-05-11T10:33:56.231Z'),
    direction: ChatDirection.Outbound,
    status: ChatStatus.Seen,
    createdById: botUser.id,
    ticketId: leslieTicket.id,
  });

  const leslieTicket2 = await db
    .insert(schema.tickets)
    .values({
      id: generateEntityId('', 'ti'),
      title: 'Change product of purchase',
      status: TicketStatus.Open,
      priority: TicketPriority.Medium,
      customerId: leslie.id,
      createdAt: new Date('2023-05-06T11:23:45.389Z'),
      createdById: botUser.id,
      assignedToId: jeffUser.id,
    })
    .returning({ id: schema.tickets.id, createdAt: schema.tickets.createdAt })
    .then((res) => res[0]);

  if (!leslieTicket2?.id) throw new Error('Could not create ticket');

  await db.insert(schema.labels).values({
    id: generateEntityId('', 'lb'),
    ticketId: leslieTicket2.id,
    labelTypeId: featureRequestLabelType.id,
  });

  await db.insert(schema.ticketActivities).values({
    id: generateEntityId('', 'ta'),
    ticketId: leslieTicket2.id,
    type: TicketActivityType.Created,
    createdAt: leslieTicket2.createdAt,
    createdById: botUser.id,
  });

  await db.insert(schema.ticketChats).values({
    id: generateEntityId('', 'ms'),
    contentType: ChatContentType.TextPlain,
    content: 'can ya help me change a product of purchase?',
    createdAt: new Date('2023-05-06T11:23:45.389Z'),
    createdById: botUser.id,
    direction: ChatDirection.Inbound,
    status: ChatStatus.Seen,
    ticketId: leslieTicket2.id,
  });
  await db.insert(schema.ticketChats).values({
    id: generateEntityId('', 'ms'),
    contentType: ChatContentType.TextPlain,
    content: 'Can you tell me which product you would like to change?',
    createdAt: new Date('2023-05-07T22:40Z'),
    createdById: botUser.id,
    direction: ChatDirection.Outbound,
    status: ChatStatus.Seen,
    ticketId: leslieTicket2.id,
  });
  await db.insert(schema.ticketChats).values({
    id: generateEntityId('', 'ms'),
    contentType: ChatContentType.TextPlain,
    content: 'The socks, please',
    createdAt: new Date('2023-05-08T22:40Z'),
    createdById: botUser.id,
    direction: ChatDirection.Inbound,
    status: ChatStatus.Seen,
    ticketId: leslieTicket2.id,
  });

  const leslieTicket3 = await db
    .insert(schema.tickets)
    .values({
      id: generateEntityId('', 'ti'),
      title: 'Problem with canceling purchase',
      status: TicketStatus.Done,
      priority: TicketPriority.Medium,
      customerId: leslie.id,
      createdAt: new Date('2023-05-06T11:23:45.389Z'),
      createdById: botUser.id,
      statusChangedAt: new Date('2023-06-12T06:10:45.389Z'),
    })
    .returning({
      id: schema.tickets.id,
      createdAt: schema.tickets.createdAt,
      statusChangedAt: schema.tickets.statusChangedAt,
    })
    .then((res) => res[0]);

  if (!leslieTicket3?.id) throw new Error('Could not create ticket');

  await db.insert(schema.labels).values({
    id: generateEntityId('', 'lb'),
    ticketId: leslieTicket3.id,
    labelTypeId: bugReportLabelType.id,
  });

  await db.insert(schema.ticketActivities).values({
    id: generateEntityId('', 'ta'),
    ticketId: leslieTicket3.id,
    type: TicketActivityType.Created,
    createdAt: leslieTicket3.createdAt,
    createdById: botUser.id,
  });

  await db.insert(schema.ticketActivities).values({
    id: generateEntityId('', 'ta'),
    ticketId: leslieTicket3.id,
    type: TicketActivityType.Resolved,
    createdAt: leslieTicket3.statusChangedAt ?? new Date(),
    createdById: botUser.id,
  });

  await db.insert(schema.ticketChats).values({
    id: generateEntityId('', 'ms'),
    contentType: ChatContentType.TextPlain,
    content: 'problems with canceling purchase',
    createdAt: new Date('2023-05-06T11:23:45.389Z'),
    createdById: botUser.id,
    direction: ChatDirection.Inbound,
    status: ChatStatus.DeliveredToDevice,
    ticketId: leslieTicket3.id,
  });

  const michael = await db
    .insert(schema.customers)
    .values({
      id: generateEntityId('', 'co'),
      name: 'Michael Foster',
      email: 'michael.foster@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    })
    .returning({ id: schema.tickets.id })
    .then((res) => res[0]);

  if (!michael?.id) throw new Error('Could not create customer');

  const michaelTicket = await db
    .insert(schema.tickets)
    .values({
      id: generateEntityId('', 'ti'),
      title: 'Damaged product received',
      status: TicketStatus.Open,
      priority: TicketPriority.Medium,
      customerId: michael.id,
      createdAt: new Date('2023-03-03T14:02Z'),
      createdById: botUser.id,
    })
    .returning({ id: schema.tickets.id, createdAt: schema.tickets.createdAt })
    .then((res) => res[0]);

  if (!michaelTicket?.id) throw new Error('Could not create ticket');

  await db.insert(schema.labels).values({
    id: generateEntityId('', 'lb'),
    ticketId: michaelTicket.id,
    labelTypeId: bugReportLabelType.id,
  });

  await db.insert(schema.ticketActivities).values({
    id: generateEntityId('', 'ta'),
    ticketId: michaelTicket.id,
    type: TicketActivityType.Created,
    createdAt: michaelTicket.createdAt,
    createdById: botUser.id,
  });

  await db.insert(schema.ticketChats).values({
    id: generateEntityId('', 'ms'),
    contentType: ChatContentType.TextPlain,
    content: 'I received a damaged product.',
    createdAt: new Date('2023-03-03T14:02Z'),
    createdById: botUser.id,
    direction: ChatDirection.Inbound,
    status: ChatStatus.Seen,
    ticketId: michaelTicket.id,
  });
  await db.insert(schema.ticketChats).values({
    id: generateEntityId('', 'ms'),
    contentType: ChatContentType.TextPlain,
    content:
      'We apologize for the inconvenience. Can you please provide a photo of the damaged product so we can assist you further?',
    createdAt: new Date('2023-03-12T17:20Z'),
    createdById: botUser.id,
    direction: ChatDirection.Outbound,
    status: ChatStatus.Seen,
    ticketId: michaelTicket.id,
  });

  const dries = await db
    .insert(schema.customers)
    .values({
      id: generateEntityId('', 'co'),
      name: 'Dries Vincent',
      email: 'dries.vincent@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    })
    .returning({ id: schema.customers.id })
    .then((res) => res[0]);

  if (!dries?.id) throw new Error('Could not create customer');

  const driesTicket = await db
    .insert(schema.tickets)
    .values({
      id: generateEntityId('', 'ti'),
      title: 'Need to return an item',
      status: TicketStatus.Open,
      priority: TicketPriority.Medium,
      customerId: dries.id,
      createdAt: new Date('2023-03-03T13:23Z'),
      createdById: botUser.id,
    })
    .returning({ id: schema.tickets.id, createdAt: schema.tickets.createdAt })
    .then((res) => res[0]);

  if (!driesTicket?.id) throw new Error('Could not create ticket');

  await db.insert(schema.ticketActivities).values({
    id: generateEntityId('', 'ta'),
    ticketId: driesTicket.id,
    type: TicketActivityType.Created,
    createdAt: driesTicket.createdAt,
    createdById: botUser.id,
  });

  await db.insert(schema.ticketChats).values({
    id: generateEntityId('', 'ms'),
    contentType: ChatContentType.TextPlain,
    content: 'I need to return an item.',
    createdAt: new Date('2023-03-03T13:23Z'),
    createdById: botUser.id,
    direction: ChatDirection.Inbound,
    status: ChatStatus.Seen,
    ticketId: driesTicket.id,
  });
  await db.insert(schema.ticketChats).values({
    id: generateEntityId('', 'ms'),
    contentType: ChatContentType.TextPlain,
    content:
      'Certainly. Please provide your order number and reason for return, and we will provide you with instructions on how to proceed.',
    createdAt: new Date('2023-04-01T06:06Z'),
    createdById: botUser.id,
    direction: ChatDirection.Outbound,
    status: ChatStatus.DeliveredToDevice,
    ticketId: driesTicket.id,
  });

  const lindsay = await db
    .insert(schema.customers)
    .values({
      id: generateEntityId('', 'co'),
      name: 'Lindsay Walton',
      email: 'lindsay.walton@example.com',
      phone: '+441632960050',
      avatarUrl:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      language: 'en_GB',
      timezone: 'Europe/London',
    })
    .returning({ id: schema.customers.id })
    .then((res) => res[0]);

  if (!lindsay?.id) throw new Error('Could not create customer');

  const lindsayTicket = await db
    .insert(schema.tickets)
    .values({
      id: generateEntityId('', 'ti'),
      title: 'Change shipping address',
      status: TicketStatus.Open,
      priority: TicketPriority.Medium,
      customerId: lindsay.id,
      createdAt: new Date('2023-03-02T21:13Z'),
      createdById: botUser.id,
    })
    .returning({ id: schema.tickets.id, createdAt: schema.tickets.createdAt })
    .then((res) => res[0]);

  if (!lindsayTicket?.id) throw new Error('Could not create ticket');

  await db.insert(schema.labels).values({
    id: generateEntityId('', 'lb'),
    ticketId: lindsayTicket.id,
    labelTypeId: questionLabelType.id,
  });

  await db.insert(schema.ticketChats).values({
    id: generateEntityId('', 'ms'),
    contentType: ChatContentType.TextPlain,
    content: 'I want to change my shipping address.',
    createdAt: new Date('2023-03-02T21:13Z'),
    createdById: botUser.id,
    direction: ChatDirection.Inbound,
    status: ChatStatus.Seen,
    ticketId: lindsayTicket.id,
  });
  await db.insert(schema.ticketChats).values({
    id: generateEntityId('', 'ms'),
    contentType: ChatContentType.TextPlain,
    content:
      "No problem. Can you please provide your order number and the new shipping address you'd like to use?",
    createdAt: new Date('2023-03-03T22:40Z'),
    createdById: botUser.id,
    direction: ChatDirection.Outbound,
    status: ChatStatus.DeliveredToDevice,
    ticketId: lindsayTicket.id,
  });

  await db.insert(schema.ticketActivities).values({
    id: generateEntityId('', 'ta'),
    ticketId: lindsayTicket.id,
    type: TicketActivityType.Created,
    createdAt: lindsayTicket.createdAt,
    createdById: botUser.id,
  });
}

main();
