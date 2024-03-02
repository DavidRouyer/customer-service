'use client';

import { FC } from 'react';

import {
  parseAndFormatPhoneNumber,
  PhoneNumberFormat,
} from '~/app/lib/libphonenumber';

export const PhoneNumber: FC<{
  value: string;
}> = ({ value }) => {
  return (
    <>
      {
        parseAndFormatPhoneNumber(
          value,
          undefined,
          PhoneNumberFormat.INTERNATIONAL
        )?.e164
      }
    </>
  );
};
