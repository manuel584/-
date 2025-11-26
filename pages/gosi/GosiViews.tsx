
import React, { useState } from 'react';
import { GlassCard, Button, StatusBadge, Input, Modal } from '../../components/UI';
import { MOCK_GOSI_INVOICES, MOCK_EMPLOYEES } from '../../constants';
import { formatCurrency } from '../../utils';
import { AlertTriangle, Clock, FileText, Users, Plus, Trash2, Edit2, ArrowLeft, Briefcase, Calendar, DollarSign, Download, Upload, CheckCircle2 } from 'lucide-react';
import { Employee } from '../../types';

export const GosiDashboard = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees'>('dashboard');
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Filter mock invoices
  const overdueInvoice = MOCK_GOSI_INVOICES.find(i => i.status === 'Overdue');
  const pendingInvoice = MOCK_GOSI_INVOICES.find(i => i.status === 'Pending');

  if (selectedEmployee) {
    return <EmployeeDetail employee={selectedEmployee} onBack={() => setSelectedEmployee(null)} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex gap-2 p-1 bg-gray-100/50 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('employees')}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'employees' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Employees
        </button>
      </div>

      {activeTab === 'dashboard' ? (
        <>
          {/* Overdue Alert */}
          {overdueInvoice && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
              <AlertTriangle className="text-red-500 shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-red-800">Payment OVERDUE</h3>
                <p className="text-sm text-red-600 mt-1">
                  Invoice for {overdueInvoice.month} {overdueInvoice.year} is overdue by 5 days.
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-red-800 text-lg">{formatCurrency(overdueInvoice.amount)}</span>
                  <Button variant="danger" className="h-9 text-xs">Pay Now</Button>
                </div>
              </div>
            </div>
          )}

          {/* Current Month Status */}
          <GlassCard className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4">Current Month</h3>
            
            {pendingInvoice ? (
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{pendingInvoice.month} {pendingInvoice.year}</h2>
                    <p className="text-gray-500 text-sm">Issued {pendingInvoice.issueDate}</p>
                  </div>
                  <StatusBadge status="warning" text="Pending Payment" />
                </div>
                
                <div className="bg-white/60 rounded-xl p-4 border border-white/50 flex justify-between items-center">
                   <div>
                     <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                     <p className="text-xl font-bold text-gray-900">{formatCurrency(pendingInvoice.amount)}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-xs text-gray-500 mb-1">Due Date</p>
                     <p className="font-medium text-gray-900 flex items-center gap-1">
                       <Clock size={14} className="text-orange-500" /> {pendingInvoice.dueDate}
                     </p>
                   </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">Mark as Paid</Button>
                  <Button variant="secondary" className="flex-1">View Details</Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No invoice generated for current month yet.</p>
                <Button onClick={() => setShowCreateInvoice(true)}>
                  <Plus size={16} className="mr-2" /> Create Invoice
                </Button>
              </div>
            )}
          </GlassCard>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
             <GlassCard className="flex flex-col items-center justify-center py-6 gap-2 hover:bg-white/80 cursor-pointer">
               <FileText size={24} className="text-blue-500" />
               <span className="text-sm font-medium text-gray-700">Past Invoices</span>
             </GlassCard>
             <GlassCard className="flex flex-col items-center justify-center py-6 gap-2 hover:bg-white/80 cursor-pointer" onClick={() => setActiveTab('employees')}>
               <Users size={24} className="text-purple-500" />
               <span className="text-sm font-medium text-gray-700">GOSI Employees</span>
             </GlassCard>
          </div>
        </>
      ) : (
        <EmployeeSalaryList onSelectEmployee={setSelectedEmployee} />
      )}

      {/* Modal for Invoice Creation */}
      <Modal isOpen={showCreateInvoice} onClose={() => setShowCreateInvoice(false)} title="Create Monthly Invoice">
        <CreateInvoiceForm onClose={() => setShowCreateInvoice(false)} />
      </Modal>
    </div>
  );
};

