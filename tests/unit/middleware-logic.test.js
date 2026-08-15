import { calculateDelay } from '../../src/middlewares/simulateDelay.js';
import { parseStatus } from '../../src/middlewares/simulateError.js';

describe('calculateDelay', () => {
  test('returns 0 for missing value', () => {
    expect(calculateDelay(undefined, 5000)).toBe(0);
  });

  test('returns 0 for non-numeric value', () => {
    expect(calculateDelay('abc', 5000)).toBe(0);
  });

  test('returns 0 for zero or negative values', () => {
    expect(calculateDelay('0', 5000)).toBe(0);
    expect(calculateDelay('-100', 5000)).toBe(0);
  });

  test('returns the raw delay when within the cap', () => {
    expect(calculateDelay('1500', 5000)).toBe(1500);
  });

  test('clamps the delay to the maximum', () => {
    expect(calculateDelay('999999', 5000)).toBe(5000);
    expect(calculateDelay('6000', 5000)).toBe(5000);
  });
});

describe('parseStatus', () => {
  test('returns null when _status is absent', () => {
    expect(parseStatus(undefined)).toBeNull();
  });

  test('returns null for non-numeric values', () => {
    expect(parseStatus('abc')).toBeNull();
    expect(parseStatus('')).toBeNull();
  });

  test('returns null outside the 400-599 range', () => {
    expect(parseStatus('200')).toBeNull();
    expect(parseStatus('399')).toBeNull();
    expect(parseStatus('600')).toBeNull();
  });

  test('returns the status for valid client/server errors', () => {
    expect(parseStatus('400')).toBe(400);
    expect(parseStatus('500')).toBe(500);
    expect(parseStatus('599')).toBe(599);
  });
});
