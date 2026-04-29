import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Plus, Award, AlertCircle, Save, X, Filter,
    Layers, User, CheckCircle, ShieldCheck,
    ChevronLeft, ChevronRight, ExternalLink, Shield,
    Trash2, Search, TrendingDown, TrendingUp, Clock, AlertTriangle, BookOpen, Calendar, Info, Users
} from 'lucide-react';
import Modal from '@/Components/Modal';

/* ──────────────────────────────────────────────────────────────────────────
   DESIGN SYSTEM
   ────────────────────────────────────────────────────────────────────────── */
const C = {
    bg: '#0c0805',
    surf: '#160e08',
    surf2: '#1c1208',
    surf3: '#211408',
    bdr: '#2a1508',
    bdr2: '#3a1e0a',
    bdr3: 'rgba(249,115,22,0.25)',
    orange: '#f97316',
    o2: '#fb923c',
    o3: '#fdba74',
    txt: '#fef3ec',
    muted: 'rgba(254,243,236,0.35)',
    dim: 'rgba(254,243,236,0.18)',
    faint: 'rgba(254,243,236,0.06)',
    green: '#10b981',
    amber: '#f59e0b',
    red: '#ef4444',
};

const sevColor = s => s === 'high' ? C.red : s === 'medium' ? C.amber : C.green;
const statusColor = s => {
    if (s === 'resolved') return C.green;
    if (s === 'dismissed') return C.muted;
    if (s === 'escalated') return C.red;
    return C.amber;
};

/* ─── CSS ───────────────────────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,900&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');
*,*::before,*::after{box-sizing:border-box;}

.cr-root{background:${C.bg};min-height:100vh;flex:1;display:flex;flex-direction:column;font-family:'DM Sans',system-ui,sans-serif;color:${C.txt};padding:32px 40px 80px;position:relative;overflow-x:hidden;}
.cr-grid{position:fixed;inset:0;pointer-events:none;z-index:0;background-size:56px 56px;background-image:linear-gradient(${C.dim} 1px,transparent 1px),linear-gradient(90deg,${C.dim} 1px,transparent 1px);opacity:0.18;}
.cr-orb1{position:fixed;top:-10%;right:-5%;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(249,115,22,0.09) 0%,transparent 70%);pointer-events:none;z-index:0;}
.cr-content{position:relative;z-index:1;max-width:1500px;margin:0 auto;width:100%;animation:fadeUp 0.5s cubic-bezier(0.16,1,0.3,1);}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

/* ── Metrics ── */
.cr-stat{background:${C.surf};border:1px solid ${C.bdr};border-radius:24px;padding:22px 26px;position:relative;overflow:hidden;transition:all .35s cubic-bezier(0.16,1,0.3,1);}
.cr-stat:hover{border-color:rgba(249,115,22,0.25);transform:translateY(-3px);box-shadow:0 16px 40px rgba(0,0,0,0.45);}
.cr-stat-icon{position:absolute;top:16px;right:16px;opacity:0.07;}
.cr-stat-label{font-family:'Space Mono',monospace;font-size:9px;font-weight:700;color:${C.muted};text-transform:uppercase;letter-spacing:.15em;margin-bottom:10px;}
.cr-stat-val{font-family:'Playfair Display',serif;font-size:38px;font-weight:900;line-height:1;}

/* ── Distributions ── */
.cr-dist-wrap{background:${C.surf};border:1px solid ${C.bdr};border-radius:20px;padding:18px 24px;margin-bottom:26px;}
.cr-dist-row{margin-bottom:14px;}
.cr-dist-row:last-child{margin-bottom:0;}
.cr-dist-label{display:flex;justify-content:space-between;margin-bottom:8px;font-family:'Space Mono';font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${C.muted};}
.cr-dist-track{height:6px;border-radius:4px;background:${C.faint};overflow:hidden;display:flex;}
.cr-dist-seg{transition:width .7s cubic-bezier(.4,0,.2,1);}

/* ── Filter Grid ── */
.cr-filters-grid{display:grid;grid-template-columns:repeat(3, 1fr);gap:12px;margin-bottom:18px;}
.cr-fbox{background:${C.surf};border:1px solid ${C.bdr};border-radius:14px;padding:12px 16px;display:flex;align-items:center;gap:10px;transition:border-color .2s;}
.cr-fbox:focus-within{border-color:${C.orange};box-shadow:0 0 0 3px rgba(249,115,22,0.08);}
.cr-finput{flex:1;background:transparent;border:none;outline:none;font-family:'DM Sans';font-size:13px;font-weight:600;color:${C.txt};}
.cr-finput option{background:${C.surf2};}

/* ══ TABLE ══ */
.cr-card{border-radius:28px;border:1px solid ${C.bdr};background:${C.surf};overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.5);}
.cr-table{width:100%;border-collapse:collapse;}
.cr-th{background:rgba(255,255,255,0.015);padding:16px 24px;font-family:'Space Mono';font-size:9px;font-weight:700;color:${C.muted};text-transform:uppercase;letter-spacing:.18em;border-bottom:1px solid ${C.bdr2};text-align:left;}
.cr-row{border-bottom:1px solid ${C.faint};transition:background .15s;}
.cr-row:hover{background:rgba(249,115,22,0.028);}
.cr-td{padding:18px 24px;vertical-align:middle;}

