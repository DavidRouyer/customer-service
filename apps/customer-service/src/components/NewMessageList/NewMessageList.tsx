import React from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
export type NewMessageListInnerProps = {};

const NewMessageListInner = React.forwardRef<
  HTMLDivElement,
  NewMessageListInnerProps
>(({ ...props }, ref) => <div ref={ref} {...props} />);

NewMessageListInner.displayName = 'NewMessageListInner';

// eslint-disable-next-line @typescript-eslint/ban-types
export type NewMessageListProps = {};

const NewMessageList = React.forwardRef<
  React.ElementRef<typeof NewMessageListInner>,
  NewMessageListProps
>(({ ...props }, ref) => <NewMessageListInner ref={ref} {...props} />);

NewMessageList.displayName = 'NewMessageList';
