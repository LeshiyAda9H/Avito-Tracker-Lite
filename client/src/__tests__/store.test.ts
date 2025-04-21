import { taskSlice, addTask } from '../store';
import { Task } from '../data/taskFormData';

describe('taskSlice', () => {
  it('добавляет задачу в состояние', () => {
    const initialState = { tasks: [], boards: [], boardTasks: {}, isLoading: false, error: null };
    const newTask: Task = {
      id: 1,
      title: 'Новая задача',
      description: 'Описание',
      boardId: 1,
      priority: 'Medium',
      status: 'Backlog',
      assignee: { id: 1, fullName: 'User' },
    };

    const newState = taskSlice.reducer(initialState, addTask(newTask));
    expect(newState.tasks).toContainEqual(newTask);
    expect(newState.boardTasks[1]).toContainEqual(newTask);
  });
});