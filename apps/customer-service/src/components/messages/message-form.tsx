'use client';

import { FC } from 'react';
import { PaperclipIcon, SmilePlusIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import {
  MessageContentType,
  MessageDirection,
  MessageStatus,
} from '@cs/database/schema/message';

import { TextEditor } from '~/components/text-editor/text-editor';
import { Button } from '~/components/ui/button';
import { Message } from '~/types/Message';
import { api } from '~/utils/api';

type MessageFormSchema = {
  content: string;
};

export const MessageForm: FC<{ id: number }> = ({ id }) => {
  const session = useSession();
  const utils = api.useContext();
  const { mutateAsync: sendMessage } = api.message.create.useMutation({
    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await utils.message.all.cancel({ ticketId: id });

      // Snapshot the previous value
      const previousMessages = utils.message.all.getData({ ticketId: id });

      // Optimistically update to the new value
      utils.message.all.setData(
        { ticketId: id },
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
        { ticketId: id },
        context?.previousMessages ?? []
      );
    },
    onSettled: () => {
      void utils.message.all.invalidate({ ticketId: id });
    },
  });
  const form = useForm<MessageFormSchema>();

  const onSubmit = (data: MessageFormSchema) => {
    sendMessage({
      ticketId: id,
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
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
        <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-border focus-within:ring-2 focus-within:ring-foreground">
          <Controller
            name="content"
            control={form.control}
            render={({ field }) => <TextEditor {...field} />}
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
  );
};

MessageForm.displayName = 'MessageForm';
