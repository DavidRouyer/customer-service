import type { FC } from 'react';

export const Logo: FC = () => {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-auto text-black"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.28848 22.4L23.7628 51.2C27.4238 57.6 36.5762 57.6 40.2372 51.2L56.7115 22.4C60.3725 16 55.7963 8 48.4744 8H15.5257C8.20373 8 3.62752 16 7.28848 22.4ZM32 36C36.4183 36 40 32.4183 40 28C40 23.5817 36.4183 20 32 20C27.5817 20 24 23.5817 24 28C24 32.4183 27.5817 36 32 36Z"
        fill="currentColor"
      />
    </svg>
  );
};
