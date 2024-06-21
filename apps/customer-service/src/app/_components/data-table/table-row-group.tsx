import React from 'react';

import { cn } from '@cs/ui';

const TableRowGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-[2.25rem] items-center border-b bg-muted/50 px-2 transition-colors',
      className
    )}
    {...props}
  />
));
TableRowGroup.displayName = 'TableRowGroup';

export { TableRowGroup };
