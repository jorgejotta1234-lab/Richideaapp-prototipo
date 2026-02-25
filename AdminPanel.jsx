import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Users, Lightbulb, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

const AdminPanel = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then(res => res.json()),
      fetch('/api/admin/security-logs').then(res => res.json())
    ]).then(([statsData, logsData]) => {
      setStats(statsData);
      setLogs(logsData);
      setLoading(false);
    });
  }, []);

  if (user?.role !== 'admin') return <div className="pt-32 text-center">Acesso Negado.</div>;

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-display font-bold mb-8 flex items-center gap-3">
        <Shield className="w-8 h-8 text-rich-neon" /> Painel de Controle Administrativo
      </h1>

      {loading ? (
        <p>Carregando estatísticas...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <Users className="w-6 h-6 text-rich-neon" />
              <span className="text-xs font-bold text-white/40 uppercase">Usuários</span>
            </div>
            <p className="text-3xl font-display font-bold">{stats.total_users}</p>
          </div>
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <Lightbulb className="w-6 h-6 text-rich-neon" />
              <span className="text-xs font-bold text-white/40 uppercase">Ideias</span>
            </div>
            <p className="text-3xl font-display font-bold">{stats.total_ideas}</p>
          </div>
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <DollarSign className="w-6 h-6 text-rich-neon" />
              <span className="text-xs font-bold text-white/40 uppercase">Volume Total</span>
            </div>
            <p className="text-3xl font-display font-bold">{formatCurrency(stats.total_volume)}</p>
          </div>
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <CheckCircle className="w-6 h-6 text-rich-neon" />
              <span className="text-xs font-bold text-white/40 uppercase">Comissões (10%)</span>
            </div>
            <p className="text-3xl font-display font-bold text-green-400">{formatCurrency(stats.total_commission)}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" /> Alertas de Segurança (Antifraude)
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {logs.length === 0 ? (
              <p className="text-sm text-white/40">Nenhum alerta registrado.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className={`p-4 border rounded-lg flex justify-between items-center ${
                  log.severity === 'critical' ? 'bg-red-500/10 border-red-500/20' : 
                  log.severity === 'high' ? 'bg-orange-500/10 border-orange-500/20' :
                  'bg-yellow-500/10 border-yellow-500/20'
                }`}>
                  <div>
                    <p className="text-sm font-bold">{log.event_type.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-white/60">{log.details}</p>
                    <p className="text-[10px] text-white/30 mt-1">IP: {log.ip_address} • {new Date(log.created_at).toLocaleString()}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase ${
                    log.severity === 'critical' ? 'text-red-400' : 
                    log.severity === 'high' ? 'text-orange-400' : 
                    'text-yellow-400'
                  }`}>{log.severity}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass-card p-8">
          <h3 className="text-xl font-bold mb-6">Gestão de Disputas</h3>
          <div className="flex flex-col items-center justify-center h-40 text-white/30">
            <Shield className="w-12 h-12 mb-2 opacity-20" />
            <p>Nenhuma disputa ativa no momento.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
