// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },

  { a: 3, b: 2, action: Action.Subtract, expected: 1 },

  { a: 3, b: 2, action: Action.Multiply, expected: 6 },

  { a: 6, b: 2, action: Action.Divide, expected: 3 },

  { a: 2, b: 2, action: Action.Exponentiate, expected: 4 },

  { a: 8, b: 0, action: 'some action', expected: null },

  { a: 1, b: '+2', action: Action.Divide, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'test math operations of simple calculator',
    ({ a, b, action, expected }) => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    },
  );
});
