import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVICES } from '../constants';
import { translations } from '../translations';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

const MotionDiv = motion.div as any;
const MotionP = motion.p as any;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { language, dir } = useLanguage();
  const t = translations[language].home;
  const tServices = translations[language].services;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-[calc(100vh-200px)] relative overflow-hidden">
      
      <div className="container mx-auto px-6 py-10 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <MotionDiv
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             className="relative inline-block"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 font-tajawal leading-tight py-2">
              {t.welcome}
            </h1>
            <MotionDiv 
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="absolute -top-4 -right-6 md:-right-8 text-yellow-400"
            >
              <Sparkles size={32} fill="currentColor" />
            </MotionDiv>
          </MotionDiv>
          
          <MotionP 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto font-tajawal mt-2 leading-relaxed"
          >
            {t.subtitle}
          </MotionP>
        </div>

        {/* Cards Grid */}
        <MotionDiv 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {SERVICES.map((service, idx) => {
            // Dashboard-inspired gradients
            const cardStyles = [
              {
                gradient: 'bg-gradient-to-br from-[#06b6d4] to-[#3b82f6]', // Cyan to Blue (Academic)
                shadow: 'shadow-cyan-200',
                iconBg: 'bg-white/20'
              },
              {
                gradient: 'bg-gradient-to-br from-[#10b981] to-[#059669]', // Emerald to Green (Admin)
                shadow: 'shadow-emerald-200',
                iconBg: 'bg-white/20'
              },
              {
                gradient: 'bg-gradient-to-br from-[#8b5cf6] to-[#6366f1]', // Violet to Indigo (Behavior)
                shadow: 'shadow-violet-200',
                iconBg: 'bg-white/20'
              },
              {
                gradient: 'bg-gradient-to-br from-[#3b82f6] to-[#2563eb]', // Blue (Visit)
                shadow: 'shadow-blue-200',
                iconBg: 'bg-white/20'
              },
              {
                gradient: 'bg-gradient-to-br from-[#f59e0b] to-[#d97706]', // Amber (Suggestion)
                shadow: 'shadow-amber-200',
                iconBg: 'bg-white/20'
              },
            ];
            
            const style = cardStyles[idx % cardStyles.length];
            const serviceContent = tServices[service.id as keyof typeof tServices];

            return (
              <MotionDiv
                key={service.id}
                variants={item}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/request/${service.id}`)}
                className={`
                  group relative overflow-hidden rounded-[2.5rem] p-8 
                  cursor-pointer shadow-xl ${style.shadow} ${style.gradient}
                  text-white flex flex-col justify-between min-h-[220px] font-tajawal
                `}
              >
                {/* Decorative Wave/Blob in background */}
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-black opacity-5 rounded-full blur-2xl" />

                <div className="relative z-10 flex justify-between items-start">
                  <div className={`${style.iconBg} backdrop-blur-md p-4 rounded-2xl`}>
                    <service.icon size={32} className="text-white" strokeWidth={2} />
                  </div>
                  <div className={`bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform ${dir === 'rtl' ? '-translate-x-4 group-hover:translate-x-0' : 'translate-x-4 group-hover:translate-x-0'}`}>
                    <ArrowIcon size={20} className="text-white" />
                  </div>
                </div>

                <div className="relative z-10 mt-6">
                  <h3 className="text-2xl font-bold mb-2 tracking-tight">
                    {serviceContent.title}
                  </h3>
                  <p className="text-white/80 text-sm font-medium leading-relaxed ltr:pr-8 rtl:pl-8">
                    {serviceContent.description}
                  </p>
                </div>
              </MotionDiv>
            );
          })}
        </MotionDiv>
      </div>
    </div>
  );
};

export default Home;