import React, { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (isRegister) {
      if (name.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email inválido';
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>/?-]).{8,}$/;
      if (!passwordRegex.test(password))
        return 'Senha deve ter pelo menos 8 caracteres, 1 letra maiúscula, 1 número e 1 caractere especial';
    } else {
      if (!email || !password) return 'Preencha email e senha';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      if (isRegister) {
        await register({ name, email, password });
      } else {
        await login(email, password);
      }
      navigate('/events');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erro ao autenticar');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    // não limpa erro aqui!
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center">
          {isRegister ? 'Registrar' : 'Login'}
        </h2>

        {isRegister && (
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={e => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder=" "
              className="peer w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 transition-colors"
              required
            />
            <label className="absolute left-0 -top-1.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-1.5 peer-focus:text-blue-500 peer-focus:text-sm">
              Nome
            </label>
          </div>
        )}

        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            placeholder=" "
            className="peer w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 transition-colors"
            required
          />
          <label className="absolute left-0 -top-1.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-1.5 peer-focus:text-blue-500 peer-focus:text-sm">
            Email
          </label>
        </div>

        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              if (error) setError('');
            }}
            placeholder=" "
            className="peer w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 transition-colors"
            required
          />
          <label className="absolute left-0 -top-1.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-1.5 peer-focus:text-blue-500 peer-focus:text-sm">
            Senha
          </label>
        </div>

        {/* Mensagem de erro com animação */}
        <AnimatePresence>
          {error && (
            <motion.p
              className="text-red-500 text-sm text-center mt-1"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          {isRegister ? 'Registrar' : 'Entrar'}
        </button>

        <button
          type="button"
          onClick={toggleMode}
          className="w-full text-blue-500 hover:text-blue-600 underline text-sm transition-colors"
        >
          {isRegister ? 'Já possui conta? Faça login' : 'Não tem conta? Registre-se'}
        </button>
      </form>
    </div>
  );
};

export default AuthPage;
