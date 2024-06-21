import type { ComponentPropsWithoutRef, FC } from 'react';

export const PriorityCritical: FC<ComponentPropsWithoutRef<'svg'>> = ({
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
        d="M2 0C0.895431 0 0 0.895431 0 2V14C0 15.1046 0.895431 16 2 16H14C15.1046 16 16 15.1046 16 14V2C16 0.895431 15.1046 0 14 0H2ZM8 4C8.53541 4 8.95377 4.46228 8.9005 4.99504L8.54975 8.50248C8.52151 8.78492 8.28384 9 8 9C7.71616 9 7.47849 8.78492 7.45025 8.50248L7.0995 4.99504C7.04623 4.46229 7.46459 4 8 4ZM8.00154 10C8.55383 10 9.00154 10.4477 9.00154 11C9.00154 11.5523 8.55383 12 8.00154 12C7.44926 12 7.00154 11.5523 7.00154 11C7.00154 10.4477 7.44926 10 8.00154 10Z"
        fill="currentColor"
        className="text-foreground"
      />
    </svg>
  );
};

PriorityCritical.displayName = 'PriorityCritical';
