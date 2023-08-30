export const fallbackLng = 'en';
export const languages = [fallbackLng, 'fr'];

export function getOptions(lng = fallbackLng) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
  };
}
