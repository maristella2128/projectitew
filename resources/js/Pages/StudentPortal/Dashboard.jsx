import React from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { usePage, Link } from '@inertiajs/react';
import {
    BookOpen, Calendar, FileText, Bell,
    TrendingUp, CheckCircle, Clock, Shield,
    ChevronRight, Award, User, AlertCircle,
    GraduationCap, Layers, Paperclip, Star,
    BarChart2, ClipboardList,
} from 'lucide-react';

/* ── STYLES ── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,900&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');

*,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }

.sd-root {
    background: #0c0805;
    min-height: 100%;
    font-family: 'DM Sans', system-ui, sans-serif;
    color: #fef3ec;
    position: relative;
}
.sd-grid-tex {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
        linear-gradient(rgba(249,115,22,0.018) 1px, transparent 1px),
        linear-gradient(90deg, rgba(249,115,22,0.018) 1px, transparent 1px);
    background-size: 48px 48px;
}
.sd-orb1 {
    position: fixed; top: -10%; right: -5%;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 65%);
    pointer-events: none; z-index: 0;
}
.sd-content { position: relative; z-index: 1; }

/* ── WELCOME BANNER ── */
.sd-welcome {
    background: linear-gradient(135deg, #160e08, #1c1208);
    border: 1px solid #2a1508;
    border-radius: 20px;
    padding: 28px 32px;
    margin-bottom: 24px;
    position: relative;
    overflow: hidden;
}
.sd-welcome::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #f97316, #c2410c, transparent);
}
.sd-welcome::after {
    content: '';
    position: absolute; top: -60px; right: -60px;
    width: 200px; height: 200px; border-radius: 50%;
    background: rgba(249,115,22,0.05);
}
.sd-welcome-name {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 900;
    color: #fef3ec; line-height: 1;
    margin-bottom: 6px;
}
.sd-welcome-name em { color: #f97316; font-style: italic; }
.sd-welcome-meta {
    display: flex; align-items: center; gap: 16px;
    flex-wrap: wrap; margin-top: 10px;
}
.sd-meta-chip {
    display: flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 700;
    color: rgba(254,243,236,0.45);
    text-transform: uppercase; letter-spacing: .08em;
}
.sd-live-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #34d399;
    box-shadow: 0 0 8px rgba(52,211,153,0.6);
    animation: sd-pulse 2s infinite;
}
@keyframes sd-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: .6; transform: scale(0.85); }
}

