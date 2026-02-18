import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (name: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, diga-nos seu nome para começarmos.');
      return;
    }
    onLogin(name);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-sm space-y-8">
        
        <div className="text-center space-y-2">
          <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Jesus & Eu</h1>
          <p className="text-slate-500">Libertação através da fé e ciência.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pt-8">
          
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Como você gostaria de ser chamado?
            </label>
            <input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-lg"
              autoFocus
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            Começar <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-xs text-center text-slate-400 leading-relaxed px-4">
          Seus dados ficam salvos apenas neste dispositivo.
        </p>
      </div>
    </div>
  );
};