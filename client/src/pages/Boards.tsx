import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { fetchBoards } from '../api/api';
import { Board } from '../data/taskFormData';

// Компонент для отображения списка досок
export default function Boards() {
  // Состояние для данных о досках
  const [boards, setBoards] = useState<Board[]>([]);
  // Состояние загрузки
  const [isLoading, setIsLoading] = useState(true);
  // Состояние ошибки
  const [error, setError] = useState<string | null>(null);

  // Загрузка досок при монтировании с поддержкой прерывания
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
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.error('Ошибка при загрузке досок:', err);
          setError('Не удалось загрузить проекты. Попробуйте снова позже.');
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };
    loadBoards();

    // Очистка: прерывание запроса при размонтировании
    return () => {
      abortController.abort();
    };
  }, []);

  // Рендеринг состояния загрузки
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

  // Рендеринг состояния ошибки
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

  // Рендеринг успешного состояния
  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Проекты
      </Typography>
      {boards.length === 0 ? (
        <Typography>Проекты не найдены.</Typography>
      ) : (
        boards.map((board) => (
          // Карточка для каждой доски
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

/*
Предложения по улучшению:
1. **Управление данными**: Использовать React Query для кэширования и управления состояниями загрузки.
2. **Локализация**: Вынести строки (например, "Проекты") в файл локализации.
3. **Пагинация**: Добавить пагинацию или бесконечную прокрутку для больших списков досок.
*/