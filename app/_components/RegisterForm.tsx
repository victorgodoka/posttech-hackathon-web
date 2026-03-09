'use client';

import { useState, FormEvent } from 'react';
import { useCases } from '@/app/_infrastructure/di/container';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      await useCases.registerUser.execute({ email, name, password });
      await useCases.loginUser.execute({ email, password });
      onSuccess?.();
    } catch (err) {
      setMessage('Não conseguimos concluir agora. Você pode tentar mais tarde.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full">
      <div>
        <label htmlFor="name" className="block text-sm font-light text-dark-text-secondary mb-2">
          Nome
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-300 transition-colors text-sm"
          disabled={loading}
          placeholder="Como prefere ser chamado?"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-light text-dark-text-secondary mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-300 transition-colors text-sm"
          disabled={loading}
          placeholder="seu@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-light text-dark-text-secondary mb-2">
          Senha
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-300 transition-colors text-sm"
          disabled={loading}
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      {message && (
        <p className="text-sm text-dark-text-primary dark:text-dark-text-primary font-light text-center">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-normal"
      >
        {loading ? 'Criando conta...' : 'Criar conta'}
      </button>

      <p className="text-center text-sm text-dark-text-secondary font-light">
        Já tem conta?{' '}
        <button
          onClick={onSwitchToLogin}
          className="text-indigo-400 hover:text-indigo-300 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
        >
          Entrar
        </button>
      </p>
    </form>
  );
}
