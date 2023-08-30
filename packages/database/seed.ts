import { db, schema } from '.';
import {
  MessageContentType,
  MessageDirection,
  MessageStatus,
} from './schema/message';

async function main() {
  await db.insert(schema.contacts).values({
    name: 'Courtney Henry',
    email: 'courtney.henry@example.com',
    avatarUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  });
  await db.insert(schema.contacts).values({
    name: 'Tom Cook',
    email: 'tom.cook@example.com',
    avatarUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  });
  await db.insert(schema.contacts).values({
    name: 'Lawrence Brooks',
    email: 'lawrence.brooks@example.com',
    avatarUrl:
      'https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  });
  await db.insert(schema.contacts).values({
    name: 'Jeffrey Clark',
    email: 'jeffrey.clark@example.com',
    avatarUrl:
      'https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  });
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
    .returning({ id: schema.contacts.id });

  if (!leslie[0]?.id) throw new Error('Could not create contact');

  const leslieTicket = await db
    .insert(schema.tickets)
    .values({
      content: "My order hasn't arrived yet.",
      createdAt: new Date('2023-05-04T20:54:41.389Z'),
      contactId: leslie[0].id,
    })
    .returning({ id: schema.tickets.id });

  if (!leslieTicket[0]?.id) throw new Error('Could not create ticket');

  await db
    .insert(schema.messages)
    .values([
      {
        contentType: MessageContentType.TextPlain,
        content: "My order hasn't arrived yet.",
        createdAt: new Date('2023-05-04T20:54:41.389Z'),
        direction: MessageDirection.Inbound,
        status: MessageStatus.Seen,
        senderId: 1,
        ticketId: leslieTicket[0].id,
      },
      {
        contentType: MessageContentType.TextPlain,
        content:
          'We apologize for the inconvenience. Can you please provide your order number so we can investigate?',
        createdAt: new Date('2023-05-11T10:33:56.231Z'),
        direction: MessageDirection.Outbound,
        status: MessageStatus.Seen,
        senderId: 5,
        ticketId: leslieTicket[0].id,
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
    .returning({ id: schema.tickets.id });

  if (!michael[0]?.id) throw new Error('Could not create contact');

  const michaelTicket = await db
    .insert(schema.tickets)
    .values({
      content: 'I received a damaged product.',
      createdAt: new Date('2023-03-03T14:02Z'),
      contactId: michael[0].id,
    })
    .returning({ id: schema.tickets.id });

  if (!michaelTicket[0]?.id) throw new Error('Could not create ticket');

  await db
    .insert(schema.messages)
    .values([
      {
        contentType: MessageContentType.TextPlain,
        content: 'I received a damaged product.',
        createdAt: new Date('2023-03-03T14:02Z'),
        direction: MessageDirection.Inbound,
        status: MessageStatus.Seen,
        senderId: 2,
        ticketId: michaelTicket[0].id,
      },
      {
        contentType: MessageContentType.TextPlain,
        content:
          'We apologize for the inconvenience. Can you please provide a photo of the damaged product so we can assist you further?',
        createdAt: new Date('2023-03-12T17:20Z'),
        direction: MessageDirection.Outbound,
        status: MessageStatus.Seen,
        senderId: 6,
        ticketId: michaelTicket[0].id,
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
    .returning({ id: schema.contacts.id });

  if (!dries[0]?.id) throw new Error('Could not create contact');

  const driesTicket = await db
    .insert(schema.tickets)
    .values({
      content: 'I need to return an item.',
      createdAt: new Date('2023-03-03T13:23Z'),
      contactId: dries[0].id,
    })
    .returning({ id: schema.tickets.id });

  if (!driesTicket[0]?.id) throw new Error('Could not create ticket');

  await db
    .insert(schema.messages)
    .values([
      {
        contentType: MessageContentType.TextPlain,
        content: 'I need to return an item.',
        createdAt: new Date('2023-03-03T13:23Z'),
        direction: MessageDirection.Inbound,
        status: MessageStatus.Seen,
        senderId: 3,
        ticketId: driesTicket[0].id,
      },
      {
        contentType: MessageContentType.TextPlain,
        content:
          'Certainly. Please provide your order number and reason for return, and we will provide you with instructions on how to proceed.',
        createdAt: new Date('2023-04-01T06:06Z'),
        direction: MessageDirection.Outbound,
        status: MessageStatus.DeliveredToDevice,
        senderId: 7,
        ticketId: driesTicket[0].id,
      },
    ])
    .returning({ id: schema.tickets.id });

  const lindsay = await db
    .insert(schema.contacts)
    .values({
      name: 'Lindsay Walton',
      email: 'lindsay.walton@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    })
    .returning({ id: schema.contacts.id });

  if (!lindsay[0]?.id) throw new Error('Could not create contact');

  const lindsayTicket = await db
    .insert(schema.tickets)
    .values({
      content:
        'Unde dolore exercitationem nobis reprehenderit rerum corporis accusamus. Nemo suscipit temporibus quidem dolorum. Nobis optio quae atque blanditiis aspernatur doloribus sit accusamus. Sunt reiciendis ut corrupti ab debitis dolorem dolorem nam sit. Ducimus nisi qui earum aliquam. Est nam doloribus culpa illum.',
      createdAt: new Date('2023-03-02T21:13Z'),
      contactId: lindsay[0].id,
    })
    .returning({ id: schema.tickets.id });

  if (!lindsayTicket[0]?.id) throw new Error('Could not create ticket');

  await db
    .insert(schema.messages)
    .values([
      {
        contentType: MessageContentType.TextPlain,
        content: 'I want to change my shipping address.',
        createdAt: new Date('2023-03-02T21:13Z'),
        direction: MessageDirection.Inbound,
        status: MessageStatus.Seen,
        senderId: 4,
        ticketId: lindsayTicket[0].id,
      },
      {
        contentType: MessageContentType.TextPlain,
        content:
          "No problem. Can you please provide your order number and the new shipping address you'd like to use?",
        createdAt: new Date('2023-03-03T22:40Z'),
        direction: MessageDirection.Outbound,
        status: MessageStatus.DeliveredToDevice,
        senderId: 8,
        ticketId: lindsayTicket[0].id,
      },
    ])
    .returning({ id: schema.tickets.id });
}
main();
