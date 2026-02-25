import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, AlertTriangle, Target, DollarSign, BarChart, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CreateIdea = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    problem_solved: '',
    sector: '',
    price: '',
    maturity_level: 'Protótipo',
    description_encrypted: '',
    files: []
  });

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFormData({ ...formData, files: Array.from(e.target.files) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });
      if (res.ok) {
        alert('Ideia publicada com sucesso!');
        navigate('/marketplace');
      }
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'creator') return <div className="pt-32 text-center">Apenas criadores podem publicar ideias.</div>;

  return (
    <div className="pt-24 pb-20 px-4 max-w-3xl mx-auto">
      <div className="glass-card p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-rich-neon/20 p-3 rounded-2xl">
            <Lightbulb className="w-8 h-8 text-rich-neon" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">Publicar Nova Ideia</h1>
            <p className="text-white/50">Sua inovação será protegida por criptografia AES-256.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-white/40 mb-2">Título da Ideia / Projeto</label>
            <input 
              type="text" 
              required
              placeholder="Ex: Sistema de Energia Renovável Inteligente"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-rich-neon"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-white/40 mb-2">Setor de Atuação</label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Fintech, Energia, Saúde"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-rich-neon"
                  value={formData.sector}
                  onChange={(e) => setFormData({...formData, sector: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-white/40 mb-2">Valor de Venda (USD)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input 
                  type="number" 
                  required
                  placeholder="0.00"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-rich-neon"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-white/40 mb-2">Nível de Maturidade</label>
            <div className="relative">
              <BarChart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-rich-neon appearance-none"
                value={formData.maturity_level}
                onChange={(e) => setFormData({...formData, maturity_level: e.target.value})}
              >
                <option value="Ideia Inicial" className="bg-rich-navy">Ideia Inicial</option>
                <option value="Protótipo" className="bg-rich-navy">Protótipo / MVP</option>
                <option value="Em Operação" className="bg-rich-navy">Em Operação</option>
                <option value="Escalável" className="bg-rich-navy">Escalável</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-white/40 mb-2">Problema que Resolve (Público)</label>
            <div className="relative">
              <AlertTriangle className="absolute left-3 top-4 w-4 h-4 text-white/30" />
              <textarea 
                required
                rows={3}
                placeholder="Descreva o problema de forma clara, sem revelar segredos industriais."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-rich-neon"
                value={formData.problem_solved}
                onChange={(e) => setFormData({...formData, problem_solved: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-white/40 mb-2">Solução Detalhada (Protegida por NDA)</label>
            <div className="relative">
              <Lock className="absolute left-3 top-4 w-4 h-4 text-white/30" />
              <textarea 
                required
                rows={6}
                placeholder="Aqui você deve colocar os detalhes estratégicos, modelos de negócio e diferenciais técnicos que só serão vistos após assinatura de NDA."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-rich-neon"
                value={formData.description_encrypted}
                onChange={(e) => setFormData({...formData, description_encrypted: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-white/40 mb-2">Anexar Documentos (PDF, DOCX, ZIP)</label>
            <div className="relative border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-rich-neon/50 transition-colors cursor-pointer group">
              <input 
                type="file" 
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-rich-neon/10 transition-colors">
                  <Lock className="w-6 h-6 text-white/30 group-hover:text-rich-neon" />
                </div>
                <p className="text-sm font-medium">Clique ou arraste arquivos para criptografar</p>
                <p className="text-xs text-white/40 mt-1">Os arquivos serão protegidos por AES-256 antes do upload.</p>
                {formData.files.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {formData.files.map((f, i) => (
                      <span key={i} className="px-3 py-1 bg-rich-neon/10 text-rich-neon text-[10px] font-bold rounded-full border border-rich-neon/20">
                        {f.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 bg-rich-neon/5 border border-rich-neon/20 rounded-xl text-xs text-white/60">
            <p>Ao publicar, você concorda que a Rich Ideia reterá 10% de comissão sobre o valor da venda. Seus dados e documentos serão protegidos por criptografia TLS 1.3 e AES-256.</p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-neon w-full py-4 text-lg"
          >
            {loading ? 'Publicando...' : 'Publicar Ideia com Segurança'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateIdea;
