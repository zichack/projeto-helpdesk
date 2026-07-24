import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import Login from './pages/Login';

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
        
        <Route path="/" element={
          <PrivateRoute>
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
              <h1 className="text-4xl font-bold text-green-600">Login realizado com sucesso!</h1>
              <p className="text-gray-600 text-lg">Seu Token JWT está salvo e funcionando.</p>
            </div>
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;