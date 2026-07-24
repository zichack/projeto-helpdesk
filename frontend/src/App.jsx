import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NovoChamado from './pages/NovoChamado';
import DetalhesChamado from './pages/DetalhesChamado';
import Cadastro from './pages/Cadastro';

const PrivateRoute = ({ children }) => {
  const { signed, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-100 text-xl text-gray-600 font-semibold">Carregando...</div>;
  }

  return signed ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        
        <Route path="/" element={
          <PrivateRoute>
             <Dashboard />
          </PrivateRoute>
        } />

        <Route path="/novo-chamado" element={
          <PrivateRoute>
            <NovoChamado />
          </PrivateRoute>
        } />

        <Route path="/chamados/:id" element={
          <PrivateRoute>
            <DetalhesChamado />
          </PrivateRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;