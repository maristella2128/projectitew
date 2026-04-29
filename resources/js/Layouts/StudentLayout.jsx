import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

// ── Icons ──
const IGrid    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
const IUser    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IBook    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const ICal     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const ICheck   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;
const IFile    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IShield  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IBell    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const IMsg     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IChevron = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 9l-7 7-7-7"/></svg>;

// ── Nav config ──
const NAV = [
    {
        group: 'MAIN',
        items: [
            { label: 'Dashboard', icon: <IGrid />, href: 'student.dashboard' },
        ],
    },
    {
        group: 'MY PROFILE',
        items: [
            {
                label: 'My Profile', icon: <IUser />,
                children: [
                    { label: 'Personal Info',      href: 'student.profile.personal' },
                    { label: 'Enrollment Details', href: 'student.profile.enrollment' },
                    { label: 'ID & Photo',         href: 'student.profile.id' },
                ],
            },
        ],
    },
    {
        group: 'ACADEMIC',
        items: [
            {
                label: 'My Grades', icon: <IBook />,
                children: [
                    { label: 'Current Grades', href: 'student.grades.current' },
                    { label: 'Grade History',  href: 'student.grades.history' },
                    { label: 'GPA Summary',    href: 'student.grades.gpa' },
                ],
            },
            {
                label: 'My Schedule', icon: <ICal />,
                children: [
                    { label: 'Class Timetable', href: 'student.schedule.timetable' },
                    { label: 'Exam Schedule',   href: 'student.schedule.exams' },
                ],
            },
            {
                label: 'Attendance', icon: <ICheck />,
                children: [
                    { label: 'Attendance Record',    href: 'student.attendance.record' },
                    { label: 'Absences & Tardiness', href: 'student.attendance.absences' },
                ],
            },
        ],
    },
    {
        group: 'DOCUMENTS',
        items: [
            {
                label: 'My Documents', icon: <IFile />,
                children: [
                    { label: 'Official Records', href: 'student.documents.official' },
                    { label: 'Class Materials',  href: 'student.documents.materials' },
                    { label: 'Assignments',      href: 'student.documents.assignments' },
                ],
            },
            { label: 'Clearance Status', icon: <IShield />, href: 'student.clearance' },
        ],
    },
    {
        group: 'COMMUNICATIONS',
        items: [
            { label: 'Announcements', icon: <IBell />, href: 'student.announcements' },
            { label: 'Messages',      icon: <IMsg />,  href: 'student.messages' },
        ],
    },
];

