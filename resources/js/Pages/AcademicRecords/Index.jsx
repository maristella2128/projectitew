import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    GraduationCap, Calendar, Activity, 
    Award, ShieldCheck, TrendingUp,
    Users, AlertCircle, Bookmark, Star,
    HeartPulse, Zap, ChevronRight, BarChart3,
    Trophy, MousePointer2
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   STYLES (Academic Mission Control Theme)
───────────────────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,900&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');

.ar-root {
  background: #0c0805;
  min-height: 100%;
  flex: 1; display: flex; flex-direction: column;
  font-family: 'DM Sans', system-ui, sans-serif;
  color: #fef3ec;
  padding: 28px 32px 56px;
  position: relative;
  overflow: hidden;
}

.ar-grid {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    linear-gradient(rgba(249,115,22,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(249,115,22,0.02) 1px, transparent 1px);
  background-size: 64px 64px;
}

.ar-orb {
  position: absolute; border-radius: 50%; pointer-events: none; z-index: 0;
  filter: blur(120px);
}
.ar-orb-1 { top: -10%; right: -10%; width: 500px; height: 500px; background: rgba(249,115,22,0.08); }
.ar-orb-2 { bottom: -10%; left: -10%; width: 400px; height: 400px; background: rgba(249,115,22,0.05); }

.ar-container { position: relative; z-index: 1; max-width: 1300px; margin: 0 auto; width: 100%; }

/* Typography */
.ar-h1 {
  font-family: 'Playfair Display', serif;
  font-size: 42px; font-weight: 900; color: #fef3ec;
  line-height: 1.0; letter-spacing: -.03em;
}
.ar-h1 em { color: #f97316; font-style: italic; display: block; }
.ar-label {
  font-family: 'Space Mono', monospace;
  font-size: 9px; font-weight: 700; text-transform: uppercase;
  letter-spacing: .2em; color: #f97316; margin-bottom: 8px; display: block;
}

/* Widgets */
.ar-card {
  background: rgba(22, 14, 8, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(249, 115, 22, 0.1);
  border-radius: 24px;
  padding: 32px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.ar-card:hover { border-color: rgba(249, 115, 22, 0.25); transform: translateY(-4px); }

.ar-stat-val {
  font-family: 'Playfair Display', serif;
  font-size: 48px; font-weight: 900; line-height: 1;
}

.ar-progress-bg { background: rgba(255,255,255,0.03); height: 6px; border-radius: 3px; overflow: hidden; }
.ar-progress-fill { height: 100%; background: linear-gradient(90deg, #f97316, #fb923c); transition: width 1s ease; }

.ar-list-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px; background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.03); border-radius: 16px;
  margin-bottom: 12px; transition: all .2s;
}
.ar-list-item:hover { background: rgba(255,255,255,0.04); }

.ar-badge {
  padding: 4px 10px; border-radius: 8px; font-size: 9px; font-weight: 900;
  text-transform: uppercase; letter-spacing: 0.1em;
}
`;

export default function AcademicRecordsOverview({ student, metrics, stats, topStudents, role }) {
    const isStudent = role === 'student_view';

    return (
        <AppLayout title="Academic Records · Overview" noPadding>
            <Head title="Academic Overview" />
            <style>{css}</style>

            <div className="ar-root">
                <div className="ar-grid" />
                <div className="ar-orb ar-orb-1" />
                <div className="ar-orb ar-orb-2" />

                <div className="ar-container">
                    {/* Hero Header */}
                    <header className="mb-12 flex justify-between items-end">
                        <div className="animate-in slide-in-from-left duration-700">
                            <span className="ar-label">Registry Module — Signal 001</span>
                            <h1 className="ar-h1">
                                {isStudent ? (
                                    <>Academic <em>Performance</em></>
                                ) : (
                                    <>Institutional <em>Standing</em></>
                                )}
                            </h1>
                        </div>
                        <div className="text-right pb-1">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                <Zap size={12} className="text-orange-500" /> System Time: {new Date().toLocaleTimeString()}
                            </div>
                        </div>
                    </header>

                    {isStudent ? (
                        <div className="grid grid-cols-12 gap-8">
                            {/* Primary Stats Column */}
                            <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="ar-card">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                                                <GraduationCap size={24} className="text-orange-500" />
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-black">
                                                    <TrendingUp size={10} /> +1.2
                                                </div>
                                                <div className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">Academic GWA</div>
                                            </div>
                                        </div>
                                        <div className="ar-stat-val text-orange-500 mb-2">{metrics.gwa.toFixed(2)}</div>
                                        <div className="text-xs font-medium text-white/40">Computed Institution Average</div>
                                    </div>

                                    <div className="ar-card">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                                <Activity size={24} className="text-emerald-500" />
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">Attendance Rate</div>
                                            </div>
                                        </div>
                                        <div className="ar-stat-val text-emerald-500 mb-4">{metrics.attendanceRate}%</div>
                                        <div className="ar-progress-bg">
                                            <div className="ar-progress-fill bg-emerald-500" style={{ width: `${metrics.attendanceRate}%` }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Summary Table/List */}
                                <div className="ar-card flex-1">
                                    <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                                        <div className="flex items-center gap-3">
                                            <Bookmark size={20} className="text-orange-500" />
                                            <h3 className="font-serif text-xl font-bold italic">Academic Components</h3>
                                        </div>
                                        <button className="text-[10px] font-black uppercase text-orange-500 tracking-widest hover:underline flex items-center gap-1">
                                            View Profile <ChevronRight size={12} />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Behavior */}
                                        <div className="ar-list-item">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-orange-500/5 flex items-center justify-center border border-white/5">
                                                    <ShieldCheck size={18} className="text-orange-500" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold">Behavioral Integrity Index</div>
                                                    <div className="text-[10px] text-white/30 font-medium">Merits vs Demerits (Institutional Record)</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-lg font-black font-mono ${metrics.behaviorIndex >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                    {metrics.behaviorIndex > 0 ? '+' : ''}{metrics.behaviorIndex}
                                                </div>
                                                <div className="text-[9px] uppercase font-black text-white/10">points</div>
                                            </div>
                                        </div>

                                        {/* Health */}
                                        <div className="ar-list-item">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-red-500/5 flex items-center justify-center border border-white/5">
                                                    <HeartPulse size={18} className="text-red-500" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold">Latest Medical Signal</div>
                                                    <div className="text-[10px] text-white/30 font-medium">{metrics.latestHealth?.checkup_type || 'No recent checkup'}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="ar-badge bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">{metrics.latestHealth ? 'CLEARED' : 'PENDING'}</div>
                                            </div>
                                        </div>

                                        {/* Skills/Activities */}
                                        <div className="ar-list-item">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-500/5 flex items-center justify-center border border-white/5">
                                                    <MousePointer2 size={18} className="text-indigo-400" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold">Specialization Tracks</div>
                                                    <div className="text-[10px] text-white/30 font-medium">Extracurricular & Skill Tags</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {student.skills?.slice(0,2).map((s, i) => (
                                                    <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-white/40">{s}</span>
                                                ))}
                                                {student.skills?.length > 2 && <span className="text-[9px] font-bold text-white/20">+{student.skills.length - 2} more</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Column (Achievements & Context) */}
                            <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
                                <div className="ar-card bg-gradient-to-br from-orange-500/10 to-transparent">
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="font-serif text-lg font-bold italic">Honors Cluster</h3>
                                        <Trophy size={20} className="text-orange-500" />
                                    </div>
                                    <div className="space-y-6">
                                        {metrics.recentAchievements.length > 0 ? metrics.recentAchievements.map((award, i) => (
                                            <div key={i} className="relative pl-6 border-l border-orange-500/20 py-1">
                                                <div className="absolute top-0 left-0 w-2 h-2 bg-orange-500 rounded-full -translate-x-[4.5px]" />
                                                <div className="text-[9px] font-black uppercase text-orange-500/50 mb-1">{award.date_awarded}</div>
                                                <div className="text-xs font-black text-white/90 leading-tight">{award.title}</div>
                                                <div className="text-[10px] text-white/30 mt-1">{award.category}</div>
                                            </div>
                                        )) : (
                                            <div className="py-12 text-center">
                                                <div className="text-white/5 italic text-sm">Merit records pending...</div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                                        <div className="text-3xl font-black font-serif italic text-white/10">{metrics.achievementsCount}</div>
                                        <div className="text-[9px] font-black text-white/20 uppercase tracking-widest">Total Accolades</div>
                                    </div>
                                </div>

                                <div className="ar-card p-6 border-emerald-500/20 bg-emerald-500/[0.02] flex items-center gap-4">
                                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                                        <BarChart3 size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Academic Health</div>
                                        <div className="text-xs text-white/40 leading-relaxed font-medium">Your profile is currently within the top 15% of your section.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* DEAN VIEW */
                        <div className="grid grid-cols-12 gap-8">
                            <div className="col-span-12 grid grid-cols-4 gap-8 mb-8">
                                {[
                                    { label: 'College GWA', val: stats.avgInstitutionGwa, icon: GraduationCap, color: '#f97316' },
                                    { label: 'Campus Presence', val: stats.overallAttendance + '%', icon: Activity, color: '#10b981' },
                                    { label: 'Honors Distributed', val: stats.totalAchievements, icon: Trophy, color: '#f59e0b' },
                                    { label: 'At-Risk Signals', val: stats.atRiskCount, icon: AlertCircle, color: '#ef4444' }
                                ].map((s, i) => (
                                    <div key={i} className="ar-card p-8">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 rounded-lg" style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                                                <s.icon size={18} style={{ color: s.color }} />
                                            </div>
                                        </div>
                                        <div className="ar-stat-val" style={{ color: s.color }}>{s.val}</div>
                                        <div className="text-[9px] font-black uppercase text-white/20 tracking-wider mt-2">{s.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="col-span-8 flex flex-col gap-8">
                                <div className="ar-card">
                                    <h3 className="font-serif text-xl font-bold italic mb-8 flex items-center gap-3">
                                        <Star size={20} className="text-orange-500" /> Top Academic Performers
                                    </h3>
                                    <div className="space-y-4">
                                        {topStudents.map((s, i) => (
                                            <Link 
                                                key={s.id} 
                                                href={`/academic-records?student_id=${s.id}`}
                                                className="ar-list-item hover:border-orange-500/30 group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center font-mono font-bold text-orange-500 border border-orange-500/20">
                                                        {i + 1}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold group-hover:text-orange-500 transition-colors">{s.first_name} {s.last_name}</div>
                                                        <div className="text-[10px] text-white/20 uppercase tracking-widest">{s.student_id}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-serif font-black italic text-orange-400">{s.gwa.toFixed(2)}</div>
                                                    <div className="text-[9px] text-white/10 font-black uppercase">GWA Rank</div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-4">
                                <div className="ar-card p-8 bg-gradient-to-br from-red-500/5 to-transparent border-red-500/20">
                                    <h3 className="font-serif text-lg font-bold italic text-red-500 mb-6 flex items-center gap-3">
                                        <AlertCircle size={18} /> High Priority Alerts
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                            <div className="text-[10px] font-black text-red-500 uppercase mb-1">Academic Risk</div>
                                            <div className="text-[11px] text-white/60 leading-relaxed">{stats.atRiskCount} students are currently under the 75% threshold. Intervention recommended.</div>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                            <div className="text-[10px] font-black text-amber-500 uppercase mb-1">Attendance Trend</div>
                                            <div className="text-[11px] text-white/60 leading-relaxed">Overall attendance has dropped by 2.4% during the midterm examination period.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
