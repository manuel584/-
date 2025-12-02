
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Landmark, Receipt, FileText, Menu, X, Shield, Wallet, Briefcase, Folder, Plus, Bell, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { BankingCategories, AccountList, AccountDetail, BankingProvider } from './banking/BankingViews';
import { GosiDashboard } from './gosi/GosiViews';
import { InsuranceDashboard } from './insurance/InsuranceViews';
import { GovernmentSection } from './government/GovernmentViews';
import { VendorSection } from './vendors/VendorViews';
import { DocumentSection } from './documents/DocumentViews';
import { ReminderSection } from './reminders/ReminderViews';
import { Button, GlassCard, StatusBadge, Input, Modal } from '../components/UI';
import { cn } from '../utils';
import { useEntities } from '../context/EntityContext';

// Sub-navigation items
const SECTIONS = [
  { id: 'banking', label: 'Banking', icon: Wallet, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { id: 'government', label: 'Government', icon: Landmark, color: 'text-slate-600', bg: 'bg-slate-50' },
  { id: 'gosi', label: 'GOSI & Compliance', icon: Receipt, color: 'text-orange-600', bg: 'bg-orange-50' },
  { id: 'insurance', label: 'Medical Insurance', icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'vendors', label: 'Vendors', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'documents', label: 'Documents', icon: Folder, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'reminders', label: 'Reminders', icon: Bell, color: 'text-pink-600', bg: 'bg-pink-50' },
];

export const EntityView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { entities, updateEntity, deleteEntity } = useEntities();
  const entity = entities.find(e => e.id === id);
  
  const [activeSection, setActiveSection] = useState('banking');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Banking Navigation State (Local router for banking flow)
  const [bankingView, setBankingView] = useState<'categories' | 'list' | 'detail'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
  
  // Entity Management State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editError, setEditError] = useState('');

  // Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!entity) return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#f0f4ff] p-4 text-center">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Entity Not Found</h2>
      <p className="text-gray-500 mb-6">The entity you are looking for does not exist or has been deleted.</p>
      <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
    </div>
  );

  // Handlers for Banking Flow
  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setBankingView('list');
  };

  const handleSelectAccount = (acc: any) => {
    if (acc) {
      setSelectedAccount(acc);
      setBankingView('detail');
    } else {
      // Create logic would go here
    }
  };

  const handleEditEntity = () => {
    if (!editName.trim()) {
      setEditError("Entity name cannot be empty");
      return;
    }
    
    updateEntity(entity.id, { name: editName });
    setIsEditModalOpen(false);
  };

  const handleDeleteEntity = () => {
    deleteEntity(entity.id);
    setIsDeleteModalOpen(false);
    navigate('/');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'banking':
        if (bankingView === 'detail') return <AccountDetail account={selectedAccount} onBack={() => setBankingView('list')} />;
        if (bankingView === 'list') return <AccountList categoryId={selectedCategory!} onBack={() => setBankingView('categories')} onSelectAccount={handleSelectAccount} />;
        return <BankingCategories onSelectCategory={handleSelectCategory} />;
      case 'gosi':
        return <GosiDashboard />;
      case 'insurance':
        return <InsuranceDashboard />;
      case 'government':
        return <GovernmentSection />;
      case 'vendors':
        return <VendorSection />;
      case 'documents':
        return <DocumentSection />;
      case 'reminders':
        return <ReminderSection />;
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="flex h-screen bg-[#f0f4ff] overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-white/80 backdrop-blur-xl border-r border-white/50 shadow-2xl transition-transform duration-300 md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
             <div className="font-bold text-xl text-gray-800">Sections</div>
             <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-gray-500"><X size={24}/></button>
          </div>
          
          <nav className="space-y-2 flex-1">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setSidebarOpen(false);
                    // Reset subsection states
                    setBankingView('categories');
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
                    isActive 
                      ? "bg-white shadow-md text-gray-900 border border-gray-100" 
                      : "text-gray-500 hover:bg-white/50 hover:text-gray-900"
                  )}
                >
                  <div className={cn("p-2 rounded-lg", section.bg, section.color)}>
                    <Icon size={18} />
                  </div>
                  {section.label}
                </button>
              );
            })}
          </nav>
          
          <div className="pt-6 border-t border-gray-100">
             <GlassCard className="bg-gradient-to-br from-blue-600 to-indigo-700 border-none text-white p-4">
                <p className="text-xs font-medium opacity-80 mb-1">Entity ID</p>
                <p className="font-mono text-sm tracking-wider opacity-90">#{entity.id.padStart(6, '0')}</p>
             </GlassCard>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-16 px-4 md:px-8 border-b border-white/50 bg-white/30 backdrop-blur-md flex items-center justify-between shrink-0 relative z-20">
          <div className="flex items-center gap-3">
             <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 hover:bg-white/50 rounded-lg">
                <Menu size={20} className="text-gray-700" />
             </button>
             <button onClick={() => navigate('/')} className="hidden md:flex p-2 hover:bg-white/50 rounded-lg text-gray-500 hover:text-gray-900">
                <ArrowLeft size={20} />
             </button>
             <h1 className="text-lg font-bold text-gray-900 truncate max-w-[150px] md:max-w-md">{entity.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex gap-2">
               <Button variant="ghost" className="h-8 text-xs px-3" onClick={() => { setEditName(entity.name); setIsEditModalOpen(true); }}>Edit Entity</Button>
               <Button variant="ghost" className="h-8 text-xs px-3 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setIsDeleteModalOpen(true)}>Delete</Button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden relative">
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 hover:bg-white/50 rounded-lg text-gray-600"
                >
                  <MoreVertical size={20} />
                </button>
                
                {mobileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMobileMenuOpen(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-100 z-20 py-1 animate-in fade-in zoom-in-95 duration-200">
                      <button 
                        onClick={() => { setEditName(entity.name); setIsEditModalOpen(true); setMobileMenuOpen(false); }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Edit2 size={16} /> Edit Entity
                      </button>
                      <button 
                        onClick={() => { setIsDeleteModalOpen(true); setMobileMenuOpen(false); }}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 size={16} /> Delete Entity
                      </button>
                    </div>
                  </>
                )}
            </div>

            <StatusBadge status={entity.status as any} />
          </div>
        </header>

        {/* Content Scrollable Area */}
        <BankingProvider>
          <div className="flex-1 overflow-y-auto p-4 md:p-8 glass-scroll pb-24 md:pb-8">
             <div className="max-w-3xl mx-auto">
               {renderContent()}
             </div>
          </div>
        </BankingProvider>
      </main>

      {/* Edit Entity Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Entity">
         <div className="space-y-4">
            <div>
               <label className="text-sm font-medium text-gray-700">Entity Name</label>
               <Input 
                 value={editName} 
                 onChange={(e) => { setEditName(e.target.value); setEditError(''); }}
                 error={editError}
                 autoFocus 
               />
            </div>
            <div className="flex gap-3 pt-4">
               <Button variant="secondary" className="flex-1" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
               <Button className="flex-1" onClick={handleEditEntity}>Save Changes</Button>
            </div>
         </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Entity?">
         <div className="space-y-4">
            <p className="text-sm text-gray-600">
               Are you sure you want to delete <strong>{entity.name}</strong>? This action cannot be undone and all associated data (invoices, documents, employees) will be permanently removed.
            </p>
            <div className="flex gap-3 pt-4">
               <Button variant="secondary" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
               <Button variant="danger" className="flex-1" onClick={handleDeleteEntity}>Delete Entity</Button>
            </div>
         </div>
      </Modal>
    </div>
  );
};
