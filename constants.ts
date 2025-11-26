import { Entity, BankCategory, BankAccount, GosiInvoice, Employee, InsurancePolicy, GovernmentPortal, Vendor, VendorInvoice, DocumentFile } from './types';

export const MOCK_ENTITIES: Entity[] = [
  { id: '1', name: 'Main Restaurant LLC', type: 'Food Service', status: 'active', itemsCount: 3, nextAction: 'Review GOSI' },
  { id: '2', name: 'Property Holdings Ltd', type: 'Real Estate', status: 'warning', itemsCount: 5, nextAction: 'Renew Insurance' },
  { id: '3', name: 'Tech Ventures', type: 'Technology', status: 'active', itemsCount: 0 },
];

export const MOCK_BANK_CATEGORIES: BankCategory[] = [
  { id: 'c1', entityId: '1', name: 'Chase Business Accounts', accountCount: 2 },
  { id: 'c2', entityId: '1', name: 'Local Operating Accounts', accountCount: 1 },
];

export const MOCK_ACCOUNTS: BankAccount[] = [
  { 
    id: 'a1', 
    categoryId: 'c1', 
    bankName: 'Chase', 
    accountNumber: '1234567890', 
    routingNumber: '987654321', 
    type: 'Checking', 
    username: 'admin_rest', 
    password: 'securePassword123' 
  },
  { 
    id: 'a2', 
    categoryId: 'c1', 
    bankName: 'Chase', 
    accountNumber: '0987654321', 
    routingNumber: '987654321', 
    type: 'Savings',
    username: 'admin_rest_sav',
    password: 'securePassword456'
  }
];

export const MOCK_GOSI_INVOICES: GosiInvoice[] = [
  { id: 'g1', month: 'October', year: 2023, amount: 4500, status: 'Overdue', dueDate: '2023-11-15', issueDate: '2023-11-01' },
  { id: 'g2', month: 'November', year: 2023, amount: 4500, status: 'Paid', dueDate: '2023-12-15', issueDate: '2023-12-01' },
  { id: 'g3', month: 'December', year: 2023, amount: 4650, status: 'Pending', dueDate: '2024-01-15', issueDate: '2024-01-01' },
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Ahmed Al-Sayed', role: 'Manager', basicSalary: 5000, fullSalary: 8000, gosiStatus: 'correct' },
  { id: 'e2', name: 'Sarah Johnson', role: 'Developer', basicSalary: 7000, fullSalary: 7000, gosiStatus: 'error' }, // Error: Basic = Full (unlikely)
  { id: 'e3', name: 'Mohammed Ali', role: 'Sales', basicSalary: 3000, fullSalary: 4500, gosiStatus: 'correct' },
];

export const MOCK_POLICIES: InsurancePolicy[] = [
  { id: 'p1', provider: 'Bupa', policyNumber: 'POL-2023-9988', expirationDate: '2023-12-30', status: 'expiring', membersCount: 12, premium: 15000 },
  { id: 'p2', provider: 'Tawuniya', policyNumber: 'POL-2024-1122', expirationDate: '2024-06-15', status: 'active', membersCount: 5, premium: 8000 },
];

export const MOCK_PORTALS: GovernmentPortal[] = [
  { id: 'gov1', name: 'ZATCA', url: 'https://zatca.gov.sa', linkText: 'zatca.gov.sa', username: '3001234567', password: 'Password123' },
  { id: 'gov2', name: 'Muqeem', url: 'https://muqeem.sa', linkText: 'muqeem.sa', username: 'Rest_Admin', password: 'MuqeemPass2023' },
  { id: 'gov3', name: 'GOSI', url: 'https://gosi.gov.sa', linkText: 'gosi.gov.sa', username: '1010101010', password: 'GosiPassword99' },
];

export const MOCK_VENDORS: Vendor[] = [
  { id: 'v1', name: 'Office Supplies Co.', category: 'Supplies', contactName: 'John Smith', phone: '0501234567', email: 'orders@office.com', balance: 1200, status: 'Active' },
  { id: 'v2', name: 'Fresh Foods Ltd.', category: 'Inventory', contactName: 'Ali Hassan', phone: '0559876543', email: 'ali@freshfoods.sa', balance: 0, status: 'Active' },
];

export const MOCK_VENDOR_INVOICES: VendorInvoice[] = [
  { id: 'vi1', vendorId: 'v1', refNumber: 'INV-001', amount: 450, date: '2023-10-15', dueDate: '2023-11-15', status: 'Unpaid' },
  { id: 'vi2', vendorId: 'v1', refNumber: 'INV-002', amount: 750, date: '2023-09-20', dueDate: '2023-10-20', status: 'Overdue' },
  { id: 'vi3', vendorId: 'v2', refNumber: 'FF-2023-99', amount: 2000, date: '2023-10-01', dueDate: '2023-10-01', status: 'Paid' },
];

export const MOCK_DOCUMENTS: DocumentFile[] = [
  { id: 'd1', name: 'Commercial Registration.pdf', type: 'pdf', size: '2.4 MB', date: '2023-01-15', expiryDate: '2024-01-15', folder: 'Licenses' },
  { id: 'd2', name: 'Municipality License.pdf', type: 'pdf', size: '1.8 MB', date: '2023-03-20', expiryDate: '2024-03-20', folder: 'Licenses' },
  { id: 'd3', name: 'Lease Agreement.pdf', type: 'pdf', size: '5.1 MB', date: '2022-06-01', expiryDate: '2025-06-01', folder: 'Contracts' },
  { id: 'd4', name: 'Vehicle Registration.jpg', type: 'image', size: '3.2 MB', date: '2023-08-10', expiryDate: '2024-08-10', folder: 'Vehicle' },
];