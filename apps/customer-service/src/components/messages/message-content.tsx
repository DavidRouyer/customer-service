import { FC } from 'react';

import { ChatContentType } from '@cs/lib/chats';

import { NodeContent } from '~/components/infos/node-content';

export const MessageContent: FC<{
  type: ChatContentType;
  content: string;
}> = ({ type, content }) => {
  if (type === ChatContentType.TextPlain) return <div>{content}</div>;
  if (type === ChatContentType.TextJson)
    return <NodeContent content={content} />;
  return null;
};
