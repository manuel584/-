
import React, { useState } from 'react';
import { GlassCard, Button, StatusBadge, Modal, Input } from '../../components/UI';
import { MOCK_VENDORS, MOCK_VENDOR_INVOICES } from '../../constants';
import { formatCurrency } from '../../utils';
import { Plus, ArrowLeft, Phone, Mail, Clock, FileText, Briefcase, ChevronRight } from 'lucide-react';

export const VendorSection = () => {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Create Vendor State
  const [newVendor, setNewVendor] = useState({ name: '', category: '', contact: '', phone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSelectVendor = (vendor: any) => {
    setSelectedVendor(vendor);
    setView('detail');
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!newVendor.name.trim()) newErrors.name = "Vendor name is required";
    if (!newVendor.category.trim()) newErrors.category = "Category is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (validate()) {
      setIsModalOpen(false);
      setNewVendor({ name: '', category: '', contact: '', phone: '' });
    }
  };

  if (view === 'detail' && selectedVendor) {
    return <VendorDetail vendor={selectedVendor} onBack={() => { setView('list'); setSelectedVendor(null); }} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-gray-900">Vendors</h2>
           <p className="text-sm text-gray-500">Track suppliers and payments</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="text-xs">
          <Plus size={14} className="mr-1" /> Add Vendor
        </Button>
      </div>

      <div className="grid gap-4">
         {MOCK_VENDORS.map(vendor => (
           <GlassCard 
             key={vendor.id} 
             onClick={() => handleSelectVendor(vendor)}
             className="cursor-pointer hover:bg-white/80 transition-colors group"
           >
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold text-lg">
                   {vendor.name.charAt(0)}
                 </div>
                 <div>
                   <h3 className="font-bold text-gray-900">{vendor.name}</h3>
                   <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{vendor.category}</span>
                   </div>
                 </div>
               </div>
               <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Outstanding</p>
                  <p className={`font-bold ${vendor.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(vendor.balance)}
                  </p>
               </div>
             </div>
           </GlassCard>
         ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Vendor">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-700">Vendor Name</label>
            <Input 
              value={newVendor.name}
              onChange={(e) => { setNewVendor({...newVendor, name: e.target.value}); if(errors.name) setErrors({...errors, name: ''}); }}
              placeholder="Company Name" 
              autoFocus 
              error={errors.name}
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Category</label>
            <Input 
              value={newVendor.category}
              onChange={(e) => { setNewVendor({...newVendor, category: e.target.value}); if(errors.category) setErrors({...errors, category: ''}); }}
              placeholder="e.g. Supplies, Maintenance" 
              error={errors.category}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="text-sm text-gray-700">Contact Person</label>
               <Input 
                 value={newVendor.contact}
                 onChange={(e) => setNewVendor({...newVendor, contact: e.target.value})}
                 placeholder="Name" 
               />
             </div>
             <div>
               <label className="text-sm text-gray-700">Phone</label>
               <Input 
                 value={newVendor.phone}
                 onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
                 placeholder="05..." 
               />
             </div>
          </div>
          <div className="flex gap-3 pt-4">
             <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
             <Button className="flex-1" onClick={handleCreate}>Add Vendor</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const VendorDetail = ({ vendor, onBack }: { vendor: any, onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'invoices'>('invoices');
  const invoices = MOCK_VENDOR_INVOICES.filter(inv => inv.vendorId === vendor.id);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
       {/* Header */}
       <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-white/50 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{vendor.name}</h2>
            <p className="text-xs text-gray-500">{vendor.category}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-lg text-sm font-bold ${vendor.balance > 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
           {formatCurrency(vendor.balance)} Due
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100/50 rounded-xl w-full">
         <button onClick={() => setActiveTab('invoices')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'invoices' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Invoices</button>
         <button onClick={() => setActiveTab('info')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'info' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Contact Info</button>
      </div>

      {/* Content */}
      {activeTab === 'invoices' ? (
        <div className="space-y-3">
           {invoices.length === 0 ? (
             <div className="text-center py-10 text-gray-400">No invoices found</div>
           ) : (
             invoices.map(inv => (
               <GlassCard key={inv.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                     <div className={`p-2 rounded-lg ${inv.status === 'Overdue' ? 'bg-red-100 text-red-600' : inv.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        <FileText size={20} />
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-900">{inv.refNumber}</h4>
                        <p className="text-xs text-gray-500">Due {inv.dueDate}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="font-bold text-gray-900">{formatCurrency(inv.amount)}</p>
                     <StatusBadge status={inv.status === 'Paid' ? 'success' : inv.status === 'Overdue' ? 'error' : 'warning'} text={inv.status} />
                  </div>
               </GlassCard>
             ))
           )}
           <Button className="w-full mt-4" variant="secondary"><Plus size={16} className="mr-2"/> Record Invoice</Button>
        </div>
      ) : (
        <GlassCard className="space-y-4">
           <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
              <Briefcase className="text-gray-400" size={20} />
              <div>
                 <p className="text-xs text-gray-500">Contact Person</p>
                 <p className="font-medium">{vendor.contactName}</p>
              </div>
           </div>
           <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
              <Phone className="text-gray-400" size={20} />
              <div>
                 <p className="text-xs text-gray-500">Phone</p>
                 <p className="font-medium">{vendor.phone}</p>
              </div>
           </div>
           <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
              <Mail className="text-gray-400" size={20} />
              <div>
                 <p className="text-xs text-gray-500">Email</p>
                 <p className="font-medium">{vendor.email}</p>
              </div>
           </div>
        </GlassCard>
      )}
    </div>
  );
};