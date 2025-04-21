import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTaskForm } from '../hooks/useTaskForm';

// Компонент навигационной панели
export default function Header() {
  // Получение функции открытия модального окна из пользовательского хука
  const { openModal } = useTaskForm();

  return (
    // Статическая панель для постоянного размещения заголовка
    <AppBar position="static">
      <Toolbar>
        {/* Кнопка навигации на страницу задач */}
        <Button color="inherit" component={Link} to="/issues">
          Все задачи
        </Button>
        
        {/* Кнопка навигации на страницу проектов */}
        <Button color="inherit" component={Link} to="/boards">
          Проекты
        </Button>
        
        {/* Заполнитель для выравнивания следующей кнопки вправо */}
        <div style={{ flexGrow: 1 }} />
        
        {/* Кнопка для открытия модального окна создания задачи */}
        <Button color="inherit" onClick={() => openModal()}>
          Создать задачу
        </Button>
      </Toolbar>
    </AppBar>
  );
}

/*
Предложения по улучшению:
1. **Стилизация**: Заменить встроенный стиль (flexGrow) на проп sx от MUI для консистентности.
2. **Доступность**: Добавить атрибуты aria-label для кнопок (например, "Перейти к задачам").
3. **Адаптивность**: Рассмотреть использование меню-гамбургера для мобильных экранов с помощью MUI Drawer.
*/