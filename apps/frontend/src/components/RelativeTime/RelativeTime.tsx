import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type RelativeTimeProps = {
  dateTime: Date;
};

const formatRelativeTime = (prevDate: Date, locale: string) => {
  const diff = Number(new Date()) - prevDate.getTime();
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;

  const formatter = new Intl.RelativeTimeFormat(locale, {
    numeric: 'auto',
  });

  switch (true) {
    case diff < minute:
      return formatter.format(-Math.round(diff / 1000), 'seconds');
    case diff < hour:
      return formatter.format(-Math.round(diff / minute), 'minutes');
    case diff < day:
      return formatter.format(-Math.round(diff / hour), 'hours');
    case diff < month:
      return formatter.format(-Math.round(diff / day), 'days');
    case diff < year:
      return formatter.format(-Math.round(diff / month), 'months');
    case diff > year:
      return formatter.format(-Math.round(diff / year), 'years');
    default:
      return '';
  }
};

export const RelativeTime: FC<RelativeTimeProps> = ({ dateTime }) => {
  const { i18n } = useTranslation();
  const [relativeTime, setRelativeTime] = useState(
    formatRelativeTime(dateTime, i18n.language)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeTime(formatRelativeTime(dateTime, i18n.language));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [dateTime, i18n.language, setRelativeTime]);

  return <>{relativeTime}</>;
};

RelativeTime.displayName = 'RelativeTime';
