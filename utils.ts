import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Clipboard utility with timer
export const copyToClipboard = (text: string, onCopy?: () => void, onClear?: () => void) => {
  if (!navigator.clipboard) return;
  
  navigator.clipboard.writeText(text).then(() => {
    if (onCopy) onCopy();
    
    // Auto-clear logic simulated by UI feedback timeout
    // In a real secure app, we might clear the variable from memory, 
    // but we can't clear the system clipboard easily without user interaction in web.
    // We will simulate the "secure" feel by resetting the UI state.
    setTimeout(() => {
      if (onClear) onClear();
    }, 60000); // 60 seconds
  });
};

export const formatCurrency = (amount: number, currency = 'SAR') => {
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};
