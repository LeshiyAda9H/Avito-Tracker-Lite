import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { fetchBoards } from '../api/api';
import { Board } from '../data/taskFormData';

export default function Boards() {

  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const abortController = new AbortController();

    const loadBoards = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedBoards = await fetchBoards();
        
        if (!abortController.signal.aborted) {
          setBoards(fetchedBoards);
        }
      } 
      catch (err) {
        
        if (!abortController.signal.aborted) {
          console.error('Ошибка при загрузке досок:', err);
          setError('Не удалось загрузить проекты. Попробуйте снова позже.');
        }
      } 
      finally {
        
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };
    loadBoards();

    return () => {
      abortController.abort();
    };
  }, []);

  if (isLoading) {
    return (
      <Container sx={{ marginTop: 4 }}>
        
        <Typography variant="h4" gutterBottom>
          Проекты
        </Typography>
        
        <Typography>Загрузка...</Typography>

      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ marginTop: 4 }}>
        
        <Typography variant="h4" gutterBottom>
          Проекты
        </Typography>
        <Typography color="error">{error}</Typography>

      </Container>
    );
  }

  return (
    <Container sx={{ marginTop: 4 }}>
      
      <Typography variant="h4" gutterBottom>
        Проекты
      </Typography>
      
      {boards.length === 0 ? (
        <Typography>Проекты не найдены.</Typography>
      ) : (
        boards.map((board) => (
          <Card key={board.id} sx={{ marginBottom: 2 }}>
            
            <CardContent>
              
              <Typography variant="h6">
                Название проекта: {board.name}
              </Typography>
              
              <Typography color="textSecondary" gutterBottom>
                Описание: {board.description || 'Описание отсутствует'}
              </Typography>
              
              <Typography color="textSecondary" gutterBottom>
                Количество задач: {board.taskCount ?? 0}
              </Typography>
              
              <Button
                variant="contained"
                component={Link}
                to={`/board/${board.id}`}
                sx={{ marginTop: 1 }}
              >
                Перейти к доске
              </Button>
              
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}