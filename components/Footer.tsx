import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { translations } from '../translations';

const Footer: React.FC = () => {
  // Always use English for footer regardless of app language
  const t = translations['en'].footer;

  return (
    <footer className="bg-white border-t border-slate-100 py-8 mt-auto font-tajawal" dir="ltr">
      <div className="container mx-auto px-6 flex flex-wrap md:flex-nowrap items-center gap-y-6 md:gap-6">
        
        {/* School Logo */}
        <div className="order-2 md:order-1 w-1/2 md:w-1/3 flex justify-center md:justify-start">
          <img 
            src="https://i.ibb.co/bgFrgXkW/meis.png" 
            alt="MEIS Logo" 
            className="w-12 h-12 object-contain opacity-80" 
          />
        </div>
        
        {/* Center: Admin Link & Copyright Text */}
        <div className="order-1 md:order-2 w-full md:w-1/3 flex flex-col items-center justify-center text-center gap-2">
          <Link 
            to="/admin-login" 
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-600 transition-colors px-3 py-1 rounded-full hover:bg-indigo-50 font-bold mb-1"
          >
            <Lock size={12} />
            {t.admin}
          </Link>
          <p className="text-xs text-slate-400 font-medium leading-tight">
            © {new Date().getFullYear()} {t.rights}
          </p>
        </div>

        {/* Right Side: Ataa Logo */}
        <div className="order-3 md:order-3 w-1/2 md:w-1/3 flex justify-center md:justify-end">
          <img 
            src="https://i.ibb.co/cScRz5Tc/ataa.png" 
            alt="Ataa Educational Company" 
            className="h-8 md:h-10 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" 
          />
        </div>

      </div>
    </footer>
  );
};

export default Footer;