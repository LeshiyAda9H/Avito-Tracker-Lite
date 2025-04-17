import { Task } from '../../data/taskFormData';

// Определяем типы для задач
export const initialIssues: Task[] = [
  { id: '1', title: 'Задача 1', description: 'Описание задачи 1', boardId: '1', priority: 'Средний', status: 'To Do', executor: 'Иван' },
  { id: '2', title: 'Задача 2', description: 'Описание задачи 2', boardId: '1', priority: 'Высокий', status: 'In Progress', executor: 'Мария' },
  { id: '3', title: 'Задача 3', description: 'Описание задачи 3', boardId: '2', priority: 'Низкий', status: 'Done', executor: 'Петр' },
  { id: '4', title: 'Задача 4', description: 'Описание задачи 4', boardId: '2', priority: 'Средний', status: 'To Do', executor: 'Анна' },
];

// Список досок для фильтрации (уже есть, оставляем без изменений)
export const boards = [
  { id: 'All', title: 'Все доски' },
  { id: '1', title: 'Проект 1' },
  { id: '2', title: 'Проект 2' },
];