
import React, { useState, useContext, createContext } from 'react';
import { GlassCard, Button, Input, Modal, StatusBadge, BiometricGuard } from '../../components/UI';
import { MOCK_BANK_CATEGORIES, MOCK_ACCOUNTS } from '../../constants';
import { ChevronRight, Plus, Copy, Eye, EyeOff, Check, Trash2, ArrowLeft, ShieldCheck, CreditCard } from 'lucide-react';
import { copyToClipboard, cn } from '../../utils';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { BankCategory, BankAccount } from '../../types';

// --- Banking Context for Local State Management ---

interface BankingContextType {
  categories: BankCategory[];
  accounts: BankAccount[];
  addCategory: (name: string) => void;
  addAccount: (account: Omit<BankAccount, 'id'>) => void;
  deleteAccount: (id: string) => void;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<BankCategory[]>(MOCK_BANK_CATEGORIES);
  const [accounts, setAccounts] = useState<BankAccount[]>(MOCK_ACCOUNTS);

  const addCategory = (name: string) => {
    const newCat: BankCategory = {
      id: `c${Date.now()}`,
      entityId: '1', // Mock entity ID
      name,
      accountCount: 0
    };
    setCategories([...categories, newCat]);
  };

  const addAccount = (data: Omit<BankAccount, 'id'>) => {
    const newAcc: BankAccount = {
      ...data,
      id: `a${Date.now()}`
    };
    setAccounts([...accounts, newAcc]);
    
    // Update the account count for the category
    setCategories(prev => prev.map(c => 
      c.id === data.categoryId 
        ? { ...c, accountCount: c.accountCount + 1 }
        : c
    ));
  };
  
  const deleteAccount = (id: string) => {
      const acc = accounts.find(a => a.id === id);
      setAccounts(prev => prev.filter(a => a.id !== id));
      
      if (acc) {
          setCategories(prev => prev.map(c => 
            c.id === acc.categoryId 
                ? { ...c, accountCount: Math.max(0, c.accountCount - 1) } 
                : c
          ));
      }
  };

  return (
    <BankingContext.Provider value={{ categories, accounts, addCategory, addAccount, deleteAccount }}>
      {children}
    </BankingContext.Provider>
  );
};

const useBanking = () => {
  const context = useContext(BankingContext);
  if (!context) throw new Error("useBanking must be used within BankingProvider");
  return context;
};

// --- Components ---

