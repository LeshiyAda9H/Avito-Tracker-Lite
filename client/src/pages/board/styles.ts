import { SxProps, Theme } from '@mui/material';

// Стили для основного контейнера страницы доски
export const containerStyle: SxProps<Theme> = {
  marginTop: 4, // Отступ сверху для отделения от заголовка
};

// Стили для контейнера доски (группы колонок)
export const boardStyle: SxProps<Theme> = {
  display: 'flex', // Флекс-контейнер для горизонтального расположения колонок
  gap: 2, // Отступ между колонками
};

// Стили для каждой колонки задач
export const columnStyle: SxProps<Theme> = {
  width: 300, // Фиксированная ширина колонки
};

// Стили для области перетаскивания задач (Droppable)
export const droppableStyle: SxProps<Theme> = {
  backgroundColor: '#f0f0f0', // Фоновый цвет области
  padding: 2, // Внутренние отступы
  minHeight: 200, // Минимальная высота для пустых колонок
};

// Стили для карточки задачи
export const cardStyle: SxProps<Theme> = {
  marginBottom: 1, // Отступ снизу для разделения карточек
};

/*
Предложения по улучшению:
1. **Адаптивность**: Добавить responsive значения для width в columnStyle (например, width: { xs: '100%', sm: 300 }).
2. **Темы**: Использовать theme-переменные для цветов и отступов (например, theme.palette.grey[100]).
3. **Интерактивность**: Добавить стили для состояния перетаскивания в droppableStyle (например, :hover или active).
4. **Константы**: Вынести магические числа (например, width: 300, minHeight: 200) в константы.
*/