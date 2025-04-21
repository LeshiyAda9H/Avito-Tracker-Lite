import { render, screen, fireEvent } from '@testing-library/react';
import TaskFormModal from '../components/TaskFormModal/TaskFormModal';

describe('TaskFormModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  it('рендерит форму создания задачи', () => {
    render(<TaskFormModal open={true} onClose={mockOnClose} onSave={mockOnSave} />);
    expect(screen.getByText('Создание задачи')).toBeInTheDocument();
    expect(screen.getByLabelText('Название задачи')).toBeInTheDocument();
    expect(screen.getByLabelText('Описание задачи')).toBeInTheDocument();
  });

  it('вызывает onSave при отправке формы', () => {
    render(<TaskFormModal open={true} onClose={mockOnClose} onSave={mockOnSave} />);
    fireEvent.change(screen.getByLabelText('Название задачи'), { target: { value: 'Новая задача' } });
    fireEvent.change(screen.getByLabelText('Описание задачи'), { target: { value: 'Описание' } });
    fireEvent.click(screen.getByText('Создать'));
    expect(mockOnSave).toHaveBeenCalled();
  });

  it('не позволяет отправить форму без обязательных полей', () => {
    render(<TaskFormModal open={true} onClose={mockOnClose} onSave={mockOnSave} />);
    const createButton = screen.getByText('Создать');
    expect(createButton).toBeDisabled();
  });
});