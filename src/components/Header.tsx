import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Header() {
  const handleCreateTask = () => {
    console.log('Открыть форму создания задачи');
  };

  return (
    <AppBar position="static">
      
      <Toolbar>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Avito Tracker Lite
        </Typography>
        
        <Button color="inherit" component={Link} to="/boards">
          Проекты
        </Button>
        
        <Button color="inherit" component={Link} to="/issues">
          Все задачи
        </Button>
        
        <Button color="inherit" onClick={handleCreateTask}>
          Создать задачу
        </Button>

      </Toolbar>
      
    </AppBar>
  );
}

export default Header;