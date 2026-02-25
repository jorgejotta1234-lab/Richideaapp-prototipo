import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Watermark from './components/Watermark';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import IdeaDetail from './pages/IdeaDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import CreateIdea from './pages/CreateIdea';
import Wallet from './pages/Wallet';
import FounderDashboard from './pages/FounderDashboard';
import Download from './pages/Download';
import Footer from './components/Footer';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

function AppContent() {
  const { user } = useAuth();
  useEffect(() => {
    // Security: Block right-click
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    
    // Security: Detect Print Screen (Best effort)
    const handleKeyDown = (e) => {
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p')) {
        e.preventDefault();
        
        // Log anti-fraud event
        fetch('/api/security/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: 'PRINT_SCREEN_ATTEMPT',
            severity: 'high',
            details: `User tried to capture screen at ${window.location.pathname}`,
            user_id: user?.id
          })
        });

        alert('Captura de tela e impressão bloqueadas por segurança. Esta tentativa foi registrada em nosso sistema antifraude.');
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-rich-black">
      <Navbar />
      <Watermark />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/ideas/:id" element={<IdeaDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
          <Route path="/create-idea" element={<ProtectedRoute role="creator"><CreateIdea /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>} />
          <Route path="/founder" element={<ProtectedRoute role="founder"><FounderDashboard /></ProtectedRoute>} />
          <Route path="/download" element={<Download />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <AppContent />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}
