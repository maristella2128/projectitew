import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import {
    ShieldCheck, AlertCircle, Clock, Ban,
    Search, Filter, BookOpen, GraduationCap,
    RefreshCw, Download, Edit, ExternalLink,
    ChevronLeft, ChevronRight, X, Info, CheckCircle2, Shield,
    Layers, Users
} from 'lucide-react';
import Modal from '@/Components/Modal';
import axios from 'axios';

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

const statusColors = {
    cleared: C.green,
    pending_issues: C.amber,
    under_disciplinary_action: C.red,
    hold: C.orange,
};

const conductColor = v => v >= 90 ? C.green : v >= 75 ? C.amber : C.red;

/* ─── CSS ───────────────────────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,900&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');
*,*::before,*::after{box-sizing:border-box;}

.cm-root{background:${C.bg};min-height:100vh;flex:1;display:flex;flex-direction:column;font-family:'DM Sans',system-ui,sans-serif;color:${C.txt};padding:32px 40px 80px;position:relative;overflow-x:hidden;}
.cm-grid{position:fixed;inset:0;pointer-events:none;z-index:0;background-size:56px 56px;background-image:linear-gradient(${C.dim} 1px,transparent 1px),linear-gradient(90deg,${C.dim} 1px,transparent 1px);opacity:0.18;}
.cm-orb1{position:fixed;top:-10%;right:-5%;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(249,115,22,0.09) 0%,transparent 70%);pointer-events:none;z-index:0;}
.cm-content{position:relative;z-index:1;max-width:1500px;margin:0 auto;width:100%;animation:fadeUp 0.5s cubic-bezier(0.16,1,0.3,1);}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

/* ── Metrics ── */
.cm-stat{background:${C.surf};border:1px solid ${C.bdr};border-radius:24px;padding:22px 26px;position:relative;overflow:hidden;transition:all .35s cubic-bezier(0.16,1,0.3,1);}
.cm-stat:hover{border-color:rgba(249,115,22,0.25);transform:translateY(-3px);box-shadow:0 16px 40px rgba(0,0,0,0.45);}
.cm-stat-icon{position:absolute;top:16px;right:16px;opacity:0.07;}
.cm-stat-label{font-family:'Space Mono',monospace;font-size:9px;font-weight:700;color:${C.muted};text-transform:uppercase;letter-spacing:.15em;margin-bottom:10px;}
.cm-stat-val{font-family:'Playfair Display',serif;font-size:38px;font-weight:900;line-height:1;}

/* ── Purpose Stats ── */
.cm-purpose-row{display:flex;gap:24px;background:rgba(255,255,255,0.02);border:1px solid ${C.bdr};border-radius:18px;padding:16px 24px;margin-bottom:28px;align-items:center;}
.cm-purp-item{flex:1;}
.cm-purp-header{display:flex;justify-content:space-between;margin-bottom:8px;font-family:'Space Mono';font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;}
.cm-purp-bar{height:4px;background:rgba(255,255,255,0.05);border-radius:2px;overflow:hidden;}
.cm-purp-fill{height:100%;border-radius:2px;transition:width 1s ease;}

/* ── Filters ── */
.cm-filters-row{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:12px;margin-bottom:18px;}
.cm-fbox{background:${C.surf};border:1px solid ${C.bdr};border-radius:14px;padding:12px 16px;display:flex;align-items:center;gap:10px;transition:border-color .2s;}
.cm-fbox:focus-within{border-color:${C.orange};box-shadow:0 0 0 3px rgba(249,115,22,0.08);}
.cm-finput{flex:1;background:transparent;border:none;outline:none;font-family:'DM Sans';font-size:13px;font-weight:600;color:${C.txt};}
.cm-finput option{background:${C.surf2};}

