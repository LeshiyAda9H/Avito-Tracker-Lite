import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Header';
import { TaskFormProvider, useTaskForm } from '../context/TaskFormContext';

jest.mock('../context/TaskFormContext');

describe('Header', () => {
  beforeEach(() => {
    (useTaskForm as jest.Mock).mockReturnValue({
      openModal: jest.fn(),
      closeModal: jest.fn(),
      isOpen: false,
      selectedTask: null,
      boardId: undefined,
      handleSave: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('рендерит навигационные кнопки', () => {
    render(
      <MemoryRouter>
        <TaskFormProvider>
          <Header />
        </TaskFormProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Все задачи')).toBeInTheDocument();
    expect(screen.getByText('Проекты')).toBeInTheDocument();
    expect(screen.getByText('Создать задачу')).toBeInTheDocument();
  });

  it('открывает модальное окно при клике на "Создать задачу"', () => {
    const mockOpenModal = jest.fn();
    (useTaskForm as jest.Mock).mockReturnValue({
      openModal: mockOpenModal,
      closeModal: jest.fn(),
      isOpen: false,
      selectedTask: null,
      boardId: undefined,
      handleSave: jest.fn(),
    });

    render(
      <MemoryRouter>
        <TaskFormProvider>
          <Header />
        </TaskFormProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Создать задачу'));
    expect(mockOpenModal).toHaveBeenCalled();
  });
});