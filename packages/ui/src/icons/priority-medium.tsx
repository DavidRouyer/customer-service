import type { ComponentPropsWithoutRef, FC } from 'react';

export const PriorityMedium: FC<ComponentPropsWithoutRef<'svg'>> = ({
  ...props
}) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1 11C1 10.4477 1.44772 10 2 10H4C4.55228 10 5 10.4477 5 11V14C5 14.5523 4.55228 15 4 15H2C1.44772 15 1 14.5523 1 14V11Z"
        fill="currentColor"
        className="text-foreground"
      />
      <path
        d="M6 7C6 6.44772 6.44772 6 7 6H9C9.55228 6 10 6.44772 10 7V14C10 14.5523 9.55228 15 9 15H7C6.44772 15 6 14.5523 6 14V7Z"
        fill="currentColor"
        className="text-foreground"
      />
      <path
        d="M11 2C11 1.44772 11.4477 1 12 1H14C14.5523 1 15 1.44772 15 2V14C15 14.5523 14.5523 15 14 15H12C11.4477 15 11 14.5523 11 14V2Z"
        fill="currentColor"
        className="text-muted-foreground/30"
      />
    </svg>
  );
};

PriorityMedium.displayName = 'PriorityMedium';
