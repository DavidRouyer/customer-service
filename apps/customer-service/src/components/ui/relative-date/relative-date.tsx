'use client';

import { FC, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { useMounted } from '~/hooks/use-mounted';

type RelativeDateProps = {
  dateTime: Date;
};

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
const year = day * 365;

const useRelativeDate = (time: number, locale: string, dateNow = Date.now) => {
  const [now, setNow] = useState(dateNow);

  useEffect(() => {
    if (now - time < minute) {
      const interval = setInterval(() => setNow(dateNow()), 1_000);
      return () => clearInterval(interval);
    }
  }, [dateNow, now, time]);

  const relativeFormatter = useMemo(() => {
    return new Intl.RelativeTimeFormat(locale, {
      numeric: 'auto',
    });
  }, [locale]);

  const absoluteWithoutYearFormatter = useMemo(() => {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }, [locale]);

  const absoluteWithYearFormatter = useMemo(() => {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      month: 'short',
      year: 'numeric',
      day: 'numeric',
    });
  }, [locale]);

  return useMemo(() => {
    const relativeTime = now - time;
    const elapsed = Math.abs(relativeTime);

    if (elapsed < day) {
      return relativeFormatter.format(0, 'day');
    } else if (elapsed < day * 2) {
      return relativeFormatter.format(-1, 'day');
    } else if (elapsed < year) {
      return absoluteWithoutYearFormatter.format(time);
    } else {
      return absoluteWithYearFormatter.format(time);
    }
  }, [
    now,
    time,
    relativeFormatter,
    absoluteWithoutYearFormatter,
    absoluteWithYearFormatter,
  ]);
};

export const RelativeDate: FC<RelativeDateProps> = ({ dateTime }) => {
  const { locale } = useIntl();

  const mounted = useMounted();

  const relativeDate = useRelativeDate(dateTime.getTime(), locale);

  return mounted ? <>{relativeDate}</> : null;
};

RelativeDate.displayName = 'RelativeDate';
