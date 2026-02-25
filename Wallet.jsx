import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, History, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import DepositModal from '../components/DepositModal';

const WalletPage = () => {
  const { user, refreshUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [showDeposit, setShowDeposit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/wallet')
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setLoading(false);
      });
  }, []);

  if (!user) return <div className="pt-32 text-center">Acesso negado.</div>;

  return (
    <div className="pt-24 pb-20 px-4 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Minha Carteira</h1>
          <p className="text-white/50">Gerencie seus fundos e histórico de transações com segurança.</p>
        </div>
        <button 
          onClick={() => setShowDeposit(true)}
          className="btn-neon flex items-center gap-2 px-8 py-3"
        >
          <Plus className="w-5 h-5" /> Adicionar Fundos
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 glass-card p-8 bg-gradient-to-br from-rich-blue to-rich-navy relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rich-neon/10 blur-[80px] rounded-full -mr-32 -mt-32" />
          <p className="text-white/50 text-sm uppercase font-bold tracking-widest mb-2">Saldo Total</p>
          <h2 className="text-6xl font-display font-bold mb-8">{formatCurrency(user.wallet_balance)}</h2>
          
          <div className="flex gap-8 border-t border-white/10 pt-8">
            <div>
              <p className="text-white/40 text-xs uppercase font-bold mb-1">Total Recebido</p>
              <p className="text-xl font-bold text-green-400">{formatCurrency(0)}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase font-bold mb-1">Total Gasto</p>
              <p className="text-xl font-bold text-red-400">{formatCurrency(0)}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rich-neon" /> Segurança
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs font-bold text-white/80 mb-1">Proteção Escrow</p>
              <p className="text-[10px] text-white/40">Seus fundos ficam retidos com segurança até a conclusão do contrato.</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs font-bold text-white/80 mb-1">Criptografia Bancária</p>
              <p className="text-[10px] text-white/40">Todas as transações são protegidas por protocolos TLS 1.3 e AES-256.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-rich-neon" /> Histórico Completo
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] uppercase font-bold tracking-widest text-white/40">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-white/40">Carregando...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-white/40">Nenhuma transação registrada.</td></tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-white/40">#{tx.id}</td>
                    <td className="px-6 py-4 font-bold text-sm">{tx.idea_title}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${tx.buyer_id === user.id ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                        {tx.buyer_id === user.id ? 'Pagamento' : 'Recebimento'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-display font-bold">{formatCurrency(tx.amount)}</td>
                    <td className="px-6 py-4 text-xs text-white/40">{new Date(tx.created_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDeposit && (
        <DepositModal 
          onClose={() => setShowDeposit(false)}
          onSuccess={() => {
            refreshUser();
            // Refresh local transactions too
            fetch('/api/wallet')
              .then(res => res.json())
              .then(setTransactions);
          }}
        />
      )}
    </div>
  );
};

export default WalletPage;
