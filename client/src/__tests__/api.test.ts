import axios from 'axios';
import { fetchTasks } from '../api/api';

jest.mock('axios');

describe('api', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('загружает задачи', async () => {
    const mockTasks = [{ id: 1, title: 'Задача 1' }];
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.create = jest.fn().mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: { data: mockTasks } }),
    });

    const tasks = await fetchTasks();
    expect(tasks).toEqual(mockTasks);
    expect(mockedAxios.create().get).toHaveBeenCalledWith('/tasks');
  });

  it('возвращает пустой массив при ошибке', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.create = jest.fn().mockReturnValue({
      get: jest.fn().mockRejectedValue(new Error('Network error')),
    });

    const tasks = await fetchTasks();
    expect(tasks).toEqual([]);
  });
});