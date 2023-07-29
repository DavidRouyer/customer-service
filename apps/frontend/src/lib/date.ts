export const formatHours = (date: Date, locale: string) => {
  const formatter = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: 'numeric',
  });
  return formatter.format(date);
};
