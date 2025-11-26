import React from 'react';
import { GlassCard, Button, StatusBadge } from '../../components/UI';
import { MOCK_POLICIES } from '../../constants';
import { Shield, Clock, Users, FileText } from 'lucide-react';

export const InsuranceDashboard = () => {
  const activePolicy = MOCK_POLICIES.find(p => p.status === 'active' || p.status === 'expiring');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
       {/* Active Policy Card */}
       {activePolicy ? (
         <GlassCard className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
           <div className="flex justify-between items-start mb-6">
             <div className="flex items-center gap-3">
               <div className="bg-white p-2 rounded-xl shadow-sm">
                 <Shield className="text-emerald-600" size={24} />
               </div>
               <div>
                 <h2 className="font-bold text-gray-900 text-lg">{activePolicy.provider}</h2>
                 <p className="text-xs text-gray-500">{activePolicy.policyNumber}</p>
               </div>
             </div>
             <StatusBadge status={activePolicy.status === 'expiring' ? 'warning' : 'success'} />
           </div>

           <div className="grid grid-cols-2 gap-4 mb-6">
             <div className="bg-white/60 p-3 rounded-xl border border-emerald-100/50">
               <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold mb-1">
                 <Clock size={12} /> Expires
               </div>
               <div className="text-gray-900 font-bold">{activePolicy.expirationDate}</div>
             </div>
             <div className="bg-white/60 p-3 rounded-xl border border-emerald-100/50">
               <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold mb-1">
                 <Users size={12} /> Insured
               </div>
               <div className="text-gray-900 font-bold">{activePolicy.membersCount} Members</div>
             </div>
           </div>

           <div className="flex gap-2">
             <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20">Manage Members</Button>
             <Button variant="secondary" className="flex-1">View Policy</Button>
           </div>
         </GlassCard>
       ) : (
         <GlassCard className="text-center py-10">
           <Shield className="mx-auto text-gray-300 mb-2" size={48} />
           <p className="text-gray-500">No active insurance policy found.</p>
           <Button className="mt-4">Add Policy</Button>
         </GlassCard>
       )}

       {/* Policy History */}
       <div>
         <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Recent Documents</h3>
         <div className="space-y-3">
           {['Policy Certificate 2024.pdf', 'Member List Oct.xlsx', 'Invoice #9922.pdf'].map((doc, i) => (
             <GlassCard key={i} className="py-3 px-4 flex items-center justify-between hover:bg-white/80 cursor-pointer">
               <div className="flex items-center gap-3">
                 <FileText size={18} className="text-gray-400" />
                 <span className="text-sm font-medium text-gray-700">{doc}</span>
               </div>
               <span className="text-xs text-gray-400">Download</span>
             </GlassCard>
           ))}
         </div>
       </div>
    </div>
  );
};
