import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SERVICES, GRADES, SECTIONS, SCHOOL_LEVELS, REASONS } from '../constants';
import { translations, OPTION_MAPPINGS } from '../translations';
import { useLanguage } from '../contexts/LanguageContext';
import { FormData } from '../types';
import { submitComplaint } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Send, CheckCircle, AlertCircle, ChevronDown, FileText, User } from 'lucide-react';
import { useHaptic } from '../hooks/useHaptic';

const MotionDiv = motion.div as any;
const MotionP = motion.p as any;
const MotionH1 = motion.h1 as any;
const MotionLabel = motion.label as any;
const MotionButton = motion.button as any;

const RequestForm: React.FC = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { language, dir } = useLanguage();
  const { triggerHaptic } = useHaptic();
  const t = translations[language].form;
  const tService = translations[language].services[serviceId as keyof typeof translations['en']['services']];
  
  const service = SERVICES.find(s => s.id === serviceId);

  useEffect(() => {
    if (!service) navigate('/');
    // Scroll handling is now done by ScrollToTop component
  }, [service, navigate]);

  const [formData, setFormData] = useState<FormData>({
    parentName: '',
    contactNumber: '',
    studentName: '',
    grade: GRADES[0],
    section: SECTIONS[0],
    schoolLevel: SCHOOL_LEVELS[0],
    reason: '',
    previouslyContacted: 'No',
    officialName: '',
    officialResponded: 'No',
    details: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const getTheme = (id: string) => {
    switch (id) {
      case 'academic':
        return {
          header: 'from-[#06b6d4] to-[#3b82f6]',
          accent: '#3b82f6',
          bgLight: 'bg-blue-50/50',
          ring: 'focus:ring-blue-100',
          border: 'focus:border-blue-400',
          button: 'bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] shadow-blue-200',
          aura: 'bg-blue-400/10',
          textDark: 'text-blue-700',
          glowBorder: 'border-cyan-400/40 shadow-[0_0_35px_rgba(6,182,212,0.25)]'
        };
      case 'administrative':
        return {
          header: 'from-[#10b981] to-[#059669]',
          accent: '#10b981',
          bgLight: 'bg-emerald-50/50',
          ring: 'focus:ring-emerald-100',
          border: 'focus:border-emerald-400',
          button: 'bg-gradient-to-r from-[#10b981] to-[#059669] shadow-emerald-200',
          aura: 'bg-emerald-400/10',
          textDark: 'text-emerald-700',
          glowBorder: 'border-emerald-400/40 shadow-[0_0_35px_rgba(16,185,129,0.25)]'
        };
      case 'behavior':
        return {
          header: 'from-[#8b5cf6] to-[#6366f1]',
          accent: '#8b5cf6',
          bgLight: 'bg-violet-50/50',
          ring: 'focus:ring-violet-100',
          border: 'focus:border-violet-400',
          button: 'bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] shadow-violet-200',
          aura: 'bg-violet-400/10',
          textDark: 'text-violet-700',
          glowBorder: 'border-violet-400/40 shadow-[0_0_35px_rgba(139,92,246,0.25)]'
        };
      case 'visit':
        return {
          header: 'from-[#3b82f6] to-[#2563eb]',
          accent: '#2563eb',
          bgLight: 'bg-indigo-50/50',
          ring: 'focus:ring-indigo-100',
          border: 'focus:border-indigo-400',
          button: 'bg-gradient-to-r from-[#3b82f6] to-[#2563eb] shadow-indigo-200',
          aura: 'bg-indigo-400/10',
          textDark: 'text-indigo-700',
          glowBorder: 'border-indigo-400/40 shadow-[0_0_35px_rgba(59,130,246,0.25)]'
        };
      case 'suggestion':
        return {
          header: 'from-[#f59e0b] to-[#d97706]',
          accent: '#f59e0b',
          bgLight: 'bg-amber-50/50',
          ring: 'focus:ring-amber-100',
          border: 'focus:border-amber-400',
          button: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] shadow-amber-200',
          aura: 'bg-amber-400/10',
          textDark: 'text-amber-700',
          glowBorder: 'border-amber-400/40 shadow-[0_0_35px_rgba(245,158,11,0.25)]'
        };
      default:
        return {
          header: 'from-slate-700 to-slate-900',
          accent: '#475569',
          bgLight: 'bg-slate-50/50',
          ring: 'focus:ring-slate-100',
          border: 'focus:border-slate-400',
          button: 'bg-slate-900 shadow-slate-200',
          aura: 'bg-slate-400/5',
          textDark: 'text-slate-700',
          glowBorder: 'border-white shadow-2xl shadow-slate-200/50'
        };
    }
  };

  const theme = service ? getTheme(service.id) : getTheme('default');
  const isSuggestionService = service?.id === 'suggestion';
  const BackIcon = dir === 'rtl' ? ArrowRight : ArrowLeft;

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.parentName) errors.parentName = t.validation.parentName;
    const phoneRegex = /^05\d{8}$/;
    if (!formData.contactNumber) {
      errors.contactNumber = t.validation.contact;
    } else if (!phoneRegex.test(formData.contactNumber)) {
      errors.contactNumber = t.validation.contactFormat;
    }
    if (!formData.studentName) errors.studentName = t.validation.studentName;
    if (!isSuggestionService && !formData.reason) errors.reason = t.validation.reason;
    if (!formData.details) errors.details = t.validation.details;
    if (!isSuggestionService && formData.previouslyContacted === 'Yes') {
        if(!formData.officialName) errors.officialName = t.validation.officialName;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(20);
    if (!validate()) {
      triggerHaptic([30, 50, 30]); // Error vibration
      return;
    }
    if (!service) return;

    setStatus('submitting');
    const payload: any = { ...formData };
    if (isSuggestionService) {
      payload.reason = 'Suggestion';
      payload.previouslyContacted = '';
      payload.officialName = '';
      payload.officialResponded = '';
    } else {
       if (payload.previouslyContacted === 'No') {
        payload.officialName = '';
        payload.officialResponded = ''; 
      }
    }

    const success = await submitComplaint(service.sheetName, payload);
    if (success) {
      triggerHaptic([50, 30, 50]);
      setStatus('success');
    } else {
      setStatus('error');
    }
  };

  if (!service) return null;

  if (status === 'success') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <MotionDiv 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl text-center max-w-lg w-full border border-slate-100 font-tajawal relative overflow-hidden"
        >
          <div className={`absolute top-0 inset-x-0 h-2 bg-gradient-to-r ${theme.header}`} />
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">{t.successTitle}</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
             {t.successMessage.replace('{service}', tService?.title || '')}
          </p>
          <button 
            onClick={() => { triggerHaptic(10); navigate('/'); }}
            className={`w-full text-white font-bold py-4 rounded-2xl transition-all shadow-xl ${theme.button}`}
          >
            {t.backHome}
          </button>
        </MotionDiv>
      </div>
    );
  }

  const availableGrades = (level: string) => {
    if (level.includes('Kindergarten')) return GRADES.slice(0, 3);
    if (level.includes('Primary')) return GRADES.slice(3, 6);
    if (level.includes('Elementary')) return GRADES.slice(6, 9);
    if (level.includes('Middle')) return GRADES.slice(9, 12);
    if (level.includes('High')) return GRADES.slice(12, 15);
    return GRADES;
  };

  return (
    <div className={`min-h-screen ${theme.bgLight} pb-20 font-tajawal relative overflow-hidden`}>
      {/* Dynamic Background Aura */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] ${theme.aura} blur-[120px] rounded-full -z-10`} />

      <div className={`bg-gradient-to-br ${theme.header} text-white pb-32 pt-12 px-6 rounded-b-[4rem] shadow-2xl relative`}>
        <div className="container mx-auto max-w-4xl relative z-10">
          <button 
            onClick={() => { triggerHaptic(5); navigate('/'); }} 
            className="flex items-center text-white/80 hover:text-white mb-8 transition-colors text-sm font-bold bg-white/10 backdrop-blur-md px-4 py-2 rounded-full w-fit border border-white/20"
          >
            <BackIcon size={16} className={`mx-2 ${dir === 'rtl' ? 'rotate-0' : 'rotate-180'}`} />
            {t.backButton}
          </button>
          
          <div className="flex flex-row items-center gap-5 md:gap-8">
            <MotionDiv 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-4 md:p-6 bg-white/20 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] border border-white/30 shadow-2xl flex-shrink-0 flex items-center justify-center`}
            >
              <service.icon size={48} className="text-white drop-shadow-lg md:w-14 md:h-14" />
            </MotionDiv>
            <div className="space-y-1 md:space-y-2">
              <MotionH1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl md:text-5xl font-extrabold tracking-tight leading-tight"
              >
                {tService?.title}
              </MotionH1>
              <MotionP 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm md:text-lg text-white/90 font-medium max-w-2xl leading-relaxed hidden md:block"
              >
                {tService?.description}
              </MotionP>
            </div>
          </div>
          {/* Mobile Description */}
          <MotionP 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-white/90 font-medium mt-6 leading-relaxed md:hidden"
          >
            {tService?.description}
          </MotionP>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-4xl -mt-20 relative z-20">
        <MotionDiv 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white/80 backdrop-blur-2xl rounded-[3rem] border-2 transition-all duration-500 overflow-hidden ${theme.glowBorder}`}
        >
          <form onSubmit={handleSubmit} className="p-8 md:p-14 space-y-14">
            
            {/* Step 1 */}
            <section className="relative">
              <div className="flex items-center gap-4 mb-10">
                <div className={`w-12 h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg bg-gradient-to-br ${theme.header}`}>
                  <User size={24} />
                </div>
                <h3 className={`text-2xl font-black tracking-tight ${theme.textDark}`}>{t.section1}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup 
                  label={t.parentName}
                  value={formData.parentName}
                  onChange={v => setFormData({...formData, parentName: v})}
                  error={formErrors.parentName}
                  placeholder={t.parentNamePlaceholder}
                  theme={theme}
                />

                <InputGroup 
                  label={t.contactNumber}
                  value={formData.contactNumber}
                  onChange={v => {
                    const val = v.replace(/\D/g, '');
                    setFormData({...formData, contactNumber: val});
                  }}
                  error={formErrors.contactNumber}
                  placeholder={t.contactNumberPlaceholder}
                  maxLength={10}
                  type="tel"
                  theme={theme}
                />

                <InputGroup 
                  label={t.studentName}
                  value={formData.studentName}
                  onChange={v => setFormData({...formData, studentName: v})}
                  error={formErrors.studentName}
                  placeholder={t.studentNamePlaceholder}
                  theme={theme}
                />

                <SelectGroup 
                  label={t.schoolLevel}
                  value={formData.schoolLevel}
                  options={SCHOOL_LEVELS}
                  mappings={OPTION_MAPPINGS.levels}
                  language={language}
                  theme={theme}
                  onChange={v => {
                    triggerHaptic(5);
                    const newGrades = availableGrades(v);
                    setFormData({
                      ...formData, 
                      schoolLevel: v,
                      grade: newGrades[0] 
                    });
                  }}
                />

                <SelectGroup 
                  label={t.grade}
                  value={formData.grade}
                  options={availableGrades(formData.schoolLevel)}
                  theme={theme}
                  onChange={v => { triggerHaptic(5); setFormData({...formData, grade: v}); }}
                />

                <SelectGroup 
                  label={t.classSection}
                  value={formData.section}
                  options={SECTIONS}
                  theme={theme}
                  onChange={v => { triggerHaptic(5); setFormData({...formData, section: v}); }}
                />
              </div>
            </section>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            {/* Step 2 */}
            <section className="relative">
              <div className="flex items-center gap-4 mb-10">
                <div className={`w-12 h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg bg-gradient-to-br ${theme.header}`}>
                   <FileText size={24} />
                </div>
                <h3 className={`text-2xl font-black tracking-tight ${theme.textDark}`}>
                  {isSuggestionService ? t.section2Suggestion : t.section2}
                </h3>
              </div>
              
              <div className="space-y-10">
                {!isSuggestionService && (
                  <div>
                    <label className="block text-base font-bold text-slate-700 mb-6">{t.reason}</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {REASONS[service.sheetName]?.map((reason) => {
                        const isSelected = formData.reason === reason;
                        const displayText = OPTION_MAPPINGS.reasons[reason]?.[language] || reason;
                        
                        return (
                          <MotionLabel 
                            key={reason} 
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                              relative flex items-center p-5 border-2 rounded-[1.25rem] cursor-pointer transition-all duration-300
                              ${isSelected 
                                ? 'bg-white border-transparent shadow-xl ring-2' 
                                : 'border-slate-100 hover:border-slate-300 bg-slate-50/30'}
                            `}
                            style={{
                                boxShadow: isSelected ? `0 10px 25px -5px ${theme.accent}33` : '',
                                ringColor: isSelected ? theme.accent : 'transparent'
                            }}
                            onClick={() => triggerHaptic(8)}
                          >
                            <div 
                              className={`w-6 h-6 rounded-full border-2 mx-3 flex items-center justify-center transition-all ${isSelected ? '' : 'border-slate-300'}`}
                              style={{ 
                                borderColor: isSelected ? theme.accent : '',
                                backgroundColor: isSelected ? `${theme.accent}11` : 'transparent'
                              }}
                            >
                                {isSelected && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.accent }} />}
                            </div>

                            <input
                              type="radio"
                              name="reason"
                              value={reason}
                              checked={isSelected}
                              onChange={e => setFormData({...formData, reason: e.target.value})}
                              className="hidden" 
                            />
                            <span className={`text-sm font-bold ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                              {displayText}
                            </span>
                          </MotionLabel>
                        );
                      })}
                    </div>
                    <AnimatePresence>
                      {formErrors.reason && (
                        <MotionP initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-xs text-red-500 mt-3 font-bold flex items-center gap-1">
                          <AlertCircle size={14} /> {formErrors.reason}
                        </MotionP>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {!isSuggestionService && (
                  <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 relative overflow-hidden">
                    <div className="relative z-10">
                      <label className="block text-base font-bold text-slate-700 mb-6">
                        {t.previousContact}
                      </label>
                      <div className="flex gap-6">
                        {['Yes', 'No'].map(opt => (
                          <label key={opt} className="flex items-center cursor-pointer group" onClick={() => triggerHaptic(5)}>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mx-3 transition-all ${formData.previouslyContacted === opt ? '' : 'border-slate-300 group-hover:border-slate-400'}`} style={{ borderColor: formData.previouslyContacted === opt ? theme.accent : '' }}>
                                {formData.previouslyContacted === opt && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.accent }} />}
                            </div>
                            <input 
                              type="radio" 
                              className="hidden"
                              value={opt}
                              checked={formData.previouslyContacted === opt} 
                              onChange={() => setFormData({...formData, previouslyContacted: opt as any})}
                            />
                            <span className={`font-bold transition-colors ${formData.previouslyContacted === opt ? 'text-slate-900' : 'text-slate-500'}`}>
                              {opt === 'Yes' ? t.yes : t.no}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <AnimatePresence>
                      {formData.previouslyContacted === 'Yes' && (
                        <MotionDiv 
                          initial={{ opacity: 0, height: 0, marginTop: 0 }} 
                          animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="space-y-8 pt-8 border-t border-slate-200"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <InputGroup 
                              label={t.officialName}
                              value={formData.officialName || ''}
                              onChange={v => setFormData({...formData, officialName: v})}
                              error={formErrors.officialName}
                              placeholder={t.officialNamePlaceholder}
                              theme={theme}
                            />
                            
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-4">{t.officialResponded}</label>
                              <div className="flex gap-6 mt-1">
                                {['Yes', 'No'].map(opt => (
                                  <label key={opt} className="flex items-center cursor-pointer group" onClick={() => triggerHaptic(5)}>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mx-3 transition-all ${formData.officialResponded === opt ? '' : 'border-slate-300'}`} style={{ borderColor: formData.officialResponded === opt ? theme.accent : '' }}>
                                        {formData.officialResponded === opt && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.accent }} />}
                                    </div>
                                    <input 
                                      type="radio" 
                                      className="hidden"
                                      value={opt}
                                      checked={formData.officialResponded === opt} 
                                      onChange={() => setFormData({...formData, officialResponded: opt as any})}
                                    />
                                    <span className={`font-bold transition-colors ${formData.officialResponded === opt ? 'text-slate-900' : 'text-slate-500'}`}>
                                      {opt === 'Yes' ? t.yes : t.no}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                        </MotionDiv>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <div>
                  <label className="block text-base font-bold text-slate-700 mb-4">
                    {isSuggestionService ? t.suggestionLabel : t.detailsLabel}
                  </label>
                  <textarea
                    rows={6}
                    className={`
                      w-full p-5 bg-white border-2 rounded-[1.5rem] outline-none transition-all resize-none text-gray-900 placeholder-slate-400 font-medium
                      ${formErrors.details 
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                        : `border-slate-100 ${theme.border} focus:ring-4 ${theme.ring}`}
                    `}
                    value={formData.details}
                    onChange={e => setFormData({...formData, details: e.target.value})}
                    placeholder={isSuggestionService ? t.suggestionPlaceholder : t.detailsPlaceholder}
                  ></textarea>
                  <AnimatePresence>
                    {formErrors.details && (
                      <MotionP initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-xs text-red-500 mt-2 font-bold flex items-center gap-1">
                        <AlertCircle size={14} /> {formErrors.details}
                      </MotionP>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {status === 'error' && (
              <MotionDiv initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-50 text-red-600 p-6 rounded-2xl flex items-center gap-4 border border-red-100 shadow-sm">
                <AlertCircle size={24} />
                <span className="font-bold">{t.error}</span>
              </MotionDiv>
            )}

            <div className="pt-6">
              <MotionButton
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={status === 'submitting'}
                className={`w-full text-white font-black py-5 rounded-2xl shadow-2xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-4 text-xl tracking-tight ${theme.button}`}
              >
                {status === 'submitting' ? (
                  <>
                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.processing}
                  </>
                ) : (
                  <> {t.submit} <Send size={24} className="rtl:rotate-180" /></>
                )}
              </MotionButton>
            </div>

          </form>
        </MotionDiv>
      </div>
    </div>
  );
};

// Reusable Components
const InputGroup: React.FC<{
  label: string, 
  value: string, 
  onChange: (v: string) => void, 
  error?: string,
  placeholder?: string,
  maxLength?: number,
  theme: any,
  type?: string
}> = ({ label, value, onChange, error, placeholder, maxLength, theme, type = 'text' }) => (
  <div className="space-y-2">
    <label className="block text-sm font-bold text-slate-600 ml-1">{label}</label>
    <input
      type={type}
      maxLength={maxLength}
      placeholder={placeholder}
      className={`
        w-full p-4 bg-white border-2 rounded-xl outline-none transition-all text-gray-900 placeholder-slate-400 font-bold
        ${error 
          ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 shadow-inner' 
          : `border-slate-100 ${theme.border} focus:ring-4 ${theme.ring} shadow-sm`}
      `}
      value={value}
      onChange={e => onChange(e.target.value)}
      inputMode={type === 'tel' || type === 'number' ? 'numeric' : undefined}
    />
    <AnimatePresence>
      {error && (
        <MotionP initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-[11px] text-red-500 font-bold flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </MotionP>
      )}
    </AnimatePresence>
  </div>
);

const SelectGroup: React.FC<{
  label: string,
  value: string,
  options: string[],
  onChange: (v: string) => void,
  theme: any,
  mappings?: any,
  language?: string
}> = ({ label, value, options, onChange, theme, mappings, language }) => (
  <div className="space-y-2">
    <label className="block text-sm font-bold text-slate-600 ml-1">{label}</label>
    <div className="relative group">
      <select
        className={`w-full p-4 bg-white border-2 border-slate-100 rounded-xl outline-none ${theme.border} focus:ring-4 ${theme.ring} transition-all appearance-none text-gray-900 font-bold cursor-pointer shadow-sm`}
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {options.map(opt => {
          const displayText = (mappings && language && mappings[opt]) ? mappings[opt][language] : opt;
          return <option key={opt} value={opt}>{displayText}</option>;
        })}
      </select>
      <ChevronDown className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform group-focus-within:rotate-180" size={18} />
    </div>
  </div>
);

export default RequestForm;