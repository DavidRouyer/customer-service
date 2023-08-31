'use client';

import { FC, useEffect, useState } from 'react';
import { useCurrentLocale } from 'next-i18n-router/client';

import i18nConfig from '~/app/i18n/config.mjs';

type CurrentTimeProps = {
  timezone: string;
};

export const CurrentTime: FC<CurrentTimeProps> = ({ timezone }) => {
  const locale = useCurrentLocale(i18nConfig);

  const [currentTime, setCurrentTime] = useState(
    new Intl.DateTimeFormat(locale!, {
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
      timeZone: timezone,
    }).format(new Date())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(
        new Intl.DateTimeFormat(locale!, {
          hour: 'numeric',
          minute: 'numeric',
          timeZoneName: 'short',
          timeZone: timezone,
        }).format(new Date())
      );
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timezone, locale, setCurrentTime]);

  return <>{currentTime}</>;
};

CurrentTime.displayName = 'CurrentTime';
