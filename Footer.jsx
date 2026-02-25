import React from 'react';
import { Link } from 'react-router-dom';
import { Lamp, Shield, Globe, Lock, Mail, Phone, MapPin, Linkedin, Twitter, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-rich-navy/50 border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Lamp className="w-8 h-8 text-rich-neon" />
              <span className="text-2xl font-display font-bold">Rich Ideia</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              A elite global de inovação. Protegendo a propriedade intelectual e conectando mentes brilhantes a investidores visionários.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-rich-neon/20 hover:text-rich-neon transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-rich-neon/20 hover:text-rich-neon transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-rich-neon/20 hover:text-rich-neon transition-all">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Plataforma</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><Link to="/marketplace" className="hover:text-rich-neon transition-colors">Marketplace</Link></li>
              <li><Link to="/register" className="hover:text-rich-neon transition-colors">Vender Ideias</Link></li>
              <li><Link to="/login" className="hover:text-rich-neon transition-colors">Comprar Ideias</Link></li>
              <li><Link to="/download" className="hover:text-rich-neon transition-colors">Download App</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Suporte & Legal</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><a href="#" className="hover:text-rich-neon transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-rich-neon transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-rich-neon transition-colors">Acordo de NDA</a></li>
              <li><a href="#" className="hover:text-rich-neon transition-colors">Centro de Ajuda</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Contato</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-rich-neon" />
                <span>contato@richideia.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-rich-neon" />
                <span>+244 9XX XXX XXX</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-rich-neon" />
                <span>Luanda, Angola</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
          <p>© 2026 Rich Ideia. Desenvolvido por João Sebastião José.</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> SSL Secured</span>
            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> AES-256 Encrypted</span>
            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Global Network</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
