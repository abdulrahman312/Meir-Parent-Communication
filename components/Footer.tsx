import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 py-8 mt-auto">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-slate-400 font-medium">
          © {new Date().getFullYear()} MEIS Parent Communication Portal. All rights reserved.
        </p>
        
        <Link 
          to="/admin-login" 
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-indigo-600 transition-colors px-4 py-2 rounded-full hover:bg-indigo-50 font-bold"
        >
          <Lock size={12} />
          Admin Access
        </Link>
      </div>
    </footer>
  );
};

export default Footer;