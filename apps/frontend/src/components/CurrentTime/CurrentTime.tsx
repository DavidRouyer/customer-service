import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type CurrentTimeProps = {
  timezone: string;
};

export const CurrentTime: FC<CurrentTimeProps> = ({ timezone }) => {
  const { i18n } = useTranslation();
  const [currentTime, setCurrentTime] = useState(
    new Intl.DateTimeFormat(i18n.language, {
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
      timeZone: timezone,
    }).format(new Date())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(
        new Intl.DateTimeFormat(i18n.language, {
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
  }, [timezone, i18n.language, setCurrentTime]);

  return <>{currentTime}</>;
};

CurrentTime.displayName = 'CurrentTime';
