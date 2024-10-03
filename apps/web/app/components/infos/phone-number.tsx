'use client';

import type { FC } from 'react';

import {
  parseAndFormatPhoneNumber,
  PhoneNumberFormat,
} from '~/lib/libphonenumber';

export const PhoneNumber: FC<{
  value: string;
}> = ({ value }) => {
  return (
    <>
      {
        parseAndFormatPhoneNumber(
          value,
          undefined,
          PhoneNumberFormat.INTERNATIONAL,
        )?.e164
      }
    </>
  );
};
