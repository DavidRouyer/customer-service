import { FC } from 'react';

import { MessageContentType } from '@cs/lib/messages';

import { NodeContent } from '~/components/infos/node-content';

export const MessageContent: FC<{
  type: MessageContentType;
  content: string;
}> = ({ type, content }) => {
  if (type === MessageContentType.TextPlain) return <div>{content}</div>;
  if (type === MessageContentType.TextJson)
    return <NodeContent content={content} />;
  return null;
};
