import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  MessageSquare,
  User,
  Menu,
  X,
  Sun,
  Moon,
  LogIn,
  LogOut,
  Bookmark,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "../context/AppContext";

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { theme, toggleTheme, isAuthenticated, isAdmin, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/", icon: <LayoutDashboard size={18} /> },
    { name: "Finder", path: "/finder", icon: <Compass size={18} /> },
    { name: "Assistant", path: "/chat", icon: <MessageSquare size={18} /> },
  ];

  if (isAuthenticated) {
    navItems.push({
      name: "Saved",
      path: "/saved-careers",
      icon: <Bookmark size={18} />,
    });
    navItems.push({
      name: "Profile",
      path: "/profile",
      icon: <User size={18} />,
    });

    // Add Admin link if user is admin
    if (isAdmin) {
      navItems.push({
        name: "Admin",
        path: "/admin",
        icon: <ShieldCheck size={18} />,
      });
    }
  }

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <div className='min-h-screen flex flex-col font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300'>
      {/* Navigation */}
      <nav className='sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 transition-colors duration-300'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16 items-center'>
            {/* Logo */}
            <Link to='/' className='flex items-center gap-2 group'>
              <div className='bg-brand-600 dark:bg-white/10 dark:border dark:border-white/10 text-white dark:text-moon-300 p-1.5 rounded-lg transition-colors'>
                <Compass size={24} strokeWidth={2.5} />
              </div>
              <span className='font-bold text-xl tracking-tight text-slate-900 dark:text-slate-200 group-hover:dark:text-white transition-colors'>
                CareerCatalyst
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className='hidden md:flex items-center space-x-6'>
              <div className='flex space-x-2'>
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      isActive(item.path)
                        ? "text-brand-600 bg-brand-50 dark:bg-white/10 dark:text-moon-300 dark:border dark:border-white/10 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-moon-300 hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className='h-6 w-px bg-slate-200 dark:bg-white/10 mx-2'></div>

              <div className='flex items-center gap-2'>
                <button
                  onClick={toggleTheme}
                  className='p-2 rounded-full text-slate-500 hover:text-brand-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-moon-300 dark:hover:bg-white/5 transition-colors'
                  aria-label='Toggle theme'
                >
                  {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                {!isAuthenticated ? (
                  <>
                    <Link
                      to='/login'
                      className='text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white px-3 py-2 transition-colors'
                    >
                      Log in
                    </Link>
                    <Link
                      to='/signup'
                      className='text-sm font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 px-4 py-2 rounded-lg transition-all shadow-sm'
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className='p-2 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-all'
                    title='Logout'
                  >
                    <LogOut size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className='flex items-center gap-4 md:hidden'>
              <button
                onClick={toggleTheme}
                className='p-2 rounded-full text-slate-500 hover:text-brand-600 dark:text-slate-400'
              >
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className='text-slate-600 dark:text-slate-300 hover:text-brand-600 p-2'
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className='md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5'>
            <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium ${
                    isActive(item.path)
                      ? "text-brand-600 bg-brand-50 dark:bg-white/10 dark:text-moon-300"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}

              <div className='border-t border-slate-100 dark:border-white/5 my-2 pt-2'>
                {!isAuthenticated ? (
                  <div className='flex flex-col gap-2 p-2'>
                    <Link
                      to='/login'
                      onClick={() => setIsMenuOpen(false)}
                      className='flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium'
                    >
                      <LogIn size={18} /> Log in
                    </Link>
                    <Link
                      to='/signup'
                      onClick={() => setIsMenuOpen(false)}
                      className='flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-brand-600 text-white font-medium'
                    >
                      Sign up
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleLogout}
                    className='flex items-center gap-3 w-full px-3 py-3 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className='flex-grow pt-4 pb-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>{children}</div>
      </main>

      {/* Footer */}
      <footer className='bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/5 py-8 transition-colors duration-300'>
        <div className='max-w-7xl mx-auto px-4 text-center text-slate-500 dark:text-slate-500 text-sm'>
          <p>
            © {new Date().getFullYear()} Career Catalyst. Powered by Gemini.
          </p>
        </div>
      </footer>
    </div>
  );
};