/* ══ TABLE ══ */
.cm-card{border-radius:28px;border:1px solid ${C.bdr};background:${C.surf};overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.5);}
.cm-table{width:100%;border-collapse:collapse;}
.cm-th{background:rgba(255,255,255,0.015);padding:16px 24px;font-family:'Space Mono';font-size:9px;font-weight:700;color:${C.muted};text-transform:uppercase;letter-spacing:.18em;border-bottom:1px solid ${C.bdr2};text-align:left;}
.cm-row{border-bottom:1px solid ${C.faint};transition:background .15s;}
.cm-row:hover{background:rgba(249,115,22,0.028);}
.cm-td{padding:20px 24px;vertical-align:middle;}

/* Badge */
.cm-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:10px;font-family:'Space Mono';font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;border:1px solid;}
.cm-dot{width:6px;height:6px;border-radius:50%;}

/* Behavior Score */
.cm-score-box{display:flex;align-items:center;gap:10px;}
.cm-score-num{font-family:'Playfair Display';font-size:24px;font-weight:900;line-height:1;width:40px;}
.cm-score-meter{flex:1;height:4px;border-radius:2px;background:rgba(255,255,255,0.05);overflow:hidden;width:60px;}
.cm-score-fill{height:100%;border-radius:2px;transition:width 0.8s ease;}

/* Purpose Pills */
.cm-purp-pill{display:inline-flex;padding:3px 9px;border-radius:6px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);color:${C.green};font-family:'Space Mono';font-size:8px;font-weight:700;margin-right:4px;text-transform:uppercase;}
.cm-purp-pill.none{background:rgba(239,68,68,0.1);border-color:rgba(239,68,68,0.25);color:${C.red};}

/* Action Btn */
.cm-action{width:34px;height:34px;border-radius:10px;border:1px solid ${C.bdr};background:transparent;display:flex;align-items:center;justify-content:center;color:rgba(254,243,236,0.3);cursor:pointer;transition:all .2s;}
.cm-action:hover{border-color:rgba(249,115,22,0.35);background:rgba(249,115,22,0.1);color:${C.orange};}

/* Modal */
.cm-modal-root{padding:24px;background:${C.surf};color:${C.txt};font-family:'DM Sans';border-radius:24px;}
.cm-input{width:100%;background:${C.bg};border:1px solid ${C.bdr};border-radius:13px;padding:13px 15px;color:${C.txt};font-size:13px;font-weight:600;margin-top:6px;outline:none;}
.cm-input:focus{border-color:${C.orange};box-shadow:0 0 0 3px rgba(249,115,22,0.1);}
.cm-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:14px;border-radius:14px;background:${C.orange}1a;border:1px solid ${C.orange}38;color:C.orange;font-weight:900;text-transform:uppercase;letter-spacing:.1em;cursor:pointer;transition:all .2s;}
.cm-btn:hover{background:${C.orange}2e;}

