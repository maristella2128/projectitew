import React, { useState, useEffect, useRef } from 'react';
import { usePage } from '@/inertia-adapter';
import Sidebar from '../../Components/Sidebar';
import Topbar from '../../Components/Topbar';
import {
    BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, LineChart, Line, Cell
} from 'recharts';
import { TrendingUp, Users, GraduationCap, Calendar, Download, ArrowUpRight, Flame } from 'lucide-react';

/* ── Colour tokens ─────────────────────────────────────────────────────────── */
const C = {
    orange: 'var(--primary)',
    orangeLt: 'var(--secondary)',
    orangePl: 'color-mix(in srgb, var(--primary), white 40%)',
    orangeWs: 'color-mix(in srgb, var(--primary), white 60%)',
    orangeDm: 'color-mix(in srgb, var(--primary), black 20%)',
    orangeLo: 'color-mix(in srgb, var(--primary), transparent 88%)',
    bg: 'var(--background)',
    surface: 'var(--surface)',
    card: 'var(--surface)',
    border: 'var(--border)',
    borderHi: 'color-mix(in srgb, var(--primary), transparent 62%)',
    text: 'var(--text-primary)',
    muted: 'var(--text-muted)',
    dim: 'color-mix(in srgb, var(--text-muted), transparent 50%)',
};

/* ── Shared tooltip style ──────────────────────────────────────────────────── */
const tooltipStyle = {
    contentStyle: {
        background: '#1c1208',
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        color: C.text,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 11,
        boxShadow: `0 16px 40px rgba(0,0,0,0.6)`,
    },
    itemStyle: { color: C.orangeLt, fontWeight: 700 },
    labelStyle: { color: C.muted, marginBottom: 4 },
    cursor: { fill: C.orangeLo },
};

/* ── Animated counter ──────────────────────────────────────────────────────── */
function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }) {
    const [display, setDisplay] = useState(0);
    const raf = useRef(null);
    useEffect(() => {
        const start = Date.now();
        const duration = 1100;
        const from = 0;
        const to = parseFloat(value) || 0;
        const tick = () => {
            const p = Math.min((Date.now() - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(from + (to - from) * eased);
            if (p < 1) raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf.current);
    }, [value]);
    return <>{prefix}{display.toFixed(decimals)}{suffix}</>;
}

/* ── Stat card ─────────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, accent, delay = 0 }) {
    return (
        <div style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            position: 'relative',
            overflow: 'hidden',
            animation: `fadeSlideUp 0.5s ease ${delay}ms both`,
        }}>
            {/* glow pip */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${accent ?? C.orange}, transparent)`,
            }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.12em', color: C.muted, textTransform: 'uppercase' }}>{label}</span>
                <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: `rgba(255,123,0,0.12)`,
                    border: `1px solid ${C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Icon size={14} color={C.orangeLt} />
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                <span style={{ fontSize: 32, fontWeight: 800, fontFamily: 'monospace', color: C.orangeLt, lineHeight: 1 }}>
                    <AnimatedNumber value={value} decimals={typeof value === 'string' && value.includes('.') ? 2 : 0} />
                </span>
                {sub && (
                    <span style={{ fontSize: 11, color: C.muted, marginBottom: 4, fontFamily: 'monospace' }}>{sub}</span>
                )}
            </div>
        </div>
    );
}

/* ── Section header ────────────────────────────────────────────────────────── */
function ChartCard({ title, icon: Icon, children, span2 = false, delay = 0 }) {
    return (
        <div style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 20,
            padding: '28px 28px 22px',
            gridColumn: span2 ? '1 / -1' : undefined,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            position: 'relative',
            overflow: 'hidden',
            animation: `fadeSlideUp 0.55s ease ${delay}ms both`,
            transition: 'border-color 0.2s',
        }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.borderHi}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
        >
            {/* corner accent */}
            <div style={{
                position: 'absolute', top: 0, right: 0,
                width: 80, height: 80,
                background: `radial-gradient(circle at top right, rgba(255,123,0,0.08) 0%, transparent 70%)`,
                pointerEvents: 'none',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: C.orange,
                        boxShadow: `0 0 8px ${C.orange}`,
                    }} />
                    <h3 style={{
                        fontFamily: '"Playfair Display", Georgia, serif',
                        fontSize: 15,
                        fontWeight: 700,
                        fontStyle: 'italic',
                        color: C.text,
                        margin: 0,
                    }}>{title}</h3>
                </div>
                <Icon size={16} color={C.orangePl} />
            </div>
            {children}
        </div>
    );
}

