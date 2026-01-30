import React from 'react';
import { Zap, RotateCcw, LogOut } from 'lucide-react';

const Header = ({ windowSize, activeTab, setActiveTab, candidateName, analysis, resetAnalysis, user, handleLogout }) => {
    return (
        <div className={`glass-header transition-all duration-500 ${window.scrollY > 10 ? 'py-3 shadow-xl shadow-slate-200/20' : 'py-5'}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
                    <div className="bg-gradient-to-tr from-indigo-600 to-cyan-500 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-200">
                        <Zap size={20} fill="currentColor" />
                    </div>
                    <span className="font-bold text-2xl text-slate-800 tracking-tight">TalentSync {candidateName && <span className="text-indigo-600 ml-2 font-medium opacity-60">| {candidateName}</span>}</span>
                </div>
                <div className="flex items-center gap-4">
                    {candidateName && (
                        <div className="hidden md:flex items-center gap-4 animate-fade-in-left">
                            <button onClick={resetAnalysis} className="btn-secondary !py-2 !px-4 !rounded-xl !text-xs">
                                <RotateCcw size={14} /> Upload New
                            </button>
                            <div className="text-right">
                                <p className="text-sm font-bold text-slate-800">{candidateName}</p>
                                <p className="text-xs text-slate-500 font-medium">{analysis?.roleSuitability || 'Candidate'}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
                        <div className="text-right hidden sm:block"><p className="text-sm font-bold text-slate-800">{user.name}</p></div>
                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold">{user.name.charAt(0)}</div>
                        <button onClick={handleLogout} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors" title="Logout">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
