import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Bookmark, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Profile: React.FC = () => {
  const { userProfile } = useApp();
  const [careerData, setCareerData] = useState();
  const userName = localStorage.getItem("user_name");
  const avatar_seed = localStorage.getItem("avatar_no");
  const [userData, setUserData] = useState([]);

  const getSavedCareers = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/api/career/my-saved", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setCareerData(data.data);
  };

  const fetchUser = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await fetch(`http://localhost:8000/user/${user._id}`);
    const data = await res.json();

    setUserData(data.data);
    console.log(data.data);
  };

  useEffect(() => {
    getSavedCareers();
    fetchUser();
    console.log(userData);
  }, []);

  return (
    <div className='max-w-5xl mx-auto py-10'>
      <div className='flex items-center space-x-4 mb-10'>
        <div className='w-20 h-20 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg'>
          <img
            src={`https://api.dicebear.com/9.x/dylan/svg?seed=${avatar_seed}`}
            alt='avatar'
          />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-slate-900 dark:text-white'>
            {userName}
          </h1>
          <p className='text-slate-500 dark:text-slate-400'>
            Aspiring Professional
          </p>
        </div>
      </div>

      <div className='grid md:grid-cols-3 gap-6 mb-10'>
        <div className='bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300'>
          <div className='text-slate-500 dark:text-slate-400 text-sm font-medium mb-1'>
            My Skills
          </div>
          <div className='text-3xl font-bold text-slate-900 dark:text-white'>
            {userData?.skills?.length}
          </div>
        </div>
        <div className='bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300'>
          <div className='text-slate-500 dark:text-slate-400 text-sm font-medium mb-1'>
            Saved Paths
          </div>
          <div className='text-3xl font-bold text-slate-900 dark:text-white'>
            {careerData?.length}
          </div>
        </div>
        <div className='bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300'>
          <div className='text-slate-500 dark:text-slate-400 text-sm font-medium mb-1'>
            Resources Completed
          </div>
          <div className='text-3xl font-bold text-green-600 dark:text-green-500'>
            {userProfile.completedResources.length}
          </div>
        </div>
      </div>

      <div className='grid md:grid-cols-2 gap-6'>
        {/* Saved Careers Card */}
        <div className='bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-full'>
          <div>
            <div className='flex items-center gap-3 mb-4'>
              <div className='p-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg text-brand-600 dark:text-brand-400'>
                <Bookmark size={24} />
              </div>
              <h3 className='text-xl font-bold text-slate-900 dark:text-white'>
                Saved Paths
              </h3>
            </div>
            <p className='text-slate-600 dark:text-slate-400 mb-6'>
              You have{" "}
              <span className='font-semibold text-slate-900 dark:text-white'>
                {careerData?.length}
              </span>{" "}
              saved career path
              {careerData?.length !== 1 ? "s" : ""}. Review your roadmaps and
              track your progress.
            </p>
          </div>
          <Link
            to='/saved-careers'
            className='w-full text-center px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-sm transition-colors flex items-center justify-center'
          >
            View All Saved <ArrowRight size={18} className='ml-2' />
          </Link>
        </div>

        {/* Resources Card (Placeholder for future feature expansion) */}
        <div className='bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-full'>
          <div>
            <div className='flex items-center gap-3 mb-4'>
              <div className='p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400'>
                <Award size={24} />
              </div>
              <h3 className='text-xl font-bold text-slate-900 dark:text-white'>
                Achievements
              </h3>
            </div>
            <p className='text-slate-600 dark:text-slate-400 mb-6'>
              You have completed{" "}
              <span className='font-semibold text-slate-900 dark:text-white'>
                {userProfile.completedResources.length}
              </span>{" "}
              learning resource
              {userProfile.completedResources.length !== 1 ? "s" : ""}. Keep
              learning to bridge your skill gaps.
            </p>
          </div>
          {/* Could link to a resources page in future */}
          <button
            disabled
            className='w-full text-center px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-semibold rounded-xl cursor-not-allowed flex items-center justify-center'
          >
            View Achievements <ArrowRight size={18} className='ml-2' />
          </button>
        </div>
      </div>
    </div>
  );
};
