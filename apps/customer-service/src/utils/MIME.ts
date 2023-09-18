export type MIMEType = string & { _mimeTypeBrand: never };

export const stringToMIMEType = (value: string): MIMEType => {
  return value as MIMEType;
};

export const IMAGE_JPEG = stringToMIMEType('image/jpeg');

export const isGif = (value: string): value is MIMEType =>
  value === 'image/gif';
