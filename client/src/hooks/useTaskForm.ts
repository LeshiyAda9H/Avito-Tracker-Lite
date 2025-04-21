import { useContext } from 'react';
import { TaskFormContext, TaskFormContextType } from '../context/TaskFormContextDefinition';

// Хук для получения контекста формы задачи
export const useTaskForm = (): TaskFormContextType => {
  // Получение контекста с помощью useContext
  const context = useContext(TaskFormContext);
  
  // Проверка наличия контекста, чтобы избежать использования вне провайдера
  if (!context) {
    throw new Error('useTaskForm должен использоваться внутри TaskFormProvider');
  }
  
  // Возврат значений контекста
  return context;
};

/*
Предложения по улучшению:
1. **Документация**: Добавить JSDoc для хука, описывающий его назначение и возвращаемые значения.
2. **Локализация ошибки**: Вынести сообщение об ошибке в константу или файл локализации для поддержки многоязычности.
3. **Типизация**: Убедиться, что TaskFormContextType полностью покрывает все возможные случаи использования (например, уточнить тип handleSave).
*/