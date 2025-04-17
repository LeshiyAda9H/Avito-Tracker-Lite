import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Boards from './pages/Boards';
import Board from './pages/board/Board';
import Issues from './pages/issues/Issues';
import Header from './components/Header';
import TaskFormProvider from './context/TaskFormContext';
import TaskFormModal from './components/TaskFormModal/TaskFormModal';
import { useTaskForm } from './hooks/useTaskForm';

// Компонент, который будет рендерить содержимое внутри TaskFormProvider
function AppContent() {
  const { isOpen, selectedTask, boardId, closeModal, handleSave } = useTaskForm();

  return (
    <>
      <Header />
      
      <Routes>
        <Route path="/boards" element={<Boards />} />
        <Route path="/board/:id" element={<Board />} />
        <Route path="/issues" element={<Issues />} />
      </Routes>
      
      <TaskFormModal
        open={isOpen}
        onClose={closeModal}
        task={selectedTask}
        boardId={boardId}
        onSave={handleSave}
      />
    </>
  );
}

function App() {
  return (
    <TaskFormProvider>
      
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>

    </TaskFormProvider>
  );
}

export default App;