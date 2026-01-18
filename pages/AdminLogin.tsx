import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import { useHaptic } from '../hooks/useHaptic';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { language, dir } = useLanguage();
  const { triggerHaptic } = useHaptic();
  
  const t = translations[language].adminLogin;
  const tForm = translations[language].form; // Reuse "Back to Home" translation
  
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const BackIcon = dir === 'rtl' ? ArrowRight : ArrowLeft;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(15);
    if (password === 'Meis@1024') {
      sessionStorage.setItem('isAdmin', 'true');
      navigate('/admin-panel');
    } else {
      triggerHaptic([30, 50, 30]);
      setError(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 bg-slate-50 font-tajawal">
      <div className="bg-white p-10 rounded-[2rem] shadow-2xl shadow-indigo-100 border border-slate-100 w-full max-w-md relative overflow-hidden">
        {/* Decorative blur */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />

        {/* Back to Home Button */}
        <button
          onClick={() => { triggerHaptic(10); navigate('/'); }}
          className="absolute top-6 rtl:left-6 ltr:right-6 text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2 text-sm font-bold"
        >
           {language === 'ar' ? (
             <>
               {tForm.backHome} <BackIcon size={16} />
             </>
           ) : (
             <>
               {tForm.backHome} <BackIcon size={16} />
             </>
           )}
        </button>

        <div className="text-center mb-8 mt-4">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">{t.title}</h2>
          <p className="text-slate-500 mt-2">{t.subtitle}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{t.label}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder={t.placeholder}
              className={`
                w-full p-4 bg-white border rounded-xl outline-none transition-all text-gray-900
                ${error 
                  ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'}
              `}
            />
            {error && <p className="text-xs text-red-500 mt-2 font-medium">{t.error}</p>}
          </div>
          
          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-4 rounded-xl hover:bg-slate-800 transition font-bold flex items-center justify-center gap-2 shadow-lg"
          >
            {t.button} <ArrowIcon size={18} className={dir === 'rtl' ? 'rotate-0' : 'rotate-0'} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;