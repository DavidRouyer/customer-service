import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  const leslie = await prisma.contact.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Leslie Alexander',
      imageUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      tickets: {
        create: {
          content:
            'Explicabo nihil laborum. Saepe facilis consequuntur in eaque. Consequatur perspiciatis quam. Sed est illo quia. Culpa vitae placeat vitae. Repudiandae sunt exercitationem nihil nisi facilis placeat minima eveniet.',
          createdAt: new Date('2023-05-04T20:54:41.389Z'),
        },
      },
    },
  });
  const michael = await prisma.contact.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Michael Foster',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      tickets: {
        create: {
          content:
            'Laudantium quidem non et saepe vel sequi accusamus consequatur et. Saepe inventore veniam incidunt cumque et laborum nemo blanditiis rerum. A unde et molestiae autem ad. Architecto dolor ex accusantium maxime cumque laudantium itaque aut perferendis.',
          createdAt: new Date('2023-03-03T14:02Z'),
        },
      },
    },
  });
  const dries = await prisma.contact.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Dries Vincent',
      imageUrl:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      tickets: {
        create: {
          content:
            'Quia animi harum in quis quidem sint. Ipsum dolorem molestias veritatis quis eveniet commodi assumenda temporibus. Dicta ut modi alias nisi. Veniam quia velit et ut. Id quas ducimus reprehenderit veniam fugit amet fugiat ipsum eius. Voluptas nobis earum in in vel corporis nisi.',
          createdAt: new Date('2023-03-03T13:23Z'),
        },
      },
    },
  });
  const lindsay = await prisma.contact.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'Lindsay Walton',
      imageUrl:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      tickets: {
        create: {
          content:
            'Unde dolore exercitationem nobis reprehenderit rerum corporis accusamus. Nemo suscipit temporibus quidem dolorum. Nobis optio quae atque blanditiis aspernatur doloribus sit accusamus. Sunt reiciendis ut corrupti ab debitis dolorem dolorem nam sit. Ducimus nisi qui earum aliquam. Est nam doloribus culpa illum.',
          createdAt: new Date('2023-03-02T21:13Z'),
        },
      },
    },
  });
  const courtney = await prisma.contact.upsert({
    where: { id: 5 },
    update: {},
    create: {
      name: 'Courtney Henry',
      imageUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      tickets: {
        create: {
          content:
            'Morbi vel enim posuere, commodo metus vitae, sagittis libero. Ut vitae elit justo. In sodales libero nisl, blandit mollis turpis congue ac. Integer luctus tristique suscipit.',
          createdAt: new Date('2023-03-01T21:13Z'),
        },
      },
    },
  });
  const tom = await prisma.contact.upsert({
    where: { id: 6 },
    update: {},
    create: {
      name: 'Tom Cook',
      imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      tickets: {
        create: {
          content:
            'Quisque nibh nisl, mattis eget dolor in, laoreet efficitur enim. Phasellus placerat quam felis, sit amet pellentesque ligula posuere eget. Aliquam eleifend sapien nec auctor pulvinar.',
          createdAt: new Date('2023-02-02T21:13Z'),
        },
      },
    },
  });
  const lawrence = await prisma.contact.upsert({
    where: { id: 7 },
    update: {},
    create: {
      name: 'Lawrence Brooks',
      imageUrl:
        'https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      tickets: {
        create: {
          content:
            'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed finibus ipsum sit amet fermentum rhoncus. Proin eu risus sagittis, interdum augue ut, sagittis ex. Nulla facilisi. Praesent facilisis nisl sapien, a sollicitudin sem venenatis nec.',
          createdAt: new Date('2023-02-01T21:13Z'),
        },
      },
    },
  });
  const jeffrey = await prisma.contact.upsert({
    where: { id: 8 },
    update: {},
    create: {
      name: 'Jeffrey Clark',
      imageUrl:
        'https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      tickets: {
        create: {
          content:
            'Maecenas vel nunc finibus, mollis lorem a, tincidunt justo. Pellentesque purus justo, malesuada a neque ac, tincidunt imperdiet ex. Fusce quis turpis accumsan, venenatis ligula ac, sollicitudin elit.',
          createdAt: new Date('2023-01-02T21:13Z'),
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
