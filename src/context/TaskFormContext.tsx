import { useState, ReactNode } from 'react';
import { Task } from '../data/taskFormData';
import { createTask, updateTask } from '../api/api';
import { TaskFormContext } from './TaskFormContextDefinition';

interface TaskFormProviderProps {
  children: ReactNode;
}

export default function TaskFormProvider({ children }: TaskFormProviderProps) {
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [boardId, setBoardId] = useState<number | undefined>(undefined);

  const openModal = (task?: Task, boardId?: number) => {
    setSelectedTask(task || null);
    setBoardId(boardId);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedTask(null);
    setBoardId(undefined);
  };

  const handleSave = async (task: Task) => {
    try {
      
      if (task.id) {
        await updateTask(task.id, {
          title: task.title,
          description: task.description,
          assigneeId: task.assignee.id,
          priority: task.priority,
          status: task.status,
        });
        console.log('Задача обновлена:', task);
      } 
      else {
        await createTask({
          title: task.title,
          description: task.description,
          boardId: task.boardId,
          assigneeId: task.assignee.id,
          priority: task.priority,
          status: task.status,
        });
        console.log('Создана новая задача:', task);
      }

      closeModal();

    } 
    catch (error) {
      console.error('Ошибка при сохранении задачи:', error);
    }
  };

  return (
    <TaskFormContext.Provider value={{ openModal, closeModal, isOpen, selectedTask, boardId, handleSave }}>
      {children}
    </TaskFormContext.Provider>
  );
}