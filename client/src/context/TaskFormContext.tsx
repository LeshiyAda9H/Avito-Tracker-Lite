import { useState, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { Task } from '../data/taskFormData';
import { TaskFormContext } from './TaskFormContextDefinition';
import { toast } from 'react-toastify';
import { createNewTask, updateExistingTask, fetchAllTasks, fetchAllBoards, ThunkAppDispatch } from '../store';

interface TaskFormProviderProps {
  children: ReactNode;
}

export default function TaskFormProvider({ children }: TaskFormProviderProps) {
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [boardId, setBoardId] = useState<number | undefined>(undefined);
  const dispatch = useDispatch<ThunkAppDispatch>();

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
        await dispatch(updateExistingTask(task));
        toast.success('Задача успешно обновлена!');
      } 
      else {
        await dispatch(
          createNewTask({
            title: task.title,
            description: task.description,
            boardId: task.boardId,
            assigneeId: task.assignee.id,
            priority: task.priority,
            status: task.status,
          })
        );
        toast.success('Задача успешно создана!');
      }

      await dispatch(fetchAllTasks());
      await dispatch(fetchAllBoards());
      closeModal();

    } 
    catch (error) {
      console.error('Ошибка при сохранении задачи:', error);
      toast.error('Не удалось сохранить задачу. Попробуйте снова.');
    }
  };

  return (
    <TaskFormContext.Provider
      value={{
        openModal,
        closeModal,
        isOpen,
        selectedTask,
        boardId,
        handleSave,
      }}
    >
      {children}
    </TaskFormContext.Provider>
  );
}