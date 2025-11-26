
import React, { useState } from 'react';
import { GlassCard, Button, Input, Modal, BiometricGuard } from '../../components/UI';
import { MOCK_PORTALS } from '../../constants';
import { ExternalLink, Copy, Eye, EyeOff, Plus, Globe, Check, ArrowLeft, Trash2 } from 'lucide-react';
import { copyToClipboard } from '../../utils';

export const GovernmentSection = () => {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedPortal, setSelectedPortal] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPortal, setNewPortal] = useState({ name: '', url: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSelectPortal = (portal: any) => {
    setSelectedPortal(portal);
    setView('detail');
  };

  const handleBack = () => {
    setView('list');
    setSelectedPortal(null);
  };

  const handleCreate = () => {
    const newErrors: Record<string, string> = {};
    if (!newPortal.name.trim()) newErrors.name = "Portal name is required";
    if (!newPortal.url.trim()) newErrors.url = "URL is required";
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsModalOpen(false);
      setNewPortal({ name: '', url: '' });
    }
  };

  if (view === 'detail' && selectedPortal) {
    return <PortalDetail portal={selectedPortal} onBack={handleBack} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-gray-900">Government Portals</h2>
           <p className="text-sm text-gray-500">Manage access to government services</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="text-xs">
          <Plus size={14} className="mr-1" /> Add Portal
        </Button>
      </div>

      <BiometricGuard title="Government Portals">
        <div className="grid gap-4 md:grid-cols-2">
          {MOCK_PORTALS.map((portal) => (
            <GlassCard 
              key={portal.id} 
              onClick={() => handleSelectPortal(portal)}
              className="group hover:bg-white/80 cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-200 transition-colors">
                  <Globe size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{portal.name}</h3>
                  <div className="flex items-center text-xs text-blue-600 mt-0.5 hover:underline" onClick={(e) => { e.stopPropagation(); window.open(portal.url, '_blank'); }}>
                    {portal.linkText} <ExternalLink size={10} className="ml-1" />
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </BiometricGuard>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Government Portal">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Portal Name</label>
            <Input 
              value={newPortal.name}
              onChange={(e) => { setNewPortal({...newPortal, name: e.target.value}); setErrors({...errors, name: ''}); }}
              placeholder="e.g. Balady" 
              autoFocus 
              error={errors.name}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
            <Input 
              value={newPortal.url}
              onChange={(e) => { setNewPortal({...newPortal, url: e.target.value}); setErrors({...errors, url: ''}); }}
              placeholder="https://..." 
              error={errors.url}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleCreate}>Add Portal</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const PortalDetail = ({ portal, onBack }: { portal: any, onBack: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    copyToClipboard(text, () => setCopiedField(field), () => {
        if (copiedField === field) setCopiedField(null);
    });
    setTimeout(() => { if (copiedField === field) setCopiedField(null); }, 2000);
  };

  const CopyButton = ({ text, field }: { text: string, field: string }) => (
    <button 
      onClick={() => handleCopy(text, field)}
      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
    >
      {copiedField === field ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
    </button>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-white/50 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <Globe size={20} />
             </div>
             <h2 className="text-xl font-bold text-gray-900">{portal.name} Access</h2>
          </div>
        </div>
        <Button variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600">
           <Trash2 size={18} />
        </Button>
      </div>

      <GlassCard className="space-y-6">
         {/* Launch Button */}
         <Button className="w-full justify-center py-3 bg-slate-800 hover:bg-slate-900" onClick={() => window.open(portal.url, '_blank')}>
            Open {portal.name} Portal <ExternalLink size={16} className="ml-2" />
         </Button>

         <div className="h-px bg-gray-100" />

         <div className="space-y-4">
            <div className="space-y-1">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Username / ID</label>
               <div className="flex items-center gap-2 bg-white/50 p-3 rounded-xl border border-gray-100">
                  <span className="flex-1 font-mono text-gray-800">{portal.username}</span>
                  <CopyButton text={portal.username} field="username" />
               </div>
            </div>

            <div className="space-y-1">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
               <div className="flex items-center gap-2 bg-white/50 p-3 rounded-xl border border-gray-100">
                  <div className="flex-1 font-mono text-gray-800 tracking-widest">
                     {showPassword ? portal.password : '••••••••••••'}
                  </div>
                  <button onClick={() => setShowPassword(!showPassword)} className="p-2 text-gray-400 hover:text-gray-600">
                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <CopyButton text={portal.password} field="password" />
               </div>
            </div>
         </div>
      </GlassCard>

      <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex gap-3">
         <div className="mt-0.5">ℹ️</div>
         <p className="text-xs text-blue-800 leading-relaxed">
           Use the copy buttons to quickly paste credentials into the government portal. The clipboard will automatically clear after 60 seconds for your security.
         </p>
      </div>
    </div>
  );
};