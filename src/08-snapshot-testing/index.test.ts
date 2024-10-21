// Uncomment the code below and write your tests
import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  // Check match by expect(...).toStrictEqual(...)
  test('should generate linked list from values 1', () => {
    const values1 = [1, 2, 3];
    const expectedList = {
      value: 1,
      next: {
        value: 2,
        next: {
          value: 3,
          next: {
            value: null,
            next: null,
          },
        },
      },
    };
    const list = generateLinkedList(values1);
    expect(list).toStrictEqual(expectedList);
  });

  test('should generate linked list from values 2', () => {
    const values2 = [2, 5, 8];
    const list = generateLinkedList(values2);
    expect(list).toMatchSnapshot();
  });
});
