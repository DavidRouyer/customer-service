import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { i18n } = useTranslation();
  const [relativeDate, setRelativeDate] = useState(
    formatRelativeDate(dateTime, i18n.language)
  );

  useEffect(() => {
    setRelativeDate(formatRelativeDate(dateTime, i18n.language));

    const interval = setInterval(() => {
      setRelativeDate(formatRelativeDate(dateTime, i18n.language));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [dateTime, i18n.language, setRelativeDate]);

  return <>{relativeDate}</>;
};

RelativeDate.displayName = 'RelativeDate';
