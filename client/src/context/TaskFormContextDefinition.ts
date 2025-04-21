import { createContext } from 'react';
import { Task } from '../data/taskFormData';

// Интерфейс для определения типов значений контекста формы задачи
export interface TaskFormContextType {
  openModal: (task?: Task, boardId?: number) => void; // Функция открытия модального окна
  closeModal: () => void; // Функция закрытия модального окна
  isOpen: boolean; // Флаг видимости модального окна
  selectedTask: Task | null; // Текущая выбранная задача
  boardId: number | undefined; // Идентификатор доски
  handleSave: (task: Task) => Promise<void>; // Функция сохранения задачи
}

// Создание контекста с начальным значением undefined
export const TaskFormContext = createContext<TaskFormContextType | undefined>(undefined);

/*
Предложения по улучшению:
1. **Документация**: Добавить JSDoc для интерфейса TaskFormContextType, описывающий назначение каждого поля.
2. **Типизация**: Рассмотреть добавление более строгих типов для task и boardId (например, уточнить возможные значения status и priority в Task).
*/