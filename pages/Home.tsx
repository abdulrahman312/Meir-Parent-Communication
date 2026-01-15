import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVICES } from '../constants';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] relative overflow-hidden">
      
      <div className="container mx-auto px-6 py-10 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6"
          >
            <Sparkles size={14} className="text-indigo-500 fill-indigo-500" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Welcome Parents</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight"
          >
            MEIS Parent <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
              Communication Portal
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 font-medium max-w-2xl mx-auto"
          >
            We are here to listen. Select a category below to submit your request directly to the relevant department.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <motion.div 
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
            ];
            
            const style = cardStyles[idx % cardStyles.length];

            return (
              <motion.div
                key={service.id}
                variants={item}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/request/${service.id}`)}
                className={`
                  group relative overflow-hidden rounded-[2.5rem] p-8 
                  cursor-pointer shadow-xl ${style.shadow} ${style.gradient}
                  text-white flex flex-col justify-between min-h-[220px]
                `}
              >
                {/* Decorative Wave/Blob in background */}
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-black opacity-5 rounded-full blur-2xl" />

                <div className="relative z-10 flex justify-between items-start">
                  <div className={`${style.iconBg} backdrop-blur-md p-4 rounded-2xl`}>
                    <service.icon size={32} className="text-white" strokeWidth={2} />
                  </div>
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
                    <ArrowRight size={20} className="text-white" />
                  </div>
                </div>

                <div className="relative z-10 mt-6">
                  <h3 className="text-2xl font-bold mb-2 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-white/80 text-sm font-medium leading-relaxed pr-8">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;