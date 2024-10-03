import type { PhoneNumber } from 'google-libphonenumber';
import libphonenumber from 'google-libphonenumber';

const instance = libphonenumber.PhoneNumberUtil.getInstance();
const { PhoneNumberFormat } = libphonenumber;

export { instance, PhoneNumberFormat };

export type ParsedE164Type = Readonly<{
  isValid: boolean;
  userInput: string;
  e164: string;
}>;

export function parseAndFormatPhoneNumber(
  str: string,
  regionCode: string | undefined,
  format = PhoneNumberFormat.E164,
): ParsedE164Type | undefined {
  let result: PhoneNumber;
  try {
    result = instance.parse(str, regionCode);
  } catch {
    return undefined;
  }

  return {
    isValid: instance.isValidNumber(result),
    userInput: str,
    e164: instance.format(result, format),
  };
}
