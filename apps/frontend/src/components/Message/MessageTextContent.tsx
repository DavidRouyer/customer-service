import { FC } from 'react';

export type MessageTextContentProps = {
  text: string;
};

export const MessageTextContent: FC<MessageTextContentProps> = ({ text }) => {
  return <div>{text}</div>;
};

MessageTextContent.displayName = 'MessageTextContent';
