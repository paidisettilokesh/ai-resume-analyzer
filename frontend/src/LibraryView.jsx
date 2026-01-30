import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText, Trash2, Download } from 'lucide-react';

function LibraryView({ backendUrl, user }) {
    const [savedResumes, setSavedResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLibrary();
    }, [user]);

    const loadLibrary = () => {
        setLoading(true);
        axios.get(`${backendUrl}/resumes`, { headers: { 'x-user-id': user?.id || 'guest' } })
            .then(res => {
                setSavedResumes(res.data);
            })
            .catch(err => console.error("Failed to load library", err))
            .finally(() => setLoading(false));
    };

    const deleteResume = (id) => {
        if (!confirm("Are you sure you want to delete this resume?")) return;
        axios.delete(`${backendUrl}/resumes/${id}`, { headers: { 'x-user-id': user?.id || 'guest' } })
            .then(() => {
                setSavedResumes(prev => prev.filter(r => r.id !== id));
            })
            .catch(err => alert("Failed to delete"));
    };

    if (loading) return <div className="text-center py-10">Loading Library...</div>;

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {savedResumes.length === 0 && (
                <div className="col-span-2 text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <p className="text-slate-500 font-bold">No saved resumes found.</p>
                    <p className="text-sm text-slate-400">Save detailed AI rewrites or drafts from the Builder to see them here.</p>
                </div>
            )}

            {savedResumes.map(resume => (
                <div key={resume.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${resume.type === 'builder' ? 'bg-indigo-50 text-indigo-600' : 'bg-purple-50 text-purple-600'}`}>
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{resume.title}</h3>
                                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                                        {new Date(resume.createdAt).toLocaleDateString()} • {resume.type === 'builder' ? 'Builder Draft' : 'AI Rewrite'}
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => deleteResume(resume.id)} className="text-slate-300 hover:text-red-500 transition-colors p-2">
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-500 font-mono h-32 overflow-hidden mb-4 relative">
                            {resume.content.substring(0, 300)}...
                            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-slate-50 to-transparent"></div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(resume.content);
                                alert("Content copied to clipboard!");
                            }}
                            className="w-full py-2 rounded-lg bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
                        >
                            Copy Text
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default LibraryView;
