import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Header() {
  
  const handleCreateTask = () => {
    console.log('Открыть форму создания задачи');
  };

  return (
    <AppBar position="static">
      
      <Toolbar>
        
        <Button color="inherit" component={Link} to="/issues">
          Все задачи
        </Button>
        
        <Button color="inherit" component={Link} to="/boards">
          Проекты
        </Button>
        
        <div style={{ flexGrow: 1 }} /> {/* Пространство, чтобы кнопка "Создать задачу" была справа */}
        <Button color="inherit" onClick={handleCreateTask}>
          Создать задачу
        </Button>

      </Toolbar>
      
    </AppBar>
  );
}