import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, Box, Card, CardContent } from '@mui/material';
import { useTaskForm } from '../../hooks/useTaskForm';
import { Task, type Board } from '../../data/taskFormData';
import { fetchAllBoards, fetchBoardTasks, updateTaskStatusAsync, RootState, ThunkAppDispatch, selectBoardTasksById } from '../../store';
import { containerStyle, boardStyle, columnStyle, droppableStyle, cardStyle } from './styles';
import { toDisplayStatus, toServerStatus, DisplayStatus } from '../../utils/statusMapping';

interface Column {
  id: DisplayStatus;
  title: string;
  taskIds: string[];
}

interface BoardData {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: DisplayStatus[];
}

export default function Board() {
  const { boardId: boardIdParam } = useParams<{ boardId: string }>();
  const boardId = boardIdParam ? parseInt(boardIdParam, 10) : 0;
  const dispatch = useDispatch<ThunkAppDispatch>();
  const { openModal } = useTaskForm();

  const boards = useSelector((state: RootState) => state.tasks.boards);
  const boardTasks = useSelector((state: RootState) => selectBoardTasksById(state, boardId));
  const isLoading = useSelector((state: RootState) => state.tasks.isLoading);
  const error = useSelector((state: RootState) => state.tasks.error);

  const board = boards.find((b) => b.id === boardId) || null;
  const [data, setData] = useState<BoardData | null>(null);

  useEffect(() => {
    
    dispatch(fetchAllBoards());
    
    if (boardId) {
      dispatch(fetchBoardTasks(boardId));
    }
  }, [boardId, dispatch]);

  useEffect(() => {
    
    if (boardTasks.length) {
      
      const tasksMap = boardTasks.reduce((acc, task) => {
        
        acc[task.id.toString()] = task;
        return acc;

      }, {} as { [key: string]: Task });

      const columns: { [key: string]: Column } = {
        'To do': { id: 'To do', title: 'To do', taskIds: [] },
        'In progress': { id: 'In progress', title: 'In progress', taskIds: [] },
        Done: { id: 'Done', title: 'Done', taskIds: [] },
      };

      boardTasks.forEach((task) => {
        
        const displayStatus = toDisplayStatus(task.status);
        
        if (columns[displayStatus]) {
          columns[displayStatus].taskIds.push(task.id.toString());
        }
      });

      setData({
        tasks: tasksMap,
        columns,
        columnOrder: ['To do', 'In progress', 'Done'],
      });
    }
  }, [boardTasks]);

  const onDragEnd = async (result: DropResult) => {
    if (!data) return;

    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const start = data.columns[source.droppableId as DisplayStatus];
    const finish = data.columns[destination.droppableId as DisplayStatus];

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
    const newStatus = toServerStatus(finish.id); // Преобразуем статус в ServerStatus

    try {
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

      await dispatch(updateTaskStatusAsync(task.id, newStatus, boardId));

    } 
    catch (err) {
      console.error('Ошибка при обновлении статуса задачи:', err);
      dispatch(fetchBoardTasks(boardId));
    }
  };

  const handleTaskClick = (task: Task) => {
    openModal(task, Number(boardId));
  };

  if (isLoading && !data) {
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
                                <Typography>{task.title ?? 'Без названия'}</Typography>
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