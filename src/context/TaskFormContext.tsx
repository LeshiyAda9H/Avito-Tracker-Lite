import { useState } from 'react';
import { TaskFormContext } from './TaskFormContextDefinition';
import { Task } from '../data/taskFormData';
import { ReactNode } from 'react';

interface TaskFormProviderProps {
  children: ReactNode;
}

export default function TaskFormProvider({ children }: TaskFormProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [boardId, setBoardId] = useState<string | undefined>(undefined);

  const openModal = (task?: Task, boardId?: string) => {
    setSelectedTask(task || null);
    setBoardId(boardId);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedTask(null);
    setBoardId(undefined);
  };

  const handleSave = (task: Task) => {
    console.log('Сохранена задача:', task);
    closeModal();
  };

  return (
    <TaskFormContext.Provider value={{ openModal, closeModal, isOpen, selectedTask, boardId, handleSave }}>
      {children}
    </TaskFormContext.Provider>
  );
}