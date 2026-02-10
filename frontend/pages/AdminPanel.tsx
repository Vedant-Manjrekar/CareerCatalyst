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
} from "lucide-react";
import { Navigate } from "react-router-dom";

export const AdminPanel: React.FC = () => {
  const {
    isAdmin,
    allUsers,
    toggleAdminRole,
    globalResources,
    deleteGlobalResource,
  } = useApp();
  const [activeTab, setActiveTab] = useState<"users" | "resources">("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState([]);
  const [careerData, setCareerData] = useState([]);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:8000/users");
    const data = await res.json();

    setUserData(data.data);
    console.log(data.data);

    const roles = data.data.map((user) => console.log(user.role));
  };

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
    fetchUsers();
    getAllSavedCareers();
  }, []);

  const deleteUser = async (id: string) => {
    const res = await fetch(`http://localhost:8000/user/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data.message);
      return;
    }

    console.log("User deleted");
    fetchUsers();
  };

  // Protect the route
  if (!isAdmin) {
    return <Navigate to='/' replace />;
  }

  const filteredUsers = userData.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResources = globalResources.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            label: "Total Users",
            value: userData.length,
            icon: <Users size={20} />,
            color: "blue",
          },
          {
            label: "Saved Paths",
            value: careerData.length,
            icon: <ArrowUpRight size={20} />,
            color: "green",
          },
          {
            label: "Skill Density",
            value: `${(
              userData.reduce((acc, u) => acc + u.skills.length, 0) /
              userData.length
            ).toFixed(1)}/user`,
            icon: <Activity size={20} />,
            color: "purple",
          },
          {
            label: "Resources",
            value: globalResources.length,
            icon: <BookOpen size={20} />,
            color: "orange",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className='bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm'
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
            <div className='text-2xl font-bold text-slate-900 dark:text-white mt-1'>
              {stat.value}
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
            }}
            className={`px-6 py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "users"
                ? "border-brand-600 text-brand-600 dark:border-moon-400 dark:text-moon-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Users size={18} />
            User Directory
          </button>
          <button
            onClick={() => {
              setActiveTab("resources");
              setSearchTerm("");
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
          <div className='flex gap-3'>
            <button className='flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'>
              <Filter size={16} /> Filter
            </button>
            {activeTab === "resources" && (
              <button className='flex items-center gap-2 px-4 py-2 bg-brand-600 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-bold hover:bg-brand-700 dark:hover:bg-slate-100 transition-all shadow-sm'>
                <Plus size={16} /> Add Resource
              </button>
            )}
          </div>
        </div>

        {/* Content Table */}
        <div className='overflow-x-auto'>
          {activeTab === "users" ? (
            <table className='w-full text-left'>
              <thead>
                <tr className='bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold'>
                  <th className='px-6 py-4'>User</th>
                  <th className='px-6 py-4'>Status</th>
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
                    className='hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors'
                  >
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold border border-slate-200 dark:border-slate-700'>
                          {user.name.charAt(0)}
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
                    <td className='px-6 py-4`'>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border 
                        ${
                          user.role === "admin"
                            ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
                            : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm font-medium text-center text-slate-700 dark:text-slate-300'>
                        {user.skills.length}
                      </div>
                    </td>
                    <td className='px-9 py-4'>
                      <div className='text-sm text-center font-medium text-slate-700 dark:text-slate-300'>
                        {
                          careerData.filter((elem) => elem.userId === user._id)
                            .length
                        }
                      </div>
                    </td>
                    <td className='px-6 py-4 text-sm text-center text-slate-500 dark:text-slate-400'>
                      {new Date(user.joining_date).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <div className='flex justify-center gap-2'>
                        {/* <button
                          onClick={() => toggleAdminRole(user.id)}
                          className='p-2 text-slate-400 hover:text-brand-600 dark:hover:text-moon-300 transition-colors'
                          title='Toggle Admin Role'
                        >
                          <Shield size={18} />
                        </button> */}
                        <button
                          onClick={() => deleteUser(user._id)}
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
    </div>
  );
};
