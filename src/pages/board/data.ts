import { Task } from '../../data/taskFormData';

// Определяем типы для задач и колонок
interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface BoardData {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: string[];
}

export const initialData: BoardData = {
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-2'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: [],
    },
  },
  tasks: {
    'task-1': { id: 'task-1', title: 'Задача 1', description: 'Описание задачи 1', boardId: '1', priority: 'Средний', status: 'To Do', executor: 'Иван' },
    'task-2': { id: 'task-2', title: 'Задача 2', description: 'Описание задачи 2', boardId: '1', priority: 'Высокий', status: 'To Do', executor: 'Мария' },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};