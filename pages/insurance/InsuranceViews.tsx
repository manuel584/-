
import React, { useState } from 'react';
import { GlassCard, Button, StatusBadge, Modal } from '../../components/UI';
import { MOCK_POLICIES } from '../../constants';
import { Shield, Clock, Users, FileText, Check, Plus } from 'lucide-react';

export const InsuranceDashboard = () => {
  const activePolicy = MOCK_POLICIES.find(p => p.status === 'active' || p.status === 'expiring');
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

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
             <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20" onClick={() => setIsMembersModalOpen(true)}>Manage Members</Button>
             <Button variant="secondary" className="flex-1" onClick={() => setIsPolicyModalOpen(true)}>View Policy</Button>
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

       {/* Policy Modal */}
       <Modal isOpen={isPolicyModalOpen} onClose={() => setIsPolicyModalOpen(false)} title="Policy Details">
          {activePolicy && (
             <div className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <h4 className="font-bold text-emerald-900">Coverage Summary</h4>
                    <p className="text-sm text-emerald-700 mt-1">Class A - Premium Network</p>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Provider</span>
                        <span className="font-medium">{activePolicy.provider}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Policy Number</span>
                        <span className="font-medium">{activePolicy.policyNumber}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Annual Premium</span>
                        <span className="font-medium">{activePolicy.premium.toLocaleString()} SAR</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-gray-500">Start Date</span>
                        <span className="font-medium">2023-01-01</span>
                    </div>
                </div>
                <Button className="w-full" onClick={() => setIsPolicyModalOpen(false)}>Close</Button>
             </div>
          )}
       </Modal>

       {/* Members Modal */}
       <Modal isOpen={isMembersModalOpen} onClose={() => setIsMembersModalOpen(false)} title="Insured Members">
           <div className="space-y-4">
               <div className="flex justify-between items-center mb-2">
                   <p className="text-sm text-gray-500">{activePolicy?.membersCount} Active Members</p>
                   <Button className="text-xs h-8"><Plus size={14} className="mr-1"/> Add Member</Button>
               </div>
               <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                   {['Ahmed Al-Sayed', 'Sarah Johnson', 'Mohammed Ali', 'John Doe', 'Jane Smith'].map((name, i) => (
                       <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                           <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-emerald-600 border border-emerald-100">
                                   {name.substring(0,2).toUpperCase()}
                               </div>
                               <span className="text-sm font-medium">{name}</span>
                           </div>
                           <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
                       </div>
                   ))}
               </div>
               <Button className="w-full" variant="secondary" onClick={() => setIsMembersModalOpen(false)}>Close</Button>
           </div>
       </Modal>
    </div>
  );
};
