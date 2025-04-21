import axios from 'axios';
import { Task, Board, User } from '../data/taskFormData';

const API_URL = 'http://127.0.0.1:8083/api/v1';
// const API_URL = 'http://server:8083/api/v1';
// const API_URL = '/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Тип для создания задачи (соответствует API)
interface CreateTaskRequest {
  title: string;
  description: string;
  boardId: number;
  assigneeId: number;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Backlog' | 'InProgress' | 'Done';
}

// Тип для обновления задачи (соответствует API)
interface UpdateTaskRequest {
  title?: string;
  description?: string;
  assigneeId?: number;
  priority?: 'Low' | 'Medium' | 'High';
  status?: 'Backlog' | 'InProgress' | 'Done';
}

// Интерфейс для ответа сервера
interface ServerResponse<T> {
  data?: T;
}

// Получение списка задач
export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await apiClient.get<ServerResponse<Task[]>>('/tasks');
    const data = response.data;

    if (data && Array.isArray(data.data)) {
      return data.data;
    }

    console.warn('Ответ API /tasks не содержит массив в поле data:', data);
    return [];
  } catch (error) {
    console.error('Ошибка при загрузке задач:', error);
    return [];
  }
};

// Получение задачи по ID
export const fetchTaskById = async (taskId: number): Promise<Task> => {
  const response = await apiClient.get<ServerResponse<Task>>(`/tasks/${taskId}`);
  const taskResponse = response.data;

  const task = taskResponse.data;

  if (!task || !task.id) {
    throw new Error('Invalid task data received from server: missing task or task ID');
  }

  return task;
};

// Создание новой задачи
export const createTask = async (task: CreateTaskRequest): Promise<Task> => {
  const desiredStatus = task.status;

  const response = await apiClient.post<ServerResponse<{ id: number }>>('/tasks/create', task);
  const createdTaskResponse = response.data;

  if (createdTaskResponse && createdTaskResponse.data && typeof createdTaskResponse.data.id === 'number') {
    const taskId = createdTaskResponse.data.id;

    await updateTaskStatus(taskId, desiredStatus);

    const fullTask = await fetchTaskById(taskId);
    return fullTask;
  }

  throw new Error('Invalid response from server: missing task ID');
};

// Обновление задачи
export const updateTask = async (taskId: number, task: UpdateTaskRequest): Promise<void> => {
  await apiClient.put(`/tasks/update/${taskId}`, task);
};

// Обновление статуса задачи
export const updateTaskStatus = async (taskId: number, status: Task['status']): Promise<void> => {
  await apiClient.put(`/tasks/updateStatus/${taskId}`, { status });
};

// Получение списка досок
export const fetchBoards = async (): Promise<Board[]> => {
  try {
    const response = await apiClient.get<ServerResponse<Board[]>>('/boards');
    const data = response.data;

    if (Array.isArray(data.data)) {
      return data.data;
    }

    console.warn('Ответ API /boards не содержит массив в поле data:', data);
    return [];
  } catch (error) {
    console.error('Ошибка при загрузке досок:', error);
    return [];
  }
};

// Получение задач доски
export const fetchTasksOnBoard = async (boardId: number): Promise<Task[]> => {
  try {
    const response = await apiClient.get<ServerResponse<Task[]>>(`/boards/${boardId}`);
    const data = response.data;

    if (Array.isArray(data.data)) {
      return data.data;
    }

    console.warn('Ответ API /boards/{boardId} не содержит массив в поле data:', data);
    return [];
  } catch (error) {
    console.error('Ошибка при загрузке задач доски:', error);
    return [];
  }
};

// Получение списка пользователей
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<ServerResponse<User[]>>('/users');
    const data = response.data;

    if (Array.isArray(data.data)) {
      return data.data;
    }
    console.warn('Ответ API /users не содержит массив в поле data:', data);
    return [];
  } catch (error) {
    console.error('Ошибка при загрузке пользователей:', error);
    return [];
  }
};