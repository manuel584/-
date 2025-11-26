
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, StatusBadge, Button, Modal, Input } from '../components/UI';
import { Plus, Search, Building2, ChevronRight, AlertTriangle, Bell, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Entity } from '../types';
import { cn } from '../utils';
import { useEntities } from '../context/EntityContext';

const BUSINESS_TYPES = [
  "General Business",
  "Food Service",
  "Real Estate",
  "Retail",
  "Technology",
  "Construction",
  "Consulting",
  "Logistics"
];

export const Dashboard = () => {
  const navigate = useNavigate();
  const { entities, addEntity } = useEntities();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEntity, setNewEntity] = useState({ name: '', type: 'General Business' });
  const [error, setError] = useState('');

  const handleCreateEntity = () => {
    if (!newEntity.name.trim()) {
      setError("Entity name is required");
      return;
    }
    
    const entity: Entity = {
      id: Date.now().toString(),
      name: newEntity.name,
      type: newEntity.type,
      status: 'active',
      itemsCount: 0
    };
    
    addEntity(entity);
    setIsModalOpen(false);
    setNewEntity({ name: '', type: 'General Business' });
    setError('');
    
    // Optional: Navigate immediately to new entity
    // navigate(`/entity/${entity.id}`);
  };

  const chartData = [
    { name: 'Jan', expense: 4000 },
    { name: 'Feb', expense: 3000 },
    { name: 'Mar', expense: 2000 },
    { name: 'Apr', expense: 2780 },
    { name: 'May', expense: 1890 },
    { name: 'Jun', expense: 2390 },
  ];

  const handleBarClick = (data: any) => {
    // In a real app, this would navigate to a filtered expense report
    console.log(`Navigating to expenses for ${data.name}`);
    // navigate(`/expenses?month=${data.name}`); 
    alert(`Viewing detailed expenses for ${data.name}: $${data.expense}`);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Business Manager</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, Admin</p>
        </div>
        <div className="flex gap-3 items-center">
          <button 
            onClick={() => navigate('/search')}
            className="p-2.5 bg-white/50 hover:bg-white rounded-full transition-colors shadow-sm text-gray-600 hidden md:flex"
            title="Search"
          >
            <Search size={20} />
          </button>
          
          <button 
            onClick={() => navigate('/notifications')}
            className="p-2.5 bg-white/50 hover:bg-white rounded-full transition-colors shadow-sm text-gray-600 relative"
            title="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          
          <button 
            onClick={() => navigate('/profile')}
            className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full shadow-lg flex items-center justify-center text-white font-bold transition-transform hover:scale-105 active:scale-95"
            title="Profile"
          >
            AD
          </button>
        </div>
      </header>

      {/* Analytics Widget */}
      <GlassCard className="bg-gradient-to-br from-indigo-50/80 to-blue-50/80 border-indigo-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
              <span className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600"><TrendingUp size={16} /></span>
              Business Health
            </h2>
            <p className="text-sm text-indigo-700/70">Monthly expense overview</p>
          </div>
        </div>
        <div className="h-48 w-full">
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                cursor={{fill: 'rgba(99, 102, 241, 0.1)'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Total Expenses']}
                labelStyle={{ color: '#6b7280', marginBottom: '0.25rem' }}
              />
              <Bar 
                dataKey="expense" 
                fill="#6366f1" 
                radius={[6, 6, 0, 0]} 
                barSize={32}
                onClick={handleBarClick}
                cursor="pointer"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} className="hover:opacity-80 transition-opacity" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Entities List */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-bold text-gray-800">Your Entities</h2>
          <Button className="text-xs px-3 py-1.5 h-8" onClick={() => setIsModalOpen(true)}>
            <Plus size={14} className="mr-1" /> Add Entity
          </Button>
        </div>

        <div className="grid gap-4">
          {entities.map((entity) => {
            const needsAttention = entity.itemsCount > 0 || !!entity.nextAction || entity.status !== 'active';
            
            return (
              <GlassCard 
                key={entity.id} 
                onClick={() => navigate(`/entity/${entity.id}`)}
                className={cn(
                  "group relative overflow-hidden transition-all duration-300 hover:shadow-md",
                  needsAttention ? "border-l-4 border-l-orange-400 bg-orange-50/20" : "border-l-4 border-l-transparent"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shadow-inner transition-colors",
                      needsAttention ? "bg-orange-100 text-orange-600" : "bg-blue-50 text-blue-600"
                    )}>
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{entity.name}</h3>
                      <p className="text-xs text-gray-500">{entity.type}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "w-3 h-3 rounded-full shadow-sm ring-2 ring-white",
                    entity.status === 'active' ? 'bg-green-500' : 
                    entity.status === 'warning' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500 animate-pulse'
                  )} />
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100/50 pt-4">
                  <div className="flex items-center gap-2">
                    {entity.nextAction ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100">
                        <AlertTriangle size={12} />
                        {entity.nextAction}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                        All clear
                      </span>
                    )}
                    
                    {entity.itemsCount > 0 && (
                      <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                        {entity.itemsCount} Pending Items
                      </span>
                    )}
                  </div>
                  <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Create Entity Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Entity">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entity Name</label>
            <Input 
              placeholder="e.g. Al-Falah Trading Co." 
              value={newEntity.name}
              onChange={(e) => {
                setNewEntity({...newEntity, name: e.target.value});
                if (error) setError('');
              }}
              error={error}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
            <select 
              className="w-full px-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
              value={newEntity.type}
              onChange={(e) => setNewEntity({...newEntity, type: e.target.value})}
            >
              {BUSINESS_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700 flex gap-2">
            <span className="text-lg">💡</span>
            <p>Creating an entity will automatically set up default folders for Banking, GOSI, and Legal Documents.</p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleCreateEntity}>Create Entity</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
