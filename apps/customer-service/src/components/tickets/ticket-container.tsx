'use client';

import { FC, useCallback } from 'react';

import { useAttachment } from '~/utils/use-attachment';

export const TicketContainer: FC<{
  ticketId: number;
  children: React.ReactNode;
}> = ({ ticketId, children }) => {
  const { processAttachments } = useAttachment();

  const onDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      console.log('onDrop', event, event.dataTransfer.types[0]);
      if (!event.dataTransfer) {
        return;
      }

      if (event.dataTransfer.types[0] !== 'Files') {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      const { files } = event.dataTransfer;
      const errors = await processAttachments(ticketId, Array.from(files));
      console.log('errors', errors);
    },
    [ticketId, processAttachments]
  );

  const onPaste = useCallback(
    async (event: React.ClipboardEvent<HTMLDivElement>) => {
      if (!event.clipboardData) {
        return;
      }
      const { items } = event.clipboardData;

      const anyImages = [...items].some(
        (item) => item.type.split('/')[0] === 'image'
      );
      if (!anyImages) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      const files: File[] = [];
      for (let i = 0; i < items.length; i += 1) {
        if (items[i].type.split('/')[0] === 'image') {
          const file = items[i].getAsFile();
          if (file) {
            files.push(file);
          }
        }
      }

      const errors = await processAttachments(ticketId, files);
      console.log('errors', errors);
    },
    [ticketId, processAttachments]
  );

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div
      onDrop={onDrop}
      onPaste={onPaste}
      onDragOver={handleDragOver}
      className="flex h-[100dvh] flex-col px-4 py-6 sm:px-6"
    >
      {children}
    </div>
  );
};