/* ── STAT CARDS ── */
.sd-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 24px;
}
.sd-stat {
    background: #160e08;
    border: 1px solid #2a1508;
    border-radius: 0 16px 16px 16px;
    padding: 20px;
    position: relative;
    transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
    margin-top: 12px;
}
.sd-stat::after {
    content: '';
    position: absolute; top: -12px; left: -1px;
    width: 60px; height: 12px;
    background: #160e08;
    border: 1px solid #2a1508;
    border-bottom: none;
    border-radius: 6px 6px 0 0;
}
.sd-stat::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    border-radius: 0 16px 0 0;
}
.sd-stat:hover {
    border-color: rgba(249,115,22,0.35);
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.5);
}
.sd-stat-icon {
    width: 32px; height: 32px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 12px;
}
.sd-stat-val {
    font-family: 'Space Mono', monospace;
    font-size: 26px; font-weight: 700;
    color: #fef3ec; line-height: 1;
    margin-bottom: 4px;
}
.sd-stat-lbl {
    font-size: 9px; font-weight: 700;
    color: rgba(254,243,236,0.4);
    text-transform: uppercase; letter-spacing: .1em;
}
.sd-stat-bar {
    height: 2px; background: rgba(255,255,255,0.05);
    border-radius: 1px; margin-top: 14px; overflow: hidden;
}
.sd-stat-bar-fill {
    height: 100%; border-radius: 1px;
    transition: width .8s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ── SECTION HEADER ── */
.sd-section-hdr {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 14px;
}
.sd-section-title {
    font-size: 9px; font-weight: 800;
    color: rgba(249,115,22,0.5);
    text-transform: uppercase; letter-spacing: .18em;
}
.sd-section-line {
    flex: 1; height: 1px;
    background: linear-gradient(90deg, rgba(249,115,22,0.15), transparent);
}

/* ── SCHEDULE CARD ── */
.sd-schedule-card {
    background: #160e08;
    border: 1px solid #2a1508;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 24px;
}
.sd-schedule-hdr {
    padding: 16px 20px;
    border-bottom: 1px solid #2a1508;
    background: rgba(249,115,22,0.03);
    display: flex; align-items: center; justify-content: space-between;
}
.sd-schedule-title {
    font-family: 'Playfair Display', serif;
    font-size: 14px; font-weight: 700; font-style: italic;
    color: #fef3ec;
}
.sd-schedule-item {
    display: flex; align-items: center;
    padding: 14px 20px;
    border-bottom: 1px solid rgba(249,115,22,0.05);
    transition: background .15s;
    gap: 16px;
}
.sd-schedule-item:last-child { border-bottom: none; }
.sd-schedule-item:hover { background: rgba(249,115,22,0.03); }
.sd-time-badge {
    font-family: 'Space Mono', monospace;
    font-size: 10px; font-weight: 700;
    color: #f97316;
    background: rgba(249,115,22,0.1);
    border: 1px solid rgba(249,115,22,0.2);
    padding: 4px 10px; border-radius: 6px;
    white-space: nowrap; flex-shrink: 0;
}
.sd-subject-name {
    font-weight: 700; font-size: 13px; color: #fef3ec;
}
.sd-subject-room {
    font-size: 10px; color: rgba(254,243,236,0.35);
    margin-top: 2px;
}

/* ── TWO COLUMN GRID ── */
.sd-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
}

