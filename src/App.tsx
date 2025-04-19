import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Boards from './pages/Boards';
import Board from './pages/board/Board';
import Issues from './pages/issues/Issues';
import Header from './components/Header';
import TaskFormProvider from './context/TaskFormContext';
import TaskFormModal from './components/TaskFormModal/TaskFormModal';
import { useTaskForm } from './hooks/useTaskForm';
import { Box } from '@mui/material';

// Компонент, который будет рендерить содержимое внутри TaskFormProvider
function AppContent() {
  const { isOpen, selectedTask, boardId, closeModal, handleSave } = useTaskForm();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <Header />
      
      <Routes>
        <Route path="/" element={<Navigate to="/issues" replace />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/boards" element={<Boards />} />
        <Route path="/board/:boardId" element={<Board />} />
      </Routes>
      
      <TaskFormModal
        open={isOpen}
        onClose={closeModal}
        task={selectedTask}
        boardId={boardId}
        onSave={handleSave}
      />
    </Box>
  );
}

export default function App() {
  return (
    <TaskFormProvider>
      
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
      
    </TaskFormProvider>
  );
}