/* Badge & Dots */
.cr-badge{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:9px;font-family:'Space Mono';font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;border:1px solid;white-space:nowrap;}
.cr-dot{width:5px;height:5px;border-radius:50%;}
.cr-pill{display:inline-flex;align-items:center;padding:3px 9px;border-radius:6px;font-family:'Space Mono';font-size:10px;font-weight:700;}

/* Actions */
.cr-action{width:34px;height:34px;border-radius:10px;border:1px solid ${C.bdr};background:transparent;display:flex;align-items:center;justify-content:center;color:rgba(254,243,236,0.2);cursor:pointer;transition:all .2s;}
.cr-action:hover{border-color:rgba(249,115,22,0.35);background:rgba(249,115,22,0.1);color:${C.orange};}
.cr-action.resolve:hover{border-color:${C.green}50;background:${C.green}15;color:${C.green};}
.cr-action.del:hover{border-color:${C.red}50;background:${C.red}15;color:${C.red};}

/* Student Browser View */
.cr-quick-avatar{width:44px;height:44px;border-radius:16px;background:${C.surf2};border:1px solid ${C.bdr};display:flex;align-items:center;justify-content:center;font-family:'Space Mono';font-size:14px;font-weight:700;color:${C.orange};}
.cr-open-btn{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);font-family:'Space Mono';font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:rgba(254,243,236,0.5);cursor:pointer;transition:all .2s;}
.cr-open-btn:hover{color:${C.orange};border-color:rgba(249,115,22,0.3);background:rgba(249,115,22,0.08);}

/* Modals */
.cr-modal-c{padding:26px;background:${C.surf};color:${C.txt};border-radius:24px;}
.cr-input{width:100%;background:${C.bg};border:1px solid ${C.bdr};border-radius:13px;padding:13px 15px;color:${C.txt};font-size:13px;font-weight:600;outline:none;transition:border-color .2s;}
.cr-input:focus{border-color:${C.orange};}
.cr-btn-primary{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:14px;border-radius:14px;background:${C.orange}1a;border:1px solid ${C.orange}38;color:${C.orange};font-weight:900;text-transform:uppercase;letter-spacing:.1em;cursor:pointer;transition:all .2s;}
.cr-btn-primary:hover{background:${C.orange}2e;}

