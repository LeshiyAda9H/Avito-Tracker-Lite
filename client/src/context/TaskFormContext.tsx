import { useState, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { Task } from '../data/taskFormData';
import { TaskFormContext } from './TaskFormContextDefinition';
import { toast } from 'react-toastify';
import { createNewTask, updateExistingTask, fetchAllTasks, fetchAllBoards, ThunkAppDispatch } from '../store';

// Интерфейс пропсов для провайдера контекста
interface TaskFormProviderProps {
  children: ReactNode; // Дочерние компоненты
}

// Провайдер контекста для управления состоянием и действиями формы задачи
export default function TaskFormProvider({ children }: TaskFormProviderProps) {
  // Состояние видимости модального окна
  const [isOpen, setIsOpen] = useState(false);
  // Текущая выбранная задача для редактирования
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  // Идентификатор доски для привязки задачи
  const [boardId, setBoardId] = useState<number | undefined>(undefined);
  // Диспетчер Redux с поддержкой thunk
  const dispatch = useDispatch<ThunkAppDispatch>();

  // Функция открытия модального окна с опциональной задачей и идентификатором доски
  const openModal = (task?: Task, boardId?: number) => {
    setSelectedTask(task || null);
    setBoardId(boardId);
    setIsOpen(true);
  };

  // Функция закрытия модального окна и сброса состояния
  const closeModal = () => {
    setIsOpen(false);
    setSelectedTask(null);
    setBoardId(undefined);
  };

  // Функция сохранения задачи (создание или обновление) с обновлением данных
  const handleSave = async (task: Task) => {
    try {
      if (task.id) {
        // Обновление существующей задачи
        await dispatch(updateExistingTask(task));
        toast.success('Задача успешно обновлена!');
      } else {
        // Создание новой задачи
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

      // Обновление списков задач и досок
      await dispatch(fetchAllTasks());
      await dispatch(fetchAllBoards());
      closeModal();
    } catch (error) {
      console.error('Ошибка при сохранении задачи:', error);
      toast.error('Не удалось сохранить задачу. Попробуйте снова.');
    }
  };

  return (
    // Предоставление значений контекста дочерним компонентам
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

/*
Предложения по улучшению:
1. **Управление данными**: Использовать React Query для мутаций (createNewTask, updateExistingTask) и автоматического обновления данных вместо ручных dispatch.
2. **Обработка ошибок**: Добавить более точные сообщения об ошибках на основе типа ошибки (например, сетевая ошибка или ошибка валидации).
3. **Локализация**: Вынести строки уведомлений в файл локализации для поддержки многоязычности.
4. **Оптимизация**: Использовать useCallback для функций openModal, closeModal и handleSave, чтобы избежать лишних рендеров.
*/