export const base64 = (str: string) =>
  Buffer.from(JSON.stringify(str), 'utf8').toString('base64');

export const unbase64 = (str: string) =>
  Buffer.from(str, 'base64').toString('utf8');
