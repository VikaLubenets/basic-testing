// Uncomment the code below and write your tests
import { random } from 'lodash';
import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

jest.mock('lodash');

describe('BankAccount', () => {
  let account: ReturnType<typeof getBankAccount>;
  let otherAccount: ReturnType<typeof getBankAccount>;

  beforeEach(() => {
    account = getBankAccount(1000);
    otherAccount = getBankAccount(500);
  });

  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(1000);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account.withdraw(2000)).toThrow(InsufficientFundsError);
    expect(() => account.withdraw(2000)).toThrow(
      'Insufficient funds: cannot withdraw more than 1000',
    );
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => account.transfer(2000, otherAccount)).toThrow(
      InsufficientFundsError,
    );
    expect(() => account.transfer(2000, otherAccount)).toThrow(
      'Insufficient funds: cannot withdraw more than 1000',
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(500, account)).toThrow(TransferFailedError);
    expect(() => account.transfer(500, account)).toThrow('Transfer failed');
  });

  test('should deposit money', () => {
    account.deposit(500);
    expect(account.getBalance()).toBe(1500);
  });

  test('should withdraw money', () => {
    account.withdraw(500);
    expect(account.getBalance()).toBe(500);
  });

  test('should transfer money', () => {
    account.transfer(500, otherAccount);
    expect(account.getBalance()).toBe(500);
    expect(otherAccount.getBalance()).toBe(1000);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    (random as jest.Mock).mockReturnValueOnce(1000);
    (random as jest.Mock).mockReturnValueOnce(1);
    const balance = await account.fetchBalance();
    expect(balance).toBe(1000);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(1500);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(1500);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
    await expect(account.synchronizeBalance()).rejects.toThrow(
      'Synchronization failed',
    );
  });
});
