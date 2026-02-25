import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Globe, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

const Home = () => {
  const { t } = useLanguage();
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-rich-neon/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-rich-neon/10 text-rich-neon border border-rich-neon/20 rounded-full">
              {t('global_b2b')}
            </span>
            <h1 className="text-5xl lg:text-7xl font-display font-bold mb-8 leading-tight">
              {t('hero_title')}
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-white/60 mb-10">
              A primeira plataforma global altamente segura para compra e venda de soluções inovadoras, 
              protegida por criptografia de nível militar e segurança jurídica total.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/marketplace" className="btn-neon text-lg px-10 py-4 flex items-center gap-2">
                {t('marketplace')} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/register" className="px-10 py-4 rounded-full border border-white/20 hover:bg-white/5 transition-all text-lg">
                {t('sell_ideas')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-rich-navy/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8">
              <Shield className="w-12 h-12 text-rich-neon mb-6" />
              <h3 className="text-xl font-bold mb-4">{t('legal_security')}</h3>
              <p className="text-white/60">{t('legal_desc')}</p>
            </div>
            <div className="glass-card p-8">
              <Lock className="w-12 h-12 text-rich-neon mb-6" />
              <h3 className="text-xl font-bold mb-4">{t('privacy_total')}</h3>
              <p className="text-white/60">{t('privacy_desc')}</p>
            </div>
            <div className="glass-card p-8">
              <Globe className="w-12 h-12 text-rich-neon mb-6" />
              <h3 className="text-xl font-bold mb-4">{t('global_reach')}</h3>
              <p className="text-white/60">{t('global_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Explanatory Video Section */}
      <section className="py-20 bg-rich-blue/20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold mb-8">Como Funciona a Rich Ideia?</h2>
          <div className="aspect-video glass-card overflow-hidden relative group cursor-pointer">
            <img 
              src="https://picsum.photos/seed/tech/1280/720" 
              className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" 
              alt="Video Thumbnail"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-rich-neon rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.5)] group-hover:scale-110 transition-transform">
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-rich-black border-b-[12px] border-b-transparent ml-2" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 text-left">
              <p className="text-rich-neon font-bold uppercase tracking-widest text-xs mb-1">Vídeo Explicativo</p>
              <h4 className="text-xl font-bold">Segurança e Inovação em um só lugar</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold mb-12">{t('why_trust')}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "Verificação KYC",
              "Escrow Financeiro",
              "Blockchain Ready",
              "Suporte 24/7"
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-2 text-white/80">
                <CheckCircle className="w-5 h-5 text-rich-neon" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
