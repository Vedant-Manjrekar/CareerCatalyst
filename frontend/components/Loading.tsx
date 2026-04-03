import React from "react";
import { Loader2, Sparkles } from "lucide-react";

interface LoadingProps {
  variant?: "fullscreen" | "overlay" | "inline";
  message?: string;
  size?: number;
}

export const Loading: React.FC<LoadingProps> = ({ 
  variant = "fullscreen", 
  message = "Loading...", 
  size = 40 
}) => {
  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2">
        <Loader2 size={size / 2} className="animate-spin" />
        {message && <span className="text-sm font-medium">{message}</span>}
      </div>
    );
  }

  if (variant === "overlay") {
    return (
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-inherit animate-in fade-in duration-300">
        <div className="relative">
          <Loader2 size={size} className="text-brand-600 dark:text-moon-400 animate-spin" />
          <Sparkles size={size / 2} className="absolute -top-1 -right-1 text-brand-400 dark:text-moon-500 animate-pulse" />
        </div>
        {message && (
          <p className="mt-4 text-sm font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest animate-pulse">
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-slate-950 overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse" />
      
      <div className="relative flex flex-col items-center">
        {/* Animated Rings */}
        <div className="absolute w-24 h-24 border-2 border-brand-500/20 rounded-full animate-ping" />
        <div className="absolute w-32 h-32 border border-purple-500/10 rounded-full animate-pulse" />
        
        <div className="relative p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-white/5">
          <Loader2 size={size} className="text-brand-600 dark:text-moon-400 animate-spin-slow" />
          <div className="absolute inset-0 flex items-center justify-center">
             <Sparkles size={size / 2.5} className="text-brand-400 dark:text-moon-500" />
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-widest uppercase mb-2">
          Career Catalyst
        </h3>
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] animate-pulse whitespace-nowrap">
          {message}
        </p>
      </div>

      {/* Progress Bar Placeholder */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-900">
        <div className="h-full bg-gradient-to-r from-brand-600 to-purple-600 animate-progress w-2/3" />
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; left: 0%; }
          50% { width: 70%; left: 15%; }
          100% { width: 0%; left: 100%; }
        }
        .animate-progress {
          animation: progress 2s infinite ease-in-out;
          position: absolute;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
      `}</style>
    </div>
  );
};
