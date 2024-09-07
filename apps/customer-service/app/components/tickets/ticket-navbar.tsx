import type { FC } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

import { Logo } from '~/components/logo';

export const TicketNavbar: FC = () => {
  return (
    <div className="hidden border-r lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-16 lg:overflow-y-auto lg:bg-background lg:pb-4">
      <div className="flex h-16 shrink-0 items-center justify-center">
        <Logo />
      </div>
      <nav className="mt-8">
        <Link to="/" className="flex items-center justify-center px-4 py-2">
          <ArrowLeft />
        </Link>
      </nav>
    </div>
  );
};
