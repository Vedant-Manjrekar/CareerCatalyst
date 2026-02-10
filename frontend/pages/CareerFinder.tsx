import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, PenTool } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CareerFinder: React.FC = () => {
  const navigate = useNavigate();
  const { searchResults } = useApp();

  useEffect(() => {
    if (searchResults.length > 0) {
      navigate('/finder/results', { replace: true });
    }
  }, [searchResults, navigate]);

  return (
    <div className="max-w-4xl mx-auto py-10">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Find Your Next Role</h2>
        <p className="text-slate-500 dark:text-slate-400">Choose how you want to discover career paths tailored to you.</p>
      </div>

      {/* Method Selection */}
      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={() => navigate('/finder/manual')}
          className="p-8 rounded-2xl border-2 border-white dark:border-slate-700/50 bg-white dark:bg-slate-800 hover:border-brand-200 dark:hover:border-moon-500/30 hover:shadow-xl dark:hover:bg-slate-800/80 transition-all text-left group"
        >
          <div className="bg-brand-100 dark:bg-white/5 w-14 h-14 rounded-xl flex items-center justify-center text-brand-600 dark:text-moon-300 mb-6 group-hover:scale-110 transition-transform">
            <PenTool size={28} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Enter Skills Manually</h3>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Type in your current skills, tools, and expertise to get instant career matches tailored to your profile.
          </p>
        </button>

        <button
           onClick={() => navigate('/finder/resume')}
           className="p-8 rounded-2xl border-2 border-white dark:border-slate-700/50 bg-white dark:bg-slate-800 hover:border-brand-200 dark:hover:border-moon-500/30 hover:shadow-xl dark:hover:bg-slate-800/80 transition-all text-left group"
        >
          <div className="bg-purple-100 dark:bg-white/5 w-14 h-14 rounded-xl flex items-center justify-center text-purple-600 dark:text-moon-300 mb-6 group-hover:scale-110 transition-transform">
            <Upload size={28} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Scan Resume</h3>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Upload your existing CV or Resume. Our AI will analyze your document to identify your strengths and suggest paths.
          </p>
        </button>
      </div>
    </div>
  );
};