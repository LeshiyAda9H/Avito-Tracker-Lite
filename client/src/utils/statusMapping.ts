// Тип для серверных значений статусов задачи
export type ServerStatus = 'Backlog' | 'InProgress' | 'Done';

// Тип для значений статусов, отображаемых в пользовательском интерфейсе
export type DisplayStatus = 'To do' | 'In progress' | 'Done';

// Маппинг серверных статусов на отображаемые в UI
export const serverToDisplayStatus: Record<ServerStatus, DisplayStatus> = {
  Backlog: 'To do', // Серверный "Backlog" отображается как "To do"
  InProgress: 'In progress', // Серверный "InProgress" отображается как "In progress"
  Done: 'Done', // Серверный "Done" отображается как "Done"
};

// Маппинг отображаемых в UI статусов на серверные
export const displayToServerStatus: Record<DisplayStatus, ServerStatus> = {
  'To do': 'Backlog', // UI "To do" преобразуется в серверный "Backlog"
  'In progress': 'InProgress', // UI "In progress" преобразуется в серверный "InProgress"
  Done: 'Done', // UI "Done" преобразуется в серверный "Done"
};

// Функция для преобразования серверного статуса в отображаемый
export const toDisplayStatus = (status: ServerStatus): DisplayStatus => serverToDisplayStatus[status];

// Функция для преобразования отображаемого статуса в серверный
export const toServerStatus = (status: DisplayStatus): ServerStatus => displayToServerStatus[status];

/*
Предложения по улучшению:
1. **Локализация**: Добавить поддержку локализации для DisplayStatus (например, хранить переводы в отдельном файле).
2. **Документация**: Добавить JSDoc для функций toDisplayStatus и toServerStatus, описывающий их назначение.
3. **Проверка типов**: Добавить проверку на случай некорректных входных данных (например, если статус отсутствует в маппинге).
4. **Расширяемость**: Рассмотреть возможность динамического добавления новых статусов через конфигурацию.
*/