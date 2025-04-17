import { useState } from 'react';
import { Container, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Card, CardContent, Button, Box } from '@mui/material';
import { initialIssues, boards } from './data';
import { containerStyle, filtersStyle, cardStyle, createButtonStyle, emptyStateStyle } from './styles';
import { useTaskForm } from '../../hooks/useTaskForm';
import { Task } from '../../data/taskFormData';

export default function Issues() {
  const [search, setSearch] = useState(''); // Поиск по названию проекта
  const [executorSearch, setExecutorSearch] = useState(''); // Поиск по исполнителю
  const [statusFilter, setStatusFilter] = useState('All'); // Фильтр по статусу
  const [boardFilter, setBoardFilter] = useState('All'); // Фильтр по доске
  const { openModal } = useTaskForm();

  // Функция для фильтрации задач
  const filteredIssues = initialIssues.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(search.toLowerCase());
    const matchesExecutor = issue.executor.toLowerCase().includes(executorSearch.toLowerCase());
    const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
    const matchesBoard = boardFilter === 'All' || issue.boardId === boardFilter;
    return matchesSearch && matchesExecutor && matchesStatus && matchesBoard;
  });

  const handleIssueClick = (task: Task) => {
    openModal(task); // Открываем форму для редактирования
  };

  return (
    <Container sx={containerStyle}>
      
      <Typography variant="h4" gutterBottom>
        Все задачи
      </Typography>

      
      <Box sx={filtersStyle}>
        
        {/* Поиск */}
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

        {/* Фильтры */}
        <FormControl sx={{ width: 200 }}>

          <InputLabel>Статус</InputLabel>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Статус"
          >
            <MenuItem value="All">Все</MenuItem>
            <MenuItem value="To Do">To Do</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>

          </Select>

        </FormControl>


        <FormControl sx={{ width: 200 }}>
          
          <InputLabel>Доска</InputLabel>
          
          <Select
            value={boardFilter}
            onChange={(e) => setBoardFilter(e.target.value)}
            label="Доска"
          >
            {boards.map((board) => (
              <MenuItem key={board.id} value={board.id}>
                {board.title}
              </MenuItem>
            ))}

          </Select>

        </FormControl>
      </Box>
      
      {/* Список задач */}
      {filteredIssues.length === 0 ? (
        <Box sx={emptyStateStyle}>
          
          <Typography>Задачи не найдены</Typography>
          
          <Button
            variant="contained"
            onClick={() => openModal()}
            sx={{ marginTop: 2 }}
          >
            Создать задачу
          </Button>

        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {filteredIssues.map((issue) => (
            <Card
              key={issue.id}
              sx={cardStyle}
              onClick={() => handleIssueClick(issue)}
            >
              <CardContent>
                <Typography variant="h6">{issue.title}</Typography>
                <Typography color="textSecondary">Статус: {issue.status}</Typography>
                <Typography color="textSecondary">Доска: Проект {issue.boardId}</Typography>
                <Typography color="textSecondary">Исполнитель: {issue.executor}</Typography>
              </CardContent>

            </Card>
          ))}

          <Button
            variant="contained"
            onClick={() => openModal()}
            sx={createButtonStyle}
          >
            Создать задачу
          </Button>

        </Box>
      )}
    </Container>
  );
}