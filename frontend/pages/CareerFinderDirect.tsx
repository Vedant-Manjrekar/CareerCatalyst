import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { searchByRole } from '../services/geminiService';

export const CareerFinderDirect: React.FC = () => {
  const navigate = useNavigate();
  const { setSearchResults } = useApp();
  const [roleInput, setRoleInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleInput.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchByRole(roleInput);
      setSearchResults(results);
      navigate('/finder/results');
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <button 
        onClick={() => navigate('/finder')}
        className="flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors mb-12 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Options</span>
      </button>

      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl mb-6">
          <Search size={40} />
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">What role are you looking for?</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">Enter any job title, and our AI will map out the perfect career path for you.</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
          </div>
          <input
            type="text"
            autoFocus
            placeholder="e.g. Senior Product Designer, Cloud Architect..."
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            disabled={loading}
            className="block w-full pl-16 pr-24 py-6 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700/50 rounded-3xl text-xl text-slate-900 dark:text-white placeholder-slate-400 shadow-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all"
          />
          <div className="absolute inset-y-0 right-3 flex items-center">
            <button
              type="submit"
              disabled={loading || !roleInput.trim()}
              className="bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95 pr-6"
            >
              {loading ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Search</span>
                  <ArrowRight size={24} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-400">
          <span className="flex items-center gap-1.5"><Sparkles size={16} className="text-yellow-500" /> AI-Powered Recommendations</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 self-center"></span>
          <span>Market-Standard Salary Data</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 self-center"></span>
          <span>Customized Learning Roadmaps</span>
        </div>
      </div>
    </div>
  );
};
