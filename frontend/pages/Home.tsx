import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Target, Award, CheckCircle } from "lucide-react";

export const Home: React.FC = () => {
  return (
    <div className='relative overflow-hidden py-16 lg:py-24'>
      {/* Background Decor */}
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-50 dark:bg-moon-900/10 rounded-full blur-3xl opacity-50 -z-10 transition-colors duration-300' />

      <div className='text-center max-w-4xl mx-auto relative z-10'>
        {/* Top Left Floating Card */}
        <div className='hidden lg:block absolute -left-32 top-10 animate-float z-20'>
          <div className='bg-white dark:bg-slate-800/50 dark:backdrop-blur-md p-4 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-white/5 rotate-[-6deg] w-64 text-left transition-colors duration-300'>
            <div className='text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2'>
              Skill Analysis
            </div>
            <div className='flex gap-3 text-slate-400 justify-around'>
              <div className='w-8 h-8 bg-slate-100 dark:bg-white/5 rounded-md flex items-center justify-center'>
                <Sparkles size={16} />
              </div>
              <div className='w-8 h-8 bg-slate-100 dark:bg-white/5 rounded-md flex items-center justify-center'>
                <Target size={16} />
              </div>
              <div className='w-8 h-8 bg-slate-100 dark:bg-white/5 rounded-md flex items-center justify-center'>
                <Award size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Top Right Floating Card */}
        <div className='hidden lg:block absolute -right-32 top-0 animate-float-delayed z-20'>
          <div className='bg-white dark:bg-slate-800/50 dark:backdrop-blur-md p-5 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-white/5 rotate-[6deg] w-72 text-left transition-colors duration-300'>
            <div className='text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3'>
              Career Role Matching
            </div>
            <div className='space-y-2'>
              <div className='flex justify-between text-xs text-slate-500 dark:text-slate-400'>
                <span>Product Manager</span>
                <span className='text-brand-600 dark:text-moon-300 font-bold'>
                  92%
                </span>
              </div>
              <div className='w-full bg-slate-100 dark:bg-white/10 rounded-full h-1.5'>
                <div
                  className='bg-brand-600 dark:bg-moon-400 h-1.5 rounded-full'
                  style={{ width: "92%" }}
                ></div>
              </div>
              <div className='flex justify-between text-xs text-slate-500 dark:text-slate-400'>
                <span>UX Designer</span>
                <span className='text-brand-600 dark:text-moon-300 font-bold'>
                  85%
                </span>
              </div>
              <div className='w-full bg-slate-100 dark:bg-white/10 rounded-full h-1.5'>
                <div
                  className='bg-brand-400 dark:bg-moon-400/50 h-1.5 rounded-full'
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Hero Content */}
        <div className='inline-flex items-center justify-center p-3 bg-white dark:bg-white/5 dark:backdrop-blur-sm shadow-sm rounded-xl mb-8 border border-slate-200 dark:border-white/10 transition-colors duration-300'>
          <Sparkles
            className='text-brand-600 dark:text-moon-300 mr-2'
            size={20}
          />
          <span className='text-slate-600 dark:text-slate-200 font-medium'>
            AI-Powered Career Growth
          </span>
        </div>

        <h1 className='text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-6'>
          Unlock Your Potential: <br />
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-brand-700 to-brand-600 dark:from-moon-300 dark:to-indigo-300'>
            Skill Up & Grow Your Career
          </span>
        </h1>

        <p className='text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed'>
          Efficiently manage your skills, find career opportunities, and boost
          your professional growth with personalized AI roadmaps.
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
          <Link
            to='/finder'
            className='px-8 py-4 bg-brand-600 hover:bg-brand-700 dark:bg-moon-600 dark:hover:bg-moon-500 text-white rounded-lg font-semibold text-lg transition-all shadow-lg shadow-brand-500/30 dark:shadow-moon-500/40 flex items-center'
          >
            Get Started Now
            <ArrowRight className='ml-2' size={20} />
          </Link>
          <Link
            to='/chat'
            className='px-8 py-4 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-moon-100 border border-slate-300 dark:border-moon-500/70 hover:border-brand-300 dark:hover:border-moon-400 rounded-lg font-semibold text-lg transition-all'
          >
            Ask AI Assistant
          </Link>
        </div>

        {/* Bottom Left Floating Card */}
        <div className='hidden lg:block absolute -left-20 bottom-[-100px] animate-float z-0'>
          <div className='bg-white dark:bg-slate-800/50 dark:backdrop-blur-md p-4 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-white/5 rotate-[3deg] w-64 text-left transition-colors duration-300'>
            <div className='text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2'>
              Skill Gap Detection
            </div>
            <div className='flex flex-wrap gap-2'>
              <span className='px-2 py-1 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-300 text-xs rounded-full'>
                Data Analysis
              </span>
              <span className='px-2 py-1 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-300 text-xs rounded-full'>
                Prototyping
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Right Floating Card */}
        <div className='hidden lg:block absolute -right-10 bottom-[-80px] animate-float-delayed z-0'>
          <div className='bg-white dark:bg-slate-800/50 dark:backdrop-blur-md p-4 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-white/5 rotate-[-3deg] w-72 text-left transition-colors duration-300'>
            <div className='text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2'>
              Personalized Roadmap
            </div>
            <div className='flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs'>
              <CheckCircle
                className='text-green-500 dark:text-green-400'
                size={16}
              />
              <span>Advanced Figma Course</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