/* Drill Down UI */
.ps-breadcrumb { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
.ps-bc-btn { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .14em; color: ${C.muted}; cursor: pointer; background: none; border: none; font-family: inherit; transition: color .15s; padding: 0; }
.ps-bc-btn:hover { color: ${C.o2}; }
.ps-bc-btn.active { color: ${C.orange}; cursor: default; }
.ps-bc-sep { color: ${C.dim}; }

.ps-prog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 14px; margin-top: 24px; }
.ps-prog-card { background: ${C.surf}; border: 1px solid ${C.bdr}; border-radius: 20px; overflow: hidden; transition: all .25s cubic-bezier(.4,0,.2,1); position: relative; cursor: pointer; display: flex; flex-direction: column; }
.ps-prog-card:hover { border-color: rgba(249,115,22,0.35); transform: translateY(-4px); box-shadow: 0 14px 34px rgba(0,0,0,0.5), 0 0 0 1px rgba(249,115,22,0.08); }
.ps-prog-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, ${C.orange}, ${C.o3}, transparent); }
.ps-prog-body { padding: 22px; flex: 1; display: flex; flex-direction: column; }
.ps-prog-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; }
.ps-prog-code { font-family: 'Playfair Display', serif; font-size: 40px; font-style: italic; color: ${C.txt}; line-height: 1; transition: color .18s; font-weight: 900; }
.ps-prog-card:hover .ps-prog-code { color: ${C.o2}; }
.ps-prog-name { font-size: 11px; color: ${C.muted}; line-height: 1.5; flex: 1; margin-bottom: 14px; text-transform: uppercase; letter-spacing: .05em; font-weight: 600; }
.ps-chips { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
.ps-chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 20px; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .07em; }
.chip-o { background: rgba(249,115,22,0.1); color: ${C.o2}; border: 1px solid rgba(249,115,22,0.18); }
.chip-g { background: rgba(16,185,129,0.1); color: ${C.green}; border: 1px solid rgba(16,185,129,0.25); }
.chip-b { background: rgba(96,165,250,0.08); color: #60a5fa; border: 1px solid rgba(96,165,250,0.16); }
.ps-fill { height: 3px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden; margin-bottom: 16px; }
.ps-fill-bar { height: 100%; background: linear-gradient(90deg, rgba(249,115,22,0.4), ${C.orange}); transition: width .5s ease; }
.ps-manage-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 7px; padding: 11px; border-radius: 12px; background: rgba(249,115,22,0.07); border: 1px solid rgba(249,115,22,0.14); color: ${C.muted}; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .09em; cursor: pointer; transition: all .2s; font-family: inherit; }
.ps-manage-btn:hover { background: linear-gradient(135deg, ${C.orange}, ${C.o3}); border-color: transparent; color: #fff; box-shadow: 0 4px 14px rgba(249,115,22,0.3); }

.ps-sec-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; margin-top: 16px; margin-bottom: 32px; }
.ps-sec-card { background: ${C.surf}; border: 1px solid ${C.bdr}; border-radius: 16px; overflow: hidden; position: relative; }
.ps-sec-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: ${C.bdr}; transition: background .2s; }
.ps-sec-card:hover .ps-sec-bar { background: ${C.orange}; }
.ps-sec-body { padding: 18px 20px 18px 24px; display: flex; flex-direction: column; gap: 12px; }
.ps-sec-name { font-size: 18px; font-weight: 900; color: ${C.txt}; font-family: 'Space Mono'; }
.ps-sec-sy { font-size: 11px; color: ${C.muted}; font-weight: 600; }
.ps-sec-row { display: flex; align-items: center; gap: 10px; }
.ps-sec-ico { width: 30px; height: 30px; border-radius: 8px; background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; }
.ps-sec-flbl { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .1em; color: ${C.dim}; margin-bottom: 2px; }
.ps-sec-fval { font-size: 13px; font-weight: 600; color: ${C.txt}; }
.ps-roster-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid ${C.bdr}; color: ${C.txt}; font-size: 11px; font-weight: 700; cursor: pointer; transition: all .2s; margin-top: 6px; }
.ps-roster-btn:hover { background: rgba(249,115,22,0.1); border-color: rgba(249,115,22,0.3); color: ${C.orange}; }
`;

const StatItem = ({ label, value, color, icon }) => (
    <div className="cr-stat">
        <div className="cr-stat-label">{label}</div>
        <div className="cr-stat-val" style={{ color }}>{value}</div>
        <div className="cr-stat-icon" style={{ color }}>{icon}</div>
    </div>
);

const Badge = ({ children, bg, bdr, color }) => (
    <span className="cr-badge" style={{ background: bg, borderColor: bdr, color }}>
        {children}
    </span>
);

export default function Index({ logs, filters, summary, sections, students, available_categories }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
    const [isResolveModalOpen, setIsResolveModalOpen] = React.useState(false);
    const [selectedLog, setSelectedLog] = React.useState(null);
    const [expandedRows, setExpandedRows] = React.useState({});
    const [searchVal, setSearchVal] = React.useState(filters.search || '');

    // Drill-Down State
    const [programs, setPrograms] = React.useState([]);
    const [sectionsMap, setSectionsMap] = React.useState({});
    const [loadingPrograms, setLoadingPrograms] = React.useState(true);
    const [loadingSections, setLoadingSections] = React.useState(false);

    React.useEffect(() => {
        const fetchPrograms = async () => {
            setLoadingPrograms(true);
            try {
                const res = await axios.get('/api/programs');
                setPrograms(res.data);
            } catch (error) {
                console.error("Failed to load programs", error);
            } finally {
                setLoadingPrograms(false);
            }
        };
        fetchPrograms();
    }, []);

    React.useEffect(() => {
        if (!filters.course || sectionsMap[filters.course]) return;
        const fetchSections = async () => {
            setLoadingSections(true);
            try {
                const res = await axios.get(`/api/programs/${filters.course}/sections`);
                setSectionsMap(prev => ({ ...prev, [filters.course]: res.data }));
            } catch (error) {
                console.error("Failed to fetch sections", error);
            } finally {
                setLoadingSections(false);
            }
        };
        fetchSections();
    }, [filters.course, sectionsMap]);

    const createForm = useForm({
        student_id: '',
        type: 'violation',
        category: 'academic_misconduct',
        severity: 'low',
        description: '',
        logged_at: new Date().toISOString().split('T')[0],
        section_id: '',
    });

    const resolveForm = useForm({
        resolution_status: 'resolved',
        resolution_notes: '',
    });

    const applyFilter = (key, val) => 
        router.get(route('conduct.index'), { ...filters, [key]: val, page: 1 }, { preserveState: true });

    // Debounce search
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (searchVal !== (filters.search || '')) applyFilter('search', searchVal);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchVal]);

    const handleLogSubmit = (e) => {
        e.preventDefault();
        createForm.post(route('conduct.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                createForm.reset();
            }
        });
    };

    const handleResolveSubmit = (e) => {
        e.preventDefault();
        resolveForm.patch(route('conduct.resolve', selectedLog.id), {
            onSuccess: () => {
                setIsResolveModalOpen(false);
                resolveForm.reset();
            }
        });
    };

    const handleDelete = (log) => {
        const isHighPending = log.severity === 'high' && log.resolution_status === 'pending';
        const msg = isHighPending 
            ? "WARNING: Deleting a HIGH-SEVERITY pending incident requires admin confirmation. Proceed?"
            : "Remove this behavior log entry?";
        if (confirm(msg)) {
            router.delete(route('conduct.destroy', log.id), {
                data: { confirmed: true },
                preserveState: true
            });
        }
    };

    const toggleRow = (id) => setExpandedRows(v => ({ ...v, [id]: !v[id] }));

    const getPreviewPoints = () => {
        const { type, severity } = createForm.data;
        if (type === 'commendation') {
            return severity === 'low' ? 5 : severity === 'medium' ? 10 : 20;
        } else {
            return severity === 'low' ? -5 : severity === 'medium' ? -15 : -30;
        }
    };

    const studentList = createForm.data.section_id 
        ? students.filter(s => String(s.section_id) === String(createForm.data.section_id))
        : students;

    // Determine if we should show the Student Browser (Identify Mode) 
    // vs the Log Registry (Historical Mode)
    const isLogFocus = !!(
        filters.category || 
        filters.type || 
        filters.severity || 
        filters.resolution_status || 
        filters.section_id || 
        (filters.search && students.length === 0)
    );

    return (
        <AppLayout title="Conduct Registry" noPadding>
            <Head title="Conduct Registry" />
            <style>{css}</style>

            <div className="cr-root">
                <div className="cr-grid" />
                <div className="cr-orb1" />

                <div className="cr-content">
                    {/* ── HEADER ── */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
                        <div>
                            <div style={{ fontFamily: 'Space Mono', fontSize: 10, fontWeight: 700, color: C.orange, textTransform: 'uppercase', letterSpacing: '.2em', marginBottom: 12 }}>Administrative Portal</div>
                            <h1 style={{ fontFamily: 'Playfair Display', fontSize: 50, fontWeight: 900, fontStyle: 'italic', color: C.txt, lineHeight: 1 }}>
                                Conduct <span style={{ color: C.orange }}>Registry</span>
                            </h1>
                            <p style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginTop: 10 }}>College of Computing Studies · Behavioral Oversight &amp; Student Integrity</p>
                        </div>
                        {filters.section_id && (
                            <button onClick={() => setIsCreateModalOpen(true)} className="cr-btn-primary" style={{ width: 'auto', padding: '14px 28px' }}>
                                <Plus size={18} /> Log New Incident
                            </button>
                        )}
                    </div>

                    {/* ── BREADCRUMBS ── */}
                    <div className="ps-breadcrumb">
                        <button
                            className={`ps-bc-btn ${!filters.course ? 'active' : ''}`}
                            onClick={filters.course ? () => router.get(route('conduct.index')) : undefined}
                        >
                            Programs
                        </button>
                        {filters.course && (
                            <>
                                <ChevronRight size={13} className="ps-bc-sep" />
                                <button
                                    className={`ps-bc-btn ${!filters.section_id ? 'active' : ''}`}
                                    onClick={filters.section_id ? () => router.get(route('conduct.index', { course: filters.course })) : undefined}
                                >
                                    {filters.course}
                                </button>
                            </>
                        )}
                        {filters.section_id && (
                            <>
                                <ChevronRight size={13} className="ps-bc-sep" />
                                <button className="ps-bc-btn active">
                                    {sectionsMap[filters.course]?.find(s => String(s.id) === String(filters.section_id))?.name || 'Section'}
                                </button>
                            </>
                        )}
                    </div>

                    {/* ════════════════ LEVEL 1: PROGRAMS ════════════════ */}
                    {!filters.course && !filters.section_id && (
                        <div className="ps-prog-grid">
                            {loadingPrograms ? (
                                <div style={{ color: C.muted, fontSize: 13, padding: '40px 0' }}>Loading programs…</div>
                            ) : programs.map(p => {
                                const fillPct = Math.min((p.section_count / 10) * 100, 100);
                                return (
                                    <div key={p.code} className="ps-prog-card" onClick={() => router.get(route('conduct.index', { course: p.code }))}>
                                        <div className="ps-prog-body">
                                            <div className="ps-prog-top">
                                                <div className="ps-prog-code">{p.code}</div>
                                            </div>
                                            <div className="ps-prog-name">{p.name}</div>
                                            <div className="ps-chips">
                                                <span className="ps-chip chip-o"><Layers size={9} /> {p.section_count} Sections</span>
                                                <span className="ps-chip chip-g"><Users size={9} /> {p.student_count} Students</span>
                                                <span className="ps-chip chip-b">{p.dept}</span>
                                            </div>
                                            <div className="ps-fill">
                                                <div className="ps-fill-bar" style={{ width: `${fillPct}%` }} />
                                            </div>
                                            <button className="ps-manage-btn" onClick={(e) => { e.stopPropagation(); router.get(route('conduct.index', { course: p.code })); }}>
                                                View Program Sections <ChevronRight size={12} className="arr" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ════════════════ LEVEL 2: SECTIONS ════════════════ */}
                    {filters.course && !filters.section_id && (
                        <div className="ps-sec-grid">
                            {loadingSections ? (
                                <div style={{ color: C.muted, fontSize: 13, padding: '40px 0' }}>Loading sections…</div>
                            ) : sectionsMap[filters.course]?.map(s => (
                                <div key={s.id} className="ps-sec-card">
                                    <div className="ps-sec-bar" />
                                    <div className="ps-sec-body">
                                        <div className="ps-sec-name">{s.name}</div>
                                        <div className="ps-sec-sy">{s.school_year} · {s.grade_level}</div>
                                        <div style={{ height: 1, background: C.bdr2, margin: '8px 0' }} />
                                        <div className="ps-sec-row">
                                            <div className="ps-sec-ico"><Users size={13} color="rgba(249,115,22,0.55)" /></div>
                                            <div>
                                                <div className="ps-sec-flbl">Enrollment</div>
                                                <div className="ps-sec-fval">{s.students_count} students</div>
                                            </div>
                                        </div>
                                        <button className="ps-roster-btn" onClick={() => router.get(route('conduct.index', { course: filters.course, section_id: s.id }))}>
                                            View Conduct Registry <ChevronRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ════════════════ LEVEL 3: CONDUCT REGISTRY ════════════════ */}
                    {filters.course && filters.section_id && (
                        <>

                    {/* ── METRICS ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 28 }}>
                        <StatItem label="Total Violations" value={summary.total_violations} color={C.red} icon={<TrendingDown size={60} />} />
                        <StatItem label="Total Commendations" value={summary.total_commendations} color={C.green} icon={<TrendingUp size={60} />} />
                        <StatItem label="Pending Resolution" value={summary.pending_count} color={C.amber} icon={<Clock size={60} />} />
                        <StatItem label="High Severity" value={summary.high_severity_count} color={C.red} icon={<AlertTriangle size={60} />} />
                    </div>

                    {/* ── DISTRIBUTIONS ── */}
                    <div className="cr-dist-wrap">
                        <div className="cr-dist-row">
                            <div className="cr-dist-label">
                                <span>TYPE BALANCE (VIOLATIONS vs COMMENDATIONS)</span>
                                <span>{summary.total_violations} / {summary.total_commendations}</span>
                            </div>
                            <div className="cr-dist-track">
                                <div className="cr-dist-seg" style={{ width: `${(summary.total_violations / (summary.total_logs || 1)) * 100}%`, background: C.red }} />
                                <div className="cr-dist-seg" style={{ width: `${(summary.total_commendations / (summary.total_logs || 1)) * 100}%`, background: C.green }} />
                            </div>
                        </div>
                        <div className="cr-dist-row">
                            <div className="cr-dist-label">
                                <span>RESOLUTION PIPELINE (RESOLVED vs PENDING)</span>
                                <span>{summary.resolved_count} / {summary.pending_count}</span>
                            </div>
                            <div className="cr-dist-track">
                                <div className="cr-dist-seg" style={{ width: `${(summary.resolved_count / (summary.total_logs || 1)) * 100}%`, background: C.orange }} />
                                <div className="cr-dist-seg" style={{ width: `${(summary.pending_count / (summary.total_logs || 1)) * 100}%`, background: C.amber }} />
                            </div>
                        </div>
                    </div>

                    {/* ── FILTERS ── */}
                    <div className="cr-filters-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                        <div className="cr-fbox" style={{ gridColumn: '1 / -1' }}><Search size={14} color={C.orange}/><input className="cr-finput" placeholder="Search identity or incident..." value={searchVal} onChange={e=>setSearchVal(e.target.value)} /></div>
                        <div className="cr-fbox"><Shield size={14} color={C.orange}/><select className="cr-finput" value={filters.type || ''} onChange={e=>applyFilter('type', e.target.value)}><option value="">All Types</option><option value="violation">Violation</option><option value="commendation">Commendation</option></select></div>
                        <div className="cr-fbox"><AlertTriangle size={14} color={C.orange}/><select className="cr-finput" value={filters.severity || ''} onChange={e=>applyFilter('severity', e.target.value)}><option value="">All Severities</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
                        <div className="cr-fbox"><BookOpen size={14} color={C.orange}/><select className="cr-finput" value={filters.category || ''} onChange={e=>applyFilter('category', e.target.value)}><option value="">All Categories</option>{Object.entries(available_categories).map(([k,v])=> <option key={k} value={k}>{v}</option>)}</select></div>
                        <div className="cr-fbox"><ShieldCheck size={14} color={C.orange}/><select className="cr-finput" value={filters.resolution_status || ''} onChange={e=>applyFilter('resolution_status', e.target.value)}><option value="">All Statuses</option><option value="pending">Pending</option><option value="resolved">Resolved</option><option value="dismissed">Dismissed</option><option value="escalated">Escalated</option></select></div>
                    </div>

                    {/* ── UNIFIED TABLE CARD ── */}
                    <div className="cr-card">
                        {isLogFocus ? (
                            <>
                                {/* Log Registry View */}
                                <div style={{ background: 'rgba(255,255,255,0.015)', borderBottom: `1px solid ${C.bdr}`, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ background: `${C.orange}15`, borderRadius: 6, padding: '3px 8px', color: C.orange, fontSize: 8, fontWeight: 700 }}>LOG REGISTRY</div>
                                    <div style={{ fontSize: 9, fontFamily: 'Space Mono', color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em' }}>Historical Incident Tracking</div>
                                </div>
                                <table className="cr-table">
                                    <thead>
                                        <tr>
                                            <th className="cr-th">STUDENT IDENTITY</th>
                                            <th className="cr-th">CATEGORY & CLASS</th>
                                            <th className="cr-th">SEVERITY</th>
                                            <th className="cr-th">IMPACT</th>
                                            <th className="cr-th">LOGGED AT</th>
                                            <th className="cr-th">RESOLUTION</th>
                                            <th className="cr-th" style={{ textAlign: 'right' }}>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.data.length > 0 ? logs.data.map(log => {
                                            const init = ((log.student?.first_name?.[0] || '') + (log.student?.last_name?.[0] || '')).toUpperCase();
                                            const expanded = expandedRows[log.id];
                                            const snip = log.description.substring(0, 70);
                                            return (
                                                <React.Fragment key={log.id}>
                                                    <tr className="cr-row" style={{ borderBottom: 'none' }}>
                                                        <td className="cr-td">
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }} onClick={() => router.visit(route('conduct.student', log.student_id))}>
                                                                <div className="cr-quick-avatar">{init}</div>
                                                                <div>
                                                                    <div style={{ fontSize: 13, fontWeight: 700, color: C.txt }}>{log.student?.first_name} {log.student?.first_name ? log.student?.last_name : 'Unknown'}</div>
                                                                    <div style={{ fontSize: 9, fontFamily: 'Space Mono', color: C.muted, textTransform: 'uppercase' }}>{log.student?.student_id || '---'}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="cr-td">
                                                            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{available_categories[log.category]}</div>
                                                            <div className="cr-pill" style={{ background: log.type === 'violation' ? `${C.red}15` : `${C.green}15`, color: log.type === 'violation' ? C.red : C.green, fontSize: 8 }}>{log.type.toUpperCase()}</div>
                                                        </td>
                                                        <td className="cr-td">
                                                            <Badge bg={sevColor(log.severity) + '12'} bdr={sevColor(log.severity) + '40'} color={sevColor(log.severity)}>{log.severity.toUpperCase()}</Badge>
                                                        </td>
                                                        <td className="cr-td">
                                                            <div className="cr-pill" style={{ background: log.points < 0 ? `${C.red}18` : `${C.green}18`, color: log.points < 0 ? C.red : C.green }}>{log.points > 0 ? '+' : ''}{log.points} UNIT</div>
                                                        </td>
                                                        <td className="cr-td">
                                                            <div style={{ fontSize: 11, fontWeight: 500 }}>{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                                            <div style={{ fontSize: 8, color: C.muted, fontFamily: 'Space Mono', marginTop: 2 }}>{log.recorder?.name || 'ADMIN'}</div>
                                                        </td>
                                                        <td className="cr-td">
                                                            <Badge bg={statusColor(log.resolution_status) + '12'} bdr={statusColor(log.resolution_status) + '40'} color={statusColor(log.resolution_status)}>
                                                                {log.resolution_status.toUpperCase()}
                                                            </Badge>
                                                        </td>
                                                        <td className="cr-td" style={{ textAlign: 'right' }}>
                                                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                                                <button className="cr-action resolve" onClick={() => { setSelectedLog(log); setIsResolveModalOpen(true); }}><CheckCircle size={14}/></button>
                                                                <button className="cr-action del" onClick={() => handleDelete(log)}><Trash2 size={14}/></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr style={{ background: 'rgba(255,255,255,0.012)', borderBottom: `1px solid ${C.faint}` }}>
                                                        <td colSpan="7" style={{ padding: '0 24px 20px' }}>
                                                            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                                                                <div style={{ width: 2, minHeight: 40, alignSelf: 'stretch', background: log.type === 'violation' ? `${C.red}40` : `${C.green}40`, borderRadius: 2 }} />
                                                                <div style={{ flex: 1 }}>
                                                                    <div style={{ fontSize: 9, fontFamily: 'Space Mono', color: log.type === 'violation' ? C.red : C.green, textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 6, fontWeight: 700 }}>Incident Details</div>
                                                                    <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, maxWidth: 900, whiteSpace: 'pre-wrap' }}>
                                                                        {expanded ? log.description : snip}
                                                                        {log.description.length > 70 && (
                                                                            <button onClick={() => toggleRow(log.id)} style={{ color: C.orange, marginLeft: 8, fontWeight: 800, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                                                                                {expanded ? '...less' : '...more'}
                                                                            </button>
                                                                        )}
                                                                    </p>
                                                                    {log.resolution_notes && (
                                                                        <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${statusColor(log.resolution_status)}` }}>
                                                                            <div style={{ fontSize: 9, fontWeight: 900, color: statusColor(log.resolution_status), textTransform: 'uppercase', marginBottom: 6, letterSpacing: '.05em' }}>Resolution Note — {log.resolver?.name || 'ADMIN'}</div>
                                                                            <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{log.resolution_notes}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            );
                                        }) : (
                                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: 80, opacity: 0.3 }}><Info size={40} style={{ margin: '0 auto 10px' }} /><div style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 18 }}>No logs matched current filters</div></td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </>
                        ) : (
                            <>
                                {/* Student Browser View */}
                                <div style={{ background: 'rgba(255,255,255,0.015)', borderBottom: `1px solid ${C.bdr}`, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ background: `${C.orange}15`, borderRadius: 6, padding: '3px 8px', color: C.orange, fontSize: 8, fontWeight: 700 }}>STUDENT BROWSER</div>
                                    <div style={{ fontSize: 9, fontFamily: 'Space Mono', color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em' }}>Institutional Identity Discovery</div>
                                </div>
                                <table className="cr-table">
                                    <thead>
                                        <tr>
                                            <th className="cr-th">STUDENT IDENTITY</th>
                                            <th className="cr-th">INSTITUTIONAL ID</th>
                                            <th className="cr-th" style={{ textAlign: 'right' }}>ACTION PORTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.length > 0 ? students.map(s => {
                                            const init = ((s.first_name?.[0] || '') + (s.last_name?.[0] || '')).toUpperCase();
                                            return (
                                                <tr key={s.id} className="cr-row">
                                                    <td className="cr-td">
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                                            <div className="cr-quick-avatar" style={{ width: 48, height: 48, borderRadius: 18 }}>{init}</div>
                                                            <div>
                                                                <div style={{ fontSize: 15, fontWeight: 700 }}>{s.first_name} {s.last_name}</div>
                                                                <div style={{ fontSize: 9, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 3 }}>Identity Verified</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="cr-td">
                                                        <div style={{ fontFamily: 'Space Mono', fontSize: 14, fontWeight: 700, letterSpacing: '.2em', color: `${C.orange}80` }}>{s.student_id}</div>
                                                    </td>
                                                    <td className="cr-td" style={{ textAlign: 'right' }}>
                                                        <button className="cr-open-btn px-8 py-3" onClick={() => router.visit(route('conduct.student', s.id))}>
                                                            <ExternalLink size={14} /> Open Full Timeline
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        }) : (
                                            <tr><td colSpan="3" style={{ textAlign: 'center', padding: 80, opacity: 0.3 }}><Search size={40} style={{ margin: '0 auto 10px' }} /><div style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 18 }}>No matching students found</div></td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>

                    {/* ── PAGINATION ── */}
                    {isLogFocus && logs.last_page > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
                            <button className="cr-action" disabled={!logs.prev_page_url} onClick={() => router.get(logs.prev_page_url, {}, { preserveState: true })}><ChevronLeft size={16}/></button>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Space Mono', fontSize: 11 }}>
                                Page <strong style={{ color: C.orange }}>{logs.current_page}</strong> of {logs.last_page}
                            </span>
                            <button className="cr-action" disabled={!logs.next_page_url} onClick={() => router.get(logs.next_page_url, {}, { preserveState: true })}><ChevronRight size={16}/></button>
                        </div>
                    )}

                        </>
                    )}
                </div>
            </div>

            {/* ══ LOG INCIDENT MODAL ══ */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="lg">
                <div className="cr-modal-c">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <h3 style={{ fontFamily: 'Playfair Display', fontSize: 24, fontStyle: 'italic', fontWeight: 900 }}>Log New <span style={{ color: C.orange }}>Behavior Record</span></h3>
                        <button onClick={() => setIsCreateModalOpen(false)} style={{ color: C.muted }}><X size={20}/></button>
                    </div>

                    <form onSubmit={handleLogSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {['violation', 'commendation'].map(t => (
                                <button key={t} type="button" onClick={() => createForm.setData('type', t)} 
                                    style={{ flex: 1, padding: 12, borderRadius: 12, background: createForm.data.type === t ? (t === 'violation' ? C.red + '15' : C.green + '15') : 'transparent', border: `1px solid ${createForm.data.type === t ? (t === 'violation' ? C.red : C.green) : C.bdr}`, color: createForm.data.type === t ? (t === 'violation' ? C.red : C.green) : C.muted, fontWeight: 800, textTransform: 'uppercase', fontSize: 11, cursor: 'pointer', transition: 'all .2s' }}>
                                    {t}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                             <div>
                                <label className="cr-stat-label">Filter Section</label>
                                <select className="cr-input" value={createForm.data.section_id} onChange={e=>createForm.setData('section_id', e.target.value)}>
                                    <option value="">All Sections</option>
                                    {sections.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="cr-stat-label" style={{ color: C.orange }}>Identify Student</label>
                                <select className="cr-input" required value={createForm.data.student_id} onChange={e=>createForm.setData('student_id', e.target.value)}>
                                    <option value="">Select Student</option>
                                    {studentList.map(s=><option key={s.id} value={s.id}>{s.name} ({s.student_id})</option>)}
                                </select>
                                {createForm.errors.student_id && <div style={{ fontSize: 9, color: C.red, marginTop: 4, fontWeight: 700 }}>{createForm.errors.student_id}</div>}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                             <div>
                                <label className="cr-stat-label">Category</label>
                                <select className="cr-input" required value={createForm.data.category} onChange={e=>createForm.setData('category', e.target.value)}>
                                    {Object.entries(available_categories).map(([k,v])=> <option key={k} value={k}>{v}</option>)}
                                </select>
                                {createForm.errors.category && <div style={{ fontSize: 9, color: C.red, marginTop: 4, fontWeight: 700 }}>{createForm.errors.category}</div>}
                            </div>
                            <div>
                                <label className="cr-stat-label">Severity</label>
                                <select className="cr-input" required value={createForm.data.severity} onChange={e=>createForm.setData('severity', e.target.value)}>
                                    <option value="low">Low — Standard</option>
                                    <option value="medium">Medium — Intermediate</option>
                                    <option value="high">High — Critical</option>
                                </select>
                                {createForm.errors.severity && <div style={{ fontSize: 9, color: C.red, marginTop: 4, fontWeight: 700 }}>{createForm.errors.severity}</div>}
                            </div>
                        </div>

                        <div>
                            <label className="cr-stat-label">Incident Date</label>
                            <input type="date" className="cr-input" required value={createForm.data.logged_at} onChange={e=>createForm.setData('logged_at', e.target.value)} />
                            {createForm.errors.logged_at && <div style={{ fontSize: 9, color: C.red, marginTop: 4, fontWeight: 700 }}>{createForm.errors.logged_at}</div>}
                        </div>

                        <div>
                            <label className="cr-stat-label">Description ({createForm.data.description.length} chars)</label>
                            <textarea className="cr-input" required minLength={10} style={{ height: 100, resize: 'none' }} placeholder="Detail the observed behavioral incident (minimum 10 characters)..." value={createForm.data.description} onChange={e=>createForm.setData('description', e.target.value)} />
                            {createForm.errors.description && <div style={{ fontSize: 9, color: C.red, marginTop: 4, fontWeight: 700 }}>{createForm.errors.description}</div>}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'rgba(255,255,255,0.03)', borderRadius: 14, border: `1px solid ${C.bdr}` }}>
                            <div style={{ fontFamily: 'Space Mono', fontSize: 10, fontWeight: 700, color: C.muted }}>IMPACT PROJECTION</div>
                            <div className="cr-pill" style={{ background: getPreviewPoints() < 0 ? C.red + '20' : C.green + '20', color: getPreviewPoints() < 0 ? C.red : C.green, fontSize: 11, padding: '5px 12px' }}>
                                {getPreviewPoints() > 0 ? 'Awarding +' : 'Deducting '}{getPreviewPoints()} CONDUCT UNITS
                            </div>
                        </div>

                        <button type="submit" className="cr-btn-primary" disabled={createForm.processing}>
                            {createForm.processing ? 'Syncing Record...' : 'Authorize Log Entry'}
                        </button>
                    </form>
                </div>
            </Modal>

            {/* ══ RESOLVE MODAL ══ */}
            <Modal show={isResolveModalOpen} onClose={() => setIsResolveModalOpen(false)} maxWidth="md">
                <div className="cr-modal-c">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <h3 style={{ fontFamily: 'Playfair Display', fontSize: 24, fontStyle: 'italic', fontWeight: 900 }}>Resolve <span style={{ color: C.orange }}>Incident</span></h3>
                        <button onClick={() => setIsResolveModalOpen(false)} style={{ color: C.muted }}><X size={20}/></button>
                    </div>

                    <div style={{ marginBottom: 20, padding: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: `1px solid ${C.bdr}` }}>
                        <div style={{ fontSize: 9, fontFamily: 'Space Mono', color: C.orange, marginBottom: 4 }}>RECORD SUMMARY</div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{selectedLog?.student?.first_name} {selectedLog?.student?.last_name}</div>
                        <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{selectedLog?.description.substring(0, 150)}...</div>
                    </div>

                    <form onSubmit={handleResolveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <label className="cr-stat-label">Resolution Status</label>
                            <select className="cr-input" value={resolveForm.data.resolution_status} onChange={e=>resolveForm.setData('resolution_status', e.target.value)}>
                                <option value="resolved">Mark as Resolved</option>
                                <option value="dismissed">Dismiss Case</option>
                                <option value="escalated">Escalate to Admin</option>
                            </select>
                        </div>

                        <div>
                            <label className="cr-stat-label">Resolution Justification (Required)</label>
                            <textarea className="cr-input" style={{ height: 100, resize: 'none' }} placeholder="Provide detailed resolution notes..." value={resolveForm.data.resolution_notes} onChange={e=>resolveForm.setData('resolution_notes', e.target.value)} />
                            {resolveForm.errors.resolution_notes && <div style={{ fontSize: 9, color: C.red, marginTop: 4, fontWeight: 700 }}>{resolveForm.errors.resolution_notes}</div>}
                        </div>

                        <button type="submit" className="cr-btn-primary" disabled={resolveForm.processing}>
                            {resolveForm.processing ? 'Processing...' : 'Complete Resolution'}
                        </button>
                    </form>
                </div>
            </Modal>
        </AppLayout>
    );
}
