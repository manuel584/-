import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Shield, Bell, HelpCircle, LogOut, ChevronRight, Lock, Moon, Globe } from 'lucide-react';
import { GlassCard, Button } from '../components/UI';

export const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f0f4ff] pb-24">
      <div className="bg-gradient-to-b from-blue-600 to-blue-500 pb-12 pt-12 px-4 rounded-b-[2rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg mb-4">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
              AD
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Admin User</h1>
          <p className="text-blue-100">admin@familybiz.com</p>
          <div className="mt-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs text-white font-medium border border-white/30">
             Super Admin
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-6 relative z-10">
        <GlassCard className="p-0 overflow-hidden">
          <SectionHeader title="Account Settings" />
          <div className="divide-y divide-gray-100">
            <MenuItem icon={User} label="Personal Information" />
            <MenuItem icon={Lock} label="Security & Privacy" value="Biometric Enabled" />
            <MenuItem icon={Globe} label="Language" value="English" />
          </div>
        </GlassCard>

        <GlassCard className="p-0 overflow-hidden">
          <SectionHeader title="Preferences" />
          <div className="divide-y divide-gray-100">
            <MenuItem icon={Bell} label="Notifications" />
            <MenuItem icon={Moon} label="Dark Mode" toggle />
          </div>
        </GlassCard>

        <GlassCard className="p-0 overflow-hidden">
          <SectionHeader title="Support" />
          <div className="divide-y divide-gray-100">
            <MenuItem icon={HelpCircle} label="Help Center" />
            <MenuItem icon={Shield} label="Terms & Privacy" />
          </div>
        </GlassCard>

        <Button variant="danger" className="w-full justify-center py-3">
          <LogOut size={18} /> Log Out
        </Button>
        
        <p className="text-center text-xs text-gray-400 py-4">
          Version 1.0.2 (Build 45)
        </p>
      </div>
    </div>
  );
};

const SectionHeader = ({ title }: { title: string }) => (
  <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
  </div>
);

const MenuItem = ({ icon: Icon, label, value, toggle }: any) => (
  <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
    <div className="flex items-center gap-3">
      <div className="text-gray-400">
        <Icon size={20} />
      </div>
      <span className="text-sm font-medium text-gray-800">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-xs text-gray-500">{value}</span>}
      {toggle ? (
         <div className="w-10 h-5 bg-gray-200 rounded-full relative">
           <div className="w-5 h-5 bg-white rounded-full shadow-sm absolute left-0 top-0 border border-gray-200"></div>
         </div>
      ) : (
        <ChevronRight size={16} className="text-gray-300" />
      )}
    </div>
  </button>
);
