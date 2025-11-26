
export interface Entity {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'warning' | 'error';
  itemsCount: number;
  nextAction?: string;
}

export interface BankAccount {
  id: string;
  categoryId: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  type: string;
  balance?: number;
  currency?: string;
  username?: string;
  password?: string; // Mocked
  email?: string;
}

export interface BankCategory {
  id: string;
  entityId: string;
  name: string;
  accountCount: number;
}

export interface GosiInvoice {
  id: string;
  month: string;
  year: number;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
  issueDate: string;
}

export interface PayrollRecord {
  id: string;
  month: string;
  amount: number;
  status: 'Paid' | 'Processing';
  date: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department?: string;
  basicSalary: number;
  fullSalary: number;
  gosiStatus: 'correct' | 'error' | 'review';
  joinDate?: string;
  status?: 'Active' | 'On Leave' | 'Terminated';
  documents?: DocumentFile[];
  payrollHistory?: PayrollRecord[];
}

export interface InsurancePolicy {
  id: string;
  provider: string;
  policyNumber: string;
  expirationDate: string;
  status: 'active' | 'expiring' | 'expired';
  membersCount: number;
  premium: number;
}

export interface GovernmentPortal {
  id: string;
  name: string;
  url: string;
  username: string;
  password: string;
  linkText: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  contactName: string;
  phone: string;
  email: string;
  balance: number;
  status: 'Active' | 'Inactive';
}

export interface VendorInvoice {
  id: string;
  vendorId: string;
  refNumber: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
}

export interface DocumentFile {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'sheet';
  size: string;
  date: string;
  expiryDate?: string;
  folder: string;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  dueTime: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  entityId?: string;
}