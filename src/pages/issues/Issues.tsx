import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Card, CardContent, Button, Box } from '@mui/material';
import { useTaskForm } from '../../hooks/useTaskForm';
import { Task, Board } from '../../data/taskFormData';
import { fetchTasks, fetchBoards } from '../../api/api';
import { toDisplayStatus } from '../../utils/statusMapping';
import { containerStyle, filtersStyle, cardStyle, createButtonStyle, emptyStateStyle } from './styles';

export default function Issues() {
  
  const [search, setSearch] = useState('');
  const [executorSearch, setExecutorSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | 'All'>('All');
  const [boardFilter, setBoardFilter] = useState<number | 'All'>('All');
  
  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    select: (data) => data.filter((task): task is Task => task !== undefined && typeof task.id === 'number'),
  });

  const { data: boards = [], isLoading: isLoadingBoards } = useQuery({
    queryKey: ['boards'],
    queryFn: fetchBoards,
    select: (data) => data.filter((board): board is Board => board !== undefined && typeof board.id === 'number'),
  });
  
  const { openModal } = useTaskForm();

  const filteredIssues = tasks.filter((issue) => {
    
    const matchesSearch = issue.title.toLowerCase().includes(search.toLowerCase());
    const matchesExecutor = issue.assignee.fullName.toLowerCase().includes(executorSearch.toLowerCase());
    const matchesStatus = statusFilter === 'All' || toDisplayStatus(issue.status) === statusFilter;
    const matchesBoard = boardFilter === 'All' || issue.boardId === boardFilter;
    
    return matchesSearch && matchesExecutor && matchesStatus && matchesBoard;
  });

  const handleIssueClick = (task: Task) => {
    openModal(task);
  };

  const isLoading = isLoadingTasks || isLoadingBoards;

  if (isLoading) {
    return (
      <Container sx={containerStyle}>
        <Typography>Загрузка...</Typography>
      </Container>
    );
  }

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
                <Typography color="textSecondary">Статус: {toDisplayStatus(issue.status)}</Typography>
                <Typography color="textSecondary">Доска: {issue.boardName || `Проект ${issue.boardId}`}</Typography>
                <Typography color="textSecondary">Исполнитель: {issue.assignee.fullName}</Typography>

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