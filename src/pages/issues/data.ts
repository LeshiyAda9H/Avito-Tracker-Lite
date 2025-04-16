// Определяем типы для задач
export interface Issue {
    id: string;
    title: string;
    status: string;
    boardId: string;
    executor: string;
}
  
export const initialIssues: Issue[] = [
    { id: '1', title: 'Задача 1', status: 'To Do', boardId: '1', executor: 'Иван' },
    { id: '2', title: 'Задача 2', status: 'In Progress', boardId: '1', executor: 'Мария' },
    { id: '3', title: 'Задача 3', status: 'Done', boardId: '2', executor: 'Петр' },
    { id: '4', title: 'Задача 4', status: 'To Do', boardId: '2', executor: 'Анна' },
];

export const boards = [
    { id: 'All', title: 'Все доски' },
    { id: '1', title: 'Проект 1' },
    { id: '2', title: 'Проект 2' },
];