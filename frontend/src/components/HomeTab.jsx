import React from 'react';
import { Zap, Briefcase, AlertTriangle, CheckCircle, Download, CheckCircle as CheckIcon } from 'lucide-react';

const HomeTab = ({ selectedRole, setSelectedRole, customRole, setCustomRole, commonRoles, file, handleFileUpload, analyzeResume, error, setActiveTab }) => {
    return (
        <div className="space-y-12 py-8">
            <div className="text-center space-y-4">
                <h1 className="text-6xl font-black text-slate-800 tracking-tighter mb-4">Level Up Your <span className="text-gradient">Career</span></h1>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto">AI-powered tools to optimize your resume. Select your target role and upload your resume to begin.</p>
            </div>
            <div className="max-w-4xl mx-auto card overflow-hidden flex flex-col md:flex-row !p-0">
                <div className="p-8 md:w-1/2 space-y-6 border-b md:border-b-0 md:border-r border-slate-100">
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">1. Target Role</label>
                        <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="input-field">
                            <option value="">Select Target Role...</option>
                            {commonRoles.map(r => <option key={r} value={r}>{r}</option>)}
                            <option value="Other">Custom Role</option>
                        </select>
                        {selectedRole === 'Other' && <input placeholder="Enter Role Name" value={customRole} onChange={e => setCustomRole(e.target.value)} className="input-field mt-2" />}
                    </div>
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">2. Upload Resume</label>
                        <label className={`block w-full border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${file ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50'}`}>
                            <input type="file" onChange={handleFileUpload} accept=".pdf,.doc,.docx" className="hidden" />
                            <div className="flex flex-col items-center gap-2">
                                {file ? (<><div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-sm"><CheckIcon size={24} /></div><span className="text-sm font-bold text-emerald-700 truncate max-w-[200px]">{file.name}</span><span className="text-xs text-emerald-500 font-bold uppercase">Change File</span></>) :
                                    (<><div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500 mb-1 transition-transform"><Download size={24} /></div><span className="text-sm font-bold text-slate-600">Click to Upload PDF/Docx</span></>)}
                            </div>
                        </label>
                    </div>
                    <button onClick={() => { setActiveTab('analyzer'); analyzeResume(); }} disabled={!file || !selectedRole} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-4 font-bold transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"><Zap size={20} />Start AI Analysis</button>
                    {error && <p className="text-center text-red-500 text-xs font-bold">{error}</p>}
                </div>
                <div className="p-8 md:w-1/2 bg-indigo-50/30 flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 px-2 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                        Recruiter-Ready Insights
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        {[
                            { label: 'ATS Compatibility Score', icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-100/50' },
                            { label: 'Job Description Match', icon: Briefcase, color: 'text-cyan-600', bg: 'bg-cyan-100/50' },
                            { label: 'Skills Gap Analysis', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100/50' },
                            { label: 'Interview Preparation', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100/50' }
                        ].map((f, i) => (
                            <div key={i} className="flex items-center gap-4 p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-white shadow-sm hover:shadow-md transition-all">
                                <div className={`p-3 rounded-xl ${f.bg} ${f.color}`}><f.icon size={20} /></div>
                                <span className="font-bold text-slate-700 text-sm">{f.label}</span>
                            </div>))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeTab;
