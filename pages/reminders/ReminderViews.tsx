
import React, { useState } from 'react';
import { GlassCard, Button, Input, Modal } from '../../components/UI';
import { Bell, Plus, Calendar, Clock, CheckCircle2, Circle } from 'lucide-react';
import { Reminder } from '../../types';
import { useReminders } from '../../context/ReminderContext';

export const ReminderSection = () => {
  const { reminders, addReminder, toggleReminder } = useReminders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({ priority: 'Medium' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!newReminder.title?.trim()) newErrors.title = "Task title is required";
    if (!newReminder.dueDate) newErrors.dueDate = "Due date is required";
    if (!newReminder.dueTime) newErrors.dueTime = "Time is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (validate()) {
      addReminder({
        title: newReminder.title!,
        dueDate: newReminder.dueDate!,
        dueTime: newReminder.dueTime!,
        priority: newReminder.priority as any || 'Medium',
        completed: false
      });
      
      setIsModalOpen(false);
      setNewReminder({ priority: 'Medium' });
      
      // Simulate Notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Reminder Set", { body: `Reminder set for ${newReminder.title}` });
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-gray-900">Reminders & Tasks</h2>
           <p className="text-sm text-gray-500">Stay on top of deadlines</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="text-xs">
          <Plus size={14} className="mr-1" /> Add Reminder
        </Button>
      </div>

      <div className="grid gap-3">
        {reminders.length === 0 && (
           <div className="text-center py-12 text-gray-400">
              <Bell size={48} className="mx-auto mb-3 opacity-20" />
              <p>No active reminders.</p>
           </div>
        )}

        {reminders.map(reminder => (
          <GlassCard key={reminder.id} className={`flex items-center gap-4 p-4 transition-all ${reminder.completed ? 'opacity-60 bg-gray-50/50' : 'bg-white/70'}`}>
            <button 
              onClick={() => toggleReminder(reminder.id)}
              className={`shrink-0 transition-colors ${reminder.completed ? 'text-green-500' : 'text-gray-300 hover:text-blue-500'}`}
            >
              {reminder.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
            </button>
            
            <div className="flex-1">
              <h3 className={`font-bold text-gray-900 ${reminder.completed ? 'line-through text-gray-500' : ''}`}>
                {reminder.title}
              </h3>
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {reminder.dueDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {reminder.dueTime}
                </span>
              </div>
            </div>

            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border
              ${reminder.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 
                reminder.priority === 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                'bg-blue-50 text-blue-600 border-blue-100'}`
            }>
              {reminder.priority}
            </div>
          </GlassCard>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Set New Reminder">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <Input 
              value={newReminder.title || ''}
              onChange={(e) => {
                setNewReminder({...newReminder, title: e.target.value});
                if(errors.title) setErrors({...errors, title: ''});
              }}
              placeholder="e.g. Renew Insurance" 
              autoFocus
              error={errors.title}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <Input 
                type="date"
                value={newReminder.dueDate || ''}
                onChange={(e) => {
                  setNewReminder({...newReminder, dueDate: e.target.value});
                  if(errors.dueDate) setErrors({...errors, dueDate: ''});
                }}
                error={errors.dueDate}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <Input 
                type="time"
                value={newReminder.dueTime || ''}
                onChange={(e) => {
                  setNewReminder({...newReminder, dueTime: e.target.value});
                  if(errors.dueTime) setErrors({...errors, dueTime: ''});
                }}
                error={errors.dueTime}
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
             <div className="flex gap-2">
                {['Low', 'Medium', 'High'].map(p => (
                   <button
                     key={p}
                     onClick={() => setNewReminder({...newReminder, priority: p as any})}
                     className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                       newReminder.priority === p 
                         ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
                         : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                     }`}
                   >
                     {p}
                   </button>
                ))}
             </div>
          </div>

          <div className="flex gap-3 pt-4">
             <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
             <Button className="flex-1" onClick={handleCreate}>Set Reminder</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
