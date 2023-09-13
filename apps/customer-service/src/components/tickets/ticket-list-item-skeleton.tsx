import { FC } from 'react';

export const TicketListItemSkeleton: FC<{ pulse?: boolean }> = ({
  pulse = true,
}) => {
  return (
    <div className="mx-4 flex gap-x-4 border-b py-5 last:border-0 sm:mx-6">
      <span
        className={`relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted ${
          pulse && 'animate-pulse'
        }`}
      ></span>
      <div className="flex-auto">
        <div className="flex items-baseline justify-between gap-x-4">
          <p
            className={`w-1/2 bg-muted text-sm font-semibold leading-6 ${
              pulse && 'animate-pulse'
            }`}
          >
            &nbsp;
          </p>
          <p
            className={`w-1/4 flex-none bg-muted text-xs ${
              pulse && 'animate-pulse'
            }`}
          >
            &nbsp;
          </p>
        </div>
        <p
          className={`mt-1 line-clamp-2 bg-muted text-sm leading-6 ${
            pulse && 'animate-pulse'
          }`}
        >
          &nbsp;
        </p>
      </div>
    </div>
  );
};
