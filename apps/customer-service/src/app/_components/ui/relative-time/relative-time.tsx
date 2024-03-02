'use client';

import { FC, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { useMounted } from '~/app/_hooks/use-mounted';

type RelativeTimeProps = {
  dateTime: Date;
};

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
const month = day * 30;
const year = day * 365;

const useRelativeTime = (time: number, locale: string, dateNow = Date.now) => {
  const [now, setNow] = useState(dateNow);

  useEffect(() => {
    if (now - time < minute) {
      const interval = setInterval(() => setNow(dateNow()), 1_000);
      return () => clearInterval(interval);
    }
  }, [dateNow, now, time]);

  const formatter = useMemo(() => {
    return new Intl.RelativeTimeFormat(locale, {
      numeric: 'auto',
    });
  }, [locale]);

  return useMemo(() => {
    const relativeTime = now - time;
    const elapsed = Math.abs(relativeTime);

    const sign = Math.sign(-relativeTime);
    if (elapsed < minute) {
      return formatter.format(sign * Math.round(elapsed / second), 'second');
    } else if (elapsed < hour) {
      return formatter.format(sign * Math.round(elapsed / minute), 'minute');
    } else if (elapsed < day) {
      return formatter.format(sign * Math.round(elapsed / hour), 'hour');
    } else if (elapsed < month) {
      return formatter.format(sign * Math.round(elapsed / day), 'day');
    } else if (elapsed < year) {
      return formatter.format(sign * Math.round(elapsed / month), 'month');
    } else {
      return formatter.format(sign * Math.round(elapsed / year), 'year');
    }
  }, [now, time, formatter]);
};

export const RelativeTime: FC<RelativeTimeProps> = ({ dateTime }) => {
  const { locale } = useIntl();
  const mounted = useMounted();

  const relativeTime = useRelativeTime(dateTime.getTime(), locale);

  return mounted ? <>{relativeTime}</> : null;
};

RelativeTime.displayName = 'RelativeTime';
