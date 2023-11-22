import { Logo } from '~/components/logo';

export default function NotFound() {
  return (
    <div className="contents">
      <div className="flex grow flex-col">
        <div>
          <div className="p-6">
            <Logo />
          </div>
          <div
            data-orientation="horizontal"
            role="none"
            className="h-[1px] w-full shrink-0 bg-border"
          ></div>
        </div>
        <div className="flex grow flex-col items-center justify-center">
          <div className="flex h-full w-full grow items-center justify-center">
            <div>
              <h1 className="text-3xl font-bold">404</h1>
              <p className="text-xl text-muted-foreground">Page not found</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
