import type {
  TicketAssignmentChanged,
  TicketChat,
  TicketStatusChanged,
} from '@cs/kyaku/models';
import {
  TicketPriority,
  TicketStatus,
  TimelineEntryType,
} from '@cs/kyaku/models';
import { generateEntityId } from '@cs/kyaku/utils';

import { dbConnection, eq, schema } from '.';

async function main() {
  let botUser = await dbConnection
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
    botUser = await dbConnection.query.users.findFirst({
      where: eq(schema.users.id, '40cebacc-c7ae-4b5b-8072-3122d572c6d4'),
    });

  if (!botUser?.id) throw new Error('Could not create user');

  const bugReportLabelType = await dbConnection
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

  const featureRequestLabelType = await dbConnection
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

  const questionLabelType = await dbConnection
    .insert(schema.labelTypes)
    .values({
      id: generateEntityId('', 'lt'),
      name: 'General question',
      icon: 'circle-help',
      createdById: botUser.id,
    })
    .returning({ id: schema.labelTypes.id })
    .then((res) => res[0]);

  if (!questionLabelType?.id) throw new Error('Could not create label type');

  await dbConnection.insert(schema.customers).values({
    id: generateEntityId('', 'co'),
    name: 'Courtney Henry',
    email: 'courtney.henry@example.com',
    avatarUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    createdById: botUser.id,
  });

  const tomUser = await dbConnection
    .insert(schema.users)
    .values({
      id: crypto.randomUUID(),
      name: 'Tom Cook',
      email: 'tom.cook@example.com',
    })
    .returning({ id: schema.users.id })
    .then((res) => res[0]);

  if (!tomUser?.id) throw new Error('Could not create user');

  const jeffUser = await dbConnection
    .insert(schema.users)
    .values({
      id: crypto.randomUUID(),
      name: 'Jeff Lacey',
      email: 'jeff.lacey@example.com',
    })
    .returning({ id: schema.users.id })
    .then((res) => res[0]);

  if (!jeffUser?.id) throw new Error('Could not create user');

  await dbConnection.insert(schema.customers).values({
    id: generateEntityId('', 'co'),
    name: 'Lawrence Brooks',
    email: 'lawrence.brooks@example.com',
    avatarUrl:
      'https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    createdById: botUser.id,
  });

  const leslie = await dbConnection
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
      createdById: botUser.id,
    })
    .returning({ id: schema.customers.id })
    .then((res) => res[0]);

  if (!leslie?.id) throw new Error('Could not create customer');

  const leslieTicket = await dbConnection
    .insert(schema.tickets)
    .values({
      id: generateEntityId('', 'ti'),
      title: "Order hasn't arrived",
      status: TicketStatus.Todo,
      priority: TicketPriority.Critical,
      customerId: leslie.id,
      createdAt: new Date('2023-05-04T20:54:41.389Z'),
      createdById: botUser.id,
      assignedToId: tomUser.id,
    })
    .returning({ id: schema.tickets.id, createdAt: schema.tickets.createdAt })
    .then((res) => res[0]);

  if (!leslieTicket?.id) throw new Error('Could not create ticket');

  await dbConnection.insert(schema.labels).values({
    id: generateEntityId('', 'lb'),
    ticketId: leslieTicket.id,
    labelTypeId: bugReportLabelType.id,
  });

  await dbConnection.insert(schema.ticketTimelineEntries).values({
    id: generateEntityId('', 'te'),
    ticketId: leslieTicket.id,
    customerId: leslie.id,
    type: TimelineEntryType.AssignmentChanged,
    entry: {
      oldAssignedToId: null,
      newAssignedToId: tomUser.id,
    } satisfies TicketAssignmentChanged,
    createdAt: new Date('2023-05-20T20:54:41.389Z'),
    userCreatedById: botUser.id,
  });

  await dbConnection.insert(schema.ticketTimelineEntries).values({
    id: generateEntityId('', 'te'),
    type: TimelineEntryType.Chat,
    entry: {
      text: "My order hasn't arrived yet.",
    } satisfies TicketChat,
    customerId: leslie.id,
    createdAt: new Date('2023-05-04T20:54:41.389Z'),
    customerCreatedById: leslie.id,
    ticketId: leslieTicket.id,
  });
  await dbConnection.insert(schema.ticketTimelineEntries).values({
    id: generateEntityId('', 'te'),
    type: TimelineEntryType.Chat,
    entry: {
      text: 'We apologize for the inconvenience. Can you please provide your order number so we can investigate?',
    } satisfies TicketChat,
    customerId: leslie.id,
    createdAt: new Date('2023-05-11T10:33:56.231Z'),
    userCreatedById: botUser.id,
    ticketId: leslieTicket.id,
  });

  const leslieTicket2 = await dbConnection
    .insert(schema.tickets)
    .values({
      id: generateEntityId('', 'ti'),
      title: 'Change product of purchase',
      status: TicketStatus.Todo,
      priority: TicketPriority.Medium,
      customerId: leslie.id,
      createdAt: new Date('2023-05-06T11:23:45.389Z'),
      createdById: botUser.id,
      assignedToId: jeffUser.id,
    })
    .returning({ id: schema.tickets.id, createdAt: schema.tickets.createdAt })
    .then((res) => res[0]);

  if (!leslieTicket2?.id) throw new Error('Could not create ticket');

  await dbConnection.insert(schema.labels).values({
    id: generateEntityId('', 'lb'),
    ticketId: leslieTicket2.id,
    labelTypeId: featureRequestLabelType.id,
  });

  await dbConnection.insert(schema.ticketTimelineEntries).values({
    id: generateEntityId('', 'te'),
    type: TimelineEntryType.Chat,
    entry: {
      text: 'can ya help me change a product of purchase?',
    } satisfies TicketChat,
    customerId: leslie.id,
    createdAt: new Date('2023-05-06T11:23:45.389Z'),
    customerCreatedById: leslie.id,
    ticketId: leslieTicket2.id,
  });
  await dbConnection.insert(schema.ticketTimelineEntries).values({
    id: generateEntityId('', 'te'),
    type: TimelineEntryType.Chat,
    entry: {
      text: 'Can you tell me which product you would like to change?',
    } satisfies TicketChat,
    customerId: leslie.id,
    createdAt: new Date('2023-05-07T22:40Z'),
    userCreatedById: botUser.id,
    ticketId: leslieTicket2.id,
  });
  await dbConnection.insert(schema.ticketTimelineEntries).values({
    id: generateEntityId('', 'te'),
    type: TimelineEntryType.Chat,
    entry: {
      text: 'The socks, please',
    } satisfies TicketChat,
    customerId: leslie.id,
    createdAt: new Date('2023-05-08T22:40Z'),
    customerCreatedById: leslie.id,
    ticketId: leslieTicket2.id,
  });

  const leslieTicket3 = await dbConnection
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

  await dbConnection.insert(schema.labels).values({
    id: generateEntityId('', 'lb'),
    ticketId: leslieTicket3.id,
    labelTypeId: bugReportLabelType.id,
  });

  await dbConnection.insert(schema.ticketTimelineEntries).values({
    id: generateEntityId('', 'te'),
    type: TimelineEntryType.StatusChanged,
    entry: {
      oldStatus: TicketStatus.Todo,
      newStatus: TicketStatus.Done,
    } satisfies TicketStatusChanged,
    customerId: leslie.id,
    ticketId: leslieTicket3.id,
    createdAt: leslieTicket3.statusChangedAt ?? new Date(),
    userCreatedById: botUser.id,
  });

  await dbConnection.insert(schema.ticketTimelineEntries).values({
    id: generateEntityId('', 'te'),
    type: TimelineEntryType.Chat,
    entry: {
      text: 'problems with canceling purchase',
    } satisfies TicketChat,
    customerId: leslie.id,
    createdAt: new Date('2023-05-06T11:23:45.389Z'),
    customerCreatedById: leslie.id,
    ticketId: leslieTicket3.id,
  });

  const michael = await dbConnection
    .insert(schema.customers)
    .values({
      id: generateEntityId('', 'co'),
      name: 'Michael Foster',
      email: 'michael.foster@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      createdById: botUser.id,
    })
    .returning({ id: schema.tickets.id })
    .then((res) => res[0]);

  if (!michael?.id) throw new Error('Could not create customer');

  const michaelTicket = await dbConnection
    .insert(schema.tickets)
    .values({
      id: generateEntityId('', 'ti'),
      title: 'Damaged product received',
      status: TicketStatus.Todo,
      priority: TicketPriority.Medium,
      customerId: michael.id,
      createdAt: new Date('2023-03-03T14:02Z'),
      createdById: botUser.id,
    })
    .returning({ id: schema.tickets.id, createdAt: schema.tickets.createdAt })
    .then((res) => res[0]);

  if (!michaelTicket?.id) throw new Error('Could not create ticket');

  await dbConnection.insert(schema.labels).values({
    id: generateEntityId('', 'lb'),
    ticketId: michaelTicket.id,
    labelTypeId: bugReportLabelType.id,
  });

  await dbConnection.insert(schema.ticketTimelineEntries).values({
    id: generateEntityId('', 'te'),
    type: TimelineEntryType.Chat,
    entry: {
      text: 'I received a damaged product.',
    } satisfies TicketChat,
    customerId: michael.id,
    createdAt: new Date('2023-03-03T14:02Z'),
    customerCreatedById: michael.id,
    ticketId: michaelTicket.id,
  });

  await dbConnection.insert(schema.ticketTimelineEntries).values({
    id: generateEntityId('', 'te'),
    type: TimelineEntryType.Chat,
    entry: {
      text: 'We apologize for the inconvenience. Can you please provide a photo of the damaged product so we can assist you further?',
    } satisfies TicketChat,
    customerId: michael.id,
    createdAt: new Date('2023-03-12T17:20Z'),
    userCreatedById: botUser.id,
    ticketId: michaelTicket.id,
  });

  const dries = await dbConnection
    .insert(schema.customers)
    .values({
      id: generateEntityId('', 'co'),
      name: 'Dries Vincent',
      email: 'dries.vincent@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      createdById: botUser.id,
    })
    .returning({ id: schema.customers.id })
    .then((res) => res[0]);

  if (!dries?.id) throw new Error('Could not create customer');

  const driesTicket = await dbConnection
    .insert(schema.tickets)
    .values({
      id: generateEntityId('', 'ti'),
      title: 'Need to return an item',
      status: TicketStatus.Todo,
      priority: TicketPriority.Medium,
      customerId: dries.id,
      createdAt: new Date('2023-03-03T13:23Z'),
      createdById: botUser.id,
    })
    .returning({ id: schema.tickets.id, createdAt: schema.tickets.createdAt })
    .then((res) => res[0]);

  if (!driesTicket?.id) throw new Error('Could not create ticket');

  await dbConnection.insert(schema.ticketTimelineEntries).values({
    id: generateEntityId('', 'te'),
    type: TimelineEntryType.Chat,
    entry: {
      text: 'I need to return an item.',
    } satisfies TicketChat,
    customerId: dries.id,
    createdAt: new Date('2023-03-03T13:23Z'),
    customerCreatedById: dries.id,
    ticketId: driesTicket.id,
  });

  await dbConnection.insert(schema.ticketTimelineEntries).values({
    id: generateEntityId('', 'te'),
    type: TimelineEntryType.Chat,
    entry: {
      text: 'Certainly. Please provide your order number and reason for return, and we will provide you with instructions on how to proceed.',
    } satisfies TicketChat,
    customerId: dries.id,
    createdAt: new Date('2023-04-01T06:06Z'),
    userCreatedById: botUser.id,
    ticketId: driesTicket.id,
  });

  const lindsay = await dbConnection
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
      createdById: botUser.id,
    })
    .returning({ id: schema.customers.id })
    .then((res) => res[0]);

  if (!lindsay?.id) throw new Error('Could not create customer');

  const lindsayTicket = await dbConnection
    .insert(schema.tickets)
    .values({
      id: generateEntityId('', 'ti'),
      title: 'Change shipping address',
      status: TicketStatus.Todo,
      priority: TicketPriority.Medium,
      customerId: lindsay.id,
      createdAt: new Date('2023-03-02T21:13Z'),
      createdById: botUser.id,
    })
    .returning({ id: schema.tickets.id, createdAt: schema.tickets.createdAt })
    .then((res) => res[0]);

  if (!lindsayTicket?.id) throw new Error('Could not create ticket');

  await dbConnection.insert(schema.labels).values({
    id: generateEntityId('', 'lb'),
    ticketId: lindsayTicket.id,
    labelTypeId: questionLabelType.id,
  });

  await dbConnection.insert(schema.ticketTimelineEntries).values({
    id: generateEntityId('', 'te'),
    type: TimelineEntryType.Chat,
    entry: {
      text: 'I want to change my shipping address.',
    } satisfies TicketChat,
    customerId: lindsay.id,
    createdAt: new Date('2023-03-02T21:13Z'),
    customerCreatedById: lindsay.id,
    ticketId: lindsayTicket.id,
  });

  await dbConnection.insert(schema.ticketTimelineEntries).values({
    id: generateEntityId('', 'te'),
    type: TimelineEntryType.Chat,
    entry: {
      text: "No problem. Can you please provide your order number and the new shipping address you'd like to use?",
    } satisfies TicketChat,
    customerId: lindsay.id,
    createdAt: new Date('2023-03-03T22:40Z'),
    userCreatedById: botUser.id,
    ticketId: lindsayTicket.id,
  });
}

await main();
