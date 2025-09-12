import React, { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Usuário" className="w-full border p-2 mb-2"/>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" className="w-full border p-2 mb-4"/>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Entrar</button>
      </form>
    </div>
  );
};

export default LoginPage;
