import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import store from './store';
import Boards from './pages/Boards';
import Board from './pages/board/Board';
import Issues from './pages/issues/Issues';
import Header from './components/Header';
import TaskFormProvider from './context/TaskFormContext';
import TaskFormModal from './components/TaskFormModal/TaskFormModal';
import ErrorBoundary from './components/ErrorBoundary';
import { useTaskForm } from './hooks/useTaskForm';
import { Box } from '@mui/material';

// Компонент, определяющий основное содержимое приложения
function AppContent() {
  // Получение состояния и обработчиков формы задачи из пользовательского хука
  const { isOpen, selectedTask, boardId, closeModal, handleSave } = useTaskForm();

  return (
    // Корневой контейнер, обеспечивающий полную высоту экрана и колонную компоновку
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Навигационная панель */}
      <Header />
      
      {/* Обертка маршрутов для перехвата ошибок рендеринга */}
      <ErrorBoundary>
        <Routes>
          {/* Перенаправление корневого пути на /issues */}
          <Route path="/" element={<Navigate to="/issues" replace />} />
          {/* Маршрут для просмотра всех задач */}
          <Route path="/issues" element={<Issues />} />
          {/* Маршрут для просмотра всех досок */}
          <Route path="/boards" element={<Boards />} />
          {/* Динамический маршрут для конкретной доски */}
          <Route path="/board/:boardId" element={<Board />} />
        </Routes>
      </ErrorBoundary>

      {/* Модальное окно для создания/редактирования задач */}
      <TaskFormModal
        open={isOpen}
        onClose={closeModal}
        task={selectedTask}
        boardId={boardId}
        onSave={handleSave}
      />
      
      {/* Контейнер для уведомлений с предустановленными настройками */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Box>
  );
}

// Корневой компонент, оборачивающий приложение в провайдеры и маршрутизатор
export default function App() {
  return (
    // Провайдер Redux для управления состоянием
    <Provider store={store}>
      {/* Провайдер контекста формы задачи */}
      <TaskFormProvider>
        {/* Маршрутизатор для навигации на стороне клиента */}
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TaskFormProvider>
    </Provider>
  );
}

/*
Предложения по улучшению:
1. **Разделение маршрутов**: Вынести Routes в отдельный компонент (например, AppRoutes.tsx) для лучшей модульности.
2. **Ленивая загрузка**: Использовать React.lazy и Suspense для загрузки страниц (Boards, Board, Issues) по требованию для повышения производительности.
3. **Типизация**: Убедиться, что все пропсы (например, TaskFormModal) строго типизированы с помощью интерфейсов TypeScript.
4. **Конфигурация уведомлений**: Вынести настройки ToastContainer в отдельную утилиту или компонент для повторного использования.
*/