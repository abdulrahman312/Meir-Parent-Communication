import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SERVICES, GRADES, SECTIONS, SCHOOL_LEVELS, REASONS } from '../constants';
import { FormData } from '../types';
import { submitComplaint } from '../services/api';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';

const RequestForm: React.FC = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  const service = SERVICES.find(s => s.id === serviceId);

  useEffect(() => {
    if (!service) navigate('/');
    window.scrollTo(0, 0);
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

  // Theme configuration based on service ID to match Home page cards
  const getTheme = (id: string) => {
    switch (id) {
      case 'academic':
        return {
          header: 'bg-gradient-to-br from-[#06b6d4] to-[#3b82f6]', // Cyan to Blue
          button: 'bg-[#3b82f6] hover:bg-[#2563eb] shadow-blue-200',
          iconBg: 'bg-white/20'
        };
      case 'administrative':
        return {
          header: 'bg-gradient-to-br from-[#10b981] to-[#059669]', // Emerald to Green
          button: 'bg-[#10b981] hover:bg-[#059669] shadow-emerald-200',
          iconBg: 'bg-white/20'
        };
      case 'behavior':
        return {
          header: 'bg-gradient-to-br from-[#8b5cf6] to-[#6366f1]', // Violet to Indigo
          button: 'bg-[#8b5cf6] hover:bg-[#7c3aed] shadow-violet-200',
          iconBg: 'bg-white/20'
        };
      case 'visit':
        return {
          header: 'bg-gradient-to-br from-[#3b82f6] to-[#2563eb]', // Blue
          button: 'bg-[#3b82f6] hover:bg-[#1d4ed8] shadow-blue-200',
          iconBg: 'bg-white/20'
        };
      default:
        return {
          header: 'bg-slate-900',
          button: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200',
          iconBg: 'bg-white/10'
        };
    }
  };

  const theme = service ? getTheme(service.id) : getTheme('default');

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.parentName) errors.parentName = "Parent Name is required";
    
    const phoneRegex = /^05\d{8}$/;
    if (!formData.contactNumber) {
      errors.contactNumber = "Contact number is required";
    } else if (!phoneRegex.test(formData.contactNumber)) {
      errors.contactNumber = "Must be 10 digits starting with 05";
    }

    if (!formData.studentName) errors.studentName = "Student Name is required";
    if (!formData.reason) errors.reason = "Please select a reason";
    if (!formData.details) errors.details = "Please provide details";

    if (formData.previouslyContacted === 'Yes') {
        if(!formData.officialName) errors.officialName = "Official name is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!service) return;

    setStatus('submitting');
    
    // Prepare payload
    // If previouslyContacted is No, ensure official fields are empty strings
    // casting to any to allow overriding strict types for cleanup before sending
    const payload: any = { ...formData };
    if (payload.previouslyContacted === 'No') {
      payload.officialName = '';
      payload.officialResponded = ''; 
    }

    const success = await submitComplaint(service.sheetName, payload);
    
    if (success) {
      setStatus('success');
    } else {
      setStatus('error');
    }
  };

  if (!service) return null;

  if (status === 'success') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[2.5rem] shadow-2xl text-center max-w-lg w-full border border-slate-100"
        >
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Request Sent!</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Your <strong>{service.title}</strong> has been successfully submitted. Our team will review it and contact you soon.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-300/50"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className={`${theme.header} text-white pb-24 pt-12 px-6 rounded-b-[3rem] shadow-lg transition-all duration-500`}>
        <div className="container mx-auto max-w-4xl">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center text-white/80 hover:text-white mb-8 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Services
          </button>
          
          <div className="flex items-center gap-6">
            <div className={`p-4 ${theme.iconBg} backdrop-blur-sm rounded-2xl border border-white/10`}>
              <service.icon size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
              <p className="text-white/90 opacity-90">Please complete the form below to submit your request.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-4xl -mt-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
            
            {/* Group 1 */}
            <section>
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 text-white ${theme.button.split(' ')[0]}`}>1</span>
                Student & Parent Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup 
                  label="Parent Name"
                  value={formData.parentName}
                  onChange={v => setFormData({...formData, parentName: v})}
                  error={formErrors.parentName}
                  placeholder="Enter parent full name"
                  activeColor={theme.button.split(' ')[0]}
                />

                <InputGroup 
                  label="Contact Number"
                  value={formData.contactNumber}
                  onChange={v => {
                    const val = v.replace(/\D/g, '');
                    setFormData({...formData, contactNumber: val});
                  }}
                  error={formErrors.contactNumber}
                  placeholder="05XXXXXXXX"
                  maxLength={10}
                  activeColor={theme.button.split(' ')[0]}
                />

                <InputGroup 
                  label="Student Name"
                  value={formData.studentName}
                  onChange={v => setFormData({...formData, studentName: v})}
                  error={formErrors.studentName}
                  placeholder="Enter student full name"
                  activeColor={theme.button.split(' ')[0]}
                />

                <SelectGroup 
                  label="School Level"
                  value={formData.schoolLevel}
                  options={SCHOOL_LEVELS}
                  onChange={v => setFormData({...formData, schoolLevel: v})}
                />

                <SelectGroup 
                  label="Grade"
                  value={formData.grade}
                  options={GRADES}
                  onChange={v => setFormData({...formData, grade: v})}
                />

                <SelectGroup 
                  label="Section"
                  value={formData.section}
                  options={SECTIONS}
                  onChange={v => setFormData({...formData, section: v})}
                />
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Group 2 */}
            <section>
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 text-white ${theme.button.split(' ')[0]}`}>2</span>
                Request Details
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-4">Reason for Request</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {REASONS[service.sheetName].map((reason) => {
                      // We need to dynamically apply the border/text color for selected items based on theme
                      // Since we can't easily interpolate partial classes in Tailwind without full definitions or style prop
                      // We will use inline style for border-color when checked if needed, or map classes.
                      // For simplicity, we'll keep indigo as the selection color for inputs to maintain design system consistency inside the form,
                      // OR we can switch to using the theme color.
                      // Let's stick to the form's internal consistency (Indigo/Slate) for inputs to avoid contrast issues,
                      // but we'll try to use the theme color for the 'checked' state border if possible.
                      
                      const isSelected = formData.reason === reason;
                      return (
                        <label 
                          key={reason} 
                          className={`
                            relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200
                            ${isSelected 
                              ? 'bg-slate-50' 
                              : 'border-slate-100 hover:border-slate-200 bg-white'}
                          `}
                          style={{
                            borderColor: isSelected ? 'currentColor' : '',
                            color: isSelected ? '#1e293b' : '#475569'
                          }}
                        >
                           {/* Custom Radio Circle */}
                           <div 
                             className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${isSelected ? '' : 'border-slate-300'}`}
                             style={{ borderColor: isSelected ? 'currentColor' : '' }}
                           >
                              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                           </div>

                          <input
                            type="radio"
                            name="reason"
                            value={reason}
                            checked={isSelected}
                            onChange={e => setFormData({...formData, reason: e.target.value})}
                            className="hidden" // Hiding default radio
                          />
                          <span className={`text-sm font-medium`}>
                            {reason}
                          </span>
                          
                          {/* Inject dynamic color for the active state via a style wrapper if needed, 
                              but here 'current' refers to text color. 
                              Let's wrap the content in a div that sets the text color to the theme color if selected.
                          */}
                        </label>
                      );
                    })}
                  </div>
                  {formErrors.reason && <p className="text-xs text-red-500 mt-2 font-medium">{formErrors.reason}</p>}
                </div>

                {/* Conditional Logic */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <label className="block text-sm font-bold text-slate-700 mb-3">
                    Have you previously contacted any school official?
                  </label>
                  <div className="flex gap-4">
                    {['Yes', 'No'].map(opt => (
                       <label key={opt} className="flex items-center cursor-pointer">
                         <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${formData.previouslyContacted === opt ? 'border-indigo-600' : 'border-slate-300'}`}>
                            {formData.previouslyContacted === opt && <div className="w-3 h-3 bg-indigo-600 rounded-full" />}
                         </div>
                         <input 
                           type="radio" 
                           className="hidden"
                           value={opt}
                           checked={formData.previouslyContacted === opt} 
                           onChange={() => setFormData({...formData, previouslyContacted: opt as any})}
                         />
                         <span className="text-slate-700 font-medium">{opt}</span>
                       </label>
                    ))}
                  </div>

                  {formData.previouslyContacted === 'Yes' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-200"
                    >
                      <InputGroup 
                        label="Official Name"
                        value={formData.officialName || ''}
                        onChange={v => setFormData({...formData, officialName: v})}
                        error={formErrors.officialName}
                        placeholder="Who did you speak to?"
                      />
                      
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Did the official respond?</label>
                        <div className="flex gap-4 mt-3">
                          {['Yes', 'No'].map(opt => (
                            <label key={opt} className="flex items-center cursor-pointer">
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${formData.officialResponded === opt ? 'border-indigo-600' : 'border-slate-300'}`}>
                                  {formData.officialResponded === opt && <div className="w-3 h-3 bg-indigo-600 rounded-full" />}
                              </div>
                              <input 
                                type="radio" 
                                className="hidden"
                                value={opt}
                                checked={formData.officialResponded === opt} 
                                onChange={() => setFormData({...formData, officialResponded: opt as any})}
                              />
                              <span className="text-slate-700 font-medium">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Please explain your issue in detail</label>
                  <textarea
                    rows={6}
                    className={`
                      w-full p-4 bg-white border rounded-xl outline-none transition-all resize-none text-gray-900 placeholder-gray-400
                      ${formErrors.details 
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'}
                    `}
                    value={formData.details}
                    onChange={e => setFormData({...formData, details: e.target.value})}
                    placeholder="Provide as much detail as possible to help us assist you..."
                  ></textarea>
                  {formErrors.details && <p className="text-xs text-red-500 mt-2 font-medium">{formErrors.details}</p>}
                </div>
              </div>
            </section>

            {status === 'error' && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100">
                <AlertCircle size={20} />
                <span className="font-medium">Something went wrong. Please check your internet connection.</span>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3 text-lg ${theme.button}`}
              >
                {status === 'submitting' ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Request...
                  </>
                ) : (
                  <>Submit Request <Send size={20} /></>
                )}
              </button>
            </div>

          </form>
        </motion.div>
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
  activeColor?: string
}> = ({ label, value, onChange, error, placeholder, maxLength }) => (
  <div>
    <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
    <input
      type="text"
      maxLength={maxLength}
      placeholder={placeholder}
      className={`
        w-full p-4 bg-white border rounded-xl outline-none transition-all text-gray-900 placeholder-gray-400
        ${error 
          ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
          : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'}
      `}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
    {error && <p className="text-xs text-red-500 mt-2 font-medium">{error}</p>}
  </div>
);

const SelectGroup: React.FC<{
  label: string,
  value: string,
  options: string[],
  onChange: (v: string) => void
}> = ({ label, value, options, onChange }) => (
  <div>
    <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
    <div className="relative">
      <select
        className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all appearance-none text-gray-900"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
    </div>
  </div>
);

export default RequestForm;