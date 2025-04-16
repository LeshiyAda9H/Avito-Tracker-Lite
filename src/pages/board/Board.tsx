import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useState } from 'react';
import { Container, Typography, Box, Card, CardContent } from '@mui/material';
import { initialData } from './data';
import {
  containerStyle,
  boardStyle,
  columnStyle,
  droppableStyle,
  cardStyle,
} from './styles';

export default function Board() {
  const { id } = useParams<{ id: string }>(); // Получаем id проекта из URL
  const [data, setData] = useState(initialData);

  // Функция для обработки перетаскивания задач
  const onDragEnd = (result: DropResult) => {
    
    const { source, destination } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, result.draggableId);

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
    finishTaskIds.splice(destination.index, 0, result.draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    });
  };

  return (
    <Container sx={containerStyle}>
      
      {/* Заголовок с названием проекта */}
      <Typography variant="h4" gutterBottom>
        Проект {id}
      </Typography>

      {/* Kanban-доска */}
      <DragDropContext onDragEnd={onDragEnd}>
        
        <Box sx={boardStyle}>
          
          {data.columnOrder.map((columnId) => {
            
            const column = data.columns[columnId];
            const tasks = column.taskIds
              .map((taskId) => data.tasks[taskId])
              .filter((task): task is { id: string; content: string } => task !== undefined);

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
                        
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={cardStyle}
                            >
                              <CardContent>
                                <Typography>{task.content}</Typography>
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