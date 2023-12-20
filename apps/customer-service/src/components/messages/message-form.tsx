'use client';

import { createContext, FC, RefObject, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useAtom } from 'jotai';
import { PaperclipIcon, SmilePlusIcon } from 'lucide-react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { parseTextFromEditorState } from '@cs/lib/editor';
import {
  TicketChat,
  TicketNote,
  TicketTimelineEntryType,
} from '@cs/lib/ticketTimelineEntries';
import { Button, cn, Label, Switch } from '@cs/ui';

import { messageModeAtom } from '~/components/messages/message-mode-atom';
import { api, RouterOutputs } from '~/lib/api';

type TimelineItem = RouterOutputs['ticketTimeline']['byTicketId'][0];

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

  const { mutateAsync: sendChat } = api.ticket.sendChat.useMutation({
    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await utils.ticketTimeline.byTicketId.cancel({
        ticketId: newMessage.ticketId,
      });

      // Snapshot the previous value
      const previousMessages = utils.ticketTimeline.byTicketId.getData({
        ticketId: newMessage.ticketId,
      });

      // Optimistically update to the new value
      utils.ticketTimeline.byTicketId.setData(
        { ticketId: newMessage.ticketId },
        (oldQueryData: TimelineItem[] | undefined) => [
          ...(oldQueryData ?? []),
          {
            id: self.crypto.randomUUID(),
            customerId: oldQueryData?.[0]?.customerId ?? '',
            type: TicketTimelineEntryType.Chat,
            ticketId: newMessage.ticketId,
            entry: {
              text: newMessage.text,
            } satisfies TicketChat,
            createdAt: new Date(),
            userCreatedById: sessionData?.user?.id ?? null,
            userCreatedBy: sessionData?.user ?? null,
            customerCreatedById: null,
            customerCreatedBy: null,
          },
        ]
      );

      // Return a context object with the snapshotted value
      return { previousMessages };
    },
    onError: (err, _newMessage, context) => {
      // TODO: handle failed queries
      utils.ticketTimeline.byTicketId.setData(
        { ticketId: _newMessage.ticketId },
        context?.previousMessages ?? []
      );
    },
    onSettled: (_, __, { ticketId }) => {
      void utils.ticketTimeline.byTicketId.invalidate({ ticketId: ticketId });
    },
  });
  const { mutateAsync: sendNote } = api.ticket.sendNote.useMutation({
    onMutate: async (newTicket) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await utils.ticketTimeline.byTicketId.cancel({
        ticketId: newTicket.ticketId,
      });

      // Snapshot the previous value
      const previousTimelineItem = utils.ticketTimeline.byTicketId.getData({
        ticketId: newTicket.ticketId,
      });

      // Optimistically update to the new value
      utils.ticketTimeline.byTicketId.setData(
        { ticketId: newTicket.ticketId },
        (oldQueryData: TimelineItem[] | undefined) => [
          ...(oldQueryData ?? []),
          {
            id: self.crypto.randomUUID(),
            customerId: oldQueryData?.[0]?.customerId ?? '',
            type: TicketTimelineEntryType.Note,
            ticketId: newTicket.ticketId,
            entry: {
              text: newTicket.text,
              rawContent: newTicket.rawContent,
            } satisfies TicketNote,
            createdAt: new Date(),
            userCreatedById: sessionData?.user?.id ?? null,
            userCreatedBy: sessionData?.user ?? null,
            customerCreatedById: null,
            customerCreatedBy: null,
          },
        ]
      );

      // Return a context object with the snapshotted value
      return { previousNotes: previousTimelineItem };
    },
    onError: (err, _newTicket, context) => {
      // TODO: handle failed queries
      utils.ticketTimeline.byTicketId.setData(
        { ticketId: _newTicket.ticketId },
        context?.previousNotes ?? []
      );
    },
    onSettled: (_, __, { ticketId }) => {
      void utils.ticketTimeline.byTicketId.invalidate({ ticketId: ticketId });
    },
  });
  const form = useForm<MessageFormSchema>();

  const onSubmit = async (data: MessageFormSchema) => {
    if (messageMode === 'reply') {
      const text = await parseTextFromEditorState(data.content);
      sendChat({
        ticketId: ticketId,
        text: text,
      });
    } else {
      const text = await parseTextFromEditorState(data.content);
      sendNote({
        ticketId: ticketId,
        text: text,
        rawContent: data.content,
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
