'use client';

import React, { useState } from 'react';
import { Slot } from '@radix-ui/react-slot';
import copy from 'copy-to-clipboard';

import { cn } from '@kyaku/ui';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

interface CopyProps {
  content: string;
  asChild?: boolean;
  translations: {
    copy: string;
    copied: string;
  };
}

const Copy = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & CopyProps
>(
  (
    { children, className, content, translations, asChild = false, ...props },
    ref,
  ) => {
    const [done, setDone] = useState(false);
    const [open, setOpen] = useState(false);
    const [text, setText] = useState(translations.copy);

    const copyToClipboard = () => {
      setDone(true);
      copy(content);

      setTimeout(() => {
        setDone(false);
      }, 2000);
    };

    React.useEffect(() => {
      if (done) {
        setText(translations.copied);
        return;
      }

      setTimeout(() => {
        setText(translations.copy);
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
  },
);
Copy.displayName = 'Copy';

export { Copy };
