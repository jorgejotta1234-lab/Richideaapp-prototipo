import React, { useState } from 'react';
import { X, DollarSign, CreditCard, Landmark, Smartphone, CheckCircle } from 'lucide-react';

const DepositModal = ({ onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleDeposit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount), method })
      });
      if (res.ok) {
        setStep(3);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: 'visa', name: 'Visa / Mastercard', icon: <CreditCard className="w-5 h-5" />, type: 'International' },
    { id: 'paypal', name: 'PayPal', icon: <DollarSign className="w-5 h-5" />, type: 'International' },
    { id: 'multicaixa', name: 'Multicaixa Express', icon: <Landmark className="w-5 h-5" />, type: 'Angola' },
    { id: 'unitel', name: 'Unitel Money', icon: <Smartphone className="w-5 h-5" />, type: 'Angola' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="glass-card w-full max-w-md p-8 relative overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">Depositar Fundos</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-white/40 block mb-2">Valor do Depósito (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input 
                    type="number" 
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-rich-neon"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
              <button 
                disabled={!amount || parseFloat(amount) <= 0}
                onClick={() => setStep(2)}
                className="btn-neon w-full py-3"
              >
                Próximo
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">Método de Pagamento</h2>
            <div className="space-y-3 mb-6">
              {paymentMethods.map((pm) => (
                <button
                  key={pm.id}
                  onClick={() => setMethod(pm.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                    method === pm.id ? 'bg-rich-neon/10 border-rich-neon/30' : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-rich-neon">{pm.icon}</div>
                    <div className="text-left">
                      <p className="text-sm font-bold">{pm.name}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{pm.type}</p>
                    </div>
                  </div>
                  {method === pm.id && <CheckCircle className="w-4 h-4 text-rich-neon" />}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all">Voltar</button>
              <button 
                disabled={!method || loading}
                onClick={handleDeposit}
                className="btn-neon flex-1 py-3"
              >
                {loading ? 'Processando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-2">Depósito Concluído!</h2>
            <p className="text-white/60">Seu saldo foi atualizado com sucesso.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositModal;
