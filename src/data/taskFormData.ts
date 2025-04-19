export interface Board {
  id: number;
  name: string;
  description?: string;
  taskCount?: number;
}

export interface User {
  id: number;
  fullName: string;
  email?: string;
  avatarUrl?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  boardId: number;
  boardName?: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Backlog' | 'InProgress' | 'Done'; // Серверный статус
  assignee: User;
}