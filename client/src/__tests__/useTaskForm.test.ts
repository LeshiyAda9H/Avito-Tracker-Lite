import { renderHook, act } from '@testing-library/react';
import { TaskFormProvider, useTaskForm } from '../context/TaskFormContext';

describe('useTaskForm', () => {
  it('открывает и закрывает модальное окно', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TaskFormProvider>{children}</TaskFormProvider>
    );
    const { result } = renderHook(() => useTaskForm(), { wrapper });

    act(() => {
      result.current.openModal();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.closeModal();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('выбрасывает ошибку вне TaskFormProvider', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useTaskForm())).toThrow('useTaskForm must be used within a TaskFormProvider');
    jest.spyOn(console, 'error').mockRestore();
  });
});