/* Drill Down UI */
.ps-breadcrumb { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
.ps-bc-btn {
    font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .14em;
    color: ${C.muted}; cursor: pointer; background: none; border: none;
    font-family: inherit; transition: color .15s; padding: 0;
}
.ps-bc-btn:hover { color: ${C.o2}; }
.ps-bc-btn.active { color: ${C.orange}; cursor: default; }
.ps-bc-sep { color: ${C.dim}; }

.ps-prog-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 14px; margin-top: 24px;
}
.ps-prog-card {
    background: ${C.surf}; border: 1px solid ${C.bdr}; border-radius: 20px; overflow: hidden;
    transition: all .25s cubic-bezier(.4,0,.2,1); position: relative; cursor: pointer;
    display: flex; flex-direction: column;
}
.ps-prog-card:hover {
    border-color: rgba(249,115,22,0.35); transform: translateY(-4px);
    box-shadow: 0 14px 34px rgba(0,0,0,0.5), 0 0 0 1px rgba(249,115,22,0.08);
}
.ps-prog-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, ${C.orange}, ${C.o3}, transparent);
}
.ps-prog-body { padding: 22px; flex: 1; display: flex; flex-direction: column; }
.ps-prog-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; }
.ps-prog-code { font-family: 'Playfair Display', serif; font-size: 40px; font-style: italic; color: ${C.txt}; line-height: 1; transition: color .18s; font-weight: 900; }
.ps-prog-card:hover .ps-prog-code { color: ${C.o2}; }
.ps-prog-name { font-size: 11px; color: ${C.muted}; line-height: 1.5; flex: 1; margin-bottom: 14px; text-transform: uppercase; letter-spacing: .05em; font-weight: 600; }
.ps-chips { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
.ps-chip {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 9px; border-radius: 20px;
    font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .07em;
}
.chip-o { background: rgba(249,115,22,0.1); color: ${C.o2}; border: 1px solid rgba(249,115,22,0.18); }
.chip-g { background: rgba(16,185,129,0.1); color: ${C.green}; border: 1px solid rgba(16,185,129,0.25); }
.chip-b { background: rgba(96,165,250,0.08); color: #60a5fa; border: 1px solid rgba(96,165,250,0.16); }
.ps-fill { height: 3px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden; margin-bottom: 16px; }
.ps-fill-bar { height: 100%; background: linear-gradient(90deg, rgba(249,115,22,0.4), ${C.orange}); transition: width .5s ease; }
.ps-manage-btn {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 7px;
    padding: 11px; border-radius: 12px;
    background: rgba(249,115,22,0.07); border: 1px solid rgba(249,115,22,0.14);
    color: ${C.muted}; font-size: 10px; font-weight: 800;
    text-transform: uppercase; letter-spacing: .09em;
    cursor: pointer; transition: all .2s; font-family: inherit;
}
.ps-manage-btn:hover {
    background: linear-gradient(135deg, ${C.orange}, ${C.o3});
    border-color: transparent; color: #fff;
    box-shadow: 0 4px 14px rgba(249,115,22,0.3);
}

.ps-sec-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; margin-top: 16px; margin-bottom: 32px; }
.ps-sec-card {
    background: ${C.surf}; border: 1px solid ${C.bdr}; border-radius: 16px; overflow: hidden; position: relative;
}
.ps-sec-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: ${C.bdr}; transition: background .2s; }
.ps-sec-card:hover .ps-sec-bar { background: ${C.orange}; }
.ps-sec-body { padding: 18px 20px 18px 24px; display: flex; flex-direction: column; gap: 12px; }
.ps-sec-name { font-size: 18px; font-weight: 900; color: ${C.txt}; font-family: 'Space Mono'; }
.ps-sec-sy { font-size: 11px; color: ${C.muted}; font-weight: 600; }
.ps-sec-row { display: flex; align-items: center; gap: 10px; }
.ps-sec-ico { width: 30px; height: 30px; border-radius: 8px; background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; }
.ps-sec-flbl { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .1em; color: ${C.dim}; margin-bottom: 2px; }
.ps-sec-fval { font-size: 13px; font-weight: 600; color: ${C.txt}; }
.ps-roster-btn {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 10px; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid ${C.bdr};
    color: ${C.txt}; font-size: 11px; font-weight: 700; cursor: pointer; transition: all .2s; margin-top: 6px;
}
.ps-roster-btn:hover { background: rgba(249,115,22,0.1); border-color: rgba(249,115,22,0.3); color: ${C.orange}; }

