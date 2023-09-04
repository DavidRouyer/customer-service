'use client';

import { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

type RelativeDateProps = {
  dateTime: Date;
};

const formatRelativeDate = (prevDate: Date, locale: string) => {
  const diff = Number(new Date()) - prevDate.getTime();
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const year = day * 365;

  const relativeFormatter = new Intl.RelativeTimeFormat(locale, {
    numeric: 'auto',
  });

  if (diff < day) {
    return relativeFormatter.format(0, 'day');
  }

  if (diff < day * 2) {
    return relativeFormatter.format(-1, 'day');
  }

  const absoluteFormatterWithoutYear = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  if (diff < year) {
    return absoluteFormatterWithoutYear.format(prevDate);
  }

  const absoluteFormatterWithYear = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  });

  return absoluteFormatterWithYear.format(prevDate);
};

export const RelativeDate: FC<RelativeDateProps> = ({ dateTime }) => {
  const { locale } = useIntl();

  const [relativeDate, setRelativeDate] = useState(
    formatRelativeDate(dateTime, locale)
  );

  useEffect(() => {
    setRelativeDate(formatRelativeDate(dateTime, locale));

    const interval = setInterval(() => {
      setRelativeDate(formatRelativeDate(dateTime, locale));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [dateTime, locale, setRelativeDate]);

  return <>{relativeDate}</>;
};

RelativeDate.displayName = 'RelativeDate';
