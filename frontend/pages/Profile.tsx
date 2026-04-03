import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { API_BASE_URL } from "../apiConfig";
import { Bookmark, Award, ArrowRight, Mail, Briefcase, ChevronDown, ChevronUp, ShieldCheck, Sparkles, RefreshCw, Settings, X, Trash2, Plus, Check, Image as ImageIcon, Share2, Star, TrendingUp, Layers, MapPin, Github, Linkedin, Globe, ExternalLink, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { CareerPath } from "../types";


export const Profile: React.FC = () => {
  const { userProfile, recordResourceView } = useApp();
  const [careerData, setCareerData] = useState<CareerPath[]>([]);
  const [expandedPath, setExpandedPath] = useState<string | null>(null);
  const userName = localStorage.getItem("user_name");
  const avatar_seed = localStorage.getItem("avatar_no");
  const [userData, setUserData] = useState<any>(null);
  
  // Edit States
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditSkillsOpen, setIsEditSkillsOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesignation, setEditDesignation] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const getSavedCareers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/api/career/my-saved`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setCareerData(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch saved careers:", err);
    }
  };

  const fetchUser = async () => {
    const userString = localStorage.getItem("user");
    if (!userString) return;
    const user = JSON.parse(userString);
    try {
      const res = await fetch(`${API_BASE_URL}/user/${user._id}`);
      const data = await res.json();
      if (data.success) {
        setUserData(data.data);
        setEditName(data.data.name);
        setEditDesignation(data.data.designation);
        setEditLocation(data.data.location || "");
        setEditAvatar(data.data.avatar_no);
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,
          designation: editDesignation,
          location: editLocation,
          avatar_no: editAvatar,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUserData(data.data);
        setIsEditProfileOpen(false);
      } else {
        console.error("Backend error:", data.message);
        alert(`Failed to update profile: ${data.message || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error("Network/Fetch error:", err);
      alert(`Failed to update profile: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateSkills = async (updatedSkills: string[]) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/skills`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ skills: updatedSkills }),
      });
      const data = await res.json();
      if (data.success) {
        setUserData(data.data);
      }
    } catch (err) {
      alert("Failed to update skills");
    }
  };

  const handleRemoveCareer = async (e: React.MouseEvent, careerId: string) => {
    e.stopPropagation();
    if (!window.confirm("Remove this career path?")) return;
    
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/api/career/remove/${careerId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCareerData(prev => prev.filter(c => (c as any)._id !== careerId));
      }
    } catch (err) {
      alert("Failed to remove career path");
    }
  };

  const handleRemoveResource = async (url: string) => {
    if (!window.confirm("Remove this resource?")) return;
    
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/resources/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        setUserData((prev: any) => ({
          ...prev,
          savedResources: prev.savedResources.filter((r: any) => r.url !== url)
        }));
      }
    } catch (err) {
      alert("Failed to remove resource");
    }
  };

  useEffect(() => {
    getSavedCareers();
    fetchUser();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedPath(expandedPath === id ? null : id);
  };

  const isActive = (lastActiveDate?: string) => {
    if (!lastActiveDate) return false;
    const diff = Date.now() - new Date(lastActiveDate).getTime();
    return diff < 7 * 24 * 60 * 60 * 1000; // 7 days
  };

  return (
    <div className='max-w-5xl mx-auto py-10 px-4 relative'>
      {/* Mesh Background Accents */}
      <div className='fixed inset-0 pointer-events-none -z-10 overflow-hidden'>
        <div className='absolute top-20 left-10 w-[30rem] h-[30rem] bg-indigo-100/10 dark:bg-indigo-900/10 rounded-full blur-[10rem] animate-pulse duration-[5s]' />
        <div className='absolute bottom-20 right-10 w-[35rem] h-[35rem] bg-brand-100/10 dark:bg-brand-900/10 rounded-full blur-[12rem] animate-pulse duration-[7s]' />
      </div>

      <div className='flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-8 md:p-10 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none relative group/card hover:-translate-y-1 transition-all duration-300'>
        {/* Settings Icon - Shows on card hover */}
        <button 
          onClick={() => setIsEditProfileOpen(true)}
          className='absolute top-6 right-6 p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all z-50 opacity-0 group-hover/card:opacity-100 active:scale-95'
          title='Edit Profile'
        >
          <Settings size={20} />
        </button>

        {/* Left Side: Avatar */}
        <div className='relative shrink-0'>
          <div className='w-32 h-32 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-800 p-1 shadow-lg ring-1 ring-slate-100 dark:ring-slate-800'>
            <div className='w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center overflow-hidden'>
              <img
                src={`https://api.dicebear.com/9.x/dylan/svg?seed=${userData?.avatar_no || avatar_seed}`}
                alt='avatar'
                className='w-full h-full object-cover'
              />
            </div>
          </div>
          {/* Badge */}
          <div className='absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-md border border-slate-100 dark:border-slate-700 flex items-center gap-1.5 whitespace-nowrap z-10'>
            <ShieldCheck size={14} className='text-blue-500' fill='currentColor' />
            <span className='text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest'>Student</span>
          </div>
        </div>

        {/* Center & Bottom Section Container */}
        <div className='flex-1 flex flex-col gap-6 w-full text-center md:text-left mt-2 md:mt-0'>
          
          {/* Top Info Row */}
          <div>
            <div className='flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start'>
              <h1 className='text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
                {userData?.name || userName || "Vedant Manjrekar"}
              </h1>
              {isActive(userData?.lastActive) ? (
                <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/30'>
                  <span className='mr-1.5'>🟢</span> Active Member
                </span>
              ) : (
                <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'>
                  <span className='mr-1.5 opacity-50'>⚪</span> Away
                </span>
              )}
            </div>
            <p className='text-slate-500 dark:text-slate-400 font-bold text-lg'>
              {userData?.designation || userProfile.designation || "Career Seeker"}
            </p>
          </div>

          {/* Key Stats Row */}
          <div className='flex flex-wrap justify-center md:justify-start gap-4'>
          </div>

          {/* Contact & Location Row */}
          <div className='flex flex-wrap justify-center md:justify-start gap-3 mt-2'>
            <button className='flex items-center px-4 py-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-sm font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors group'>
              <Mail size={16} className='mr-2 text-slate-400 group-hover:text-brand-500' />
              {userData?.email || userProfile.email || "Contact Pending"}
            </button>
            <div className='flex items-center px-4 py-2 text-sm font-bold text-slate-500 dark:text-slate-400'>
              <MapPin size={16} className='mr-1.5' /> {userData?.location || "Location not set"}
            </div>
          </div>

        </div>

      </div>

      <div className='grid lg:grid-cols-3 gap-8'>
        {/* Left Column: Stats & Skills */}
        <div className='lg:col-span-1 space-y-8'>
          {/* My Skills Card */}
          <div className='bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-[2rem] border border-slate-100/50 dark:border-slate-800/50 shadow-xl shadow-indigo-100/30 dark:shadow-none hover:shadow-indigo-200/40 transition-all duration-500'>
            <div className='flex items-center justify-between mb-8'>
              <h3 className='text-xl font-bold text-slate-900 dark:text-white flex items-center'>
                <div className='p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg mr-3'>
                  <Sparkles className='text-indigo-600' size={18} />
                </div>
                My Skills
              </h3>
              <div className='flex items-center gap-2'>
                <button 
                  onClick={() => setIsEditSkillsOpen(true)}
                  className='p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 rounded-lg text-indigo-600 transition-colors'
                  title='Manage Skills'
                >
                  <Plus size={18} />
                </button>
                <span className='w-8 h-8 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-black shadow-lg shadow-indigo-500/30'>
                  {userData?.skills?.length || 0}
                </span>
              </div>
            </div>
            {userData?.skills && userData.skills.length > 0 ? (
              <div className='flex flex-wrap gap-2.5'>
                {userData.skills.map((skill: string, idx: number) => {
                  const colors = [
                    "bg-indigo-50/50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800",
                    "bg-emerald-50/50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
                    "bg-amber-50/50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
                    "bg-purple-50/50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
                  ];
                  return (
                    <span
                      key={idx}
                      className={`px-4 py-2 ${colors[idx % colors.length]} text-xs font-bold rounded-xl border border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default`}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            ) : (
              <div className='text-center py-6 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700'>
                <p className='text-sm text-slate-500 font-medium italic'>Your skill cloud is empty. Add skills from roadmaps to begin tracking.</p>
              </div>
            )}
          </div>

          {!userData?.skills?.length && (
            <div className='bg-gradient-to-br from-indigo-600 to-brand-600 dark:from-indigo-700 dark:to-brand-700 rounded-[2rem] p-8 text-white shadow-2xl shadow-brand-500/40 relative overflow-hidden group'>
              <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-500' />
              <h4 className='font-black text-lg mb-3 flex items-center'>
                <Sparkles size={18} className='mr-2' />
                Grow Faster!
              </h4>
              <p className='text-white/90 text-sm font-medium leading-relaxed'>
                Start by adding 3 key skills. This helps our AI provide 40% more accurate career recommendations and personalized roadmaps.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Saved Paths & Resources */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Saved Paths Section */}
          <div className='bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-100/50 dark:border-slate-800/50 shadow-xl shadow-emerald-100/30 dark:shadow-none hover:shadow-emerald-200/40 transition-all duration-500'>
            <div className='flex items-center justify-between mb-8'>
              <h3 className='text-2xl font-bold text-slate-900 dark:text-white flex items-center'>
                <div className='p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl mr-3'>
                  <Bookmark className='text-emerald-500' size={24} />
                </div>
                Saved Career Paths
              </h3>
              <Link
                to='/saved-careers'
                className='text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors flex items-center'
              >
                View Map <ArrowRight size={16} className='ml-1' />
              </Link>
            </div>

            {careerData && careerData.length > 0 ? (
              <div className='space-y-4'>
                {careerData.map((career) => (
                  <div
                    key={career.id}
                    className={`group border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 ${
                      expandedPath === career.id
                        ? "bg-slate-50 dark:bg-slate-800/50 ring-1 ring-brand-500/20 shadow-md"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                    }`}
                  >
                    <button
                      onClick={() => toggleExpand(career.id)}
                      className='w-full text-left p-5 flex items-center justify-between'
                    >
                      <div className='flex items-center gap-4'>
                        <div className={`p-3 rounded-xl transition-colors ${
                          expandedPath === career.id 
                            ? "bg-brand-600 text-white" 
                            : "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400"
                        }`}>
                          <Award size={20} />
                        </div>
                        <div>
                          <h4 className='font-bold text-slate-900 dark:text-white'>
                            {career.title}
                          </h4>
                          <p className='text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold'>
                            {career.salaryRange || "Competitive Salary"}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-3'>
                        <button
                          onClick={(e) => handleRemoveCareer(e, (career as any)._id)}
                          className='p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all'
                          title='Remove Path'
                        >
                          <Trash2 size={18} />
                        </button>
                        <div className='text-slate-400 group-hover:text-emerald-600 transition-colors'>
                          {expandedPath === career.id ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </div>
                      </div>
                    </button>

                    {expandedPath === career.id && (
                      <div className='px-5 pb-6 border-t border-slate-100 dark:border-slate-700/50 pt-4 animate-in fade-in slide-in-from-top-2 duration-300'>
                        <p className='text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4'>
                          {career.description}
                        </p>
                        <div className='flex flex-wrap gap-4 mb-6'>
                          <div className='flex flex-col'>
                            <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1'>Required Skills</span>
                            <div className='flex flex-wrap gap-1.5'>
                              {career.requiredSkills.slice(0, 3).map((s, i) => (
                                <span key={i} className='px-2 py-0.5 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 text-[11px] font-bold rounded-md'>
                                  {s}
                                </span>
                              ))}
                              {career.requiredSkills.length > 3 && (
                                <span className='text-[11px] text-slate-400 font-medium self-center'>+{career.requiredSkills.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Link
                          to={`/career/${career.id}`}
                          className='inline-flex items-center text-sm font-bold text-brand-600 hover:text-brand-700 group/link bg-white dark:bg-slate-900 px-4 py-2 rounded-lg border border-brand-200 dark:border-brand-900/30 hover:shadow-sm transition-all'
                        >
                          View Full Roadmap
                          <ArrowRight size={14} className='ml-2 transform group-hover/link:translate-x-1 transition-transform' />
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800'>
                <Bookmark className='mx-auto text-slate-300 dark:text-slate-700 mb-3' size={40} />
                <p className='text-slate-500 font-medium'>No career paths saved yet.</p>
                <Link to='/finder' className='text-brand-600 font-bold text-sm mt-2 block hover:underline'>Find your first career path</Link>
              </div>
            )}
          </div>

          {/* Saved Resources (Compact version for Profile) */}
          <div className='bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-100/50 dark:border-slate-800/50 shadow-xl shadow-purple-100/30 dark:shadow-none hover:shadow-purple-200/40 transition-all duration-500'>
            <div className='flex items-center justify-between mb-8'>
              <h3 className='text-2xl font-bold text-slate-900 dark:text-white flex items-center'>
                <div className='p-2 bg-purple-50 dark:bg-purple-900/30 rounded-xl mr-3'>
                  <Award className='text-purple-600' size={24} />
                </div>
                Selected Resources
              </h3>
              <span className='px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-black shadow-lg shadow-purple-500/30'>
                {userProfile.savedResources?.length || 0}
              </span>
            </div>
            
            {userProfile.savedResources && userProfile.savedResources.length > 0 ? (
              <div className='grid sm:grid-cols-2 gap-4'>
                {userProfile.savedResources.slice(0, 4).map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    onClick={() => recordResourceView(resource.url)}
                    className='group p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-white dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-900/30 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all duration-300 relative'
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveResource(resource.url);
                      }}
                      className='absolute top-2 right-2 p-1.5 bg-white dark:bg-slate-800 text-slate-400 hover:text-red-500 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity'
                      title='Remove Resource'
                    >
                      <X size={14} />
                    </button>
                    <div className='flex flex-col gap-2'>
                      <span className='text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest'>{resource.type}</span>
                      <p className='text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors line-clamp-1'>
                        {resource.title}
                      </p>
                      {resource.duration && (
                        <p className='text-xs text-slate-500 dark:text-slate-400'>
                          Duration: {resource.duration}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className='text-center py-8 text-slate-500 italic'>No resources saved yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200'>
          <div className='bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200'>
            <div className='flex items-center justify-between mb-8'>
              <h2 className='text-2xl font-black text-slate-900 dark:text-white flex items-center'>
                <Settings className='mr-3 text-brand-600' size={24} />
                Edit Profile
              </h2>
              <button 
                onClick={() => setIsEditProfileOpen(false)}
                className='p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors'
              >
                <X size={20} />
              </button>
            </div>

            <div className='space-y-8'>
              <div className='space-y-3'>
                <label className='text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1'>Full Name</label>
                <div className='relative group'>
                  <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-brand-500 transition-colors'>
                    <Settings size={18} />
                  </div>
                  <input
                    type='text'
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className='w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700/50 rounded-[1.25rem] focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all text-slate-900 dark:text-white font-bold placeholder:text-slate-300'
                    placeholder='Enter your name'
                  />
                </div>
              </div>

              <div className='space-y-3'>
                <label className='text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1'>Current Designation</label>
                <div className='relative group'>
                  <select
                    value={editDesignation}
                    onChange={(e) => setEditDesignation(e.target.value)}
                    className='w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700/50 rounded-[1.25rem] focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all text-slate-900 dark:text-white font-bold appearance-none cursor-pointer'
                  >
                    <option value='Student'>Student</option>
                    <option value='Working Professional'>Working Professional</option>
                    <option value='Other'>Other</option>
                  </select>
                  <div className='absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-slate-400'>
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              <div className='space-y-3'>
                <label className='text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1'>Location</label>
                <div className='relative group'>
                  <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-brand-500 transition-colors'>
                    <MapPin size={18} />
                  </div>
                  <input
                    type='text'
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className='w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700/50 rounded-[1.25rem] focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all text-slate-900 dark:text-white font-bold placeholder:text-slate-300'
                    placeholder='e.g. Mumbai, India'
                  />
                </div>
              </div>

              <button
                onClick={handleUpdateProfile}
                disabled={isUpdating}
                className='w-full py-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-black rounded-2xl shadow-xl shadow-brand-500/30 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-4 text-lg'
              >
                {isUpdating ? <RefreshCw className='animate-spin' size={22} /> : <Check size={22} />}
                Update Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Skills Modal */}
      {isEditSkillsOpen && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200'>
          <div className='bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200'>
            <div className='flex items-center justify-between mb-8'>
              <h2 className='text-2xl font-black text-slate-900 dark:text-white flex items-center'>
                <Sparkles className='mr-3 text-indigo-600' size={24} />
                Manage Skills
              </h2>
              <button 
                onClick={() => setIsEditSkillsOpen(false)}
                className='p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors'
              >
                <X size={20} />
              </button>
            </div>

            <div className='space-y-6'>
              <div className='flex gap-2'>
                <input
                  type='text'
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && newSkill.trim()) {
                      handleUpdateSkills([...(userData?.skills || []), newSkill.trim()]);
                      setNewSkill("");
                    }
                  }}
                  placeholder='Add a skill...'
                  className='flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all'
                />
                <button
                  onClick={() => {
                    if (newSkill.trim()) {
                      handleUpdateSkills([...(userData?.skills || []), newSkill.trim()]);
                      setNewSkill("");
                    }
                  }}
                  className='p-3 bg-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/20'
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className='max-h-60 overflow-y-auto pr-2 custom-scrollbar'>
                <div className='flex flex-wrap gap-2'>
                  {userData?.skills?.map((skill: string, idx: number) => (
                    <div key={idx} className='flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300'>
                      {skill}
                      <button 
                        onClick={() => handleUpdateSkills(userData.skills.filter((s: string) => s !== skill))}
                        className='text-slate-400 hover:text-red-500 transition-colors'
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsEditSkillsOpen(false)}
                className='w-full py-4 bg-slate-900 dark:bg-slate-800 text-white font-black rounded-2xl transition-all'
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
