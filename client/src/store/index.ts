import { configureStore, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { Task, Board } from '../data/taskFormData';
import { fetchTasks, fetchTasksOnBoard, fetchBoards, createTask, updateTask as apiUpdateTask, updateTaskStatus as apiUpdateTaskStatus } from '../api/api';

interface AppState {
  tasks: Task[];
  boards: Board[];
  boardTasks: { [key: number]: Task[] };
  isLoading: boolean;
  error: string | null;
}

const initialState: AppState = {
  tasks: [],
  boards: [],
  boardTasks: {},
  isLoading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload.filter((task): task is Task => task !== undefined && typeof task.id === 'number');
    },
    setBoards(state, action: PayloadAction<Board[]>) {
      state.boards = action.payload.filter((board): board is Board => board !== undefined && typeof board.id === 'number');
    },
    setBoardTasks(state, action: PayloadAction<{ boardId: number; tasks: Task[] }>) {
      state.boardTasks[action.payload.boardId] = action.payload.tasks.filter(
        (task): task is Task => task !== undefined && typeof task.id === 'number'
      );
    },
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.push(action.payload);
      if (action.payload.boardId) {
        const boardTasks = state.boardTasks[action.payload.boardId] || [];
        state.boardTasks[action.payload.boardId] = [...boardTasks, action.payload];
      }
    },
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

export const { setLoading, setError, setTasks, setBoards, setBoardTasks, addTask, updateTask, updateTaskStatus } =
  taskSlice.actions;

const selectBoardTasks = (state: RootState) => state.tasks.boardTasks;
export const selectBoardTasksById = createSelector(
  [selectBoardTasks, (_: RootState, boardId: number) => boardId],
  (boardTasks, boardId) => boardTasks[boardId] || []
);

type AppAction =
  | PayloadAction<boolean>
  | PayloadAction<string | null>
  | PayloadAction<Task[]>
  | PayloadAction<Board[]>
  | PayloadAction<{ boardId: number; tasks: Task[] }>
  | PayloadAction<Task>
  | PayloadAction<{ taskId: number; status: Task['status']; boardId?: number }>;

type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AppAction>;

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
    console.log('Creating task with data:', taskData); // Логируем данные перед отправкой
    const createdTask = await createTask(taskData);
    console.log('Task created with status:', createdTask.status); // Логируем статус созданной задачи
    dispatch(addTask(createdTask));
  } catch (error) {
    console.error('Error creating task:', error);
    dispatch(setError('Не удалось создать задачу.'));
    throw new Error('Failed to create task');
  } finally {
    dispatch(setLoading(false));
  }
};

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
    throw new Error('Failed to update task');
  } finally {
    dispatch(setLoading(false));
  }
};

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
    throw new Error('Failed to update task status');
  } finally {
    dispatch(setLoading(false));
  }
};

const store = configureStore({
  reducer: {
    tasks: taskSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type ThunkAppDispatch = ThunkDispatch<RootState, void, AppAction>;

export default store;