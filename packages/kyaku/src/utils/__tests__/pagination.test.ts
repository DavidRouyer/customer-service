import type { Cursor } from '../../types/index.js';
import { composeCursor, parseCursor } from '../pagination.js';

const encodedCursor = 'eyJsYXN0SWQiOiIxIiwibGFzdFZhbHVlIjoiMSJ9';
const decodedCursor: Cursor = { lastId: '1', lastValue: '1' };

describe('cursor parsing', () => {
  it('converts from base64 cursor to object', () => {
    expect(parseCursor(encodedCursor)).toStrictEqual(decodedCursor);
  });

  it('converts from invalid base64 cursor should throw', () => {
    expect(() => parseCursor('invalid')).toThrow();
    expect(() => parseCursor('eyJsYXN0SWQiOiIxIn0=')).toThrow();
  });

  it('converts from cursor object to base64', () => {
    expect(composeCursor(decodedCursor)).toStrictEqual(encodedCursor);
  });
});
