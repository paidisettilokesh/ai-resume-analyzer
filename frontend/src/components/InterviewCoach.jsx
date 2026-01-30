import React, { useState } from 'react';
import { HelpCircle, Mic, MicOff, MessageSquare, Volume2, FileText, Loader2, Play } from 'lucide-react';

const InterviewCoach = ({ runFeature, interviewPrep, loading, jobDescription, setJobDescription }) => {
    const [activeQuestion, setActiveQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [showAnswer, setShowAnswer] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // --- SPEECH RECOGNITION (Input) ---
    const startListening = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => setIsSpeaking(true);
            recognition.onend = () => setIsSpeaking(false);
            recognition.onerror = (event) => { console.error("Speech error", event); setIsSpeaking(false); };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setUserAnswer(prev => prev + (prev ? ' ' : '') + transcript);
            };

            recognition.start();
        } else {
            alert("Speech recognition not supported in this browser. Please use Chrome/Edge.");
        }
    };

    // --- SPEECH SYNTHESIS (Output) ---
    const speak = (text) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="space-y-8 animate-soft-fade">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-slate-800 mb-2">AI Interview Coach 🎙️</h2>
                <p className="text-slate-500">Practice with voice-interactive AI questions.</p>
            </div>

            {/* SETUP PHASE */}
            {!interviewPrep ? (
                <div className="card max-w-2xl mx-auto space-y-6">
                    <div className="space-y-2">
                        <label className="font-bold text-slate-700">Target Role Context</label>
                        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 font-bold border border-indigo-100 flex items-center gap-2">
                            <MessageSquare size={18} /> Tech Interview Simulation
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="font-bold text-slate-700 flex items-center gap-2">
                            <FileText size={18} /> Paste Job Description
                        </label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="input-field h-40"
                            placeholder="Paste the JD here to get specific questions..."
                        />
                    </div>

                    <button
                        onClick={() => runFeature('interview')}
                        disabled={loading || !jobDescription}
                        className="btn-primary w-full flex justify-center items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Play size={20} />}
                        Start Interview Session
                    </button>
                </div>
            ) : (
                /* INTERVIEW PHASE */
                <div className="grid lg:grid-cols-2 gap-8 h-[600px]">
                    {/* LEFT: QUESTIONS LIST */}
                    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <HelpCircle className="text-indigo-600" /> Session Questions
                        </h3>
                        {interviewPrep.commonQuestions?.map((q, i) => (
                            <div
                                key={i}
                                onClick={() => { setActiveQuestion(q); setUserAnswer(''); setShowAnswer(false); }}
                                className={`p-5 rounded-2xl border cursor-pointer transition-all ${activeQuestion === q ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 transform scale-[1.02]' : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-700'}`}
                            >
                                <p className={`font-bold text-sm leading-relaxed`}>{i + 1}. {q.question}</p>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT: PRACTICE AREA */}
                    <div className="relative h-full">
                        {!activeQuestion ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                                <MessageSquare size={48} className="mb-4 opacity-50" />
                                <p>Select a question from the left to start.</p>
                            </div>
                        ) : (
                            <div className="card border-2 border-indigo-100 shadow-xl h-full flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <h4 className="text-lg font-black text-slate-800">Your Answer</h4>
                                    <button onClick={() => speak(activeQuestion?.question)} className="text-indigo-500 hover:bg-indigo-50 p-2 rounded-full transition-colors" title="Read Question"><Volume2 size={24} /></button>
                                </div>

                                <p className="text-slate-600 font-medium mb-6 min-h-[60px] text-lg">{activeQuestion?.question}</p>

                                <div className="relative flex-grow mb-4">
                                    <textarea
                                        value={userAnswer}
                                        onChange={(e) => setUserAnswer(e.target.value)}
                                        className="input-field h-full pr-12 focus:ring-4 ring-indigo-500/10 transition-all font-medium text-slate-600 text-lg p-6"
                                        placeholder="Type your answer here or tap the mic to speak..."
                                    />
                                    <button
                                        onClick={startListening}
                                        className={`absolute bottom-4 right-4 p-4 rounded-full transition-all shadow-xl ${isSpeaking ? 'bg-rose-500 text-white animate-pulse shadow-rose-300' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-110'}`}
                                        title="Click to Record Answer"
                                    >
                                        {isSpeaking ? <MicOff size={24} /> : <Mic size={24} />}
                                    </button>
                                </div>

                                <div className="mt-auto flex gap-3">
                                    <button onClick={() => setShowAnswer(!showAnswer)} className="flex-1 py-3 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                                        {showAnswer ? 'Hide Sample' : 'Recall Sample Answer'}
                                    </button>
                                </div>

                                {showAnswer && (
                                    <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in-up">
                                        <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Ideal Answer Scope</div>
                                        <p className="text-sm text-slate-600 leading-relaxed italic">{activeQuestion?.answer}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewCoach;
