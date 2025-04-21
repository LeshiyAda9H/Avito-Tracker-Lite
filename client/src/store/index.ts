import { configureStore, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { Task, Board } from '../data/taskFormData';
import { fetchTasks, fetchTasksOnBoard, fetchBoards, createTask, updateTask as apiUpdateTask, updateTaskStatus as apiUpdateTaskStatus } from '../api/api';

// Интерфейс состояния приложения
interface AppState {
  tasks: Task[]; // Список всех задач
  boards: Board[]; // Список всех досок
  boardTasks: { [key: number]: Task[] }; // Задачи, сгруппированные по идентификатору доски
  isLoading: boolean; // Флаг состояния загрузки
  error: string | null; // Сообщение об ошибке (если есть)
}

// Начальное состояние приложения
const initialState: AppState = {
  tasks: [],
  boards: [],
  boardTasks: {},
  isLoading: false,
  error: null,
};

// Создание слайса для управления задачами и досками
const taskSlice = createSlice({
  name: 'tasks', // Имя слайса
  initialState, // Начальное состояние
  reducers: {
    // Установка состояния загрузки
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    // Установка сообщения об ошибке
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    // Установка списка задач с фильтрацией некорректных данных
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload.filter((task): task is Task => task !== undefined && typeof task.id === 'number');
    },
    // Установка списка досок с фильтрацией некорректных данных
    setBoards(state, action: PayloadAction<Board[]>) {
      state.boards = action.payload.filter((board): board is Board => board !== undefined && typeof board.id === 'number');
    },
    // Установка задач для конкретной доски
    setBoardTasks(state, action: PayloadAction<{ boardId: number; tasks: Task[] }>) {
      state.boardTasks[action.payload.boardId] = action.payload.tasks.filter(
        (task): task is Task => task !== undefined && typeof task.id === 'number'
      );
    },
    // Добавление новой задачи
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.push(action.payload);
      if (action.payload.boardId) {
        const boardTasks = state.boardTasks[action.payload.boardId] || [];
        state.boardTasks[action.payload.boardId] = [...boardTasks, action.payload];
      }
    },
    // Обновление существующей задачи
    updateTask(state, action: PayloadAction<Task>) {
      state.tasks = state.tasks.map((task) =>
        task.id === action.payload.id ? { ...task, ...action.payload } : task
      );
      if (action.payload.boardId) {
        state.boardTasks[action.payload.boardId] = (state.boardTasks[action.payload.boardId] || []).map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        );
      }
    },
    // Обновление статуса задачи
    updateTaskStatus(state, action: PayloadAction<{ taskId: number; status: Task['status']; boardId?: number }>) {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (!task) return;

      state.tasks = state.tasks.map((t) =>
        t.id === action.payload.taskId ? { ...t, status: action.payload.status } : t
      );

      const boardId = action.payload.boardId || task.boardId;
      if (boardId) {
        state.boardTasks[boardId] = (state.boardTasks[boardId] || []).map((t) =>
          t.id === action.payload.taskId ? { ...t, status: action.payload.status } : t
        );
      }
    },
  },
});

// Экспорт действий слайса
export const { setLoading, setError, setTasks, setBoards, setBoardTasks, addTask, updateTask, updateTaskStatus } =
  taskSlice.actions;

// Селектор для получения задач доски
const selectBoardTasks = (state: RootState) => state.tasks.boardTasks;

// Мемоированный селектор для получения задач по идентификатору доски
export const selectBoardTasksById = createSelector(
  [selectBoardTasks, (_: RootState, boardId: number) => boardId],
  (boardTasks, boardId) => boardTasks[boardId] || []
);

// Тип для действий приложения
type AppAction =
  | PayloadAction<boolean>
  | PayloadAction<string | null>
  | PayloadAction<Task[]>
  | PayloadAction<Board[]>
  | PayloadAction<{ boardId: number; tasks: Task[] }>
  | PayloadAction<Task>
  | PayloadAction<{ taskId: number; status: Task['status']; boardId?: number }>;

// Тип для thunk-действий
type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AppAction>;

// Thunk для загрузки всех задач
export const fetchAllTasks = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    const tasks = await fetchTasks();
    dispatch(setTasks(tasks));
  } catch {
    dispatch(setError('Не удалось загрузить задачи.'));
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk для загрузки всех досок
export const fetchAllBoards = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    const boards = await fetchBoards();
    dispatch(setBoards(boards));
  } catch {
    dispatch(setError('Не удалось загрузить доски.'));
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk для загрузки задач конкретной доски
export const fetchBoardTasks = (boardId: number): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    const tasks = await fetchTasksOnBoard(boardId);
    dispatch(setBoardTasks({ boardId, tasks }));
  } catch {
    dispatch(setError('Не удалось загрузить задачи доски.'));
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk для создания новой задачи
export const createNewTask = (taskData: {
  title: string;
  description: string;
  boardId: number;
  assigneeId: number;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Backlog' | 'InProgress' | 'Done';
}): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    console.log('Создание задачи с данными:', taskData); // Логирование данных перед отправкой
    const createdTask = await createTask(taskData);
    console.log('Задача создана со статусом:', createdTask.status); // Логирование статуса созданной задачи
    dispatch(addTask(createdTask));
  } catch (error) {
    console.error('Ошибка при создании задачи:', error);
    dispatch(setError('Не удалось создать задачу.'));
    throw new Error('Не удалось создать задачу');
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk для обновления существующей задачи
export const updateExistingTask = (task: Task): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    await apiUpdateTask(task.id, {
      title: task.title,
      description: task.description,
      assigneeId: task.assignee.id,
      priority: task.priority,
      status: task.status,
    });
    dispatch(updateTask(task));
  } catch {
    dispatch(setError('Не удалось обновить задачу.'));
    throw new Error('Не удалось обновить задачу');
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk для асинхронного обновления статуса задачи
export const updateTaskStatusAsync = (
  taskId: number,
  status: Task['status'],
  boardId?: number
): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    await apiUpdateTaskStatus(taskId, status);
    dispatch(updateTaskStatus({ taskId, status, boardId }));
  } catch {
    dispatch(setError('Не удалось обновить статус задачи.'));
    throw new Error('Не удалось обновить статус задачи');
  } finally {
    dispatch(setLoading(false));
  }
};

// Конфигурация Redux store
const store = configureStore({
  reducer: {
    tasks: taskSlice.reducer, // Редюсер для управления задачами
  },
});

// Экспорт типов для состояния и диспетчера
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type ThunkAppDispatch = ThunkDispatch<RootState, void, AppAction>;

// Экспорт store по умолчанию
export default store;

/*
Предложения по улучшению:
1. **Логирование**: Заменить console.log/console.error на централизованную систему логирования (например, winston).
2. **Обработка ошибок**: Добавить более точные сообщения об ошибках на основе типа ошибки (например, сетевая ошибка или ошибка сервера).
3. **Типизация**: Уточнить тип AppAction, чтобы избежать использования union-типов, или использовать discriminated unions.
4. **Оптимизация селекторов**: Добавить больше мемоированных селекторов для часто используемых данных (например, для фильтрации задач).
5. **Модульность**: Вынести редюсеры и действия в отдельные файлы (например, tasksSlice.ts) для лучшей организации.
6. **Тестирование**: Добавить юнит-тесты для редюсеров и thunk-действий с помощью Jest и @testing-library.
*/