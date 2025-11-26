
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { EntityView } from './pages/EntityView';
import { Search } from './pages/Search';
import { Notifications } from './pages/Notifications';
import { Profile } from './pages/Profile';
import { Auth } from './pages/Auth';
import { Sparkles, Home, Search as SearchIcon, Bell, User } from 'lucide-react';
import { cn } from './utils';
import { EntityProvider } from './context/EntityContext';

const AISearchWidget = () => {
  const location = useLocation();
  if (location.pathname === '/login') return null;

  return (
    <div className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-40 transition-all duration-300">
      <button className="group flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-4 py-3 rounded-full shadow-lg shadow-violet-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300">
        <Sparkles size={20} className="animate-pulse" />
        <span className="font-medium pr-1 hidden sm:inline">Ask AI Assistant</span>
        <span className="font-medium pr-1 inline sm:hidden">Ask AI</span>
      </button>
    </div>
  );
};

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  if (currentPath === '/login') return null;

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'search', icon: SearchIcon, label: 'Search', path: '/search' },
    { id: 'notifications', icon: Bell, label: 'Alerts', path: '/notifications' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[calc(4rem+env(safe-area-inset-bottom))] bg-white/80 backdrop-blur-xl border-t border-white/50 flex items-center justify-around px-2 z-50 md:hidden shadow-[0_-5px_15px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]">
       {navItems.map((item) => {
         const isActive = item.path === '/' ? currentPath === '/' : currentPath.startsWith(item.path);
         return (
           <button
             key={item.id}
             onClick={() => navigate(item.path)}
             className={cn(
               "flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-200 active:scale-95",
               isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
             )}
           >
             <div className={cn("p-1.5 rounded-xl transition-all", isActive && "bg-blue-50")}>
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
             </div>
             <span className="text-[10px] font-medium">{item.label}</span>
           </button>
         )
       })}
    </div>
  );
};

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  // In a real app, check for token here
  // const isAuthenticated = !!localStorage.getItem('token');
  // if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App = () => {
  return (
    <EntityProvider>
      <HashRouter>
        <div className="min-h-screen text-gray-800 antialiased selection:bg-blue-100 selection:text-blue-900 pb-20 md:pb-0">
          <Routes>
            <Route path="/login" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/entity/:id" element={<ProtectedRoute><EntityView /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          
          <AISearchWidget />
          <BottomNav />
        </div>
      </HashRouter>
    </EntityProvider>
  );
};

export default App;
