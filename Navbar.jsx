import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lamp, Menu, X, User, Wallet, Shield, LogOut, LayoutDashboard, Bell, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetch('/api/notifications')
        .then(res => res.json())
        .then(setNotifications);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = async (id) => {
    await fetch('/api/notifications/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: 1 } : n));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-rich-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="bg-rich-neon/20 p-2 rounded-lg"
            >
              <Lamp className="w-6 h-6 text-rich-neon" />
            </motion.div>
            <span className="text-xl font-display font-bold tracking-tight text-white">
              Rich <span className="text-rich-neon">Ideia</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/marketplace" className="text-sm font-medium text-white/70 hover:text-rich-neon transition-colors">{t('marketplace')}</Link>
            <Link to="/download" className="text-sm font-medium text-white/70 hover:text-rich-neon transition-colors">Download</Link>
            
            <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1">
              <Globe className="w-3 h-3 text-white/40" />
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs text-white/70 focus:outline-none cursor-pointer"
              >
                <option value="pt" className="bg-rich-navy text-white">PT - Português</option>
                <option value="en" className="bg-rich-navy text-white">EN - English</option>
                <option value="fr" className="bg-rich-navy text-white">FR - Français</option>
                <option value="es" className="bg-rich-navy text-white">ES - Español</option>
                <option value="zh" className="bg-rich-navy text-white">ZH - 中文</option>
              </select>
            </div>

            {user ? (
              <>
                <div className="relative">
                  <button 
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="relative p-2 text-white/70 hover:text-rich-neon transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[10px] font-bold flex items-center justify-center rounded-full text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isNotifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 glass-card p-4 shadow-2xl overflow-hidden"
                      >
                        <h4 className="text-sm font-bold mb-3 border-b border-white/10 pb-2">{t('notifications')}</h4>
                        <div className="max-h-64 overflow-y-auto space-y-2">
                          {notifications.length === 0 ? (
                            <p className="text-xs text-white/40 text-center py-4">Nenhuma notificação.</p>
                          ) : (
                            notifications.map(n => (
                              <div 
                                key={n.id} 
                                onClick={() => markAsRead(n.id)}
                                className={`p-3 rounded-lg text-xs cursor-pointer transition-colors ${n.is_read ? 'bg-transparent opacity-60' : 'bg-white/5 border border-white/10'}`}
                              >
                                <p className="font-bold mb-1">{n.title}</p>
                                <p className="text-white/60">{n.message}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/dashboard" className="text-sm font-medium text-white/70 hover:text-rich-neon transition-colors">{t('dashboard')}</Link>
                <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-white/50">{user.role === 'creator' ? 'Criador' : 'Comprador'}</span>
                    <span className="text-sm font-bold text-white">{user.name}</span>
                  </div>
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="w-8 h-8 rounded-full bg-rich-neon/20 flex items-center justify-center border border-rich-neon/30 overflow-hidden hover:bg-white/20 transition-colors"
                  >
                    {user.profile_image ? (
                      <img src={user.profile_image} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                      <User className="w-4 h-4 text-rich-neon" />
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="btn-neon">Começar</Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 bg-rich-navy border-b border-white/10 p-4 md:hidden"
          >
            <div className="flex flex-col gap-4">
              <Link to="/marketplace" onClick={() => setIsMenuOpen(false)}>Marketplace</Link>
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                  <Link to="/wallet" onClick={() => setIsMenuOpen(false)}>Carteira</Link>
                  {user.role === 'founder' && <Link to="/founder" onClick={() => setIsMenuOpen(false)} className="text-rich-neon">Founder Panel</Link>}
                  {user.role === 'admin' && <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin</Link>}
                  <button onClick={handleLogout} className="flex items-center gap-2 text-red-400">
                    <LogOut className="w-4 h-4" /> Sair
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>Registrar</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Dropdown for Desktop */}
      <AnimatePresence>
        {isMenuOpen && user && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="hidden md:block absolute top-20 right-8 w-64 glass-card p-4 shadow-2xl"
          >
            <div className="flex flex-col gap-3">
              <div className="pb-3 border-b border-white/10">
                <p className="text-sm font-bold">{user.name}</p>
                <p className="text-xs text-white/50">{user.email}</p>
              </div>
              <Link to="/dashboard" className="flex items-center gap-2 text-sm hover:text-rich-neon transition-colors">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Link to="/wallet" className="flex items-center gap-2 text-sm hover:text-rich-neon transition-colors">
                <Wallet className="w-4 h-4" /> Carteira
              </Link>
              {user.role === 'founder' && (
                <Link to="/founder" className="flex items-center gap-2 text-sm text-rich-neon hover:text-rich-neon transition-colors">
                  <Shield className="w-4 h-4" /> Founder Panel
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="flex items-center gap-2 text-sm hover:text-rich-neon transition-colors">
                  <Shield className="w-4 h-4" /> Painel Admin
                </Link>
              )}
              <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors pt-2 border-t border-white/10">
                <LogOut className="w-4 h-4" /> Sair
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
