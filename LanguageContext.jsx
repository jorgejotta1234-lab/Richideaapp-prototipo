import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  welcome: {
    pt: 'Bem-vindo à Rich Ideia',
    en: 'Welcome to Rich Ideia',
    fr: 'Bienvenue sur Rich Ideia',
    es: 'Bienvenido a Rich Ideia',
    zh: '欢迎来到 Rich Ideia'
  },
  marketplace: {
    pt: 'Marketplace',
    en: 'Marketplace',
    fr: 'Marché',
    es: 'Mercado',
    zh: '市场'
  },
  dashboard: {
    pt: 'Painel',
    en: 'Dashboard',
    fr: 'Tableau de bord',
    es: 'Panel',
    zh: '仪表板'
  },
  login: {
    pt: 'Entrar',
    en: 'Login',
    fr: 'Connexion',
    es: 'Iniciar sesión',
    zh: '登录'
  },
  register: {
    pt: 'Registrar',
    en: 'Register',
    fr: 'S\'inscrire',
    es: 'Registrarse',
    zh: '注册'
  },
  buy_ideas: {
    pt: 'Comprar Ideias',
    en: 'Buy Ideas',
    fr: 'Acheter des idées',
    es: 'Comprar ideas',
    zh: '购买创意'
  },
  sell_ideas: {
    pt: 'Vender Ideias',
    en: 'Sell Ideas',
    fr: 'Vendre des idées',
    es: 'Vender ideas',
    zh: '出售创意'
  },
  notifications: {
    pt: 'Notificações',
    en: 'Notifications',
    fr: 'Notifications',
    es: 'Notificaciones',
    zh: '通知'
  },
  wallet: {
    pt: 'Carteira',
    en: 'Wallet',
    fr: 'Portefeuille',
    es: 'Billetera',
    zh: '钱包'
  },
  logout: {
    pt: 'Sair',
    en: 'Logout',
    fr: 'Déconnexion',
    es: 'Cerrar sesión',
    zh: '退出登录'
  },
  global_b2b: {
    pt: 'Plataforma Global B2B',
    en: 'Global B2B Platform',
    fr: 'Plateforme B2B mondiale',
    es: 'Plataforma Global B2B',
    zh: '全球 B2B 平台'
  },
  hero_title: {
    pt: 'Onde Grandes Ideias Encontram Grandes Investidores',
    en: 'Where Great Ideas Meet Great Investors',
    fr: 'Où les grandes idées rencontrent les grands investisseurs',
    es: 'Donde las grandes ideas encuentran grandes inversores',
    zh: '伟大的创意与伟大的投资者相遇的地方'
  },
  legal_security: {
    pt: 'Segurança Jurídica',
    en: 'Legal Security',
    fr: 'Sécurité juridique',
    es: 'Seguridad jurídica',
    zh: '法律安全'
  },
  legal_desc: {
    pt: 'NDAs obrigatórios, contratos automáticos e sistema escrow para garantir que cada transação seja protegida.',
    en: 'Mandatory NDAs, automatic contracts and escrow system to ensure every transaction is protected.',
    fr: 'NDA obligatoires, contrats automatiques et système d\'entiercement pour garantir la protection de chaque transaction.',
    es: 'NDAs obligatorios, contratos automáticos y sistema escrow para garantizar que cada transacción esté protegida.',
    zh: '强制性 NDA、自动合同和托管系统，确保每笔交易都受到保护。'
  },
  privacy_total: {
    pt: 'Privacidade Total',
    en: 'Total Privacy',
    fr: 'Confidentialité totale',
    es: 'Privacidad total',
    zh: '完全隐私'
  },
  privacy_desc: {
    pt: 'Criptografia AES-256, bloqueio de downloads e marca d\'água dinâmica para proteger sua propriedade intelectual.',
    en: 'AES-256 encryption, download blocking and dynamic watermark to protect your intellectual property.',
    fr: 'Cryptage AES-256, blocage des téléchargements et filigrane dynamique pour proteger sua propriedade intelectual.',
    es: 'Cifrado AES-256, bloqueo de descargas y marca de agua dinámica para proteger su propiedad intelectual.',
    zh: 'AES-256 加密、下载拦截和动态水印，保护您的知识产权。'
  },
  global_reach: {
    pt: 'Alcance Global',
    en: 'Global Reach',
    fr: 'Portée mondiale',
    es: 'Alcance global',
    zh: '全球触达'
  },
  global_desc: {
    pt: 'Conectando criadores de Angola para o mundo, com pagamentos internacionais e suporte multi-moeda.',
    en: 'Connecting creators from Angola to the world, with international payments and multi-currency support.',
    fr: 'Connecter les créateurs de l\'Angola au monde, avec des paiements internationaux et un support multi-devises.',
    es: 'Conectando creadores de Angola con el mundo, con pagos internacionales y soporte multimoneda.',
    zh: '将安哥拉的创作者与世界联系起来，提供国际支付和多货币支持。'
  },
  why_trust: {
    pt: 'Por que confiar na Rich Ideia?',
    en: 'Why trust Rich Ideia?',
    fr: 'Pourquoi faire confiance à Rich Ideia ?',
    es: '¿Por qué confiar en Rich Ideia?',
    zh: '为什么信任 Rich Ideia？'
  },
  founder: {
    pt: 'Fundador',
    en: 'Founder',
    fr: 'Fondateur',
    es: 'Fundador',
    zh: '创始人'
  },
  country: {
    pt: 'País',
    en: 'Country',
    fr: 'Pays',
    es: 'País',
    zh: '国家'
  }
};

const LanguageContext = createContext(undefined);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'pt';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
