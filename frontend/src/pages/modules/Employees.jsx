import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Filter, Mail, Phone, MoreVertical, Briefcase,
    UserCheck, Trash2, Edit2, X, Eye, Clock, FileText,
    BadgeDollarSign, Calendar, ChevronRight
} from 'lucide-react';
import api from '../../services/api';

export default function Employees() {
    const [searchTerm, setSearchTerm] = useState('');
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    // Employee Edit Modal
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEmployeeId, setCurrentEmployeeId] = useState(null);
    const [employeeForm, setEmployeeForm] = useState({
        firstName: '', lastName: '', email: '', phone: '', password: '',
        position: '', department: '', salary: '', status: 'Active', category: 'General',
        freeLeavesPerMonth: 1, workingDaysPerWeek: 6
    });

    // History Modal
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [payrollHistory, setPayrollHistory] = useState([]);
    const [leaveHistory, setLeaveHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('payroll');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const companyId = localStorage.getItem('companyId');
            const response = await api.get('/employees', { params: { companyId } });
            setEmployees(response.data);
        } catch (err) {
            console.error("Failed to fetch employees", err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (emp) => {
        setSelectedEmployee(emp);
        setShowHistoryModal(true);
        setHistoryLoading(true);
        try {
            const companyId = localStorage.getItem('companyId');
            const [payrollRes, leavesRes] = await Promise.all([
                api.get('/employees/salary-records', { params: { companyId } }),
                api.get('/employees/leaves', { params: { companyId } })
            ]);

            // Filter for THIS employee
            setPayrollHistory(payrollRes.data.filter(r => r.employeeId?._id === emp._id));
            setLeaveHistory(leavesRes.data.filter(r => r.employeeId?._id === emp._id));
        } catch (err) {
            console.error(err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const resetForm = () => {
        setEmployeeForm({
            firstName: '', lastName: '', email: '', phone: '', password: '',
            position: '', department: '', salary: '', status: 'Active', category: 'General',
            freeLeavesPerMonth: 1, workingDaysPerWeek: 6
        });
        setIsEditing(false);
        setCurrentEmployeeId(null);
    };

    const handleOpenCreateModal = () => {
        resetForm();
        setShowModal(true);
    };

    const handleOpenEditModal = (emp) => {
        setEmployeeForm({
            firstName: emp.firstName,
            lastName: emp.lastName,
            email: emp.email,
            phone: emp.phone,
            password: '',
            position: emp.position,
            department: emp.department || '',
            salary: emp.salary,
            status: emp.status,
            category: emp.category || 'General',
            freeLeavesPerMonth: emp.freeLeavesPerMonth !== undefined ? emp.freeLeavesPerMonth : 1,
            workingDaysPerWeek: emp.workingDaysPerWeek || 6
        });
        setIsEditing(true);
        setCurrentEmployeeId(emp._id);
        setShowModal(true);
    };

    const handleSaveEmployee = async (e) => {
        e.preventDefault();
        try {
            const companyId = localStorage.getItem('companyId');
            if (isEditing) {
                const updates = { ...employeeForm };
                if (!updates.password) delete updates.password;
                await api.put(`/employees/${currentEmployeeId}`, updates);
            } else {
                await api.post('/employees', { ...employeeForm, companyId });
            }
            setShowModal(false);
            resetForm();
            fetchEmployees();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save employee');
        }
    };

    const handleDeleteEmployee = async (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                await api.delete(`/employees/${id}`);
                setEmployees(employees.filter(emp => emp._id !== id));
            } catch (err) {
                alert("Failed to delete employee");
            }
        }
    };

    if (loading) return <div className="p-10 text-center">Loading employees...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Employee Management</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your team, roles, and records.</p>
                </div>
                <button
                    onClick={handleOpenCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-all active:scale-95"
                >
                    <Plus size={18} /> Add Employee
                </button>
            </div>

            {/* FILTERS & SEARCH */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row gap-4 justify-between shadow-sm">
                <div className="relative flex-1 md:max-w-md">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, position..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                    />
                </div>
            </div>

            {/* EMPLOYEE GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.filter(emp =>
                    emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    emp.lastName.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((employee) => (
                    <div key={employee._id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                    {employee.firstName[0]}{employee.lastName[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{employee.firstName} {employee.lastName}</h3>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{employee.position}</p>
                                </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${employee.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                                {employee.status}
                            </span>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Mail size={16} className="text-slate-400" />
                                {employee.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Building size={16} className="text-slate-400" />
                                {employee.department || 'Operations'}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Annual Salary</span>
                                <span className="text-sm font-black text-slate-900">₹{employee.salary?.toLocaleString()}</span>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleViewDetails(employee)}
                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    title="View Ledger"
                                >
                                    <Eye size={18} />
                                </button>
                                <button
                                    onClick={() => handleOpenEditModal(employee)}
                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDeleteEmployee(employee._id)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* HISTORY MODAL (LEDGER) */}
            {showHistoryModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl font-black text-indigo-600 border border-slate-100 italic">
                                    {selectedEmployee?.firstName[0]}{selectedEmployee?.lastName[0]}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900">{selectedEmployee?.firstName} {selectedEmployee?.lastName}</h2>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{selectedEmployee?.position} • Employee Ledger</p>
                                </div>
                            </div>
                            <button onClick={() => setShowHistoryModal(false)} className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors border border-transparent hover:border-slate-100">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex px-8 border-b border-slate-100 bg-white">
                            <button
                                onClick={() => setActiveTab('payroll')}
                                className={`px-6 py-4 text-sm font-black tracking-widest uppercase transition-all border-b-2 ${activeTab === 'payroll' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                            >
                                Salary History
                            </button>
                            <button
                                onClick={() => setActiveTab('leaves')}
                                className={`px-6 py-4 text-sm font-black tracking-widest uppercase transition-all border-b-2 ${activeTab === 'leaves' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                            >
                                Leave Requests
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto max-h-[500px] bg-slate-50/30">
                            {historyLoading ? (
                                <div className="py-20 text-center text-slate-400 font-bold flex flex-col items-center gap-4">
                                    <RefreshCw className="animate-spin text-indigo-500" size={32} />
                                    Parsing Records...
                                </div>
                            ) : activeTab === 'payroll' ? (
                                payrollHistory.length > 0 ? (
                                    <div className="space-y-4">
                                        {payrollHistory.map((rec, i) => (
                                            <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center transition-all hover:border-indigo-100 hover:shadow-md">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center font-black">
                                                        ₹
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black text-slate-900 italic uppercase">{rec.payPeriod}</div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{new Date(rec.paymentDate).toLocaleDateString()} • {rec.remarks || 'Salary Disbursement'}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-black text-slate-900 leading-none">₹{rec.amount.toLocaleString()}</div>
                                                    <div className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-1 underline decoration-2 underline-offset-4">Success</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest italic flex flex-col items-center gap-3">
                                        <BadgeDollarSign size={40} className="text-slate-100" />
                                        No Payroll records found.
                                    </div>
                                )
                            ) : (
                                leaveHistory.length > 0 ? (
                                    <div className="space-y-4">
                                        {leaveHistory.map((leave, i) => (
                                            <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center hover:border-indigo-100 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${leave.status === 'Approved' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                                                        <Calendar size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black text-slate-900 italic uppercase">{leave.type} Request</div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${leave.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {leave.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest italic flex flex-col items-center gap-3">
                                        <ClipboardList size={40} className="text-slate-100" />
                                        No Leave records found.
                                    </div>
                                )
                            )}
                        </div>

                        <div className="p-6 bg-white border-t border-slate-100 flex justify-center">
                            <button onClick={() => setShowHistoryModal(false)} className="px-10 py-3 bg-slate-900 hover:bg-black text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-200 transition-all active:scale-95">
                                Close Ledger
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ADD/EDIT MODAL (Preserved from previous implementation but with better styling) */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">
                                {isEditing ? 'UPDATE PERSONNEL' : 'NEW ONBOARDING'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEmployee} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">First Name</label>
                                    <input required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold shadow-inner focus:ring-2 focus:ring-indigo-500" value={employeeForm.firstName} onChange={e => setEmployeeForm({ ...employeeForm, firstName: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Last Name</label>
                                    <input required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold shadow-inner focus:ring-2 focus:ring-indigo-500" value={employeeForm.lastName} onChange={e => setEmployeeForm({ ...employeeForm, lastName: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Email Address</label>
                                    <input required type="email" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold shadow-inner" value={employeeForm.email} onChange={e => setEmployeeForm({ ...employeeForm, email: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Phone (Primary)</label>
                                    <input required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold shadow-inner" value={employeeForm.phone} onChange={e => setEmployeeForm({ ...employeeForm, phone: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Job Title</label>
                                    <input required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold shadow-inner" value={employeeForm.position} onChange={e => setEmployeeForm({ ...employeeForm, position: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Annual CTC (₹)</label>
                                    <input required type="number" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-black shadow-inner" value={employeeForm.salary} onChange={e => setEmployeeForm({ ...employeeForm, salary: e.target.value })} />
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 text-slate-400 hover:text-slate-600 font-bold text-sm">Cancel</button>
                                <button type="submit" className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black text-sm shadow-xl shadow-indigo-100 transition-all active:scale-95">
                                    {isEditing ? 'UPDATE RECORD' : 'CONFIRM ONBOARDING'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const Building = ({ size, className }) => <Briefcase size={size} className={className} />;
const ClipboardList = ({ size, className }) => <FileText size={size} className={className} />;
const RefreshCw = ({ size, className }) => <Clock size={size} className={className} />;
