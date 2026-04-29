import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { 
    User, Mail, Phone, Calendar, ArrowLeft, 
    CheckCircle2, XCircle, Clock, ShieldCheck, 
    UserPlus, Copy, ClipboardCheck, AlertCircle,
    MapPin, GraduationCap, FileText, Info, Star
} from 'lucide-react';

export default function Show({ application }) {
    const { flash, errors } = usePage().props;
    const { post, processing } = useForm();
    const [copied, setCopied]     = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);

    const handleEnroll = () => {
        post(route('admissions.enroll', application.id), {
            onFinish: () => setShowModal(false),
        });
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(flash.registration_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const STATUS_THEMES = {
        pending: { color: '#fb923c', bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.2)', icon: Clock },
        reviewing: { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)', icon: Info },
        accepted: { color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)', icon: CheckCircle2 },
        rejected: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)', icon: XCircle },
        enrolled: { color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.2)', icon: Star },
    };

    const theme = STATUS_THEMES[application.status] || STATUS_THEMES.pending;
    const Icon = theme.icon;

    return (
        <>
        <AppLayout title={`Application Detail | ${application.first_name} ${application.last_name}`}>
            <Head title="Application Detail" />
            
            <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <div className="mb-8">
                    <Link 
                        href={route('admissions.index')} 
                        className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
                    >
                        <ArrowLeft size={14} /> Back to Pipeline
                    </Link>
                </div>

                {/* Enrollment Success Alert */}
                {flash.enrollment_success && flash.registration_code && (
                    <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform text-emerald-500">
                                <ShieldCheck size={120} />
                            </div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-emerald-500 text-black p-2 rounded-lg">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <h3 className="text-xl font-black italic font-serif text-emerald-500 tracking-tight">
                                        {flash.enrollment_success}
                                    </h3>
                                </div>
                                
                                <p className="text-emerald-500/60 text-sm mb-6 max-w-lg">
                                    Give this code to the student so they can register their account. This code is unique and expires in 7 days.
                                </p>

                                <div className="flex items-center gap-4 bg-black/40 border border-emerald-500/30 p-6 rounded-2xl inline-flex min-w-[320px] justify-between group/code">
                                    <code className="text-4xl font-black font-mono tracking-[0.2em] text-emerald-400">
                                        {flash.registration_code}
                                    </code>
                                    <button 
                                        onClick={copyToClipboard}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                            copied 
                                            ? 'bg-emerald-500 text-black' 
                                            : 'bg-white/5 text-emerald-500 hover:bg-emerald-500 hover:text-black border border-emerald-500/20'
                                        }`}
                                    >
                                        {copied ? <ClipboardCheck size={14} /> : <Copy size={14} />}
                                        {copied ? 'Copied' : 'Copy Code'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enrollment Error Alert */}
                {errors.enrollment && (
                    <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-center gap-4">
                        <div className="bg-red-500 text-white p-2 rounded-lg">
                            <AlertCircle size={20} />
                        </div>
                        <p className="text-red-500 font-bold text-sm tracking-wide uppercase">{errors.enrollment}</p>
                    </div>
                )}

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Summary Card */}
                        <div className="bg-[#160e08] border border-[#2a1508] rounded-3xl p-8 relative overflow-hidden">
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-3xl font-black text-orange-500 italic font-serif">
                                        {application.first_name[0]}{application.last_name[0]}
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-black text-[#fef3ec] tracking-tight italic font-serif mb-2">
                                            {application.first_name} {application.last_name}
                                        </h1>
                                        <span 
                                            style={{ background: theme.bg, color: theme.color, border: `1px solid ${theme.border}` }}
                                            className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: theme.color }} />
                                            {Icon && <Icon size={11} />}
                                            {application.status}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mb-1">Applied for</p>
                                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-lg font-black text-white/80 italic font-serif">
                                        <GraduationCap size={18} className="text-orange-500" />
                                        {application.year_level_applied}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                                <div>
                                    <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Contact Protocol</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-sm font-bold text-white/70">
                                            <div className="bg-white/5 p-2 rounded-lg text-orange-500"><Mail size={14} /></div>
                                            {application.email}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm font-bold text-white/70">
                                            <div className="bg-white/5 p-2 rounded-lg text-orange-500"><Phone size={14} /></div>
                                            {application.phone}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Submission Intel</h4>
                                    <div className="flex items-center gap-4 text-sm font-bold text-white/70">
                                        <div className="bg-white/5 p-2 rounded-lg text-orange-500"><Calendar size={14} /></div>
                                        {new Date(application.created_at).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info Card */}
                        <div className="bg-[#160e08] border border-[#2a1508] rounded-3xl p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-orange-500/20 text-orange-500 p-2 rounded-lg">
                                    <FileText size={18} />
                                </div>
                                <h3 className="text-lg font-bold text-white tracking-tight">Candidate Metadata</h3>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Remarks / Notes</label>
                                    <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap italic">
                                        {application.remarks || 'No official remarks entered for this candidate.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Actions */}
                    <div className="space-y-6">
                        {/* Finalize Enrollment Button */}
                        {application.status === 'accepted' && (
                            <div className="bg-[#160e08] border border-emerald-500/20 rounded-3xl p-6 shadow-2xl shadow-emerald-500/5">
                                <div className="mb-6">
                                    <h4 className="text-white font-bold mb-2">Enroll Applicant</h4>
                                    <p className="text-white/40 text-xs leading-relaxed">
                                        Authorize this student's registration. A user record and OTP will be created.
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setShowModal(true)}
                                    disabled={processing}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <><Clock size={16} className="animate-spin" /> Enrolling...</>
                                    ) : (
                                        <><UserPlus size={16} /> Finalize Enrollment</>
                                    )}
                                </button>
                            </div>
                        )}

                        {application.status === 'enrolled' && (
                            <div className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-6 text-center">
                                <div className="bg-orange-500/20 text-orange-500 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Star size={24} />
                                </div>
                                <h4 className="text-white font-bold mb-1 tracking-tight italic font-serif">Already Enrolled</h4>
                                <p className="text-white/30 text-[10px] uppercase font-black tracking-widest">
                                    Student Record Active
                                </p>
                            </div>
                        )}

                        {/* Help / Protocol Card */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                            <div className="flex items-center gap-2 mb-4 text-white/40">
                                <MapPin size={14} className="text-orange-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest">CCS Registry Protocol</span>
                            </div>
                            <ul className="space-y-3">
                                {[
                                    'Review biological data for authenticity',
                                    'Validate contact information connectivity',
                                    'Status changes are logged for auditing',
                                ].map((step, i) => (
                                    <li key={i} className="flex gap-3 text-xs text-white/50 leading-tight">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500/40 mt-1 flex-shrink-0" />
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>

        {/* ── Enrollment Confirmation Modal ── */}
        {showModal && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
            >
                <div
                    className="relative bg-[#160e08] border border-emerald-500/20 rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl"
                    style={{ animation: 'modal-pop 0.2s cubic-bezier(0.22,1,0.36,1) both' }}
                >
                    <style>{`
                        @keyframes modal-pop {
                            from { opacity:0; transform:scale(0.94) translateY(12px); }
                            to   { opacity:1; transform:none; }
                        }
                    `}</style>

                    {/* Icon */}
                    <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                        <UserPlus size={26} className="text-emerald-400" />
                    </div>

                    {/* Title */}
                    <h2 className="text-white font-black text-xl italic font-serif tracking-tight mb-2">
                        Authorize Enrollment
                    </h2>
                    <p className="text-white/40 text-sm leading-relaxed mb-2">
                        You are about to enroll{' '}
                        <span className="text-white font-bold">
                            {application.first_name} {application.last_name}
                        </span>.
                    </p>
                    <p className="text-white/30 text-xs leading-relaxed mb-8">
                        This will create a <span className="text-emerald-400 font-bold">student record</span> and
                        a <span className="text-emerald-400 font-bold">user account</span>, and generate a
                        one-time registration code. This action cannot be undone.
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowModal(false)}
                            disabled={processing}
                            className="flex-1 py-3 rounded-2xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all text-xs font-black uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleEnroll}
                            disabled={processing}
                            className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <><Clock size={14} className="animate-spin" /> Enrolling…</>
                            ) : (
                                <><ShieldCheck size={14} /> Confirm Enrollment</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}
