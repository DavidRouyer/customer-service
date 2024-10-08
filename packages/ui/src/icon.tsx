import type { LucideProps } from 'lucide-react';
import type { FC } from 'react';
import { lazy, Suspense, useMemo } from 'react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

export type IconType = keyof typeof dynamicIconImports;

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconType;
  fallback: React.ReactNode;
}

const Icon: FC<IconProps> = ({ name, fallback, ...props }: IconProps) => {
  const LucideIcon = useMemo(() => lazy(dynamicIconImports[name]), [name]);

  return (
    <Suspense fallback={fallback}>
      <LucideIcon {...props} />
    </Suspense>
  );
};

Icon.displayName = 'Icon';

export { Icon };
