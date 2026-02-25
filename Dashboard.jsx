import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Wallet, ArrowUpRight, ShieldCheck, History, Lightbulb, Star, Share2, MessageSquare, DollarSign, Camera, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';
import RatingModal from '../components/RatingModal';
import ActivityAnalysis from '../components/ActivityAnalysis';
import TransactionDetailsModal from '../components/TransactionDetailsModal';
import Chat from '../components/Chat';
import DepositModal from '../components/DepositModal';
import KYCModal from '../components/KYCModal';

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingTx, setRatingTx] = useState(null);
  const [detailsTx, setDetailsTx] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showKYC, setShowKYC] = useState(false);

  const handleProfileImage = () => {
    const url = prompt('Insira a URL da sua foto de perfil:');
    if (url) {
      fetch('/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_image: url })
      }).then(() => refreshUser());
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Rich Ideia',
          text: 'Confira a Rich Ideia - O Marketplace Global de Inovação!',
          url: window.location.origin,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      alert('Link copiado: ' + window.location.origin);
      navigator.clipboard.writeText(window.location.origin);
    }
  };

  useEffect(() => {
    Promise.all([
      fetch('/api/wallet').then(res => res.json()),
      fetch('/api/chat/active').then(res => res.json())
    ]).then(([walletData, chatData]) => {
      setTransactions(walletData);
      setActiveChats(chatData);
      setLoading(false);
    });
  }, []);

  if (!user) return <div className="pt-32 text-center">Acesso negado.</div>;

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Wallet Card */}
        <div className="lg:col-span-2 glass-card p-8 bg-gradient-to-br from-rich-blue to-rich-navy overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rich-neon/10 blur-[80px] rounded-full -mr-32 -mt-32" />
          
          <div className="flex justify-between items-start mb-12">
            <div>
              <p className="text-white/50 text-sm uppercase font-bold tracking-widest mb-1">Saldo Disponível</p>
              <h2 className="text-5xl font-display font-bold">{formatCurrency(user.wallet_balance)}</h2>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl">
              <Wallet className="w-8 h-8 text-rich-neon" />
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setShowDeposit(true)}
              className="btn-neon flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" /> Depositar
            </button>
            {user.role === 'creator' && (
              <Link to="/create-idea" className="px-6 py-2 rounded-full border border-rich-neon/30 hover:bg-rich-neon/5 transition-all flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> Publicar Ideia
              </Link>
            )}
            <button 
              onClick={handleShare}
              className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/5 transition-all flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" /> Compartilhar
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="glass-card p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div 
                onClick={handleProfileImage}
                className="w-16 h-16 rounded-full bg-rich-neon/20 flex items-center justify-center border-2 border-rich-neon/30 overflow-hidden cursor-pointer group relative"
              >
                {user.profile_image ? (
                  <img src={user.profile_image} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <User className="w-6 h-6 text-rich-neon" />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg">{user.name}</h3>
                <p className="text-xs text-white/40">{user.email}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Status KYC</span>
                <button 
                  onClick={() => user.kyc_status !== 'verified' && setShowKYC(true)}
                  className={`flex items-center gap-1 text-xs font-bold ${user.kyc_status === 'verified' ? 'text-green-400' : 'text-yellow-400 hover:underline'}`}
                >
                  <ShieldCheck className="w-3 h-3" /> {(user.kyc_status || 'pending').toUpperCase()}
                  {user.kyc_status !== 'verified' && <ArrowUpRight className="w-3 h-3" />}
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Total Negociado</span>
                <span className="text-sm font-bold">{formatCurrency(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Reputação</span>
                <span className="text-sm font-bold text-rich-neon">100%</span>
              </div>
            </div>
          </div>
          <Link to="/profile" className="text-rich-neon text-sm hover:underline mt-8 block">Ver Perfil Completo</Link>
        </div>
      </div>

      {/* Activity Analysis Panel */}
      <ActivityAnalysis transactions={transactions} role={user.role === 'creator' ? 'creator' : 'buyer'} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Active Chats */}
        <div className="glass-card p-6 h-fit">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-rich-neon" /> Conversas Ativas (NDA)
          </h3>
          <div className="space-y-3">
            {activeChats.length === 0 ? (
              <p className="text-sm text-white/40">Nenhuma conversa ativa no momento.</p>
            ) : (
              activeChats.map((chat) => (
                <button 
                  key={`${chat.idea_id}-${chat.other_party_id}`}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedChat?.idea_id === chat.idea_id && selectedChat?.other_party_id === chat.other_party_id
                      ? 'bg-rich-neon/10 border-rich-neon/30' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <p className="text-xs font-bold text-rich-neon truncate">{chat.idea_title}</p>
                  <p className="text-sm font-medium text-white/80">{chat.other_party_name}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2">
          {selectedChat ? (
            <Chat ideaId={selectedChat.idea_id.toString()} receiverId={selectedChat.other_party_id} />
          ) : (
            <div className="glass-card h-[500px] flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-white/20" />
              </div>
              <h4 className="text-lg font-bold text-white/60">Selecione uma conversa</h4>
              <p className="text-sm text-white/40 max-w-xs mt-2">
                As conversas são habilitadas automaticamente após a assinatura do NDA.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-rich-neon" /> Histórico de Transações
          </h3>
          <button className="text-sm text-white/40 hover:text-white">Ver Tudo</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] uppercase font-bold tracking-widest text-white/40">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Ideia / Projeto</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Ações</th>
                <th className="px-6 py-4">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-white/40">Carregando transações...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-white/40">Nenhuma transação encontrada.</td></tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-white/40">#{tx.id}</td>
                    <td className="px-6 py-4 font-bold text-sm">{tx.idea_title}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${tx.buyer_id === user.id ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                        {tx.buyer_id === user.id ? 'Compra' : 'Venda'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-display font-bold">{formatCurrency(tx.amount)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${tx.status === 'escrow' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`}>
                          {tx.status === 'escrow' ? 'Em Escrow' : 'Concluído'}
                        </span>
                        {tx.status === 'completed' && tx.buyer_id === user.id && (
                          <button 
                            onClick={() => setRatingTx(tx)}
                            className="p-1 hover:text-rich-neon transition-colors"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setDetailsTx(tx)}
                          className="text-xs font-bold text-rich-neon hover:underline"
                        >
                          Detalhes
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-white/40">{new Date(tx.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {ratingTx && (
        <RatingModal 
          transactionId={ratingTx.id}
          toUserId={ratingTx.seller_id}
          onClose={() => setRatingTx(null)}
          onSuccess={() => {
            alert('Avaliação enviada!');
          }}
        />
      )}

      {detailsTx && (
        <TransactionDetailsModal 
          tx={detailsTx}
          onClose={() => setDetailsTx(null)}
        />
      )}

      {showDeposit && (
        <DepositModal 
          onClose={() => setShowDeposit(false)}
          onSuccess={() => refreshUser()}
        />
      )}

      {showKYC && (
        <KYCModal 
          onSuccess={() => {
            setShowKYC(false);
            refreshUser();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
