import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTaskForm } from '../hooks/useTaskForm';

export default function Header() {
  
  const { openModal } = useTaskForm();

  return (
    <AppBar position="static">
      
      <Toolbar>
        
        <Button color="inherit" component={Link} to="/issues">
          Все задачи
        </Button>
        
        <Button color="inherit" component={Link} to="/boards">
          Проекты
        </Button>
        
        <div style={{ flexGrow: 1 }} />
        
        <Button color="inherit" onClick={() => openModal()}>
          Создать задачу
        </Button>

      </Toolbar>
      
    </AppBar>
  );
}