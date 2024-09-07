import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@cs/ui/command';

export function DashboardCommandMenu() {
  const { formatMessage } = useIntl();

  const [open, setOpen] = useState(false);

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
          <CommandItem>
            <span>TODO</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
