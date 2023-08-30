import { Message } from '~/hooks/useTicket/Message';

export const groupMessagesByDateAndUser = (messages: Message[]) => {
  const groupedMessages = messages.reduce<Record<string, Message[]>>(
    (acc, message) => {
      const date = new Date(message.createdAt);
      date.setUTCMilliseconds(0);
      date.setUTCSeconds(0);
      const idx = `${date.toISOString()}.${message.sender.id}`;
      const messages = acc[idx] ?? [];

      return {
        ...acc,
        [idx]: [...messages, message],
      };
    },
    {}
  );

  return Object.values(groupedMessages);
};
