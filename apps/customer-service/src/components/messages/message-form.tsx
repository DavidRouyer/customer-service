'use client';

import { createContext, FC, RefObject, useRef } from 'react';
import { PaperclipIcon, SmilePlusIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import {
  MessageContentType,
  MessageDirection,
  MessageStatus,
} from '@cs/database/schema/message';

import { AttachmentList } from '~/components/messages/attachment-list';
import { TextEditor } from '~/components/text-editor/text-editor';
import { Button } from '~/components/ui/button';
import { Message } from '~/types/Message';
import { api } from '~/utils/api';
import { useAttachment } from '~/utils/use-attachment';

type MessageFormSchema = {
  content: string;
};

export const FormElementContext =
  createContext<RefObject<HTMLFormElement> | null>(null);

export const MessageForm: FC<{ ticketId: number }> = ({ ticketId }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { processAttachments } = useAttachment();
  const session = useSession();
  const utils = api.useContext();
  const { mutateAsync: sendMessage } = api.message.create.useMutation({
    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await utils.message.all.cancel({ ticketId: ticketId });

      // Snapshot the previous value
      const previousMessages = utils.message.all.getData({
        ticketId: ticketId,
      });

      // Optimistically update to the new value
      utils.message.all.setData(
        { ticketId: ticketId },
        (oldQueryData: Message[] | undefined) =>
          [
            ...(oldQueryData ?? []),
            {
              id: self.crypto.randomUUID(),
              direction: newMessage.direction,
              contentType: newMessage.contentType,
              status: newMessage.status,
              content: newMessage.content,
              createdAt: newMessage.createdAt,
              senderId: session.data?.user?.contactId ?? 0,
              sender: {
                name: session.data?.user?.name ?? '',
                avatarUrl: session.data?.user?.image ?? '',
                id: session.data?.user?.contactId ?? 0,
              },
            },
          ] as Message[]
      );

      // Return a context object with the snapshotted value
      return { previousMessages };
    },
    onError: (err, _newMessage, context) => {
      // TODO: handle failed queries
      utils.message.all.setData(
        { ticketId: ticketId },
        context?.previousMessages ?? []
      );
    },
    onSettled: () => {
      void utils.message.all.invalidate({ ticketId: ticketId });
    },
  });
  const form = useForm<MessageFormSchema>();

  const onSubmit = (data: MessageFormSchema) => {
    sendMessage({
      ticketId: ticketId,
      direction: MessageDirection.Outbound,
      contentType: MessageContentType.TextPlain,
      status: MessageStatus.Pending,
      content: data.content,
      createdAt: new Date(),
      senderId: session.data?.user?.contactId ?? 0,
    });
    form.reset({
      content: '',
    });
  };

  return (
    <FormElementContext.Provider value={formRef}>
      <FormProvider {...form}>
        <AttachmentList />
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative"
        >
          <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-border focus-within:ring-2 focus-within:ring-foreground">
            <Controller
              name="content"
              control={form.control}
              render={({ field: { value, onChange } }) => (
                <TextEditor value={value} onChange={onChange} />
              )}
            ></Controller>
            {/* Spacer element to match the height of the toolbar */}
            <div className="py-2" aria-hidden="true">
              {/* Matches height of button in toolbar (1px border + 36px content height) */}
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
            <div className="flex items-center space-x-5">
              <div className="flex items-center">
                <button
                  type="button"
                  className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                >
                  <PaperclipIcon className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">
                    <FormattedMessage id="text_editor.attach_files" />
                  </span>
                  <input
                    name="file"
                    ref={inputFileRef}
                    type="file"
                    onChange={async () => {
                      if (inputFileRef.current?.files?.length) {
                        const files = Array.from(inputFileRef.current.files);
                        const errors = await processAttachments(
                          ticketId,
                          files
                        );
                        console.log('errors', errors);
                      }
                    }}
                  />
                </button>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                >
                  <SmilePlusIcon className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">
                    <FormattedMessage id="text_editor.add_emoticons" />
                  </span>
                </button>
              </div>
            </div>
            <div className="shrink-0">
              <Button type="submit" className="h-auto px-3">
                <FormattedMessage id="text_editor.send" />
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </FormElementContext.Provider>
  );
};

MessageForm.displayName = 'MessageForm';
