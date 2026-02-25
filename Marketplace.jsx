import React, { useState, useEffect } from 'react';
import { Search, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { formatCurrency } from '../lib/utils';
import { Link } from 'react-router-dom';

const Marketplace = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/ideas')
      .then(res => res.json())
      .then(data => {
        setIdeas(data);
        setLoading(false);
      });
  }, []);

  const filteredIdeas = ideas.filter(idea => 
    idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Marketplace de Ideias</h1>
          <p className="text-white/50">Explore soluções inovadoras e projetos estratégicos verificados.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input 
            type="text" 
            placeholder="Buscar por setor ou problema..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-rich-neon transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rich-neon"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredIdeas.map((idea) => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              className="glass-card p-6 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-rich-neon/10 text-rich-neon border border-rich-neon/20 rounded-full">
                  {idea.sector}
                </span>
                <div className="flex items-center gap-1 text-white/40 text-xs">
                  <Activity className="w-3 h-3" />
                  {idea.maturity_level}
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-3 line-clamp-1">{idea.title}</h3>
              <p className="text-white/60 text-sm mb-6 line-clamp-3">
                <span className="text-white/40 block text-xs uppercase font-bold mb-1">Problema que resolve:</span>
                {idea.problem_solved}
              </p>
              
              <div className="mt-auto pt-6 border-t border-white/10 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-white/40 uppercase font-bold">Valor de Venda</p>
                  <p className="text-lg font-display font-bold text-rich-neon">{formatCurrency(idea.price)}</p>
                </div>
                <Link to={`/ideas/${idea.id}`} className="btn-neon py-2 px-4 text-sm">
                  Ver Detalhes
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
