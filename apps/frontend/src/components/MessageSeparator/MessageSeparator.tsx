import { FC } from 'react';

export type MessageSeparatorProps = {
  children: React.ReactNode;
};

export const MessageSeparator: FC<MessageSeparatorProps> = ({ children }) => {
  return (
    <div className="flex flex-row flex-nowrap items-center justify-between">
      <div className="mr-4 h-px flex-auto bg-gray-200"></div>
      <span className="text-center text-xs text-gray-600">{children}</span>
      <div className="ml-4 h-px flex-auto bg-gray-200"></div>
    </div>
  );
};
