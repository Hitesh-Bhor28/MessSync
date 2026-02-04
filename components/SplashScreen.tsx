import { useEffect } from 'react';
import { Leaf, TrendingDown, Users } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-green-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Logo */}
        <div className="mb-8 animate-bounce-slow">
          <div className="w-32 h-32 bg-white rounded-3xl mx-auto shadow-2xl flex items-center justify-center">
            <div className="text-6xl font-bold text-green-600">M</div>
          </div>
        </div>

        {/* App Name */}
        <div className="mb-4 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-3">MessSync</h1>
          <p className="text-xl text-green-100">Smart Hostel Food Planning</p>
        </div>

        {/* Tagline */}
        <div className="mb-8 animate-fade-in-delay">
          <p className="text-green-50 text-lg max-w-md mx-auto">
            Reducing food waste, one meal at a time
          </p>
        </div>

        {/* Feature Icons */}
        <div className="flex justify-center gap-8 mb-12 animate-fade-in-delay-2">
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Users className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs text-green-50">Students</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <TrendingDown className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs text-green-50">Reduce Waste</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs text-green-50">Eco-Friendly</span>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="animate-fade-in-delay-3">
          <div className="flex justify-center mb-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-white rounded-full animate-pulse animation-delay-200"></div>
              <div className="w-3 h-3 bg-white rounded-full animate-pulse animation-delay-400"></div>
            </div>
          </div>
          <p className="text-green-100 text-sm">Loading...</p>
        </div>

        {/* Version */}
        <div className="mt-12 animate-fade-in-delay-4">
          <p className="text-green-200 text-xs">Version 1.1 • Prepared by Hitesh Bhor</p>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M0,50 C150,80 350,0 600,50 C850,100 1050,20 1200,50 L1200,120 L0,120 Z" 
            fill="rgba(255,255,255,0.1)"
          />
        </svg>
      </div>

      {/* Custom Animations Styles */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-fade-in-delay {
          opacity: 0;
          animation: fade-in 0.8s ease-out 0.3s forwards;
        }
        
        .animate-fade-in-delay-2 {
          opacity: 0;
          animation: fade-in 0.8s ease-out 0.6s forwards;
        }
        
        .animate-fade-in-delay-3 {
          opacity: 0;
          animation: fade-in 0.8s ease-out 0.9s forwards;
        }
        
        .animate-fade-in-delay-4 {
          opacity: 0;
          animation: fade-in 0.8s ease-out 1.2s forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}
