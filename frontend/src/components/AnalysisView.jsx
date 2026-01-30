import React from 'react';
import { Loader2, AlertTriangle, Download, Zap, Briefcase, FileText, ArrowRight, Edit3, BookOpen, CheckCircle, Globe } from 'lucide-react';
import { downloadPDF, downloadTextFile, copyToClipboard, getJobLinks, getCourseLink } from '../utils/helpers';

const AnalysisView = ({
    analysis, loading, error, file, selectedRole, customRole, candidateName,
    setActiveTab, isHistoryView, onBack
}) => {

    if (!analysis) {
        return (
            <div className="text-center py-20">
                {loading ? (
                    <>
                        <Loader2 className="animate-spin text-indigo-500 mx-auto mb-4" size={48} />
                        <h2 className="text-2xl font-bold text-slate-800">Processing Your Resume...</h2>
                        <p className="text-slate-500">Our AI is analyzing {file?.name} for the {selectedRole} role.</p>
                    </>
                ) : error ? (
                    <div className="text-rose-500">
                        <AlertTriangle size={48} className="mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Analysis Failed</h2>
                        <p className="max-w-md mx-auto mb-6 bg-rose-50 p-4 rounded-xl border border-rose-100 text-sm font-medium">{error}</p>
                        <button onClick={() => setActiveTab('home')} className="btn-primary">Try Again</button>
                    </div>
                ) : (
                    <button onClick={() => setActiveTab('home')} className="text-indigo-600 font-bold hover:underline">Return to Upload</button>
                )}
            </div>
        );
    }

    const jobLinks = getJobLinks(selectedRole === 'Other' ? customRole : selectedRole, analysis.location || 'India');

    return (
        <div className="animate-soft-fade" id="analysis-report">
            <div className="flex justify-between items-center mb-6">
                {/* Back Button for History Context */}
                {isHistoryView ? (
                    <button onClick={onBack || (() => setActiveTab('history'))} className="text-slate-500 font-bold hover:text-indigo-600 flex items-center gap-2 transition-colors">
                        <ArrowRight className="rotate-180" size={20} /> Back to History
                    </button>
                ) : (
                    <div></div> // Spacer
                )}

                <button onClick={() => downloadPDF('analysis-report', `Analysis-${candidateName}`)} className="btn-secondary !py-2.5 !px-5 !rounded-xl !text-sm flex items-center gap-2">
                    <Download size={18} /> Download Full Report
                </button>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Score Card & Quick Links */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="card !p-0 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-600 via-indigo-500 to-cyan-500"></div>
                        <div className="relative pt-12 text-center text-white">
                            <div className="w-24 h-24 bg-white rounded-full p-2 mx-auto mb-4 shadow-lg"><div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-3xl font-black text-indigo-500">{candidateName ? candidateName.charAt(0) : 'C'}</div></div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-1">{candidateName || 'Candidate Name'}</h2>
                            <p className="text-indigo-600 font-medium bg-indigo-50 px-3 py-1 rounded-full text-xs inline-block mb-6">{selectedRole === 'Other' ? customRole : selectedRole}</p>

                            {analysis.location && (
                                <p className="text-slate-400 text-xs font-bold mb-4 flex items-center justify-center gap-1">
                                    <Globe size={12} /> {analysis.location}
                                </p>
                            )}

                            <div className="grid grid-cols-2 gap-3 bg-slate-50/50 rounded-2xl p-5 border border-slate-100 mx-6 mb-6">
                                <div className="text-center px-2 border-r border-slate-200">
                                    <div className="text-4xl font-black text-indigo-600 tracking-tighter">{analysis.atsScore}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ATS Score</div>
                                </div>
                                <div className="text-center px-2">
                                    <div className={`text-4xl font-black tracking-tighter ${analysis.jobMatchScore >= 80 ? 'text-emerald-600' : analysis.jobMatchScore >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                                        {analysis.jobMatchScore || 'N/A'}
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Job Match</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card space-y-4">
                        <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Briefcase size={16} className="text-indigo-500" />
                            Direct Apply
                        </h3>
                        <div className="space-y-2">
                            {jobLinks.map(s => (
                                <a
                                    key={s.platform}
                                    href={s.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center justify-between p-4 rounded-2xl border border-slate-100 transition-all font-bold text-sm text-slate-700 hover:scale-[1.02] ${s.platform === 'Naukri' ? 'hover:bg-blue-50 text-blue-600' :
                                            s.platform === 'LinkedIn' ? 'hover:bg-indigo-50 text-indigo-600' :
                                                'hover:bg-emerald-50 text-emerald-600'
                                        }`}
                                >
                                    {s.platform}
                                    <Globe size={16} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Insights */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Executive Summary */}
                    <div className="card">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                            <div className="bg-indigo-100 text-indigo-600 p-2.5 rounded-xl"><FileText size={20} /></div>
                            Executive Summary
                        </h3>
                        <p className="text-slate-600 leading-relaxed border-l-4 border-indigo-500/30 pl-4 py-1 italic font-medium">{analysis.summary}</p>
                    </div>

                    {/* Strengths & Weaknesses Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Strengths */}
                        <div className="card !bg-gradient-to-br from-emerald-50/60 to-emerald-100/30 border-emerald-200/60 transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-emerald-900 font-black flex items-center gap-3 uppercase tracking-wider text-sm">
                                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2.5 rounded-xl text-white shadow-lg shadow-emerald-200">
                                        <Zap size={18} className="animate-pulse" />
                                    </div>
                                    Key Strengths
                                </h3>
                                <div className="bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                                    {analysis.mobileAnalysis?.superpowers?.length || 0}
                                </div>
                            </div>
                            <ul className="space-y-3.5">
                                {analysis.mobileAnalysis?.superpowers?.map((s, i) => (
                                    <li key={i} className="flex items-start gap-4 text-sm text-emerald-950 font-medium bg-white/60 p-3.5 rounded-xl hover:bg-white transition-all border border-emerald-100/50">
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm">✓</div>
                                        </div>
                                        <span className="leading-relaxed pt-0.5">{s}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Weaknesses */}
                        <div className="card !bg-gradient-to-br from-amber-50/60 to-orange-100/30 border-amber-200/60 transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-amber-900 font-black flex items-center gap-3 uppercase tracking-wider text-sm">
                                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2.5 rounded-xl text-white shadow-lg shadow-amber-200">
                                        <AlertTriangle size={18} className="animate-pulse" />
                                    </div>
                                    Areas for Growth
                                </h3>
                                <div className="bg-amber-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                                    {analysis.mobileAnalysis?.demerits?.length || 0}
                                </div>
                            </div>
                            <ul className="space-y-3.5">
                                {analysis.mobileAnalysis?.demerits?.map((s, i) => (
                                    <li key={i} className="flex items-start gap-4 text-sm text-amber-950 font-medium bg-white/60 p-3.5 rounded-xl hover:bg-white transition-all border border-amber-100/50">
                                        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-sm">!</div>
                                        <span className="leading-relaxed pt-0.5">{s}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Quick Course Recommendations */}
                    {analysis.recommendedCourses && analysis.recommendedCourses.length > 0 && (
                        <div className="card border-indigo-100 transition-all duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-indigo-900 font-black flex items-center gap-3 uppercase tracking-wider text-sm">
                                    <BookOpen size={18} /> Recommended Learning Path
                                </h3>
                                <button onClick={() => setActiveTab('courses')} className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {analysis.recommendedCourses.slice(0, 2).map((course, i) => (
                                    <a key={i} href={getCourseLink(course.title, course.platform)} target="_blank" rel="noreferrer" className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-indigo-300 transition-all group">
                                        <h4 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-indigo-600">{course.title}</h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span className="bg-white px-2 py-0.5 rounded border">{course.platform}</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalysisView;
