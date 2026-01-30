import React from 'react';
import { Home, Zap, BookOpen, Briefcase, TrendingUp, CheckCircle, FilePlus, Flame, Clock } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab }) => {
    // 100% Success: Consolidated Tabs Lists
    const tabs = [
        { id: 'home', label: 'Dashboard', icon: Home },
        { id: 'analyzer', label: 'Analysis', icon: Zap },
        { id: 'optimize', label: 'Optimize', icon: TrendingUp }, // Merged Rewrite + Tailor + Cover Letter
        { id: 'market', label: 'Market Insights', icon: Briefcase }, // Merged Salary + Jobs
        { id: 'interview', label: 'Interview Coach', icon: CheckCircle },
        { id: 'courses', label: 'Learning', icon: BookOpen },
        { id: 'builder', label: 'Resume Builder', icon: FilePlus },
        { id: 'roast', label: 'Roast', icon: Flame },
        { id: 'history', label: 'History', icon: Clock }
    ];

    return (
        <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide">
            <div className="nav-tabs-container">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`nav-tab ${activeTab === tab.id ? 'nav-tab-active' : 'nav-tab-inactive'}`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Navigation;
