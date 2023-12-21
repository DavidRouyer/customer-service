// Copyright 2021 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * Asserts an expression is true.
 *
 * @param value - An expression to assert is true.
 * @param message - An optional message for the assertion error thrown.
 */
export function strictAssert(value: boolean, message: string): asserts value;

/**
 * Asserts a nullable value is non-null.
 *
 * @param value - A nullable value to assert is non-null.
 * @param message - An optional message for the assertion error thrown.
 */
export function strictAssert<T>(
  value: T | null | undefined,
  message: string
): asserts value is T;

export function strictAssert(condition: unknown, message: string): void {
  if (condition === false || condition == null) {
    throw new Error(message);
  }
}

/**
 * Asserts that the type of value is not a promise.
 * (Useful for database modules)
 */
export function assertSync<T, X>(value: T extends Promise<X> ? never : T): T {
  return value;
}
