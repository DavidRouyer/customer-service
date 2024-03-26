export const getInitials = (string: string) => {
  const names = string.split(' ');

  if (names.length === 0) return string;

  let initials = names[0]?.substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1]?.substring(0, 1).toUpperCase() ?? '';
  }
  return initials;
};