/* ── MINI CARD ── */
.sd-mini-card {
    background: #160e08;
    border: 1px solid #2a1508;
    border-radius: 16px;
    overflow: hidden;
}
.sd-mini-hdr {
    padding: 14px 18px;
    border-bottom: 1px solid #2a1508;
    display: flex; align-items: center; justify-content: space-between;
}
.sd-mini-title {
    font-family: 'Playfair Display', serif;
    font-size: 13px; font-weight: 700; font-style: italic;
    color: #fef3ec;
}
.sd-mini-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 18px;
    border-bottom: 1px solid rgba(249,115,22,0.05);
    transition: background .15s; cursor: pointer;
}
.sd-mini-item:last-child { border-bottom: none; }
.sd-mini-item:hover { background: rgba(249,115,22,0.03); }
.sd-mini-icon {
    width: 32px; height: 32px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.sd-mini-name {
    font-size: 12px; font-weight: 600; color: #fef3ec;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.sd-mini-sub {
    font-size: 9px; color: rgba(254,243,236,0.35);
    margin-top: 2px; text-transform: uppercase; letter-spacing: .06em;
    font-weight: 700;
}

/* ── QUICK LINKS ── */
.sd-quick-links {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 24px;
}
.sd-quick-link {
    background: #160e08;
    border: 1px solid #2a1508;
    border-radius: 14px;
    padding: 20px 16px;
    display: flex; flex-direction: column;
    align-items: center; gap: 10px;
    cursor: pointer; text-decoration: none;
    transition: all .25s cubic-bezier(0.4, 0, 0.2, 1);
    text-align: center;
}
.sd-quick-link:hover {
    border-color: rgba(249,115,22,0.35);
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(0,0,0,0.4);
    background: #1c1208;
}
.sd-quick-link-icon {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    transition: transform .2s;
}
.sd-quick-link:hover .sd-quick-link-icon { transform: scale(1.1); }
.sd-quick-link-label {
    font-size: 11px; font-weight: 700;
    color: rgba(254,243,236,0.5);
    text-transform: uppercase; letter-spacing: .08em;
    transition: color .2s;
}
.sd-quick-link:hover .sd-quick-link-label { color: #fef3ec; }

/* ── ANNOUNCEMENT ITEM ── */
.sd-announce-item {
    padding: 14px 18px;
    border-bottom: 1px solid rgba(249,115,22,0.05);
    cursor: pointer; transition: background .15s;
}
.sd-announce-item:last-child { border-bottom: none; }
.sd-announce-item:hover { background: rgba(249,115,22,0.03); }
.sd-announce-title {
    font-size: 12px; font-weight: 700; color: #fef3ec;
    margin-bottom: 4px; line-height: 1.3;
}
.sd-announce-date {
    font-size: 9px; font-weight: 700;
    color: rgba(254,243,236,0.3);
    text-transform: uppercase; letter-spacing: .08em;
}
.sd-announce-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #f97316; flex-shrink: 0; margin-top: 3px;
}

/* ── EMPTY STATE ── */
.sd-empty {
    padding: 32px; text-align: center;
}
.sd-empty-title {
    font-family: 'Playfair Display', serif;
    font-size: 14px; font-weight: 700; font-style: italic;
    color: rgba(254,243,236,0.2);
}

/* ── ANIMATIONS ── */
@keyframes sd-up {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: none; }
}
.sd-fade   { animation: sd-up .36s ease both; }
.sd-fade-1 { animation: sd-up .36s .05s ease both; }
.sd-fade-2 { animation: sd-up .36s .10s ease both; }
.sd-fade-3 { animation: sd-up .36s .15s ease both; }
.sd-fade-4 { animation: sd-up .36s .20s ease both; }
.sd-fade-5 { animation: sd-up .36s .25s ease both; }
`;

/* ── GWA COLOR HELPER ── */
const gwaColor = (gwa) => {
    if (!gwa) return 'rgba(254,243,236,0.3)';
    const g = parseFloat(gwa);
    if (g <= 1.5) return '#34d399';
    if (g <= 2.0) return '#fb923c';
    if (g <= 3.0) return '#fbbf24';
    return '#f87171';
};

/* ── MAIN COMPONENT ── */
export default function Dashboard({
    student,
    todaySchedule,
    recentDocuments,
    announcements,
    stats,
}) {
    const { auth } = usePage().props;
    const user     = auth?.user;

    const today = new Date().toLocaleDateString('en-PH', {
        weekday: 'long', year: 'numeric',
        month: 'long', day: 'numeric',
    });

    // Stat cards config
    const statCards = [
        {
            label: 'GWA',
            val:   stats?.gwa ? parseFloat(stats.gwa).toFixed(2) : '—',
            Icon:  TrendingUp,
            color: gwaColor(stats?.gwa),
            bar:   stats?.gwa ? `${Math.round((5 - parseFloat(stats.gwa)) / 4 * 100)}%` : '0%',
            sub:   stats?.gwa ? 'Current semester' : 'No grades yet',
        },
        {
            label: 'Attendance',
            val:   stats?.attendance_rate ? `${stats.attendance_rate}%` : '—',
            Icon:  CheckCircle,
            color: '#34d399',
            bar:   `${stats?.attendance_rate ?? 0}%`,
            sub:   'This semester',
        },
        {
            label: 'Units',
            val:   stats?.units_taken ?? '—',
            Icon:  BookOpen,
            color: '#fb923c',
            bar:   stats?.units_taken
                ? `${Math.round((stats.units_taken / (stats.units_required ?? 24)) * 100)}%`
                : '0%',
            sub:   `of ${stats?.units_required ?? 24} required`,
        },
        {
            label: 'Clearance',
            val:   stats?.clearance_status ?? 'Pending',
            Icon:  Shield,
            color: stats?.clearance_status === 'Cleared' ? '#34d399' : '#fbbf24',
            bar:   stats?.clearance_status === 'Cleared' ? '100%' : '40%',
            sub:   'Current status',
            small: true,
        },
    ];

    // Quick links
    const quickLinks = [
        { label: 'My Grades',    Icon: BarChart2,    color: '#f97316', href: route('student.grades.current')     },
        { label: 'Attendance',   Icon: ClipboardList, color: '#34d399', href: route('student.attendance.record')  },
        { label: 'Documents',    Icon: FileText,      color: '#fb923c', href: route('student.documents.official') },
        { label: 'My Profile',   Icon: User,          color: '#a78bfa', href: route('student.profile.personal')   },
        { label: 'Schedule',     Icon: Calendar,      color: '#38bdf8', href: route('student.schedule.timetable') },
        { label: 'Clearance',    Icon: Shield,        color: '#fbbf24', href: route('student.clearance')          },
        { label: 'Achievements', Icon: Award,         color: '#f472b6', href: '#'                                 },
        { label: 'Messages',     Icon: Bell,          color: '#4ade80', href: route('student.messages')           },
    ];

    return (
        <StudentLayout title="Dashboard">
            <style>{css}</style>
            <div className="sd-root">
                <div className="sd-grid-tex" />
                <div className="sd-orb1" />
                <div className="sd-content">

                    {/* ── WELCOME BANNER ── */}
                    <div className="sd-welcome sd-fade">
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                            <div>
                                <div style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(249,115,22,0.5)', textTransform: 'uppercase', letterSpacing: '.16em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span className="sd-live-dot" />
                                    Student Portal · Live
                                </div>
                                <div className="sd-welcome-name">
                                    Welcome back,{' '}
                                    <em>{student?.first_name ?? user?.name?.split(' ')[0] ?? 'Student'}!</em>
                                </div>
                                <div className="sd-welcome-meta">
                                    <div className="sd-meta-chip">
                                        <GraduationCap size={11} color="#f97316" />
                                        {student?.student_id ?? 'No Student No.'}
                                    </div>
                                    <div className="sd-meta-chip">
                                        <Layers size={11} color="#f97316" />
                                        {student?.section?.program?.code ?? 'No Program'}
                                    </div>
                                    <div className="sd-meta-chip">
                                        <BookOpen size={11} color="#f97316" />
                                        {student?.year_level ?? 'No Year Level'}
                                    </div>
                                    <div className="sd-meta-chip">
                                        <Clock size={11} color="#f97316" />
                                        {today}
                                    </div>
                                </div>
                            </div>

                            {/* Avatar */}
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '14px',
                                background: 'linear-gradient(135deg, rgba(249,115,22,0.3), rgba(194,65,12,0.2))',
                                border: '1px solid rgba(249,115,22,0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: "'Space Mono', monospace",
                                fontSize: '18px', fontWeight: 700, color: '#f97316',
                                flexShrink: 0, position: 'relative', zIndex: 1,
                            }}>
                                {(student?.first_name?.[0] ?? user?.name?.[0] ?? 'S').toUpperCase()}
                                {(student?.last_name?.[0] ?? '').toUpperCase()}
                            </div>
                        </div>
                    </div>

                    {/* ── STAT CARDS ── */}
                    <div className="sd-stats sd-fade-1">
                        {statCards.map((s, i) => (
                            <div key={i} className="sd-stat" style={{ '--accent': s.color }}>
                                <div className="sd-stat-icon" style={{ background: `${s.color}18`, border: `1px solid ${s.color}28` }}>
                                    <s.Icon size={15} color={s.color} />
                                </div>
                                <div className="sd-stat-val" style={{ fontSize: s.small ? '18px' : '26px', color: s.color }}>
                                    {s.val}
                                </div>
                                <div className="sd-stat-lbl">{s.label}</div>
                                <div style={{ fontSize: '9px', color: 'rgba(254,243,236,0.25)', marginTop: '3px' }}>{s.sub}</div>
                                <div className="sd-stat-bar">
                                    <div className="sd-stat-bar-fill" style={{
                                        width: s.bar,
                                        background: `linear-gradient(90deg, ${s.color}55, ${s.color})`,
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── TODAY'S SCHEDULE ── */}
                    <div className="sd-fade-2">
                        <div className="sd-section-hdr">
                            <span className="sd-section-title">Today's Schedule</span>
                            <div className="sd-section-line" />
                            <Link href={route('student.schedule.timetable')} style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(249,115,22,0.5)', textTransform: 'uppercase', letterSpacing: '.1em', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                                Full Schedule <ChevronRight size={10} />
                            </Link>
                        </div>

                        <div className="sd-schedule-card">
                            <div className="sd-schedule-hdr">
                                <div className="sd-schedule-title">
                                    {new Date().toLocaleDateString('en-PH', { weekday: 'long' })}'s Classes
                                </div>
                                <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(249,115,22,0.45)', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.15)', padding: '3px 10px', borderRadius: '6px' }}>
                                    {todaySchedule?.length ?? 0} classes
                                </span>
                            </div>

                            {todaySchedule && todaySchedule.length > 0 ? (
                                todaySchedule.map((item, i) => (
                                    <div key={i} className="sd-schedule-item">
                                        <span className="sd-time-badge">{item.time_start} – {item.time_end}</span>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div className="sd-subject-name">{item.subject_name}</div>
                                            <div className="sd-subject-room">{item.room} · {item.instructor}</div>
                                        </div>
                                        <span style={{
                                            fontSize: '9px', fontWeight: 700,
                                            padding: '3px 10px', borderRadius: '6px',
                                            background: 'rgba(52,211,153,0.1)',
                                            color: '#34d399', border: '1px solid rgba(52,211,153,0.2)',
                                        }}>
                                            {item.units} units
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="sd-empty">
                                    <div className="sd-empty-title">No classes scheduled today.</div>
                                    <div style={{ fontSize: '11px', color: 'rgba(254,243,236,0.15)', marginTop: '6px' }}>
                                        Enjoy your free day!
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── DOCUMENTS + ANNOUNCEMENTS ── */}
                    <div className="sd-two-col sd-fade-3">
                        {/* Recent Documents */}
                        <div className="sd-mini-card">
                            <div className="sd-mini-hdr">
                                <div className="sd-mini-title">Recent Documents</div>
                                <Link href={route('student.documents.official')} style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(249,115,22,0.5)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    View All <ChevronRight size={10} />
                                </Link>
                            </div>

                            {recentDocuments && recentDocuments.length > 0 ? (
                                recentDocuments.slice(0, 4).map((doc, i) => (
                                    <div key={i} className="sd-mini-item">
                                        <div className="sd-mini-icon" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
                                            <Paperclip size={14} color="#f97316" />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div className="sd-mini-name">{doc.title}</div>
                                            <div className="sd-mini-sub">{doc.type}</div>
                                        </div>
                                        <ChevronRight size={12} color="rgba(254,243,236,0.2)" />
                                    </div>
                                ))
                            ) : (
                                <div className="sd-empty">
                                    <div className="sd-empty-title">No documents yet.</div>
                                </div>
                            )}
                        </div>

                        {/* Announcements */}
                        <div className="sd-mini-card">
                            <div className="sd-mini-hdr">
                                <div className="sd-mini-title">Announcements</div>
                                <Link href={route('student.announcements')} style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(249,115,22,0.5)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    View All <ChevronRight size={10} />
                                </Link>
                            </div>

                            {announcements && announcements.length > 0 ? (
                                announcements.slice(0, 4).map((ann, i) => (
                                    <div key={i} className="sd-announce-item">
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <div className="sd-announce-dot" />
                                            <div style={{ flex: 1 }}>
                                                <div className="sd-announce-title">{ann.title}</div>
                                                <div className="sd-announce-date">
                                                    {new Date(ann.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="sd-empty">
                                    <div className="sd-empty-title">No announcements.</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── QUICK LINKS ── */}
                    <div className="sd-fade-4">
                        <div className="sd-section-hdr">
                            <span className="sd-section-title">Quick Access</span>
                            <div className="sd-section-line" />
                        </div>
                        <div className="sd-quick-links">
                            {quickLinks.map((link, i) => (
                                <Link key={i} href={link.href} className="sd-quick-link">
                                    <div className="sd-quick-link-icon" style={{
                                        background: `${link.color}14`,
                                        border: `1px solid ${link.color}28`,
                                    }}>
                                        <link.Icon size={20} color={link.color} strokeWidth={1.5} />
                                    </div>
                                    <div className="sd-quick-link-label">{link.label}</div>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </StudentLayout>
    );
}
