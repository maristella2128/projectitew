import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { 
    ArrowLeft, ArrowRight, Edit, Users, User, 
    Calendar, GraduationCap, Mail,
    MoreVertical, Search, Filter,
    CheckCircle, XCircle
} from 'lucide-react';

export default function SectionShow({ section }) {
    return (
        <AppLayout title={`Section: ${section.name}`} noPadding>
            {/* Ambient Background matching Index */}
            <div className="relative min-h-full p-8 lg:p-12" style={{ backgroundColor: '#0c0805', color: '#fef3ec', fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
                    backgroundImage: 'linear-gradient(rgba(249,115,22,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.022) 1px, transparent 1px)',
                    backgroundSize: '48px 48px'
                }}></div>
                <div style={{
                    position: 'absolute', top: '-8%', right: '-4%', width: 500, height: 500, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(249,115,22,0.055) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0
                }}></div>

                <div className="relative z-10 space-y-8 max-w-7xl mx-auto">
                    {/* ── HEADER ── */}
                    <div className="flex items-center justify-between">
                        <div>
                            <Link href={route('sections.index')} className="text-[#f97316]/60 hover:text-[#f97316] transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-3">
                                <ArrowLeft size={14} /> Back to Sections
                            </Link>
                            <h1 className="text-4xl font-serif font-black italic text-[#fef3ec] leading-none tracking-tight">
                                {section.name}
                            </h1>
                            <p className="text-[#fef3ec]/40 text-xs font-mono uppercase tracking-widest mt-3">
                                {section.grade_level} • School Year {section.school_year}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link 
                                href={route('sections.edit', section.id)}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-lg"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(0,0,0,0.4))',
                                    border: '1px solid rgba(249,115,22,0.3)',
                                    color: '#fb923c', textTransform: 'uppercase', letterSpacing: '0.05em'
                                }}
                            >
                                <Edit size={14} /> Modify Section
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                        {/* ── ADVISER CARD ── */}
                        <div className="xl:col-span-1 space-y-6">
                            <div className="p-8 rounded-2xl relative overflow-hidden group shadow-2xl"
                                 style={{ background: 'linear-gradient(145deg, #ea580c, #9a3412)' }}>
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-all"></div>
                                
                                <div className="relative z-10 text-center">
                                    <div className="w-20 h-20 rounded-2xl bg-black/20 p-1 mx-auto mb-5 rotate-3 backdrop-blur-sm border border-white/10">
                                        <div className="w-full h-full rounded-xl bg-orange-100 flex items-center justify-center text-orange-900 font-serif font-bold text-3xl shadow-inner">
                                            {section.adviser?.name?.[0] || '?'}
                                        </div>
                                    </div>
                                    <h3 className="font-serif text-xl font-bold text-white italic">{section.adviser?.name || 'TBA'}</h3>
                                    <p className="text-[10px] text-orange-200/70 uppercase tracking-[0.2em] mt-1 pb-4 border-b border-orange-300/20">Faculty Adviser</p>
                                    
                                    <div className="mt-5 space-y-3 text-left">
                                        <div className="flex items-center gap-3 text-xs text-orange-100/80">
                                            <Mail size={14} className="text-orange-300 opacity-80" /> {section.adviser?.email || 'N/A'}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-orange-100/80">
                                            <Calendar size={14} className="text-orange-300 opacity-80" /> Appointed 2025
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl" style={{ background: '#160e08', border: '1px solid #2a1508' }}>
                                <h4 className="text-[10px] text-orange-500/50 uppercase tracking-[0.15em] font-bold mb-5">Class Distribution</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold text-[#fef3ec]">Active Students</span>
                                        <span className="text-3xl font-serif font-black" style={{ color: '#fb923c' }}>{section.students.length}</span>
                                    </div>
                                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(249,115,22,0.1)' }}>
                                        <div className="h-full rounded-full" style={{ width: '85%', background: 'linear-gradient(90deg, #ea580c, #fb923c)' }}></div>
                                    </div>
                                    <p className="text-[10px] text-[#fef3ec]/30 italic">85% Capacity filled</p>
                                </div>
                            </div>
                        </div>

                        {/* ── STUDENTS ROSTER ── */}
                        <div className="xl:col-span-3">
                            <div className="rounded-2xl overflow-hidden flex flex-col h-full" style={{ background: '#160e08', border: '1px solid #2a1508' }}>
                                <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(249,115,22,0.1)' }}>
                                    <h3 className="font-serif text-xl font-bold flex items-center gap-3 italic text-[#fef3ec]">
                                        <Users size={20} color="#fb923c" /> Official Roster
                                    </h3>
                                    <div className="flex gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500/40" size={14} />
                                            <input 
                                                type="text" 
                                                placeholder="Filter roster..." 
                                                className="border-none rounded-lg pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none w-64 transition-all"
                                                style={{ background: 'rgba(0,0,0,0.3)', color: '#fef3ec' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-x-auto flex-1">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-[10px] uppercase tracking-widest font-bold" style={{ background: 'rgba(0,0,0,0.2)', color: 'rgba(254,243,236,0.4)', borderBottom: '1px solid rgba(249,115,22,0.1)' }}>
                                                <th className="px-6 py-4 font-mono">Student</th>
                                                <th className="px-6 py-4 font-mono">LRN / ID</th>
                                                <th className="px-6 py-4 text-center font-mono">GPA</th>
                                                <th className="px-6 py-4 font-mono">Status</th>
                                                <th className="px-6 py-4 text-right font-mono">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ divideY: '1px solid rgba(255,255,255,0.03)' }}>
                                            {section.students.map((student) => (
                                                <tr key={student.id} className="transition-colors group" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs"
                                                                 style={{ background: 'rgba(249,115,22,0.1)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.2)' }}>
                                                                {student.first_name?.[0] || '?'}{student.last_name?.[0] || '?'}
                                                            </div>
                                                            <span className="text-sm font-bold text-[#fef3ec]">{student.first_name} {student.last_name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-mono text-xs text-[#fef3ec]/40">{student.student_id || student.lrn}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="font-mono font-bold text-sm" style={{ color: '#fb923c' }}>88.5</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest"
                                                              style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>
                                                            Active
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Link href={route('students.show', student.id)} 
                                                              className="inline-flex p-2 rounded-lg transition-colors"
                                                              style={{ color: 'rgba(249,115,22,0.6)' }}
                                                              onMouseOver={e => { e.currentTarget.style.color = '#fb923c'; e.currentTarget.style.background = 'rgba(249,115,22,0.1)'; }}
                                                              onMouseOut={e => { e.currentTarget.style.color = 'rgba(249,115,22,0.6)'; e.currentTarget.style.background = 'transparent'; }}>
                                                            <ArrowRight size={16} />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                            {section.students.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-16 text-center">
                                                        <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4" 
                                                             style={{ background: 'rgba(249,115,22,0.05)', border: '1px dashed rgba(249,115,22,0.2)' }}>
                                                            <Users size={24} color="rgba(249,115,22,0.4)" />
                                                        </div>
                                                        <p className="text-sm font-bold text-[#fef3ec]/60 font-serif italic mb-1">No students enrolled</p>
                                                        <p className="text-xs text-[#fef3ec]/30">Add students to this section to see them here.</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
