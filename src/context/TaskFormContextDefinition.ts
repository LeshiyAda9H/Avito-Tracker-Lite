import { createContext } from 'react';
import { Task } from '../data/taskFormData';

export interface TaskFormContextType {
  openModal: (task?: Task, boardId?: string) => void;
  closeModal: () => void;
  isOpen: boolean
  selectedTask: Task | null;
  boardId?: string;
  handleSave: (task: Task) => void;
}

export const TaskFormContext = createContext<TaskFormContextType | undefined>(undefined);