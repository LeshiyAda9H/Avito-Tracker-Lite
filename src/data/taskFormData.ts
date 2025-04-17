export interface Task {
    id: string;
    title: string;
    description: string;
    boardId: string;
    priority: string;
    status: string;
    executor: string;
  }
  
  export const priorities = ['Низкий', 'Средний', 'Высокий'];
  export const statuses = ['To Do', 'In Progress', 'Done'];
  export const executors = ['Иван', 'Мария', 'Петр', 'Анна'];
  
  export const boards = [
    { id: '1', title: 'Проект 1' },
    { id: '2', title: 'Проект 2' },
    { id: '3', title: 'Проект 3' },
  ];