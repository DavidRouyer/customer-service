import {
  MessageContentType,
  MessageDirection,
  MessageStatus,
  PrismaClient,
} from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  const courtney = await prisma.contact.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Courtney Henry',
      email: 'courtney.henry@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  });
  const tom = await prisma.contact.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Tom Cook',
      email: 'tom.cook@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  });
  const lawrence = await prisma.contact.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Lawrence Brooks',
      email: 'lawrence.brooks@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  });
  const jeffrey = await prisma.contact.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'Jeffrey Clark',
      email: 'jeffrey.clark@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  });
  const leslie = await prisma.contact.upsert({
    where: { id: 5 },
    update: {},
    create: {
      name: 'Leslie Alexandre',
      email: 'leslie.alexandre@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      phone: '+33606060606',
      language: 'fr_FR',
      timezone: 'Europe/Paris',
      tickets: {
        create: {
          content: "My order hasn't arrived yet.",
          createdAt: new Date('2023-05-04T20:54:41.389Z'),
          messages: {
            createMany: {
              data: [
                {
                  contentType: MessageContentType.TextPlain,
                  content: "My order hasn't arrived yet.",
                  createdAt: new Date('2023-05-04T20:54:41.389Z'),
                  direction: MessageDirection.Inbound,
                  status: MessageStatus.Seen,
                  senderId: 1,
                },
                {
                  contentType: MessageContentType.TextPlain,
                  content:
                    'We apologize for the inconvenience. Can you please provide your order number so we can investigate?',
                  createdAt: new Date('2023-05-11T10:33:56.231Z'),
                  direction: MessageDirection.Outbound,
                  status: MessageStatus.Seen,
                  senderId: 5,
                },
              ],
            },
          },
        },
      },
    },
  });
  const michael = await prisma.contact.upsert({
    where: { id: 6 },
    update: {},
    create: {
      name: 'Michael Foster',
      email: 'michael.foster@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      tickets: {
        create: {
          content: 'I received a damaged product.',
          createdAt: new Date('2023-03-03T14:02Z'),
          messages: {
            createMany: {
              data: [
                {
                  contentType: MessageContentType.TextPlain,
                  content: 'I received a damaged product.',
                  createdAt: new Date('2023-03-03T14:02Z'),
                  direction: MessageDirection.Inbound,
                  status: MessageStatus.Seen,
                  senderId: 2,
                },
                {
                  contentType: MessageContentType.TextPlain,
                  content:
                    'We apologize for the inconvenience. Can you please provide a photo of the damaged product so we can assist you further?',
                  createdAt: new Date('2023-03-12T17:20Z'),
                  direction: MessageDirection.Outbound,
                  status: MessageStatus.Seen,
                  senderId: 6,
                },
              ],
            },
          },
        },
      },
    },
  });
  const dries = await prisma.contact.upsert({
    where: { id: 7 },
    update: {},
    create: {
      name: 'Dries Vincent',
      email: 'dries.vincent@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      tickets: {
        create: {
          content: 'I need to return an item.',
          createdAt: new Date('2023-03-03T13:23Z'),
          messages: {
            createMany: {
              data: [
                {
                  contentType: MessageContentType.TextPlain,
                  content: 'I need to return an item.',
                  createdAt: new Date('2023-03-03T13:23Z'),
                  direction: MessageDirection.Inbound,
                  status: MessageStatus.Seen,
                  senderId: 3,
                },
                {
                  contentType: MessageContentType.TextPlain,
                  content:
                    'Certainly. Please provide your order number and reason for return, and we will provide you with instructions on how to proceed.',
                  createdAt: new Date('2023-04-01T06:06Z'),
                  direction: MessageDirection.Outbound,
                  status: MessageStatus.DeliveredToDevice,
                  senderId: 7,
                },
              ],
            },
          },
        },
      },
    },
  });
  const lindsay = await prisma.contact.upsert({
    where: { id: 8 },
    update: {},
    create: {
      name: 'Lindsay Walton',
      email: 'lindsay.walton@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      tickets: {
        create: {
          content:
            'Unde dolore exercitationem nobis reprehenderit rerum corporis accusamus. Nemo suscipit temporibus quidem dolorum. Nobis optio quae atque blanditiis aspernatur doloribus sit accusamus. Sunt reiciendis ut corrupti ab debitis dolorem dolorem nam sit. Ducimus nisi qui earum aliquam. Est nam doloribus culpa illum.',
          createdAt: new Date('2023-03-02T21:13Z'),
          messages: {
            createMany: {
              data: [
                {
                  contentType: MessageContentType.TextPlain,
                  content: 'I want to change my shipping address.',
                  createdAt: new Date('2023-03-02T21:13Z'),
                  direction: MessageDirection.Inbound,
                  status: MessageStatus.Seen,
                  senderId: 4,
                },
                {
                  contentType: MessageContentType.TextPlain,
                  content:
                    "No problem. Can you please provide your order number and the new shipping address you'd like to use?",
                  createdAt: new Date('2023-03-03T22:40Z'),
                  direction: MessageDirection.Outbound,
                  status: MessageStatus.DeliveredToDevice,
                  senderId: 8,
                },
              ],
            },
          },
        },
      },
    },
  });
  console.log({
    leslie,
    michael,
    dries,
    lindsay,
    courtney,
    tom,
    lawrence,
    jeffrey,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
