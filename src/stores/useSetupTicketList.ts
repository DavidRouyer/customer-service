import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import { TicketSummary, ticketListState } from '@/stores/ticketList';

const initialTicketList: TicketSummary[] = [
  {
    id: 1,
    user: {
      name: 'Leslie Alexander',
      imageUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    content:
      'Explicabo nihil laborum. Saepe facilis consequuntur in eaque. Consequatur perspiciatis quam. Sed est illo quia. Culpa vitae placeat vitae. Repudiandae sunt exercitationem nihil nisi facilis placeat minima eveniet.',
    openingDate: '2023-05-04T20:54:41.389Z',
  },
  {
    id: 2,
    user: {
      name: 'Michael Foster',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    content:
      'Laudantium quidem non et saepe vel sequi accusamus consequatur et. Saepe inventore veniam incidunt cumque et laborum nemo blanditiis rerum. A unde et molestiae autem ad. Architecto dolor ex accusantium maxime cumque laudantium itaque aut perferendis.',
    openingDate: '2023-03-03T14:02Z',
  },
  {
    id: 3,
    user: {
      name: 'Dries Vincent',
      imageUrl:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    content:
      'Quia animi harum in quis quidem sint. Ipsum dolorem molestias veritatis quis eveniet commodi assumenda temporibus. Dicta ut modi alias nisi. Veniam quia velit et ut. Id quas ducimus reprehenderit veniam fugit amet fugiat ipsum eius. Voluptas nobis earum in in vel corporis nisi.',
    openingDate: '2023-03-03T13:23Z',
  },
  {
    id: 4,
    user: {
      name: 'Lindsay Walton',
      imageUrl:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    content:
      'Unde dolore exercitationem nobis reprehenderit rerum corporis accusamus. Nemo suscipit temporibus quidem dolorum. Nobis optio quae atque blanditiis aspernatur doloribus sit accusamus. Sunt reiciendis ut corrupti ab debitis dolorem dolorem nam sit. Ducimus nisi qui earum aliquam. Est nam doloribus culpa illum.',
    openingDate: '2023-03-02T21:13Z',
  },
  {
    id: 5,
    user: {
      name: 'Courtney Henry',
      imageUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    content:
      'Morbi vel enim posuere, commodo metus vitae, sagittis libero. Ut vitae elit justo. In sodales libero nisl, blandit mollis turpis congue ac. Integer luctus tristique suscipit.',
    openingDate: '2023-03-01T21:13Z',
  },
  {
    id: 6,
    user: {
      name: 'Tom Cook',
      imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    content:
      'Quisque nibh nisl, mattis eget dolor in, laoreet efficitur enim. Phasellus placerat quam felis, sit amet pellentesque ligula posuere eget. Aliquam eleifend sapien nec auctor pulvinar.',
    openingDate: '2023-02-02T21:13Z',
  },
  {
    id: 7,
    user: {
      name: 'Lawrence Brooks',
      imageUrl:
        'https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    content:
      'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed finibus ipsum sit amet fermentum rhoncus. Proin eu risus sagittis, interdum augue ut, sagittis ex. Nulla facilisi. Praesent facilisis nisl sapien, a sollicitudin sem venenatis nec.',
    openingDate: '2023-02-01T21:13Z',
  },
  {
    id: 8,
    user: {
      name: 'Jeffrey Clark',
      imageUrl:
        'https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    content:
      'Maecenas vel nunc finibus, mollis lorem a, tincidunt justo. Pellentesque purus justo, malesuada a neque ac, tincidunt imperdiet ex. Fusce quis turpis accumsan, venenatis ligula ac, sollicitudin elit.',
    openingDate: '2023-01-02T21:13Z',
  },
];

export const useSetupTicketList = () => {
  const setTicketList = useSetRecoilState(ticketListState);
  useEffect(() => {
    setTicketList(initialTicketList);
  }, [setTicketList]);
};