/* ── Custom bar shape ──────────────────────────────────────────────────────── */
function GlowBar(props) {
    const { x, y, width, height, fill } = props;
    if (!height || height <= 0) return null;
    return (
        <g>
            <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} />
            <rect x={x + width * 0.2} y={y} width={width * 0.6} height={2} fill={C.orangeLt} rx={1} opacity={0.8} />
        </g>
    );
}

/* ── Main component ────────────────────────────────────────────────────────── */
export default function AnalyticsIndex({ enrollmentData, performanceData, attendanceRate }) {
    const { props } = usePage();
    const hideSidebar = props.customization?.hide_sidebar === "1";
    const isRight = props.customization?.sidebar_position === "right";

    /* ── Sample data (used when props are absent / during preview) ── */
    const enrollment = enrollmentData ?? [
        { grade_level: 'Grade 7', count: 312 },
        { grade_level: 'Grade 8', count: 278 },
        { grade_level: 'Grade 9', count: 295 },
        { grade_level: 'Grade 10', count: 263 },
        { grade_level: 'Grade 11', count: 241 },
        { grade_level: 'Grade 12', count: 198 },
    ];

    const performance = performanceData ?? [
        { subject: 'Math', average: 84 },
        { subject: 'Science', average: 79 },
        { subject: 'English', average: 88 },
        { subject: 'Filipino', average: 91 },
        { subject: 'History', average: 76 },
        { subject: 'PE', average: 95 },
    ];

    const attendance = attendanceRate ?? [
        { name: 'Mon', rate: 94 },
        { name: 'Tue', rate: 97 },
        { name: 'Wed', rate: 92 },
        { name: 'Thu', rate: 96 },
        { name: 'Fri', rate: 88 },
    ];

    const totalEnrolled = enrollment.reduce((s, d) => s + d.count, 0);
    const avgPerformance = (performance.reduce((s, d) => s + d.average, 0) / performance.length).toFixed(1);
    const avgAttendance = (attendance.reduce((s, d) => s + d.rate, 0) / attendance.length).toFixed(1);

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--background)", flexDirection: isRight ? "row-reverse" : "row" }}>
            {!hideSidebar && <Sidebar />}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", position: "relative" }}>
                <Topbar />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=JetBrains+Mono:wght@400;500;700&display=swap');

                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes glowPulse {
                    0%, 100% { opacity: 0.6; }
                    50%       { opacity: 1; }
                }

                .analytics-root * { box-sizing: border-box; }

                .analytics-root {
                    flex: 1;
                    padding: 36px;
                    font-family: 'JetBrains Mono', monospace;
                }

                .export-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: ${C.orange};
                    color: #1a0800;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    padding: 10px 20px;
                    border-radius: 10px;
                    border: none;
                    cursor: pointer;
                    transition: background 0.18s, transform 0.12s;
                }
                .export-btn:hover {
                    background: ${C.orangeLt};
                    transform: translateY(-1px);
                }
                .export-btn:active { transform: scale(0.97); }

                .recharts-cartesian-axis-tick text {
                    font-family: 'JetBrains Mono', monospace !important;
                    font-size: 10px !important;
                    fill: ${C.muted} !important;
                }


                .gg {
                    background-image:
                        linear-gradient(rgba(249,115,22,0.022) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(249,115,22,0.022) 1px, transparent 1px);
                    background-size: 44px 44px;
                }

                .recharts-tooltip-wrapper { outline: none !important; }
            `}</style>

            <div className="analytics-root gg" style={{ position: "relative" }}>
                {/* ambient glow */}
                <div style={{
                    position: "fixed", top: "8%", right: "20%", width: 420, height: 420,
                    background: "rgba(249,115,22,0.03)", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none"
                }}></div>
                <div style={{
                    position: "fixed", bottom: "12%", left: "35%", width: 280, height: 280,
                    background: "rgba(194,65,12,0.025)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none"
                }}></div>

                {/* ── Page header ── */}
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: 36,
                    animation: 'fadeSlideUp 0.4s ease both',
                }}>
                    <div>
                        {/* eyebrow */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.orange, animation: 'glowPulse 2s ease-in-out infinite' }} />
                            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: C.muted, textTransform: 'uppercase' }}>
                                AY 2025–2026 · 1st Semester · Live
                            </span>
                        </div>
                        <h1 style={{
                            fontFamily: '"Playfair Display", Georgia, serif',
                            fontSize: 34,
                            fontWeight: 700,
                            fontStyle: 'italic',
                            color: C.text,
                            margin: 0,
                            lineHeight: 1.15,
                        }}>
                            Intelligence &amp; <span style={{ color: C.orange }}>Insights</span>
                        </h1>
                        <p style={{ fontSize: 11, color: C.muted, marginTop: 6, letterSpacing: '0.04em' }}>
                            High-level institutional data and performance metrics
                        </p>
                    </div>

                    <button className="export-btn">
                        <Download size={13} />
                        Export Report
                    </button>
                </div>

                {/* ── KPI strip ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
                    <StatCard icon={Users} label="Total Enrolled" value={totalEnrolled} sub="students" delay={0} />
                    <StatCard icon={GraduationCap} label="Avg. Performance" value={avgPerformance} sub="/ 100" delay={60} />
                    <StatCard icon={Calendar} label="Avg. Attendance" value={avgAttendance} sub="%" delay={120} />
                    <StatCard icon={TrendingUp} label="Active Sections" value={18} sub="sections" delay={180} />
                </div>

                {/* ── Charts grid ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>

                    {/* Enrollment by Grade */}
                    <ChartCard title="Enrollment by Grade Level" icon={Users} delay={220}>
                        <div style={{ height: 280, minWidth: 0 }}>
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={enrollment} barSize={28} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,123,0,0.07)" />
                                    <XAxis dataKey="grade_level" axisLine={false} tickLine={false}
                                        tick={{ fontSize: 9, fontWeight: 700, fill: C.muted, fontFamily: 'JetBrains Mono' }} />
                                    <YAxis axisLine={false} tickLine={false}
                                        tick={{ fontSize: 9, fontWeight: 700, fill: C.muted, fontFamily: 'JetBrains Mono' }} />
                                    <Tooltip {...tooltipStyle} />
                                    <Bar dataKey="count" shape={<GlowBar fill={C.orange} />} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    {/* Subject Performance */}
                    <ChartCard title="Subject Average Comparison" icon={GraduationCap} delay={280}>
                        <div style={{ height: 280, minWidth: 0 }}>
                            <ResponsiveContainer width="100%" height={280}>
                                <AreaChart data={performance} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={C.orange} stopOpacity={0.35} />
                                            <stop offset="95%" stopColor={C.orange} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,123,0,0.07)" />
                                    <XAxis dataKey="subject" axisLine={false} tickLine={false}
                                        tick={{ fontSize: 9, fontWeight: 700, fill: C.muted, fontFamily: 'JetBrains Mono' }} />
                                    <YAxis axisLine={false} tickLine={false} domain={[60, 100]}
                                        tick={{ fontSize: 9, fontWeight: 700, fill: C.muted, fontFamily: 'JetBrains Mono' }} />
                                    <Tooltip {...tooltipStyle} />
                                    <Area type="monotone" dataKey="average"
                                        stroke={C.orange} strokeWidth={3}
                                        fillOpacity={1} fill="url(#perfGrad)"
                                        dot={{ r: 4, fill: C.orange, strokeWidth: 2, stroke: C.card }}
                                        activeDot={{ r: 6, fill: C.orangeLt, stroke: C.card, strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    {/* Weekly Attendance — full width */}
                    <ChartCard title="Weekly Attendance Rate (%)" icon={Calendar} span2 delay={340}>
                        <div style={{ height: 220, minWidth: 0 }}>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={attendance} barSize={52} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,123,0,0.07)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 700, fill: C.muted, fontFamily: 'JetBrains Mono' }} />
                                    <YAxis axisLine={false} tickLine={false} domain={[80, 100]}
                                        tick={{ fontSize: 10, fontWeight: 700, fill: C.muted, fontFamily: 'JetBrains Mono' }} />
                                    <Tooltip {...tooltipStyle} />
                                    <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
                                        {attendance.map((entry, i) => (
                                            <Cell
                                                key={i}
                                                fill={entry.rate >= 95 ? C.orange : entry.rate >= 90 ? C.orangeDm : '#4a1800'}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        {/* legend */}
                        <div style={{ display: 'flex', gap: 20, paddingTop: 4 }}>
                            {[
                                { color: C.orange, label: '≥ 95% Excellent' },
                                { color: C.orangeDm, label: '90–94% Good' },
                                { color: '#4a1800', label: '< 90% Watch' },
                            ].map(({ color, label }) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
                                    <span style={{ fontSize: 9, color: C.muted, letterSpacing: '0.05em' }}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </ChartCard>

                </div>
            </div>
        </div>
    </div>
    );
}