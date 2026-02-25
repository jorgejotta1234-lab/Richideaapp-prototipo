import React from 'react';
import { Smartphone, Apple, Play, Shield, CheckCircle, Globe, Lock } from 'lucide-react';
import { motion } from 'motion/react';

const DownloadPage = () => {
  return (
    <div className="pt-24 pb-20 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block p-4 bg-rich-neon/20 rounded-3xl mb-6"
        >
          <Smartphone className="w-12 h-12 text-rich-neon" />
        </motion.div>
        <h1 className="text-5xl font-display font-bold mb-4">Rich Ideia Mobile</h1>
        <p className="text-xl text-white/50 max-w-2xl mx-auto">
          Leve o marketplace de inovação mais seguro do mundo no seu bolso. Acesse, negocie e assine NDAs de qualquer lugar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
        <div className="space-y-8">
          <div className="glass-card p-6 border-l-4 border-rich-neon">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Lock className="w-5 h-5 text-rich-neon" /> Biometria Nativa
            </h3>
            <p className="text-white/60">Acesse sua conta e autorize transações usando FaceID ou TouchID com segurança máxima.</p>
          </div>
          <div className="glass-card p-6 border-l-4 border-blue-400">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" /> Notificações em Tempo Real
            </h3>
            <p className="text-white/60">Seja avisado instantaneamente sobre novas ofertas, mensagens e status de escrow.</p>
          </div>
          <div className="glass-card p-6 border-l-4 border-purple-400">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-400" /> Offline Mode
            </h3>
            <p className="text-white/60">Visualize suas ideias e contratos salvos mesmo sem conexão com a internet.</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-rich-neon/20 blur-[100px] rounded-full -z-10" />
          <div className="glass-card p-8 aspect-[9/16] max-w-[320px] mx-auto border-8 border-rich-navy shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-6 bg-rich-navy flex justify-center items-end pb-1">
              <div className="w-20 h-3 bg-white/10 rounded-full" />
            </div>
            <img 
              src="https://picsum.photos/seed/app/320/640" 
              className="w-full h-full object-cover opacity-80" 
              alt="App Screenshot"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-transparent to-transparent" />
            <div className="absolute bottom-8 left-6 right-6">
              <div className="w-12 h-12 bg-rich-neon rounded-2xl mb-4 flex items-center justify-center">
                <Shield className="w-6 h-6 text-rich-black" />
              </div>
              <h4 className="text-xl font-bold mb-1">Rich Ideia</h4>
              <p className="text-xs text-white/60">Secure Innovation Hub</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-12 text-center bg-gradient-to-br from-rich-blue/20 to-rich-navy/20">
        <h2 className="text-3xl font-display font-bold mb-8">Disponível em breve nas lojas oficiais</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button className="flex items-center gap-4 bg-white text-rich-black px-8 py-4 rounded-2xl font-bold hover:bg-white/90 transition-all">
            <Apple className="w-8 h-8" />
            <div className="text-left">
              <p className="text-[10px] uppercase opacity-60">Download on the</p>
              <p className="text-lg leading-tight">App Store</p>
            </div>
          </button>
          <button className="flex items-center gap-4 bg-white text-rich-black px-8 py-4 rounded-2xl font-bold hover:bg-white/90 transition-all">
            <Play className="w-8 h-8" />
            <div className="text-left">
              <p className="text-[10px] uppercase opacity-60">Get it on</p>
              <p className="text-lg leading-tight">Google Play</p>
            </div>
          </button>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-white/40 mb-4">Ou instale agora como Web App (PWA):</p>
          <div className="flex items-center justify-center gap-2 text-rich-neon font-bold">
            <CheckCircle className="w-5 h-5" />
            <span>Adicionar à Tela de Início</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
