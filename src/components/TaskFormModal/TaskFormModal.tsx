import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import { Task, priorities, statuses, executors, boards } from '../../data/taskFormData';
import { modalStyle, formStyle, buttonContainerStyle, goToBoardButtonStyle } from './styles';

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
  boardId?: string;
  onSave: (task: Task) => void;
}

function TaskFormModal({ open, onClose, task, boardId, onSave }: TaskFormModalProps) {
  const isEditMode = !!task;
  const location = useLocation(); // Получаем текущий путь
  const navigate = useNavigate(); // Для перехода на страницу доски
  const [formData, setFormData] = useState<Task>(
    task || {
      id: '',
      title: '',
      description: '',
      boardId: boardId || '',
      priority: 'Средний',
      status: 'To Do',
      executor: '',
    }
  );

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({
        id: '',
        title: '',
        description: '',
        boardId: boardId || '',
        priority: 'Средний',
        status: 'To Do',
        executor: '',
      });
    }
  }, [task, boardId]);

  const handleChange = (field: keyof Task, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const newTask = {
      ...formData,
      id: formData.id || `task-${Date.now()}`,
    };
    onSave(newTask);
    onClose();
  };

  const handleGoToBoard = () => {
    if (formData.boardId) {
      navigate(`/board/${formData.boardId}`); // Переходим на страницу доски
      onClose(); // Закрываем модальное окно
    }
  };

  const isOnIssuesPage = location.pathname === '/issues'; // Проверяем, находимся ли на /issues

  return (
    <Modal open={open} onClose={onClose}>
      
      <Box sx={modalStyle}>
        
        <Typography variant="h6" gutterBottom>
          {isEditMode ? 'Редактирование задачи' : 'Создание задачи'}
        </Typography>
        
        <Box sx={formStyle}>
          
          <TextField
            label="Название задачи"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            fullWidth
          />
          
          <TextField
            label="Описание задачи"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            multiline
            rows={4}
            fullWidth
          />
          
          <FormControl fullWidth>
            <InputLabel>Проект</InputLabel>
            <Select
              value={formData.boardId}
              onChange={(e) => handleChange('boardId', e.target.value)}
              label="Проект"
              disabled={!!boardId}
            >
              {boards.map((board) => (
                <MenuItem key={board.id} value={board.id}>
                  {board.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            
            <InputLabel>Приоритет</InputLabel>
            
            <Select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              label="Приоритет"
            >
              {priorities.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </Select>

          </FormControl>
          
          <FormControl fullWidth>
            
            <InputLabel>Статус</InputLabel>
            
            <Select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              label="Статус"
            >
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
            
          </FormControl>
          
          <FormControl fullWidth>
            
            <InputLabel>Исполнитель</InputLabel>
            
            <Select
              value={formData.executor}
              onChange={(e) => handleChange('executor', e.target.value)}
              label="Исполнитель"
            >
              {executors.map((executor) => (
                <MenuItem key={executor} value={executor}>
                  {executor}
                </MenuItem>
              ))}
            </Select>

          </FormControl>
          
          <Box sx={buttonContainerStyle}>
            {isOnIssuesPage && formData.boardId && (
              <Button
                variant="outlined"
                onClick={handleGoToBoard}
                sx={goToBoardButtonStyle}
              >
                Перейти на доску
              </Button>
            )}
            
            <Button variant="contained" onClick={handleSubmit}>
              {isEditMode ? 'Обновить' : 'Создать'}
            </Button>
            
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default TaskFormModal;