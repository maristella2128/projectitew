import React, { useState, useRef } from 'react';
import axios from 'axios';
import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm, router, usePage } from '@/inertia-adapter';
import {
    Search, Filter, Plus, Trash2, Edit,
    GraduationCap, Users,
    CheckCircle, XCircle, TrendingUp, Shield,
    Eye, BarChart2, FileText, SlidersHorizontal,
    ChevronDown, X, ClipboardList, Layers, History, 
    Activity, Award, AlertCircle, Calendar, ShieldCheck, Loader2
} from 'lucide-react';

import { C, css } from './Theme';
import ReportModal from './ReportModal';
import { GWA_COLOR, GWA_LABEL, Highlight } from './GwaHelpers';

/* ── STATUS CONFIG ── */
const STATUS_CFG = {
    enrolled: {
        bg: "rgba(52,211,153,0.1)", color: "#34d399", border: "rgba(52,211,153,0.28)", dot: "#34d399", label: "Enrolled"
    },
    dropped: {
        bg: "rgba(239,68,68,0.1)", color: "#f87171", border: "rgba(239,68,68,0.28)", dot: "#f87171", label: "Dropped"
    },
    graduated: {
        bg: "rgba(249,115,22,0.14)", color: "#fb923c", border: "rgba(249,115,22,0.3)", dot: "#f97316", label: "Graduated"
    },
};

const REG_STATUS_CFG = {
    registered: {
        bg: "rgba(52,211,153,0.1)", color: "#34d399", border: "rgba(52,211,153,0.28)", label: "Registered"
    },
    pending: {
        bg: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "rgba(251,191,36,0.28)", label: "Pending"
    },
    expired: {
        bg: "rgba(239,68,68,0.1)", color: "#f87171", border: "rgba(239,68,68,0.28)", label: "Code Expired"
    },
};

/* ── STAT CARD DATA ── */
const getStats = (dbStats, students) => {
    const total     = dbStats?.total     ?? students.total;
    const enrolled  = dbStats?.enrolled  ?? 0;
    const dropped   = dbStats?.dropped   ?? 0;
    const graduated = dbStats?.graduated ?? 0;

    return [
        {
            label: "Total Students", val: total,
            icon: Users, color: "#f97316",
            barW: "100%",
        },
        {
            label: "Enrolled", val: enrolled,
            icon: CheckCircle, color: "#34d399",
            barW: `${Math.round(enrolled / Math.max(total, 1) * 100)}%`,
        },
        {
            label: "Dropped", val: dropped,
            icon: XCircle, color: "#f87171",
            barW: `${Math.round(dropped / Math.max(total, 1) * 100)}%`,
        },
        {
            label: "Graduated", val: graduated,
            icon: GraduationCap, color: "#fb923c",
            barW: `${Math.round(graduated / Math.max(total, 1) * 100)}%`,
        },
    ];
};

