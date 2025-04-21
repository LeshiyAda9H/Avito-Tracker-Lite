import { useContext } from 'react';
import { TaskFormContext, TaskFormContextType } from '../context/TaskFormContextDefinition';

export const useTaskForm = (): TaskFormContextType => {
  
  const context = useContext(TaskFormContext);
  
  if (!context) {
    throw new Error('useTaskForm must be used within a TaskFormProvider');
  }
  
  return context;
};