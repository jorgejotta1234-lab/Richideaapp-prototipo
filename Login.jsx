import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lamp, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        login(data.token, data.user);
        navigate('/dashboard');
      } else {
        alert('Credenciais inválidas');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      <div className="glass-card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-block bg-rich-neon/20 p-3 rounded-2xl mb-4">
            <Lamp className="w-8 h-8 text-rich-neon" />
          </div>
          <h1 className="text-2xl font-display font-bold">Acessar Rich Ideia</h1>
          <p className="text-white/50 text-sm">Entre no seu painel de controle seguro.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-white/40 mb-1 ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="email" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-rich-neon"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-white/40 mb-1 ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="password" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-rich-neon"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-neon w-full py-3 mt-4"
          >
            {loading ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm text-white/40 mt-6">
          Não tem uma conta? <Link to="/register" className="text-rich-neon hover:underline">Criar Agora</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
