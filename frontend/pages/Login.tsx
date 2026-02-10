import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  LogIn,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp(); // update this to store actual user + token
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password required");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // ❌ Handle errors FIRST
      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      // ✅ Only runs on successful login
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("user_name", data.user.name);
      localStorage.setItem("avatar_no", data.user.avatar_no);

      login(data.user.email);
      navigate("/profile");
    } catch (err) {
      setError("Server error. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetViews = () => {
    setIsForgotPassword(false);
    setResetSent(false);
    setIsLoading(false);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate reset link sending
    setTimeout(() => {
      setIsLoading(false);
      setResetSent(true);
    }, 1200);
  };

  if (isForgotPassword) {
    return (
      <div className='min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-300 animate-in fade-in zoom-in-95'>
          {!resetSent ? (
            <>
              <div className='text-center'>
                <button
                  onClick={resetViews}
                  className='mb-4 inline-flex items-center text-sm text-slate-500 hover:text-brand-600 transition-colors'
                >
                  <ArrowLeft size={16} className='mr-1' /> Back to login
                </button>
                <h2 className='text-3xl font-bold text-slate-900 dark:text-white tracking-tight'>
                  Reset password
                </h2>
                <p className='mt-2 text-sm text-slate-600 dark:text-slate-400'>
                  Enter your email and we'll send you a link to reset your
                  password.
                </p>
              </div>

              <form className='mt-8 space-y-6' onSubmit={handleForgotPassword}>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Mail className='h-5 w-5 text-slate-400' />
                  </div>
                  <input
                    type='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='appearance-none relative block w-full pl-10 px-3 py-3 border border-slate-300 dark:border-slate-700 placeholder-slate-500 text-slate-900 dark:text-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors'
                    placeholder='Email address'
                  />
                </div>

                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70 transition-all shadow-lg shadow-brand-500/30'
                >
                  {isLoading ? "Sending link..." : "Send reset link"}
                </button>
              </form>
            </>
          ) : (
            <div className='text-center py-4'>
              <div className='mx-auto h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-6'>
                <CheckCircle2 size={32} />
              </div>
              <h2 className='text-2xl font-bold text-slate-900 dark:text-white mb-2'>
                Check your email
              </h2>
              <p className='text-slate-600 dark:text-slate-400 mb-8'>
                We've sent a password reset link to{" "}
                <span className='font-semibold text-slate-900 dark:text-white'>
                  {email}
                </span>
                .
              </p>
              <button
                onClick={resetViews}
                className='w-full py-3 px-4 border border-slate-200 dark:border-slate-700 text-sm font-medium rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all'
              >
                Back to login
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors duration-300'>
        <div className='text-center'>
          {/* Login icon */}
          {/* <div className='mx-auto h-12 w-12 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4'>
            <LogIn size={24} />
          </div> */}
          <h2 className='text-3xl font-bold text-slate-900 dark:text-white tracking-tight'>
            Welcome back
          </h2>
          <p className='mt-2 text-sm text-slate-600 dark:text-slate-400'>
            Sign in to access your career paths
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className='bg-red-100 text-red-700 p-3 rounded-xl text-sm text-center'>
            {error}
          </div>
        )}

        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className='space-y-4'>
            <div>
              <label htmlFor='email-address' className='sr-only'>
                Email address
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10'>
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
                  className='appearance-none relative block w-full pl-12 px-3 py-3 border border-slate-300 dark:border-slate-700 placeholder-slate-500 text-slate-900 dark:text-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500'
                  placeholder='Email address'
                />
              </div>
            </div>

            <div>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10'>
                  <Lock className='h-5 w-5 text-slate-400' />
                </div>
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='appearance-none relative block w-full pl-12 pr-10 px-3 py-3 border border-slate-300 dark:border-slate-700 placeholder-slate-500 text-slate-900 dark:text-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500'
                  placeholder='Password'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 z-10'
                >
                  {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                </button>
              </div>
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <input
                id='remember-me'
                name='remember-me'
                type='checkbox'
                className='h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded'
              />
              <label
                htmlFor='remember-me'
                className='ml-2 block text-sm text-slate-900 dark:text-slate-300'
              >
                Remember me
              </label>
            </div>

            <div className='text-sm'>
              <button
                type='button'
                onClick={() => setIsForgotPassword(true)}
                className='font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300'
              >
                Forgot password?
              </button>
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={isLoading}
              className='group relative w-full flex justify-center py-3 px-4 text-sm font-medium rounded-xl text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-70 transition-all shadow-lg shadow-brand-500/30'
            >
              {isLoading ? "Loging in..." : "Log in"}
              {!isLoading && (
                <ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
              )}
            </button>
          </div>
        </form>

        <div className='text-center mt-4'>
          <p className='text-sm text-slate-600 dark:text-slate-400'>
            Don't have an account?{" "}
            <Link
              to='/signup'
              className='font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400'
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