/* ── MAIN COMPONENT ── */
export default function StudentIndex({ students, filters, skillOptions, activityOptions, stats: dbStats }) {
    const { flash } = usePage().props;
    const { data, setData, get } = useForm({
        search:      filters.search      || '',
        grade_level: filters.grade_level || '',
        status:      filters.status      || '',
        skill:       filters.skill       || '',
        activity:    filters.activity    || '',
        gwa_min:     filters.gwa_min     || '',
        gwa_max:     filters.gwa_max     || '',
        section:     filters.section     || '',
    });

    const [showReport,   setShowReport]   = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selected,     setSelected]     = useState(new Set());
    const [activeShortcut, setActiveShortcut] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('students.index'));
    };

    const handleReset = () => { router.get(route('students.index')); };

    const toggleSelect = (id) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    const selectAll    = () => setSelected(new Set(students.data.map(s => s.id)));
    const clearSel     = () => setSelected(new Set());

    const [allStudents, setAllStudents] = useState(null);
    const [loadingAll, setLoadingAll] = useState(false);

    const handleOpenReport = async () => {
        if (selected.size > 0) {
            setAllStudents(students.data.filter(s => selected.has(s.id)));
            setShowReport(true);
        } else {
            setLoadingAll(true);
            try {
                const res = await axios.get(route('students.report-data'), { params: filters });
                setAllStudents(res.data);
                setShowReport(true);
            } catch (err) {
                console.error("Failed to fetch report data", err);
                // Fallback to current page
                setAllStudents(students.data);
                setShowReport(true);
            } finally {
                setLoadingAll(false);
            }
        }
    };

    const hasFilters     = Object.values(filters).some(v => v);
    const activeCount    = Object.values(filters).filter(v => v).length;

    const stats = getStats(dbStats, students);

    const [deleteTarget, setDeleteTarget] = useState(null);

    const requireDelete = (student) => setDeleteTarget(student);

    const confirmDelete = () => {
        if (!deleteTarget) return;
        router.delete(route('students.destroy', deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    };

    return (
        <AppLayout title="Students" noPadding>
            <style>{css}</style>
            <div className="si-root">
                <div className="si-grid" />
                <div className="si-content" style={{ flex: 1 }}>

                    {/* ── REGISTRATION CODE ALERT ── */}
                    {flash.registration_code && (
                        <div className="si-fade" style={{ marginBottom: 24 }}>
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(52,211,153,0.15), rgba(16,185,129,0.05))',
                                border: '1px solid rgba(52,211,153,0.3)',
                                borderRadius: '16px',
                                padding: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                            }}>
                                <div style={{
                                    background: '#10b981',
                                    color: 'white',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(16,185,129,0.4)'
                                }}>
                                    <Shield size={24} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ color: '#34d399', fontWeight: 900, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                                        Student Enrolled Successfully
                                    </h4>
                                    <p style={{ color: 'rgba(254, 243, 236, 0.7)', fontSize: '12px' }}>
                                        Give this code to the student so they can register their account:
                                    </p>
                                </div>
                                <div style={{
                                    background: 'rgba(0,0,0,0.3)',
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    border: '1px dashed rgba(52,211,153,0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <code style={{
                                        fontFamily: 'monospace',
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        color: '#34d399',
                                        letterSpacing: '0.2em'
                                    }}>
                                        {flash.registration_code}
                                    </code>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            navigator.clipboard.writeText(flash.registration_code);
                                            alert('Code copied to clipboard!');
                                        }}
                                        style={{
                                            background: 'rgba(52,211,153,0.1)',
                                            border: 'none',
                                            color: '#34d399',
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            fontSize: '10px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── PAGE HEADER ── */}
                    <div className="si-hdr si-fade">
                        <div>
                            <div className="si-hdr-tags">
                                <span className="si-tag" style={{ background: "rgba(249,115,22,0.14)", color: "#fb923c", border: "1px solid rgba(249,115,22,0.28)" }}>
                                    CCS · ProFile
                                </span>
                                <span className="si-tag" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(254,243,236,0.45)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                    Student Registry
                                </span>
                                <span className="si-tag" style={{ background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" }}>
                                    ● Live
                                </span>
                                {hasFilters && (
                                    <span className="si-tag" style={{ background: "rgba(249,115,22,0.1)", color: "#fb923c", border: "1px solid rgba(249,115,22,0.25)" }}>
                                        {activeCount} filter{activeCount !== 1 ? "s" : ""} active
                                    </span>
                                )}
                            </div>
                            <h1 className="si-hdr-title">
                                Student<br />
                                <span>Registry</span>
                            </h1>
                            <p className="si-hdr-sub">
                                College of Computing Studies · Manage and monitor all student profiles and academic statuses
                            </p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                            <Link href={route('students.create')} className="si-enroll-btn" style={{ borderRadius: `var(--radius, 11px)` }}>
                                <Plus size={15} /> Enroll New Student
                            </Link>
                            <button
                                onClick={handleOpenReport}
                                disabled={loadingAll}
                                style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: `var(--radius, 10px)`, cursor: loadingAll ? "wait" : "pointer", background: C.glow, border: `1px solid ${C.pbdr}`, color: C.orange2, fontSize: 12, fontWeight: 700, fontFamily: "inherit", opacity: loadingAll ? 0.7 : 1 }}
                            >
                                {loadingAll ? <Loader2 size={14} className="si-spin" /> : <BarChart2 size={14} />} 
                                {loadingAll ? "Aggregating Data..." : "Generate Report"}
                                {selected.size > 0 && <span style={{ background: C.pbdr, padding: "1px 7px", borderRadius: 20, fontSize: 10 }}>{selected.size}</span>}
                            </button>
                        </div>
                    </div>

                    {/* ── STAT CARDS ── */}
                    <div className="si-stats si-fade si-fade-1">
                        {stats.map((s, i) => (
                            <div key={i} className="si-stat">
                                <div className="si-stat-icon" style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                                    <s.icon size={14} color={s.color} />
                                </div>
                                <div className="si-stat-val">{s.val}</div>
                                <div className="si-stat-lbl">{s.label}</div>
                                <div className="si-stat-bar">
                                    <div className="si-stat-bar-fill" style={{ width: s.barW, background: `linear-gradient(90deg,${s.color}55,${s.color})` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── FILTER BAR ── */}
                    <form onSubmit={handleSearch}>
                        <div className="si-filter si-fade si-fade-2" style={{ flexWrap: "wrap", gap: 10 }}>
                            {/* Row 1: Search + Advanced toggle */}
                            <div style={{ display: "flex", gap: 10, width: "100%", alignItems: "center" }}>
                                <span className="si-filter-label">
                                    <Filter size={10} style={{ display: "inline", marginRight: 5, verticalAlign: "middle" }} />
                                    Filters
                                </span>
                                <div className="si-search-wrap" style={{ flex: 2 }}>
                                    <Search size={13} color="rgba(249,115,22,0.45)" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, student ID, or email…"
                                        value={data.search}
                                        onChange={e => setData('search', e.target.value)}
                                    />
                                    {data.search && (
                                        <button type="button" onClick={() => setData('search', '')} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(254,243,236,0.3)", padding: 0 }}>
                                            <X size={13} />
                                        </button>
                                    )}
                                </div>
                                <select className="si-select" value={data.grade_level} onChange={e => setData('grade_level', e.target.value)}>
                                    <option value="">All Year Levels</option>
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                    <option value="Irregular">Irregular</option>
                                </select>
                                <select className="si-select" value={data.status} onChange={e => setData('status', e.target.value)}>
                                    <option value="">All Statuses</option>
                                    <option value="enrolled">Enrolled</option>
                                    <option value="dropped">Dropped</option>
                                    <option value="graduated">Graduated</option>
                                </select>
                                <select className="si-select" value={data.skill} onChange={e => setData('skill', e.target.value)}>
                                    <option value="">All Skills</option>
                                    {skillOptions?.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <select className="si-select" value={data.activity} onChange={e => setData('activity', e.target.value)}>
                                    <option value="">All Activities</option>
                                    {activityOptions?.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setShowAdvanced(p => !p)}
                                    style={{ display: "flex", alignItems: "center", gap: 6, background: showAdvanced ? "rgba(249,115,22,0.1)" : "none", border: `1px solid ${showAdvanced ? "rgba(249,115,22,0.35)" : "rgba(255,255,255,0.1)"}`, borderRadius: 8, padding: "7px 13px", color: showAdvanced ? "#fb923c" : "rgba(254,243,236,0.5)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                                >
                                    <SlidersHorizontal size={13} /> Advanced
                                    <ChevronDown size={12} style={{ transform: showAdvanced ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                                </button>
                            </div>

                            {/* Row 2: Advanced filters */}
                            {showAdvanced && (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, width: "100%", paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                    <div>
                                        <label style={{ fontSize: 10, color: "rgba(254,243,236,0.35)", textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 5 }}>GWA Min</label>
                                        <input type="number" step="0.01" min="1.0" max="5.0" placeholder="e.g. 1.00" value={data.gwa_min} onChange={e => setData('gwa_min', e.target.value)} className="si-select" style={{ width: "100%" }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 10, color: "rgba(254,243,236,0.35)", textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 5 }}>GWA Max</label>
                                        <input type="number" step="0.01" min="1.0" max="5.0" placeholder="e.g. 3.00" value={data.gwa_max} onChange={e => setData('gwa_max', e.target.value)} className="si-select" style={{ width: "100%" }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 10, color: "rgba(254,243,236,0.35)", textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 5 }}>Section</label>
                                        <input type="text" placeholder="e.g. BSIT-1A" value={data.section} onChange={e => setData('section', e.target.value)} className="si-select" style={{ width: "100%" }} />
                                    </div>
                                    <div style={{ display: "flex", alignItems: "flex-end" }}>
                                        <button type="button" onClick={handleReset} style={{ width: "100%", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", borderRadius: 9, padding: "9px 12px", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                            <X size={12} /> Reset All Filters
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Row 3: Action row */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <button type="submit" className="si-filter-btn">
                                        <Search size={12} /> Apply Filters
                                    </button>
                                    <span style={{ fontSize: 12, color: "rgba(254,243,236,0.35)" }}>
                                        {students.total} result{students.total !== 1 ? "s" : ""}{hasFilters && " (filtered)"}
                                    </span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    {selected.size > 0 && <span style={{ fontSize: 12, color: "#fb923c" }}>{selected.size} selected</span>}
                                    <button type="button" onClick={selectAll} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 12px", color: "rgba(254,243,236,0.5)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Select All</button>
                                    {selected.size > 0 && (
                                        <button type="button" onClick={clearSel} style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: 8, padding: "6px 12px", color: "#f87171", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Clear</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>


                    {/* ── STUDENT TABLE ── */}
                    <div className="si-card si-fade si-fade-3">
                        {/* Card header */}
                        <div className="si-card-hdr">
                            <div>
                                <div className="si-card-title">Student Profiles</div>
                                <div className="si-card-sub">GWA · Status · Enrollment · Academic Standing</div>
                            </div>
                            <span className="si-card-count">
                                {students.total} students
                            </span>
                        </div>

                        {/* Table */}
                        <div style={{ overflowX: "auto" }}>
                            <table className="si-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: 36 }}></th>
                                        <th>Student Info</th>
                                        <th>LRN / ID</th>
                                        <th>Year Level &amp; Section</th>
                                        <th>Status</th>
                                        <th>GWA</th>
                                        <th>Skills / Activities</th>
                                        <th>Registration</th>
                                        <th style={{ textAlign: "right" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.data.map((student, idx) => {
                                        const initials = `${student.first_name[0]}${student.last_name[0]}`;
                                        const statusKey = student.enrollment_status;
                                        const sc = STATUS_CFG[statusKey] || STATUS_CFG.enrolled;
                                        const regSc = REG_STATUS_CFG[student.registration_status] || REG_STATUS_CFG.registered;
                                        const isSel = selected.has(student.id);
                                        return (
                                            <tr key={student.id} className="si-row" onClick={() => toggleSelect(student.id)} style={{ cursor: "pointer", background: isSel ? "rgba(249,115,22,0.07)" : undefined }}>
                                                {/* Checkbox */}
                                                <td className="si-td">
                                                    <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${isSel ? "#f97316" : "rgba(255,255,255,0.15)"}`, background: isSel ? "#f97316" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", flexShrink: 0 }}>
                                                        {isSel && <span style={{ color: "#fff", fontSize: 10, fontWeight: 900 }}>✓</span>}
                                                    </div>
                                                </td>
                                                {/* Student Info */}
                                                <td className="si-td">
                                                    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                                                        <div className="si-avatar">{initials}</div>
                                                        <div>
                                                            <div className="si-name">
                                                                {student.first_name} {student.last_name}
                                                            </div>
                                                            <div className="si-email">{student.user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* LRN / ID */}
                                                <td className="si-td">
                                                    <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 800, color: "#fb923c", letterSpacing: "0.05em" }}>
                                                        {student.student_id || student.lrn}
                                                    </span>
                                                </td>

                                                {/* Year Level & Section */}
                                                <td className="si-td">
                                                    <div className="si-grade">{student.year_level || student.grade_level}</div>
                                                    <div className="si-section">
                                                        {student.section?.name || 'Unassigned'}
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td className="si-td">
                                                    <span className="si-badge" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                                                        <span className="si-badge-dot" style={{ background: sc.dot }} />
                                                        {sc.label}
                                                    </span>
                                                </td>

                                                {/* GWA */}
                                                <td className="si-td">
                                                    {student.gwa ? (
                                                        <>
                                                            <span style={{ fontWeight: 800, color: GWA_COLOR(student.gwa), fontSize: 16 }}>
                                                                {parseFloat(student.gwa).toFixed(2)}
                                                            </span>
                                                            <div style={{ fontSize: 10, color: GWA_COLOR(student.gwa), opacity: 0.75, marginTop: 1 }}>
                                                                {GWA_LABEL(student.gwa)}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <span style={{ color: "rgba(254,243,236,0.2)", fontSize: 13 }}>—</span>
                                                    )}
                                                </td>

                                                {/* Skills / Activities */}
                                                <td className="si-td">
                                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                                        {(Array.isArray(student.skills) ? student.skills : (student.skills ? student.skills.split(',') : [])).slice(0, 2).map((sk, i) => (
                                                            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", background: "rgba(167,139,250,0.1)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.2)" }}>
                                                                {sk.trim()}
                                                            </span>
                                                        ))}
                                                        {(Array.isArray(student.activities) ? student.activities : (student.activities ? student.activities.split(',') : [])).slice(0, 1).map((ac, i) => (
                                                            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" }}>
                                                                {ac.trim()}
                                                            </span>
                                                        ))}
                                                        {(() => {
                                                            const sCount = (Array.isArray(student.skills) ? student.skills : (student.skills ? student.skills.split(',') : [])).length;
                                                            const aCount = (Array.isArray(student.activities) ? student.activities : (student.activities ? student.activities.split(',') : [])).length;
                                                            const extra = (sCount + aCount) - 3;
                                                            return extra > 0 ? (
                                                                <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: "rgba(255,255,255,0.05)", color: "rgba(254,243,236,0.35)", border: "1px solid rgba(255,255,255,0.08)" }}>+{extra} more</span>
                                                            ) : null;
                                                        })()}
                                                        {!student.skills && !student.activities && (
                                                            <span style={{ fontSize: 11, color: "rgba(254,243,236,0.2)" }}>—</span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Registration Status */}
                                                <td className="si-td">
                                                    <span className="si-badge" style={{ background: regSc.bg, color: regSc.color, border: `1px solid ${regSc.border}`, padding: '4px 12px', borderRadius: '30px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                        {regSc.label}
                                                    </span>
                                                    {student.registration_status !== 'registered' && student.registration_code && (
                                                        <div style={{ marginTop: 6, fontFamily: 'monospace', fontSize: '10px', color: '#f97316', letterSpacing: '0.1em', fontWeight: 'bold' }}>
                                                            {student.registration_code}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="si-td" style={{ textAlign: "right" }}>
                                                    <div className="si-actions" style={{ position: 'relative' }}>
                                                        <button
                                                            className="si-action-btn shortcuts"
                                                            title="Registry Shortcuts"
                                                            onClick={(e) => { 
                                                                e.stopPropagation(); 
                                                                setActiveShortcut(activeShortcut === student.id ? null : student.id); 
                                                            }}
                                                            style={{ background: activeShortcut === student.id ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.03)", color: activeShortcut === student.id ? "#f97316" : "rgba(254,243,236,0.4)" }}
                                                        >
                                                            <Layers size={14} />
                                                        </button>

                                                        {activeShortcut === student.id && (
                                                            <div className="si-shortcut-menu si-fade-in" style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, zIndex: 100, background: '#1a120b', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 16, width: 240, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}>
                                                                <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(249,115,22,0.1)', background: 'rgba(249,115,22,0.03)' }}>
                                                                    <div style={{ fontSize: 10, color: 'rgba(249,115,22,0.6)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Comprehensive Registry</div>
                                                                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{student.first_name} {student.last_name}</div>
                                                                </div>
                                                                <div style={{ padding: 6 }}>
                                                                    {[
                                                                        { label: 'Academic History', icon: GraduationCap, color: '#f97316', href: route('students.show', student.id) },
                                                                        { label: 'Enrollment History', icon: History, color: '#34d399', href: route('enrollment-history.index', { student_id: student.id }) },
                                                                        { label: 'Attendance Record', icon: Calendar, color: '#60a5fa', href: route('attendance.student-history', student.id) },
                                                                        { label: 'Health Clinical Log', icon: ShieldCheck, color: '#f87171', href: route('health.index', { student_id: student.id }) },
                                                                        { label: 'Achievements', icon: Award, color: '#fbbf24', href: route('achievements.index') },
                                                                        { label: 'Activity Catalog', icon: Activity, color: '#a78bfa', href: route('activities.index') },
                                                                        { label: 'Engagement Board', icon: BarChart2, color: '#fb923c', href: route('leaderboard.index') },
                                                                        { label: 'Violations & Conduct', icon: AlertCircle, color: '#f43f5e', href: route('conduct.student', student.id) },
                                                                        { label: 'Clearance Status', icon: CheckCircle, color: '#10b981', href: route('clearance.index') },
                                                                    ].map((item, i) => (
                                                                        <Link 
                                                                            key={i}
                                                                            href={item.href}
                                                                            className="si-shortcut-item"
                                                                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, textDecoration: 'none', transition: 'all 0.2s' }}
                                                                        >
                                                                            <item.icon size={14} color={item.color} />
                                                                            <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(254,243,236,0.7)' }}>{item.label}</span>
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <Link
                                                            href={route('students.show', student.id)}
                                                            className="si-action-btn view"
                                                            title="View Profile"
                                                            onClick={e => e.stopPropagation()}
                                                        >
                                                            <Eye size={14} />
                                                        </Link>
                                                        <Link
                                                            href={route('students.edit', student.id)}
                                                            className="si-action-btn edit"
                                                            title="Edit Student"
                                                            onClick={e => e.stopPropagation()}
                                                        >
                                                            <Edit size={14} />
                                                        </Link>
                                                        <button
                                                            className="si-action-btn del"
                                                            title="Delete"
                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); requireDelete(student); }}
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {/* Empty state */}
                                    {students.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5}>
                                                <div className="si-empty">
                                                    <div className="si-empty-icon">
                                                        <Users size={26} color="rgba(249,115,22,0.5)" />
                                                    </div>
                                                    <div className="si-empty-title">No student records found</div>
                                                    <div className="si-empty-sub">
                                                        Try adjusting your search or filters to find students
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── PAGINATION ── */}
                    <div className="si-pager si-fade si-fade-4">
                        <p className="si-pager-info">
                            Showing {students.from}–{students.to} of {students.total} students
                        </p>
                        <div className="si-pager-links">
                            {students.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`si-pager-btn ${link.active ? 'active' :
                                        link.url ? 'inactive' : 'disabled'
                                        }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* ── DELETE MODAL OVERLAY ── */}
            {deleteTarget && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(12, 8, 5, 0.8)', backdropFilter: 'blur(5px)' }}>
                    <div className="si-card si-fade" style={{ background: '#160e08', padding: 32, width: '100%', maxWidth: 420, border: '1px solid rgba(239, 68, 68, 0.3)', boxShadow: '0 24px 48px rgba(0,0,0,0.7)', borderRadius: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: 10, borderRadius: 12 }}>
                                <Trash2 size={24} />
                            </div>
                            <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 20, fontWeight: 900, color: '#fef3ec', fontStyle: 'italic', margin: 0 }}>
                                Confirm Archive
                            </h3>
                        </div>
                        
                        <p style={{ color: 'rgba(254, 243, 236, 0.6)', fontSize: 13, lineHeight: 1.6, marginBottom: 24, paddingLeft: 4 }}>
                            Are you absolutely sure you want to permanently delete <strong style={{ color: '#fef3ec' }}>{deleteTarget.first_name} {deleteTarget.last_name}</strong>? This action cannot be undone and will permanently remove all associated academic data.
                        </p>
                        
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
                            <button 
                                onClick={() => setDeleteTarget(null)}
                                className="si-enroll-btn secondary"
                                style={{ padding: '9px 18px' }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="si-enroll-btn"
                                style={{ background: 'linear-gradient(135deg, #ef4444, #991b1b)', boxShadow: '0 4px 18px rgba(239, 68, 68, 0.3)' }}
                            >
                                <Trash2 size={14} /> Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* ── FLOATING SELECTION BAR ── */}
            {selected.size > 0 && (
                <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 100 }}>
                    <div style={{ background: "#130c06", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 14, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 16px 48px rgba(0,0,0,0.6)" }}>
                        <span style={{ fontSize: 13, color: "#fb923c", fontWeight: 700 }}>{selected.size} selected</span>
                        <button onClick={handleOpenReport} disabled={loadingAll} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 9, border: "none", cursor: loadingAll ? "wait" : "pointer", background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: "inherit", opacity: loadingAll ? 0.7 : 1 }}>
                            {loadingAll ? <Loader2 size={13} className="si-spin" /> : <FileText size={13} />} 
                            {loadingAll ? "Preparing..." : "Generate Report"}
                        </button>
                        <button onClick={clearSel} style={{ background: "none", border: "none", color: "rgba(254,243,236,0.3)", cursor: "pointer", padding: 4 }}>
                            <X size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* ── REPORT MODAL ── */}
            {showReport && (
                <ReportModal
                    students={allStudents}
                    filters={filters}
                    dbStats={dbStats}
                    onClose={() => setShowReport(false)}
                />
            )}
        </AppLayout>
    );
}