import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, UserPlus, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const randomSeed = Math.random().toString(36).substring(7);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: email.toLowerCase().includes("admin") ? "admin" : "user",
          joining_date: new Date(),
          skills: [],
          skillCount: 0,
          savedPathCount: 0,
          avatar_no: randomSeed,
        }),
      });

      console.log(res);
      const data = await res.json();

      if (data?.success) {
        console.log(data?.user);
        signup(data?.user.name, data?.user.email);
        navigate("/profile");
        localStorage.setItem("avatar_no", randomSeed);
        localStorage.setItem("user_name", name);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(`Server error, ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors duration-300'>
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4'>
            <UserPlus size={24} />
          </div>
          <h2 className='text-3xl font-bold text-slate-900 dark:text-white tracking-tight'>
            Create an account
          </h2>
          <p className='mt-2 text-sm text-slate-600 dark:text-slate-400'>
            Join thousands of professionals growing their careers
          </p>
        </div>

        <form className='mt-8 space-y-5' onSubmit={handleSubmit}>
          <div className='space-y-4'>
            <div>
              <label htmlFor='name' className='sr-only'>
                Full Name
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <User className='h-5 w-5 text-slate-400' />
                </div>
                <input
                  id='name'
                  name='name'
                  type='text'
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='appearance-none relative block w-full pl-10 px-3 py-3 border border-slate-300 dark:border-slate-700 placeholder-slate-500 text-slate-900 dark:text-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors'
                  placeholder='Full Name'
                />
              </div>
            </div>

            <div>
              <label htmlFor='email-address' className='sr-only'>
                Email address
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='h-5 w-5 text-slate-400' />
                </div>
                <input
                  id='email-address'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='appearance-none relative block w-full pl-10 px-3 py-3 border border-slate-300 dark:border-slate-700 placeholder-slate-500 text-slate-900 dark:text-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors'
                  placeholder='Email address'
                />
              </div>
            </div>

            <div>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-slate-400' />
                </div>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='new-password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='appearance-none relative block w-full pl-10 px-3 py-3 border border-slate-300 dark:border-slate-700 placeholder-slate-500 text-slate-900 dark:text-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors'
                  placeholder='Password'
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={isLoading}
              className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-all shadow-lg shadow-indigo-500/30'
            >
              {isLoading ? "Creating account..." : "Create Account"}
              {!isLoading && (
                <ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
              )}
            </button>
          </div>
        </form>

        <div className='text-center mt-4'>
          <p className='text-sm text-slate-600 dark:text-slate-400'>
            Already have an account?{" "}
            <Link
              to='/login'
              className='font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
