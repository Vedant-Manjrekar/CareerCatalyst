import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Bookmark, Award, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const SavedCareers: React.FC = () => {
  const { userProfile } = useApp();
  const [careerData, setCareerData] = useState();
  const navigate = useNavigate();

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

  console.log(careerData);

  useEffect(() => {
    getSavedCareers();

    return () => {
      //   getSavedCareers();
    };
  }, []);

  const removeCareer = async (id) => {
    console.log(id);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8000/api/career/remove/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        getSavedCareers();
      }
    } catch (e) {
      console.error("Removal failed", e);
    }
  };

  return (
    <div className='max-w-5xl mx-auto py-10 px-4'>
      <div className='flex items-center gap-4 mb-8'>
        <button
          onClick={() => navigate(-1)}
          className='p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
        >
          <ArrowLeft size={24} className='text-slate-600 dark:text-slate-400' />
        </button>
        <h1 className='text-3xl font-bold text-slate-900 dark:text-white flex items-center'>
          <Bookmark
            className='mr-3 text-brand-600 dark:text-brand-400'
            size={28}
          />
          Saved Career Paths
        </h1>
      </div>

      {careerData?.length === 0 ? (
        <div className='text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 transition-colors duration-300'>
          <div className='w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6'>
            <Award className='text-slate-300 dark:text-slate-600' size={40} />
          </div>
          <h3 className='text-xl font-semibold text-slate-900 dark:text-white mb-2'>
            No careers saved yet
          </h3>
          <p className='text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto'>
            Start exploring to find career paths that match your skills and
            interests.
          </p>
          <Link
            to='/finder'
            className='px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors'
          >
            Find a Career
          </Link>
        </div>
      ) : (
        <div className='grid md:grid-cols-2 gap-6'>
          {careerData?.map((career) => (
            <div
              key={career.id}
              className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all group relative'
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeCareer(career._id);
                }}
                className='absolute top-4 right-4 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 z-10'
                title='Remove'
              >
                <Trash2 size={18} />
              </button>

              <div className='pr-10'>
                <h3 className='text-xl font-bold text-slate-900 dark:text-white mb-2'>
                  {career.title}
                </h3>
                <p className='text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2'>
                  {career.description}
                </p>
              </div>

              <div className='flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800'>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    career.matchPercentage && career.matchPercentage > 80
                      ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
                      : "bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                  }`}
                >
                  {career.matchPercentage
                    ? `${career.matchPercentage}% Match`
                    : "Saved Path"}
                </span>
                <Link
                  to={`/saved-career/${career.id}`}
                  className='text-brand-600 dark:text-brand-400 font-medium text-sm flex items-center hover:text-brand-800 dark:hover:text-brand-300 group-hover:translate-x-1 transition-transform'
                >
                  View Plan <ArrowRight size={16} className='ml-1' />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
