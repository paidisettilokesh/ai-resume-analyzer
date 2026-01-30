import React from 'react';
import { Briefcase, Search, Globe, DollarSign, TrendingUp, MapPin } from 'lucide-react';
import { getJobLinks } from '../utils/helpers';

const MarketInsightsTab = ({
    runFeature, salaryEstimate, jobSearchData,
    loading, selectedRole, location
}) => {
    return (
        <div className="space-y-8 animate-soft-fade">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-slate-800 mb-2">Market Insights</h2>
                <p className="text-slate-500">Salary data and active job listings for {selectedRole}.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">

                {/* SALARY SECTION */}
                <div className="space-y-6">
                    <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl text-center">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <DollarSign size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-emerald-900 mb-2">Salary Estimator</h3>
                        <p className="text-emerald-700/80 mb-6 text-sm">Get a data-backed valuation of your profile.</p>

                        {!salaryEstimate ? (
                            <button
                                onClick={() => runFeature('salary')}
                                disabled={loading}
                                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg w-full"
                            >
                                {loading ? 'Calculating...' : 'Estimate My Salary'}
                            </button>
                        ) : (
                            <div className="animate-fade-in-up">
                                <div className="text-4xl font-black text-emerald-600 mb-2">
                                    {salaryEstimate.salaryRange?.min} - {salaryEstimate.salaryRange?.max}
                                </div>
                                <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">Annual Compensation</p>
                                <div className="bg-white p-4 rounded-xl text-left border border-emerald-100">
                                    <p className="text-sm text-slate-600 leading-relaxed">{salaryEstimate.explanation}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* JOBS SECTION */}
                <div className="space-y-6">
                    <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-3xl">
                        <div className="flex items-center gap-3 mb-6 justify-center">
                            <Search size={24} className="text-indigo-600" />
                            <h3 className="text-xl font-bold text-indigo-900">Active Listings</h3>
                        </div>

                        <div className="space-y-3">
                            {getJobLinks(selectedRole, location).map((job) => (
                                <a
                                    key={job.platform}
                                    href={job.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-indigo-100 hover:scale-[1.02] transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${job.platform === 'Naukri' ? 'bg-blue-100 text-blue-600' : job.platform === 'LinkedIn' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                            <Globe size={18} />
                                        </div>
                                        <span className="font-bold text-slate-700">{job.platform}</span>
                                    </div>
                                    <span className="text-xs font-bold text-indigo-500 group-hover:translate-x-1 transition-transform">Apply Now &rarr;</span>
                                </a>
                            ))}
                        </div>
                        <p className="text-center text-xs text-indigo-400 mt-4 font-medium">Auto-generated search links for your role</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketInsightsTab;
