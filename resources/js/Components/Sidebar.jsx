import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    UserPlus,
    Layers,
    Calendar,
    Files,
    BookOpen,
    GraduationCap,
    ScrollText,
    HeartPulse,
    Bell,
    ShieldCheck,
    BarChart3,
    ChevronDown,
    CalendarCheck,
    Trophy,
    MessageSquare,
    Palette,
    Star,
    Award,
    TrendingUp,
    Plus,
    Shield
} from 'lucide-react';

const ICON_MAP = {
    LayoutDashboard, Users, UserPlus, Layers, Calendar, Files, BookOpen, GraduationCap,
    ScrollText, HeartPulse, Bell, ShieldCheck, BarChart3, ChevronDown, CalendarCheck,
    Trophy, MessageSquare, Palette, Star, Award, TrendingUp, Plus, Shield
};

const useIcon = (customization, slot, defaultIcon) => {
    const iconId = customization?.icons?.[slot] || defaultIcon;
    return ICON_MAP[iconId] || defaultIcon;
};

/* ─────────────────────────────────────────
   Sub-item (inside a dropdown)
 ───────────────────────────────────────── */
const SubItem = ({ href, icon: Icon, label, active, badge }) => (
    <Link
        href={href}
        className={`
            flex items-center gap-3 px-3 py-2 rounded-lg text-[12.5px]
            font-medium tracking-wide transition-all duration-200 select-none
            ${active
                ? 'text-[var(--primary)] bg-[var(--primary)]/10'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]'
            }
        `}
        style={active ? { background: 'color-mix(in srgb, var(--primary), transparent 90%)' } : {}}
    >
        {active && <span className="w-1 h-1 rounded-full bg-[var(--primary)] shrink-0" />}
        <Icon size={14} className="shrink-0" strokeWidth={active ? 2.2 : 1.7} />
        <span className="truncate flex-1">{label}</span>
        {badge > 0 && (
            <span className="flex items-center justify-center px-1.5 py-0.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[9px] font-bold">
                {badge}
            </span>
        )}
    </Link>
);

/* ─────────────────────────────────────────
   Top-level item (no children)
 ───────────────────────────────────────── */
const Item = ({ href, icon: Icon, label, active, badge }) => (
    <Link
        href={href}
        className={`
            group relative flex items-center gap-3 px-4 py-2.5 rounded-[var(--border-radius)] text-[13.5px]
            font-medium tracking-wide transition-all duration-200 select-none
            ${active ? 'text-[var(--background)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]'}
        `}
        style={active ? {
            background: 'var(--primary)',
            boxShadow: '0 4px 14px var(--primary)',
        } : {}}
    >
        <Icon size={16} className="shrink-0" strokeWidth={active ? 2.2 : 1.7} />
        <span className="truncate flex-1">{label}</span>
        {badge > 0 && (
            <span className={`flex items-center justify-center px-1.5 py-0.5 min-w-[20px] h-[20px] rounded-full font-bold text-[10px] ${active ? 'bg-white text-red-600' : 'bg-red-500 text-white'}`}>
                {badge}
            </span>
        )}
    </Link>
);

/* ─────────────────────────────────────────
   Dropdown group
 ───────────────────────────────────────── */
