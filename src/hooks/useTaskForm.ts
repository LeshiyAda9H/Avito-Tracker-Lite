import { useContext } from 'react';
import { TaskFormContext } from '../context/TaskFormContextDefinition';

export function useTaskForm() {
  const context = useContext(TaskFormContext);
  if (!context) {
    throw new Error('useTaskForm must be used within a TaskFormProvider');
  }
  return context;
}