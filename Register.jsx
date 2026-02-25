import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lamp, Mail, Lock, User, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'creator',
    country: 'Angola'
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        // Auto login
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        const data = await loginRes.json();
        login(data.token, data.user);
        navigate('/dashboard');
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
          <h1 className="text-2xl font-display font-bold">Criar Conta Rich Ideia</h1>
          <p className="text-white/50 text-sm">Junte-se à elite global de inovação.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-white/40 mb-1 ml-1">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="text" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-rich-neon"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-white/40 mb-1 ml-1">E-mail Corporativo</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="email" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-rich-neon"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-white/40 mb-1 ml-1">Senha Segura</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="password" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-rich-neon"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-white/40 mb-1 ml-1">Tipo de Conta</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-rich-neon"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="creator" className="bg-rich-navy">Criador</option>
                <option value="buyer" className="bg-rich-navy">Comprador</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-white/40 mb-1 ml-1">País</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-rich-neon"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-neon w-full py-3 mt-4"
          >
            {loading ? 'Criando Conta...' : 'Registrar Agora'}
          </button>
          
          <p className="text-[10px] text-white/30 text-center mt-4">
            * Ao registrar, você concorda que será necessário realizar o reconhecimento facial para habilitar todas as funcionalidades da plataforma.
          </p>
        </form>

        <p className="text-center text-sm text-white/40 mt-6">
          Já tem uma conta? <Link to="/login" className="text-rich-neon hover:underline">Fazer Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
