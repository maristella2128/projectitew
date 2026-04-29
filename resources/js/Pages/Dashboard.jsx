import { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Topbar from "../Components/Topbar";
import { usePage } from '@/inertia-adapter';
import {
    Download, Plus, Bell, Search, Filter, ChevronRight,
    FileText, UserCheck, BookOpen, Building2, Eye,
    ArrowUpRight, Calendar, Award, Shield, Settings,
    AlertTriangle, Users, Layers, TrendingUp, GraduationCap,
    Star, Menu, X
} from "lucide-react";
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart as RPie, Pie, Cell,
    RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";

/* ─── DATA CONSTANTS REMOVED (NOW USING LIVE DATABASE PROPS) ─── */
const radarBSCS = [
    { skill: "Academic", value: 88 }, { skill: "Leadership", value: 75 },
    { skill: "Technical", value: 93 }, { skill: "Communication", value: 70 },
    { skill: "Research", value: 82 }, { skill: "Civic", value: 67 },
];
const radarBSIT = [
    { skill: "Academic", value: 82 }, { skill: "Leadership", value: 70 },
    { skill: "Technical", value: 88 }, { skill: "Communication", value: 74 },
    { skill: "Research", value: 75 }, { skill: "Civic", value: 72 },
];
const statusStyle = {
    "Dean's List": { bg: 'color-mix(in srgb, var(--primary), transparent 82%)', color: 'var(--secondary)', border: 'color-mix(in srgb, var(--primary), transparent 62%)' },
    "Graduating": { bg: "rgba(52,211,153,0.12)", color: "#34d399", border: "rgba(52,211,153,0.3)" },
    "Probation": { bg: "rgba(220,38,38,0.14)", color: "#fca5a5", border: "rgba(220,38,38,0.3)" },
    "At-Risk": { bg: "rgba(239,68,68,0.18)", color: "#f87171", border: "rgba(239,68,68,0.35)" },
    "Regular": { bg: 'color-mix(in srgb, var(--primary), transparent 92%)', color: 'var(--secondary)', border: 'color-mix(in srgb, var(--primary), transparent 82%)' },
};

/* ─── HELPERS ─── */
const Tag = ({ children, bg, color, border }) => (
    <span style={{
        fontSize: "9px", fontWeight: 700, padding: "3px 9px", borderRadius: 4,
        letterSpacing: ".08em", textTransform: "uppercase",
        background: bg, color, border: `1px solid ${border || "transparent"}`
    }}>{children}</span>
);

const SBadge = ({ status }) => {
    const s = statusStyle[status] || statusStyle["Regular"];
    return (
        <span style={{
            fontSize: "9px", fontWeight: 700, padding: "2px 8px", borderRadius: 20,
            background: s.bg, color: s.color, border: `1px solid ${s.border}`
        }}>{status}</span>
    );
};

/* ─── MAIN COMPONENT ─── */
export default function DeanDashboardMain() {
    const { props } = usePage();
    const customization = props.customization || {};
    const layout = customization.layout || 'classic';
    const isRight = layout === 'right';
    const hideSidebar = layout === 'topnav';

    // Alerts Integration
    const showAlerts = customization.showAlerts !== false;
    const alertMsg = customization.alertMessage || `Academic Year ${customization.academicYear || "2025–2026"} · ${customization.semester || "1st Semester"} is now active.`;
    const alertBg = customization.alertBg || "#0a1f0a";
    const alertBdr = customization.alertBorder || "#14532d55";
    const alertTxt = customization.alertText || "#4ade80";
    const alertIco = customization.alertIconColor || "#4ade80";
    const alertStyle = customization.alertStyle || "bar";
    const alertDismissable = customization.alertDismissable !== false;

    const [program, setProgram] = useState("BSCS");
    const [focused, setFocused] = useState(false);
    const [alertVisible, setAlertVisible] = useState(true);

    const stats = props.stats || {};
    const recentStudents = props.recentStudents || [];
    const recentFaculty = props.recentFaculty || [];
    const semTrendData = props.semTrend || [];
    const subjectPerfData = props.subjectPerf || [];
    const eventsData = props.events || [];
    
    const pendingItems = (props.pending || []).map((p, i) => ({
        ...p,
        icon: [FileText, Shield, Bell, UserCheck][i % 4] || FileText
    }));
    
    const students = recentStudents.length > 0 ? recentStudents.map(s => {
        const avg = s.grades && s.grades.length > 0 
            ? (s.grades.reduce((acc, g) => acc + (parseFloat(g.score) || 0), 0) / s.grades.length).toFixed(2)
            : '0.00';
        return {
            id: s.student_id || s.id,
            name: s.name || (s.first_name + ' ' + s.last_name),
            yr: s.year_level || '1st',
            gwa: avg,
            status: 'Regular',
            issue: null
        };
    }) : [];

    const faculty = recentFaculty.length > 0 ? recentFaculty.map(f => ({
        name: f.name,
        subjects: 'Assigned Subjects',
        units: 18,
        status: 'Full',
        rating: 4.5
    })) : [];
    const radar = program === "BSCS" ? radarBSCS : radarBSIT;
    
    const kpis = [
        { l: "Total Enrolled", v: stats.totalStudents || "0" },
        { l: "Faculty Members", v: stats.faculty_count || "0" },
        { l: "At-Risk Students", v: stats.atRiskStudents || "0" },
        { l: "Avg. Rating", v: Number(stats.avgGpa || 0).toFixed(2) },
        { l: "Sections", v: stats.activeSections || "0" }
    ];

    const handleExport = () => {
        window.location.href = route('reports.overall.pdf');
    };

    const livePieData = [
        { name: "BSCS", value: stats.bscs_count || 0, color: 'var(--primary)' },
        { name: "BSIT", value: stats.bsit_count || 0, color: 'var(--secondary)' },
        { name: "All Others", value: Math.max(0, (stats.totalStudents || 0) - ((stats.bscs_count || 0) + (stats.bsit_count || 0))), color: 'rgba(255,255,255,0.1)' },
    ];

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            overflow: 'hidden',
            background: 'var(--background)',
            flexDirection: isRight ? 'row-reverse' : 'row'
        }}>
            {!hideSidebar && <Sidebar />}

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <Topbar />

                {/* ── ALERTS BANNER ── */}
                {showAlerts && alertVisible && (alertStyle === "bar" || alertStyle === "banner") && (
                    <div style={{
                        background: alertBg, borderBottom: `1px solid ${alertBdr}`,
                        padding: alertStyle === "banner" ? "12px 24px" : "8px 24px",
                        display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
                        animation: "slide-down 0.4s ease-out"
                    }}>
                        {alertStyle === "banner" && (
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${alertIco}15`, border: `1px solid ${alertIco}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Bell size={14} color={alertIco} />
                            </div>
                        )}
                        {alertStyle === "bar" && <Bell size={12} color={alertIco} />}
                        <span style={{ fontSize: "11px", color: alertTxt, fontWeight: 600, flex: 1 }}>{alertMsg}</span>
                        {alertDismissable && (
                            <button onClick={() => setAlertVisible(false)} style={{ background: "transparent", border: "none", color: alertTxt, opacity: 0.5, cursor: "pointer", fontSize: "16px", padding: "0 4px" }}>
                                <X size={14} />
                            </button>
                        )}
                    </div>
                )}

                {/* Toast style alert */}
                {showAlerts && alertVisible && alertStyle === "toast" && (
                    <div style={{
                        position: "fixed", bottom: 24, right: 24, zIndex: 9999, width: 280,
                        background: alertBg, border: `1px solid ${alertBdr}`, borderRadius: 12,
                        padding: "16px", display: "flex", alignItems: "flex-start", gap: 12,
                        boxShadow: "0 10px 40px rgba(0,0,0,0.5)", animation: "slide-up 0.4s ease-out",
                        backdropFilter: "blur(10px)"
                    }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: `${alertIco}15`, border: `1px solid ${alertIco}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Bell size={16} color={alertIco} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "10px", fontWeight: 700, color: "#fff", marginBottom: 2, letterSpacing: ".1em", textTransform: "uppercase", opacity: 0.5 }}>System Alert</div>
                            <div style={{ fontSize: "11px", color: alertTxt, lineHeight: 1.5, fontWeight: 500 }}>{alertMsg}</div>
                        </div>
                        {alertDismissable && (
                            <button onClick={() => setAlertVisible(false)} style={{ background: "transparent", border: "none", color: alertTxt, opacity: 0.3, cursor: "pointer" }}>
                                <X size={14} />
                            </button>
                        )}
                    </div>
                )}

                <style>{`
                    @keyframes slide-down { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                    @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                `}</style>

                {/* ── CONTENT ── */}
                <div className="gg" style={{ padding: "24px 28px", position: "relative" }}>
                    {/* ambient glow */}
                    <div style={{
                        position: "fixed", top: "8%", right: "20%", width: 420, height: 420,
                        background: "color-mix(in srgb, var(--primary), transparent 97%)", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none"
                    }}></div>
                    <div style={{
                        position: "fixed", bottom: "12%", left: "35%", width: 280, height: 280,
                        background: "color-mix(in srgb, var(--secondary), transparent 97.5%)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none"
                    }}></div>

                    {/* ── PAGE HEADER ── */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 9 }}>
                                <Tag bg="color-mix(in srgb, var(--primary), transparent 86%)" color="var(--secondary)" border="color-mix(in srgb, var(--primary), transparent 70%)">AY {customization.academicYear || "2025–2026"}</Tag>
                                <Tag bg="rgba(255,255,255,0.06)" color="rgba(254,243,236,0.5)" border="rgba(255,255,255,0.1)">{customization.semester || "1st Semester"}</Tag>
                                <Tag bg="color-mix(in srgb, var(--primary), transparent 92%)" color="var(--secondary)" border="color-mix(in srgb, var(--primary), transparent 84%)">● Live</Tag>
                                <Tag bg="color-mix(in srgb, var(--primary), transparent 80%)" color="var(--secondary)" border="color-mix(in srgb, var(--primary), transparent 65%)">Dean's View</Tag>
                            </div>
                            <h1 className="serif" style={{ fontSize: 28, color: "var(--text-primary)", lineHeight: 1.1 }}>
                                Dean's Administrative<br />
                                <span style={{ color: "var(--primary)", fontStyle: "italic" }}>Control Center</span>
                            </h1>
                            <p style={{ fontSize: "11px", color: "rgba(254,243,236,0.32)", marginTop: 6 }}>
                                College of Computing Studies · Full department oversight
                            </p>
                        </div>
                        <div style={{ display: "flex", gap: 9, marginTop: 6 }}>
                            <button 
                                onClick={handleExport}
                                style={{
                                    display: "flex", alignItems: "center", gap: 7,
                                    padding: "9px 16px", borderRadius: 10, cursor: "pointer",
                                    background: "color-mix(in srgb, var(--primary), transparent 93%)", border: "1px solid color-mix(in srgb, var(--primary), transparent 80%)",
                                    color: "var(--text-muted)", fontSize: "12px", fontWeight: 600,
                                }}
                            >
                                <Download size={13} /> Export
                            </button>
                            <button style={{
                                display: "flex", alignItems: "center", gap: 7,
                                padding: "9px 18px", borderRadius: 10, cursor: "pointer",
                                background: "linear-gradient(135deg,var(--primary),var(--secondary))",
                                border: "none", color: "#fff", fontSize: "12px", fontWeight: 700,
                                boxShadow: "0 4px 16px color-mix(in srgb, var(--primary), transparent 70%)",
                            }}>
                                <Plus size={13} /> New Directive
                            </button>
                        </div>
                    </div>

                    {/* ── PENDING ACTIONS ── */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 18 }}>
                        {pendingItems.map((p, i) => (
                            <div key={i} className="pcard">
                                <div style={{
                                    width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                                    background: `color-mix(in srgb, ${p.color}, transparent 85%)`, border: `1px solid color-mix(in srgb, ${p.color}, transparent 80%)`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <p.icon size={15} color={p.color} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--text-muted)", lineHeight: 1.3 }}>{p.label}</div>
                                    <div className="mono" style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", marginTop: 3 }}>{p.count}</div>
                                </div>
                                <ChevronRight size={12} style={{ color: "color-mix(in srgb, var(--primary), transparent 70%)", flexShrink: 0 }} />
                            </div>
                        ))}
                    </div>

                    {/* ── PROGRAM TABS ── */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                        <span style={{ fontSize: "10px", fontWeight: 700, color: "rgba(254,243,236,0.38)", letterSpacing: ".1em", marginRight: 2 }}>PROGRAM:</span>
                        {["BSCS", "BSIT"].map(p => (
                            <button key={p} className="tab-btn" onClick={() => setProgram(p)} style={{
                                background: program === p ? "linear-gradient(135deg,var(--primary),var(--secondary))" : "color-mix(in srgb, var(--primary), transparent 93%)",
                                color: program === p ? "#fff" : "var(--text-muted)",
                                border: program === p ? "none" : "1px solid color-mix(in srgb, var(--primary), transparent 83%)",
                                boxShadow: program === p ? "0 3px 12px color-mix(in srgb, var(--primary), transparent 72%)" : "none",
                            }}>{p}</button>
                        ))}
                        <span style={{ marginLeft: "auto", fontSize: "11px", color: "rgba(254,243,236,0.3)", fontStyle: "italic" }}>
                            Bachelor of Science in {program === "BSCS" ? "Computer Science" : "Information Technology"}
                        </span>
                    </div>

                    {/* ── KPI CARDS ── */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 11, marginBottom: 16 }}>
                        {kpis.map((s, i) => (
                            <div key={i} className="kcard">
                                <div className="mono" style={{ fontSize: 28, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1, position: "relative", zIndex: 1 }}>{s.v}</div>
                                <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", marginTop: 5, position: "relative", zIndex: 1 }}>{s.l}</div>
                                <div style={{ height: 3, background: "color-mix(in srgb, var(--primary), transparent 90%)", borderRadius: 2, marginTop: 13, overflow: "hidden", position: "relative", zIndex: 1 }}>
                                    <div style={{
                                        height: "100%", borderRadius: 2,
                                        width: ["78%", "62%", "37%", "55%", "70%"][i],
                                        background: "linear-gradient(90deg,color-mix(in srgb, var(--primary), transparent 60%),var(--primary))",
                                    }}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── CHARTS ROW 1 ── */}
                    <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 12, marginBottom: 12 }}>

                        {/* Enrollment Trend */}
                        <div className="card" style={{ padding: 22, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                                <div>
                                    <div className="serif" style={{ fontSize: 16, color: "var(--text-primary)" }}>Enrollment Trend</div>
                                    <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: 2 }}>BSCS vs BSIT per semester</div>
                                </div>
                                <div style={{ display: "flex", gap: 12, fontSize: "10px" }}>
                                    {[["var(--primary)", "BSCS"], ["var(--secondary)", "BSIT"]].map(([c, l]) => (
                                        <span key={l} style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-muted)" }}>
                                            <div style={{
                                                width: 20, height: 2, borderRadius: 2, background: c,
                                                backgroundImage: l === "BSIT" ? `repeating-linear-gradient(90deg,${c} 0,${c} 4px,transparent 4px,transparent 7px)` : "none",
                                            }}></div>{l}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={semTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="color-mix(in srgb, var(--primary), transparent 94%)" vertical={false} />
                                    <XAxis dataKey="sem" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ background: "var(--surface)", border: "1px solid color-mix(in srgb, var(--primary), transparent 74%)", borderRadius: 10, fontSize: 11 }}
                                        labelStyle={{ color: "var(--primary)", fontWeight: 700 }} itemStyle={{ color: "var(--text-primary)" }} />
                                    <Line type="monotone" dataKey="bscs" stroke="var(--primary)" strokeWidth={2.5}
                                        dot={{ fill: "var(--primary)", r: 3, strokeWidth: 0 }} name="BSCS" />
                                    <Line type="monotone" dataKey="bsit" stroke="var(--secondary)" strokeWidth={2}
                                        strokeDasharray="5 3" dot={{ fill: "var(--secondary)", r: 3, strokeWidth: 0 }} name="BSIT" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Right column: Pie + Radar */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                            {/* Pie */}
                            <div className="card" style={{ padding: 18, flex: 1 }}>
                                <div className="serif" style={{ fontSize: 14, color: "var(--text-primary)", marginBottom: 12 }}>All Programs</div>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <ResponsiveContainer width={95} height={95}>
                                        <RPie>
                                            <Pie data={livePieData.map(d => ({ ...d, color: d.color.includes('var') ? (d.name === 'BSCS' ? (customization.primary || '#f97316') : (customization.secondary || '#fb923c')) : d.color }))} cx="50%" cy="50%" innerRadius={26} outerRadius={44} dataKey="value" paddingAngle={2}>
                                                {livePieData.map((e, i) => <Cell key={i} fill={e.color.includes('var') ? (e.name === 'BSCS' ? (customization.primary || '#f97316') : (customization.secondary || '#fb923c')) : e.color} />)}
                                            </Pie>
                                        </RPie>
                                    </ResponsiveContainer>
                                    <div style={{ flex: 1 }}>
                                        {livePieData.map((p, i) => (
                                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                                                <div style={{ width: 6, height: 6, borderRadius: 1, background: p.color, flexShrink: 0 }}></div>
                                                <span style={{ fontSize: "10px", color: "var(--text-muted)", flex: 1 }}>{p.name}</span>
                                                <span className="mono" style={{ fontSize: "10px", color: "var(--text-primary)", fontWeight: 700 }}>{p.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Radar */}
                            <div className="card" style={{ padding: 18, flex: 1, minWidth: 0 }}>
                                <div className="serif" style={{ fontSize: 14, color: "var(--text-primary)", marginBottom: 2 }}>{program} Competency</div>
                                <div style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: 6 }}>Avg. student profile</div>
                                <ResponsiveContainer width="100%" height={140}>
                                    <RadarChart data={radar}>
                                        <PolarGrid stroke="color-mix(in srgb, var(--primary), transparent 90%)" />
                                        <PolarAngleAxis dataKey="skill" tick={{ fill: "var(--text-muted)", fontSize: 9 }} />
                                        <Radar dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.15} strokeWidth={2} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* ── SUBJECT PERFORMANCE ── */}
                    <div className="card" style={{ padding: 22, marginBottom: 12, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                            <div>
                                <div className="serif" style={{ fontSize: 16, color: "#fef3ec" }}>Subject Performance</div>
                                <div style={{ fontSize: "10px", color: "rgba(254,243,236,0.3)", marginTop: 2 }}>Avg. scores — BSCS vs BSIT</div>
                            </div>
                            <div style={{ display: "flex", gap: 12, fontSize: "10px" }}>
                                {[["#f97316", "BSCS"], ["#fdba74", "BSIT"]].map(([c, l]) => (
                                    <span key={l} style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(254,243,236,0.4)" }}>
                                        <div style={{ width: 9, height: 3, borderRadius: 2, background: c }}></div>{l}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={subjectPerfData} barGap={3}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(249,115,22,0.05)" vertical={false} />
                                <XAxis dataKey="subject" tick={{ fill: "rgba(254,243,236,0.27)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis domain={[50, 100]} tick={{ fill: "rgba(254,243,236,0.27)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ background: "#1a0b03", border: "1px solid rgba(249,115,22,0.22)", borderRadius: 10, fontSize: 11 }}
                                    itemStyle={{ color: "#fef3ec" }} />
                                <Bar dataKey="bscs" fill="#f97316" radius={[4, 4, 0, 0]} barSize={18} opacity={0.9} name="BSCS" />
                                <Bar dataKey="bsit" fill="#fdba74" radius={[4, 4, 0, 0]} barSize={18} opacity={0.85} name="BSIT" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* ── BOTTOM GRID: Students · Faculty · Events ── */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

                        {/* Student Table */}
                        <div className="card" style={{ overflow: "hidden" }}>
                            <div style={{
                                padding: "15px 20px", borderBottom: "1px solid rgba(249,115,22,0.1)",
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                            }}>
                                <div>
                                    <div className="serif" style={{ fontSize: 15, color: "var(--text-primary)" }}>{program} Student Profiles</div>
                                    <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: 1 }}>GWA · Status · Issues</div>
                                </div>
                                <a href="#" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "10px", color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>
                                    All <ArrowUpRight size={11} />
                                </a>
                            </div>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid rgba(249,115,22,0.07)" }}>
                                        {["Student", "Yr", "GWA", "Status", "Issue", ""].map((h, i) => (
                                            <th key={i} style={{
                                                padding: "9px 15px", textAlign: "left", fontSize: "8px",
                                                fontWeight: 700, letterSpacing: ".1em",
                                                color: "rgba(249,115,22,0.38)", textTransform: "uppercase",
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((s, i) => (
                                        <tr key={i} className="trow">
                                            <td style={{ padding: "11px 15px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    <div style={{
                                                        width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                                                        background: "color-mix(in srgb, var(--primary), transparent 86%)",
                                                        border: "1px solid color-mix(in srgb, var(--primary), transparent 74%)",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        fontSize: "9px", fontWeight: 700, color: "var(--primary)",
                                                    }}>{s.name.split(" ").map(w => w[0]).join("").slice(0, 2)}</div>
                                                    <div>
                                                        <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>{s.name}</div>
                                                        <div style={{ fontSize: "9px", color: "var(--text-muted)" }}>{s.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: "11px 15px", fontSize: "11px", color: "var(--text-muted)" }}>{s.yr}</td>
                                            <td style={{ padding: "11px 15px" }}>
                                                <span className="mono" style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>{s.gwa}</span>
                                            </td>
                                            <td style={{ padding: "11px 15px" }}><SBadge status={s.status} /></td>
                                            <td style={{ padding: "11px 15px", fontSize: "10px", color: "var(--text-muted)" }}>
                                                {s.issue
                                                    ? <span style={{ color: "var(--danger)", fontWeight: 600 }}>{s.issue}</span>
                                                    : <span style={{ color: "var(--text-muted)", opacity: 0.5 }}>—</span>}
                                            </td>
                                            <td style={{ padding: "11px 15px" }}>
                                                <Eye size={12} style={{ color: "color-mix(in srgb, var(--primary), transparent 62%)", cursor: "pointer" }} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Right: Faculty + Events */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                            {/* Faculty Load */}
                            <div className="card" style={{ overflow: "hidden" }}>
                                <div style={{
                                    padding: "15px 20px", borderBottom: "1px solid rgba(249,115,22,0.1)",
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                }}>
                                    <div>
                                        <div className="serif" style={{ fontSize: 15, color: "#fef3ec" }}>{program} Faculty Load</div>
                                        <div style={{ fontSize: "10px", color: "rgba(254,243,236,0.28)", marginTop: 1 }}>Units · Status · Rating</div>
                                    </div>
                                    <a href="#" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "10px", color: "#fb923c", fontWeight: 700, textDecoration: "none" }}>
                                        All <ArrowUpRight size={11} />
                                    </a>
                                </div>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ borderBottom: "1px solid rgba(249,115,22,0.07)" }}>
                                            {["Faculty", "Units", "Status", "★"].map((h, i) => (
                                                <th key={i} style={{
                                                    padding: "8px 15px", textAlign: "left", fontSize: "8px",
                                                    fontWeight: 700, letterSpacing: ".1em",
                                                    color: "rgba(249,115,22,0.38)", textTransform: "uppercase",
                                                }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {faculty.map((f, i) => (
                                            <tr key={i} className="trow">
                                                <td style={{ padding: "10px 15px" }}>
                                                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#fef3ec" }}>{f.name}</div>
                                                    <div style={{ fontSize: "9px", color: "rgba(254,243,236,0.27)", marginTop: 1 }}>{f.subjects}</div>
                                                </td>
                                                <td style={{ padding: "10px 15px" }}>
                                                    <span className="mono" style={{ fontSize: "12px", fontWeight: 700, color: "#fb923c" }}>{f.units}</span>
                                                </td>
                                                <td style={{ padding: "10px 15px" }}>
                                                    <span style={{
                                                        fontSize: "9px", fontWeight: 700,
                                                        display: "inline-flex", alignItems: "center", gap: 4,
                                                        color: f.status === "Full" ? "#34d399" : "#fb923c",
                                                    }}>
                                                        <span style={{
                                                            width: 5, height: 5, borderRadius: "50%", display: "inline-block",
                                                            background: f.status === "Full" ? "#34d399" : "#fb923c"
                                                        }}></span>
                                                        {f.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "10px 15px" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                        <Star size={10} color="#f97316" fill="#f97316" />
                                                        <span className="mono" style={{ fontSize: "11px", fontWeight: 700, color: "#fef3ec" }}>{f.rating}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Events */}
                            <div className="card" style={{ padding: 18 }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                                    <div className="serif" style={{ fontSize: 15, color: "#fef3ec" }}>Events Calendar</div>
                                    <button style={{
                                        display: "flex", alignItems: "center", gap: 5,
                                        background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.19)",
                                        borderRadius: 7, padding: "4px 10px", color: "#fb923c",
                                        fontSize: "10px", fontWeight: 700, cursor: "pointer",
                                    }}>
                                        <Plus size={10} /> Add
                                    </button>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                    {eventsData.map((ev, i) => (
                                        <div key={i} className="erow">
                                            <div style={{
                                                width: 30, height: 30, borderRadius: 7, flexShrink: 0,
                                                background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}>
                                                <Calendar size={12} color="#f97316" />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{
                                                    fontSize: "12px", fontWeight: 600, color: "#fef3ec",
                                                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                                                }}>{ev.title}</div>
                                                <div style={{ fontSize: "9px", color: "rgba(254,243,236,0.3)", marginTop: 1 }}>{ev.dept}</div>
                                            </div>
                                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                                                <div className="mono" style={{
                                                    fontSize: "10px", fontWeight: 700,
                                                    color: ev.today ? "#34d399" : "#fb923c"
                                                }}>{ev.date}</div>
                                                <div style={{
                                                    fontSize: "8px", fontWeight: 700, marginTop: 2, letterSpacing: ".05em", textTransform: "uppercase",
                                                    color: ev.today ? "rgba(52,211,153,0.6)" : "rgba(254,243,236,0.22)",
                                                }}>{ev.today ? "TODAY" : "UPCOMING"}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,900&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:#2a1204; border-radius:2px; }

        .gg {
          background-image:
            linear-gradient(rgba(249,115,22,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249,115,22,0.022) 1px, transparent 1px);
          background-size:44px 44px;
        }

        .card {
          background: linear-gradient(145deg,rgba(249,115,22,0.07),rgba(0,0,0,0.3));
          border: 1px solid rgba(249,115,22,0.13);
          border-radius: 14px;
          transition: border-color .22s;
        }
        .card:hover { border-color: rgba(249,115,22,0.3); }

        .pcard {
          display:flex; align-items:center; gap:11px;
          padding:13px 15px; border-radius:11px;
          background:rgba(249,115,22,0.05);
          border:1px solid rgba(249,115,22,0.11);
          cursor:pointer; transition:all .2s;
        }
        .pcard:hover { background:rgba(249,115,22,0.1); border-color:rgba(249,115,22,0.26); }

        .kcard {
          background:linear-gradient(150deg,rgba(249,115,22,0.1),rgba(12,8,5,0.65));
          border:1px solid rgba(249,115,22,0.17);
          border-radius:16px; padding:20px 18px;
          position:relative; overflow:hidden;
          cursor:pointer; transition:all .28s;
        }
        .kcard::after {
          content:''; position:absolute;
          top:-42px; right:-42px;
          width:98px; height:98px; border-radius:50%;
          background:rgba(249,115,22,0.1);
          transition:all .38s;
        }
        .kcard:hover { transform:translateY(-2px); border-color:rgba(249,115,22,0.38); }
        .kcard:hover::after { transform:scale(1.5); }

        .trow { cursor:pointer; transition:background .15s; border-bottom:1px solid rgba(249,115,22,0.05); }
        .trow:hover { background:rgba(249,115,22,0.04); }

        .erow {
          display:flex; align-items:center; gap:10px;
          padding:9px 12px; border-radius:9px;
          background:rgba(249,115,22,0.05);
          border:1px solid rgba(249,115,22,0.09);
          cursor:pointer; transition:all .18s;
        }
        .erow:hover { background:rgba(249,115,22,0.1); border-color:rgba(249,115,22,0.26); }

        .tab-btn {
          padding:7px 22px; border-radius:9px;
          font-weight:700; font-size:13px;
          cursor:pointer; transition:all .2s;
          font-family:inherit;
        }

        .search-wrap {
          display:flex; align-items:center; gap:9px;
          padding:9px 14px; border-radius:11px;
          background:rgba(249,115,22,0.06);
          border:1px solid rgba(249,115,22,0.14);
          transition:all .2s;
        }
        .search-wrap.f { border-color:rgba(249,115,22,0.5); background:rgba(249,115,22,0.1); }
        .search-wrap input {
          background:transparent; border:none; outline:none;
          color:#fef3ec; font-size:13px; width:100%; font-family:inherit;
        }
        .search-wrap input::placeholder { color:rgba(254,243,236,0.27); }

        .mono { font-family:'Space Mono',monospace; }
        .serif { font-family:'Playfair Display',serif; }

        @keyframes pnc-pulse {
          0%,100% { box-shadow:0 0 0 0 rgba(249,115,22,0.5); }
          50%      { box-shadow:0 0 0 5px rgba(249,115,22,0); }
        }
        .pulse {
          width:7px; height:7px; border-radius:50%;
          background:#f97316; display:inline-block;
          animation:pnc-pulse 2s infinite;
        }
      `}</style>
            </div>
        </div>
    );
}