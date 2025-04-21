import axios from 'axios';
import { Task, Board, User } from '../data/taskFormData';

// Базовый URL для API (локальный сервер на порту 8083)
// Возможны альтернативные настройки для контейнеров или прокси
const API_URL = 'http://127.0.0.1:8083/api/v1';
// const API_URL = 'http://server:8083/api/v1';
// const API_URL = '/api/v1';

// Создание экземпляра axios с предустановленной конфигурацией
const apiClient = axios.create({
  baseURL: API_URL, // Базовый URL для всех запросов
  headers: {
    'Content-Type': 'application/json', // Тип содержимого запросов
  },
});

// Интерфейс для данных создания задачи, соответствующий API
interface CreateTaskRequest {
  title: string; // Название задачи
  description: string; // Описание задачи
  boardId: number; // Идентификатор доски
  assigneeId: number; // Идентификатор исполнителя
  priority: 'Low' | 'Medium' | 'High'; // Приоритет задачи
  status: 'Backlog' | 'InProgress' | 'Done'; // Статус задачи
}

// Интерфейс для данных обновления задачи, соответствующий API
interface UpdateTaskRequest {
  title?: string; // Название задачи (опционально)
  description?: string; // Описание задачи (опционально)
  assigneeId?: number; // Идентификатор исполнителя (опционально)
  priority?: 'Low' | 'Medium' | 'High'; // Приоритет задачи (опционально)
  status?: 'Backlog' | 'InProgress' | 'Done'; // Статус задачи (опционально)
}

// Интерфейс для ответа сервера
interface ServerResponse<T> {
  data?: T; // Данные, возвращаемые сервером
}

// Функция для получения списка всех задач
export const fetchTasks = async (): Promise<Task[]> => {
  try {
    // Выполнение GET-запроса к эндпоинту /tasks
    const response = await apiClient.get<ServerResponse<Task[]>>('/tasks');
    const data = response.data;

    // Проверка, содержит ли ответ массив данных
    if (data && Array.isArray(data.data)) {
      return data.data;
    }

    // Логирование предупреждения, если данные не в ожидаемом формате
    console.warn('Ответ API /tasks не содержит массив в поле data:', data);
    return [];
  } catch (error) {
    // Логирование ошибки и возврат пустого массива
    console.error('Ошибка при загрузке задач:', error);
    return [];
  }
};

// Функция для получения задачи по идентификатору
export const fetchTaskById = async (taskId: number): Promise<Task> => {
  // Выполнение GET-запроса к эндпоинту /tasks/:taskId
  const response = await apiClient.get<ServerResponse<Task>>(`/tasks/${taskId}`);
  const taskResponse = response.data;

  const task = taskResponse.data;

  // Проверка валидности данных задачи
  if (!task || !task.id) {
    throw new Error('Некорректные данные задачи от сервера: отсутствует задача или её ID');
  }

  return task;
};

// Функция для создания новой задачи
export const createTask = async (task: CreateTaskRequest): Promise<Task> => {
  const desiredStatus = task.status;

  // Выполнение POST-запроса к эндпоинту /tasks/create
  const response = await apiClient.post<ServerResponse<{ id: number }>>('/tasks/create', task);
  const createdTaskResponse = response.data;

  // Проверка, содержит ли ответ идентификатор созданной задачи
  if (createdTaskResponse && createdTaskResponse.data && typeof createdTaskResponse.data.id === 'number') {
    const taskId = createdTaskResponse.data.id;

    // Обновление статуса задачи
    await updateTaskStatus(taskId, desiredStatus);

    // Получение полной информации о созданной задаче
    const fullTask = await fetchTaskById(taskId);
    return fullTask;
  }

  // Выброс ошибки, если ответ сервера некорректен
  throw new Error('Некорректный ответ сервера: отсутствует ID задачи');
};

// Функция для обновления задачи
export const updateTask = async (taskId: number, task: UpdateTaskRequest): Promise<void> => {
  // Выполнение PUT-запроса к эндпоинту /tasks/update/:taskId
  await apiClient.put(`/tasks/update/${taskId}`, task);
};

// Функция для обновления статуса задачи
export const updateTaskStatus = async (taskId: number, status: Task['status']): Promise<void> => {
  // Выполнение PUT-запроса к эндпоинту /tasks/updateStatus/:taskId
  await apiClient.put(`/tasks/updateStatus/${taskId}`, { status });
};

// Функция для получения списка всех досок
export const fetchBoards = async (): Promise<Board[]> => {
  try {
    // Выполнение GET-запроса к эндпоинту /boards
    const response = await apiClient.get<ServerResponse<Board[]>>('/boards');
    const data = response.data;

    // Проверка, содержит ли ответ массив данных
    if (Array.isArray(data.data)) {
      return data.data;
    }

    // Логирование предупреждения, если данные не в ожидаемом формате
    console.warn('Ответ API /boards не содержит массив в поле data:', data);
    return [];
  } catch (error) {
    // Логирование ошибки и возврат пустого массива
    console.error('Ошибка при загрузке досок:', error);
    return [];
  }
};

// Функция для получения задач конкретной доски
export const fetchTasksOnBoard = async (boardId: number): Promise<Task[]> => {
  try {
    // Выполнение GET-запроса к эндпоинту /boards/:boardId
    const response = await apiClient.get<ServerResponse<Task[]>>(`/boards/${boardId}`);
    const data = response.data;

    // Проверка, содержит ли ответ массив данных
    if (Array.isArray(data.data)) {
      return data.data;
    }

    // Логирование предупреждения, если данные не в ожидаемом формате
    console.warn('Ответ API /boards/{boardId} не содержит массив в поле data:', data);
    return [];
  } catch (error) {
    // Логирование ошибки и возврат пустого массива
    console.error('Ошибка при загрузке задач доски:', error);
    return [];
  }
};

// Функция для получения списка всех пользователей
export const fetchUsers = async (): Promise<User[]> => {
  try {
    // Выполнение GET-запроса к эндпоинту /users
    const response = await apiClient.get<ServerResponse<User[]>>('/users');
    const data = response.data;

    // Проверка, содержит ли ответ массив данных
    if (Array.isArray(data.data)) {
      return data.data;
    }
    // Логирование предупреждения, если данные не в ожидаемом формате
    console.warn('Ответ API /users не содержит массив в поле data:', data);
    return [];
  } catch (error) {
    // Логирование ошибки и возврат пустого массива
    console.error('Ошибка при загрузке пользователей:', error);
    return [];
  }
};

/*
Предложения по улучшению:
1. **Конфигурация API_URL**: Вынести API_URL в переменную окружения (например, .env) для гибкости в разных окружениях (локальное, продакшен, Docker).
2. **Обработка ошибок**: Добавить более точные сообщения об ошибках (например, различать сетевые ошибки и ошибки сервера) и использовать toast для уведомления пользователей.
3. **Типизация**: Уточнить тип ServerResponse, добавив поле для ошибок (например, error?: string), чтобы обрабатывать сообщения от сервера.
4. **Прерывание запросов**: Добавить поддержку AbortController для отмены запросов при размонтировании компонентов.
5. **Логирование**: Заменить console.warn/console.error на централизованную систему логирования (например, через библиотеку winston).
6. **Повторные попытки**: Реализовать механизм повторных попыток для неудачных запросов (например, с помощью axios-retry).
*/