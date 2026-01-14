import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Meis@1024') {
      sessionStorage.setItem('isAdmin', 'true');
      navigate('/admin-panel');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 bg-slate-50">
      <div className="bg-white p-10 rounded-[2rem] shadow-2xl shadow-indigo-100 border border-slate-100 w-full max-w-md relative overflow-hidden">
        {/* Decorative blur */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Access</h2>
          <p className="text-slate-500 mt-2">Authorized personnel only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Security Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="••••••••••"
              className={`
                w-full p-4 bg-white border rounded-xl outline-none transition-all text-gray-900
                ${error 
                  ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'}
              `}
            />
            {error && <p className="text-xs text-red-500 mt-2 font-medium">Incorrect password provided</p>}
          </div>
          
          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-4 rounded-xl hover:bg-slate-800 transition font-bold flex items-center justify-center gap-2 shadow-lg"
          >
            Access Dashboard <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;