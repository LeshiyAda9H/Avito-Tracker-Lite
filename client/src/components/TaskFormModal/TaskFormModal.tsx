import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import { Task, Board, User } from '../../data/taskFormData';
import { fetchBoards, fetchUsers } from '../../api/api';
import { toDisplayStatus, toServerStatus, DisplayStatus } from '../../utils/statusMapping';
import { modalStyle, formStyle, buttonContainerStyle, goToBoardButtonStyle } from './styles';

// Интерфейс пропсов для компонента модального окна формы задачи
interface TaskFormModalProps {
  open: boolean; // Флаг открытия модального окна
  onClose: () => void; // Callback для закрытия модального окна
  task?: Task | null; // Данные задачи для редактирования (опционально)
  boardId?: number; // Идентификатор доски (опционально)
  onSave: (task: Task) => void; // Callback для сохранения задачи
}

// Компонент модального окна для создания или редактирования задачи
export default function TaskFormModal({ open, onClose, task, boardId, onSave }: TaskFormModalProps) {
  // Флаг режима редактирования (true, если задача передана)
  const isEditMode = !!task;
  // Получение текущего пути и функции навигации
  const location = useLocation();
  const navigate = useNavigate();

  // Получение черновика формы из localStorage
  const getDraft = (): Task | null => {
    const draft = localStorage.getItem('taskFormDraft');
    return draft ? JSON.parse(draft) : null;
  };

  // Инициализация состояния формы данными задачи, черновика или начальными значениями
  const [formData, setFormData] = useState<Task>(() => {
    if (task) return { ...task };

    const draft = getDraft();

    if (draft && !boardId) return draft;

    return {
      id: 0,
      title: '',
      description: '',
      boardId: boardId || 0,
      priority: 'Medium',
      status: 'Backlog',
      assignee: { id: 0, fullName: '' },
    };
  });

  // Состояния для данных досок, пользователей и загрузки
  const [boards, setBoards] = useState<Board[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Сохранение черновика формы в localStorage при изменении данных
  useEffect(() => {
    if (open && !isEditMode && !boardId) {
      localStorage.setItem('taskFormDraft', JSON.stringify(formData));
    }
  }, [formData, open, isEditMode, boardId]);

  // Очистка черновика из localStorage
  const clearDraft = () => {
    localStorage.removeItem('taskFormDraft');
  };

  // Загрузка данных о досках и пользователях при открытии модального окна
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [fetchedBoards, fetchedUsers] = await Promise.all([
          fetchBoards(),
          fetchUsers(),
        ]);
        setBoards(fetchedBoards);
        setUsers(fetchedUsers);

        if (boardId) {
          const board = fetchedBoards.find((b) => b.id === boardId);
          if (board) {
            setFormData((prev) => ({
              ...prev,
              boardId: board.id,
              boardName: board.name,
            }));
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        setBoards([]);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (open) loadData();
  }, [open, boardId]);

  // Обновление данных формы при изменении задачи или boardId
  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      const draft = getDraft();
      if (draft && !boardId) {
        setFormData(draft);
      } else {
        setFormData({
          id: 0,
          title: '',
          description: '',
          boardId: boardId || 0,
          priority: 'Medium',
          status: 'Backlog',
          assignee: { id: 0, fullName: '' },
        });
      }
    }
  }, [task, boardId]);

  // Обработчик изменения полей формы
  const handleChange = (field: keyof Task, value: string | number | Task['assignee']) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Обработчик отправки формы
  const handleSubmit = () => {
    const newTask: Task = {
      ...formData,
      id: formData.id || 0,
      status: formData.status,
    };

    onSave(newTask);
    clearDraft();
    onClose();
  };

  // Переход на страницу доски
  const handleGoToBoard = () => {
    if (formData.boardId) {
      navigate(`/board/${formData.boardId}`);
      onClose();
    }
  };

  // Обработчик закрытия модального окна
  const handleClose = () => {
    if (isEditMode) clearDraft();
    onClose();
  };

  // Проверка, находится ли пользователь на странице /issues
  const isOnIssuesPage = location.pathname === '/issues';
  // Показ кнопки "Перейти на доску" только в режиме редактирования на странице /issues
  const showGoToBoardButton = isEditMode && isOnIssuesPage && formData.boardId;
  // Блокировка селектора доски при редактировании на /issues или если boardId передан
  const isBoardSelectorDisabled = (isOnIssuesPage && isEditMode) || !!boardId;

  // Рендеринг состояния загрузки
  if (isLoading) {
    return (
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography>Загрузка...</Typography>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          {isEditMode ? 'Редактирование задачи' : 'Создание задачи'}
        </Typography>
        <Box sx={formStyle}>
          {/* Поле для названия задачи */}
          <TextField
            label="Название задачи"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            fullWidth
            required
          />
          {/* Поле для описания задачи */}
          <TextField
            label="Описание задачи"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            multiline
            rows={4}
            fullWidth
            required
          />
          {/* Селектор проекта */}
          <FormControl fullWidth>
            <InputLabel>Проект</InputLabel>
            <Select
              value={formData.boardId || ''}
              onChange={(e) => handleChange('boardId', Number(e.target.value))}
              label="Проект"
              disabled={isBoardSelectorDisabled}
              required
            >
              {boards.length === 0 ? (
                <MenuItem value="" disabled>
                  Нет доступных проектов
                </MenuItem>
              ) : (
                boards.map((board) => (
                  <MenuItem key={board.id} value={board.id}>
                    {board.name}
                  </MenuItem>
                ))
              )}
            </Select>
            {isOnIssuesPage && isEditMode && (
              <Typography variant="caption" color="textSecondary">
                Изменение проекта недоступно при редактировании, сервер не обрабатывает 😕
              </Typography>
            )}
          </FormControl>
          {/* Селектор приоритета */}
          <FormControl fullWidth>
            <InputLabel>Приоритет</InputLabel>
            <Select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              label="Приоритет"
            >
              {['Low', 'Medium', 'High'].map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Селектор статуса */}
          <FormControl fullWidth>
            <InputLabel>Статус</InputLabel>
            <Select
              value={toDisplayStatus(formData.status)}
              onChange={(e) => {
                const displayStatus = e.target.value as DisplayStatus;
                handleChange('status', toServerStatus(displayStatus));
              }}
              label="Статус"
            >
              {(['To do', 'In progress', 'Done'] as DisplayStatus[]).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Селектор исполнителя */}
          <FormControl fullWidth>
            <InputLabel>Исполнитель</InputLabel>
            <Select
              value={formData.assignee.id || ''}
              onChange={(e) => {
                const selectedUser = users.find((user) => user.id === Number(e.target.value));
                if (selectedUser) {
                  handleChange('assignee', selectedUser);
                }
              }}
              label="Исполнитель"
              required
            >
              {users.length === 0 ? (
                <MenuItem value="" disabled>
                  Нет доступных пользователей
                </MenuItem>
              ) : (
                users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.fullName}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          {/* Кнопки управления */}
          <Box sx={{ ...buttonContainerStyle, justifyContent: showGoToBoardButton ? 'space-between' : 'center' }}>
            {showGoToBoardButton ? (
              <Button
                variant="outlined"
                onClick={handleGoToBoard}
                sx={goToBoardButtonStyle}
              >
                Перейти на доску
              </Button>
            ) : null}
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!formData.title || !formData.description || !formData.boardId || !formData.assignee.id}
            >
              {isEditMode ? 'Обновить' : 'Создать'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

/*
Предложения по улучшению:
1. **Валидация формы**: Добавить клиентскую валидацию (например, с помощью библиотеки Yup или Formik) для более точной проверки полей.
2. **Дебансинг сохранения черновика**: Использовать debounce для сохранения черновика в localStorage, чтобы уменьшить количество операций.
3. **Обработка ошибок**: Добавить уведомления через toast для ошибок загрузки данных (boards/users).
4. **Локализация**: Вынести строки (например, "Создание задачи") в файл локализации.
5. **Производительность**: Использовать useMemo для списков приоритетов и статусов, чтобы избежать лишних рендеров.
*/