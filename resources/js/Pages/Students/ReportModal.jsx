import React, { useRef } from 'react';
import { X, ClipboardList, Printer, Users, CheckCircle, XCircle, GraduationCap, TrendingUp, Star, BookOpen, BarChart2, Calendar, ShieldCheck, Award, AlertCircle, Activity } from 'lucide-react';
import { GWA_COLOR, GWA_LABEL } from './GwaHelpers';

const STATUS_CFG = {
    enrolled:  { bg: "rgba(52,211,153,0.1)",  color: "#34d399", border: "rgba(52,211,153,0.28)",  dot: "#34d399",  label: "Enrolled"  },
    dropped:   { bg: "rgba(239,68,68,0.1)",   color: "#f87171", border: "rgba(239,68,68,0.28)",   dot: "#f87171",  label: "Dropped"   },
    graduated: { bg: "rgba(249,115,22,0.14)", color: "#fb923c", border: "rgba(249,115,22,0.3)",   dot: "#f97316",  label: "Graduated" },
};

export default function ReportModal({ students, filters, onClose, dbStats }) {
    const reportRef = useRef(null);
    const total     = students.length;
    const enrolled  = students.filter(s => s.enrollment_status === "enrolled").length;
    const dropped   = students.filter(s => s.enrollment_status === "dropped").length;
    const withGwa   = students.filter(s => s.gwa);
    const avgGwa    = withGwa.length
        ? (withGwa.reduce((a, s) => a + parseFloat(s.gwa), 0) / withGwa.length).toFixed(2)
        : "N/A";

    const trackBreakdown = students.reduce((acc, s) => {
        const k = s.year_level || s.grade_level || "Unknown";
        acc[k] = (acc[k] || 0) + 1;
        return acc;
    }, {});

    const genderBreakdown = students.reduce((acc, s) => {
        const k = s.gender || "Not Specified";
        acc[k] = (acc[k] || 0) + 1;
        return acc;
    }, {});

    const statusBreakdown = students.reduce((acc, s) => {
        const k = s.academic_status || "Other";
        acc[k] = (acc[k] || 0) + 1;
        return acc;
    }, {});

    // Aggregate stats for the overall report
    const auditStats = {
        totalAttendance: students.reduce((acc, s) => acc + (s.attendance?.length || 0), 0),
        totalHealth:     students.reduce((acc, s) => acc + (s.health_records?.length || 0), 0),
        totalAwards:     students.reduce((acc, s) => acc + (s.achievements?.length || 0), 0),
        totalActivities: students.reduce((acc, s) => acc + (s.student_activities?.length || 0), 0),
        totalViolations: students.reduce((acc, s) => acc + (s.behavior_logs?.filter(l => l.type === 'violation' || l.type === 'offense').length || 0), 0),
        highSeverity:    students.reduce((acc, s) => acc + (s.behavior_logs?.filter(l => l.severity === 'high' || l.severity === 'critical').length || 0), 0),
        clearedCount:    students.filter(s => s.clearance?.status === 'cleared').length,
        pendingCount:    students.filter(s => s.clearance?.status !== 'cleared').length,
        avgEngagement:   Math.round(students.reduce((acc, s) => acc + (s.engagement_score || 0), 0) / Math.max(total, 1)),
    };

    const topPerformers = [...students].sort((a, b) => (b.engagement_score || 0) - (a.engagement_score || 0)).slice(0, 3);

    // Use global stats if provided and we are in "Overall" mode (all students from page)
    const displayTotal    = (dbStats && students.length === 10) ? dbStats.total : total;
    const displayEnrolled = (dbStats && students.length === 10) ? dbStats.enrolled : enrolled;
    const displayDropped  = (dbStats && students.length === 10) ? dbStats.dropped : dropped;
    const displayAvgGwa   = (dbStats && students.length === 10) ? (parseFloat(dbStats.avgGwa) || 0).toFixed(2) : avgGwa;

    const summaryStats = [
        { label: "Total Students", val: displayTotal,     color: "#f97316", icon: Users },
        { label: "Enrolled",       val: displayEnrolled,  color: "#34d399", icon: CheckCircle },
        { label: "Dropped",        val: displayDropped,   color: "#f87171", icon: XCircle },
        { label: "Average GWA",    val: displayAvgGwa,    color: "#4a9eff", icon: TrendingUp },
    ];

    const handlePrint = () => {
        const content = reportRef.current.innerHTML;
        const win = window.open('', '_blank');
        win.document.write(`<html><head><title>Cohort Data Report</title><style>
            *{margin:0;padding:0;box-sizing:border-box}
            body{font-family:'Segoe UI',sans-serif;background:#fff;color:#1a1a1a;padding:40px}
            .rpt-header{border-bottom:4px solid #f97316;padding-bottom:20px;margin-bottom:30px;display:flex;justify-content:space-between;align-items:flex-start}
            .grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:15px;margin-bottom:30px}
            .grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-bottom:30px}
            .stat-card{border:1px solid #e5e7eb;border-radius:12px;padding:20px;text-align:center;background:#f9fafb}
            .stat-val{font-size:32px;font-weight:900;color:#f97316}
            .stat-lbl{font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;margin-top:4px;font-weight:600}
            .section-title{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#1a1a1a;border-bottom:2px solid #f3f4f6;padding-bottom:10px;margin:30px 0 15px}
            table{width:100%;border-collapse:collapse;font-size:12px;margin-top:10px}
            th{padding:12px 10px;background:#f9fafb;border-bottom:2px solid #e5e7eb;text-align:left;font-weight:700;font-size:10px;text-transform:uppercase;color:#4b5563}
            td{padding:12px 10px;border-bottom:1px solid #f3f4f6}
            tr:nth-child(even) td{background:#fcfcfc}
            .footer{margin-top:50px;padding-top:20px;border-top:1px solid #eee;font-size:11px;color:#999;text-align:center}
            .progress-bar{height:8px;background:#f3f4f6;border-radius:4px;overflow:hidden;margin-top:8px}
            .progress-fill{height:100%;background:#f97316;border-radius:4px}
            @media print{body{padding:20px}.stat-card{break-inside:avoid}}
        </style></head><body>${content}</body></html>`);
        win.document.close();
        win.focus();
        setTimeout(() => { win.print(); }, 500);
    };

    const now = new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric", hour: '2-digit', minute: '2-digit' });
    const activeFilters = Object.entries(filters).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(" · ");

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(8,5,2,0.92)", backdropFilter: "blur(12px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 16px", overflowY: "auto" }}>
            <div style={{ width: "100%", maxWidth: 1000, borderRadius: 24, background: "#0f0a05", border: "1px solid rgba(249,115,22,0.25)", boxShadow: "0 40px 100px rgba(0,0,0,0.9)", overflow: "hidden", marginBottom: 40 }}>
                {/* Top bar */}
                <div style={{ padding: "20px 32px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(90deg, rgba(249,115,22,0.12), transparent)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.3), rgba(249,115,22,0.1))", padding: 10, borderRadius: 12, boxShadow: "0 4px 12px rgba(249,115,22,0.2)" }}>
                            <BarChart2 size={22} color="#fb923c" />
                        </div>
                        <div>
                            <div style={{ fontSize: 16, fontWeight: 900, color: "#fef3ec", letterSpacing: "0.02em" }}>Institutional Cohort Analytics</div>
                            <div style={{ fontSize: 12, color: "rgba(254,243,236,0.45)" }}>
                                {dbStats && students.length === 10 ? "Institutional-Wide Audit" : "Selected Cohort Report"} · {displayTotal} Records Identified
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                        <button onClick={handlePrint} style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 20px", borderRadius: 12, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", fontSize: 13, fontWeight: 800, fontFamily: "inherit", transition: "transform 0.2s" }}>
                            <Printer size={15} /> Export Overall Report
                        </button>
                        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 12, padding: 10, cursor: "pointer", color: "rgba(254,243,236,0.6)" }}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Printable Content */}
                <div ref={reportRef} style={{ padding: "40px 48px", background: "#0f0a05" }}>
                    <div className="rpt-header" style={{ borderBottom: "3px solid #f97316", paddingBottom: 24, marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 800, color: "#fb923c", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 8 }}>College of Computing Studies · Institutional Research</div>
                            <div style={{ fontSize: 32, fontWeight: 900, color: "#fef3ec", fontFamily: "'Playfair Display', serif", marginBottom: 6 }}>Cohort Summary & Data Analytics</div>
                            <div style={{ fontSize: 13, color: "rgba(254,243,236,0.5)", marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
                                <span>Academic Year 2025-2026</span>
                                <span style={{ opacity: 0.3 }}>|</span>
                                <span>{now}</span>
                                {activeFilters && <><span style={{ opacity: 0.3 }}>|</span> <span style={{ color: "#fb923c", fontWeight: 700 }}>Data Filtered: {activeFilters}</span></>}
                            </div>
                        </div>
                        <div style={{ textAlign: "right", fontSize: 12, color: "rgba(254,243,236,0.4)" }}>
                            <div style={{ fontWeight: 800, color: "var(--primary)" }}>INTERNAL DOCUMENT</div>
                            <div>Reference: CCS-RPT-{Date.now().toString().slice(-8)}</div>
                        </div>
                    </div>

                    {/* Overall Summary */}
                    <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, color: "rgba(254,243,236,0.4)", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 10, marginBottom: 20 }}>Executive Summary Statistics</div>
                    <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
                        {summaryStats.map(({ label, val, color, icon: Icon }, i) => (
                            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${color}30`, borderRadius: 16, padding: "20px" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                                    <Icon size={18} color={color} />
                                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontWeight: 800 }}>CORE KPI</div>
                                </div>
                                <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", marginBottom: 4 }}>{val}</div>
                                <div style={{ fontSize: 11, color: "rgba(254,243,236,0.5)", textTransform: "uppercase", fontWeight: 700, letterSpacing: 1 }}>{label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Detailed Breakdowns */}
                    <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 24, marginBottom: 32 }}>
                        {/* Year Levels */}
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, color: "rgba(254,243,236,0.4)", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 10, marginBottom: 16 }}>Academic Standing Breakdown</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {Object.entries(trackBreakdown).map(([k, v]) => (
                                    <div key={k} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: "14px 18px", border: "1px solid rgba(255,255,255,0.05)" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: "#fef3ec" }}>{k}</span>
                                            <span style={{ fontSize: 16, fontWeight: 900, color: "#fb923c" }}>{v} <span style={{ fontSize: 10, color: "rgba(254,243,236,0.3)", fontWeight: 600 }}>({Math.round(v / total * 100)}%)</span></span>
                                        </div>
                                        <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden" }}>
                                            <div style={{ width: `${Math.round(v / total * 100)}%`, height: "100%", background: "linear-gradient(90deg,#f97316,#fb923c)" }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Demographics & Status */}
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, color: "rgba(254,243,236,0.4)", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 10, marginBottom: 16 }}>Demographics & Academic Status</div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: 18, border: "1px solid rgba(255,255,255,0.05)" }}>
                                    <div style={{ fontSize: 10, color: "rgba(254,243,236,0.4)", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Gender Distribution</div>
                                    {Object.entries(genderBreakdown).map(([k, v]) => (
                                        <div key={k} style={{ marginBottom: 10 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                                                <span style={{ color: "rgba(255,255,255,0.7)" }}>{k}</span>
                                                <span style={{ fontWeight: 800, color: "#fff" }}>{v}</span>
                                            </div>
                                            <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                                                <div style={{ width: `${Math.round(v / total * 100)}%`, height: "100%", background: k === 'Male' ? '#4a9eff' : '#f472b6', borderRadius: 2 }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: 18, border: "1px solid rgba(255,255,255,0.05)" }}>
                                    <div style={{ fontSize: 10, color: "rgba(254,243,236,0.4)", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Academic Status</div>
                                    {Object.entries(statusBreakdown).map(([k, v]) => (
                                        <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                            <span style={{ color: "rgba(255,255,255,0.6)", textTransform: "capitalize" }}>{k}</span>
                                            <span style={{ fontWeight: 800, color: "#fb923c" }}>{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Institutional Audit Summary */}
                    <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, color: "rgba(254,243,236,0.4)", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 10, marginBottom: 20 }}>Comprehensive Institutional Audit</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16, marginBottom: 32 }}>
                        {[
                            { label: "Attendance Logs", val: auditStats.totalAttendance, icon: Calendar, color: "#60a5fa" },
                            { label: "Health Records",  val: auditStats.totalHealth,     icon: ShieldCheck, color: "#f87171" },
                            { label: "Achievements",    val: auditStats.totalAwards,     icon: Award,       color: "#fbbf24" },
                            { label: "Violations",      val: auditStats.totalViolations, icon: AlertCircle, color: "#f43f5e" },
                            { label: "Clearance Rate",  val: `${total > 0 ? Math.round(auditStats.clearedCount / total * 100) : 0}%`, icon: CheckCircle, color: "#10b981" },
                        ].map((stat, i) => (
                            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${stat.color}20`, borderRadius: 16, padding: "16px", textAlign: "center" }}>
                                <div style={{ background: `${stat.color}15`, width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                                    <stat.icon size={16} color={stat.color} />
                                </div>
                                <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{stat.val}</div>
                                <div style={{ fontSize: 9, color: "rgba(254,243,236,0.4)", textTransform: "uppercase", fontWeight: 700, marginTop: 4 }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Engagement & Activity Metrics */}
                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, marginBottom: 32 }}>
                        <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 20, padding: 24, border: "1px solid rgba(255,255,255,0.05)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                                <TrendingUp size={18} color="#fb923c" />
                                <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.2, color: "#fef3ec" }}>Engagement Leaderboard (Top 3)</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {topPerformers.map((s, idx) => (
                                    <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 12 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{ width: 24, height: 24, borderRadius: "50%", background: idx === 0 ? "#fbbf24" : idx === 1 ? "#94a3b8" : "#92400e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: "#000" }}>{idx + 1}</div>
                                            <div>
                                                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{s.first_name} {s.last_name}</div>
                                                <div style={{ fontSize: 10, color: "rgba(254,243,236,0.4)" }}>{s.section?.name || s.year_level}</div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <div style={{ fontSize: 14, fontWeight: 900, color: "#fb923c" }}>{s.engagement_score || 0}</div>
                                            <div style={{ fontSize: 9, color: "rgba(254,243,236,0.3)", fontWeight: 700, textTransform: "uppercase" }}>Points</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 20, padding: 24, border: "1px solid rgba(255,255,255,0.05)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                                <Activity size={18} color="#34d399" />
                                <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.2, color: "#fef3ec" }}>Activity Catalog & Engagement</span>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div style={{ background: "rgba(52,211,153,0.05)", padding: 16, borderRadius: 16, textAlign: "center", border: "1px solid rgba(52,211,153,0.1)" }}>
                                    <div style={{ fontSize: 24, fontWeight: 900, color: "#34d399" }}>{auditStats.totalActivities}</div>
                                    <div style={{ fontSize: 9, color: "rgba(52,211,153,0.5)", textTransform: "uppercase", fontWeight: 700, marginTop: 4 }}>Total Logs</div>
                                </div>
                                <div style={{ background: "rgba(249,115,22,0.05)", padding: 16, borderRadius: 16, textAlign: "center", border: "1px solid rgba(249,115,22,0.1)" }}>
                                    <div style={{ fontSize: 24, fontWeight: 900, color: "#fb923c" }}>{auditStats.avgEngagement}</div>
                                    <div style={{ fontSize: 9, color: "rgba(249,115,22,0.5)", textTransform: "uppercase", fontWeight: 700, marginTop: 4 }}>Avg Score</div>
                                </div>
                            </div>
                            <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 12 }}>
                                <div style={{ fontSize: 10, color: "rgba(254,243,236,0.3)", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Violation Severity Analysis</div>
                                <div style={{ height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden", display: "flex" }}>
                                    <div style={{ width: `${(auditStats.highSeverity / Math.max(auditStats.totalViolations, 1)) * 100}%`, background: "#f43f5e" }} />
                                    <div style={{ flex: 1, background: "rgba(244,63,94,0.2)" }} />
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10 }}>
                                    <span style={{ color: "#f43f5e", fontWeight: 700 }}>{auditStats.highSeverity} Critical</span>
                                    <span style={{ color: "rgba(254,243,236,0.4)" }}>{auditStats.totalViolations - auditStats.highSeverity} Minor</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, color: "rgba(254,243,236,0.35)", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 8, marginBottom: 14 }}>Student Records ({total})</div>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                            <thead>
                                <tr>
                                    {["#", "Student Name", "Student ID", "Year/Section", "Enrollment", "GWA", "Audit Indicators", "Standing"].map(h => (
                                         <th key={h} style={{ padding: "9px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "rgba(254,243,236,0.35)", textTransform: "uppercase", letterSpacing: 0.8, borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>{h}</th>
                                     ))}
                                 </tr>
                            </thead>
                            <tbody>
                                {students.map((s, i) => {
                                    const sc = STATUS_CFG[s.enrollment_status] || STATUS_CFG.enrolled;
                                    const gColor = GWA_COLOR(s.gwa);
                                    
                                    // Audit Indicators
                                    const hasHealth = s.health_records?.length > 0;
                                    const hasAwards = s.achievements?.length > 0;
                                    const violations = s.behavior_logs?.filter(l => l.type === 'violation').length || 0;
                                    const isCleared = s.clearance?.status === 'cleared';

                                    return (
                                        <tr key={s.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                            <td style={{ padding: "10px", color: "rgba(254,243,236,0.25)", fontSize: 11 }}>{i + 1}</td>
                                            <td style={{ padding: "10px" }}>
                                                <div style={{ fontWeight: 700, color: "#fef3ec", fontSize: 13 }}>{s.first_name} {s.last_name}</div>
                                                <div style={{ fontSize: 10, color: "rgba(254,243,236,0.35)", marginTop: 1 }}>{s.user?.email}</div>
                                            </td>
                                            <td style={{ padding: "10px", fontFamily: "monospace", fontSize: 11, color: "#fb923c" }}>{s.student_id}</td>
                                            <td style={{ padding: "10px" }}>
                                                <div style={{ color: "rgba(254,243,236,0.7)", fontSize: 11 }}>{s.year_level || s.grade_level}</div>
                                                <div style={{ color: "rgba(254,243,236,0.4)", fontSize: 10 }}>{s.section?.name || "—"}</div>
                                            </td>
                                            <td style={{ padding: "10px" }}>
                                                <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, padding: "3px 9px", borderRadius: 20, fontSize: 10, fontWeight: 700 }}>{sc.label}</span>
                                            </td>
                                            <td style={{ padding: "10px", fontWeight: 800, color: gColor, fontSize: 14 }}>{s.gwa ? parseFloat(s.gwa).toFixed(2) : "—"}</td>
                                            <td style={{ padding: "10px" }}>
                                                <div style={{ display: "flex", gap: 6 }}>
                                                    {hasHealth && <ShieldCheck size={14} color="#f87171" title="Health Record Exist" />}
                                                    {hasAwards && <Award size={14} color="#fbbf24" title="Achievements" />}
                                                    {violations > 0 && <AlertCircle size={14} color="#f43f5e" title={`${violations} Violations`} />}
                                                    {isCleared ? <CheckCircle size={14} color="#10b981" title="Cleared" /> : <XCircle size={14} color="rgba(255,255,255,0.1)" title="Pending Clearance" />}
                                                </div>
                                            </td>
                                            <td style={{ padding: "10px", fontSize: 11, color: gColor }}>{s.gwa ? GWA_LABEL(s.gwa) : "—"}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div style={{ marginTop: 28, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(254,243,236,0.25)" }}>
                        <span>CCS ProFile System · College of Computing Studies</span>
                        <span>Generated: {now}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
