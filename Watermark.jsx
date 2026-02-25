import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Watermark = () => {
  const { user } = useAuth();
  const [ip, setIp] = useState('127.0.0.1');

  useEffect(() => {
    // In a real app, we'd fetch the public IP
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIp(data.ip))
      .catch(() => setIp('187.12.44.1')); // Fallback for demo
  }, []);

  if (!user) return null;

  const watermarkText = `${(user.name || 'USER').toUpperCase()} • ${ip} • ${new Date().toISOString()} • RICH IDEIA SECURE`;
  
  return (
    <div className="watermark-overlay select-none overflow-hidden">
      <div className="grid grid-cols-4 md:grid-cols-6 gap-12 opacity-[0.03] rotate-[-25deg] scale-150">
        {Array.from({ length: 120 }).map((_, i) => (
          <div key={i} className="text-[10px] font-mono whitespace-nowrap tracking-widest py-8">
            {watermarkText}
          </div>
        ))}
      </div>
      {/* Invisible layer to detect screen capture attempts if possible in browser */}
      <div className="fixed inset-0 z-[10000] pointer-events-none bg-transparent" aria-hidden="true" />
    </div>
  );
};

export default Watermark;
