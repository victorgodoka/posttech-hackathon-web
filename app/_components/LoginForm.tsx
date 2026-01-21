'use client';

import { useState, FormEvent } from 'react';
import { useCases } from '@/app/_infrastructure/di/container';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
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
        <label htmlFor="email" className="block text-sm font-light text-gray-600 mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 border border-slate-600 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 transition-all font-light text-slate-100 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 bg-slate-700 dark:bg-slate-700"
          disabled={loading}
          placeholder="seu@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-light text-gray-600 mb-2">
          Senha
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-4 py-3 border border-slate-600 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 transition-all font-light text-slate-100 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 bg-slate-700 dark:bg-slate-700"
          disabled={loading}
          placeholder="••••••"
        />
      </div>

      {message && (
        <p className="text-sm text-slate-300 dark:text-slate-300 font-light text-center">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-normal"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>

      {onSwitchToRegister && (
        <p className="text-center text-sm text-slate-400 dark:text-slate-400 font-light">
          Não tem conta?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-indigo-400 hover:text-indigo-300 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            Criar uma
          </button>
        </p>
      )}
    </form>
  );
}
