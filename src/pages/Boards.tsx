import { Card, CardContent, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

// Временные статические данные (позже заменю на данные с API)
const projects = [
  { id: 1, title: 'Проект 1' },
  { id: 2, title: 'Проект 2' },
  { id: 3, title: 'Проект 3' },
];

function Boards() {
  return (
    <Container sx={{ marginTop: 4 }}>
      
      <Typography variant="h4" gutterBottom>
        Проекты
      </Typography>
      
      {projects.map((project) => (
        
        <Card key={project.id} sx={{ marginBottom: 2 }}>
          
          <CardContent>
            
            <Typography variant="h6">{project.title}</Typography>
            
            <Button
              variant="contained"
              component={Link}
              to={`/board/${project.id}`}
              sx={{ marginTop: 1 }}
            >
              Перейти к доске
            </Button>

          </CardContent>

        </Card>

      ))}
    </Container>
  );
}

export default Boards;