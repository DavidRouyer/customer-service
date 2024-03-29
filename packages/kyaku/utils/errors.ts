/**
 * @typedef KyakuErrorType
 *
 */
export const KyakuErrorTypes = {
  DUPLICATE_ERROR: 'duplicate_error',
  INVALID_ARGUMENT: 'invalid_argument',
  NOT_ALLOWED: 'not_allowed',
  NOT_FOUND: 'not_found',
};

/**
 * Standardized error to be used across Kyaku project.
 * @extends Error
 */
export class KyakuError extends Error {
  type: string;
  public static Types = KyakuErrorTypes;

  constructor(type: string, message: string) {
    super(message);
    this.type = type;
  }
}
