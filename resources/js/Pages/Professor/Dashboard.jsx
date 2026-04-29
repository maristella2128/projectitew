import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, 
    Layers, 
    Calendar, 
    Clock, 
    BookOpen,
    CheckCircle2,
    ChevronRight,
    TrendingUp
} from 'lucide-react';

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700;9..40,900&family=Instrument+Serif:ital@0;1&family=Space+Mono:wght@400;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.pd-root {
    background: #0a0704;
    min-height: 100%;
    color: #fef3ec;
    font-family: 'DM Sans', system-ui, sans-serif;
    position: relative;
}
.pd-grid-tex {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(249,115,22,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.06) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none; z-index: 0;
}
.pd-body { position: relative; z-index: 1; padding: 32px 32px 80px; max-width: 1400px; margin: 0 auto; width: 100%; }

.pd-header { margin-bottom: 32px; animation: fadeUp .3s ease both; }
.pd-title { font-family: 'Instrument Serif', serif; font-size: 36px; font-style: italic; color: #fef3ec; line-height: 1.1; }
.pd-title span { color: #f97316; }
.pd-sub { font-size: 13px; color: rgba(254,243,236,0.5); margin-top: 6px; }

.pd-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; animation: fadeUp .4s ease both; }
.pd-stat-card {
    background: linear-gradient(145deg, rgba(26,16,8,0.9), rgba(12,8,5,0.9));
    border: 1px solid rgba(249,115,22,0.12);
    border-radius: 16px; padding: 24px;
    position: relative; overflow: hidden;
    transition: all .2s;
}
.pd-stat-card:hover { border-color: rgba(249,115,22,0.3); transform: translateY(-2px); }
.pd-stat-val { font-family: 'Space Mono', monospace; font-size: 32px; font-weight: 700; color: #f97316; line-height: 1; margin-bottom: 8px; }
.pd-stat-lbl { font-size: 11px; font-weight: 800; color: rgba(254,243,236,0.4); text-transform: uppercase; letter-spacing: .1em; }
.pd-stat-icon { position: absolute; right: 20px; top: 24px; color: rgba(249,115,22,0.2); }

.pd-main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; animation: fadeUp .5s ease both; }

.pd-panel {
    background: #120c06; border: 1px solid rgba(249,115,22,0.1);
    border-radius: 20px; overflow: hidden; display: flex; flexDirection: column;
}
.pd-panel-header {
    padding: 20px 24px; border-bottom: 1px solid rgba(249,115,22,0.08);
    display: flex; align-items: center; justify-content: space-between;
}
.pd-panel-title { font-family: 'Instrument Serif', serif; font-size: 20px; font-style: italic; color: #fef3ec; }
.pd-panel-link { fontSize: 11px; fontWeight: 700; color: #f97316; text-decoration: none; text-transform: uppercase; letter-spacing: .05em; display: flex; alignItems: center; gap: 4px; }
.pd-panel-link:hover { opacity: .8; }

.pd-schedule-item {
    display: flex; gap: 16px; padding: 16px 24px; border-bottom: 1px solid rgba(249,115,22,0.05);
    transition: background .15s;
}
.pd-schedule-item:hover { background: rgba(249,115,22,0.03); }
.pd-schedule-item:last-child { border-bottom: none; }
.pd-schedule-time { width: 80px; flex-shrink: 0; }
.pd-schedule-time-main { font-family: 'Space Mono', monospace; font-size: 14px; font-weight: 700; color: #f97316; }
.pd-schedule-time-sub { font-size: 10px; color: rgba(254,243,236,0.3); marginTop: 4px; }
.pd-schedule-details { flex: 1; }
.pd-schedule-subject { font-size: 14px; font-weight: 700; color: #fef3ec; margin-bottom: 4px; }
.pd-schedule-meta { font-size: 11px; color: rgba(254,243,236,0.5); display: flex; gap: 12px; }

.pd-attendance-item {
    padding: 16px 24px; border-bottom: 1px solid rgba(249,115,22,0.05);
    display: flex; alignItems: center; justifyContent: space-between;
}
.pd-attendance-item:last-child { border-bottom: none; }
.pd-attendance-title { font-size: 13px; font-weight: 600; color: #fef3ec; }
.pd-attendance-subtitle { font-size: 11px; color: rgba(254,243,236,0.4); marginTop: 4px; }
.pd-attendance-status {
    padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em;
}
.pd-status-pending { background: rgba(249,115,22,0.1); color: #fb923c; border: 1px solid rgba(249,115,22,0.2); }
.pd-status-done { background: rgba(52,211,153,0.1); color: #34d399; border: 1px solid rgba(52,211,153,0.2); }

@keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
`;

export default function ProfessorDashboard({ user, stats, schedules, advisorySections }) {
    // Determine today's schedule
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayStr = daysOfWeek[new Date().getDay()];
    
    // Simple filter for demo: any schedule with 'day' or 'lec_day' or 'lab_day' matching today
    const todaysClasses = schedules.filter(s => 
        s.day === todayStr || s.lec_day === todayStr || s.lab_day === todayStr
    ).sort((a, b) => {
        const timeA = a.start_time || a.lec_start_time || "00:00:00";
        const timeB = b.start_time || b.lec_start_time || "00:00:00";
        return timeA.localeCompare(timeB);
    });

    const formatTime = (time24) => {
        if (!time24) return '';
        const [h, m] = time24.split(':');
        let hours = parseInt(h);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${m} ${ampm}`;
    };

    return (
        <AppLayout noPadding={true}>
            <Head title="Professor Dashboard" />
            <style>{css}</style>
            
            <div className="pd-root">
                <div className="pd-grid-tex" />
                
                <div className="pd-body">
                    {/* Header */}
                    <div className="pd-header">
                        <div className="pd-title">Welcome back, <span>Prof. {user.name.split(' ')[0]}</span></div>
                        <div className="pd-sub">Here is your academic overview for the current semester.</div>
                    </div>

                    {/* Stats */}
                    <div className="pd-stats-grid">
                        <div className="pd-stat-card">
                            <Users className="pd-stat-icon" size={48} />
                            <div className="pd-stat-val">{stats.totalStudents || 0}</div>
                            <div className="pd-stat-lbl">Total Students</div>
                        </div>
                        <div className="pd-stat-card">
                            <Layers className="pd-stat-icon" size={48} />
                            <div className="pd-stat-val">{stats.totalSections || 0}</div>
                            <div className="pd-stat-lbl">Sections Handled</div>
                        </div>
                        <div className="pd-stat-card">
                            <BookOpen className="pd-stat-icon" size={48} />
                            <div className="pd-stat-val">{stats.totalClasses || 0}</div>
                            <div className="pd-stat-lbl">Class Schedules</div>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="pd-main-grid">
                        
                        {/* Upcoming Schedule */}
                        <div className="pd-panel">
                            <div className="pd-panel-header">
                                <div className="pd-panel-title">Today's Schedule</div>
                                <Link href={route('schedules.index')} className="pd-panel-link">
                                    Full Schedule <ChevronRight size={14} />
                                </Link>
                            </div>
                            
                            <div style={{ flex: 1 }}>
                                {todaysClasses.length > 0 ? todaysClasses.map((cls, idx) => {
                                    const isLec = cls.lec_day === todayStr;
                                    const isLab = cls.lab_day === todayStr;
                                    const start = isLec ? cls.lec_start_time : (isLab ? cls.lab_start_time : cls.start_time);
                                    const end = isLec ? cls.lec_end_time : (isLab ? cls.lab_end_time : cls.end_time);
                                    const room = isLec ? cls.lec_room : (isLab ? cls.lab_room : cls.room);
                                    const type = isLec ? 'Lecture' : (isLab ? 'Laboratory' : 'Class');

                                    return (
                                        <div key={cls.id || idx} className="pd-schedule-item">
                                            <div className="pd-schedule-time">
                                                <div className="pd-schedule-time-main">{formatTime(start)}</div>
                                                <div className="pd-schedule-time-sub">to {formatTime(end)}</div>
                                            </div>
                                            <div className="pd-schedule-details">
                                                <div className="pd-schedule-subject">{cls.course_code} - {cls.subject}</div>
                                                <div className="pd-schedule-meta">
                                                    <span style={{ color: '#f97316' }}>{cls.section?.name || 'N/A'}</span>
                                                    <span>•</span>
                                                    <span>{room || 'TBA'}</span>
                                                    <span>•</span>
                                                    <span>{type}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div style={{ padding: '48px 24px', textAlign: 'center', color: 'rgba(254,243,236,0.3)' }}>
                                        <Calendar size={32} style={{ opacity: 0.5, marginBottom: 16 }} />
                                        <div style={{ fontSize: 16, fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: '#fef3ec' }}>No classes scheduled for today.</div>
                                        <div style={{ fontSize: 12, marginTop: 4 }}>Enjoy your free time or use it for preparation!</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Side Panel */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            
                            {/* Attendance Action Required */}
                            <div className="pd-panel">
                                <div className="pd-panel-header">
                                    <div className="pd-panel-title">Recent Attendance</div>
                                </div>
                                <div>
                                    {/* Mocked Attendance Data */}
                                    <div className="pd-attendance-item">
                                        <div>
                                            <div className="pd-attendance-title">ITP104 - BSIT 2A</div>
                                            <div className="pd-attendance-subtitle">Yesterday, 1:00 PM</div>
                                        </div>
                                        <div className="pd-attendance-status pd-status-done">
                                            Recorded
                                        </div>
                                    </div>
                                    <div className="pd-attendance-item">
                                        <div>
                                            <div className="pd-attendance-title">CC105 - BSCS 1B</div>
                                            <div className="pd-attendance-subtitle">Today, 9:00 AM</div>
                                        </div>
                                        <div className="pd-attendance-status pd-status-pending">
                                            Pending
                                        </div>
                                    </div>
                                    <div style={{ padding: '16px 24px' }}>
                                        <Link href="/attendance/mark" style={{ display: 'block', textAlign: 'center', padding: '10px', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: '12px', color: '#f97316', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', textDecoration: 'none', letterSpacing: '.05em' }}>
                                            Go to Attendance
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Advisory Sections */}
                            {advisorySections.length > 0 && (
                                <div className="pd-panel">
                                    <div className="pd-panel-header">
                                        <div className="pd-panel-title">Advisory Sections</div>
                                    </div>
                                    <div>
                                        {advisorySections.map(sec => (
                                            <div key={sec.id} className="pd-attendance-item">
                                                <div>
                                                    <div className="pd-attendance-title">{sec.name}</div>
                                                    <div className="pd-attendance-subtitle">{sec.students_count} Students</div>
                                                </div>
                                                <Link href={route('sections.show', sec.id)} style={{ color: 'rgba(249,115,22,0.6)' }}>
                                                    <ChevronRight size={18} />
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
