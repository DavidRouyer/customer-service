'use client';

import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

interface CurrentTimeProps {
  timezone: string;
}

export const CurrentTime: FC<CurrentTimeProps> = ({ timezone }) => {
  const { locale } = useIntl();

  const [currentTime, setCurrentTime] = useState(
    new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
      timeZone: timezone,
    }).format(new Date())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(
        new Intl.DateTimeFormat(locale, {
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
