import { useState, ReactNode } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '../data/taskFormData';
import { createTask, updateTask } from '../api/api';
import { TaskFormContext } from './TaskFormContextDefinition';
import { toast } from 'react-toastify';

interface TaskFormProviderProps {
  children: ReactNode;
}

export default function TaskFormProvider({ children }: TaskFormProviderProps) {
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [boardId, setBoardId] = useState<number | undefined>(undefined);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: (createdTask) => {
      toast.success('Задача успешно создана!');
      // Инвалидируем запросы, чтобы обновить данные в Issues и Board
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['boardTasks', createdTask.boardId] });
    },
    onError: () => {
      toast.error('Не удалось создать задачу. Попробуйте снова.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ taskId, task }: { taskId: number; task: Omit<Task, 'id'> }) =>
      updateTask(taskId, {
        title: task.title,
        description: task.description,
        assigneeId: task.assignee.id,
        priority: task.priority,
        status: task.status,
      }),
    onSuccess: (_, { task }) => {
      toast.success('Задача успешно обновлена!');
      // Инвалидируем запросы, чтобы обновить данные в Issues и Board
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['boardTasks', task.boardId] });
    },
    onError: () => {
      toast.error('Не удалось обновить задачу. Попробуйте снова.');
    },
  });

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
    if (task.id) {
      await updateMutation.mutateAsync({
        taskId: task.id,
        task,
      });
    } else {
      await createMutation.mutateAsync({
        title: task.title,
        description: task.description,
        boardId: task.boardId,
        assigneeId: task.assignee.id,
        priority: task.priority,
        status: task.status,
      });
    }
    closeModal();
  };

  return (
    <TaskFormContext.Provider value={{ openModal, closeModal, isOpen, selectedTask, boardId, handleSave }}>
      {children}
    </TaskFormContext.Provider>
  );
}