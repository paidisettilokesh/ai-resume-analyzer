import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, FileText, ChevronRight, AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { downloadTextFile } from '../utils/helpers';

const HistoryTab = ({ user, backendUrl, setActiveTab, setAnalysis, setCandidateName, setIsHistoryView }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/history`, {
                headers: { 'x-user-id': user?.id || 'guest' }
            });
            setHistory(data);
        } catch (err) {
            setError('Failed to load history');
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = async () => {
        if (!confirm('Are you sure you want to clear all history?')) return;
        try {
            await axios.delete(`${backendUrl}/history`, {
                headers: { 'x-user-id': user?.id || 'guest' }
            });
            setHistory([]);
        } catch (err) {
            alert('Failed to clear history');
        }
    };

    const loadAnalysis = (item) => {
        setAnalysis(item.analysis);
        if (item.analysis.candidateName) setCandidateName(item.analysis.candidateName);
        setIsHistoryView(true); // Switch to detail view WITHIN History tab
        window.scrollTo(0, 0);
    };

    if (loading) return <div className="text-center py-20"><Loader2 className="animate-spin text-indigo-500 mx-auto" /></div>;

    return (
        <div className="space-y-6 animate-soft-fade max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <Clock className="text-indigo-500" /> Activity History
                    </h2>
                    <p className="text-slate-500">Your recent resume analyses.</p>
                </div>
                {history.length > 0 && (
                    <button onClick={clearHistory} className="text-rose-500 hover:text-rose-700 font-bold text-sm flex items-center gap-2 px-4 py-2 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 size={16} /> Clear All
                    </button>
                )}
            </div>

            {history.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <Clock size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold text-slate-400">No History Found</h3>
                    <p className="text-slate-500 mb-6">Analyze a resume to see it here.</p>
                    <button onClick={() => setActiveTab('home')} className="btn-primary">Start New Analysis</button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {history.map((item, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all shadow-sm group hover:shadow-md flex justify-between items-center cursor-pointer" onClick={() => loadAnalysis(item)}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${item.analysis.atsScore >= 80 ? 'bg-emerald-500 shadow-emerald-200' :
                                    item.analysis.atsScore >= 60 ? 'bg-amber-500 shadow-amber-200' : 'bg-rose-500 shadow-rose-200'
                                    }`}>
                                    {item.analysis.atsScore}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
                                        {item.analysis.candidateName || 'Unknown Candidate'}
                                    </h4>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                                        <span className="bg-slate-100 px-2 py-0.5 rounded">{item.role || 'General Role'}</span>
                                        <span>• {new Date(item.timestamp).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryTab;
