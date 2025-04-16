import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Boards from './pages/Boards';
import Board from './pages/board/Board';
import Issues from './pages/Issues';

import Header from './components/Header';


function App() {
  return (
    <BrowserRouter>
      
      <Header />
      
      <Routes>
        <Route path="/boards" element={<Boards />} />
        <Route path="/board/:id" element={<Board />} />
        <Route path="/issues" element={<Issues />} />
      </Routes>
      
    </BrowserRouter>
  );
}
export default App;