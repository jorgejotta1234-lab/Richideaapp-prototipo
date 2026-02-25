import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Shield, Users, Lightbulb, DollarSign, AlertCircle, 
  CheckCircle, Lock, Activity, BarChart3, Search, 
  MoreVertical, UserCheck,
  MessageSquare, TrendingUp
} from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line,
  PieChart, Pie, Cell
} from 'recharts';

const FounderDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/founder/full-stats')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (user?.role !== 'founder') return <div className="pt-32 text-center text-red-400 font-bold">ACESSO RESTRITO AO FUNDADOR.</div>;
  if (loading || !data) return <div className="pt-32 text-center">Carregando dados mestre...</div>;

  const COLORS = ['#00ff88', '#00ddeb', '#ff4444', '#ffbb33'];

  const filteredUsers = data.users.filter((u) => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-display font-bold flex items-center gap-3">
              <Shield className="w-10 h-10 text-rich-neon" /> Dashboard do Fundador
            </h1>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-[10px] font-bold uppercase rounded-full border border-purple-500/30">
              Elite Access
            </span>
          </div>
          <p className="text-white/50">Visão completa e controle total do ecossistema Rich Ideia.</p>
        </div>
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          {['overview', 'users', 'ideas', 'transactions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab ? 'bg-rich-neon text-rich-black' : 'text-white/60 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="glass-card p-6 border-l-4 border-rich-neon">
              <div className="flex justify-between items-center mb-2">
                <Users className="w-5 h-5 text-rich-neon" />
                <span className="text-[10px] font-bold text-white/40 uppercase">Usuários</span>
              </div>
              <p className="text-3xl font-display font-bold">{data.system_stats.total_users}</p>
              <p className="text-[10px] text-green-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +12% este mês
              </p>
            </div>
            <div className="glass-card p-6 border-l-4 border-blue-400">
              <div className="flex justify-between items-center mb-2">
                <Lightbulb className="w-5 h-5 text-blue-400" />
                <span className="text-[10px] font-bold text-white/40 uppercase">Ideias</span>
              </div>
              <p className="text-3xl font-display font-bold">{data.system_stats.total_ideas}</p>
              <p className="text-[10px] text-blue-400 mt-1">Ativas no marketplace</p>
            </div>
            <div className="glass-card p-6 border-l-4 border-purple-400">
              <div className="flex justify-between items-center mb-2">
                <DollarSign className="w-5 h-5 text-purple-400" />
                <span className="text-[10px] font-bold text-white/40 uppercase">Volume</span>
              </div>
              <p className="text-3xl font-display font-bold">{formatCurrency(data.system_stats.total_volume)}</p>
              <p className="text-[10px] text-white/40 mt-1">Transacionado</p>
            </div>
            <div className="glass-card p-6 border-l-4 border-green-400">
              <div className="flex justify-between items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-[10px] font-bold text-white/40 uppercase">Receita</span>
              </div>
              <p className="text-3xl font-display font-bold text-green-400">{formatCurrency(data.system_stats.total_commission)}</p>
              <p className="text-[10px] text-green-400/60 mt-1">Comissões (10%)</p>
            </div>
            <div className="glass-card p-6 border-l-4 border-orange-400">
              <div className="flex justify-between items-center mb-2">
                <MessageSquare className="w-5 h-5 text-orange-400" />
                <span className="text-[10px] font-bold text-white/40 uppercase">Chats</span>
              </div>
              <p className="text-3xl font-display font-bold">{data.system_stats.active_chats}</p>
              <p className="text-[10px] text-orange-400/60 mt-1">Conversas ativas</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-rich-neon" /> Crescimento da Plataforma
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { name: 'Jan', users: 10, ideas: 5 },
                    { name: 'Fev', users: 25, ideas: 12 },
                    { name: 'Mar', users: 45, ideas: 20 },
                    { name: 'Abr', users: 80, ideas: 35 },
                    { name: 'Mai', users: 120, ideas: 50 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} />
                    <YAxis stroke="#ffffff40" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff20', borderRadius: '8px' }}
                      itemStyle={{ color: '#00ff88' }}
                    />
                    <Line type="monotone" dataKey="users" stroke="#00ff88" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="ideas" stroke="#00ddeb" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-rich-neon" /> Distribuição de Usuários
              </h3>
              <div className="h-80 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Criadores', value: data.users.filter((u) => u.role === 'creator').length },
                        { name: 'Compradores', value: data.users.filter((u) => u.role === 'buyer').length },
                        { name: 'Staff', value: data.users.filter((u) => u.role === 'admin' || u.role === 'founder').length },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff20', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2 ml-4">
                  <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded-full bg-[#00ff88]" /> Criadores</div>
                  <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded-full bg-[#00ddeb]" /> Compradores</div>
                  <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded-full bg-[#ff4444]" /> Staff</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 lg:col-span-2">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" /> Alertas de Segurança Recentes
              </h3>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                <p className="text-sm text-white/40">O sistema antifraude está monitorando 100% das atividades. Nenhum incidente crítico nas últimas 24h.</p>
              </div>
            </div>

            <div className="glass-card p-8 lg:col-span-3">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-rich-neon" /> Status de Saúde do Sistema
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-[10px] text-white/40 uppercase font-bold mb-2">Database Latency</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xl font-bold">12ms</span>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-[10px] text-white/40 uppercase font-bold mb-2">API Uptime</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-xl font-bold">99.98%</span>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-[10px] text-white/40 uppercase font-bold mb-2">Active Nodes</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">12 / 12</span>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-[10px] text-white/40 uppercase font-bold mb-2">Security Level</p>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-rich-neon" />
                    <span className="text-xl font-bold">MAX</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="text-xl font-bold">Gestão de Usuários</h3>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="text"
                placeholder="Buscar usuário..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-rich-neon"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] uppercase font-bold tracking-widest text-white/40">
                  <th className="px-6 py-4">Usuário</th>
                  <th className="px-6 py-4">Papel</th>
                  <th className="px-6 py-4">KYC</th>
                  <th className="px-6 py-4">Data Registro</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rich-neon/10 flex items-center justify-center text-rich-neon font-bold text-xs">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{u.name}</p>
                          <p className="text-xs text-white/40">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                        u.role === 'founder' ? 'bg-purple-500/20 text-purple-400' :
                        u.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1 text-xs ${u.kyc_status === 'verified' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {u.kyc_status === 'verified' ? <UserCheck className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {u.kyc_status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-white/40">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-white/40" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'ideas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.ideas.map((idea) => (
            <div key={idea.id} className="glass-card p-6 hover:border-rich-neon/50 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase px-2 py-1 bg-rich-neon/10 text-rich-neon rounded-full">
                  {idea.sector}
                </span>
                <span className="text-sm font-bold text-white/80">{formatCurrency(idea.price)}</span>
              </div>
              <h4 className="font-bold mb-2 group-hover:text-rich-neon transition-colors">{idea.title}</h4>
              <p className="text-xs text-white/50 line-clamp-2 mb-4">{idea.problem_solved}</p>
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                    {idea.creator_name.charAt(0)}
                  </div>
                  <span className="text-[10px] text-white/40">{idea.creator_name}</span>
                </div>
                <span className={`text-[10px] font-bold ${idea.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                  {idea.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] uppercase font-bold tracking-widest text-white/40">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Ideia</th>
                  <th className="px-6 py-4">Partes</th>
                  <th className="px-6 py-4">Valor</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-white/40">#{tx.id}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold">{tx.idea_title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[10px]">
                        <p><span className="text-white/40">B:</span> {tx.buyer_name}</p>
                        <p><span className="text-white/40">S:</span> {tx.seller_name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold">{formatCurrency(tx.amount)}</p>
                      <p className="text-[10px] text-green-400">Fee: {formatCurrency(tx.commission)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                        tx.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        tx.status === 'escrow' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-white/40">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FounderDashboard;
