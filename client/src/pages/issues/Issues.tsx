import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { InputLabel, Container, Typography, TextField, Select, MenuItem, FormControl, Card, CardContent, Box, Button, Fab } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useTaskForm } from '../../hooks/useTaskForm';
import { Task } from '../../data/taskFormData';
import { fetchAllTasks, fetchAllBoards, RootState, ThunkAppDispatch } from '../../store';
import { toDisplayStatus } from '../../utils/statusMapping';
import { containerStyle, filtersStyle, cardStyle, emptyStateStyle, createButtonStyle } from './styles';

// Компонент для отображения и фильтрации всех задач
export default function Issues() {
  // Состояния для фильтров и поиска
  const [search, setSearch] = useState('');
  const [executorSearch, setExecutorSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | 'All'>('All');
  const [boardFilter, setBoardFilter] = useState<number | 'All'>('All');
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const dispatch = useDispatch<ThunkAppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const boards = useSelector((state: RootState) => state.tasks.boards);
  const isLoading = useSelector((state: RootState) => state.tasks.isLoading);
  const error = useSelector((state: RootState) => state.tasks.error);
  const { openModal } = useTaskForm();

  // Загрузка задач и досок при монтировании
  useEffect(() => {
    dispatch(fetchAllTasks());
    dispatch(fetchAllBoards());
  }, [dispatch]);

  // Показ/скрытие кнопки "Наверх" в зависимости от прокрутки
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Фильтрация задач на основе критериев поиска и фильтров
  const filteredIssues = tasks.filter((issue) => {
    const matchesSearch = issue.title?.toLowerCase().includes(search.toLowerCase()) ?? false;
    const matchesExecutor = issue.assignee?.fullName?.toLowerCase().includes(executorSearch.toLowerCase()) ?? false;
    const matchesStatus = statusFilter === 'All' || toDisplayStatus(issue.status) === statusFilter;
    const matchesBoard = boardFilter === 'All' || issue.boardId === boardFilter;
    return matchesSearch && matchesExecutor && matchesStatus && matchesBoard;
  });

  // Открытие модального окна задачи при клике
  const handleIssueClick = (task: Task) => {
    openModal(task, undefined);
  };

  // Прокрутка наверх с плавной анимацией
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Рендеринг состояния загрузки
  if (isLoading && tasks.length === 0) {
    return (
      <Container sx={containerStyle}>
        <Typography>Загрузка...</Typography>
      </Container>
    );
  }

  // Рендеринг состояния ошибки
  if (error) {
    return (
      <Container sx={containerStyle}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  // Рендеринг успешного состояния с фильтрами и списком задач
  return (
    <Container sx={containerStyle}>
      <Typography variant="h4" gutterBottom>
        Все задачи
      </Typography>
      <Box sx={filtersStyle}>
        <TextField
          label="Поиск по названию"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1 }}
        />
        <TextField
          label="Поиск по исполнителю"
          variant="outlined"
          value={executorSearch}
          onChange={(e) => setExecutorSearch(e.target.value)}
          sx={{ flex: 1 }}
        />
        <FormControl sx={{ width: 200 }}>
          <InputLabel>Статус</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Статус"
          >
            <MenuItem value="All">Все</MenuItem>
            <MenuItem value="To do">To do</MenuItem>
            <MenuItem value="In progress">In progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ width: 200 }}>
          <InputLabel>Доска</InputLabel>
          <Select
            value={boardFilter}
            onChange={(e) => setBoardFilter(e.target.value as number | 'All')}
            label="Доска"
          >
            <MenuItem value="All">Все</MenuItem>
            {boards.map((board) => (
              <MenuItem key={board.id} value={board.id}>
                {board.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {filteredIssues.length === 0 ? (
        <Box sx={emptyStateStyle}>
          <Typography>Задачи не найдены</Typography>
          <Button
            variant="contained"
            onClick={() => openModal(undefined, undefined)}
            sx={{ marginTop: 2 }}
          >
            Создать задачу
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {filteredIssues.map((issue) => (
            <Card key={issue.id} sx={cardStyle} onClick={() => handleIssueClick(issue)}>
              <CardContent>
                <Typography variant="h6">{issue.title ?? 'Без названия'}</Typography>
                <Typography color="textSecondary">Статус: {toDisplayStatus(issue.status)}</Typography>
                <Typography color="textSecondary">Доска: {issue.boardName || `Проект ${issue.boardId}`}</Typography>
                <Typography color="textSecondary">Исполнитель: {issue.assignee?.fullName ?? 'Не назначен'}</Typography>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="contained"
            onClick={() => openModal(undefined, undefined)}
            sx={createButtonStyle}
          >
            Создать задачу
          </Button>
        </Box>
      )}
      {showScrollToTop && (
        <Fab
          color="primary"
          aria-label="scroll to top"
          onClick={scrollToTop}
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          <ArrowUpwardIcon />
        </Fab>
      )}
    </Container>
  );
}

/*
Предложения по улучшению:
1. **Дебансинг**: Добавить дебансинг для полей поиска, чтобы уменьшить количество вызовов фильтрации.
2. **Локализация**: Вынести строки в систему локализации.
3. **Виртуализация**: Использовать виртуализированный список (например, react-virtualized) для больших списков задач.
*/