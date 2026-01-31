import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import Confetti from 'react-confetti';
import './index.css';

// --- COMPONENTS (The "Should Live In Their Own File" Fix) ---
import Auth from './Auth';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HomeTab from './components/HomeTab';
import AnalysisView from './components/AnalysisView';
import ResumeBuilder from './components/ResumeBuilder';
import OptimizeTab from './components/OptimizeTab';
import MarketInsightsTab from './components/MarketInsightsTab';
import InterviewCoach from './components/InterviewCoach';
import HistoryTab from './components/HistoryTab'; // NEW: Imported HistoryTab

// Small inline components for things too simple to extract yet (or strictly presentational)
import { Flame, BookOpen, Clock } from 'lucide-react';
import { getCourseLink } from './utils/helpers';

function App() {
    // --- STATE MANAGEMENT ---
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('home');
    const [file, setFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Inputs
    const [selectedRole, setSelectedRole] = useState('');
    const [customRole, setCustomRole] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [location, setLocation] = useState('India');

    // Outputs
    const [candidateName, setCandidateName] = useState('');
    const [rewrittenResume, setRewrittenResume] = useState(null);
    const [coverLetter, setCoverLetter] = useState(null);
    const [interviewPrep, setInterviewPrep] = useState(null);
    const [jobTailoring, setJobTailoring] = useState(null);
    const [skillsAnalysis, setSkillsAnalysis] = useState(null);
    const [jobSearchData, setJobSearchData] = useState(null);
    const [salaryEstimate, setSalaryEstimate] = useState(null);
    const [roastData, setRoastData] = useState(null);
    const [history, setHistory] = useState([]);
    const [isHistoryView, setIsHistoryView] = useState(false); // Track if viewing from history

    // Builder State
    const [builderData, setBuilderData] = useState({
        personal: { fullName: '', email: '', phone: '', location: '', website: '', bio: '' },
        experience: [{ id: 1, company: '', role: '', period: '', details: '' }],
        education: [{ id: 1, school: '', degree: '', year: '' }],
        skills: '',
        projects: []
    });

    // --- EFFECTS ---
    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    // --- HANDLERS ---
    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        setHistory([]);
        resetAnalysis();
    };

    const handleFileUpload = (event) => {
        const uploadedFile = event.target.files[0];
        if (!uploadedFile) return;
        setFile(uploadedFile);
        setError('');
    };

    const resetAnalysis = () => {
        setFile(null); setAnalysis(null); setSelectedRole(''); setCustomRole('');
        setRewrittenResume(null); setCoverLetter(null); setInterviewPrep(null); setJobTailoring(null);
        setSkillsAnalysis(null); setJobSearchData(null); setCompanyName(''); setJobDescription('');
        setCandidateName(''); setActiveTab('home');
    };

    // --- API CALLS ---
    const backendUrl = import.meta.env.VITE_BACKEND_URL + '/api';


    const callApi = async (endpoint, formData, setter) => {
        setLoading(true);
        setError('');
        try {
            const config = { headers: { 'x-user-id': user?.id || 'guest' } };
            const response = await axios.post(`${backendUrl}/${endpoint}`, formData, config);
            const data = response.data.analysis || response.data.rewritten || response.data.coverLetter || response.data.optimization || response.data.preparation || response.data.estimation || response.data.jobSearch || response.data;
            setter(data);
            if (data?.candidateName) setCandidateName(data.candidateName);
        } catch (err) {
            console.error("API Error:", err);
            setError(err.response?.data?.error || err.message || "Failed");
        } finally { setLoading(false); }
    };

    const analyzeResume = () => {
        if (!file || !selectedRole) { setError('Please upload resume and select role'); return; }
        const fd = new FormData(); fd.append('resume', file); fd.append('jobRole', selectedRole === 'Other' ? customRole : selectedRole);
        callApi('analyze', fd, setAnalysis);
    };

    const runFeature = (feature) => {
        // Validation for features that require files or specific inputs
        if (!file && !['jobs', 'interview', 'salary'].includes(feature)) {
            setError('Please upload a resume first'); return;
        }

        const fd = new FormData();
        if (file) fd.append('resume', file);
        fd.append('jobRole', selectedRole);

        switch (feature) {
            case 'rewrite': callApi('rewrite', fd, setRewrittenResume); break;
            case 'skills': callApi('skills', fd, setSkillsAnalysis); break;
            case 'jobs': callApi('jobs', fd, setJobSearchData); break;
            case 'interview':
                if (!jobDescription) { setError('Job Description Required'); return; }
                fd.append('jobDescription', jobDescription);
                callApi('interview', fd, setInterviewPrep);
                break;
            case 'cover-letter':
                fd.append('companyName', companyName);
                fd.append('jobDescription', jobDescription);
                callApi('cover-letter', fd, setCoverLetter);
                break;
            case 'tailor':
                if (!jobDescription) { setError('Job Description Required'); return; }
                fd.append('jobDescription', jobDescription);
                callApi('tailor', fd, setJobTailoring);
                break;
            case 'salary': callApi('salary', fd, setSalaryEstimate); break;
            case 'roast': callApi('roast', fd, setRoastData); break;
        }
    };

    const saveResume = async () => {
        setLoading(true);
        try {
            await axios.post(`${backendUrl}/user-resumes/save`, { userId: user?.id || 'guest', resumeData: builderData });
            alert('Resume saved!');
        } catch (err) { alert('Failed to save'); } finally { setLoading(false); }
    };

    // --- RENDER ---
    if (!user) return <Auth onLogin={handleLogin} backendUrl={backendUrl} />;

    return (
        <div className="min-h-screen pb-20 font-sans text-slate-600 animate-soft-fade">
            <div className="main-bg"></div>
            {analysis && analysis.atsScore > 75 && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} />}

            <Header windowSize={windowSize} activeTab={activeTab} setActiveTab={setActiveTab} candidateName={candidateName} analysis={analysis} resetAnalysis={resetAnalysis} user={user} handleLogout={handleLogout} />

            <div className="h-24"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
                <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

                <AnimatePresence mode="wait">
                    <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>

                        {activeTab === 'home' && (
                            <HomeTab selectedRole={selectedRole} setSelectedRole={setSelectedRole} customRole={customRole} setCustomRole={setCustomRole} commonRoles={['Software Engineer', 'Product Manager', 'Data Scientist']} file={file} handleFileUpload={handleFileUpload} analyzeResume={analyzeResume} error={error} setActiveTab={setActiveTab} />
                        )}

                        {activeTab === 'analyzer' && (
                            <AnalysisView
                                analysis={analysis}
                                loading={loading}
                                error={error}
                                file={file}
                                selectedRole={selectedRole}
                                customRole={customRole}
                                candidateName={candidateName}
                                setActiveTab={setActiveTab}
                                isHistoryView={isHistoryView} // Pass the flag
                            />
                        )}

                        {/* --- NEW CONSOLIDATED TABS --- */}

                        {activeTab === 'optimize' && (
                            <OptimizeTab
                                runFeature={runFeature}
                                rewrittenResume={rewrittenResume}
                                coverLetter={coverLetter}
                                jobTailoring={jobTailoring}
                                loading={loading}
                                candidateName={candidateName}
                                selectedRole={selectedRole}
                            />
                        )}

                        {activeTab === 'market' && (
                            <MarketInsightsTab
                                runFeature={runFeature}
                                salaryEstimate={salaryEstimate}
                                jobSearchData={jobSearchData}
                                loading={loading}
                                selectedRole={selectedRole}
                                location={location}
                            />
                        )}

                        {activeTab === 'interview' && (
                            <InterviewCoach
                                runFeature={runFeature}
                                interviewPrep={interviewPrep}
                                loading={loading}
                                jobDescription={jobDescription}
                                setJobDescription={setJobDescription}
                            />
                        )}

                        {activeTab === 'builder' && (
                            <ResumeBuilder builderData={builderData} setBuilderData={setBuilderData} saveResume={saveResume} loading={loading} />
                        )}

                        {/* --- REMAINING SIMPLE TABS --- */}

                        {activeTab === 'courses' && (
                            <div className="space-y-6">
                                <h2 className="text-3xl font-black text-slate-800 text-center">Recommended Courses</h2>
                                {!analysis ? <div className="text-center p-10 bg-white rounded-3xl"><p>Analyze your resume to see recommended courses.</p></div> : (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {analysis.recommendedCourses?.map((c, i) => (
                                            <a key={i} href={getCourseLink(c.title, c.platform)} target="_blank" className="card hover:shadow-lg transition-all border border-indigo-100 flex justify-between items-center group">
                                                <div>
                                                    <h3 className="font-bold text-slate-800">{c.title}</h3>
                                                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-bold mt-1 inline-block">{c.platform}</span>
                                                </div>
                                                <BookOpen className="text-indigo-200 group-hover:text-indigo-500 transition-colors" />
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'roast' && (
                            <div className="space-y-6 text-center py-10">
                                <div className="inline-block p-3 rounded-2xl bg-orange-50 text-orange-600 mb-4"><Flame size={32} /></div>
                                <h2 className="text-3xl font-black text-slate-800 mb-4">Resume Roast 🔥</h2>
                                <button onClick={() => runFeature('roast')} disabled={loading} className="btn-primary bg-orange-600 hover:bg-orange-700">{loading ? 'Roasting...' : 'Roast Me'}</button>
                                {roastData && (<div className="mt-8 bg-white p-8 rounded-3xl border-2 border-orange-100 shadow-xl text-left"><p className="text-slate-700 text-lg whitespace-pre-line leading-relaxed">{roastData.roast}</p></div>)}
                            </div>
                        )}

                        {activeTab === 'history' && (
                            isHistoryView ? (
                                <AnalysisView
                                    analysis={analysis}
                                    loading={loading}
                                    error={error}
                                    file={file}
                                    selectedRole={selectedRole}
                                    customRole={customRole}
                                    candidateName={candidateName}
                                    setActiveTab={setActiveTab}
                                    isHistoryView={true}
                                    onBack={() => setIsHistoryView(false)} // Handle internal back navigation
                                />
                            ) : (
                                <HistoryTab
                                    user={user}
                                    backendUrl={backendUrl}
                                    setActiveTab={setActiveTab}
                                    setAnalysis={setAnalysis}
                                    setCandidateName={setCandidateName}
                                    setIsHistoryView={setIsHistoryView}
                                />
                            )
                        )}

                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

export default App;
