import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const ActivityAnalysis = ({ transactions, role }) => {
  // Process data for charts
  const monthlyData = transactions.reduce((acc, tx) => {
    const month = new Date(tx.created_at).toLocaleString('default', { month: 'short' });
    const existing = acc.find(d => d.name === month);
    if (existing) {
      existing.value += tx.amount;
      existing.count += 1;
    } else {
      acc.push({ name: month, value: tx.amount, count: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-6">Volume de {role === 'creator' ? 'Vendas' : 'Compras'}</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} />
              <YAxis stroke="#ffffff40" fontSize={12} tickFormatter={(v) => `$${v}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0A1F44', border: '1px solid #ffffff20', borderRadius: '8px' }}
                itemStyle={{ color: '#00F2FF' }}
              />
              <Bar dataKey="value" fill="#00F2FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-6">Frequência de Atividade</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} />
              <YAxis stroke="#ffffff40" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0A1F44', border: '1px solid #ffffff20', borderRadius: '8px' }}
                itemStyle={{ color: '#00F2FF' }}
              />
              <Line type="monotone" dataKey="count" stroke="#00F2FF" strokeWidth={2} dot={{ fill: '#00F2FF' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ActivityAnalysis;
