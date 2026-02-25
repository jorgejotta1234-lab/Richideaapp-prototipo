import React from 'react';
import { X, Info, User, Target, BarChart, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

const TransactionDetailsModal = ({ tx, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="glass-card w-full max-w-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rich-neon/5 blur-[40px] rounded-full -mr-16 -mt-16" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="bg-rich-neon/20 p-2 rounded-lg">
            <Info className="w-5 h-5 text-rich-neon" />
          </div>
          <h2 className="text-2xl font-display font-bold">Detalhes da Transação</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">Ideia / Projeto</label>
              <p className="text-lg font-bold text-white">{tx.idea_title}</p>
              <p className="text-sm text-white/60 mt-1 line-clamp-3">{tx.problem_solved}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Setor</label>
                <div className="flex items-center gap-2 text-sm">
                  <Target className="w-3 h-3 text-rich-neon" />
                  <span>{tx.sector}</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Maturidade</label>
                <div className="flex items-center gap-2 text-sm">
                  <BarChart className="w-3 h-3 text-rich-neon" />
                  <span>{tx.maturity_level}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Comprador</label>
                <div className="flex items-center gap-2 text-sm font-bold">
                  <User className="w-3 h-3 text-rich-neon" />
                  <span>{tx.buyer_name}</span>
                </div>
              </div>
              <div className="text-right">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Vendedor</label>
                <div className="flex items-center gap-2 text-sm font-bold justify-end">
                  <User className="w-3 h-3 text-rich-neon" />
                  <span>{tx.seller_name}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-white/40">Valor da Transação</span>
                <span className="text-sm font-bold flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-rich-neon" />
                  {formatCurrency(tx.amount)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-white/40">Comissão (10%)</span>
                <span className="text-sm text-white/60">-{formatCurrency(tx.commission)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <span className="text-xs font-bold text-white/80">Data</span>
                <span className="text-xs text-white/40 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(tx.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <span className={`w-full block text-center py-2 rounded-xl text-xs font-bold uppercase tracking-widest ${
                tx.status === 'escrow' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
                'bg-green-500/10 text-green-400 border border-green-500/20'
              }`}>
                {tx.status === 'escrow' ? 'Em Escrow' : 'Concluído'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;
