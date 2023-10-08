'use client';

import { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { FormattedMessage, useIntl } from 'react-intl';

import { messageModeAtom } from '~/components/messages/message-mode-atom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command';

export function CommandMenu() {
  const { formatMessage } = useIntl();

  const [open, setOpen] = useState(false);
  const setMessageMode = useSetAtom(messageModeAtom);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder={formatMessage({ id: 'command_menu.search.placeholder' })}
      />
      <CommandList>
        <CommandEmpty>
          <FormattedMessage id="command_menu.no_results" />
        </CommandEmpty>
        <CommandGroup heading={formatMessage({ id: 'command_menu.commands' })}>
          <CommandItem
            onSelect={() => {
              setMessageMode('comment');
              setOpen(false);
            }}
          >
            <span>
              <FormattedMessage id="command_menu.commands.write_note" />
            </span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setMessageMode('message');
              setOpen(false);
            }}
          >
            <span>
              <FormattedMessage id="command_menu.commands.write_message" />
            </span>
          </CommandItem>
          <CommandItem>
            <span>
              <FormattedMessage id="command_menu.commands.assign_to_me" />
            </span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
