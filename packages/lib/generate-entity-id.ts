import { factory } from 'ulid';

// https://github.com/ulid/javascript/issues/72#issuecomment-1143617380
const prng = () => {
  const buffer = new Uint8Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0] ?? 0 / 0xff;
};
const ulid = factory(prng);

/**
 * Generate a composed id based on the input parameters and return either the is if it exists or the generated one.
 * @param idProperty
 * @param prefix
 */
export function generateEntityId(idProperty: string, prefix?: string): string {
  if (idProperty) {
    return idProperty;
  }

  const id = ulid();
  prefix = prefix ? `${prefix}_` : '';
  return `${prefix}${id}`;
}