// 1. Banking Categories List
export const BankingCategories = ({ onSelectCategory }: { onSelectCategory: (id: string) => void }) => {
  const { categories, addCategory } = useBanking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!newCategoryName.trim()) {
      setError('Category name is required');
      return;
    }
    addCategory(newCategoryName);
    setIsModalOpen(false);
    setNewCategoryName('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Banking</h2>
        <Button onClick={() => setIsModalOpen(true)} className="text-xs">
          <Plus size={14} className="mr-1" /> Add Category
        </Button>
      </div>

      <BiometricGuard title="Banking Information">
        <div className="grid gap-4">
          {categories.length === 0 ? (
            <div className="text-center py-12 bg-white/40 rounded-2xl border border-dashed border-gray-300">
              <CreditCard size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No bank categories yet.</p>
            </div>
          ) : (
            categories.map((cat) => (
              <GlassCard key={cat.id} onClick={() => onSelectCategory(cat.id)} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <div className="font-bold text-lg">{cat.name.charAt(0)}</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                    <p className="text-xs text-gray-500">{cat.accountCount} Accounts</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 group-hover:text-indigo-600 transition-colors" size={20} />
              </GlassCard>
            ))
          )}
        </div>
      </BiometricGuard>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Bank Category">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
            <Input 
              value={newCategoryName} 
              onChange={(e) => {
                setNewCategoryName(e.target.value);
                setError('');
              }}
              error={error}
              placeholder="e.g. Chase Business Accounts" 
              autoFocus
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleCreate}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Add Bank Account Form Component
const AddBankAccountForm = ({ categoryId, onCancel, onSuccess }: { categoryId: string, onCancel: () => void, onSuccess: () => void }) => {
  const { addAccount } = useBanking();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data: any) => {
    addAccount({
      ...data,
      categoryId,
      type: 'Checking', // Default
    });
    onSuccess();
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4">
       <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <button onClick={onCancel} className="p-2 hover:bg-white/50 rounded-full"><ArrowLeft size={20} /></button>
             <h2 className="text-xl font-bold text-gray-900">New Bank Account</h2>
          </div>
       </div>

       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <GlassCard className="space-y-4">
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Basic Information</h3>
             <div>
               <label className="text-sm font-medium text-gray-700">Bank Name</label>
               <Input 
                 {...register("bankName", { required: "Bank name is required" })} 
                 placeholder="e.g. Chase Bank" 
                 className="mt-1"
                 error={errors.bankName?.message as string}
               />
             </div>
             <div>
               <label className="text-sm font-medium text-gray-700">Account Number</label>
               <Input 
                 {...register("accountNumber", { required: "Account number is required" })} 
                 placeholder="1234..." 
                 className="mt-1"
                 error={errors.accountNumber?.message as string}
               />
             </div>
             <div>
               <label className="text-sm font-medium text-gray-700">Routing Number</label>
               <Input 
                 {...register("routingNumber", { required: "Routing number is required" })} 
                 placeholder="987..." 
                 className="mt-1"
                 error={errors.routingNumber?.message as string}
               />
             </div>
          </GlassCard>

          <GlassCard className="space-y-4 border-l-4 border-l-blue-500">
             <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-600" />
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Credentials (Optional)</h3>
             </div>
             <div>
               <label className="text-sm font-medium text-gray-700">Username</label>
               <Input {...register("username")} placeholder="Online Banking ID" className="mt-1" />
             </div>
             <div>
               <label className="text-sm font-medium text-gray-700">Password</label>
               <Input type="password" {...register("password")} placeholder="••••••••" className="mt-1" />
             </div>
          </GlassCard>

          <div className="flex gap-3">
             <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>Cancel</Button>
             <Button type="submit" className="flex-1">Save Account</Button>
          </div>
       </form>
    </div>
  );
};

