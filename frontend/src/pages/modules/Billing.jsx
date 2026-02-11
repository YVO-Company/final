import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    CreditCard, CheckCircle2, AlertCircle, Calendar,
    ArrowRight, Zap, Shield, Sparkles, Clock, RefreshCw
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Billing() {
    const { config } = useOutletContext();
    const [loading, setLoading] = useState(false);
    const [plans, setPlans] = useState([]);

    // Derived values
    const subscriptionEndsAt = config?.company?.subscriptionEndsAt;
    const isExpired = subscriptionEndsAt && new Date(subscriptionEndsAt) < new Date();
    const daysRemaining = subscriptionEndsAt
        ? Math.ceil((new Date(subscriptionEndsAt) - new Date()) / (1000 * 60 * 60 * 24))
        : 0;

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                // Public plans endpoint or mock
                const res = await api.get('/auth/plans');
                setPlans(res.data);
            } catch (err) {
                // Fallback mock
                setPlans([
                    { name: 'Starter', price: 999, description: 'Basic features for small teams', features: ['Up to 10 Employees', 'Basic Invoicing', 'Finance Tracking'] },
                    { name: 'Growth', price: 2999, description: 'Scaling operations for medium firms', features: ['Unlimited Employees', 'Payroll Module', 'Advanced Analytics', 'Inventory Management'], popular: true },
                    { name: 'Enterprise', price: 7999, description: 'Complete ERP suite for large organizations', features: ['Custom Integrations', 'Dedicated Support', 'White-labeling', 'API Access'] }
                ]);
            }
        };
        fetchPlans();
    }, []);

    const handleRenew = async () => {
        setLoading(true);
        try {
            // Mock renewal call
            const res = await api.post('/company/renew-subscription', { days: 30 });
            toast.success("Subscription renewed successfully! All features are now unlocked.");
            // Reload to get fresh config
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            toast.error("Renewal failed. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Billing & Subscription</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage your plan, invoices, and payment methods.</p>
                </div>
                {isExpired && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full border border-red-100 text-sm font-bold shadow-sm">
                        <AlertCircle size={16} />
                        Subscription Expired
                    </div>
                )}
            </div>

            {/* Current Status Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                        <CreditCard size={120} />
                    </div>

                    <div className="relative">
                        <div className="flex items-center gap-3 text-sm font-bold text-indigo-600 uppercase tracking-widest mb-6">
                            <Zap size={16} />
                            Current Environment
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h2 className="text-4xl font-black text-slate-800">{config?.company?.plan}</h2>
                                <div className="flex items-center gap-2 mt-2 text-slate-500 font-medium">
                                    <Calendar size={18} />
                                    {isExpired ? 'Expired on' : 'Next billing on'} <span className="text-slate-900 font-bold">{new Date(subscriptionEndsAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <div className={`text-3xl font-black ${isExpired ? 'text-red-600' : 'text-slate-900'}`}>
                                    {isExpired ? '0' : daysRemaining} <span className="text-sm text-slate-400 font-bold">DAYS LEFT</span>
                                </div>
                                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${isExpired ? 'bg-red-400 w-full' : 'bg-indigo-600 w-2/3'}`}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap gap-4">
                            <button
                                onClick={handleRenew}
                                disabled={loading}
                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70"
                            >
                                {loading ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                                {isExpired ? 'Renew Now' : 'Extend Subscription'}
                            </button>
                            <button className="px-8 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl font-bold transition-all">
                                Download Last Invoice
                            </button>
                        </div>
                    </div>
                </div>

                {/* Account Summary */}
                <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl shadow-slate-200">
                    <div>
                        <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Estimated Next Bill</div>
                        <div className="text-5xl font-black italic tracking-tighter">₹2,999</div>
                        <p className="text-slate-400 mt-4 text-sm leading-relaxed">
                            Includes Growth Plan base and 3 add-on modules (Finance, Invoicing, Inventory).
                        </p>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between items-center text-sm font-medium">
                            <span className="text-slate-400">Status</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black ${isExpired ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                {isExpired ? 'Restricted' : 'Active'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-medium">
                            <span className="text-slate-400">Payment Method</span>
                            <span className="flex items-center gap-1.5 font-bold">
                                <CreditCard size={14} /> Visa •••• 4242
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Plan Options */}
            <div className="space-y-6 pt-4">
                <div className="text-center md:text-left">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Available Plans</h3>
                    <p className="text-slate-500 font-medium">Choose the perfect scale for your business.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((p, i) => (
                        <div key={i} className={`bg-white rounded-[2.5rem] border-2 p-10 transition-all duration-300 hover:-translate-y-2 relative shadow-sm ${p.popular ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-indigo-100' : 'border-slate-100 hover:border-indigo-200'}`}>
                            {p.popular && (
                                <div className="absolute top-0 right-10 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200">
                                    Recommended
                                </div>
                            )}

                            <h4 className="text-xl font-black text-slate-800">{p.name}</h4>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-3xl font-black text-slate-900 tracking-tighter">₹{p.price.toLocaleString()}</span>
                                <span className="text-slate-400 font-bold text-sm">/month</span>
                            </div>
                            <p className="mt-4 text-sm text-slate-500 font-medium leading-relaxed">{p.description}</p>

                            <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                                {p.features.map((f, fi) => (
                                    <div key={fi} className="flex items-start gap-3 text-sm font-medium text-slate-600">
                                        <div className="mt-0.5 w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                            <CheckCircle2 size={12} />
                                        </div>
                                        {f}
                                    </div>
                                ))}
                            </div>

                            <button
                                className={`mt-10 w-full py-4 rounded-3xl font-black text-sm transition-all flex items-center justify-center gap-2
                                    ${config?.company?.plan === p.name
                                        ? 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-100'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100'
                                    }`}
                            >
                                {config?.company?.plan === p.name ? 'Current Plan' : 'Select Plan'}
                                {config?.company?.plan !== p.name && <ArrowRight size={16} />}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Security Notice */}
            <div className="bg-indigo-50 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 border border-indigo-100">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                    <Shield size={24} />
                </div>
                <div className="flex-1">
                    <h5 className="font-black text-indigo-900 text-lg tracking-tight">Secure Payments</h5>
                    <p className="text-indigo-700 text-sm font-medium">All payments are encrypted using bank-grade 256-bit SSL. We do not store your full card details.</p>
                </div>
                <button className="text-indigo-600 font-black text-sm hover:underline">Read Privacy Policy</button>
            </div>
        </div>
    );
}