`;

const StatItem = ({ label, value, color, icon }) => (
    <div className="cm-stat">
        <div className="cm-stat-label">{label}</div>
        <div className="cm-stat-val" style={{ color }}>{value}</div>
        <div className="cm-stat-icon" style={{ color }}>{icon}</div>
    </div>
);

const PurposeStat = ({ label, count, total, color }) => {
    const pct = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="cm-purp-item">
            <div className="cm-purp-header">
                <span>{label}</span>
                <span style={{ color }}>{count} / {total}</span>
            </div>
            <div className="cm-purp-bar">
                <div className="cm-purp-fill" style={{ width: `${pct}%`, background: color }} />
            </div>
        </div>
    );
};

export default function Index({ clearances, filters, summary, courses }) {
    const [searchVal, setSearchVal] = React.useState(filters.search || '');
    const [overrideModal, setOverrideModal] = React.useState({ show: false, clearance: null });

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

    // Departmental Clearance State
    const [clearanceStudent, setClearanceStudent] = React.useState(null);
    const [clearanceData, setClearanceData] = React.useState(null);
    const [isClearing, setIsClearing] = React.useState(null);

    const overrideForm = useForm({
        status: '',
        override_note: '',
    });

    const applyFilter = (key, val) =>
        router.get(route('clearance.index'), { ...filters, [key]: val, page: 1 }, { preserveState: true });

    // Debounce search
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (searchVal !== (filters.search || '')) applyFilter('search', searchVal);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchVal]);

    const handleBatchEvaluate = () => {
        if (confirm('Re-evaluate clearance status for all matched students? This will overwrite automatic statuses based on current conduct scores.')) {
            router.post(route('clearance.batch-evaluate'), {
                course: filters.course,
                year_level: filters.year_level
            });
        }
    };

    const handleExport = () => {
        const url = route('clearance.export', filters);
        window.location.href = url;
    };

    const openOverride = (clearance) => {
        overrideForm.setData({
            status: clearance.status,
            override_note: clearance.override_note || '',
        });
        setOverrideModal({ show: true, clearance });
    };

    const submitOverride = (e) => {
        e.preventDefault();
        overrideForm.patch(route('clearance.override', overrideModal.clearance.id), {
            onSuccess: () => setOverrideModal({ show: false, clearance: null }),
        });
    };

    // Departmental Clearance Logic
    const fetchClearance = async (studentId) => {
        try {
            const res = await axios.get(`/api/students/${studentId}/clearance`);
            setClearanceData(res.data);
        } catch (error) {
            console.error('Failed to fetch clearance', error);
        }
    };

    React.useEffect(() => {
        if (clearanceStudent) {
            setClearanceData(null);
            fetchClearance(clearanceStudent.id);
        }
    }, [clearanceStudent]);

    const handleClearDepartment = async (entryId) => {
        setIsClearing(entryId);
        try {
            await axios.patch(`/api/clearance-entries/${entryId}/clear`);
            if (clearanceStudent) fetchClearance(clearanceStudent.id);
            // Also refresh inertia page to update the overall status table
            router.reload({ only: ['clearances', 'summary'] });
        } catch (error) {
            console.error('Failed to clear department');
        } finally {
            setIsClearing(null);
        }
    };

    const totalStudents = summary.total_cleared + summary.total_pending + summary.total_under_action + summary.total_hold;

    return (
        <AppLayout title="Clearance Management" noPadding>
            <Head title="Clearance Management" />
            <style>{css}</style>

            <div className="cm-root">
                <div className="cm-grid" />
                <div className="cm-orb1" />

                <div className="cm-content">
                    {/* ── HEADER ── */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
                        <div>
                            <div style={{ fontFamily: 'Space Mono', fontSize: 10, fontWeight: 700, color: C.orange, textTransform: 'uppercase', letterSpacing: '.2em', marginBottom: 12 }}>Administrative Portal</div>
                            <h1 style={{ fontFamily: 'Playfair Display', fontSize: 50, fontWeight: 900, fontStyle: 'italic', color: C.txt, lineHeight: 1 }}>
                                Clearance <span style={{ color: C.orange }}>Management</span>
                            </h1>
                            <p style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginTop: 10 }}>College of Computing Studies — Verification &amp; Evaluation Center</p>
                        </div>
                        {filters.section_id && (
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button onClick={handleBatchEvaluate} className="cm-btn px-6" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: C.txt }}>
                                    <RefreshCw size={14} className={router.processing ? 'animate-spin' : ''} /> Batch Re-evaluate
                                </button>
                                <button onClick={handleExport} className="cm-btn px-6" style={{ background: `${C.orange}1a`, color: C.orange }}>
                                    <Download size={14} /> Export Excel
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── BREADCRUMBS ── */}
                    <div className="ps-breadcrumb">
                        <button
                            className={`ps-bc-btn ${!filters.course ? 'active' : ''}`}
                            onClick={filters.course ? () => router.get(route('clearance.index')) : undefined}
                        >
                            Programs
                        </button>
                        {filters.course && (
                            <>
                                <ChevronRight size={13} className="ps-bc-sep" />
                                <button
                                    className={`ps-bc-btn ${!filters.section_id ? 'active' : ''}`}
                                    onClick={filters.section_id ? () => router.get(route('clearance.index', { course: filters.course })) : undefined}
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
                                    <div key={p.code} className="ps-prog-card" onClick={() => router.get(route('clearance.index', { course: p.code }))}>
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
                                            <button className="ps-manage-btn" onClick={(e) => { e.stopPropagation(); router.get(route('clearance.index', { course: p.code })); }}>
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
                                        <button className="ps-roster-btn" onClick={() => router.get(route('clearance.index', { course: filters.course, section_id: s.id }))}>
                                            View Clearance <ChevronRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ════════════════ LEVEL 3: CLEARANCE TABLE ════════════════ */}
                    {filters.course && filters.section_id && (
                        <>
                            {/* ── METRICS ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 28 }}>
                        <StatItem label="Total Cleared" value={summary.total_cleared} color={C.green} icon={<ShieldCheck size={60} />} />
                        <StatItem label="Pending Issues" value={summary.total_pending} color={C.amber} icon={<Clock size={60} />} />
                        <StatItem label="Disciplinary Action" value={summary.total_under_action} color={C.red} icon={<Ban size={60} />} />
                        <StatItem label="On Hold" value={summary.total_hold} color={C.orange} icon={<AlertCircle size={60} />} />
                    </div>

                    {/* ── PURPOSE STATS ── */}
                    <div className="cm-purpose-row">
                        <PurposeStat label="Graduation Ready" count={summary.graduation_cleared_count} total={totalStudents} color={C.green} />
                        <div style={{ width: 1, height: 32, background: C.bdr2 }} />
                        <PurposeStat label="Enrollment Eligibility" count={summary.enrollment_cleared_count} total={totalStudents} color={C.o2} />
                        <div style={{ width: 1, height: 32, background: C.bdr2 }} />
                        <PurposeStat label="OJT / Internship" count={summary.ojt_cleared_count} total={totalStudents} color={C.o3} />
                    </div>

                    {/* ── FILTERS ── */}
                    <div className="cm-filters-row">
                        <div className="cm-fbox">
                            <Search size={14} color={C.orange} />
                            <input className="cm-finput" placeholder="Search student name or ID…" value={searchVal} onChange={e => setSearchVal(e.target.value)} />
                        </div>
                        <div className="cm-fbox">
                            <Filter size={14} color={C.orange} />
                            <select className="cm-finput" value={filters.status || ''} onChange={e => applyFilter('status', e.target.value)}>
                                <option value="">All Statuses</option>
                                <option value="cleared">Cleared</option>
                                <option value="pending_issues">Pending Issues</option>
                                <option value="under_disciplinary_action">Disciplinary Action</option>
                                <option value="hold">Hold</option>
                            </select>
                        </div>
                        <div className="cm-fbox">
                            <GraduationCap size={14} color={C.orange} />
                            <select className="cm-finput" value={filters.cleared_for || ''} onChange={e => applyFilter('cleared_for', e.target.value)}>
                                <option value="">All Purposes</option>
                                <option value="graduation">Graduation</option>
                                <option value="enrollment">Enrollment</option>
                                <option value="ojt">OJT / Internship</option>
                            </select>
                        </div>
                    </div>

                    {/* ── TABLE ── */}
                    <div className="cm-card">
                        <table className="cm-table">
                            <thead>
                                <tr>
                                    <th className="cm-th">STUDENT IDENTITY</th>
                                    <th className="cm-th">ACADEMIC LEVEL</th>
                                    <th className="cm-th">BEHAVIOR SCORE</th>
                                    <th className="cm-th">DEPARTMENT PROGRESS</th>
                                    <th className="cm-th">OVERALL STATUS</th>
                                    <th className="cm-th">EVALUATION DATE</th>
                                    <th className="cm-th" style={{ textAlign: 'right' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clearances.data.length > 0 ? clearances.data.map(cl => {
                                    const st = cl.student;
                                    const init = (st.first_name?.[0] || '') + (st.last_name?.[0] || '');
                                    const score = st.conduct_score?.total_score ?? 100;
                                    const sColor = conductColor(score);
                                    const stColor = cl.status_color || statusColors[cl.status];
                                    return (
                                        <tr key={cl.id} className="cm-row">
                                            <td className="cm-td">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                                    <div style={{ width: 44, height: 44, borderRadius: 16, background: C.surf2, border: `1px solid ${C.bdr2}`, display: 'flex', alignItems: 'center', justifyCenter: 'center', fontFamily: 'Space Mono', fontSize: 14, fontWeight: 700, color: C.orange, justifyContent: 'center' }}>
                                                        {init}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: 14, fontWeight: 700, color: C.txt }}>{st.first_name} {st.last_name}</div>
                                                        <div style={{ fontFamily: 'Space Mono', fontSize: 9, color: C.muted, textTransform: 'uppercase', letterSpacing: '.15em' }}>{st.student_id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="cm-td">
                                                <div style={{ fontSize: 13, fontWeight: 600 }}>{st.course}</div>
                                                <div style={{ fontFamily: 'Space Mono', fontSize: 9, color: C.dim, textTransform: 'uppercase' }}>{st.year_level} Year</div>
                                            </td>
                                            <td className="cm-td">
                                                <div className="cm-score-box">
                                                    <div className="cm-score-num" style={{ color: sColor }}>{score}</div>
                                                    <div className="cm-score-meter">
                                                        <div className="cm-score-fill" style={{ width: `${(score / 150) * 100}%`, background: sColor }} />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="cm-td">
                                                {st.clearance_entries && st.clearance_entries.length > 0 ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 140 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                                                            <span>Departments</span>
                                                            <span style={{ color: C.green }}>{st.clearance_entries.filter(e => e.status === 'cleared').length} / {st.clearance_entries.length}</span>
                                                        </div>
                                                        <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                                                            <div style={{ height: '100%', width: `${(st.clearance_entries.filter(e => e.status === 'cleared').length / st.clearance_entries.length) * 100}%`, background: C.green }} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="cm-purp-pill none" style={{ opacity: 0.5 }}>Uninitialized</span>
                                                )}
                                            </td>
                                            <td className="cm-td">
                                                <div className="cm-badge" style={{ background: `${stColor}12`, borderColor: `${stColor}30`, color: stColor }}>
                                                    <div className="cm-dot" style={{ background: stColor }} />
                                                    {cl.status_label}
                                                </div>
                                            </td>
                                            <td className="cm-td">
                                                <div style={{ fontFamily: 'Space Mono', fontSize: 10, color: C.muted }}>
                                                    {cl.last_evaluated_at ? new Date(cl.last_evaluated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pending Eval'}
                                                </div>
                                            </td>
                                            <td className="cm-td" style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                                    <button onClick={() => setClearanceStudent(st)} className="cm-action" style={{ borderColor: 'rgba(52,211,153,0.3)', color: C.green }} title="View Departments"><CheckCircle2 size={14} /></button>
                                                    <button onClick={() => openOverride(cl)} className="cm-action" title="Override Clearance"><Edit size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="7" className="cm-td" style={{ textAlign: 'center', padding: 80 }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.3 }}>
                                                <Info size={48} />
                                                <div style={{ fontFamily: 'Playfair Display', fontSize: 20, fontStyle: 'italic', marginTop: 16 }}>No records found</div>
                                                <div style={{ fontFamily: 'Space Mono', fontSize: 9, textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 4 }}>Try adjusting filters</div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ── PAGINATION ── */}
                    {clearances.last_page > 1 && (
                        <div className="cr-pg" style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 32 }}>
                            <button className="cr-pg-btn" disabled={!clearances.prev_page_url} onClick={() => router.get(clearances.prev_page_url, {}, { preserveState: true })}>
                                <ChevronLeft size={14} />
                            </button>
                            {Array.from({ length: clearances.last_page }, (_, i) => i + 1).map(p => (
                                <button key={p} className={`cr-pg-btn ${clearances.current_page === p ? 'active' : ''}`}
                                    onClick={() => applyFilter('page', p)}
                                    style={{ background: clearances.current_page === p ? C.orange : 'transparent', color: clearances.current_page === p ? C.bg : C.muted }}>
                                    {p}
                                </button>
                            ))}
                            <button className="cr-pg-btn" disabled={!clearances.next_page_url} onClick={() => router.get(clearances.next_page_url, {}, { preserveState: true })}>
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    )}
                    
                        </>
                    )}
                </div>
            </div>

            {/* ══ OVERRIDE MODAL ══ */}
            <Modal show={overrideModal.show} onClose={() => setOverrideModal({ show: false, clearance: null })} maxWidth="lg">
                <div className="cm-modal-root">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <div>
                            <div style={{ fontFamily: 'Space Mono', fontSize: 9, fontWeight: 700, color: C.orange, textTransform: 'uppercase', letterSpacing: '.15em' }}>Manual Verification</div>
                            <h3 style={{ fontFamily: 'Playfair Display', fontSize: 22, fontWeight: 900, fontStyle: 'italic' }}>
                                Override Clearance — <span style={{ color: C.orange }}>{overrideModal.clearance?.student?.name}</span>
                            </h3>
                        </div>
                        <button onClick={() => setOverrideModal({ show: false, clearance: null })} style={{ color: C.muted }}><X size={20} /></button>
                    </div>

                    <div style={{ background: 'rgba(249,115,22,0.08)', border: `1px solid ${C.orange}30`, borderRadius: 14, padding: 14, display: 'flex', gap: 12, marginBottom: 24 }}>
                        <AlertCircle size={20} color={C.orange} style={{ flexShrink: 0 }} />
                        <div style={{ fontSize: 12, color: C.txt }}>
                            <strong>Warning:</strong> Manual overrides bypass automatic conduct scoring evaluations. Ensure the justification note is accurate for audit purposes.
                        </div>
                    </div>

                    <form onSubmit={submitOverride} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <label style={{ fontFamily: 'Space Mono', fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase' }}>Target Status</label>
                            <select className="cm-input" value={overrideForm.data.status} onChange={e => overrideForm.setData('status', e.target.value)}>
                                <option value="cleared">Cleared (Full Approval)</option>
                                <option value="pending_issues">Pending Issues (Action Required)</option>
                                <option value="under_disciplinary_action">Under Disciplinary Action</option>
                                <option value="hold">Hold (Restricted)</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ fontFamily: 'Space Mono', fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase' }}>Justification / Administrative Note</label>
                            <textarea className="cm-input" style={{ height: 100, resize: 'none' }} placeholder="Detail the reason for this manual override (min. 10 characters)..." value={overrideForm.data.override_note} onChange={e => overrideForm.setData('override_note', e.target.value)} />
                            {overrideForm.errors.override_note && <div style={{ color: C.red, fontSize: 10, marginTop: 4 }}>{overrideForm.errors.override_note}</div>}
                        </div>

                        <button type="submit" className="cm-btn" disabled={overrideForm.processing} style={{ padding: 16 }}>
                            {overrideForm.processing ? 'Syncing...' : 'Authorize Override & Save'}
                        </button>
                    </form>
                </div>
            </Modal>

            {/* ══ DEPARTMENTAL CLEARANCE MODAL ══ */}
            <Modal show={!!clearanceStudent} onClose={() => setClearanceStudent(null)} maxWidth="lg">
                {clearanceStudent && (
                    <div style={{ background: C.surf, padding: '10px 10px 24px', borderRadius: 28, border: `1px solid ${C.border}`, overflow: 'hidden', position: 'relative' }}>
                        {/* Decorative Header */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 180, background: 'radial-gradient(circle at top right, rgba(52,211,153,0.1), transparent 70%)', pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 180, background: 'radial-gradient(circle at top left, rgba(52,211,153,0.05), transparent 70%)', pointerEvents: 'none' }} />
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '24px 24px 20px', position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                                <div style={{ width: 56, height: 56, borderRadius: 18, background: 'rgba(52,211,153,0.08)', border: `1px solid rgba(52,211,153,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.green }}>
                                    <CheckCircle2 size={26} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <div style={{ fontSize: 11, fontWeight: 800, color: C.green, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 6 }}>Departmental Verification</div>
                                    <h3 style={{ fontSize: 24, fontWeight: 900, color: C.txt, letterSpacing: '-.02em', lineHeight: 1.1 }}>
                                        Clearance Tracker
                                    </h3>
                                    <div style={{ fontSize: 13, color: C.muted, marginTop: 6, fontWeight: 500 }}>
                                        {clearanceStudent.last_name}, {clearanceStudent.first_name}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setClearanceStudent(null)} style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.05)', color: C.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', transition: 'all .2s' }}>
                                <X size={16} />
                            </button>
                        </div>

                        <div style={{ padding: '0 20px', maxHeight: 500, overflowY: 'auto' }} className="rv-scroll">
                            {!clearanceData ? (
                                <div style={{ textAlign: 'center', padding: 50, color: C.muted, fontSize: 13, fontWeight: 600 }}>Syncing departments…</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {/* Overall Progress */}
                                    <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.bdr}`, borderRadius: 18, marginBottom: 8 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                            <div style={{ fontSize: 10, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em' }}>Overall Progress</div>
                                            <div style={{ fontSize: 12, fontWeight: 900, color: C.green }}>{Math.round((clearanceData.cleared_count / clearanceData.total_departments) * 100)}%</div>
                                        </div>
                                        <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${(clearanceData.cleared_count / clearanceData.total_departments) * 100}%`, background: `linear-gradient(90deg, ${C.green}, #10b981)`, transition: 'width .6s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                                        </div>
                                    </div>

                                    {clearanceData.departments.map(dept => (
                                        <div key={dept.id} style={{ padding: '16px 20px', background: C.surf2, border: `1px solid ${dept.status === 'cleared' ? 'rgba(52,211,153,0.15)' : C.bdr2}`, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all .2s' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                                <div style={{ width: 40, height: 40, borderRadius: 12, background: dept.status === 'cleared' ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${dept.status === 'cleared' ? 'rgba(52,211,153,0.2)' : C.bdr2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: dept.status === 'cleared' ? C.green : C.dim }}>
                                                    {dept.status === 'cleared' ? <CheckCircle2 size={20} /> : <Shield size={20} />}
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 14, fontWeight: 700, color: C.txt }}>{dept.dept_name}</div>
                                                    <div style={{ fontSize: 10, color: dept.status === 'cleared' ? C.green : (dept.status === 'on_hold' ? C.red : C.dim), textTransform: 'uppercase', letterSpacing: '.06em', marginTop: 4, fontWeight: 800 }}>
                                                        {dept.status === 'cleared' ? 'Cleared' : dept.status.replace('_', ' ')}
                                                    </div>
                                                </div>
                                            </div>
                                            {dept.status !== 'cleared' ? (
                                                <button 
                                                    onClick={() => handleClearDepartment(dept.id)}
                                                    disabled={isClearing === dept.id}
                                                    style={{ padding: '10px 18px', borderRadius: 10, background: 'rgba(52,211,153,0.08)', border: `1px solid rgba(52,211,153,0.15)`, color: C.green, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.05em', cursor: 'pointer', transition: 'all .2s' }}
                                                >
                                                    {isClearing === dept.id ? '...' : 'Sign Off'}
                                                </button>
                                            ) : (
                                                <div style={{ fontSize: 10, color: C.muted, fontStyle: 'italic', fontWeight: 600 }}>{new Date(dept.cleared_at).toLocaleDateString()}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </AppLayout>
    );
}
