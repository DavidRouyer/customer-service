'use client';

import { createContext, FC, RefObject, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { PaperclipIcon, SmilePlusIcon } from 'lucide-react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { parseTextFromEditorState } from '@cs/kyaku/editor';
import { TicketChat, TicketNote } from '@cs/kyaku/models';
import { cn } from '@cs/ui';
import { Button } from '@cs/ui/button';
import { Label } from '@cs/ui/label';
import { Switch } from '@cs/ui/switch';

import { messageModeAtom } from '~/app/_components/messages/message-mode-atom';
import {
  TimelineEntry,
  useCreateNoteMutation,
  useInfiniteTicketTimelineQuery,
} from '~/graphql/generated/client';
import { api } from '~/trpc/react';

const TextEditor = dynamic(
  () => import('~/app/_components/text-editor/text-editor'),
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
  const { data: session } = api.auth.getSession.useQuery();
  const queryClient = useQueryClient();

  const [messageMode, setMessageMode] = useAtom(messageModeAtom);

  const { mutateAsync: sendChat } = api.ticket.sendChat.useMutation({
    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: useInfiniteTicketTimelineQuery.getKey({
          ticketId: newMessage.ticketId,
        }),
      });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData(
        useInfiniteTicketTimelineQuery.getKey({
          ticketId: newMessage.ticketId,
        })
      );

      // Optimistically update to the new value
      queryClient.setQueryData(
        useInfiniteTicketTimelineQuery.getKey({
          ticketId: newMessage.ticketId,
        }),
        (oldQueryData: TimelineEntry[] | undefined) => [
          ...(oldQueryData ?? []),
          {
            id: self.crypto.randomUUID(),
            customer: oldQueryData?.[0]?.customer,
            ticketId: newMessage.ticketId,
            entry: {
              text: newMessage.text,
            } satisfies TicketChat,
            createdAt: new Date(),
            userCreatedById: session?.user?.id ?? null,
            userCreatedBy: session?.user ?? null,
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
      queryClient.setQueryData(
        useInfiniteTicketTimelineQuery.getKey({
          ticketId: _newMessage.ticketId,
        }),
        context?.previousMessages ?? []
      );
    },
    onSettled: (_, __, { ticketId }) => {
      void queryClient.invalidateQueries({
        queryKey: useInfiniteTicketTimelineQuery.getKey({ ticketId: ticketId }),
      });
    },
  });
  const { mutateAsync: createNote } = useCreateNoteMutation({
    onMutate: async ({ input }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: useInfiniteTicketTimelineQuery.getKey({
          ticketId: input.ticketId,
        }),
      });

      // Snapshot the previous value
      const previousTimelineItem = queryClient.getQueryData(
        useInfiniteTicketTimelineQuery.getKey({
          ticketId: input.ticketId,
        })
      );

      // Optimistically update to the new value
      queryClient.setQueryData(
        useInfiniteTicketTimelineQuery.getKey({ ticketId: input.ticketId }),
        (oldQueryData: TimelineEntry[] | undefined) => [
          ...(oldQueryData ?? []),
          {
            id: self.crypto.randomUUID(),
            customer: oldQueryData?.[0]?.customer,
            ticketId: input.ticketId,
            entry: {
              text: input.text,
              rawContent: input.rawContent,
            } satisfies TicketNote,
            createdAt: new Date(),
            userCreatedById: session?.user?.id ?? null,
            userCreatedBy: session?.user ?? null,
            customerCreatedById: null,
            customerCreatedBy: null,
          },
        ]
      );

      // Return a context object with the snapshotted value
      return { previousNotes: previousTimelineItem };
    },
    onError: (err, { input }, context) => {
      // TODO: handle failed queries
      queryClient.setQueryData(
        useInfiniteTicketTimelineQuery.getKey({ ticketId: input.ticketId }),
        context?.previousNotes ?? []
      );
    },
    onSettled: (_, __, { input }) => {
      void queryClient.invalidateQueries({
        queryKey: useInfiniteTicketTimelineQuery.getKey({
          ticketId: input.ticketId,
        }),
      });
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
      createNote({
        input: {
          ticketId: ticketId,
          text: text,
          rawContent: data.content,
        },
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
                  className="-m-2.5 flex size-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                >
                  <PaperclipIcon className="size-5" aria-hidden="true" />
                  <span className="sr-only">
                    <FormattedMessage id="text_editor.attach_files" />
                  </span>
                </button>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  className="-m-2.5 flex size-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                >
                  <SmilePlusIcon className="size-5" aria-hidden="true" />
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
