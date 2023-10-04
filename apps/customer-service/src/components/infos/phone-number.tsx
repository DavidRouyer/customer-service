'use client';

import { FC } from 'react';

import {
  parseAndFormatPhoneNumber,
  PhoneNumberFormat,
} from '~/utils/libphonenumber';

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
