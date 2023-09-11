import {
  MessageContentType,
  MessageDirection,
  MessageStatus,
} from '@cs/database/schema/message';

import { Message } from '~/types/Message';
import { groupMessagesByDateAndUser } from '~/utils/message';

describe('groupMessagesByDateAndUser', () => {
  it('should correctly group messages', () => {
    const mockMessages: Message[] = [
      {
        id: 1,
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        content: 'Hello',
        sender: {
          id: 1,
          name: 'John Doe',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
        },
        contentType: MessageContentType.TextPlain,
        direction: MessageDirection.Outbound,
        status: MessageStatus.Sent,
      },
      {
        id: 2,
        createdAt: new Date('2021-01-01T00:00:59.000Z'),
        content: 'Hello',
        sender: {
          id: 1,
          name: 'John Doe',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
        },
        contentType: MessageContentType.TextPlain,
        direction: MessageDirection.Outbound,
        status: MessageStatus.Sent,
      },
    ];
    expect(groupMessagesByDateAndUser(mockMessages)[0]).toHaveLength(2);
  });
  it('should correctly create single group messages', () => {
    const mockMessages: Message[] = [
      {
        id: 1,
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        content: 'Hello',
        sender: {
          id: 1,
          name: 'John Doe',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
        },
        contentType: MessageContentType.TextPlain,
        direction: MessageDirection.Outbound,
        status: MessageStatus.Sent,
      },
      {
        id: 2,
        createdAt: new Date('2021-01-01T00:01:59.000Z'),
        content: 'Hello',
        sender: {
          id: 1,
          name: 'John Doe',
          createdAt: new Date('2021-01-01T00:01:59.000Z'),
        },
        contentType: MessageContentType.TextPlain,
        direction: MessageDirection.Outbound,
        status: MessageStatus.Sent,
      },
    ];
    const groupedMessages = groupMessagesByDateAndUser(mockMessages);
    expect(groupedMessages[0]).toHaveLength(1);
    expect(groupedMessages[1]).toHaveLength(1);
  });
  it('should correctly create single group messages for different users', () => {
    const mockMessages: Message[] = [
      {
        id: 1,
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        content: 'Hello',
        sender: {
          id: 1,
          name: 'John Doe',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
        },
        contentType: MessageContentType.TextPlain,
        direction: MessageDirection.Outbound,
        status: MessageStatus.Sent,
      },
      {
        id: 2,
        createdAt: new Date('2021-01-01T00:00:59.000Z'),
        content: 'Hello',
        sender: {
          id: 2,
          name: 'Jane Doe',
          createdAt: new Date('2021-01-01T00:00:59.000Z'),
        },
        contentType: MessageContentType.TextPlain,
        direction: MessageDirection.Outbound,
        status: MessageStatus.Sent,
      },
    ];
    const groupedMessages = groupMessagesByDateAndUser(mockMessages);
    expect(groupedMessages[0]).toHaveLength(1);
    expect(groupedMessages[1]).toHaveLength(1);
  });
});
