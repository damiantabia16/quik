import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Boards from './pages/Boards';
import Board from './pages/Board';
import Profile from './pages/Profile';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { BoardProvider } from './context/BoardContext';
import { NoteProvider } from './context/NoteContext';
import { MenuProvider } from './context/MenuContext';

function App() {
  return (
    <AuthProvider>
      <BoardProvider>
        <MenuProvider>
          <NoteProvider>
            <Router>
              <Routes>
                <Route path='/' index element={<Home />} />
                <Route path='/ingresar' element={<Login />} />
                <Route path='/registrarse' element={<Register />} />
                <Route element={<ProtectedRoute />}>
                  <Route path='/tableros' element={<Boards />} />
                  <Route path='/tableros/:id/*' element={<Board />} />
                  <Route path='/perfil' element={<Profile />} />
                </Route>
              </Routes>
            </Router>
          </NoteProvider>
        </MenuProvider>
      </BoardProvider>
    </AuthProvider>
  )
};

export default App