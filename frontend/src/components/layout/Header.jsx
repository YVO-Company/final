import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Features', to: '/features' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Help', to: '/help' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = useMemo(() => {
    if (!user?.fullName && !user?.firstName) return 'U';
    const name = user.fullName || `${user.firstName} ${user.lastName || ''}`;
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((item) => item[0]?.toUpperCase())
      .join('');
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const styles = {
    loader: {
      width: "30px",
      height: "30px",
      borderRadius: "10%",
    },
  };

  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 z-50">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.svg"
            alt="YVO"
            style={styles.loader}
          />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">YVO</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-brand transition">
              {link.label}
            </Link>
          ))}
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full pl-1.5 pr-4 py-1.5 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => navigate(user.role === 'employee' ? '/employee-dashboard' : '/dashboard')}>
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                {initials}
              </div>
              <div className="flex flex-col">
                <div className="text-sm font-bold text-slate-800 leading-tight">{user.fullName || user.firstName}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{user.role || 'User'}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/company-login"
              className="border border-indigo-600 text-indigo-600 px-5 py-2 rounded-full text-sm font-bold hover:bg-indigo-50 transition-all"
            >
              Company Login
            </Link>

            <Link
              to="/employee-login"
              className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
            >
              Employee Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
