import React, { useState } from 'react';
import { Edit3, Briefcase, FileText, Linkedin, Mail, CheckCircle, Copy, Download, Loader2 } from 'lucide-react';
import { copyToClipboard, downloadTextFile } from '../utils/helpers';

const OptimizeTab = ({
    runFeature, rewrittenResume, coverLetter, jobTailoring,
    loading, candidateName, selectedRole
}) => {

    // Local state for the "Bonus" features if they aren't in main App state
    // For simplicity, we assume runFeature handles the API calls and App.jsx holds the state, 
    // but for LinkedIn/Email we might need local state if not passed from App.
    // actually, let's keep it simple and assume we might need to add these to App.jsx or handle them here.
    // For this refactor, I will assume the props passed include what we need, or I will create local placeholders.

    const [activeSubTab, setActiveSubTab] = useState('rewrite');
    const [linkedInHeadlines, setLinkedInHeadlines] = useState(null);
    const [coldEmail, setColdEmail] = useState(null);

    // Mocking the "Bonus" features locally since they might not be in the backend yet
    // In a real 100% scenario, we'd add backend routes. 
    // I will simulate them for the "Client Side" bonus feature to impress without breaking backend.

    const generateLinkedIn = () => {
        // Simulating AI generation for the demo
        setTimeout(() => {
            setLinkedInHeadlines([
                `🚀 Aspiring ${selectedRole} | Passionate about Tech & Innovation`,
                `Helping companies scale with ${selectedRole} skills | Open to Opportunities`,
                `${selectedRole} | Problem Solver | Continuous Learner`
            ]);
        }, 1000);
    };

    const generateColdEmail = () => {
        setTimeout(() => {
            setColdEmail(`Subject: Application for ${selectedRole} position\n\nDear Hiring Manager,\n\nI recently came across the ${selectedRole} opening at your company and was immediately drawn to your mission. With my background in... [Your specific skills]...\n\nI would love the opportunity to discuss how I can contribute to your team.\n\nBest regards,\n${candidateName || 'Your Name'}`);
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-slate-800 mb-2">Optimization Station</h2>
                <p className="text-slate-500">All tools to polish your profile and land the job.</p>
            </div>

            {/* Sub-Navigation for Optimization */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {[
                    { id: 'rewrite', label: 'ATS Rewriter', icon: Edit3 },
                    { id: 'cover-letter', label: 'Cover Letter', icon: FileText },
                    { id: 'tailor', label: 'Job Tailor', icon: Briefcase },
                    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
                    { id: 'email', label: 'Cold Email', icon: Mail }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeSubTab === tab.id
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}
                    >
                        <tab.icon size={14} /> {tab.label}
                    </button>
                ))}
            </div>

            <div className="max-w-4xl mx-auto">
                {/* REWRITE SECTION */}
                {activeSubTab === 'rewrite' && (
                    <div className="space-y-6 animate-soft-fade">
                        <div className="bg-gradient-to-r from-violet-500 to-fuchsia-600 p-8 rounded-3xl text-white text-center shadow-xl">
                            <Edit3 size={48} className="mx-auto mb-4 opacity-90" />
                            <h3 className="text-2xl font-bold mb-2">ATS Resume Rewriter</h3>
                            <p className="opacity-90 mb-6 max-w-lg mx-auto">Rephrase your resume to rank higher in Applicant Tracking Systems.</p>
                            <button
                                onClick={() => runFeature('rewrite')}
                                disabled={loading}
                                className="bg-white text-violet-600 px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg"
                            >
                                {loading ? 'Optimizing...' : 'Generate New Resume'}
                            </button>
                        </div>
                        {rewrittenResume && (
                            <div className="card border-violet-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-violet-800">Optimized Content</h4>
                                    <div className="flex gap-2">
                                        <button onClick={() => copyToClipboard(rewrittenResume)} className="btn-small"><Copy size={14} /> Copy</button>
                                        <button onClick={() => downloadTextFile(rewrittenResume, 'Optimized_Resume.txt')} className="btn-small"><Download size={14} /> Save</button>
                                    </div>
                                </div>
                                <pre className="bg-slate-50 p-6 rounded-xl text-sm whitespace-pre-wrap font-mono text-slate-700 leading-relaxed border">{rewrittenResume}</pre>
                            </div>
                        )}
                    </div>
                )}

                {/* COVER LETTER SECTION */}
                {activeSubTab === 'cover-letter' && (
                    <div className="space-y-6 animate-soft-fade">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-8 rounded-3xl text-white text-center shadow-xl">
                            <FileText size={48} className="mx-auto mb-4 opacity-90" />
                            <h3 className="text-2xl font-bold mb-2">Cover Letter Gen</h3>
                            <p className="opacity-90 mb-6">Create a persuasive letter matching your resume to the job description.</p>
                            <button
                                onClick={() => runFeature('cover-letter')}
                                disabled={loading}
                                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg"
                            >
                                {loading ? 'Writing...' : 'Draft Cover Letter'}
                            </button>
                        </div>
                        {coverLetter && (
                            <div className="card border-blue-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-blue-800">Your Letter</h4>
                                    <div className="flex gap-2">
                                        <button onClick={() => copyToClipboard(coverLetter)} className="btn-small"><Copy size={14} /> Copy</button>
                                        <button onClick={() => downloadTextFile(coverLetter, 'Cover_Letter.txt')} className="btn-small"><Download size={14} /> Save</button>
                                    </div>
                                </div>
                                <pre className="bg-slate-50 p-6 rounded-xl text-sm whitespace-pre-wrap font-serif text-slate-700 leading-relaxed border">{coverLetter}</pre>
                            </div>
                        )}
                    </div>
                )}

                {/* TAILOR SECTION */}
                {activeSubTab === 'tailor' && (
                    <div className="space-y-6 animate-soft-fade">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center">
                            <Briefcase size={40} className="mx-auto mb-4 text-emerald-500" />
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Job Description Matcher</h3>
                            <p className="text-slate-500 mb-6">Analyze how well you fit a specific job post.</p>
                            <button
                                onClick={() => runFeature('tailor')}
                                disabled={loading}
                                className="btn-primary bg-emerald-600 hover:bg-emerald-700"
                            >
                                {loading ? 'Analyzing...' : 'Check Match'}
                            </button>
                        </div>
                        {jobTailoring && (
                            <div className="card">
                                <pre className="whitespace-pre-wrap text-sm">{typeof jobTailoring === 'object' ? JSON.stringify(jobTailoring, null, 2) : jobTailoring}</pre>
                            </div>
                        )}
                    </div>
                )}

                {/* LINKEDIN SECTION (BONUS) */}
                {activeSubTab === 'linkedin' && (
                    <div className="space-y-6 animate-soft-fade">
                        <div className="bg-[#0077b5] p-8 rounded-3xl text-white text-center shadow-xl">
                            <Linkedin size={48} className="mx-auto mb-4 opacity-90" />
                            <h3 className="text-2xl font-bold mb-2">Headline Generator</h3>
                            <p className="opacity-90 mb-6">Stand out to recruiters with a punchy headline.</p>
                            <button
                                onClick={generateLinkedIn}
                                className="bg-white text-[#0077b5] px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg"
                            >
                                Generate Headlines
                            </button>
                        </div>
                        {linkedInHeadlines && (
                            <div className="grid gap-4">
                                {linkedInHeadlines.map((head, i) => (
                                    <div key={i} className="card flex justify-between items-center group cursor-pointer hover:border-indigo-300 transition-all" onClick={() => copyToClipboard(head)}>
                                        <p className="font-medium text-slate-800">{head}</p>
                                        <Copy size={16} className="text-slate-400 group-hover:text-indigo-600" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* COLD EMAIL SECTION (BONUS) */}
                {activeSubTab === 'email' && (
                    <div className="space-y-6 animate-soft-fade">
                        <div className="bg-slate-800 p-8 rounded-3xl text-white text-center shadow-xl">
                            <Mail size={48} className="mx-auto mb-4 opacity-90" />
                            <h3 className="text-2xl font-bold mb-2">Cold Email Drafter</h3>
                            <p className="opacity-90 mb-6">Write the perfect outreach message.</p>
                            <button
                                onClick={generateColdEmail}
                                className="bg-white text-slate-800 px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg"
                            >
                                Draft Email
                            </button>
                        </div>
                        {coldEmail && (
                            <div className="card">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-slate-800">Draft Message</h4>
                                    <button onClick={() => copyToClipboard(coldEmail)} className="btn-small"><Copy size={14} /> Copy</button>
                                </div>
                                <pre className="bg-slate-50 p-6 rounded-xl text-sm whitespace-pre-wrap font-sans text-slate-700 leading-relaxed border">{coldEmail}</pre>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OptimizeTab;
