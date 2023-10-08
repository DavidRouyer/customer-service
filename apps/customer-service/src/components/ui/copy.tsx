'use client';

import React, { useState } from 'react';
import { Slot } from '@radix-ui/react-slot';
import copy from 'copy-to-clipboard';
import { useIntl } from 'react-intl';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { cn } from '~/lib/utils';

type CopyProps = {
  content: string;
  asChild?: boolean;
};

const Copy = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & CopyProps
>(({ children, className, content, asChild = false, ...props }, ref) => {
  const { formatMessage } = useIntl();

  const [done, setDone] = useState(false);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(formatMessage({ id: 'clipboard.copy' }));

  const copyToClipboard = () => {
    setDone(true);
    copy(content);

    setTimeout(() => {
      setDone(false);
    }, 2000);
  };

  React.useEffect(() => {
    if (done) {
      setText(formatMessage({ id: 'clipboard.copied' }));
      return;
    }

    setTimeout(() => {
      setText(formatMessage({ id: 'clipboard.copy' }));
    }, 500);
  }, [done]);

  const Component = asChild ? Slot : 'button';

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip open={done || open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <Component
            ref={ref}
            type="button"
            className={cn('h-fit w-fit', className)}
            onClick={copyToClipboard}
            {...props}
          >
            {children}
          </Component>
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
Copy.displayName = 'Copy';

export { Copy };
