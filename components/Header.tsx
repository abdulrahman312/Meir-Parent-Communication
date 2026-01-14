import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

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
      ease: "linear"
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-6">
        <div className="flex justify-center">
          
          <div 
            className="flex flex-row items-center cursor-pointer group gap-6" 
            onClick={() => navigate('/')}
          >
            {/* Animated Gradient Background around Logo */}
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#3b82f6,#8b5cf6,#ec4899,#3b82f6)] blur-md opacity-60"
              />
              <motion.div 
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

            {/* School Name to the right with Color Animation */}
            <div className="flex flex-col items-start text-left">
              <motion.h1 
                animate={colorAnimation}
                className="text-xl md:text-3xl font-extrabold leading-tight tracking-tight"
              >
                مدرسة الشرق الأوسط العالمية
              </motion.h1>
              <motion.h2 
                animate={colorAnimation}
                className="text-sm md:text-lg font-bold tracking-wide mt-0.5 opacity-90"
              >
                Middle East International School
              </motion.h2>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;