export default function StudentLayout({ children, title }) {
    const { auth, ziggy } = usePage().props;
    const user     = auth?.user;
    const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? 'S';
    const currentUrl = ziggy?.location ?? window.location.href;

    const isActive = (routeName) => {
        try { return currentUrl.includes(route(routeName).replace(window.location.origin, '')); }
        catch { return false; }
    };

    const [open, setOpen] = useState(() => {
        // Auto-open the group that contains the active route
        const initial = {};
        NAV.forEach(g => g.items.forEach(item => {
            if (item.children?.some(c => { try { return currentUrl.includes(route(c.href).replace(window.location.origin,'')); } catch { return false; } })) {
                initial[item.label] = true;
            }
        }));
        return initial;
    });

    const tog = key => setOpen(p => ({ ...p, [key]: !p[key] }));

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0d0902' }}>

            {/* ════════════════ SIDEBAR ════════════════ */}
            <aside style={{
                width: '200px', flexShrink: 0,
                background: '#0d0902',
                borderRight: '1px solid rgba(249,115,22,0.1)',
                display: 'flex', flexDirection: 'column',
                position: 'fixed', top: 0, left: 0,
                height: '100vh', overflowY: 'auto',
                zIndex: 50,
            }}>

                {/* ── Logo / Branding ── */}
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    padding: '22px 16px 18px',
                    borderBottom: '1px solid rgba(249,115,22,0.08)',
                }}>
                    {/* Circular logo */}
                    <div style={{
                        width: 58, height: 58, borderRadius: '50%',
                        background: 'radial-gradient(circle at 35% 35%, #92400e, #451a03)',
                        border: '2px solid rgba(249,115,22,0.35)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20, fontWeight: 900, color: '#fed7aa',
                        fontFamily: "'Playfair Display', serif",
                        boxShadow: '0 0 18px rgba(249,115,22,0.15)',
                        marginBottom: 10, flexShrink: 0,
                    }}>S</div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#fef3ec', letterSpacing: '.04em', textAlign: 'center', fontFamily: "'DM Sans', sans-serif" }}>
                        CCS · ProFile
                    </div>
                    <div style={{ fontSize: 7.5, color: 'rgba(254,243,236,0.35)', letterSpacing: '.07em', textAlign: 'center', marginTop: 2, textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>
                        College of Computing Studies
                    </div>
                </div>

                {/* ── Navigation ── */}
                <nav style={{ flex: 1, padding: '10px 0 20px', overflowY: 'auto' }}>
                    {NAV.map(group => (
                        <div key={group.group}>
                            {/* Group label */}
                            <div style={{
                                fontSize: 8, fontWeight: 800,
                                letterSpacing: '.13em', textTransform: 'uppercase',
                                color: 'rgba(249,115,22,0.4)',
                                padding: '12px 16px 4px',
                                fontFamily: "'DM Sans', sans-serif",
                            }}>{group.group}</div>

                            {group.items.map(item => {
                                const active = item.href ? isActive(item.href) : false;
                                const childActive = item.children?.some(c => isActive(c.href));
                                const isOpen = open[item.label];

                                return (
                                    <div key={item.label}>
                                        {/* ── Parent with children (collapsible) ── */}
                                        {item.children ? (
                                            <button
                                                onClick={() => tog(item.label)}
                                                style={{
                                                    width: '100%', display: 'flex', alignItems: 'center',
                                                    gap: 9, padding: '8px 16px 8px 14px',
                                                    background: 'transparent',
                                                    border: 'none', borderLeft: `2px solid ${childActive ? '#f97316' : 'transparent'}`,
                                                    cursor: 'pointer', textAlign: 'left',
                                                    color: childActive ? '#f97316' : 'rgba(254,243,236,0.55)',
                                                    fontSize: 12, fontWeight: 600,
                                                    fontFamily: "'DM Sans', sans-serif",
                                                    transition: 'all .15s',
                                                }}
                                            >
                                                <span style={{ opacity: childActive ? 1 : 0.6, display: 'flex', color: childActive ? '#f97316' : 'inherit' }}>{item.icon}</span>
                                                <span style={{ flex: 1 }}>{item.label}</span>
                                                <span style={{
                                                    display: 'flex', opacity: 0.5,
                                                    transform: isOpen ? 'rotate(180deg)' : 'none',
                                                    transition: 'transform .2s',
                                                }}><IChevron /></span>
                                            </button>
                                        ) : (
                                            /* ── Leaf item ── */
                                            <Link
                                                href={(() => { try { return route(item.href); } catch { return '#'; } })()}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: 9,
                                                    padding: '8px 16px 8px 14px', textDecoration: 'none',
                                                    background: active ? 'rgba(249,115,22,0.9)' : 'transparent',
                                                    borderLeft: `2px solid ${active ? '#f97316' : 'transparent'}`,
                                                    borderRadius: active ? '0 8px 8px 0' : 0,
                                                    color: active ? '#fff' : 'rgba(254,243,236,0.55)',
                                                    fontSize: 12, fontWeight: active ? 700 : 600,
                                                    fontFamily: "'DM Sans', sans-serif",
                                                    transition: 'all .15s',
                                                    marginRight: active ? 8 : 0,
                                                }}
                                            >
                                                <span style={{ display: 'flex', opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                                                {item.label}
                                            </Link>
                                        )}

                                        {/* ── Sub-items ── */}
                                        {item.children && isOpen && (
                                            <div style={{ paddingBottom: 4 }}>
                                                {item.children.map(sub => {
                                                    const subActive = isActive(sub.href);
                                                    return (
                                                        <Link
                                                            key={sub.label}
                                                            href={(() => { try { return route(sub.href); } catch { return '#'; } })()}
                                                            style={{
                                                                display: 'block',
                                                                padding: '5px 16px 5px 40px',
                                                                fontSize: 11, fontWeight: subActive ? 700 : 500,
                                                                color: subActive ? '#f97316' : 'rgba(254,243,236,0.38)',
                                                                textDecoration: 'none',
                                                                borderLeft: `2px solid ${subActive ? '#f97316' : 'rgba(249,115,22,0.12)'}`,
                                                                marginLeft: 14,
                                                                transition: 'color .12s',
                                                                fontFamily: "'DM Sans', sans-serif",
                                                            }}
                                                            onMouseOver={e => { if (!subActive) e.currentTarget.style.color = 'rgba(254,243,236,0.7)'; }}
                                                            onMouseOut={e => { if (!subActive) e.currentTarget.style.color = 'rgba(254,243,236,0.38)'; }}
                                                        >
                                                            {sub.label}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* ── User footer ── */}
                <div style={{
                    padding: '12px 14px',
                    borderTop: '1px solid rgba(249,115,22,0.08)',
                    display: 'flex', alignItems: 'center', gap: 9,
                }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                        background: 'rgba(249,115,22,0.15)',
                        border: '1px solid rgba(249,115,22,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 800, color: '#f97316',
                    }}>{initials}</div>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#fef3ec', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif" }}>
                            {user?.name ?? 'Student'}
                        </div>
                        <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(249,115,22,0.5)', textTransform: 'uppercase', letterSpacing: '.08em', fontFamily: "'DM Sans', sans-serif" }}>
                            Student
                        </div>
                    </div>
                </div>
            </aside>

            {/* ════════════════ MAIN CONTENT ════════════════ */}
            <div style={{
                marginLeft: '200px', flex: 1,
                display: 'flex', flexDirection: 'column',
                height: '100vh', overflowY: 'auto', overflowX: 'hidden',
            }}>
                {/* Topbar */}
                <header style={{
                    height: '52px', padding: '0 24px',
                    background: '#0d0902',
                    borderBottom: '1px solid rgba(249,115,22,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    position: 'sticky', top: 0, zIndex: 40,
                    flexShrink: 0,
                }}>
                    <span style={{
                        fontSize: 12, fontWeight: 700,
                        color: '#f97316',
                        fontFamily: "'DM Sans', sans-serif",
                        letterSpacing: '.04em',
                    }}>{title ?? 'Dashboard'}</span>

                    <Link
                        href={route('logout')} method="post" as="button"
                        style={{
                            fontSize: 10, fontWeight: 700,
                            color: 'rgba(254,243,236,0.35)',
                            background: 'none', border: 'none',
                            cursor: 'pointer', textTransform: 'uppercase',
                            letterSpacing: '.1em',
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >Logout</Link>
                </header>

                {/* Page content */}
                <main style={{ flex: 1, padding: '28px 32px', position: 'relative' }}>
                    {children}
                </main>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                ::-webkit-scrollbar { width: 3px; }
                ::-webkit-scrollbar-thumb { background: rgba(249,115,22,0.2); border-radius: 2px; }
            `}</style>
        </div>
    );
}
