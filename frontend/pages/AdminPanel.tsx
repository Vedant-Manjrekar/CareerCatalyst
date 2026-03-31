import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Users,
  BookOpen,
  Trash2,
  Shield,
  User as UserIcon,
  MoreVertical,
  Search,
  Filter,
  ArrowUpRight,
  Plus,
  ExternalLink,
  Activity,
  CheckCircle2,
  AlertCircle,
  X,
  Calendar,
  Award,
  Mail,
} from "lucide-react";
import { Navigate } from "react-router-dom";

export const AdminPanel: React.FC = () => {
  const {
    isAdmin,
    allUsers,
    deleteUser,
    toggleAdminRole,
    approveUser,
    globalResources,
    addGlobalResource,
    deleteGlobalResource,
    recordResourceView,
  } = useApp();
  const [activeTab, setActiveTab] = useState<"users" | "resources">("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [approvalFilter, setApprovalFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [quickFilter, setQuickFilter] = useState<"all" | "active" | "recent" | "popular">("all");

  const [careerData, setCareerData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // User Details Modal State
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const displayedUser = allUsers.find(u => u.id === selectedUserId) || null;

  useEffect(() => {
    if (selectedUserId && !allUsers.find(u => u.id === selectedUserId)) {
      setSelectedUserId(null); // auto-close if user is deleted
    }
  }, [allUsers, selectedUserId]);

  const pendingAdminsCount = allUsers.filter(
    (u) => u.role.toLowerCase() === "admin" && !u.isApproved
  ).length;

  // New Resource Form State
  const [newResource, setNewResource] = useState({
    title: "",
    url: "",
    type: "Article" as "Article" | "Video" | "Course",
    duration: "",
  });

  const getAllSavedCareers = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/api/career/all-saved", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setCareerData(data.data);

    console.log(data.data);
  };

  useEffect(() => {
    getAllSavedCareers();
  }, []);

  const deleteUserAction = async (id: string) => {
    await deleteUser(id);
  };

  // Protect the route
  if (!isAdmin) {
    return <Navigate to='/' replace />;
  }

  const filteredUsers = allUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === "all" || u.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesApproval =
      approvalFilter === "all" ||
      (approvalFilter === "pending" ? !u.isApproved : u.isApproved);
    const matchesQuick =
      quickFilter === "all" || quickFilter === "popular" ||
      (quickFilter === "active" && u.lastActive && new Date(u.lastActive).getTime() >= Date.now() - 24 * 60 * 60 * 1000) ||
      (quickFilter === "recent" && new Date(u.joinDate).getTime() >= Date.now() - 7 * 24 * 60 * 60 * 1000);
    return matchesSearch && matchesRole && matchesApproval && matchesQuick;
  });

  const filteredResources = globalResources.filter((r) => {
    const matchesSearch = r.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || r.type === typeFilter;
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    if (quickFilter === "popular") {
      return (b.views || 0) - (a.views || 0);
    }
    return 0;
  });

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    addGlobalResource(newResource);
    setIsModalOpen(false);
    setNewResource({ title: "", url: "", type: "Article", duration: "" });
  };

  return (
    <div className='max-w-7xl mx-auto py-8'>
      {/* Page Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3'>
          <Shield className='text-brand-600 dark:text-moon-400' size={32} />
          Admin Dashboard
        </h1>
        <p className='text-slate-500 dark:text-slate-400 mt-2'>
          Manage users, curated resources, and monitor platform activity.
        </p>
      </div>

      {/* Stats Overview */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-10'>
        {[
          {
            label: "Active Users",
            value: `${allUsers.filter((u) => u.lastActive && new Date(u.lastActive).getTime() >= Date.now() - 24 * 60 * 60 * 1000).length} Active`,
            subtext: "(last 24h)",
            icon: <Activity size={20} />,
            color: "blue",
            onClick: () => {
              setActiveTab("users");
              setQuickFilter("active");
              setRoleFilter("all");
              setApprovalFilter("all");
              setSearchTerm("");
            }
          },
          {
            label: "New Signups / Growth",
            value: `+${allUsers.filter((u) => new Date(u.joinDate).getTime() >= Date.now() - 7 * 24 * 60 * 60 * 1000).length}`,
            subtext: "this week",
            icon: <Users size={20} />,
            color: "green",
            onClick: () => {
              setActiveTab("users");
              setQuickFilter("recent");
              setRoleFilter("all");
              setApprovalFilter("all");
              setSearchTerm("");
            }
          },
          {
            label: "Pending Actions",
            value: pendingAdminsCount,
            subtext: "items need review",
            icon: <AlertCircle size={20} />,
            color: "orange",
            onClick: () => {
              setActiveTab("users");
              setQuickFilter("all");
              setRoleFilter("admin");
              setApprovalFilter("pending");
              setSearchTerm("");
            }
          },
          {
            label: "Content Usage",
            value: `${globalResources.reduce((acc, r) => acc + (r.views || 0), 0)} views`,
            subtext: `Most used: ${[...globalResources].sort((a, b) => (b.views || 0) - (a.views || 0))[0]?.title?.substring(0, 15) || "None"}...`,
            icon: <BookOpen size={20} />,
            color: "purple",
            onClick: () => {
              setActiveTab("resources");
              setQuickFilter("popular");
              setTypeFilter("all");
              setSearchTerm("");
            }
          },
        ].map((stat, i) => (
          <div
            key={i}
            onClick={stat.onClick}
            className='bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm cursor-pointer hover:shadow-md hover:border-brand-300 dark:hover:border-moon-500 hover:-translate-y-1 transition-all duration-300 active:scale-[0.98]'
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 
              ${
                stat.color === "blue"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  : ""
              }
              ${
                stat.color === "green"
                  ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                  : ""
              }
              ${
                stat.color === "purple"
                  ? "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                  : ""
              }
              ${
                stat.color === "orange"
                  ? "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                  : ""
              }
            `}
            >
              {stat.icon}
            </div>
            <div className='text-slate-500 dark:text-slate-400 text-sm font-medium'>
              {stat.label}
            </div>
            <div className='text-2xl font-bold text-slate-900 dark:text-white mt-1 flex items-baseline gap-2'>
              {stat.value}
              {stat.subtext && (
                <span className='text-xs font-medium text-slate-400 dark:text-slate-500'>
                  {stat.subtext}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm'>
        <div className='flex border-b border-slate-200 dark:border-white/5 px-6 pt-2'>
          <button
            onClick={() => {
              setActiveTab("users");
              setSearchTerm("");
              setQuickFilter("all");
            }}
            className={`px-6 py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "users"
                ? "border-brand-600 text-brand-600 dark:border-moon-400 dark:text-moon-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Users size={18} />
            User Directory
            {pendingAdminsCount > 0 && (
              <span className='ml-2 px-2 py-0.5 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-[10px] rounded-full animate-bounce'>
                {pendingAdminsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab("resources");
              setSearchTerm("");
              setQuickFilter("all");
            }}
            className={`px-6 py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "resources"
                ? "border-brand-600 text-brand-600 dark:border-moon-400 dark:text-moon-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <BookOpen size={18} />
            Global Resources
          </button>
        </div>

        {/* Approval Banner */}
        {activeTab === "users" && pendingAdminsCount > 0 && (
          <div className='mx-6 mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl flex items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-500'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400'>
                <AlertCircle size={20} />
              </div>
              <div>
                <h4 className='text-sm font-bold text-slate-900 dark:text-white'>
                  Pending Admin Approvals
                </h4>
                <p className='text-xs text-slate-500 dark:text-slate-400'>
                  {pendingAdminsCount} {pendingAdminsCount === 1 ? "user is" : "users are"} waiting for administrative access.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setRoleFilter("admin");
                setApprovalFilter("pending");
              }}
              className='px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-amber-600/20'
            >
              Review Pending
            </button>
          </div>
        )}

        {/* Toolbar */}
        <div className='p-6 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row justify-between gap-4'>
          <div className='relative flex-1 max-w-md'>
            <Search
              className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'
              size={18}
            />
            <input
              type='text'
              placeholder={`Search ${
                activeTab === "users"
                  ? "users by name or email..."
                  : "resources by title..."
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-moon-400 transition-all text-sm'
            />
          </div>
          <div className='flex gap-3 relative'>
            <div className='relative'>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold transition-all ${
                  showFilters
                    ? "bg-slate-100 border-brand-500 text-brand-600 dark:bg-slate-800 dark:border-moon-400 dark:text-moon-400"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <Filter size={16} /> Filter
                {(activeTab === "users" ? roleFilter : typeFilter) !==
                  "all" && (
                  <span className='w-2 h-2 bg-brand-600 dark:bg-moon-400 rounded-full'></span>
                )}
              </button>

              {showFilters && (
                <div className='absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200'>
                  {activeTab === "users" ? (
                    <div className='p-2 divide-y divide-slate-100 dark:divide-white/5'>
                      <div className='pb-2'>
                        <p className='px-3 py-1 text-[10px] text-slate-400 uppercase font-bold transition-all'>
                          Role
                        </p>
                        {["all", "user", "admin"].map((role) => (
                          <button
                            key={role}
                            onClick={() => {
                              setRoleFilter(role);
                              setShowFilters(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                              roleFilter === role
                                ? "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                            }`}
                          >
                            {role === "all" ? "All Roles" : role}
                          </button>
                        ))}
                      </div>
                      <div className='pt-2'>
                        <p className='px-3 py-1 text-[10px] text-slate-400 uppercase font-bold transition-all'>
                          Status
                        </p>
                        {["all", "approved", "pending"].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setApprovalFilter(status);
                              setShowFilters(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                              approvalFilter === status
                                ? "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                            }`}
                          >
                            {status === "all" ? "All Status" : status}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className='p-2'>
                      {["all", "Article", "Video", "Course"].map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            setTypeFilter(type);
                            setShowFilters(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                            typeFilter === type
                              ? "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                          }`}
                        >
                          {type === "all" ? "All Types" : type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {activeTab === "resources" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className='flex items-center gap-2 px-4 py-2 bg-brand-600 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-bold hover:bg-brand-700 dark:hover:bg-slate-100 transition-all shadow-sm'
              >
                <Plus size={16} /> Add Resource
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Pill */}
        {quickFilter !== "all" && (
          <div className='px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/20'>
            <div className={`inline-flex items-center gap-3 px-1.5 py-1.5 rounded-full text-sm font-medium border shadow-sm animate-in fade-in zoom-in duration-300
              ${quickFilter === "active" ? "bg-blue-50/80 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300" : ""}
              ${quickFilter === "recent" ? "bg-green-50/80 dark:bg-green-900/20 border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-300" : ""}
              ${quickFilter === "popular" ? "bg-purple-50/80 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-300" : ""}
            `}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-inner
                ${quickFilter === "active" ? "bg-blue-200/50 dark:bg-blue-800/50 text-blue-600 dark:text-blue-400" : ""}
                ${quickFilter === "recent" ? "bg-green-200/50 dark:bg-green-800/50 text-green-600 dark:text-green-400" : ""}
                ${quickFilter === "popular" ? "bg-purple-200/50 dark:bg-purple-800/50 text-purple-600 dark:text-purple-400" : ""}
              `}>
                {quickFilter === "active" && <Activity size={14} />}
                {quickFilter === "recent" && <Users size={14} />}
                {quickFilter === "popular" && <BookOpen size={14} />}
              </div>
              
              <span className="pr-1 tracking-wide">
                Showing: <span className="font-extrabold ml-1">
                  {quickFilter === "active" && "Active Users (Last 24h)"}
                  {quickFilter === "recent" && "New Signups (Last 7 Days)"}
                  {quickFilter === "popular" && "Resources Sorted by Popularity"}
                </span>
              </span>

              <div className={`w-px h-4 opacity-30
                ${quickFilter === "active" ? "bg-blue-600 dark:bg-blue-400" : ""}
                ${quickFilter === "recent" ? "bg-green-600 dark:bg-green-400" : ""}
                ${quickFilter === "popular" ? "bg-purple-600 dark:bg-purple-400" : ""}
              `}></div>

              <button 
                onClick={() => setQuickFilter("all")}
                className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors mr-0.5
                  ${quickFilter === "active" ? "hover:bg-blue-200/80 dark:hover:bg-blue-800/80" : ""}
                  ${quickFilter === "recent" ? "hover:bg-green-200/80 dark:hover:bg-green-800/80" : ""}
                  ${quickFilter === "popular" ? "hover:bg-purple-200/80 dark:hover:bg-purple-800/80" : ""}
                `}
                title="Clear filter"
              >
                <Plus size={16} className='rotate-45 opacity-80 hover:opacity-100 transition-opacity' />
              </button>
            </div>
          </div>
        )}

        {/* Content Table */}
        <div className='overflow-x-auto'>
          {activeTab === "users" ? (
            <table className='w-full text-left'>
              <thead>
                <tr className='bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold'>
                  <th className='px-6 py-4'>User</th>
                  <th className='px-6 py-4 text-center'>Status</th>
                  <th className='px-6 py-4 text-center'>Skills</th>
                  <th className='px-6 py-4 text-center'>Saved Paths</th>
                  <th className='px-6 py-4 text-center'>Join Date</th>
                  <th className='px-6 py-4 text-center'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100 dark:divide-white/5'>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className={`hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors cursor-pointer ${
                      !user.isApproved && user.role === "admin"
                        ? "bg-amber-50/30 dark:bg-amber-900/5"
                        : ""
                    }`}
                  >
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-9 h-9 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 bg-brand-50 dark:bg-slate-800'>
                          <img 
                            src={`https://api.dicebear.com/9.x/dylan/svg?seed=${user.avatar_no || user.email || user.id}`} 
                            alt="Avatar" 
                            className='w-full h-full object-cover scale-110' 
                          />
                        </div>
                        <div>
                          <div className='text-sm font-bold text-slate-900 dark:text-white'>
                            {user.name}
                          </div>
                          <div className='text-xs text-slate-500 dark:text-slate-400'>
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex flex-col items-center justify-center gap-1.5'>
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm
                        ${
                          user.role === "admin"
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800"
                            : "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-800"
                        }`}
                        >
                          {user.role}
                        </span>
                        {!user.isApproved && (
                          <div className='flex items-center gap-1 text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-tighter bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded border border-amber-100 dark:border-amber-900/40'>
                            <AlertCircle size={10} className='animate-pulse' />
                            Pending
                          </div>
                        )}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm font-medium text-center text-slate-700 dark:text-slate-300'>
                        {user.skillsCount}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm text-center font-medium text-slate-700 dark:text-slate-300'>
                        {user.savedPathsCount}
                      </div>
                    </td>
                    <td className='px-6 py-4 text-sm text-center text-slate-500 dark:text-slate-400'>
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <div className='flex justify-center items-center gap-2'>
                        {!user.isApproved && (
                          <button
                            onClick={(e) => { e.stopPropagation(); approveUser(user.id); }}
                            className='flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm shadow-green-600/20 active:scale-95 whitespace-nowrap'
                            title='Approve User'
                          >
                            <CheckCircle2 size={14} /> Approve
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleAdminRole(user.id); }}
                          className='p-2 text-slate-400 hover:text-brand-600 dark:hover:text-moon-400 transition-colors'
                          title={user.role.toLowerCase() === 'admin' ? 'Remove Admin Role' : 'Make Admin'}
                        >
                          <Shield size={18} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteUserAction(user.id); }}
                          className='p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors'
                          title='Delete User'
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className='w-full text-left'>
              <thead>
                <tr className='bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold'>
                  <th className='px-6 py-4'>Resource Title</th>
                  <th className='px-6 py-4'>Type</th>
                  <th className='px-6 py-4'>Duration</th>
                  <th className='px-6 py-4 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100 dark:divide-white/5'>
                {filteredResources.map((res) => (
                  <tr
                    key={res.id}
                    className='hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors'
                  >
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div
                          className={`p-2 rounded-lg 
                            ${
                              res.type === "Article"
                                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                : ""
                            }
                            ${
                              res.type === "Video"
                                ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                : ""
                            }
                            ${
                              res.type === "Course"
                                ? "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                                : ""
                            }
                         `}
                        >
                          {res.type === "Article" && <BookOpen size={16} />}
                          {res.type === "Video" && <Activity size={16} />}
                          {res.type === "Course" && <ArrowUpRight size={16} />}
                        </div>
                        <div>
                          <div className='text-sm font-bold text-slate-900 dark:text-white'>
                            {res.title}
                          </div>
                          <a
                            href={res.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            onClick={() => recordResourceView(res.url)}
                            className='text-xs text-brand-600 dark:text-moon-400 flex items-center gap-1 hover:underline'
                          >
                            {res.url.substring(0, 30)}...{" "}
                            <ExternalLink size={10} />
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                        {res.type}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400'>
                      {res.duration}
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <button
                        onClick={() => res.id && deleteGlobalResource(res.id)}
                        className='p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors'
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Empty State */}
        {(activeTab === "users" ? filteredUsers : filteredResources).length ===
          0 && (
          <div className='p-12 text-center'>
            <div className='w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600'>
              <Search size={32} />
            </div>
            <h3 className='text-lg font-bold text-slate-900 dark:text-white'>
              No results found
            </h3>
            <p className='text-slate-500 dark:text-slate-400'>
              Adjust your search or filter to find what you're looking for.
            </p>
          </div>
        )}

        {/* Footer info */}
        <div className='p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-white/5 text-center text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold'>
          Platform Security: Advanced Access Control Active
        </div>
      </div>

      {/* User Details Modal */}
      {displayedUser && (
        <div className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300' onClick={() => setSelectedUserId(null)}>
          <div className='bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]' onClick={e => e.stopPropagation()}>
            
            {/* Header Area */}
            <div className='relative overflow-hidden bg-slate-900 border-b border-white/5 p-8 text-white'>
              {/* Subtle ambient lighting flares */}
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none mix-blend-screen"></div>
              <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none mix-blend-screen"></div>
              
              <button 
                onClick={() => setSelectedUserId(null)} 
                className='absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-md transition-colors text-white outline-none z-10 select-none'
              >
                <X size={20} />
              </button>
              
              <div className='flex items-center gap-6'>
                {/* Avatar Image */}
                <div className='relative shrink-0'>
                  <div className='w-24 h-24 bg-brand-100/30 backdrop-blur-md rounded-[1.25rem] flex items-center justify-center border border-white/30 shadow-inner overflow-hidden'>
                    <img 
                      src={`https://api.dicebear.com/9.x/dylan/svg?seed=${displayedUser.avatar_no || displayedUser.email || displayedUser.id}`} 
                      alt="Avatar" 
                      className='w-full h-full object-cover scale-110' 
                    />
                  </div>
                  {displayedUser.role === "admin" && (
                    <div className="absolute -bottom-2 -right-2 p-1.5 bg-indigo-500 text-white rounded-xl shadow-sm border border-indigo-400" title="Admin User">
                      <Shield size={16} className="fill-current" />
                    </div>
                  )}
                </div>
                
                <div>
                  <h2 className='text-3xl font-extrabold flex items-center gap-3 tracking-tight'>
                    {displayedUser.name}
                  </h2>
                  <div className='text-brand-100 flex items-center gap-2 mt-1 -ml-0.5 text-sm font-medium'>
                    <Mail size={16} className="opacity-80" /> {displayedUser.email}
                  </div>
                  
                  <div className='flex items-center gap-2 mt-3'>
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm ${
                      displayedUser.role === 'admin' 
                      ? "bg-indigo-500/20 border border-indigo-400/30 text-indigo-50"
                      : "bg-white/10 border border-white/20 text-white"
                    }`}>
                      {displayedUser.role}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm ${
                      displayedUser.isApproved
                      ? "bg-emerald-500/20 border border-emerald-400/30 text-emerald-50"
                      : "bg-amber-500/20 border border-amber-400/30 text-amber-50"
                    }`}>
                      {displayedUser.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className='p-8 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-slate-900'>
              
              {/* Top Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                 <div className='bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-brand-200 dark:hover:border-brand-500/30 transition-colors'>
                   <div className='text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5'><Calendar size={12} className="text-brand-500"/> Joined</div>
                   <div className='text-slate-900 dark:text-white font-extrabold text-lg'>{new Date(displayedUser.joinDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}</div>
                 </div>
                 
                 <div className='bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-colors'>
                   <div className='text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5'><Activity size={12} className="text-emerald-500"/> Last Active</div>
                   <div className='text-slate-900 dark:text-white font-extrabold text-lg'>{displayedUser.lastActive ? new Date(displayedUser.lastActive).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}</div>
                 </div>

                 <div className='bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-amber-200 dark:hover:border-amber-500/30 transition-colors'>
                   <div className='text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5'><Award size={12} className="text-amber-500"/> Skills</div>
                   <div className='text-slate-900 dark:text-white font-extrabold text-2xl leading-none mt-1'>{displayedUser.skillsCount}</div>
                 </div>

                 <div className='bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-purple-200 dark:hover:border-purple-500/30 transition-colors'>
                   <div className='text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5'><BookOpen size={12} className="text-purple-500"/> Paths</div>
                   <div className='text-slate-900 dark:text-white font-extrabold text-2xl leading-none mt-1'>{displayedUser.savedPathsCount}</div>
                 </div>
              </div>

              {/* Skills Area */}
              <div className='mb-8'>
                <h3 className='text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2'>
                  <Award size={14} className="text-amber-500"/> Confirmed Skills
                </h3>
                {displayedUser.skills && displayedUser.skills.length > 0 ? (
                  <div className='flex flex-wrap gap-2.5 p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-white/5 shadow-inner'>
                    {displayedUser.skills.map((skill, idx) => (
                      <span key={idx} className='px-3.5 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 rounded-[0.5rem] text-xs font-bold shadow-sm flex items-center gap-1.5 hover:-translate-y-0.5 transition-transform'>
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span> {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className='p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-white/5 border-dashed text-slate-400 dark:text-slate-500 text-sm italic font-medium text-center'>
                    This user hasn't added any skills to their profile yet.
                  </div>
                )}
              </div>

              {/* Admin Action Area */}
              <div>
                <h3 className='text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2'>
                  <Shield size={14} className="text-indigo-500"/> Access Controls
                </h3>
                
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <button 
                    onClick={() => approveUser(displayedUser.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                      displayedUser.isApproved 
                      ? 'bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-400 opacity-60 cursor-not-allowed'
                      : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 hover:shadow-md hover:bg-emerald-100 dark:hover:bg-emerald-900/30 cursor-pointer shadow-sm active:scale-[0.98]'
                    }`}
                    disabled={displayedUser.isApproved}
                  >
                    <CheckCircle2 size={24} className={displayedUser.isApproved ? "mb-2" : "mb-2 opacity-90"} />
                    <span className="font-extrabold text-sm">{displayedUser.isApproved ? 'Access Approved' : 'Approve User'}</span>
                  </button>

                  <button 
                    onClick={() => toggleAdminRole(displayedUser.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all shadow-sm cursor-pointer active:scale-[0.98] ${
                      displayedUser.role === 'admin'
                      ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                      : 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
                    }`}
                  >
                    <Shield size={24} className="mb-2 opacity-90" />
                    <span className="font-extrabold text-sm">{displayedUser.role === 'admin' ? 'Revoke Admin' : 'Grant Admin'}</span>
                  </button>

                  <button 
                    onClick={() => {
                      if(window.confirm(`CRITICAL: Are you absolutely sure you want to completely delete ${displayedUser.name}? This action cannot be undone.`)) {
                        deleteUserAction(displayedUser.id);
                      }
                    }}
                    className='flex flex-col items-center justify-center p-4 rounded-2xl border border-red-200 dark:border-red-900/40 bg-white dark:bg-slate-800/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hover:border-red-500/50 transition-all shadow-sm cursor-pointer active:scale-[0.98] group'
                  >
                    <Trash2 size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-extrabold text-sm tracking-wide">Delete Account</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Add Resource Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300'>
          <div className='bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300'>
            <div className='p-8'>
              <div className='flex justify-between items-center mb-6'>
                <h3 className='text-2xl font-bold text-slate-900 dark:text-white'>
                  Add New Resource
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className='text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors'
                >
                  <Plus className='rotate-45' size={24} />
                </button>
              </div>

              <form onSubmit={handleAddResource} className='space-y-5'>
                <div className='space-y-2'>
                  <label className='text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1'>
                    Title
                  </label>
                  <input
                    required
                    type='text'
                    placeholder='Resource Title'
                    value={newResource.title}
                    onChange={(e) =>
                      setNewResource({ ...newResource, title: e.target.value })
                    }
                    className='w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm'
                  />
                </div>

                <div className='space-y-2'>
                  <label className='text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1'>
                    URL
                  </label>
                  <input
                    required
                    type='url'
                    placeholder='https://example.com'
                    value={newResource.url}
                    onChange={(e) =>
                      setNewResource({ ...newResource, url: e.target.value })
                    }
                    className='w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm'
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <label className='text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1'>
                      Type
                    </label>
                    <select
                      value={newResource.type}
                      onChange={(e) =>
                        setNewResource({
                          ...newResource,
                          type: e.target.value as any,
                        })
                      }
                      className='w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm'
                    >
                      <option value='Article'>Article</option>
                      <option value='Video'>Video</option>
                      <option value='Course'>Course</option>
                    </select>
                  </div>

                  <div className='space-y-2'>
                    <label className='text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1'>
                      Duration
                    </label>
                    <input
                      required
                      type='text'
                      placeholder='e.g. 15 min'
                      value={newResource.duration}
                      onChange={(e) =>
                        setNewResource({
                          ...newResource,
                          duration: e.target.value,
                        })
                      }
                      className='w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm'
                    />
                  </div>
                </div>

                <button
                  type='submit'
                  className='w-full py-4 bg-brand-600 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:shadow-lg active:scale-95 transition-all mt-4'
                >
                  Save Resource
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
