import React, { useState, useRef } from 'react';
import { Camera, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

const KYCModal = ({ onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStep(2);
    } catch {
      alert('Erro ao acessar a câmera. Por favor, verifique as permissões.');
    }
  };

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const data = canvas.toDataURL('image/jpeg');
      setCapturedImage(data);
      
      // Stop camera
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      
      setStep(3);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    // Simulate facial recognition processing
    setTimeout(async () => {
      try {
        const res = await fetch('/api/users/kyc', { method: 'POST' });
        if (res.ok) {
          setStep(4);
          setTimeout(onSuccess, 2000);
        }
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="glass-card w-full max-w-md p-8 relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="inline-block bg-rich-neon/20 p-3 rounded-2xl mb-4">
            <ShieldCheck className="w-8 h-8 text-rich-neon" />
          </div>
          <h2 className="text-2xl font-display font-bold">Verificação de Identidade</h2>
          <p className="text-white/50 text-sm">Reconhecimento facial obrigatório para ativar sua conta.</p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rich-neon" /> Instruções
              </h4>
              <ul className="text-xs text-white/60 space-y-2 list-disc pl-4">
                <li>Certifique-se de estar em um local bem iluminado.</li>
                <li>Não use óculos escuros, chapéus ou máscaras.</li>
                <li>Mantenha o rosto dentro do círculo durante a captura.</li>
              </ul>
            </div>
            <button onClick={startCamera} className="btn-neon w-full py-4 flex items-center justify-center gap-2">
              <Camera className="w-5 h-5" /> Iniciar Câmera
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center">
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-rich-neon/30 mb-8">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
              <div className="absolute inset-0 border-[16px] border-rich-black/40 pointer-events-none" />
            </div>
            <button onClick={capturePhoto} className="w-20 h-20 bg-rich-neon rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.5)] active:scale-95 transition-transform">
              <div className="w-16 h-16 border-4 border-rich-black rounded-full" />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center">
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-rich-neon mb-8">
              <img src={capturedImage} className="w-full h-full object-cover scale-x-[-1]" alt="Selfie" />
            </div>
            <div className="flex gap-4 w-full">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all">Tentar Novamente</button>
              <button 
                onClick={handleVerify}
                disabled={loading}
                className="btn-neon flex-1 py-3 flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Analisando...' : 'Verificar Agora'}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-2">Identidade Verificada!</h2>
            <p className="text-white/60">Sua conta foi habilitada com sucesso.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KYCModal;
