import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { 
    User, Mail, Phone, Calendar, ArrowLeft, 
    CheckCircle2, XCircle, Clock, ShieldCheck, 
    UserPlus, Copy, ClipboardCheck, AlertCircle,
    MapPin, GraduationCap, FileText, Info, Star,
    ClipboardList, Briefcase, Heart, Activity
} from 'lucide-react';

/* ── Palette ── */
const C = {
    bg:'#0c0805', surf:'#160e08', surf2:'#1c1208', bdr:'#2a1508', bdr2:'#3a1e0a',
    orange:'#f97316', o2:'#fb923c', o3:'#fdba74', o4:'#c2410c',
    txt:'#fef3ec', muted:'rgba(254,243,236,0.45)', dim:'rgba(254,243,236,0.22)',
    faint:'rgba(254,243,236,0.08)',
};

const SC = {
    pending:        { color:'#fdba74', bg:'rgba(253,186,116,0.10)', border:'rgba(253,186,116,0.25)', dot:'#fdba74', label:'Pending',        Icon:Clock    },
    form_submitted: { color:'#fb923c', bg:'rgba(249,115,22,0.12)',  border:'rgba(249,115,22,0.30)',  dot:'#f97316', label:'Form Submitted', Icon:ClipboardList },
    accepted:       { color:'#34d399', bg:'rgba(52,211,153,0.10)',  border:'rgba(52,211,153,0.28)',  dot:'#34d399', label:'Accepted',       Icon:CheckCircle2  },
    rejected:       { color:'#f87171', bg:'rgba(239,68,68,0.10)',   border:'rgba(239,68,68,0.28)',   dot:'#f87171', label:'Rejected',       Icon:XCircle       },
    enrolled:       { color:'#f97316', bg:'rgba(249,115,22,0.16)',  border:'rgba(249,115,22,0.38)',  dot:'#f97316', label:'Enrolled',       Icon:Star          },
};

