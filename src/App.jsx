// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Atividades from './components/Atividades'; // <-- seu componente completo

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Se seu Login usa navigate('/atividades') ao logar, mantenha /login */}
        <Route path="/login" element={<Login />} />
        {/* Também deixo '/' apontando para a tela de login (opcional) */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/register" element={<Register />} />

        {/* Rota das atividades — aqui usamos o componente real */}
        <Route path="/atividades" element={<Atividades />} />

        {/* rota-coringa — redireciona para login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
