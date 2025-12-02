
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Reminder } from '../types';

interface ReminderContextType {
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
}

const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export const ReminderProvider = ({ children }: { children?: ReactNode }) => {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', title: 'Renew Trade License', dueDate: '2024-03-20', dueTime: '09:00', priority: 'High', completed: false },
    { id: '2', title: 'Submit VAT Return', dueDate: '2024-03-25', dueTime: '14:00', priority: 'High', completed: false },
    { id: '3', title: 'Review Employee Contracts', dueDate: '2024-04-01', dueTime: '10:00', priority: 'Medium', completed: true },
  ]);

  const addReminder = (data: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      ...data,
      id: Date.now().toString(),
      completed: false
    };
    setReminders(prev => [newReminder, ...prev]);
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  return (
    <ReminderContext.Provider value={{ reminders, addReminder, toggleReminder, deleteReminder }}>
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminders = () => {
  const context = useContext(ReminderContext);
  if (context === undefined) {
    throw new Error('useReminders must be used within a ReminderProvider');
  }
  return context;
};
