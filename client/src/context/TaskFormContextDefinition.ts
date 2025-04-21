import { createContext } from 'react';
import { Task } from '../data/taskFormData';

// Определение типов для контекста
export interface TaskFormContextType {
  openModal: (task?: Task, boardId?: number) => void;
  closeModal: () => void;
  isOpen: boolean;
  selectedTask: Task | null;
  boardId: number | undefined;
  handleSave: (task: Task) => Promise<void>;
}

export const TaskFormContext = createContext<TaskFormContextType | undefined>(undefined);