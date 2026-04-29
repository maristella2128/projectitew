import { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@/inertia-adapter';
import { Bell, Settings, LogOut, User, ChevronDown, Shield, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function Topbar() {
    const { props } = usePage();
    const user = props.auth.user;
    const customization = props.customization || {};
    const today = format(new Date(), 'EEEE, MMMM do, yyyy');

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    
    const dropdownRef = useRef(null);
    const notifRef = useRef(null);

    // Fetch latest announcements
    useEffect(() => {
        const fetchNotifs = async () => {
            try {
                const res = await fetch('/announcements/latest');
                const data = await res.json();
                setNotifications(data);
            } catch (err) {
                console.error('Failed to fetch notifications:', err);
            }
        };
        fetchNotifs();
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const initials = user.name
        ?.split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() ?? 'U';

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

                @keyframes tb-pulse {
                    0%,100% { box-shadow: 0 0 0 0 rgba(249,115,22,0.45); }
                    50%      { box-shadow: 0 0 0 5px rgba(249,115,22,0); }
                }

                .tb-live-dot {
                    width: 6px; height: 6px; border-radius: 50%;
                    background: var(--primary); flex-shrink: 0;
                    animation: tb-pulse 2s infinite;
                    display: inline-block;
                }

                .tb-icon-btn {
                    padding: 8px; border-radius: 9px; cursor: pointer;
                    background: transparent;
                    border: 1px solid transparent;
                    color: var(--text-secondary);
                    transition: all .18s;
                    display: flex; align-items: center; justify-content: center;
                    position: relative;
                }
                .tb-icon-btn:hover {
                    background: var(--surface);
                    border-color: var(--border);
                    color: var(--primary);
                }

                .tb-avatar-btn {
                    display: flex; align-items: center; gap: 9px;
                    padding: 5px 8px 5px 5px;
                    border-radius: 13px;
                    border: 1px solid transparent;
                    cursor: pointer; background: transparent;
                    transition: all .2s;
                }
                .tb-avatar-btn:hover {
                    background: var(--surface);
                    border-color: var(--border);
                }
                .tb-avatar-btn.is-open {
                    background: var(--surface);
                    border-color: var(--primary);
                }

                .tb-dd-item {
                    display: flex; align-items: center; gap: 10px;
                    padding: 9px 12px; border-radius: [var(--border-radius)];
                    font-size: 13px; font-weight: 500;
                    color: var(--text-secondary);
                    text-decoration: none;
                    transition: all .15s;
                    border: 1px solid transparent;
                    width: 100%; background: none;
                    cursor: pointer; font-family: inherit;
                    text-align: left;
                }
                .tb-dd-item:hover {
                    background: var(--surface);
                    color: var(--text-primary);
                    border-color: var(--border);
                }
                .tb-dd-item.tb-danger { color: rgba(248,113,113,0.65); }
                .tb-dd-item.tb-danger:hover {
                    background: rgba(239,68,68,0.09);
                    color: #f87171;
                    border-color: rgba(239,68,68,0.2);
                }

                .tb-search-wrap {
                    display: flex; align-items: center; gap: 9px;
                    border-radius: 11px;
                    transition: all .2s;
                    overflow: hidden;
                }
                .tb-search-wrap input {
                    background: transparent; border: none;
                    color: var(--text-primary); font-size: 13px;
                    font-family: inherit;
                    width: 100%;
                }
                .tb-search-wrap input:focus { outline: none; }
                .tb-search-wrap input::placeholder { color: var(--text-muted); }

                .tb-notif-badge {
                    position: absolute; top: 4px; right: 4px;
                    width: 15px; height: 15px;
                    background: linear-gradient(135deg,#f97316,#c2410c);
                    color: #fff; font-size: 8px; font-weight: 900;
                    border-radius: 50%;
                    border: 2px solid #0c0805;
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Space Mono', monospace;
                }

                .tb-notif-item {
                    display: flex; gap: 12px;
                    padding: 12px; border-radius: 12px;
                    transition: all .15s;
                    border: 1px solid transparent;
                    width: 100%; background: none;
                    cursor: pointer; text-align: left;
                    font-family: inherit;
                }
                .tb-notif-item:hover {
                    background: rgba(249,115,22,0.05);
                    border-color: rgba(249,115,22,0.1);
                }
                .tb-notif-dot {
                    width: 8px; height: 8px; border-radius: 50%;
                    background: #f97316; margin-top: 5px;
                    flex-shrink: 0;
                    box-shadow: 0 0 10px rgba(249,115,22,0.4);
                }
                .tb-notif-view-all {
                    padding: 12px; text-align: center;
                    font-size: 11px; font-weight: 700;
                    color: var(--primary);
                    text-transform: uppercase; letter-spacing: .1em;
                    font-family: 'Space Mono', monospace;
                    border-top: 1px solid rgba(249,115,22,0.1);
                    transition: all .2s;
                    display: block;
                }
                .tb-notif-view-all:hover {
                    background: rgba(249,115,22,0.05);
                    letter-spacing: .15em;
                }

            `}</style>

            <header style={{
                height: customization?.topbarH ? `${customization.topbarH}px` : 'var(--topbar-h, 64px)',
                borderBottom: `1px solid var(--border)`,
                padding: '0 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 40,
                background: customization?.topbar || 'var(--surface, #0c0805)',
                backdropFilter: `blur(${customization?.glassBlur || 12}px)`,
                fontFamily: "var(--body-font)",
            }}>

                {/* ── LEFT : Greeting ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>

                    {/* Live pill */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '4px 11px',
                        borderRadius: 7,
                        background: 'color-mix(in srgb, var(--primary), transparent 91%)',
                        border: '1px solid color-mix(in srgb, var(--primary), transparent 78%)',
                        flexShrink: 0,
                    }}>
                        <span className="tb-live-dot" />
                        <span style={{
                            fontSize: '9px', fontWeight: 700,
                            color: 'var(--primary)', letterSpacing: '.08em',
                            fontFamily: "'Space Mono', monospace",
                        }}>LIVE</span>
                    </div>

                    {/* Text */}
                    <div>
                        <h2 style={{
                            fontFamily: "var(--display-font)",
                            fontSize: '16px', fontWeight: 700,
                            color: 'var(--text-primary)', lineHeight: 1.2, margin: 0,
                        }}>
                            Welcome back,{' '}
                            <span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>{user.name}</span>
                        </h2>
                        <p style={{
                            fontSize: '10px',
                            color: 'rgba(254,243,236,0.34)',
                            marginTop: 2, margin: 0,
                            display: 'flex', alignItems: 'center', gap: 5,
                        }}>
                            <Calendar size={10} style={{ color: 'color-mix(in srgb, var(--primary), transparent 54%)', flexShrink: 0 }} />
                            {today}
                            <span style={{ color: 'color-mix(in srgb, var(--primary), transparent 65%)' }}>·</span>
                            <span style={{
                                textTransform: 'capitalize',
                                color: 'var(--secondary)',
                                fontWeight: 700,
                                fontStyle: 'italic',
                            }}>{user.role}</span>
                        </p>
                    </div>
                </div>

                {/* ── RIGHT : Actions ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Notifications */}
                    <div style={{ position: 'relative' }} ref={notifRef}>
                        <button 
                            className={`tb-icon-btn ${notifOpen ? 'is-open' : ''}`}
                            onClick={() => setNotifOpen(!notifOpen)}
                        >
                            <Bell size={17} />
                            {props.notifications_count > 0 && (
                                <span className="tb-notif-badge">
                                    {props.notifications_count}
                                </span>
                            )}
                        </button>

                        {notifOpen && (
                            <div style={{
                                position: 'absolute', right: 0,
                                top: 'calc(100% + 10px)',
                                width: 320,
                                borderRadius: 16,
                                overflow: 'hidden',
                                zIndex: 50,
                                background: '#14100c',
                                border: '1px solid rgba(249,115,22,0.2)',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.55), 0 4px 14px rgba(249,115,22,0.1)',
                            }}>
                                <div style={{
                                    padding: '15px 18px',
                                    borderBottom: '1px solid rgba(249,115,22,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fef3ec', margin: 0 }}>Announcements</h3>
                                    <span style={{ fontSize: '10px', color: 'rgba(254,243,236,0.3)', fontWeight: 700, fontFamily: 'Space Mono' }}>LATEST BROADCASTS</span>
                                </div>

                                <div style={{ padding: '8px', maxHeight: '380px', overflowY: 'auto' }}>
                                    {notifications.length > 0 ? (
                                        notifications.map((n) => (
                                            <Link 
                                                key={n.id}
                                                href={`/announcements?id=${n.id}`}
                                                className="tb-notif-item"
                                                onClick={() => setNotifOpen(false)}
                                            >
                                                {!n.has_read && <div className="tb-notif-dot" />}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ 
                                                        fontSize: '13px', fontWeight: 700, color: n.has_read ? 'rgba(254,243,236,0.6)' : '#fef3ec', 
                                                        margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
                                                    }}>
                                                        {n.title}
                                                    </p>
                                                    <p style={{ 
                                                        fontSize: '11px', color: 'rgba(254,243,236,0.35)', 
                                                        margin: '4px 0 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                                    }}>
                                                        {n.content}
                                                    </p>
                                                    <p style={{ fontSize: '9px', color: 'rgba(249,115,22,0.5)', margin: '6px 0 0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                                                        {new Date(n.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                                            <Bell size={24} style={{ color: 'rgba(254,243,236,0.1)', margin: '0 auto 12px' }} />
                                            <p style={{ fontSize: '12px', color: 'rgba(254,243,236,0.2)', margin: 0 }}>No recent transmissions</p>
                                        </div>
                                    )}
                                </div>

                                <Link href="/announcements" className="tb-notif-view-all" onClick={() => setNotifOpen(false)}>
                                    View All Announcements
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div style={{
                        width: 1, height: 26,
                        background: 'rgba(249,115,22,0.12)',
                        margin: '0 5px', flexShrink: 0,
                    }} />

                    {/* Avatar + Dropdown */}
                    <div style={{ position: 'relative' }} ref={dropdownRef}>
                        <button
                            className={`tb-avatar-btn${dropdownOpen ? ' is-open' : ''}`}
                            onClick={() => setDropdownOpen(o => !o)}
                        >
                            {/* Name + role */}
                            <div style={{ textAlign: 'right' }}>
                                <p style={{
                                    fontSize: '12px', fontWeight: 700,
                                    color: '#fef3ec', margin: 0, lineHeight: 1.25,
                                }}>{user.name}</p>
                                <p style={{
                                    fontSize: '9px',
                                    color: 'rgba(254,243,236,0.32)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '.1em',
                                    fontFamily: "'Space Mono', monospace",
                                    margin: 0, marginTop: 1,
                                }}>Dean Office</p>
                            </div>

                            {/* Avatar */}
                            <div style={{
                                width: 35, height: 35,
                                borderRadius: 10,
                                background: 'linear-gradient(135deg, #f97316, #9a3412)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '11px', fontWeight: 700, color: '#fff',
                                flexShrink: 0,
                                boxShadow: dropdownOpen
                                    ? '0 0 0 3px rgba(249,115,22,0.32), 0 3px 10px rgba(249,115,22,0.28)'
                                    : '0 2px 8px rgba(249,115,22,0.26)',
                                transition: 'box-shadow .2s',
                            }}>{initials}</div>

                            {/* Chevron */}
                            <ChevronDown size={13} style={{
                                color: 'rgba(249,115,22,0.48)',
                                transition: 'transform .2s',
                                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                flexShrink: 0,
                            }} />
                        </button>

                        {/* ── DROPDOWN MENU ── */}
                        {dropdownOpen && (
                            <div style={{
                                position: 'absolute', right: 0,
                                top: 'calc(100% + 10px)',
                                width: 262,
                                borderRadius: 16,
                                overflow: 'hidden',
                                zIndex: 50,
                                background: '#14100c',
                                border: '1px solid rgba(249,115,22,0.2)',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.55), 0 4px 14px rgba(249,115,22,0.1)',
                            }}>

                                {/* Profile header */}
                                <div style={{
                                    padding: '15px',
                                    background: 'linear-gradient(135deg, rgba(249,115,22,0.11), rgba(154,52,18,0.06))',
                                    borderBottom: '1px solid rgba(249,115,22,0.13)',
                                    display: 'flex', alignItems: 'center', gap: 11,
                                }}>
                                    <div style={{
                                        width: 42, height: 42, borderRadius: 11,
                                        background: 'linear-gradient(135deg, #f97316, #9a3412)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0,
                                        boxShadow: '0 4px 14px rgba(249,115,22,0.32)',
                                    }}>{initials}</div>
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{
                                            fontSize: '13px', fontWeight: 700,
                                            color: '#fef3ec', margin: 0,
                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                        }}>{user.name}</p>
                                        <p style={{
                                            fontSize: '9px', color: '#f97316',
                                            textTransform: 'uppercase', letterSpacing: '.09em',
                                            fontFamily: "'Space Mono', monospace",
                                            margin: '3px 0 2px',
                                        }}>{user.role}</p>
                                        <p style={{
                                            fontSize: '11px',
                                            color: 'rgba(254,243,236,0.36)',
                                            margin: 0,
                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                        }}>{user.email}</p>
                                    </div>
                                </div>

                                {/* AY strip */}
                                <div style={{
                                    padding: '7px 14px',
                                    borderBottom: '1px solid rgba(249,115,22,0.09)',
                                    display: 'flex', alignItems: 'center', gap: 7,
                                }}>
                                    <span className="tb-live-dot" style={{ width: 5, height: 5 }} />
                                    <span style={{
                                        fontSize: '9px', fontWeight: 700,
                                        color: 'rgba(254,243,236,0.3)', letterSpacing: '.07em',
                                        fontFamily: "'Space Mono', monospace",
                                    }}>AY {props.customization?.academicYear || '2025–2026'} · {props.customization?.semester || '1st Semester'} · {props.customization?.institution || 'CCS'}</span>
                                </div>

                                {/* Menu items */}
                                <div style={{ padding: '7px' }}>
                                    <Link
                                        href="/profile"
                                        className="tb-dd-item"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <User size={14} style={{ color: 'rgba(249,115,22,0.48)', flexShrink: 0 }} />
                                        View Profile
                                    </Link>

                                    <Link
                                        href="/settings"
                                        className="tb-dd-item"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <Settings size={14} style={{ color: 'rgba(249,115,22,0.48)', flexShrink: 0 }} />
                                        Settings
                                    </Link>

                                    {user.role === 'dean' && (
                                        <Link
                                            href="/access-roles"
                                            className="tb-dd-item"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <Shield size={14} style={{ color: 'rgba(249,115,22,0.48)', flexShrink: 0 }} />
                                            Access & Roles
                                        </Link>
                                    )}
                                </div>

                                {/* Divider */}
                                <div style={{ margin: '0 10px', height: 1, background: 'rgba(249,115,22,0.1)' }} />

                                {/* Sign out */}
                                <div style={{ padding: '7px' }}>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="tb-dd-item tb-danger"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <LogOut size={14} style={{ flexShrink: 0 }} />
                                        Sign Out
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}