export default function Show({ candidate, student }) {
    const { flash, errors } = usePage().props;
    const [copied, setCopied] = React.useState(false);
    const [showEnrollModal, setShowEnrollModal] = React.useState(false);
    const [processing, setProcessing] = React.useState(false);

    const theme = SC[candidate.status] || SC.pending;
    const Icon = theme.Icon;

    const copyCode = () => {
        navigator.clipboard.writeText(candidate.registration_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleEnroll = () => {
        setProcessing(true);
        router.post(route('candidates.enroll', candidate.id), {}, {
            onFinish: () => {
                setProcessing(false);
                setShowEnrollModal(false);
            }
        });
    };

    const fd = candidate.form_data;

    const DataBox = ({ label, value, icon: IconComponent, full }) => (
        <div className={`bg-white/5 border border-white/10 rounded-2xl p-4 ${full ? 'col-span-2' : ''}`}>
            <div className="flex items-center gap-2 mb-2">
                {IconComponent && <IconComponent size={12} className="text-orange-500/60" />}
                <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{label}</span>
            </div>
            <div className="text-sm font-bold text-white/80">{value || <span className="opacity-20 italic">Not provided</span>}</div>
        </div>
    );

    return (
        <AppLayout title={`Candidate | ${candidate.first_name} ${candidate.last_name}`}>
            <Head title="Candidate Registry Details" />
            
            <div className="max-w-6xl mx-auto py-10 px-6">
                {/* ── Breadcrumb ── */}
                <div className="mb-8 flex items-center justify-between">
                    <Link 
                        href={route('candidates.index')} 
                        className="group flex items-center gap-2 text-white/40 hover:text-orange-500 transition-all text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
                        Back to Registry
                    </Link>

                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Code Protection</span>
                        <div 
                            onClick={copyCode}
                            className="bg-black/40 border border-orange-500/20 px-4 py-2 rounded-xl cursor-pointer hover:border-orange-500/50 transition-all flex items-center gap-3 group"
                        >
                            <code className="text-lg font-black font-mono text-orange-500 tracking-wider">
                                {candidate.registration_code}
                            </code>
                            {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} className="text-white/20 group-hover:text-white/60" />}
                        </div>
                    </div>
                </div>

                {/* ── Main Layout ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* ── Left/Middle: Candidate Bio & Form Data ── */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Profile Header Card */}
                        <div className="bg-[#160e08] border border-[#2a1508] rounded-[32px] p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12 pointer-events-none">
                                <GraduationCap size={200} />
                            </div>

                            <div className="flex items-start gap-8 relative z-10">
                                <div className="w-24 h-24 rounded-3xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-4xl font-black text-orange-500 italic font-serif shadow-2xl">
                                    {candidate.first_name[0]}{candidate.last_name[0]}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-3">
                                        <h1 className="text-4xl font-black text-[#fef3ec] tracking-tight italic font-serif">
                                            {candidate.first_name} {candidate.last_name}
                                        </h1>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-3">
                                        <span 
                                            style={{ background: theme.bg, color: theme.color, border: `1px solid ${theme.border}` }}
                                            className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: theme.color }} />
                                            {theme.label}
                                        </span>
                                        <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black text-white/50 uppercase tracking-widest flex items-center gap-2">
                                            <GraduationCap size={12} className="text-orange-500" />
                                            {candidate.year_level_applied}
                                        </span>
                                        {candidate.strand && (
                                            <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black text-white/50 uppercase tracking-widest flex items-center gap-2">
                                                <Briefcase size={12} className="text-orange-500" />
                                                {candidate.strand}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-10 mt-12 pt-10 border-t border-white/5">
                                <div>
                                    <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Initial Contact</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-sm font-bold text-white/70">
                                            <Mail size={14} className="text-orange-500/60" />
                                            {candidate.email || 'No email provided'}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-bold text-white/70">
                                            <Phone size={14} className="text-orange-500/60" />
                                            {candidate.phone || 'No phone provided'}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Registry Intel</h4>
                                    <div className="space-y-3">
                                        <div className="text-[11px] font-bold text-white/60">
                                            Added: <span className="text-white">{new Date(candidate.created_at).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                        <div className="text-[11px] font-bold text-white/60">
                                            Code Expires: <span className="text-orange-500/80">{new Date(candidate.registration_code_expires_at).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">System Status</h4>
                                    <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
                                        {candidate.registration_code_used ? (
                                            <><ShieldCheck size={16} className="text-emerald-500" /> <span className="text-[10px] font-black text-emerald-500 uppercase">Code Used</span></>
                                        ) : (
                                            <><Clock size={16} className="text-orange-500/60" /> <span className="text-[10px] font-black text-white/40 uppercase">Code Active</span></>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Self-Submitted Form Data Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h3 className="text-xl font-black font-serif italic text-white/80 tracking-tight">Form Submission</h3>
                                <div className="h-px flex-1 bg-white/5"></div>
                            </div>

                            {!fd ? (
                                <div className="bg-[#160e08]/50 border border-white/5 border-dashed rounded-[32px] p-16 text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 text-white/10">
                                        <ClipboardList size={32} />
                                    </div>
                                    <h4 className="text-lg font-bold text-white/40 mb-2">Awaiting Student Completion</h4>
                                    <p className="text-white/20 text-xs max-w-xs mx-auto leading-relaxed">
                                        The student has not yet submitted the public profile form using their registration code.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Personal Identity */}
                                    <div className="bg-[#160e08] border border-[#2a1508] rounded-[24px] p-8 space-y-6">
                                        <div className="flex items-center gap-3 text-orange-500">
                                            <User size={18} />
                                            <h4 className="text-[11px] font-black uppercase tracking-widest">Identity Info</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <DataBox label="Middle Name" value={fd.middle_name} />
                                            <DataBox label="LRN" value={fd.lrn} />
                                            <DataBox label="Birthdate" value={fd.birthdate} />
                                            <DataBox label="Gender" value={fd.gender} />
                                            <DataBox label="Residential Address" value={fd.address} full />
                                        </div>
                                    </div>

                                    {/* Guardian Info */}
                                    <div className="bg-[#160e08] border border-[#2a1508] rounded-[24px] p-8 space-y-6">
                                        <div className="flex items-center gap-3 text-orange-500">
                                            <Heart size={18} />
                                            <h4 className="text-[11px] font-black uppercase tracking-widest">Guardian / Protector</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <DataBox label="Guardian Name" value={fd.guardian_name} full />
                                            <DataBox label="Contact Number" value={fd.guardian_contact} />
                                            <DataBox label="Relationship" value={fd.guardian_relationship} />
                                        </div>
                                    </div>

                                    {/* Skills & Activities */}
                                    <div className="bg-[#160e08] border border-[#2a1508] rounded-[24px] p-8 space-y-6 md:col-span-2">
                                        <div className="flex items-center gap-3 text-orange-500">
                                            <Activity size={18} />
                                            <h4 className="text-[11px] font-black uppercase tracking-widest">Aptitude & Engagement</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-3 block">Specialized Skills</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {fd.skills?.length > 0 ? fd.skills.map((s,i) => (
                                                        <span key={i} className="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3 py-1 rounded-lg text-[11px] font-bold">
                                                            {s}
                                                        </span>
                                                    )) : <span className="text-white/20 italic text-xs">No skills listed.</span>}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-3 block">Extracurricular Activities</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {fd.activities?.length > 0 ? fd.activities.map((a,i) => (
                                                        <span key={i} className="bg-white/5 border border-white/10 text-white/60 px-3 py-1 rounded-lg text-[11px] font-bold">
                                                            {a}
                                                        </span>
                                                    )) : <span className="text-white/20 italic text-xs">No activities listed.</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Right Column: Decision Portal ── */}
                    <div className="space-y-6">
                        
                        {/* Enrollment Card */}
                        {candidate.status === 'accepted' && (
                            <div className="bg-[#160e08] border border-emerald-500/20 rounded-[32px] p-8 shadow-2xl shadow-emerald-500/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform text-emerald-500">
                                    <UserPlus size={100} />
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-white font-black italic font-serif text-xl mb-4 tracking-tight">Finalize Enrollment</h3>
                                    <p className="text-white/40 text-xs leading-relaxed mb-8 italic">
                                        The candidate is accepted. Authorize the system to create a permanent student profile and user account.
                                    </p>
                                    <button 
                                        onClick={() => setShowEnrollModal(true)}
                                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-4 rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                                    >
                                        <ShieldCheck size={16} /> Authorize Enrollment
                                    </button>
                                </div>
                            </div>
                        )}

                        {candidate.status === 'form_submitted' && (
                            <div className="bg-[#160e08] border border-orange-500/20 rounded-[32px] p-8 shadow-2xl shadow-orange-500/5">
                                <h3 className="text-white font-black italic font-serif text-xl mb-4 tracking-tight">Pending Review</h3>
                                <p className="text-white/40 text-xs leading-relaxed mb-8 italic">
                                    Candidate has submitted their profile form. Please review the metadata and decide on acceptance.
                                </p>
                                <Link 
                                    href={route('candidates.index')}
                                    className="w-full bg-white/5 border border-white/10 hover:border-orange-500/50 text-white/60 hover:text-white py-4 rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] transition-all flex items-center justify-center gap-3"
                                >
                                    <ArrowLeft size={14} /> Handle decision in Registry
                                </Link>
                            </div>
                        )}

                        {candidate.status === 'enrolled' && (
                            <div className="bg-orange-500/10 border border-orange-500/20 rounded-[32px] p-8 text-center group">
                                <div className="w-16 h-16 bg-orange-500/20 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                    <Star size={32} />
                                </div>
                                <h4 className="text-xl font-black text-white italic font-serif mb-2">Student Enrolled</h4>
                                <p className="text-white/30 text-[10px] uppercase font-black tracking-[0.2em] mb-8">Record is now live</p>
                                {student && (
                                    <Link 
                                        href={route('students.show', student.id)}
                                        className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 font-bold text-xs uppercase tracking-widest border-b border-orange-500/20 pb-1"
                                    >
                                        View Student Profile <Info size={14} />
                                    </Link>
                                )}
                            </div>
                        )}

                        {/* Internal Remarks */}
                        <div className="bg-[#160e08] border border-[#2a1508] rounded-[32px] p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <FileText size={18} className="text-orange-500" />
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-white/80">Internal Remarks</h4>
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-5 text-sm italic text-white/50 leading-relaxed border-dashed">
                                {candidate.remarks || 'No internal remarks have been recorded for this candidate.'}
                            </div>
                        </div>

                        {/* Protocol Card */}
                        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldCheck size={18} className="text-orange-500/40" />
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-white/30">Registrar Protocol</h4>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    'Review form submission for data validity',
                                    'Cross-reference with external admissions list',
                                    'Status updates trigger system notifications',
                                    'Enrollment creates permanent audit trail'
                                ].map((p, i) => (
                                    <li key={i} className="flex gap-4 text-xs font-medium text-white/40 leading-snug">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500/20 mt-1.5 shrink-0" />
                                        {p}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Enrollment Confirmation Modal ── */}
            {showEnrollModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
                    <div className="bg-[#160e08] border border-emerald-500/20 rounded-[40px] p-10 w-full max-w-lg shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
                        
                        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-[28px] flex items-center justify-center mb-8 mx-auto">
                            <UserPlus size={40} className="text-emerald-500" />
                        </div>

                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-black text-white italic font-serif tracking-tight mb-4">Confirm Authorization</h2>
                            <p className="text-white/50 text-sm leading-relaxed max-w-sm mx-auto">
                                You are about to grant enrollment status to <span className="text-white font-bold">{candidate.first_name} {candidate.last_name}</span>.
                            </p>
                        </div>

                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 mb-10 flex gap-4">
                            <AlertCircle size={20} className="text-emerald-500 shrink-0 mt-1" />
                            <p className="text-[11px] font-medium text-emerald-500/80 leading-relaxed uppercase tracking-wider">
                                This action creates a permanent User account and Student profile. This link is irreversible once committed.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setShowEnrollModal(false)}
                                disabled={processing}
                                className="py-4 rounded-2xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all text-[11px] font-black uppercase tracking-[0.2em]"
                            >
                                Abort
                            </button>
                            <button
                                onClick={handleEnroll}
                                disabled={processing}
                                className="py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {processing ? <Clock size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                                {processing ? 'Commiting...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
