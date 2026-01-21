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
        <label htmlFor="name" className="block text-sm font-light text-gray-600 mb-2">
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
        <label htmlFor="email" className="block text-sm font-light text-gray-600 mb-2">
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
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-300 transition-colors text-sm"
          disabled={loading}
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      {message && (
        <div className="text-gray-600 text-sm bg-gray-50 p-4 rounded-lg border border-gray-200">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-normal"
      >
        {loading ? 'Criando conta...' : 'Criar conta'}
      </button>

      {onSwitchToLogin && (
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors font-light pt-2"
        >
          Já tem uma conta?
        </button>
      )}
    </form>
  );
}
