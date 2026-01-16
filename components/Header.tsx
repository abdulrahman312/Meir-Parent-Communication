import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import { Globe, MessageCircle } from 'lucide-react';

const MotionDiv = motion.div as any;
const MotionH1 = motion.h1 as any;
const MotionH2 = motion.h2 as any;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { language, toggleLanguage, dir } = useLanguage();
  const t = translations[language].header;

  // Define a consistent animation for both the background glow and the text
  const colorAnimation = {
    color: [
      "#3b82f6", // Blue
      "#8b5cf6", // Violet
      "#ec4899", // Pink
      "#f59e0b", // Amber
      "#10b981", // Emerald
      "#3b82f6"  // Back to Blue
    ],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "linear" as const
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 shadow-sm border-b border-white/50" dir="ltr">
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="flex justify-center items-center relative">
          
          <div 
            className="flex flex-row items-center justify-center cursor-pointer group gap-3 md:gap-6 text-center" 
            onClick={() => navigate('/')}
          >
            {/* Animated Gradient Background around Logo */}
            <div className="relative w-16 h-16 md:w-28 md:h-28 flex items-center justify-center shrink-0">
              <MotionDiv 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#3b82f6,#8b5cf6,#ec4899,#3b82f6)] blur-md opacity-60"
              />
              <MotionDiv 
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="absolute inset-1 rounded-full bg-[conic-gradient(from_180deg,#06b6d4,#10b981,#f59e0b,#06b6d4)] blur-sm opacity-60"
              />
              
              {/* Logo Image */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                 <img 
                  src="https://i.ibb.co/bgFrgXkW/meis.png" 
                  alt="MEIS Logo" 
                  className="w-[90%] h-[90%] object-contain drop-shadow-lg rounded-full"
                />
              </div>
            </div>

            {/* School Name and Toggle - Centered on mobile and desktop */}
            <div className="flex flex-col items-center text-center">
              <MotionH1 
                animate={colorAnimation}
                className="text-sm sm:text-xl md:text-3xl font-extrabold leading-tight tracking-tight font-tajawal"
              >
                {translations.ar.header.schoolNameAr}
              </MotionH1>
              <MotionH2 
                animate={colorAnimation}
                className="text-xs sm:text-sm md:text-lg font-bold tracking-wide mt-0.5 opacity-90"
              >
                {translations.en.header.schoolNameEn}
              </MotionH2>

              <div className="flex flex-wrap justify-center items-center gap-2 mt-2 md:mt-3">
                {/* Language Toggle Button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleLanguage(); }}
                  className="flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all shadow-sm border border-slate-200"
                >
                  <Globe size={14} className="text-indigo-500" />
                  <span>{t.toggleBtn}</span>
                </button>

                {/* Parent Portal Badge */}
                <div 
                  className="flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold shadow-sm border border-slate-200 cursor-default"
                >
                  <MessageCircle size={14} className="text-indigo-500" />
                  <span>{t.portalTitle}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;