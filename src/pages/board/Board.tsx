import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent } from '@mui/material';
import { fetchTasksOnBoard, updateTaskStatus, fetchBoards } from '../../api/api';
import { useTaskForm } from '../../hooks/useTaskForm';
import { Task, type Board } from '../../data/taskFormData';
import { containerStyle, boardStyle, columnStyle, droppableStyle, cardStyle } from './styles';

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface BoardData {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: string[];
}

export default function Board() {
  
  const { boardId: boardIdParam } = useParams<{ boardId: string }>();
  const boardId = boardIdParam ? parseInt(boardIdParam, 10) : 0;
  const { openModal } = useTaskForm();
  const [data, setData] = useState<BoardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [board, setBoard] = useState<Board | null>(null);

  useEffect(() => {
    
    const abortController = new AbortController();

    const loadBoardData = async () => {
      
      if (!boardId) {
        setError('Неверный ID доски');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const fetchedBoards = await fetchBoards();
        const currentBoard = fetchedBoards.find((b) => b.id === boardId);
        
        if (currentBoard) {
          setBoard(currentBoard);
        }
      } 
      catch (err) {
        
        if (!abortController.signal.aborted) {
          console.error('Ошибка при загрузке данных доски:', err);
        }
      }
    };

    loadBoardData();

    return () => {
      abortController.abort();
    };
  }, [boardId]);

  useEffect(() => {
    
    const abortController = new AbortController();

    const loadTasks = async () => {
      
      if (!boardId) {
        setError('Неверный ID доски');
        setIsLoading(false);
        return;
      }

      try {
        
        setIsLoading(true);
        setError(null);
        
        const tasks = await fetchTasksOnBoard(boardId);
        if (abortController.signal.aborted) return;


        const tasksMap = tasks.reduce((acc, task) => {
          
          acc[task.id.toString()] = task;
          return acc;

        }, {} as { [key: string]: Task });


        const columns: { [key: string]: Column } = {
          
          Backlog: { id: 'Backlog', title: 'To do', taskIds: [] },
          InProgress: { id: 'InProgress', title: 'In progress', taskIds: [] },
          Done: { id: 'Done', title: 'Done', taskIds: [] },
        };

        tasks.forEach((task) => {
          
          const statusKey = task.status;
          
          if (columns[statusKey]) {
            columns[statusKey].taskIds.push(task.id.toString());
          }
        });

        setData({
          tasks: tasksMap,
          columns,
          columnOrder: ['Backlog', 'InProgress', 'Done'],
        });
      } 
      catch (err) {
        
        if (!abortController.signal.aborted) {
          console.error('Ошибка при загрузке задач:', err);
          setError('Не удалось загрузить задачи. Попробуйте снова позже.');
        }
      } 
      finally {
        
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadTasks();

    return () => {
      abortController.abort();
    };

  }, [boardId]);

  const onDragEnd = async (result: DropResult) => {
    
    if (!data) return;

    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      
      const newTaskIds = Array.from(start.taskIds);
      
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      setData({
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      });
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const task = data.tasks[draggableId];
    const newStatus = finish.id as Task['status'];

    try {
      
      await updateTaskStatus(task.id, newStatus);
      
      setData({
        ...data,
        tasks: {
          ...data.tasks,
          [task.id]: { ...task, status: newStatus },
        },
        columns: {
          ...data.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      });
    } 
    catch (err) {
      console.error('Ошибка при обновлении статуса задачи:', err);
      setError('Не удалось обновить статус задачи.');
    }
  };

  const handleTaskClick = (task: Task) => {
    openModal(task, boardId);
  };

  if (isLoading) {
    return (
      <Container sx={containerStyle}>
        
        <Typography variant="h4" gutterBottom>
          {board ? board.name : `Проект ${boardId}`}
        </Typography>
        
        <Typography>Загрузка...</Typography>

      </Container>
    );
  }

  if (error || !data) {
    return (
      <Container sx={containerStyle}>
        
        <Typography variant="h4" gutterBottom>
          {board ? board.name : `Проект ${boardId}`}
        </Typography>
        
        <Typography color="error">{error || 'Данные не найдены'}</Typography>

      </Container>
    );
  }

  return (
    <Container sx={containerStyle}>
      
      <Typography variant="h4" gutterBottom>
        {board ? board.name : `Проект ${boardId}`}
      </Typography>
      
      <DragDropContext onDragEnd={onDragEnd}>
        
        <Box sx={boardStyle}>
          {data.columnOrder.map((columnId) => {
            
            const column = data.columns[columnId];
            const tasks = column.taskIds
              .map((taskId) => data.tasks[taskId])
              .filter((task): task is Task => task !== undefined);

            return (
              <Box key={column.id} sx={columnStyle}>
                
                <Typography variant="h6" gutterBottom>
                  {column.title}
                </Typography>
                
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={droppableStyle}
                    >
                      {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(provided) => (
                            
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={cardStyle}
                              onClick={() => handleTaskClick(task)}
                            >
                              <CardContent>
                                <Typography>{task.title}</Typography>
                              </CardContent>

                            </Card>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Box>
            );
          })}
        </Box>
      </DragDropContext>
    </Container>
  );
}