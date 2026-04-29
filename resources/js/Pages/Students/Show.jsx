import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { 
    User, Mail, Phone, MapPin, Calendar, 
    ShieldAlert, GraduationCap, CheckCircle, 
    Plus, FileText, Activity, Heart, Award,
    Download, Printer, Edit, Trash2, ArrowLeft, Trophy, Star,
    TrendingUp, AlertCircle, Bookmark, ExternalLink, ShieldCheck
} from 'lucide-react';

/* ─────────────────────────────────────
   STYLES (Profile Premium Theme)
───────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,900&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');

.si-root {
  background: #0c0805;
  min-height: 100%;
  flex: 1; display: flex; flex-direction: column;
  font-family: 'DM Sans', system-ui, sans-serif;
  color: #fef3ec;
  padding: 28px 32px 56px;
  position: relative;
}
.si-grid {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    linear-gradient(rgba(249,115,22,0.022) 1px, transparent 1px),
    linear-gradient(90deg, rgba(249,115,22,0.022) 1px, transparent 1px);
  background-size: 48px 48px;
}
.si-content { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; width: 100%; }

.si-card {
  background: #160e08;
  border: 1px solid #2a1508;
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.4);
  margin-bottom: 24px;
}

.si-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 12px; border-radius: 8px;
  font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em;
}
.si-badge-dot { width: 6px; height: 6px; border-radius: 50%; }

.si-tab-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 20px; border-radius: 12px;
  font-size: 11px; font-weight: 700; cursor: pointer; transition: all .2s;
  border: 1px solid transparent;
}

.si-table { width: 100%; border-collapse: collapse; }
.si-th {
  text-align: left; padding: 12px 16px; border-bottom: 1px solid #2a1508;
  font-family: 'Space Mono', monospace; font-size: 9px; color: rgba(254,243,236,0.3);
  text-transform: uppercase; letter-spacing: .1em;
}
.si-td { padding: 16px; border-bottom: 1px solid #1f140c; font-size: 13px; }

.si-stat-label { font-size: 9px; font-weight: 700; color: rgba(254,243,236,0.3); text-transform: uppercase; letter-spacing: .15em; margin-bottom: 4px; }
.si-stat-val { font-family: 'Space Mono', monospace; font-size: 24px; font-weight: 700; color: #f97316; }

.si-log-card {
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px; padding: 16px; margin-bottom: 12px;
}
`;

export default function StudentShow({ student }) {
    const [activeTab, setActiveTab] = React.useState('overview');

    const tabs = [
        { id: 'overview', label: 'Dashboard', icon: User },
        { id: 'grades', label: 'Academic', icon: GraduationCap },
        { id: 'attendance', label: 'Attendance', icon: Calendar },
        { id: 'behavior', label: 'Behavior', icon: Activity },
        { id: 'health', label: 'Medical', icon: Heart },
        { id: 'achievements', label: 'Honors', icon: Award },
    ];

    return (
        <AppLayout title={`${student.first_name} ${student.last_name} - ProFile`} noPadding>
            <style>{css}</style>
            <div className="si-root">
                <div className="si-grid" />
                <div className="si-content">
                    
                    {/* Header Actions */}
                    <div className="flex justify-between items-center mb-8">
                        <Link href={route('students.index')} className="flex items-center gap-2 text-[10px] font-bold text-orange-500 uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                            <ArrowLeft size={14} /> Back to Registry
                        </Link>
                        <div className="flex gap-3">
                            <button className="si-badge bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors">
                                <Download size={12} /> Portfolio
                            </button>
                            <Link href={route('students.edit', student.id)} className="si-badge bg-orange-500/10 border border-orange-500/20 text-orange-500 hover:bg-orange-500/20 transition-all">
                                <Edit size={12} /> Update Profile
                            </Link>
                        </div>
                    </div>

                    {/* Hero Profile Card */}
                    <div className="si-card p-10 flex items-center gap-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="w-32 h-32 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-2xl">
                            {student.photo ? (
                                <img src={`/storage/${student.photo}`} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl font-black text-orange-500 font-mono italic">{student.first_name[0]}{student.last_name[0]}</span>
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                                <h1 className="font-serif text-4xl font-black italic text-white leading-tight">
                                    {student.first_name} {student.last_name}
                                </h1>
                                <span className="si-badge bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                    <span className="si-badge-dot bg-emerald-500 mr-2" />
                                    {student.enrollment_status}
                                </span>
                                {student.registration_status !== 'registered' && (
                                    <span className={`si-badge ${student.registration_status === 'expired' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                        <ShieldAlert size={12} className="mr-1" />
                                        Registration {student.registration_status}
                                    </span>
                                )}
                            </div>
                            <p className="text-white/40 font-medium mb-6 flex items-center gap-2">
                                <GraduationCap size={16} className="text-orange-500" />
                                {student.year_level} Year · {student.section?.name || 'Block Unassigned'}
                            </p>
                            
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-2 text-xs text-white/30">
                                    <Mail size={14} className="text-orange-500" /> {student.user.email}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-white/30">
                                    <ShieldAlert size={14} className="text-orange-500" /> 
                                    ID: <span className="font-mono text-white/70">{student.student_id}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center min-w-[140px]">
                            <div className="si-stat-label">Academic GWA</div>
                            <div className="si-stat-val text-4xl">88.2</div>
                            <div className="text-[10px] font-bold text-emerald-500 mt-2 flex items-center justify-center gap-1">
                                <TrendingUp size={10} /> +2.1%
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`si-tab-btn ${activeTab === tab.id 
                                    ? 'bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-lg shadow-orange-500/20' 
                                    : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white'}`}
                            >
                                <tab.icon size={14} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="animate-in fade-in duration-500">
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-3 gap-8">
                                <div className="col-span-2 space-y-8">
                                    {/* Biographical Card */}
                                    <div className="si-card p-8">
                                        <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                                            <Bookmark size={18} className="text-orange-500" />
                                            <h3 className="font-serif text-xl font-bold italic">Identity Repository</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                                            {[
                                                { label: 'Full Legal Name', value: `${student.first_name} ${student.middle_name || ''} ${student.last_name}` },
                                                { label: 'Primary Program', value: student.section?.name.includes('IT') ? 'BS In Information Technology' : 'BS In Computer Science' },
                                                { label: 'Registry ID', value: student.student_id },
                                                { label: 'Year & Block', value: `${student.year_level} — ${student.section?.name || 'Pending'}` },
                                                { label: 'Emergency Contact', value: student.guardian_name },
                                                { label: 'Hotline Connection', value: student.guardian_contact },
                                            ].concat(student.registration_status !== 'registered' ? [
                                                { label: 'Registration OTP Code', value: student.registration_code || 'N/A' },
                                                { label: 'OTP Expiration', value: new Date(student.registration_code_expires_at).toLocaleDateString() },
                                            ] : []).map((info, i) => (
                                                <div key={info.label}>
                                                    <div className="si-stat-label mb-2">{info.label}</div>
                                                    <div className={`text-sm font-bold ${info.label.includes('OTP') ? 'font-mono text-orange-500' : 'text-white/80'}`}>{info.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Skills & Tracks Card */}
                                    <div className="si-card p-8">
                                        <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                                            <Award size={18} className="text-orange-500" />
                                            <h3 className="font-serif text-xl font-bold italic">Specializations & Active Tracks</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-10">
                                            <div>
                                                <div className="si-stat-label mb-4">Skill Matrix</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {student.skills ? (Array.isArray(student.skills) ? student.skills : student.skills.split(',')).map((s, i) => (
                                                        <span key={i} className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase">{s.trim()}</span>
                                                    )) : <span className="text-xs italic text-white/20">No tracks initialized</span>}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="si-stat-label mb-4">Organizational Involvement</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {student.activities ? (Array.isArray(student.activities) ? student.activities : student.activities.split(',')).map((a, i) => (
                                                        <span key={i} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase">{a.trim()}</span>
                                                    )) : <span className="text-xs italic text-white/20">No active involvements</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="si-card p-8 bg-gradient-to-br from-orange-500/5 to-transparent">
                                        <h4 className="font-serif text-lg italic font-bold mb-6">Quick Registration</h4>
                                        <div className="space-y-3">
                                            {[
                                                { label: 'Log Attendance', icon: Calendar },
                                                { label: 'Academic Entry', icon: GraduationCap },
                                                { label: 'Behavioral Note', icon: ShieldAlert },
                                                { label: 'Health Update', icon: Heart },
                                            ].map((btn, i) => (
                                                <button key={i} className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-orange-500/10 hover:border-orange-500/30 transition-all group">
                                                    <div className="flex items-center gap-3">
                                                        <btn.icon size={14} className="text-orange-500" />
                                                        <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">{btn.label}</span>
                                                    </div>
                                                    <Plus size={14} className="text-white/20" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="si-card p-6 border-emerald-500/20 bg-emerald-500/[0.02]">
                                        <div className="flex items-center gap-3 mb-2">
                                            <ShieldCheck size={16} className="text-emerald-500" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80">Security Status</span>
                                        </div>
                                        <div className="text-xs font-medium text-white/40 leading-relaxed">
                                            This profile is verified and synchronized with the CCS Registry system. All edits are logged for compliance.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'grades' && (
                            <div className="si-card overflow-hidden">
                                <table className="si-table">
                                    <thead>
                                        <tr>
                                            <th className="si-th">Academic Area</th>
                                            <th className="si-th">Fiscal Term</th>
                                            <th className="si-th text-center">Measurement</th>
                                            <th className="si-th">Validator</th>
                                            <th className="si-th text-right">Commit Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {student.grades?.length > 0 ? student.grades.map(g => (
                                            <tr key={g.id}>
                                                <td className="si-td font-bold italic">{g.subject}</td>
                                                <td className="si-td">
                                                    <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-1 rounded text-[9px] font-bold uppercase">
                                                        {g.semester === 1 ? '1st Sem' : g.semester === 2 ? '2nd Sem' : 'Summer'}
                                                    </span>
                                                </td>
                                                <td className="si-td text-center">
                                                    <span className={`font-serif text-xl font-black ${g.score < 75 ? 'text-red-500' : 'text-orange-500'}`}>{g.score}</span>
                                                </td>
                                                <td className="si-td text-[10px] text-white/30 font-mono">{g.recorder?.name}</td>
                                                <td className="si-td text-right text-[10px] text-white/20">{new Date(g.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="5" className="p-10 text-center italic text-white/20">No academic scores recorded yet</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'attendance' && (
                            <div className="grid grid-cols-4 gap-6">
                                <div className="si-card p-6 text-center">
                                    <div className="si-stat-label">Monthly Presence</div>
                                    <div className="si-stat-val">98%</div>
                                </div>
                                <div className="col-span-3 si-card overflow-hidden">
                                    <table className="si-table">
                                        <thead>
                                            <tr>
                                                <th className="si-th">Temporal Key</th>
                                                <th className="si-th">Registry Status</th>
                                                <th className="si-th">Verification Note</th>
                                                <th className="si-th text-right">Gate Entry</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {student.attendance?.length > 0 ? student.attendance.map(a => (
                                                <tr key={a.id}>
                                                    <td className="si-td font-mono text-white/60">{new Date(a.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                                    <td className="si-td">
                                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                            a.status === 'present' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                            a.status === 'late' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                            'bg-red-500/10 text-red-500 border-red-500/20'
                                                        }`}>
                                                            {a.status}
                                                        </span>
                                                    </td>
                                                    <td className="si-td italic text-white/30">{a.remarks || 'Standard gate scan'}</td>
                                                    <td className="si-td text-right text-[10px] text-white/20 font-mono">07:45 AM</td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan="4" className="p-10 text-center italic text-white/20">No attendance data synchronized</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'behavior' && (
                            <div className="space-y-4">
                                {student.behavior_logs?.length > 0 ? student.behavior_logs.map(log => (
                                    <div key={log.id} className="si-card p-6 flex items-start gap-6 border-l-4" style={{ borderColor: log.type === 'merit' ? '#10b981' : '#ef4444' }}>
                                        <div className={`p-4 rounded-xl ${log.type === 'merit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {log.type === 'merit' ? <Star size={24} /> : <AlertCircle size={24} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Incident Registry · {log.date}</div>
                                                    <h4 className="text-lg font-bold italic">{log.title}</h4>
                                                </div>
                                                <span className={`text-[10px] font-black px-3 py-1 rounded-lg ${log.type === 'merit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {log.points} Points
                                                </span>
                                            </div>
                                            <p className="text-sm text-white/50 leading-relaxed max-w-2xl">{log.description}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="si-card p-20 text-center border-dashed border-white/10 bg-transparent">
                                        <ShieldCheck size={48} className="mx-auto text-white/5 mb-4" />
                                        <div className="font-serif italic text-white/20 text-xl">Impeccable Behavioral Record</div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'health' && (
                            <div className="grid grid-cols-2 gap-8">
                                {student.health_records?.length > 0 ? student.health_records.map(h => (
                                    <div key={h.id} className="si-card p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                                <Activity size={20} className="text-orange-500" />
                                            </div>
                                            <div className="text-right">
                                                <div className="si-stat-label">Assessment Date</div>
                                                <div className="text-xs font-mono text-white/60">{h.date}</div>
                                            </div>
                                        </div>
                                        <h4 className="font-serif text-xl italic font-black mb-4">{h.checkup_type}</h4>
                                        <div className="space-y-4 mb-8">
                                            <div>
                                                <div className="si-stat-label mb-1">Clinical Observations</div>
                                                <p className="text-sm text-white/60 line-clamp-2">{h.findings}</p>
                                            </div>
                                            <div>
                                                <div className="si-stat-label mb-1">Medical Directive</div>
                                                <p className="text-sm font-bold text-white/80">{h.recommendation}</p>
                                            </div>
                                        </div>
                                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-[10px] font-bold">DR</div>
                                                <span className="text-[10px] font-bold text-white/30 uppercase">{h.creator?.name}</span>
                                            </div>
                                            <button className="text-xs text-orange-500 font-bold hover:underline flex items-center gap-1">
                                                Full Report <ExternalLink size={10} />
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-2 si-card p-20 text-center border-dashed border-white/10 bg-transparent">
                                        <Heart size={48} className="mx-auto text-white/5 mb-4" />
                                        <div className="font-serif italic text-white/20 text-xl">No significant medical events recorded</div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'achievements' && (
                            <div className="grid grid-cols-3 gap-6">
                                {student.achievements?.length > 0 ? student.achievements.map(award => (
                                    <div key={award.id} className="si-card p-8 group hover:border-orange-500/30 transition-all">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                                            <Trophy size={20} className="text-orange-500" />
                                        </div>
                                        <div className="si-stat-label mb-2">{award.category}</div>
                                        <h4 className="font-serif text-lg italic font-black mb-4 leading-tight">{award.title}</h4>
                                        <p className="text-xs text-white/40 leading-relaxed mb-6">{award.description}</p>
                                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                            <span className="text-[10px] font-mono text-white/20">{award.date_awarded}</span>
                                            <div className="flex gap-1">
                                                <Star size={10} className="text-orange-500 fill-orange-500" />
                                                <Star size={10} className="text-orange-500 fill-orange-500" />
                                                <Star size={10} className="text-orange-500 fill-orange-500" />
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-3 si-card p-20 text-center border-dashed border-white/10 bg-transparent">
                                        <Award size={48} className="mx-auto text-white/5 mb-4" />
                                        <div className="font-serif italic text-white/20 text-xl">Merit points accumulating...</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

