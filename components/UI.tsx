
import React, { useState, useEffect } from 'react';
import { cn } from '../utils';
import { Lock, Fingerprint, ScanFace, AlertCircle } from 'lucide-react';

export const GlassCard: React.FC<{
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className, onClick }) => (
  <div 
    onClick={onClick}
    className={cn(
      "bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg rounded-2xl p-4 transition-all duration-200",
      onClick && "cursor-pointer hover:bg-white/80 active:scale-[0.98]",
      className
    )}
  >
    {children}
  </div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }> = ({ children, variant = 'primary', className, ...props }) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20",
    secondary: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100/50 hover:text-gray-900"
  };

  return (
    <button 
      className={cn(
        "px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => (
  <div className="w-full">
    <input
      ref={ref}
      className={cn(
        "w-full px-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-400 text-gray-800",
        error && "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50/30",
        className
      )}
      {...props}
    />
    {error && (
      <div className="flex items-center gap-1 mt-1.5 text-xs text-red-500 font-medium animate-in slide-in-from-top-1">
        <AlertCircle size={12} />
        <span>{error}</span>
      </div>
    )}
  </div>
));

export const StatusBadge: React.FC<{ status: 'success' | 'warning' | 'error' | 'neutral' | 'active', text?: string }> = ({ status, text }) => {
  const styles: Record<string, string> = {
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    error: "bg-red-100 text-red-700 border-red-200",
    neutral: "bg-gray-100 text-gray-700 border-gray-200",
    active: "bg-green-100 text-green-700 border-green-200"
  };

  return (
    <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 w-fit", styles[status] || styles.neutral)}>
      <span className={cn("w-2 h-2 rounded-full", (status === 'success' || status === 'active') ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : status === 'error' ? 'bg-red-500' : 'bg-gray-500')} />
      {text || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export const Modal: React.FC<{ isOpen: boolean, onClose: () => void, title: string, children?: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export const BiometricGuard: React.FC<{ children: React.ReactNode, title?: string }> = ({ children, title = "Secure Content" }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsUnlocked(true);
      setIsVerifying(false);
    }, 800);
  };

  if (isUnlocked) return <>{children}</>;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/40 backdrop-blur-xl border border-white/50 h-64 flex flex-col items-center justify-center text-center p-6 shadow-sm">
       <div className="bg-white/50 p-4 rounded-full mb-4 shadow-sm">
          {isVerifying ? <ScanFace className="animate-pulse text-blue-600" size={32} /> : <Lock className="text-gray-400" size={32} />}
       </div>
       <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
       <p className="text-sm text-gray-500 mb-6 max-w-xs">Identity verification is required to view this sensitive information.</p>
       
       <Button onClick={handleVerify} disabled={isVerifying} className="min-w-[140px]">
          {isVerifying ? "Verifying..." : "View Content"}
       </Button>
    </div>
  );
};