import { FC, lazy, Suspense } from 'react';
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

export type IconType = keyof typeof dynamicIconImports;

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconType;
  fallback: React.ReactNode;
}

const Icon: FC<IconProps> = ({ name, fallback, ...props }: IconProps) => {
  const LucideIcon = lazy(dynamicIconImports[name]);

  return (
    <Suspense fallback={fallback}>
      <LucideIcon {...props} />
    </Suspense>
  );
};

Icon.displayName = 'Icon';

export { Icon };
