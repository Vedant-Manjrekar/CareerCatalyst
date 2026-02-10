import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, PenTool, Search, ArrowRight, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { searchByRole } from '../services/geminiService';

export const CareerFinder: React.FC = () => {
  const navigate = useNavigate();
  const { searchResults } = useApp();

  useEffect(() => {
    if (searchResults.length > 0) {
      navigate('/finder/results', { replace: true });
    }
  }, [searchResults, navigate]);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Find Your Next Role</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-lg mx-auto">Choose how you want to discover career paths tailored to you.</p>
      </div>

      {/* Method Selection */}
      <div className="grid md:grid-cols-3 gap-8">
        <button
          onClick={() => navigate('/finder/manual')}
          className="p-10 rounded-3xl border-2 border-white dark:border-slate-700/50 bg-white dark:bg-slate-800 hover:border-brand-200 dark:hover:border-moon-500/30 hover:shadow-2xl dark:hover:bg-slate-800/80 transition-all text-left group flex flex-col h-full active:scale-95"
        >
          <div className="bg-brand-100 dark:bg-brand-900/30 w-16 h-16 rounded-2xl flex items-center justify-center text-brand-600 dark:text-brand-400 mb-8 group-hover:scale-110 transition-transform">
            <PenTool size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Enter Skills</h3>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8 flex-grow">
            Type in your current skills and tools to get instant career matches based on your expertise.
          </p>
          <div className="flex items-center text-brand-600 dark:text-brand-400 font-bold group-hover:translate-x-2 transition-transform mt-auto">
            Get Started <ArrowRight size={20} className="ml-2" />
          </div>
        </button>

        <button
           onClick={() => navigate('/finder/resume')}
           className="p-10 rounded-3xl border-2 border-white dark:border-slate-700/50 bg-white dark:bg-slate-800 hover:border-purple-200 dark:hover:border-purple-500/30 hover:shadow-2xl dark:hover:bg-slate-800/80 transition-all text-left group flex flex-col h-full active:scale-95"
        >
          <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-8 group-hover:scale-110 transition-transform">
            <Upload size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Scan Resume</h3>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8 flex-grow">
            Upload your CV or Resume. Our AI will analyze your profile and suggest matching career paths.
          </p>
          <div className="flex items-center text-purple-600 dark:text-purple-400 font-bold group-hover:translate-x-2 transition-transform mt-auto">
            Upload Resume <ArrowRight size={20} className="ml-2" />
          </div>
        </button>

        <button
           onClick={() => navigate('/finder/direct')}
           className="p-10 rounded-3xl border-2 border-white dark:border-slate-700/50 bg-white dark:bg-slate-800 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:shadow-2xl dark:hover:bg-slate-800/80 transition-all text-left group flex flex-col h-full active:scale-95"
        >
          <div className="bg-emerald-100 dark:bg-emerald-900/30 w-16 h-16 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-8 group-hover:scale-110 transition-transform">
            <Search size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Search Job Role</h3>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8 flex-grow">
            Know exactly what you want? Search for any job title to get a detailed roadmap and salary info.
          </p>
          <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold group-hover:translate-x-2 transition-transform mt-auto">
            Find Path <ArrowRight size={20} className="ml-2" />
          </div>
        </button>
      </div>
    </div>
  );
};