import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import {
    ArrowLeft, ShieldAlert, Award, AlertOctagon, CheckCircle, Lock,
    Scale, FileCheck, ChevronDown, ChevronUp, AlertTriangle
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────────────────────
   STYLES (Premium Dark Orange Theme)
   ────────────────────────────────────────────────────────────────────────── */
const C = {
    bg: '#0c0805', surf: '#160e08', surf2: '#1c1208', bdr: '#2a1508', bdr2: '#3a1e0a',
    orange: '#f97316', o2: '#fb923c', o3: '#fdba74', o4: '#c2410c',
    txt: '#fef3ec', muted: 'rgba(254,243,236,0.35)', dim: 'rgba(254,243,236,0.18)',
    faint: 'rgba(254,243,236,0.06)',
    green: '#10b981', amber: '#f59e0b', red: '#ef4444', teal: '#14b8a6', blue: '#3b82f6', purple: '#8b5cf6'
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,900&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');

.gr-root {
    background: ${C.bg}; min-height: 100vh; flex: 1; display: flex; flex-direction: column;
    font-family: 'DM Sans', system-ui, sans-serif; color: ${C.txt}; padding: 32px 40px 80px; position: relative;
    overflow-x: hidden;
}
.gr-grid-tex { position: fixed; inset: 0; pointer-events: none; z-index: 0; background-size: 56px 56px; background-image: linear-gradient(${C.dim} 1px, transparent 1px), linear-gradient(90deg, ${C.dim} 1px, transparent 1px); opacity: 0.3; }
.gr-orb1 { position: fixed; top: -10%; right: -5%; width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%); pointer-events: none; z-index: 0; }

.gr-content { position: relative; z-index: 1; max-width: 1400px; margin: 0 auto; width: 100%; animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.tl-scrollbar::-webkit-scrollbar { width: 6px; }
.tl-scrollbar::-webkit-scrollbar-track { background: transparent; }
.tl-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

/* Table System */
.cr-table-wrap { overflow: hidden; border-radius: 20px; border: 1px solid ${C.bdr}; background: ${C.surf}; margin-bottom: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
.cr-table { width: 100%; border-collapse: separate; border-spacing: 0; }
.cr-th { background: rgba(255,255,255,0.015); padding: 16px 20px; font-family: 'Space Mono'; font-size: 10px; font-weight: 700; color: ${C.muted}; text-transform: uppercase; letter-spacing: .15em; border-bottom: 1px solid ${C.bdr2}; text-align: left; }
.cr-td { padding: 18px 20px; border-bottom: 1px solid ${C.faint}; transition: all .2s ease; }
.cr-tr:last-child .cr-td { border-bottom: none; }
.cr-tr:hover .cr-td { background: rgba(249,115,22,0.03); }
`;

export default function Timeline({ student, groupedLogs, conductScore, clearance, alerts, available_categories, category_summary }) {
    const [showResolved, setShowResolved] = useState(false);
    const [expandedLogs, setExpandedLogs] = useState({});
    const [categoryFilter, setCategoryFilter] = useState('all');

    const toggleDesc = (id) => {
        setExpandedLogs(p => ({ ...p, [id]: !p[id] }));
    };

    const filteredGroupedLogs = useMemo(() => {
        if (categoryFilter === 'all') return groupedLogs;
        const res = {};
        for (const [month, logs] of Object.entries(groupedLogs)) {
            const f = logs.filter(l => l.category === categoryFilter);
            if (f.length > 0) res[month] = f;
        }
        return res;
    }, [groupedLogs, categoryFilter]);

    const parsedScore = conductScore?.total_score ?? 100;
    const isCritical = parsedScore < 50;
    const scoreColor = isCritical ? C.red : parsedScore < 80 ? C.amber : C.green;
    const scoreLabel = isCritical ? 'Critical' : parsedScore < 80 ? 'At Risk' : parsedScore < 100 ? 'Fair' : 'Excellent';

    const unresolvedAlerts = alerts.filter(a => a.resolution_status === 'unresolved');
    const resolvedAlerts = alerts.filter(a => a.resolution_status === 'resolved');

    const totalLogs = Object.values(groupedLogs).reduce((acc, logs) => acc + logs.length, 0);

    const getMonthName = (YYYYMM) => {
        const [year, month] = YYYYMM.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    return (
        <AppLayout title="Incident Timeline" noPadding>
            <Head title={`Conduct Timeline - ${student.first_name} ${student.last_name}`} />
            <style>{css}</style>

            <div className="gr-root">
                <div className="gr-grid-tex" />
                <div className="gr-orb1" />

                <div className="gr-content">
                    {/* Header */}
                    <div className="mb-12">
                        <button 
                            onClick={() => router.visit(route('conduct.index'))} 
                            className="flex items-center gap-2 text-white/50 hover:text-orange-500 transition-colors uppercase text-[10px] font-black tracking-widest mb-6"
                        >
                            <ArrowLeft size={14} /> Back to Conduct Registry
                        </button>
                        
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 style={{ fontFamily: 'Playfair Display', fontSize: 48, fontWeight: 900, fontStyle: 'italic', color: C.txt, lineHeight: 1.1, textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                                    {student.first_name} <span style={{ color: C.orange }}>{student.last_name}</span>
                                </h1>
                                <div className="flex items-center gap-4 mt-4">
                                    <span style={{ fontFamily: 'Space Mono', fontSize: 13, fontWeight: 900, color: C.orange }}>
                                        {student.student_id}
                                    </span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                    <span style={{ fontSize: 11, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.2em' }}>
                                        {student.course} • Year {student.year_level} • {student.section?.name || 'Unassigned'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center min-w-[80px]">
                                    <span style={{ fontSize: 20, fontWeight: 900, fontFamily: 'Space Mono', color: scoreColor }}>{parsedScore}</span>
                                    <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: C.dim }}>Score</span>
                                </div>
                                <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col items-center min-w-[80px]">
                                    <span style={{ fontSize: 20, fontWeight: 900, fontFamily: 'Space Mono', color: C.red }}>{conductScore?.violation_count ?? 0}</span>
                                    <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: C.dim }}>Violations</span>
                                </div>
                                <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-2xl flex flex-col items-center min-w-[80px]">
                                    <span style={{ fontSize: 20, fontWeight: 900, fontFamily: 'Space Mono', color: C.green }}>{conductScore?.commendation_count ?? 0}</span>
                                    <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: C.dim }}>Awards</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Layout */}
                    <div className="grid grid-cols-[1fr,380px] gap-8">
                        
                        {/* Left Column - History & Cards */}
                        <div className="space-y-8">
                            
                            {/* Score & Clearance Cards (Top 2-col) */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-black/30 border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
                                    <div>
                                        <div style={{ fontSize: 10, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 12 }}>Behavior Score Index</div>
                                        <div style={{ fontFamily: 'Playfair Display', fontSize: 42, fontStyle: 'italic', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
                                            {parsedScore}<span style={{ fontSize: 16, color: C.dim, fontFamily: 'Space Mono', fontStyle: 'normal' }}>/150</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8">
                                        <div className="flex justify-between items-center mb-2">
                                            <span style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', color: scoreColor }}>Status: {scoreLabel}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div style={{ width: `${(parsedScore / 150) * 100}%`, background: scoreColor, height: '100%', borderRadius: 99 }} />
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 p-6 opacity-5"><Scale size={100} /></div>
                                </div>

                                <div className="bg-black/30 border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
                                    <div>
                                        <div style={{ fontSize: 10, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 12 }}>Clearance Priority</div>
                                        <div style={{ fontSize: 24, fontWeight: 900, textTransform: 'uppercase', color: clearance?.status === 'cleared' ? C.green : clearance?.status === 'hold' ? C.red : C.orange }}>
                                            {clearance?.status?.replace(/_/g, ' ') ?? 'evaluate'}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 z-10 relative">
                                        {clearance?.status === 'cleared' ? (
                                            <div className="flex flex-wrap gap-2">
                                                {(clearance?.cleared_for || ['Enrollment', 'Graduation', 'Extracurriculars']).map((item, id) => (
                                                    <div key={id} className="bg-green-500/10 border border-green-500/30 text-green-500 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg">
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div>
                                                <div style={{ fontSize: 11, fontWeight: 700, color: C.txt, lineHeight: 1.5 }}>
                                                    {clearance?.notes || "Administrative hold placed on student records. Clear pending alerts to unhold."}
                                                </div>
                                            </div>
                                        )}
                                        <div style={{ fontSize: 9, fontWeight: 700, color: C.dim, marginTop: 12 }}>
                                            {clearance?.updated_at || conductScore?.updated_at
                                                ? 'LAST EVALUATED: ' + new Date(clearance?.updated_at || conductScore?.updated_at).toLocaleDateString()
                                                : 'NOT YET EVALUATED'}
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 p-6 opacity-5"><FileCheck size={100} /></div>
                                </div>
                            </div>

                            {/* TIMELINE */}
                            <div>
                                <h2 style={{ fontSize: 14, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.2em', color: C.txt, marginBottom: 24 }}>Incident Timeline</h2>
                                
                                {/* Category Breakdown & Filters */}
                                {category_summary?.length > 0 && (
                                    <div className="mb-10">
                                        {/* Filters */}
                                        <div className="flex gap-2 mb-6 overflow-x-auto pb-4 tl-scrollbar">
                                            <button 
                                                onClick={() => setCategoryFilter('all')}
                                                className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${categoryFilter === 'all' ? 'bg-orange-500/15 text-orange-500 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]' : 'bg-black/30 text-white/50 border border-white/5 hover:bg-white/5'}`}
                                            >
                                                ALL LOGS ({totalLogs})
                                            </button>
                                            {category_summary.map((cat, idx) => {
                                                const isActive = categoryFilter === cat.category;
                                                return (
                                                    <button 
                                                        key={idx}
                                                        onClick={() => setCategoryFilter(isActive ? 'all' : cat.category)}
                                                        className={`whitespace-nowrap flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? 'shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'hover:bg-white/5'}`}
                                                        style={isActive ? { background: `${cat.color}20`, border: `1px solid ${cat.color}40`, color: cat.color } : { background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', color: C.muted }}
                                                    >
                                                        <span className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                                                        {cat.label} ({cat.count})
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Chart */}
                                        <div className="bg-black/20 border border-white/5 rounded-3xl p-5 mb-8">
                                            <div style={{ fontSize: 10, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 12 }}>Distribution</div>
                                            <div className="w-full h-2 rounded-full overflow-hidden flex bg-white/5 cursor-pointer">
                                                {category_summary.map((cat, idx) => {
                                                    const width = (cat.count / totalLogs) * 100 + '%';
                                                    return (
                                                        <div 
                                                            key={idx} 
                                                            style={{ width, background: cat.color, opacity: categoryFilter === 'all' || categoryFilter === cat.category ? 1 : 0.2 }} 
                                                            onClick={() => setCategoryFilter(categoryFilter === cat.category ? 'all' : cat.category)}
                                                            className="hover:brightness-125 transition-all"
                                                            title={`${cat.label}: ${cat.count}`} 
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {Object.keys(filteredGroupedLogs).length === 0 ? (
                                    <div className="bg-black/30 border border-white/5 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 rounded-3xl bg-green-500/10 flex items-center justify-center text-green-500 mb-6">
                                            <CheckCircle size={32} />
                                        </div>
                                        <div style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 24, color: C.txt, marginBottom: 8 }}>Clean Slate</div>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em' }}>
                                            No conduct records found for this student.
                                        </div>
                                    </div>
                                ) : (
                                    <div className="ml-4 space-y-10 border-l border-[rgba(255,255,255,0.05)] pl-8 relative">
                                        {Object.entries(filteredGroupedLogs).map(([monthKey, logs]) => (
                                            <div key={monthKey} className="relative">
                                                <div className="absolute -left-10 w-4 h-4 rounded-full bg-orange-500 box-content border-4 border-[#0c0805] -translate-x-[2px]" />
                                                <div style={{ fontFamily: 'Playfair Display', fontSize: 24, fontStyle: 'italic', fontWeight: 900, color: C.orange, marginBottom: 20, textShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
                                                    {getMonthName(monthKey)}
                                                </div>
                                                <div className="cr-table-wrap">
                                                     <table className="cr-table">
                                                         <thead>
                                                             <tr>
                                                                 <th className="cr-th" style={{ width: 100 }}>Date</th>
                                                                 <th className="cr-th">Incident & Severity</th>
                                                                 <th className="cr-th">Classification</th>
                                                                 <th className="cr-th">Impact</th>
                                                                 <th className="cr-th">Status</th>
                                                                 <th className="cr-th">Record</th>
                                                             </tr>
                                                         </thead>
                                                         <tbody>
                                                             {logs.map((log) => {
                                                                 const isViolation = log.type === 'violation';
                                                                 const cPrimary = isViolation ? C.red : C.green;
                                                                 const isResolved = log.resolution_status === 'resolved';
                                                                 
                                                                 let sevColor = C.muted;
                                                                 if (log.severity === 'high') sevColor = C.red;
                                                                 if (log.severity === 'medium') sevColor = C.amber;
                                                                 if (log.severity === 'low') sevColor = C.green;

                                                                 return (
                                                                     <tr key={log.id} className="cr-tr">
                                                                         <td className="cr-td">
                                                                             <div style={{ fontFamily: 'Space Mono', fontSize: 11, fontWeight: 900, color: C.dim, textTransform: 'uppercase' }}>
                                                                                 {new Date(log.date || log.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                                                                             </div>
                                                                         </td>
                                                                         <td className="cr-td">
                                                                             <div className="flex items-center gap-2 mb-1">
                                                                                 <div className="w-1.5 h-1.5 rounded-full" style={{ background: sevColor }} />
                                                                                 <span style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', color: sevColor }}>{log.severity}</span>
                                                                             </div>
                                                                             <div style={{ fontSize: 13, fontWeight: 700, color: C.txt }}>{(log.category || 'other').replace(/_/g, ' ')}</div>
                                                                         </td>
                                                                         <td className="cr-td">
                                                                             <span style={{ fontFamily: 'Space Mono', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', padding: '4px 10px', borderRadius: 8, background: `${cPrimary}12`, border: `1px solid ${cPrimary}25`, color: cPrimary }}>
                                                                                 {log.type}
                                                                             </span>
                                                                         </td>
                                                                         <td className="cr-td">
                                                                             <div style={{ fontFamily: 'Space Mono', fontSize: 15, fontWeight: 900, color: cPrimary }}>
                                                                                 {log.points != null ? (log.points > 0 ? `+${log.points}` : log.points) : '—'}
                                                                                 <span style={{ fontSize: 9, opacity: 0.4, marginLeft: 2 }}>PTS</span>
                                                                             </div>
                                                                         </td>
                                                                         <td className="cr-td">
                                                                             <div className="flex items-center gap-2">
                                                                                 <div className="w-1 h-1 rounded-full" style={{ background: isResolved ? C.teal : C.amber }} />
                                                                                 <span style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', color: isResolved ? C.teal : C.amber }}>
                                                                                     {log.resolution_status || 'unresolved'}
                                                                                 </span>
                                                                             </div>
                                                                         </td>
                                                                         <td className="cr-td">
                                                                            <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.4, maxWidth: 300 }}>
                                                                                {log.description}
                                                                            </p>
                                                                         </td>
                                                                     </tr>
                                                                 );
                                                             })}
                                                         </tbody>
                                                     </table>
                                                 </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Right Sidebar - Alerts */}
                        <div className="relative">
                            <div className="sticky top-10 space-y-6">
                                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                                    <ShieldAlert size={18} className="text-orange-500" />
                                    <h3 style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.15em', color: C.txt }}>Active Alerts</h3>
                                    <span className="ml-auto bg-orange-500 text-white rounded-full px-2 py-0.5 text-[10px] font-black shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                                        {unresolvedAlerts.length}
                                    </span>
                                </div>

                                {unresolvedAlerts.length === 0 ? (
                                    <div className="bg-black/30 border border-white/5 rounded-2xl p-6 text-center">
                                        <div style={{ fontSize: 10, fontWeight: 700, color: C.dim, textTransform: 'uppercase', letterSpacing: '.1em' }}>No active alerts</div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {unresolvedAlerts.map(alert => {
                                            const isCritical = alert.severity === 'critical';
                                            const isHigh = alert.severity === 'high';
                                            const cBg = isCritical ? `${C.red}15` : isHigh ? `${C.orange}15` : `${C.amber}15`;
                                            const cBorder = isCritical ? `${C.red}30` : isHigh ? `${C.orange}30` : `${C.amber}30`;
                                            const cTxt = isCritical ? C.red : isHigh ? C.orange : C.amber;

                                            return (
                                                <div key={alert.id} className="p-4 rounded-[20px] flex items-start gap-3 shadow-lg" style={{ background: cBg, border: `1px solid ${cBorder}` }}>
                                                    <div className="mt-1 shrink-0" style={{ color: cTxt }}><AlertTriangle size={16} /></div>
                                                    <div>
                                                        <div style={{ fontSize: 9, fontWeight: 900, color: cTxt, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }} className="bg-black/20 inline-block px-2 py-0.5 rounded-md">
                                                            {alert.type.replace(/_/g, ' ')}
                                                        </div>
                                                        <div style={{ fontSize: 12, fontWeight: 700, color: C.txt, lineHeight: 1.4 }}>{alert.message}</div>
                                                        <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, marginTop: 6, fontStyle: 'italic' }}>
                                                            Triggered {new Date(alert.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {resolvedAlerts.length > 0 && (
                                    <div className="pt-4 border-t border-white/5">
                                        <button 
                                            onClick={() => setShowResolved(!showResolved)} 
                                            className="w-full flex justify-between items-center bg-white/5 hover:bg-white/10 transition-colors border border-white/5 rounded-xl px-4 py-3 text-[10px] font-black uppercase text-white/50 tracking-widest"
                                        >
                                            <span>View Resolved ({resolvedAlerts.length})</span>
                                            {showResolved ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </button>
                                        
                                        {showResolved && (
                                            <div className="mt-3 space-y-3">
                                                {resolvedAlerts.map(alert => (
                                                    <div key={alert.id} className="p-4 rounded-[20px] bg-white/5 border border-white/5 flex items-start gap-3 opacity-60">
                                                        <div className="mt-1 shrink-0" style={{ color: C.muted }}><CheckCircle size={16} /></div>
                                                        <div>
                                                            <div style={{ fontSize: 9, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }} className="bg-black/20 inline-block px-2 py-0.5 rounded-md">
                                                                {alert.type.replace(/_/g, ' ')}
                                                            </div>
                                                            <div style={{ fontSize: 12, fontWeight: 500, color: C.dim, lineHeight: 1.4 }}>{alert.message}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
