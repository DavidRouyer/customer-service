/**
 * @typedef KyakuErrorType
 *
 */
export const KyakuErrorTypes = {
  DB_ERROR: 'database_error',
  UNAUTHORIZED: 'unauthorized',
  DUPLICATE_ERROR: 'duplicate_error',
  INTERNAL: 'internal',
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
  path: string[];
  public static Types = KyakuErrorTypes;

  constructor(type: string, message: string, path?: string[]) {
    super(message);
    this.type = type;
    this.path = path || [];
  }
}
