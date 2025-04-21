import { SxProps, Theme } from '@mui/material';

// Стили для модального окна формы задачи
export const modalStyle: SxProps<Theme> = {
  position: 'absolute', // Абсолютное позиционирование для центрирования
  top: '50%', // Центр по вертикали
  left: '50%', // Центр по горизонтали
  transform: 'translate(-50%, -50%)', // Смещение для точного центрирования
  width: 400, // Фиксированная ширина модального окна
  bgcolor: 'background.paper', // Фоновый цвет из темы
  boxShadow: 24, // Тень для визуальной глубины
  p: 4, // Внутренние отступы
  borderRadius: 2, // Скругление углов
};

// Стили для формы внутри модального окна
export const formStyle: SxProps<Theme> = {
  display: 'flex', // Флекс-контейнер для полей формы
  flexDirection: 'column', // Вертикальное расположение элементов
  gap: 2, // Отступ между полями формы
};

// Стили для контейнера кнопок
export const buttonContainerStyle: SxProps<Theme> = {
  display: 'flex', // Флекс-контейнер для кнопок
  justifyContent: 'space-between', // Размещение кнопок по краям
  marginTop: 1, // Отступ сверху
};

// Стили для кнопки "Перейти на доску"
export const goToBoardButtonStyle: SxProps<Theme> = {
  alignSelf: 'flex-start', // Выравнивание кнопки по началу контейнера
};

/*
Предложения по улучшению:
1. **Адаптивность**: Добавить медиа-запросы или responsive значения для width в modalStyle (например, width: { xs: '90%', sm: 400 }).
2. **Темы**: Использовать theme-переменные (например, theme.spacing, theme.palette) для большей консистентности.
3. **Документация**: Добавить комментарии или JSDoc для каждого стиля, описывающие их назначение.
4. **Константы**: Вынести повторяющиеся значения (например, gap: 2) в константы для унификации.
*/