import { SxProps, Theme } from '@mui/material';

// Стили для основного контейнера страницы задач
export const containerStyle: SxProps<Theme> = {
  padding: 3, // Внутренние отступы контейнера
  flexGrow: 1, // Растягивание контейнера для заполнения доступного пространства
};

// Стили для контейнера фильтров
export const filtersStyle: SxProps<Theme> = {
  display: 'flex', // Флекс-контейнер для горизонтального расположения фильтров
  gap: 2, // Отступ между полями фильтров
  marginBottom: 3, // Отступ снизу для отделения от списка задач
};

// Стили для карточки задачи
export const cardStyle: SxProps<Theme> = {
  cursor: 'pointer', // Курсор указателя для интерактивности
  '&:hover': {
    backgroundColor: '#f5f5f5', // Цвет фона при наведении
  },
};

// Стили для кнопки создания задачи
export const createButtonStyle: SxProps<Theme> = {
  alignSelf: 'flex-end', // Выравнивание кнопки по правому краю
  marginTop: 2, // Отступ сверху
};

// Стили для состояния пустого списка задач
export const emptyStateStyle: SxProps<Theme> = {
  display: 'flex', // Флекс-контейнер для центрирования содержимого
  flexDirection: 'column', // Вертикальное расположение элементов
  alignItems: 'center', // Центрирование по горизонтали
  justifyContent: 'center', // Центрирование по вертикали
  height: '50vh', // Высота для заполнения половины экрана
};

/*
Предложения по улучшению:
1. **Адаптивность**: Добавить responsive значения для padding и gap (например, padding: { xs: 2, sm: 3 }).
2. **Темы**: Использовать theme-переменные для цветов и отступов (например, theme.spacing(2)).
3. **Доступность**: Добавить стили для фокуса в cardStyle (например, outline при :focus).
4. **Константы**: Вынести повторяющиеся значения (например, gap: 2) в константы для унификации.
*/