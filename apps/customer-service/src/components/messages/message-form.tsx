'use client';

import { createContext, FC, RefObject, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useAtom } from 'jotai';
import { PaperclipIcon, SmilePlusIcon } from 'lucide-react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { ChatContentType, ChatDirection, ChatStatus } from '@cs/lib/chats';

import { messageModeAtom } from '~/components/messages/message-mode-atom';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';
import { api } from '~/lib/api';
import { cn } from '~/lib/utils';
import { ConversationItem } from '~/types/Conversation';

const TextEditor = dynamic(
  () => import('~/components/text-editor/text-editor'),
  {
    ssr: false,
  }
);

type MessageFormSchema = {
  content: string;
};

export const FormElementContext =
  createContext<RefObject<HTMLFormElement> | null>(null);

export const MessageForm: FC<{ ticketId: string }> = ({ ticketId }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { data: sessionData } = api.auth.getSession.useQuery();
  const utils = api.useUtils();

  const [messageMode, setMessageMode] = useAtom(messageModeAtom);

  const { mutateAsync: sendMessage } = api.ticketChat.create.useMutation({
    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await utils.ticket.conversation.cancel({ ticketId: newMessage.ticketId });

      // Snapshot the previous value
      const previousMessages = utils.ticket.conversation.getData({
        ticketId: newMessage.ticketId,
      });

      // Optimistically update to the new value
      utils.ticket.conversation.setData(
        { ticketId: newMessage.ticketId },
        (oldQueryData: ConversationItem[] | undefined) =>
          [
            ...(oldQueryData ?? []),
            {
              id: self.crypto.randomUUID(),
              type: 'chat',
              ticketId: newMessage.ticketId,
              direction: newMessage.direction,
              contentType: newMessage.contentType,
              status: newMessage.status,
              content: newMessage.content,
              createdAt: new Date(),
              createdById: sessionData?.user?.id ?? 0,
              createdBy: sessionData?.user,
            },
          ] as ConversationItem[]
      );

      // Return a context object with the snapshotted value
      return { previousMessages };
    },
    onError: (err, _newMessage, context) => {
      // TODO: handle failed queries
      utils.ticket.conversation.setData(
        { ticketId: _newMessage.ticketId },
        context?.previousMessages ?? []
      );
    },
    onSettled: (_, __, { ticketId }) => {
      void utils.ticket.conversation.invalidate({ ticketId: ticketId });
    },
  });
  const { mutateAsync: sendNote } = api.ticketNote.create.useMutation({
    onMutate: async (newTicket) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await utils.ticket.conversation.cancel({
        ticketId: newTicket.ticketId,
      });

      // Snapshot the previous value
      const previousConversationItem = utils.ticket.conversation.getData({
        ticketId: newTicket.ticketId,
      });

      // Optimistically update to the new value
      utils.ticket.conversation.setData(
        { ticketId: newTicket.ticketId },
        (oldQueryData: ConversationItem[] | undefined) =>
          [
            ...(oldQueryData ?? []),
            {
              id: self.crypto.randomUUID(),
              type: 'note',
              direction: ChatDirection.Outbound,
              contentType: ChatContentType.TextJson,
              status: ChatStatus.Pending,
              content: newTicket.content,
              createdAt: new Date(),
              createdById: sessionData?.user?.id ?? 0,
              createdBy: sessionData?.user,
            },
          ] as ConversationItem[]
      );

      // Return a context object with the snapshotted value
      return { previousNotes: previousConversationItem };
    },
    onError: (err, _newTicket, context) => {
      // TODO: handle failed queries
      utils.ticket.conversation.setData(
        { ticketId: _newTicket.ticketId },
        context?.previousNotes ?? []
      );
    },
    onSettled: (_, __, { ticketId }) => {
      void utils.ticket.conversation.invalidate({ ticketId: ticketId });
      void utils.ticketActivity.byTicketId.invalidate({ ticketId: ticketId });
    },
  });
  const form = useForm<MessageFormSchema>();

  const onSubmit = (data: MessageFormSchema) => {
    if (messageMode === 'reply') {
      sendMessage({
        ticketId: ticketId,
        direction: ChatDirection.Outbound,
        contentType: ChatContentType.TextJson,
        status: ChatStatus.Pending,
        content: data.content,
      });
    } else {
      sendNote({
        ticketId: ticketId,
        content: data.content,
      });
    }

    form.reset({
      content: '',
    });
  };

  return (
    <FormElementContext.Provider value={formRef}>
      <FormProvider {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative"
        >
          <div
            className={cn(
              'overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-border focus-within:ring-2',
              {
                'bg-warning/30 ring-warning/70 focus-within:ring-warning':
                  messageMode === 'note',
                'focus-within:ring-foreground': messageMode === 'reply',
              }
            )}
          >
            <Controller
              name="content"
              control={form.control}
              render={({ field: { value, onChange } }) => (
                <TextEditor value={value} onChange={onChange} />
              )}
            />
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
              <div className="flex items-center">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="message-mode"
                    checked={messageMode === 'note'}
                    onCheckedChange={(checked) =>
                      setMessageMode(checked ? 'note' : 'reply')
                    }
                  />
                  <Label htmlFor="message-mode">
                    <FormattedMessage id="text_editor.note" />
                  </Label>
                </div>
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
