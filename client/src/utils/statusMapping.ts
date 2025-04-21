// Серверные значения статусов
export type ServerStatus = 'Backlog' | 'InProgress' | 'Done';

// Значения для отображения в UI
export type DisplayStatus = 'To do' | 'In progress' | 'Done';

// Маппинг серверных статусов на отображаемые
export const serverToDisplayStatus: Record<ServerStatus, DisplayStatus> = {
  Backlog: 'To do',
  InProgress: 'In progress',
  Done: 'Done',
};

// Маппинг отображаемых статусов на серверные
export const displayToServerStatus: Record<DisplayStatus, ServerStatus> = {
  'To do': 'Backlog',
  'In progress': 'InProgress',
  Done: 'Done',
};

// Функции для преобразования
export const toDisplayStatus = (status: ServerStatus): DisplayStatus => serverToDisplayStatus[status];
export const toServerStatus = (status: DisplayStatus): ServerStatus => displayToServerStatus[status];