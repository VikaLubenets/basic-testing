// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

type Name = {
  name: string;
}

describe('throttledGetDataFromApi', () => {
  let spyAxiosCreate: jest.SpyInstance;
  let spyAxiosGet: jest.SpyInstance;
  let baseURL = 'https://jsonplaceholder.typicode.com';
  let mockEndpoint = '/names';
  let names: Name[] = [{name: 'Oleg'}, {name: 'Kate'}]

  beforeAll(() => {
    jest.useFakeTimers();
    jest.mock('axios', () => ({
      ...jest.requireActual('axios'),
      get: jest.fn(),
      create: jest.fn(),
    }));
    jest.mock('lodash', () => ({
      ...jest.requireActual('lodash'),
      throttle: jest.fn(),
    }));
  })

  beforeEach(() => {
    jest.runOnlyPendingTimers()
    spyAxiosCreate = jest.spyOn(axios, 'create')
    spyAxiosGet = jest.spyOn(axios.Axios.prototype, 'get')
    spyAxiosGet.mockResolvedValue({data: names}); 
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.useRealTimers();
  })

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi(mockEndpoint);
    expect(spyAxiosCreate).toBeCalledWith({baseURL})
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi(mockEndpoint);
    expect(spyAxiosGet).toBeCalledWith(mockEndpoint)
  });

  test('should return response data', async () => {
    const data = await throttledGetDataFromApi(mockEndpoint);
    expect(data).toEqual(names)
  });
});
