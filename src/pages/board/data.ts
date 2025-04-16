// Определяем типы для задач и колонок
interface Task {
    id: string;
    content: string;
  }
  
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
    taskIds: ['task-3'],
    },
    'column-3': {
    id: 'column-3',
    title: 'Done',
    taskIds: ['task-4'],
    },
},
tasks: {
    'task-1': { id: 'task-1', content: 'Задача 1' },
    'task-2': { id: 'task-2', content: 'Задача 2' },
    'task-3': { id: 'task-3', content: 'Задача 3' },
    'task-4': { id: 'task-4', content: 'Задача 4' },
},
columnOrder: ['column-1', 'column-2', 'column-3'],
};