const Group = ({ icon: Icon, label, children, hasActive, forceOpen }) => {
    const [open, setOpen] = useState(hasActive || forceOpen);

    return (
        <div>
            <button
                onClick={() => setOpen(o => !o)}
                className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13.5px]
                    font-medium tracking-wide transition-all duration-200 select-none
                    ${hasActive
                        ? 'text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]'
                    }
                `}
                style={hasActive ? {
                    background: 'var(--primary)/20%',
                    border: '1px solid var(--border)',
                } : {}}
            >
                <Icon size={16} className="shrink-0" strokeWidth={1.8} />
                <span className="flex-1 text-left truncate">{label}</span>
                <ChevronDown
                    size={13}
                    className={`shrink-0 opacity-40 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div
                    className="mx-2 mt-1 mb-1 px-2 py-1.5 rounded-xl space-y-0.5"
                    style={{
                        background: 'rgba(0,0,0,0.25)',
                        border: '1px solid var(--border)',
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────
   Section divider
 ───────────────────────────────────────── */
const Section = ({ label }) => (
    <div className="flex items-center gap-3 px-4 pt-5 pb-1.5">
        <span
            className="text-[9px] font-bold uppercase tracking-[0.2em] whitespace-nowrap"
            style={{ color: 'var(--primary)' }}
        >
            {label}
        </span>
        <span className="flex-1 h-px" style={{ background: 'var(--border)' }} />
    </div>
);

/* ─────────────────────────────────────────
   Main Sidebar
 ───────────────────────────────────────── */
export default function Sidebar() {
    const { url, props } = usePage();
    const user = props.auth.user;
    const role = user.role;
    const customization = props.customization || {};

    const is = (...r) => r.includes(role);
    const act = (href) => url === href || url.startsWith(href + '/');

    return (
        <aside
            className="h-screen sticky top-0 flex flex-col z-50"
            style={{
                width: 'var(--sidebar-w, 280px)',
                background: 'var(--sidebar-bg, var(--background))',
                borderRight: '1px solid var(--border)',
                boxShadow: '4px 0 32px rgba(0,0,0,0.40)',
            }}
        >
            {/* ══ BRAND ══ */}
            <div
                className="shrink-0 flex flex-col items-center justify-center pt-7 pb-5 px-6 relative overflow-hidden"
                style={{ borderBottom: '1px solid rgba(249,115,22,0.10)' }}
            >
                <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'radial-gradient(ellipse 90% 70% at 50% 35%, color-mix(in srgb, var(--primary), transparent 87%), transparent 70%)',
                }} />

                <div className="relative mb-3.5">
                    <div className="absolute rounded-full pointer-events-none" style={{
                        inset: '-5px',
                        background: 'conic-gradient(from 0deg, color-mix(in srgb, var(--primary), transparent 35%), color-mix(in srgb, var(--primary), transparent 95%) 40%, color-mix(in srgb, var(--primary), transparent 45%) 70%, color-mix(in srgb, var(--primary), transparent 95%) 100%)',
                        borderRadius: '50%',
                        animation: 'spin-ring 8s linear infinite',
                        WebkitMaskImage: 'radial-gradient(transparent 62%, black 63%)',
                        maskImage: 'radial-gradient(transparent 62%, black 63%)',
                    }} />
                    <div className="absolute rounded-full pointer-events-none" style={{
                        inset: '-3px',
                        border: '1px solid color-mix(in srgb, var(--primary), transparent 80%)',
                        borderRadius: '50%',
                    }} />
                    <div
                        className="relative w-[72px] h-[72px] rounded-full flex items-center justify-center overflow-hidden"
                        style={{
                            background: 'linear-gradient(145deg, color-mix(in srgb, var(--primary), transparent 84%), color-mix(in srgb, var(--primary), transparent 94%) 100%)',
                            border: '1.5px solid color-mix(in srgb, var(--primary), transparent 70%)',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.50), 0 0 20px color-mix(in srgb, var(--primary), transparent 82%)',
                        }}
                    >
                        <img
                            src="/assets/profilinglogo.png"
                            alt="CCS Logo"
                            className="w-12 h-12 object-contain"
                            style={{ filter: 'drop-shadow(0 2px 8px color-mix(in srgb, var(--primary), transparent 60%))' }}
                        />
                    </div>
                </div>

                <div className="text-center relative z-10 px-4">
                    <div className="text-[var(--text-primary)] text-[18px] font-black tracking-tight leading-none mb-1">
                        {customization.deptAbbrev || "CCS"} <span className="text-[var(--primary)]">•</span> ProFile
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted">
                        {customization.institution || "College of Computing Studies"}
                    </p>
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-4/5 pointer-events-none" style={{
                    background: 'linear-gradient(90deg, transparent, var(--primary)/30%, transparent)',
                }} />
            </div>

            {/* ══ NAV ══ */}
            <nav
                className="flex-1 px-3 py-2 pb-6 space-y-0.5 overflow-y-auto"
                style={{ scrollbarWidth: 'none' }}
            >
                <style>{`
                    @keyframes spin-ring { to { transform: rotate(360deg); } }
                    nav::-webkit-scrollbar { display: none; }
                `}</style>

                {/* Dashboard */}
                <Section label="Main" />
                <Item href="/dashboard" icon={useIcon(customization, 'nav_overview', LayoutDashboard)} label="Dashboard" active={act('/dashboard')} />

                {/* Dean Management */}
                {is('dean') && (<>
                    <Section label="Management" />
                    <Group
                        icon={useIcon(customization, 'nav_students', Users)}
                        label="Students"
                        hasActive={
                            act('/students') || act('/candidates') ||
                            act('/sections') || act('/schedules') || act('/documents')
                        }
                    >
                        <SubItem href="/students" icon={useIcon(customization, 'nav_students', Users)} label="All Students" active={act('/students')} />
                        <SubItem href="/candidates" icon={useIcon(customization, 'nav_candidates', UserPlus)} label="Candidates" active={act('/candidates')} />
                        <SubItem href="/sections" icon={useIcon(customization, 'nav_sections', Layers)} label="Programs & Sections" active={act('/sections')} />
                        <SubItem href="/schedules" icon={useIcon(customization, 'nav_scheduling', Calendar)} label="Schedules" active={act('/schedules')} />
                        <SubItem href="/documents" icon={useIcon(customization, 'nav_reports', Files)} label="Documents" active={act('/documents')} />
                    </Group>

                    <Group
                        icon={useIcon(customization, 'nav_instruction', BookOpen)}
                        label="Curriculum"
                        hasActive={url.startsWith('/curriculum') || act('/curricula') || act('/courses')}
                        forceOpen={url.startsWith('/curriculum') || act('/curricula') || act('/courses')}
                    >
                        <SubItem href="/curriculum" icon={useIcon(customization, 'nav_instruction', GraduationCap)} label="Curricula" active={url.startsWith('/curriculum') || act('/curricula')} />
                    </Group>
                </>)}

                {/* Professor / Teacher */}
                {is('teacher', 'professor') && !is('dean') && (<>
                    <Section label="My Classes" />
                    <Group icon={useIcon(customization, 'nav_students', Users)} label="Class List" hasActive={act('/classes') || act('/students')}>
                        <SubItem href="/students" icon={Users} label="Enrolled Students" active={act('/students')} />
                        <SubItem href="/classes" icon={Layers} label="Section Overview" active={act('/classes')} />
                    </Group>
                    <Group icon={useIcon(customization, 'nav_scheduling', CalendarCheck)} label="Attendance" hasActive={act('/attendance')}>
                        <SubItem href="/attendance/mark" icon={CalendarCheck} label="Mark Attendance" active={act('/attendance/mark')} />
                        <SubItem href="/attendance" icon={Files} label="Attendance History" active={act('/attendance') && !act('/attendance/mark')} />
                    </Group>
                    <Group icon={useIcon(customization, 'nav_reports', BarChart3)} label="Grades & Scores" hasActive={act('/grades')}>
                        <SubItem href="/grades/enter" icon={BarChart3} label="Enter Grades" active={act('/grades/enter')} />
                        <SubItem href="/grades" icon={ScrollText} label="Grade Summary" active={act('/grades') && !act('/grades/enter') && !act('/grades/performance')} />
                        <SubItem href="/grades/performance" icon={TrendingUp} label="Class Performance" active={act('/grades/performance')} />
                    </Group>

                    <Section label="Materials" />
                    <Group icon={useIcon(customization, 'nav_reports', Files)} label="Documents" hasActive={act('/documents')}>
                        <SubItem href="/documents/upload" icon={Plus} label="Upload Materials" active={act('/documents/upload')} />
                        <SubItem href="/documents/lessons" icon={BookOpen} label="Lessons & PPT" active={act('/documents/lessons')} />
                        <SubItem href="/documents/assignments" icon={Files} label="Assignments" active={act('/documents/assignments')} />
                        <SubItem href="/documents/syllabus" icon={ScrollText} label="Syllabus" active={act('/documents/syllabus')} />
                        <SubItem href="/documents/shared" icon={Users} label="Shared by Dean" active={act('/documents/shared')} />
                    </Group>
                </>)}

                {/* Academic Records */}
                {is('dean', 'student', 'students', 'parent') && (<>
                    <Section label="Academic" />
                    <Group
                        icon={useIcon(customization, 'nav_reports', BookOpen)}
                        label="Academic Records"
                        hasActive={
                            act('/academic-records') || act('/grades') ||
                            act('/enrollment-history') || act('/attendance') ||
                            act('/health') || act('/achievements') ||
                            act('/activities') || act('/leaderboard') || act('/conduct') || act('/clearance')
                        }
                    >
                        <SubItem href="/academic-records" icon={BookOpen} label="Overview" active={act('/academic-records')} />
                        <SubItem href="/grades" icon={GraduationCap} label="Academic History" active={act('/grades')} />
                        {is('dean', 'student', 'students') &&
                            <SubItem href="/enrollment-history" icon={ScrollText} label="Enrollment History" active={act('/enrollment-history')} />
                        }
                        <SubItem href="/attendance" icon={CalendarCheck} label="Attendance" active={act('/attendance')} />
                        <SubItem href="/health" icon={HeartPulse} label="Health Records" active={act('/health')} />
                        <SubItem href="/achievements" icon={Trophy} label="Achievements" active={act('/achievements')} />
                        <SubItem href="/activities" icon={Star} label="Activity Catalog" active={act('/activities')} />
                        <SubItem href="/leaderboard" icon={Award} label="Engagement Leaderboard" active={act('/leaderboard')} />
                        <SubItem href="/conduct" icon={MessageSquare} label="Violations & Conduct" active={act('/conduct')} badge={props.unresolved_alerts_count} />
                        <SubItem href="/clearance" icon={ShieldCheck} label="Clearance Management" active={act('/clearance')} />
                    </Group>
                </>)}

                {/* Professor Academic */}
                {is('teacher', 'professor') && !is('dean') && (<>
                    <Section label="Academic" />
                    <Item href="/conduct" icon={MessageSquare} label="Violations & Conduct" active={act('/conduct')} badge={props.unresolved_alerts_count} />
                    <Item href="/schedules" icon={Calendar} label="Schedule" active={act('/schedules')} />
                </>)}

                {/* Communications */}
                {is('dean', 'teacher', 'professor', 'student', 'students', 'parent') && (<>
                    <Section label="Communications" />
                    <Group
                        icon={useIcon(customization, 'top_bell', Bell)}
                        label="Communications"
                        hasActive={act('/announcements')}
                    >
                        <SubItem href="/announcements" icon={Bell} label="Announcements" active={act('/announcements')} />
                    </Group>
                </>)}

                {/* Administration */}
                {is('dean') && (<>
                    <Section label="Administration" />
                    <Item href="/access-roles" icon={ShieldCheck} label="Access & Roles" active={act('/access-roles')} />
                    <Item href="/analytics" icon={BarChart3} label="Analytics" active={act('/analytics')} />
                    <Item href="/web-customization" icon={useIcon(customization, 'nav_settings', Palette)} label="Web Customization" active={act('/web-customization')} />
                </>)}
            </nav>
        </aside>
    );
}