// 2. Accounts List
export const AccountList = ({ categoryId, onBack, onSelectAccount }: { categoryId: string, onBack: () => void, onSelectAccount: (acc: any) => void }) => {
  const { categories, accounts } = useBanking();
  const categoryAccounts = accounts.filter(a => a.categoryId === categoryId);
  const categoryName = categories.find(c => c.id === categoryId)?.name || 'Unknown Category';
  const [isAdding, setIsAdding] = useState(false);

  if (isAdding) {
    return <AddBankAccountForm categoryId={categoryId} onCancel={() => setIsAdding(false)} onSuccess={() => setIsAdding(false)} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-white/50 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{categoryName}</h2>
          <p className="text-xs text-gray-500">Managing {categoryAccounts.length} accounts</p>
        </div>
      </div>

      <div className="grid gap-4">
        <GlassCard onClick={() => setIsAdding(true)} className="border-dashed border-2 border-indigo-200 bg-indigo-50/30 flex flex-col items-center justify-center py-8 gap-2 hover:bg-indigo-50/50 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Plus size={24} />
          </div>
          <span className="font-medium text-indigo-700">Add Bank Account</span>
        </GlassCard>

        {categoryAccounts.map(acc => (
          <GlassCard key={acc.id} onClick={() => onSelectAccount(acc)} className="relative group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
                  {acc.bankName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{acc.bankName}</h3>
                  <p className="text-xs text-gray-500">{acc.type}</p>
                </div>
              </div>
              <ChevronRight className="text-gray-400" size={18} />
            </div>
            <div className="flex items-center justify-between text-sm bg-gray-50/80 p-3 rounded-lg border border-gray-100">
              <span className="text-gray-500 font-mono">•••• {acc.accountNumber.slice(-4)}</span>
              <span className="text-xs bg-white border px-2 py-0.5 rounded text-gray-600">Active</span>
            </div>
          </GlassCard>
        ))}
        
        {categoryAccounts.length === 0 && (
           <div className="text-center p-4 text-gray-400 text-sm">No accounts found in this category.</div>
        )}
      </div>
    </div>
  );
};

// 3. Account Detail
export const AccountDetail = ({ account, onBack }: { account: any, onBack: () => void }) => {
  const { deleteAccount } = useBanking();
  const [showPassword, setShowPassword] = useState(false);
  const [showAccountNum, setShowAccountNum] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    copyToClipboard(text, () => {
      setCopiedField(field);
    }, () => {
      if (copiedField === field) setCopiedField(null);
    });
    
    // Fallback UI clear for specific field
    setTimeout(() => {
      if (copiedField === field) setCopiedField(null);
    }, 2000);
  };
  
  const handleDelete = () => {
      if(window.confirm("Are you sure you want to delete this account?")) {
          deleteAccount(account.id);
          onBack();
      }
  };

  const CopyButton = ({ text, field }: { text: string, field: string }) => (
    <button 
      onClick={(e) => { e.stopPropagation(); handleCopy(text, field); }}
      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
      title="Copy to clipboard"
    >
      {copiedField === field ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
    </button>
  );

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-white/50 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-gray-900">{account.bankName} Details</h2>
        </div>
        <Button variant="danger" className="h-8 text-xs px-3" onClick={handleDelete}>
          <Trash2 size={14} className="mr-1" /> Delete
        </Button>
      </div>

      {/* Account Information Card */}
      <GlassCard className="space-y-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Account Info</h3>
        
        <div className="space-y-1">
          <label className="text-xs text-gray-500">Account Number</label>
          <div className="flex items-center justify-between bg-white/50 p-3 rounded-xl border border-gray-100">
            <span className="font-mono text-gray-800">
              {showAccountNum ? account.accountNumber : `••••••••${account.accountNumber.slice(-4)}`}
            </span>
            <div className="flex gap-1">
              <button onClick={() => setShowAccountNum(!showAccountNum)} className="p-1.5 text-gray-400 hover:text-gray-600">
                {showAccountNum ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <CopyButton text={account.accountNumber} field="accNum" />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-500">Routing Number</label>
          <div className="flex items-center justify-between bg-white/50 p-3 rounded-xl border border-gray-100">
            <span className="font-mono text-gray-800">{account.routingNumber}</span>
            <CopyButton text={account.routingNumber} field="routNum" />
          </div>
        </div>
      </GlassCard>

      {/* Security/Credentials Card */}
      <GlassCard className="space-y-4 border-l-4 border-l-blue-500">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={18} className="text-blue-600" />
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Credentials</h3>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-500">Username</label>
          <div className="flex items-center justify-between bg-white/50 p-3 rounded-xl border border-gray-100">
            <span className="text-gray-800">{account.username}</span>
            <CopyButton text={account.username || ''} field="username" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-500">Password</label>
          <div className="flex items-center justify-between bg-white/50 p-3 rounded-xl border border-gray-100">
            <span className="font-mono text-gray-800 tracking-widest">
              {showPassword ? account.password : '••••••••••••'}
            </span>
            <div className="flex gap-1">
              <button onClick={() => setShowPassword(!showPassword)} className="p-1.5 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <CopyButton text={account.password || ''} field="password" />
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50/50 p-3 rounded-lg text-xs text-blue-700 flex gap-2">
           <div className="mt-0.5">ℹ️</div>
           <p>Clipboard auto-clears after 60 seconds for security.</p>
        </div>
      </GlassCard>
    </div>
  );
};
