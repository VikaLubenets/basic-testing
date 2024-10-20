// Uncomment the code below and write your tests
import path from 'node:path';
import fs from 'node:fs';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

describe('doStuffByTimeout', () => {
  let spySetTimeout: jest.SpyInstance;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    spySetTimeout = jest.spyOn(global, 'setTimeout');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const cb = jest.fn();
    doStuffByTimeout(cb, 100);

    expect(spySetTimeout).toHaveBeenCalledTimes(1);
    expect(spySetTimeout).toHaveBeenLastCalledWith(cb, 100);
  });

  test('should call callback only after timeout', () => {
    const cb = jest.fn();
    doStuffByTimeout(cb, 100);

    expect(cb).not.toHaveBeenCalled();
    jest.runAllTimers();

    expect(cb).toHaveBeenCalled();
    expect(cb).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  let spySetInterval: jest.SpyInstance;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    spySetInterval = jest.spyOn(global, 'setInterval');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const cb = jest.fn();
    doStuffByInterval(cb, 100);

    expect(spySetInterval).toHaveBeenCalledTimes(1);
    expect(spySetInterval).toHaveBeenLastCalledWith(cb, 100);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const cb = jest.fn();
    doStuffByInterval(cb, 1000);
    jest.advanceTimersByTime(3000);
    expect(cb).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const mockPathFile = 'text.txt';
  const mockContent = 'This is content';

  let spyJoin: jest.SpyInstance;
  let spyExistsSync: jest.SpyInstance;
  let spyReadFile: jest.SpyInstance;

  beforeEach((): void => {
    spyJoin = jest.spyOn(path, 'join');
    spyExistsSync = jest.spyOn(fs, 'existsSync');
    spyReadFile = jest.spyOn(fs.promises, 'readFile');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call join with pathToFile', async () => {
    await readFileAsynchronously(mockPathFile);
    expect(spyJoin).toBeCalled();
  });

  test('should return null if file does not exist', async () => {
    spyExistsSync.mockReturnValue(false);
    const result = await readFileAsynchronously(mockPathFile);
    expect(result).toBeNull();
    expect(spyExistsSync).toHaveBeenCalledTimes(1);
  });

  test('should return file content if file exists', async () => {
    spyExistsSync.mockReturnValue(true);
    spyReadFile.mockResolvedValue(mockContent);

    const result = await readFileAsynchronously(mockPathFile);
    expect(result).toBe(mockContent);
  });
});
