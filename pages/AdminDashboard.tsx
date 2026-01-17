import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComplaintData } from '../types';
import { fetchComplaints, resolveComplaint, deleteComplaint } from '../services/api';
import { SERVICES } from '../constants';
import { translations, OPTION_MAPPINGS } from '../translations';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  MessageCircle, X, CheckSquare, Clock, UserCheck, 
  Search, Filter, MoreHorizontal, LayoutDashboard,
  LogOut, RefreshCw, Phone, User, GraduationCap, School, ChevronRight, ChevronLeft, AlertTriangle, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<ComplaintData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintData | null>(null);
  
  // Modal Mode: 'view' | 'resolve_confirm' | 'delete_confirm'
  const [modalMode, setModalMode] = useState<'view' | 'resolve_confirm' | 'delete_confirm'>('view');
  
  const [adminName, setAdminName] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'resolved'>('pending');
  const [refresh, setRefresh] = useState(0);

  const { language, dir } = useLanguage();
  const t = translations[language].adminDashboard;
  const tServices = translations[language].services;

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin-login');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      const data = await fetchComplaints();
      const sorted = data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setComplaints(sorted);
      setLoading(false);
    };

    loadData();
  }, [navigate, refresh]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedComplaint) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedComplaint]);

  // Check if complaint is older than 48 hours
  const isOverdue = (timestamp: string, status: number) => {
    if (status === 1) return false;
    const diff = Date.now() - new Date(timestamp).getTime();
    return diff > (48 * 60 * 60 * 1000);
  };

  const pendingComplaints = complaints.filter(c => c.status === 0);
  const resolvedComplaints = complaints.filter(c => c.status === 1);
  const displayComplaints = activeTab === 'pending' ? pendingComplaints : resolvedComplaints;

  const handleResolve = async () => {
    if (!selectedComplaint || !adminName) return;
    const success = await resolveComplaint(selectedComplaint.sheetName, selectedComplaint.rowIndex, adminName);
    if (success) {
      setSelectedComplaint(null);
      setModalMode('view');
      setAdminName('');
      setRefresh(prev => prev + 1);
    } else {
      alert("Failed to update. Try again.");
    }
  };

  const handleDelete = async () => {
    if (!selectedComplaint) return;
    const success = await deleteComplaint(selectedComplaint.sheetName, selectedComplaint.rowIndex);
    if (success) {
      setSelectedComplaint(null);
      setModalMode('view');
      setRefresh(prev => prev + 1);
    } else {
      alert("Failed to delete. Try again.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    navigate('/admin-login');
  };

  const openWhatsApp = (number: string) => {
    let cleanNumber = String(number).replace(/\D/g, '');
    if (cleanNumber.startsWith('0')) cleanNumber = cleanNumber.substring(1);
    window.open(`https://wa.me/966${cleanNumber}`, '_blank');
  };

  const getServiceColor = (sheetName: string) => {
    if (sheetName.includes('Academic')) return 'bg-gradient-to-br from-[#06b6d4] to-[#3b82f6] shadow-cyan-200';
    if (sheetName.includes('Administrative')) return 'bg-gradient-to-br from-[#10b981] to-[#059669] shadow-emerald-200';
    if (sheetName.includes('Behavior')) return 'bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] shadow-violet-200';
    if (sheetName.includes('Visit')) return 'bg-gradient-to-br from-[#3b82f6] to-[#2563eb] shadow-blue-200';
    if (sheetName.includes('Suggestion')) return 'bg-gradient-to-br from-[#f59e0b] to-[#d97706] shadow-amber-200';
    return 'bg-slate-700';
  };

  // Helper to translate data from backend (English) to UI (Current Language)
  const getLocalizedData = (complaint: ComplaintData) => {
    const serviceDef = SERVICES.find(s => s.sheetName === complaint.sheetName);
    const serviceTitle = serviceDef 
      ? translations[language].services[serviceDef.id as keyof typeof translations['en']['services']].title 
      : complaint.sheetName;

    const reason = OPTION_MAPPINGS.reasons[complaint.reason]?.[language] || complaint.reason;
    const level = OPTION_MAPPINGS.levels[complaint.schoolLevel]?.[language] || complaint.schoolLevel;

    return { ...complaint, serviceTitle, reason, level };
  };

  const DetailIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;

  return (
    <div className="min-h-screen flex flex-col font-tajawal">
      {/* Top Nav */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-md shadow-indigo-200">
            <LayoutDashboard size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 hidden md:block">{t.title}</h1>
          <h1 className="text-xl font-bold text-slate-800 md:hidden">Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setRefresh(prev => prev + 1)} 
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
            title={t.refresh}
          >
            <RefreshCw size={20} />
          </button>
          <div className="h-6 w-px bg-slate-200"></div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-600 hover:text-red-600 text-sm font-medium transition-colors"
          >
            <LogOut size={16} className="rtl:rotate-180" /> <span className="hidden md:inline">{t.logout}</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 md:px-6 py-8 max-w-7xl">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 hidden md:grid">
          <StatCard 
            title={t.stats.pending} 
            value={pendingComplaints.length} 
            gradient="bg-gradient-to-br from-red-500 to-rose-600"
            icon={<Clock className="text-white" size={24} />} 
          />
          <StatCard 
            title={t.stats.resolved} 
            value={resolvedComplaints.length} 
            gradient="bg-gradient-to-br from-emerald-400 to-teal-500" 
            icon={<CheckSquare className="text-white" size={24} />} 
          />
          <StatCard 
            title={t.stats.total} 
            value={complaints.length} 
            gradient="bg-gradient-to-br from-indigo-500 to-purple-600" 
            icon={<LayoutDashboard className="text-white" size={24} />} 
          />
        </div>

        {/* Mobile Stats */}
         <div className="grid grid-cols-2 gap-4 mb-6 md:hidden">
          <div className="bg-red-500 text-white p-4 rounded-2xl shadow-lg relative overflow-hidden">
             <div className="relative z-10">
               <p className="text-xs font-bold opacity-80">{t.stats.pending}</p>
               <p className="text-2xl font-bold">{pendingComplaints.length}</p>
             </div>
             <Clock className="absolute right-2 rtl:left-2 rtl:right-auto bottom-2 text-white/20" size={32} />
          </div>
          <div className="bg-emerald-500 text-white p-4 rounded-2xl shadow-lg relative overflow-hidden">
             <div className="relative z-10">
               <p className="text-xs font-bold opacity-80">{t.stats.resolved}</p>
               <p className="text-2xl font-bold">{resolvedComplaints.length}</p>
             </div>
             <CheckSquare className="absolute right-2 rtl:left-2 rtl:right-auto bottom-2 text-white/20" size={32} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-slate-200 mb-6 overflow-x-auto">
          <TabButton 
            active={activeTab === 'pending'} 
            onClick={() => setActiveTab('pending')}
            label={t.tabs.pending}
            count={pendingComplaints.length}
          />
          <TabButton 
            active={activeTab === 'resolved'} 
            onClick={() => setActiveTab('resolved')}
            label={t.tabs.resolved}
            count={resolvedComplaints.length}
          />
        </div>

        {/* Content Area */}
        <div className="bg-transparent md:bg-white md:rounded-[2rem] md:shadow-sm md:border md:border-slate-200 overflow-hidden min-h-[400px]">
          {loading ? (
             <div className="p-12 text-center text-slate-400 flex flex-col items-center">
               <RefreshCw className="animate-spin mb-4" size={32} />
               <p>{t.empty.fetch}</p>
             </div>
          ) : displayComplaints.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700">{t.empty.title}</h3>
              <p className="text-slate-400">{t.empty.message.replace('{status}', activeTab === 'pending' ? t.tabs.pending : t.tabs.resolved)}</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left rtl:text-right">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-5 pl-8 rtl:pr-8">{t.table.service}</th>
                      <th className="p-5">{t.table.student}</th>
                      <th className="p-5">{t.table.reason}</th>
                      <th className="p-5">{t.table.date}</th>
                      {activeTab === 'resolved' && <th className="p-5">{t.table.solvedBy}</th>}
                      <th className="p-5 text-right rtl:text-left pr-8 rtl:pl-8">{t.table.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayComplaints.map((c, idx) => {
                       const loc = getLocalizedData(c);
                       const overdue = isOverdue(c.timestamp, c.status);
                       return (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="p-5 pl-8 rtl:pr-8">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-10 rounded-full ${c.status === 0 ? 'bg-red-500' : 'bg-emerald-500'} ${overdue ? 'animate-pulse' : ''}`}></div>
                            <div className="flex flex-col items-start gap-1.5">
                              <div className={`px-3 py-1.5 rounded-lg text-white text-xs font-bold shadow-md ${getServiceColor(c.sheetName)}`}>
                                {loc.serviceTitle}
                              </div>
                              <p className="text-xs text-slate-500">{loc.level}</p>
                              {overdue && (
                                <span className="inline-flex items-center gap-1 text-[10px] bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-md font-bold whitespace-nowrap">
                                  <AlertTriangle size={10} /> {t.overdue}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          <p className="text-sm font-semibold text-slate-700">{c.studentName}</p>
                          <p className="text-xs text-slate-500">{c.grade} - {c.section}</p>
                        </td>
                        <td className="p-5">
                          <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium max-w-[200px] truncate">
                            {loc.reason}
                          </span>
                        </td>
                        <td className="p-5 text-sm text-slate-500">
                          {new Date(c.timestamp).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </td>
                        {activeTab === 'resolved' && (
                          <td className="p-5">
                             <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit">
                               <UserCheck size={14} /> {c.solvedBy}
                             </div>
                          </td>
                        )}
                        <td className="p-5 text-right rtl:text-left pr-8 rtl:pl-8">
                          <button 
                            onClick={() => { setSelectedComplaint(c); setModalMode('view'); }}
                            className="bg-white border border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md"
                          >
                            {t.table.viewDetails}
                          </button>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden flex flex-col gap-4">
                {displayComplaints.map((c, idx) => {
                  const loc = getLocalizedData(c);
                  const overdue = isOverdue(c.timestamp, c.status);
                  return (
                  <div key={idx} className="relative bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 overflow-hidden">
                    
                    {/* Status Bar */}
                    <div className={`absolute top-0 bottom-0 ${dir === 'rtl' ? 'right-0' : 'left-0'} w-1.5 ${c.status === 0 ? 'bg-red-500' : 'bg-emerald-500'} ${overdue ? 'animate-pulse' : ''}`} />

                    {/* Overdue Badge for Mobile */}
                    {overdue && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-red-50 text-red-600 border-b border-x border-red-100 px-3 py-1 rounded-b-xl text-[10px] font-bold shadow-sm z-10 flex items-center gap-1">
                        <AlertTriangle size={10} /> {t.overdue}
                      </div>
                    )}

                    {/* Header: Service Button */}
                    <div className={`flex justify-between items-start ${dir === 'rtl' ? 'mr-3' : 'ml-3'}`}>
                      <div className={`px-4 py-2.5 rounded-xl text-white text-xs font-bold shadow-lg ${getServiceColor(c.sheetName)}`}>
                         {loc.serviceTitle}
                      </div>
                    </div>
                    
                    {/* Student Info */}
                    <div className={dir === 'rtl' ? 'mr-3' : 'ml-3'}>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{t.table.student}</p>
                      <p className="text-sm font-semibold text-slate-700">{loc.level}</p>
                      <p className="text-sm font-semibold text-slate-700">{c.grade} - {c.section}</p>
                    </div>

                    {/* Content: Reason & Date */}
                    <div className={dir === 'rtl' ? 'mr-3' : 'ml-3'}>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{t.table.reason}</p>
                      <p className="text-sm font-bold text-slate-800 leading-snug">{loc.reason}</p>
                      
                      <div className="flex items-center gap-4 mt-3">
                         <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                           <Clock size={14} className="text-slate-400" />
                           {new Date(c.timestamp).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                         </div>
                         {activeTab === 'resolved' && (
                           <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                             <UserCheck size={14} /> {c.solvedBy}
                           </div>
                         )}
                      </div>
                    </div>

                    {/* Footer: Action */}
                    <div className="pt-3 border-t border-slate-50 flex justify-end">
                       <button 
                         onClick={() => { setSelectedComplaint(c); setModalMode('view'); }}
                         className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors"
                       >
                         {t.table.viewDetails} <DetailIcon size={16} />
                       </button>
                    </div>
                  </div>
                )})}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modal Overlay */}
      <AnimatePresence>
        {selectedComplaint && (
          <MotionDiv 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-6 md:p-4 overflow-y-auto"
          >
            <MotionDiv 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl overflow-hidden my-4 md:my-8 flex flex-col relative max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10 shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 leading-tight rtl:pl-4 ltr:pr-4">
                    {getLocalizedData(selectedComplaint).serviceTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                    <Clock size={14} />
                    {new Date(selectedComplaint.timestamp).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedComplaint(null)} 
                  className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:text-white hover:bg-red-500 transition shrink-0 rtl:mr-2 ltr:ml-2 shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="p-6 md:p-8 overflow-y-auto flex-1">
                
                {/* 1. People Involved Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Student Card */}
                  <div className="bg-[#F8FAFC] p-6 rounded-[1.5rem] border border-slate-100 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-indigo-600 mb-1">
                      <GraduationCap size={20} />
                      <span className="text-xs font-bold uppercase tracking-wider">{t.modal.studentInfo}</span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">{t.modal.studentName}</p>
                      <p className="font-bold text-slate-800 text-lg">{selectedComplaint.studentName}</p>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">{t.table.level}</p>
                        <p className="font-semibold text-slate-700 leading-snug">{getLocalizedData(selectedComplaint).level}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">{t.table.grade}</p>
                        <p className="font-semibold text-slate-700">{selectedComplaint.grade} - {selectedComplaint.section}</p>
                      </div>
                    </div>
                  </div>

                  {/* Parent Card */}
                  <div className="bg-[#F8FAFC] p-6 rounded-[1.5rem] border border-slate-100 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-indigo-600 mb-1">
                      <User size={20} />
                      <span className="text-xs font-bold uppercase tracking-wider">{t.modal.parentInfo}</span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">{t.modal.parentName}</p>
                      <p className="font-bold text-slate-800 text-lg">{selectedComplaint.parentName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">{t.modal.contact}</p>
                      
                      <div className="flex flex-col items-start gap-3 mt-1">
                        <span className="font-semibold text-slate-700 font-mono tracking-wide text-lg">{selectedComplaint.contactNumber}</span>
                        <div className="flex flex-wrap gap-2">
                          <button 
                            onClick={() => openWhatsApp(selectedComplaint.contactNumber)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2 text-sm font-bold shadow-md shadow-emerald-200"
                          >
                            <MessageCircle size={16} /> WhatsApp
                          </button>
                          <a 
                            href={`tel:${selectedComplaint.contactNumber}`}
                            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl transition-colors flex items-center gap-2 text-sm font-bold"
                          >
                            <Phone size={16} /> {t.modal.call}
                          </a>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* 2. Issue Details Section */}
                <div className="mb-8">
                  <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                    {t.modal.issueDetails}
                  </h4>
                  <div className="p-6 bg-white border border-slate-200 rounded-[1.5rem] shadow-sm">
                    {/* Updated Reason Layout: Stacked, New line for answer */}
                    <div className="flex flex-col items-start gap-2 mb-4 pb-4 border-b border-slate-100">
                       <span className="text-xs font-bold text-slate-400 uppercase">{t.modal.reason}:</span>
                       <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg uppercase tracking-wide leading-relaxed">
                         {getLocalizedData(selectedComplaint).reason}
                       </span>
                    </div>
                    <div className="space-y-2">
                       <span className="text-xs font-bold text-slate-400 uppercase">{t.modal.desc}:</span>
                       <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base">
                         {selectedComplaint.details}
                       </p>
                    </div>
                  </div>
                </div>

                {/* 3. Previous Communication History */}
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
                    {t.modal.history}
                  </h4>
                  <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-[1.5rem]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                          {t.modal.prevContact}
                        </span>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg font-bold text-sm ${
                          selectedComplaint.previouslyContacted?.trim().toLowerCase() === 'yes' 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'bg-white text-slate-600 border border-slate-200'
                        }`}>
                           {selectedComplaint.previouslyContacted?.trim().toLowerCase() === 'yes' ? (
                             <UserCheck size={16} />
                           ) : (
                             <X size={16} />
                           )}
                           {selectedComplaint.previouslyContacted?.trim().toLowerCase() === 'yes' ? translations[language].form.yes : translations[language].form.no}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                          {t.modal.officialName}
                        </span>
                        <p className="text-slate-800 font-semibold text-lg">
                          {selectedComplaint.officialName || <span className="text-slate-300 italic">{t.modal.na}</span>}
                        </p>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                          {t.modal.officialResponded}
                        </span>
                        <p className="text-slate-800 font-semibold text-lg">
                          {selectedComplaint.officialResponded || <span className="text-slate-300 italic">{t.modal.na}</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end sticky bottom-0 z-10 shrink-0">
                {selectedComplaint.status === 1 ? (
                   <div className="w-full text-center text-emerald-600 font-bold flex items-center justify-center gap-2 bg-emerald-50 py-3 rounded-2xl border border-emerald-100">
                     <CheckSquare size={20} /> {t.modal.resolvedBy} {selectedComplaint.solvedBy}
                   </div>
                ) : (
                  <div className="w-full">
                    
                    {/* VIEW MODE: Resolve & Delete Buttons */}
                    {modalMode === 'view' && (
                      <div className="flex gap-4">
                        <button
                          onClick={() => setModalMode('delete_confirm')}
                          className="flex-1 bg-red-50 text-red-500 py-4 rounded-2xl font-bold hover:bg-red-100 hover:text-red-600 transition border border-red-100 flex justify-center items-center gap-2"
                        >
                          <Trash2 size={20} /> {t.modal.deleteBtn}
                        </button>
                        <button 
                          onClick={() => setModalMode('resolve_confirm')}
                          className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex justify-center items-center gap-2"
                        >
                          <CheckSquare size={20} /> {t.modal.resolveBtn}
                        </button>
                      </div>
                    )}

                    {/* RESOLVE CONFIRMATION */}
                    {modalMode === 'resolve_confirm' && (
                      <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="relative">
                          <input 
                            autoFocus
                            type="text" 
                            placeholder={t.modal.confirmPlaceholder}
                            className="w-full p-4 rtl:pr-12 ltr:pl-12 bg-white border border-indigo-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 shadow-sm"
                            value={adminName}
                            onChange={e => setAdminName(e.target.value)}
                          />
                          <UserCheck className="absolute rtl:right-4 ltr:left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
                        </div>
                        <div className="flex gap-4">
                          <button 
                            onClick={() => setModalMode('view')}
                            className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-2xl font-bold hover:bg-slate-50 transition"
                          >
                            {t.modal.cancel}
                          </button>
                          <button 
                            onClick={handleResolve}
                            disabled={!adminName.trim()}
                            className="flex-1 bg-emerald-500 text-white py-3 rounded-2xl font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {t.modal.confirm}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* DELETE CONFIRMATION */}
                    {modalMode === 'delete_confirm' && (
                      <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 bg-red-50 p-4 rounded-2xl border border-red-100">
                        <div className="flex items-center gap-3 text-red-600 mb-1">
                          <AlertTriangle size={24} className="shrink-0" />
                          <div>
                            <h4 className="font-bold">{t.modal.confirmDeleteTitle}</h4>
                            <p className="text-xs opacity-80">{t.modal.deleteWarning}</p>
                          </div>
                        </div>
                        <div className="flex gap-4 mt-2">
                          <button 
                            onClick={() => setModalMode('view')}
                            className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition"
                          >
                            {t.modal.cancel}
                          </button>
                          <button 
                            onClick={handleDelete}
                            className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition shadow-lg shadow-red-200"
                          >
                            {t.modal.confirmDelete}
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

// UI Components
const StatCard: React.FC<{title: string, value: number, gradient: string, icon: React.ReactNode}> = ({title, value, gradient, icon}) => (
  <div className={`p-6 rounded-[2rem] shadow-lg text-white ${gradient} relative overflow-hidden`}>
     {/* Decor */}
    <div className="absolute top-0 right-0 -mt-2 -mr-2 w-20 h-20 bg-white opacity-20 rounded-full blur-xl" />
    
    <div className="flex items-center justify-between relative z-10">
      <div>
        <p className="text-white/80 text-sm font-bold mb-1">{title}</p>
        <p className="text-3xl font-extrabold">{value}</p>
      </div>
      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
        {icon}
      </div>
    </div>
  </div>
);

const TabButton: React.FC<{active: boolean, onClick: () => void, label: string, count: number}> = ({active, onClick, label, count}) => (
  <button 
    onClick={onClick}
    className={`pb-4 px-2 text-sm font-bold relative transition-colors ${active ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'} whitespace-nowrap`}
  >
    {label}
    <span className={`mx-2 px-2 py-0.5 text-xs rounded-full ${active ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-slate-500'}`}>
      {count}
    </span>
    {active && (
      <MotionDiv 
        layoutId="tabIndicator"
        className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full" 
      />
    )}
  </button>
);

export default AdminDashboard;