const CreateInvoiceForm = ({ onClose }: { onClose: () => void }) => {
  const expectedAmount = MOCK_EMPLOYEES.reduce((acc, curr) => acc + (curr.basicSalary * 0.1), 0); // Mock 10% calculation
  const [actualAmount, setActualAmount] = useState('');
  const [difference, setDifference] = useState(0);
  const [error, setError] = useState('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    setActualAmount(e.target.value);
    setDifference(val - expectedAmount);
    setError('');
  };

  const handleSubmit = () => {
    if (!actualAmount) {
      setError('Invoice amount is required');
      return;
    }
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-xl">
        <p className="text-sm text-blue-800 mb-1">Expected Amount (Calculated)</p>
        <p className="text-2xl font-bold text-blue-900">{formatCurrency(expectedAmount)}</p>
        <p className="text-xs text-blue-600 mt-1">Based on {MOCK_EMPLOYEES.length} active employees</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Actual Amount from GOSI Portal</label>
        <Input 
          type="number" 
          value={actualAmount} 
          onChange={handleAmountChange}
          placeholder="Enter amount from invoice"
          error={error}
        />
      </div>

      {Math.abs(difference) > 0 && actualAmount !== '' && (
        <div className={`p-3 rounded-lg flex items-start gap-2 ${difference !== 0 ? 'bg-yellow-50 text-yellow-800' : 'bg-green-50 text-green-800'}`}>
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <div className="text-sm">
            <span className="font-bold">Mismatch Detected:</span> {formatCurrency(Math.abs(difference))} {difference > 0 ? 'higher' : 'lower'} than expected. 
            <br/><span className="text-xs opacity-80">Please review employee salaries.</span>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button className="flex-1" onClick={handleSubmit}>Create Invoice</Button>
      </div>
    </div>
  );
};

const EmployeeSalaryList = ({ onSelectEmployee }: { onSelectEmployee: (emp: Employee) => void }) => {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Form State
  const [empForm, setEmpForm] = useState<Partial<Employee>>({ name: '', role: '', basicSalary: 0, fullSalary: 0 });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const openAddModal = () => {
    setIsEditMode(false);
    setEmpForm({ name: '', role: '', basicSalary: 0, fullSalary: 0 });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (e: React.MouseEvent, emp: Employee) => {
    e.stopPropagation();
    setIsEditMode(true);
    setEmpForm({ ...emp });
    setErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!empForm.name?.trim()) newErrors.name = "Full name is required";
    if (!empForm.role?.trim()) newErrors.role = "Job role is required";
    if (!empForm.basicSalary || empForm.basicSalary <= 0) newErrors.basicSalary = "Basic salary must be greater than 0";
    if (!empForm.fullSalary || empForm.fullSalary <= 0) newErrors.fullSalary = "Full salary must be greater than 0";
    if (empForm.basicSalary && empForm.fullSalary && empForm.basicSalary > empForm.fullSalary) {
      newErrors.basicSalary = "Basic salary cannot exceed full salary";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      if (isEditMode && empForm.id) {
          setEmployees(employees.map(e => e.id === empForm.id ? { ...e, ...empForm } as Employee : e));
      } else {
          const newEmp = { ...empForm, id: `e${Date.now()}`, gosiStatus: 'correct', status: 'Active' } as Employee;
          setEmployees([...employees, newEmp]);
      }
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-900">Enrolled Employees</h3>
        <Button onClick={openAddModal} className="text-xs h-8 px-3">
          <Plus size={14} className="mr-1" /> Add Employee
        </Button>
      </div>
      
      <div className="space-y-3">
        {employees.map(emp => (
          <GlassCard 
            key={emp.id} 
            onClick={() => onSelectEmployee(emp)}
            className="flex items-center justify-between p-3 group hover:bg-white/80 cursor-pointer"
          >
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                  {emp.name.split(' ').map(n => n[0]).join('').substring(0,2)}
               </div>
               <div>
                  <h4 className="font-bold text-gray-900 text-sm">{emp.name}</h4>
                  <p className="text-xs text-gray-500">{emp.role}</p>
               </div>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-500">Basic Salary</p>
                  <p className="font-mono font-medium">{formatCurrency(emp.basicSalary)}</p>
               </div>
               <StatusBadge status={emp.gosiStatus === 'correct' ? 'success' : 'error'} text={emp.gosiStatus === 'error' ? 'Mismatch' : 'Valid'} />
               <button 
                  onClick={(e) => openEditModal(e, emp)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
               </button>
            </div>
          </GlassCard>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Edit Employee" : "Add Employee"}>
         <div className="space-y-4">
            <div>
               <label className="text-sm font-medium text-gray-700">Full Name</label>
               <Input 
                 value={empForm.name} 
                 onChange={(e) => setEmpForm({...empForm, name: e.target.value})} 
                 placeholder="Employee Name" 
                 error={errors.name}
               />
            </div>
            <div>
               <label className="text-sm font-medium text-gray-700">Job Role</label>
               <Input 
                 value={empForm.role} 
                 onChange={(e) => setEmpForm({...empForm, role: e.target.value})} 
                 placeholder="e.g. Sales Manager" 
                 error={errors.role}
               />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-sm font-medium text-gray-700">Basic Salary</label>
                 <Input 
                    type="number"
                    value={empForm.basicSalary || ''} 
                    onChange={(e) => setEmpForm({...empForm, basicSalary: Number(e.target.value)})} 
                    error={errors.basicSalary}
                 />
               </div>
               <div>
                 <label className="text-sm font-medium text-gray-700">Full Salary</label>
                 <Input 
                    type="number"
                    value={empForm.fullSalary || ''} 
                    onChange={(e) => setEmpForm({...empForm, fullSalary: Number(e.target.value)})} 
                    error={errors.fullSalary}
                 />
               </div>
            </div>
            <div className="flex gap-3 pt-4">
               <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
               <Button className="flex-1" onClick={handleSave}>Save Changes</Button>
            </div>
         </div>
      </Modal>
    </div>
  );
};

// FULL EMPLOYEE DETAIL VIEW
const EmployeeDetail = ({ employee, onBack }: { employee: Employee, onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'documents' | 'payroll'>('info');

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Detail Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
           <button onClick={onBack} className="p-2 hover:bg-white/50 rounded-full transition-colors">
              <ArrowLeft size={20} />
           </button>
           <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                  {employee.name.split(' ').map(n => n[0]).join('').substring(0,2)}
              </div>
              <div>
                 <h2 className="text-xl font-bold text-gray-900">{employee.name}</h2>
                 <p className="text-sm text-gray-500">{employee.role} • {employee.department || 'General'}</p>
              </div>
           </div>
        </div>
        <StatusBadge status="active" text="Active" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex p-1 bg-gray-100/50 rounded-xl w-full">
         {[
           { id: 'info', label: 'Overview', icon: Users },
           { id: 'documents', label: 'Documents', icon: FileText },
           { id: 'payroll', label: 'Payroll', icon: DollarSign },
         ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)} 
             className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === tab.id ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
           >
             <tab.icon size={16} /> {tab.label}
           </button>
         ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[300px]">
        {activeTab === 'info' && (
          <div className="space-y-6">
             <div className="grid gap-4 md:grid-cols-2">
                <GlassCard className="space-y-4">
                   <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Salary Details</h3>
                   <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Basic Salary (GOSI Base)</span>
                      <span className="font-mono font-bold">{formatCurrency(employee.basicSalary)}</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Housing & Transport</span>
                      <span className="font-mono font-bold">{formatCurrency(employee.fullSalary - employee.basicSalary)}</span>
                   </div>
                   <div className="flex justify-between items-center py-2">
                      <span className="text-gray-900 font-bold">Total Package</span>
                      <span className="font-mono font-bold text-lg text-blue-600">{formatCurrency(employee.fullSalary)}</span>
                   </div>
                </GlassCard>

                <GlassCard className="space-y-4">
                   <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Compliance Status</h3>
                   <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                      <CheckCircle2 className="text-green-600" size={24} />
                      <div>
                         <p className="font-bold text-green-800">GOSI Registered</p>
                         <p className="text-xs text-green-600">Enrolled correctly with basic salary</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <Briefcase className="text-blue-600" size={24} />
                      <div>
                         <p className="font-bold text-blue-800">Contract Active</p>
                         <p className="text-xs text-blue-600">Expires in 180 days</p>
                      </div>
                   </div>
                </GlassCard>
             </div>
          </div>
        )}

        {activeTab === 'documents' && (
           <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                 <h3 className="font-bold text-gray-900">Employee Documents</h3>
                 <Button className="text-xs h-8"><Upload size={14} className="mr-1"/> Upload</Button>
              </div>
              {['Employment Contract', 'Saudi ID / Iqama', 'Medical Insurance Card'].map((doc, i) => (
                 <GlassCard key={i} className="flex items-center justify-between p-3 hover:bg-white/80 cursor-pointer">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
                          <FileText size={20} />
                       </div>
                       <div>
                          <p className="font-bold text-gray-900 text-sm">{doc}</p>
                          <p className="text-xs text-gray-500">PDF • 2.4 MB</p>
                       </div>
                    </div>
                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-full"><Download size={16}/></Button>
                 </GlassCard>
              ))}
           </div>
        )}

        {activeTab === 'payroll' && (
           <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-gray-200">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                       <tr>
                          <th className="px-4 py-3">Month</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Amount</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white/50">
                       {[
                         { month: 'October', date: '2023-10-28', status: 'Paid', amount: employee.fullSalary },
                         { month: 'September', date: '2023-09-28', status: 'Paid', amount: employee.fullSalary },
                         { month: 'August', date: '2023-08-28', status: 'Paid', amount: employee.fullSalary },
                       ].map((record, i) => (
                          <tr key={i} className="hover:bg-white/80">
                             <td className="px-4 py-3 font-medium text-gray-900">{record.month}</td>
                             <td className="px-4 py-3 text-gray-500">{record.date}</td>
                             <td className="px-4 py-3"><StatusBadge status="success" text={record.status} /></td>
                             <td className="px-4 py-3 text-right font-mono">{formatCurrency(record.amount)}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};