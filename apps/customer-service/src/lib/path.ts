import { ReadonlyURLSearchParams } from 'next/navigation';

export const matchPath = (pathname: string, pathToMatch: string) => {
  if (pathname === pathToMatch) {
    return true;
  }

  if (pathname.startsWith(pathToMatch)) {
    return true;
  }

  return false;
};

export const matchParams = (
  searchParams: ReadonlyURLSearchParams,
  paramsToMatch: Record<string, (string | null)[]>
) => {
  for (const [key, value] of Object.entries(paramsToMatch)) {
    if (value.some((v) => searchParams.get(key) === v)) {
      return true;
    }
  }

  return false;
};
