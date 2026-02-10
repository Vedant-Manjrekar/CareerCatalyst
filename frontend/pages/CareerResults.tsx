import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CareerPath } from "../types";

export const CareerResults: React.FC = () => {
  const navigate = useNavigate();
  const { saveCareer, searchResults, clearSearchResults } = useApp();

  const handleCareerSelect = (career: CareerPath) => {
    saveCareer(career);
    navigate(`/career/${career.id}`, { state: { career } });
  };

  const handleStartOver = () => {
    clearSearchResults();
    navigate("/finder");
  };

  if (searchResults.length === 0) {
    return (
      <div className='max-w-4xl mx-auto py-10 text-center'>
        <h2 className='text-2xl font-bold text-slate-900 dark:text-white mb-4'>
          No results found
        </h2>
        <p className='text-slate-500 dark:text-slate-400 mb-8'>
          We couldn't generate recommendations based on the input. Please try
          again.
        </p>
        <button
          onClick={handleStartOver}
          className='px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors'
        >
          Go Back
        </button>
      </div>
    );
  }

  console.log(searchResults);

  return (
    <div className='max-w-5xl mx-auto py-10 px-4'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <div className='flex items-center gap-2 mb-2'>
            <span className='bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider'>
              Active Search
            </span>
          </div>
          <h2 className='text-3xl font-bold text-slate-900 dark:text-white'>
            Recommended Career Paths
          </h2>
          <p className='text-slate-500 dark:text-slate-400 mt-1'>
            Based on your skills profile, here are the top matches.
          </p>
        </div>
        <button
          onClick={handleStartOver}
          className='flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/10 dark:hover:text-red-400 dark:hover:border-red-900/30 text-sm transition-all font-medium'
        >
          <Trash2 size={16} />
          Start New Search
        </button>
      </div>

      <div className='grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
        {searchResults.map((career) => (
          <div
            key={career.id}
            onClick={() => handleCareerSelect(career)}
            className='bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:border-brand-300 dark:hover:border-brand-800 hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden'
          >
            <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity'>
              <ArrowRight
                className='text-brand-600 dark:text-brand-400 -rotate-45 group-hover:rotate-0 transition-transform duration-300'
                size={24}
              />
            </div>

            <div className='flex justify-between items-start mb-3 pr-8'>
              <h4 className='text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors'>
                {career.title}
              </h4>
            </div>

            <div className='mb-4'>
              {career.matchPercentage && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    career.matchPercentage > 85
                      ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400"
                      : "bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-400"
                  }`}
                >
                  {career.matchPercentage}% Match
                </span>
              )}
            </div>

            <p className='text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 h-10'>
              {career.description}
            </p>

            <div className='mb-6'>
              <div className='text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2'>
                Key Skills
              </div>
              <div className='flex flex-wrap gap-2'>
                {career.requiredSkills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className='bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded-md'
                  >
                    {skill}
                  </span>
                ))}
                {career.requiredSkills.length > 4 && (
                  <span className='text-xs text-slate-400 py-1 pl-1'>
                    + {career.requiredSkills.length - 4} more
                  </span>
                )}
              </div>
            </div>

            <div className='flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto'>
              <span className='text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full'>
                {career.salaryRange ? career.salaryRange : "Competitive"}
              </span>
              <span className='text-brand-600 dark:text-brand-400 font-semibold text-sm group-hover:translate-x-1 transition-transform flex items-center'>
                View Roadmap <ArrowRight size={16} className='ml-1' />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
