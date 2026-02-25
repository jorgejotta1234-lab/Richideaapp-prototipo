import React, { useState } from 'react';
import { Star } from 'lucide-react';

const RatingModal = ({ transactionId, toUserId, onClose, onSuccess }) => {
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to_user_id: toUserId,
          transaction_id: transactionId,
          score,
          comment
        })
      });
      if (res.ok) {
        onSuccess();
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="glass-card w-full max-w-md p-8">
        <h3 className="text-xl font-bold mb-4">Avaliar Transação</h3>
        <p className="text-sm text-white/60 mb-6">Sua avaliação ajuda a manter a integridade da plataforma.</p>
        
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <button 
              key={s} 
              onClick={() => setScore(s)}
              className={`p-2 transition-colors ${s <= score ? 'text-rich-neon' : 'text-white/20'}`}
            >
              <Star className="w-8 h-8 fill-current" />
            </button>
          ))}
        </div>

        <textarea
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-rich-neon mb-6"
          placeholder="Deixe um comentário sobre a experiência..."
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 px-6 py-2 rounded-full border border-white/20 hover:bg-white/5">Cancelar</button>
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="flex-1 btn-neon"
          >
            {loading ? 'Enviando...' : 'Enviar Avaliação'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
