
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ArrowLeft, FileText, Building2, Users, Receipt, X } from 'lucide-react';
import { Input, GlassCard } from '../components/UI';
import { useEntities } from '../context/EntityContext';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'entities', label: 'Entities' },
  { id: 'documents', label: 'Documents' },
  { id: 'invoices', label: 'Invoices' },
];

export const Search = () => {
  const navigate = useNavigate();
  const { entities } = useEntities();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Search logic using context entities
  const filteredEntities = query 
    ? entities.filter(e => e.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="min-h-screen bg-[#f0f4ff] pb-24">
      {/* Header with Search Input */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-white/50 px-4 py-3 safe-top">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..." 
              className="pl-10 py-2 bg-gray-100 border-transparent focus:bg-white"
              autoFocus
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        
        {/* Filter Chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
          {FILTERS.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter.id 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </header>

      <div className="p-4 space-y-6">
        {query ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {filteredEntities.length > 0 ? 'Results' : 'No results found'}
            </p>
            
            {filteredEntities.map(entity => (
              <GlassCard 
                key={entity.id} 
                onClick={() => navigate(`/entity/${entity.id}`)}
                className="flex items-center gap-3 p-3 active:scale-[0.98] transition-transform"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{entity.name}</h3>
                  <p className="text-xs text-gray-500">{entity.type}</p>
                </div>
              </GlassCard>
            ))}
            
            {/* Mock results for other types if query matches generic terms */}
            {query.toLowerCase().includes('invoice') && (
              <GlassCard className="flex items-center gap-3 p-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Receipt size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">GOSI Invoice #2023-10</h3>
                  <p className="text-xs text-gray-500">October 2023 • Overdue</p>
                </div>
              </GlassCard>
            )}
          </div>
        ) : (
          /* Recent Searches / Empty State */
          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-bold text-gray-900 mb-3">Recent Searches</h3>
              <div className="flex flex-wrap gap-2">
                {['Main Restaurant', 'GOSI Invoice', 'Ahmed Al-Sayed'].map((item, i) => (
                  <button 
                    key={i}
                    onClick={() => setQuery(item)}
                    className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg text-sm text-gray-600 border border-gray-100"
                  >
                    <ClockIcon size={14} className="text-gray-400" />
                    {item}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-gray-900 mb-3">Browse by Category</h3>
              <div className="grid grid-cols-2 gap-3">
                <CategoryCard icon={Building2} label="Entities" color="text-blue-600" bg="bg-blue-50" />
                <CategoryCard icon={Users} label="Employees" color="text-purple-600" bg="bg-purple-50" />
                <CategoryCard icon={Receipt} label="Invoices" color="text-orange-600" bg="bg-orange-50" />
                <CategoryCard icon={FileText} label="Documents" color="text-emerald-600" bg="bg-emerald-50" />
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

const ClockIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CategoryCard = ({ icon: Icon, label, color, bg }: any) => (
  <GlassCard className="flex flex-col items-center justify-center py-6 gap-2 hover:bg-white/80 active:scale-[0.98]">
    <div className={`p-3 rounded-full ${bg} ${color}`}>
      <Icon size={24} />
    </div>
    <span className="font-medium text-gray-700 text-sm">{label}</span>
  </GlassCard>
);
