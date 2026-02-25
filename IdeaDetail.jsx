import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, FileText, Lock, CheckCircle, Wallet, AlertTriangle, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../lib/utils';
import Chat from '../components/Chat';

const IdeaDetail = () => {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    fetch(`/api/ideas/${id}`)
      .then(res => res.json())
      .then(data => {
        setIdea(data);
        setLoading(false);
      });
  }, [id]);

  const handleSignNDA = async () => {
    setSigning(true);
    try {
      const res = await fetch('/api/ndas/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea_id: id })
      });
      if (res.ok) {
        // Refresh idea data to show full description
        const updatedRes = await fetch(`/api/ideas/${id}`);
        const updatedData = await updatedRes.json();
        setIdea(updatedData);
      }
    } finally {
      setSigning(false);
    }
  };

  const handleBuy = async () => {
    if (!user) return navigate('/login');
    if (user.wallet_balance < idea.price) {
      alert('Saldo insuficiente na carteira digital.');
      return;
    }

    setBuying(true);
    try {
      const res = await fetch('/api/transactions/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea_id: id })
      });
      if (res.ok) {
        alert('Compra realizada com sucesso! O valor está em escrow até a transferência dos direitos.');
        refreshUser();
        navigate('/dashboard');
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } finally {
      setBuying(false);
    }
  };

  if (loading) return <div className="pt-32 text-center">Carregando...</div>;

  return (
    <div className="pt-24 pb-20 px-4 max-w-4xl mx-auto">
      <div className="glass-card p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
          <div>
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest bg-rich-neon/10 text-rich-neon border border-rich-neon/20 rounded-full mb-4 inline-block">
              {idea.sector}
            </span>
            <h1 className="text-4xl font-display font-bold mb-4">{idea.title}</h1>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-rich-neon" /> Verificado</span>
              <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> Nível: {idea.maturity_level}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/40 uppercase font-bold mb-1">Preço de Venda</p>
            <p className="text-4xl font-display font-bold text-rich-neon">{formatCurrency(idea.price)}</p>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rich-neon" /> Problema que Resolve
            </h3>
            <p className="text-white/70 leading-relaxed">{idea.problem_solved}</p>
          </section>

          <section className="relative">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-rich-neon" /> Detalhes Estratégicos
            </h3>
            
            {idea.nda_required ? (
              <div className="bg-rich-navy/50 border border-white/10 rounded-xl p-8 text-center">
                <ShieldAlert className="w-12 h-12 text-rich-neon mx-auto mb-4" />
                <h4 className="text-xl font-bold mb-2">Acesso Restrito</h4>
                <p className="text-white/60 mb-6 max-w-md mx-auto">
                  Para visualizar a solução completa e documentos anexos, você deve assinar o Acordo de Confidencialidade (NDA) digital da Rich Ideia.
                </p>
                <button 
                  onClick={handleSignNDA}
                  disabled={signing}
                  className="btn-neon px-8 py-3"
                >
                  {signing ? 'Assinando...' : 'Assinar NDA Digital'}
                </button>
              </div>
            ) : (
              <div className="bg-white/5 rounded-xl p-6 border border-rich-neon/20">
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                  {idea.description_encrypted || "Descrição detalhada protegida por criptografia AES-256."}
                </p>
                <div className="mt-6 p-4 bg-rich-neon/5 border border-rich-neon/20 rounded-lg flex items-center gap-3">
                  <FileText className="w-6 h-6 text-rich-neon" />
                  <div>
                    <p className="text-sm font-bold">Documento_Estrategico_V1.pdf</p>
                    <p className="text-xs text-white/40">Visualização segura habilitada • Download bloqueado</p>
                  </div>
                </div>

                <div className="mt-6 aspect-video bg-black/40 rounded-xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group">
                  <img 
                    src="https://picsum.photos/seed/pitch/800/450" 
                    className="absolute inset-0 w-full h-full object-cover opacity-20" 
                    alt="Pitch Video"
                    referrerPolicy="no-referrer"
                  />
                  <div className="z-10 flex flex-col items-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md mb-4 group-hover:bg-rich-neon group-hover:text-rich-black transition-all">
                      <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-current border-b-[8px] border-b-transparent ml-1" />
                    </div>
                    <p className="text-sm font-bold">Vídeo de Pitch Criptografado</p>
                    <p className="text-xs text-white/40">AES-256 Protected Stream</p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {!idea.nda_required && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-rich-neon" /> Negociação Segura
            </h3>
            <Chat ideaId={id} receiverId={idea.creator_id} />
          </div>
        )}

        {!idea.nda_required && user?.role === 'buyer' && (
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center">
            <div className="bg-rich-neon/10 p-6 rounded-2xl border border-rich-neon/20 w-full mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-rich-neon" />
                  <span className="font-bold">Seu Saldo:</span>
                </div>
                <span className="text-xl font-display font-bold">{formatCurrency(user.wallet_balance)}</span>
              </div>
              <p className="text-xs text-white/40">
                Ao clicar em comprar, o valor será retido em nosso sistema de **Escrow Seguro** até que a transferência de direitos seja confirmada por ambas as partes.
              </p>
            </div>
            <button 
              onClick={handleBuy}
              disabled={buying}
              className="btn-neon w-full py-4 text-lg"
            >
              {buying ? 'Processando...' : 'Comprar Ideia Agora'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaDetail;
