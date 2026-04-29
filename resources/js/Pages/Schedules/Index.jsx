import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm, router, Head } from '@/inertia-adapter';
import {
    Calendar, Clock, MapPin, User,
    Plus, Trash2, Layers, ChevronRight,
    Search, AlertCircle, BookOpen, Filter,
    CheckCircle2, RefreshCw, LayoutDashboard,
    ArrowLeft, MoreHorizontal, ShieldCheck, Users
} from 'lucide-react';
import Modal from '@/Components/Modal';

const C = {
    bg: '#0a0704',
    surf: '#120c06',
    card: '#1a1008',
    card2: '#201408',
    orange: '#f97316',
    o2: '#fb923c',
    o3: '#c2410c',
    green: '#34d399',
    red: '#f87171',
    blue: '#60a5fa',
    txt: '#fef3ec',
    muted: 'rgba(254,243,236,0.38)',
    dim: 'rgba(254,243,236,0.14)',
    border: 'rgba(249,115,22,0.09)',
    border2: 'rgba(249,115,22,0.22)',
};

const YEAR_LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700;9..40,900&family=Instrument+Serif:ital@0;1&family=Space+Mono:wght@400;700&display=swap');

.sc-root {
    background: ${C.bg}; min-height: 100vh;
    color: ${C.txt}; font-family: 'DM Sans', sans-serif;
    position: relative; padding: 32px;
}
.sc-grid-tex {
    position: fixed; inset: 0; pointer-events: none;
    background-image: linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px);
    background-size: 52px 52px; z-index: 0;
}
.sc-orb {
    position: fixed; top: -10%; right: -5%; width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 65%);
    pointer-events: none; z-index: 0;
}

/* Breadcrumbs */
.sc-bc { display: flex; align-items: center; gap: 8px; margin-bottom: 32px; position: relative; z-index: 10; }
.sc-bc-btn {
    font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .14em;
    color: ${C.muted}; cursor: pointer; background: none; border: none;
    transition: color .15s; padding: 0;
}
.sc-bc-btn:hover { color: ${C.o2}; }
.sc-bc-btn.active { color: ${C.orange}; cursor: default; }

/* Titles */
.sc-display { font-family: 'Instrument Serif', serif; font-style: italic; line-height: 1.05; letter-spacing: -.01em; }
.sc-main-title { font-size: 48px; color: ${C.txt}; margin-bottom: 8px; }
.sc-main-title em { color: ${C.orange}; }
.sc-subtitle { font-size: 13px; color: ${C.muted}; font-style: italic; margin-bottom: 40px; }

/* Toolbar (Mirror Sections) */
.sc-toolbar {
    display: flex; gap: 12px; margin-bottom: 32px; position: relative; z-index: 5;
}
.sc-search {
    flex: 1; background: ${C.surf}; border: 1px solid ${C.border};
    border-radius: 12px; display: flex; align-items: center; padding: 0 16px;
    height: 42px; transition: border-color .2s;
}
.sc-search:focus-within { border-color: ${C.border2}; }
.sc-search input {
    background: none; border: none; color: ${C.txt}; font-size: 13px;
    width: 100%; height: 100%; margin-left: 10px; outline: none;
}
.sc-filter-wrap {
    background: ${C.surf}; border: 1px solid ${C.border};
    border-radius: 12px; display: flex; align-items: center; padding: 0 16px;
    height: 42px;
}
.sc-filter-wrap select {
    background: none; border: none; color: ${C.txt}; font-size: 11px;
    font-weight: 700; text-transform: uppercase; letter-spacing: .05em;
    margin-left: 8px; outline: none; cursor: pointer;
}

/* Grid */
.sc-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; position: relative; z-index: 1; }

/* Program Card */
.sc-prog-card {
    background: ${C.card}; border: 1px solid ${C.border};
    border-radius: 20px; overflow: hidden;
    transition: all .25s cubic-bezier(.4,0,.2,1);
    position: relative; cursor: pointer; padding: 24px;
}
.sc-prog-card:hover {
    border-color: rgba(249,115,22,0.35); transform: translateY(-4px);
    box-shadow: 0 14px 34px rgba(0,0,0,0.5);
}
.sc-prog-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, ${C.orange}, ${C.o3}, transparent);
}
.sc-prog-code { font-family: 'Instrument Serif', serif; font-size: 40px; font-style: italic; color: ${C.txt}; line-height: 1; margin-bottom: 10px; }
.sc-prog-name { font-size: 11px; color: ${C.muted}; margin-bottom: 16px; line-height: 1.4; }
.sc-prog-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px;
    background: rgba(249,115,22,0.08); color: ${C.o2};
    font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em;
    border: 1px solid rgba(249,115,22,0.15); margin-bottom: 16px;
}
.sc-prog-fill { height: 3px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden; margin-bottom: 20px; }
.sc-prog-bar { height: 100%; background: linear-gradient(90deg, rgba(249,115,22,0.4), ${C.orange}); transition: width .5s; }

/* Section Grouping */
.sc-year-group { margin-bottom: 48px; }
.sc-year-lbl {
    font-family: 'Space Mono', monospace; font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .2em; color: ${C.orange};
    margin-bottom: 24px; display: flex; align-items: center; gap: 12px;
}
.sc-year-count {
    padding: 2px 8px; border-radius: 4px; background: ${C.surf};
    color: ${C.muted}; font-size: 9px; letter-spacing: .1em;
}

/* Section Card (Detailed) */
.sc-sec-card {
    background: ${C.card}; border: 1px solid ${C.border};
    border-radius: 18px; overflow: hidden; transition: all .22s;
    position: relative;
}
.sc-sec-card:hover { border-color: rgba(249,115,22,0.3); transform: translateY(-2px); }
.sc-sec-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, ${C.orange}, ${C.o3}, transparent); }
.sc-sec-body { padding: 20px; }
.sc-sec-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
.sc-sec-name { font-family: 'Instrument Serif', serif; font-size: 26px; font-style: italic; color: ${C.txt}; }
.sc-sec-sy { font-size: 10px; color: ${C.muted}; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 16px; }
.sc-sec-divider { height: 1px; background: ${C.border}; margin: 0 -20px 16px; }

.sc-sec-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.sc-sec-ico { width: 28px; height: 28px; border-radius: 8px; background: ${C.surf}; display: flex; align-items: center; justify-content: center; }
.sc-sec-flbl { font-size: 9px; font-weight: 800; text-transform: uppercase; color: ${C.muted}; letter-spacing: .05em; margin-bottom: 2px; }
.sc-sec-fval { font-size: 13px; font-weight: 500; color: ${C.txt}; }

.sc-count-row { display: flex; align-items: center; gap: 10px; margin-top: 4px; }
.sc-count-track { flex: 1; height: 3px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden; }
.sc-count-fill { height: 100%; background: linear-gradient(90deg, ${C.o3}, ${C.orange}); transition: width .6s; }

.sc-status-badge {
    padding: 3px 8px; border-radius: 6px; font-size: 8px; font-weight: 800;
    text-transform: uppercase; letter-spacing: .08em;
}
.sc-badge-approved { background: rgba(52,211,153,0.1); color: ${C.green}; border: 1px solid rgba(52,211,153,0.2); }
.sc-badge-pending { background: rgba(249,115,22,0.1); color: ${C.orange}; border: 1px solid rgba(249,115,22,0.2); }
.sc-badge-none { background: rgba(255,255,255,0.05); color: ${C.muted}; border: 1px solid rgba(255,255,255,0.1); }

/* Buttons */
.sc-btn {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 7px;
    padding: 11px; border-radius: 12px; font-family: inherit;
    font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .09em;
    cursor: pointer; transition: all .2s;
}
.sc-btn-primary {
    background: linear-gradient(135deg, ${C.orange}, ${C.o3});
    border: none; color: #fff; box-shadow: 0 4px 14px rgba(249,115,22,0.3);
}
.sc-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(249,115,22,0.4); }
.sc-btn-ghost {
    background: rgba(249,115,22,0.07); border: 1px solid rgba(249,115,22,0.14);
    color: ${C.muted}; margin-top: 8px;
}
.sc-btn-ghost:hover { background: rgba(249,115,22,0.12); color: ${C.txt}; border-color: ${C.border2}; }

.sc-sec-footer { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px; }

/* Matrix */
.sc-matrix-hdr { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 32px; gap: 20px; flex-wrap: wrap; }
.sc-matrix-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
.sc-day-col { background: rgba(22,14,8,0.3); border-radius: 16px; padding: 12px; min-height: 500px; border: 1px solid ${C.border}; }
.sc-day-label { 
    font-family: 'Space Mono', monospace; font-size: 9px; font-weight: 700; 
    color: ${C.o2}; text-transform: uppercase; letter-spacing: .15em; 
    text-align: center; margin-bottom: 16px; padding-bottom: 8px;
    border-bottom: 1px solid ${C.border};
}
.sc-slot {
    background: ${C.card}; border: 1px solid ${C.border}; border-radius: 12px;
    padding: 14px; margin-bottom: 10px; position: relative; transition: all .2s;
}
.sc-slot:hover { border-color: ${C.border2}; transform: scale(1.02); }
.sc-slot-subj { font-weight: 700; font-size: 12px; color: ${C.txt}; margin-bottom: 6px; }
.sc-slot-meta { font-size: 9px; color: ${C.muted}; display: flex; align-items: center; gap: 5px; margin-top: 3px; }

/* Modal */
.sc-modal-content { padding: 32px; background: ${C.bg}; color: ${C.txt}; border-radius: 20px; }
.sc-input { 
    width: 100%; background: ${C.surf}; border: 1px solid ${C.border}; 
    border-radius: 10px; padding: 12px; color: ${C.txt}; margin-top: 6px; 
    outline: none; font-family: inherit; font-size: 13px;
}
.sc-input:focus { border-color: ${C.border2}; }

/* Back Button */
.sc-back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .1em;
    color: rgba(249,115,22,0.5); cursor: pointer; background: none; border: none;
    transition: color .15s; margin-bottom: 24px;
}
.sc-back-btn:hover { color: ${C.orange}; }

/* Toast */
.sc-toast {
    position: fixed; bottom: 32px; right: 32px; z-index: 9999;
    padding: 14px 22px; border-radius: 14px;
    font-size: 12px; font-weight: 700; letter-spacing: .04em;
    display: flex; align-items: center; gap: 10px;
    animation: sc-toast-in .25s cubic-bezier(.4,0,.2,1);
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}
.sc-toast-success { background: rgba(52,211,153,0.12); border: 1px solid rgba(52,211,153,0.3); color: #34d399; }
.sc-toast-error   { background: rgba(248,113,113,0.12); border: 1px solid rgba(248,113,113,0.3); color: #f87171; }
@keyframes sc-toast-in { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }

/* Spin animation */
@keyframes sc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.sc-spinning { animation: sc-spin .7s linear infinite; display: inline-block; }
.sc-btn-success { background: ${C.green}; color: #000; border: none; }
.sc-btn-success:hover { background: #3fe9ac; }
@keyframes sc-pop { 0% { transform: scale(0.9); } 100% { transform: scale(1); } }
.sc-pop { animation: sc-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
`;

export default function Index({ view, department, programs, program, sections, section, schedules, teachers, flash }) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const [search, setSearch] = React.useState('');
    const [yearFilter, setYearFilter] = React.useState('All');
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [generatingId, setGeneratingId] = React.useState(null);
    const [successId, setSuccessId] = React.useState(null);
    const [localSchedules, setLocalSchedules] = React.useState(schedules || []);
    const [toast, setToast] = React.useState(flash?.success || flash?.error || null);
    const [toastType, setToastType] = React.useState(flash?.error ? 'error' : 'success');

    React.useEffect(() => {
        setLocalSchedules(schedules || []);
    }, [schedules]);

    React.useEffect(() => {
        if (toast) { const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); }
    }, [toast]);

    React.useEffect(() => {
        if (successId) { const t = setTimeout(() => setSuccessId(null), 2500); return () => clearTimeout(t); }
    }, [successId]);

    const { data, setData, post, processing, reset } = useForm({
        section_id:     section?.id || '',
        teacher_id:     '',
        subject:        '',
        course_code:    '',
        lec_units:      3,
        lab_units:      0,
        lec_day:        'M',
        lab_day:        '',
        day:            'monday',
        lec_start_time: '08:00',
        lec_end_time:   '10:00',
        lab_start_time: '',
        lab_end_time:   '',
        start_time:     '08:00',
        end_time:       '10:00',
        room:           '',
        lec_room:       '',
        lab_room:       '',
    });

    const navigate = (params) => {
        // Build a fresh URL to avoid parameter pollution
        const url = new URL(route('schedules.index'), window.location.origin);
        if (params.department) url.searchParams.append('department', params.department);
        if (params.program_code) url.searchParams.append('program_code', params.program_code);
        if (params.section_id) url.searchParams.append('section_id', params.section_id);
        
        router.visit(url.pathname + url.search, { 
            preserveState: false, // Ensure we get a fresh view
            preserveScroll: true 
        });
    };

    const handleGenerate = (id) => {
        setGeneratingId(id);
        // Correct signature: router.post(url, data, options)
        router.post(route('schedules.generate', id), {}, {
            onFinish: () => setGeneratingId(null),
            onSuccess: (res) => { 
                setSuccessId(id);
                // Update local state immediately if response contains schedules
                if (res.props?.schedules) {
                    setLocalSchedules(res.props.schedules);
                }
                setToast('Schedule generated successfully!'); 
                setToastType('success'); 
            },
            onError: () => { setToast('Failed to generate schedule.'); setToastType('error'); },
        });
    };

    const handleApprove = () => {
        router.post(route('schedules.approve', section.id), {}, {
            onSuccess: () => { setToast('Schedule approved!'); setToastType('success'); },
        });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('schedules.store'), {
            onSuccess: () => { setShowAddModal(false); reset(); },
        });
    };

    const filteredSections = sections?.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
        const matchesYear = yearFilter === 'All' || s.grade_level === yearFilter;
        return matchesSearch && matchesYear;
    }) || [];

    return (
        <AppLayout noPadding>
            <Head title="Class Scheduling" />
            <style>{css}</style>
            
            <div className="sc-root">
                <div className="sc-grid-tex" />
                <div className="sc-orb" />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Breadcrumbs */}
                    <div className="sc-bc">
                        <button className="sc-bc-btn" onClick={() => router.visit(route('dashboard'))}>
                            <LayoutDashboard size={12} style={{ marginRight: 6 }} /> Dashboard
                        </button>
                        {department && (
                            <>
                                <ChevronRight size={10} style={{ margin: '0 4px' }} color={C.muted} />
                                <button className={`sc-bc-btn ${!program ? 'active' : ''}`} onClick={() => navigate({})}>
                                    PROGRAM
                                </button>
                            </>
                        )}
                        {program && (
                            <>
                                <ChevronRight size={10} style={{ margin: '0 4px' }} color={C.muted} />
                                <button className={`sc-bc-btn ${!section ? 'active' : ''}`} onClick={() => navigate({ department, program_code: program.code })}>
                                    {program.code}
                                </button>
                            </>
                        )}
                        {section && (
                            <>
                                <ChevronRight size={10} style={{ margin: '0 4px' }} color={C.muted} />
                                <button className="sc-bc-btn active">
                                    {section.name}
                                </button>
                            </>
                        )}
                    </div>

                    {/* View 2: Programs */}
                    {view === 'programs' && (
                        <div className="sc-fade">
                            <h1 className="sc-display sc-main-title">{department} <em>Programs</em></h1>
                            <p className="sc-subtitle">Select a program to manage section-level scheduling</p>

                            <div className="sc-card-grid">
                                {programs.map(p => {
                                    const fillPct = p.total_sections ? (p.sections_count / p.total_sections) * 100 : 0;
                                    return (
                                        <div key={p.code} className="sc-prog-card" onClick={() => navigate({ department, program_code: p.code })}>
                                            <div className="sc-prog-code">{p.code}</div>
                                            <div className="sc-prog-name">{p.name}</div>
                                            <div className="sc-prog-chip">
                                                <Layers size={10} /> {p.sections_count} / {p.total_sections} Scheduled
                                            </div>
                                            <div className="sc-prog-fill">
                                                <div className="sc-prog-bar" style={{ width: `${fillPct}%` }} />
                                            </div>
                                            <button className="sc-btn sc-btn-ghost">
                                                Manage Sections <ChevronRight size={12} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* View 3: Sections */}
                    {view === 'sections' && (
                        <div className="sc-fade">
                            <button className="sc-back-btn" onClick={() => navigate({ department })}>
                                <ArrowLeft size={13} /> Back to Programs
                            </button>
                            <h1 className="sc-display sc-main-title">{program.code} <em>Sections</em></h1>
                            <p className="sc-subtitle">{program.name}</p>

                            <div className="sc-toolbar">
                                <div className="sc-search">
                                    <Search size={15} color={C.muted} />
                                    <input placeholder="Search sections..." value={search} onChange={e => setSearch(e.target.value)} />
                                </div>
                                <div className="sc-filter-wrap">
                                    <Filter size={14} color={C.muted} />
                                    <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
                                        <option value="All">All Years</option>
                                        {YEAR_LEVELS.map(y => <option key={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>

                            {YEAR_LEVELS.map(year => {
                                const ys = filteredSections.filter(s => s.grade_level === year);
                                if (ys.length === 0) return null;
                                return (
                                    <div key={year} className="sc-year-group">
                                        <div className="sc-year-lbl">
                                            {year}
                                            <span className="sc-year-count">{ys.length} section{ys.length !== 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="sc-card-grid">
                                            {ys.map(sec => {
                                                const fillPct = Math.min(((sec.students_count || 0) / 50) * 100, 100);
                                                return (
                                                    <div key={sec.id} className="sc-sec-card">
                                                        <div className="sc-sec-bar" />
                                                        <div className="sc-sec-body">
                                                            <div className="sc-sec-top">
                                                                <div className="sc-sec-name">{sec.name}</div>
                                                                <div className={`sc-status-badge ${sec.schedule_approved ? 'sc-badge-approved' : (sec.has_suggested_schedule ? 'sc-badge-pending' : 'sc-badge-none')}`}>
                                                                    {sec.schedule_approved ? 'Approved' : (sec.has_suggested_schedule ? 'Suggested' : 'No Schedule')}
                                                                </div>
                                                            </div>
                                                            <div className="sc-sec-sy">2024-2025 · {sec.grade_level}</div>
                                                            <div className="sc-sec-divider" />
                                                            
                                                            <div className="sc-sec-row">
                                                                <div className="sc-sec-ico"><User size={13} color="rgba(249,115,22,0.55)" /></div>
                                                                <div>
                                                                    <div className="sc-sec-flbl">Adviser</div>
                                                                    <div className="sc-sec-fval">{sec.adviser?.name || <span style={{ color: C.dim, fontStyle: 'italic', fontSize: 11 }}>TBA</span>}</div>
                                                                </div>
                                                            </div>

                                                            <div className="sc-sec-row">
                                                                <div className="sc-sec-ico"><Users size={13} color="rgba(249,115,22,0.55)" /></div>
                                                                <div style={{ flex: 1 }}>
                                                                    <div className="sc-sec-flbl">Enrollment</div>
                                                                    <div className="sc-count-row">
                                                                        <span className="sc-sec-fval">{sec.students_count || 0} students</span>
                                                                        <div className="sc-count-track">
                                                                            <div className="sc-count-fill" style={{ width: `${fillPct}%` }} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="sc-sec-footer">
                                                                 <button
                                                                    className={`sc-btn ${successId === sec.id ? 'sc-btn-success sc-pop' : 'sc-btn-primary'}`}
                                                                    disabled={generatingId === sec.id}
                                                                    onClick={() => handleGenerate(sec.id)}
                                                                >
                                                                    {successId === sec.id ? (
                                                                        <span className="sc-pop" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                            <CheckCircle2 size={12} /> Success!
                                                                        </span>
                                                                    ) : (
                                                                        <>
                                                                            <span className={generatingId === sec.id ? 'sc-spinning' : ''}>
                                                                                <RefreshCw size={12} />
                                                                            </span>
                                                                            {generatingId === sec.id ? 'Generating…' : (sec.has_suggested_schedule ? 'Regen' : 'Generate')}
                                                                        </>
                                                                    )}
                                                                </button>
                                                                <button className="sc-btn sc-btn-ghost" style={{ marginTop: 0 }} onClick={() => navigate({ department, program_code: program.code, section_id: sec.id })}>
                                                                    <Calendar size={12} /> Matrix
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* View 4: Matrix */}
                    {view === 'matrix' && (() => {
                        // Flatten localSchedules (handle both day-grouped object and flat array)
                        const rawSlots = Array.isArray(localSchedules) ? localSchedules : days.flatMap(day => (localSchedules[day] || []).map(s => ({ ...s, day })));
                        const allSlots = rawSlots;
                        const totalSlots = allSlots.length;

                        return (
                        <div className="sc-fade">
                            {/* Header */}
                            <div className="sc-matrix-hdr">
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                        <h1 className="sc-display sc-main-title" style={{ fontSize: 42, margin: 0 }}>{section.name} <em>Schedule</em></h1>
                                        {section.schedule_approved && <ShieldCheck size={28} color={C.green} />}
                                    </div>
                                    <p className="sc-subtitle" style={{ marginBottom: 0 }}>
                                        {program?.name || section.name} · {section.grade_level}
                                        {totalSlots > 0 && <span style={{ marginLeft: 12, padding: '2px 10px', background: C.surf, borderRadius: 6, fontSize: 11, color: C.muted }}>{totalSlots} subjects</span>}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button className="sc-btn sc-btn-ghost" style={{ width: 'auto' }} onClick={() => setShowAddModal(true)}>
                                        <Plus size={14} /> Manual Slot
                                    </button>
                                    <button className="sc-btn sc-btn-ghost" style={{ width: 'auto' }} onClick={() => handleGenerate(section.id)}>
                                        <span className={generatingId === section.id ? 'sc-spinning' : ''}><RefreshCw size={14} /></span>
                                        {generatingId === section.id ? 'Generating…' : 'Regenerate'}
                                    </button>
                                    {!section.schedule_approved && (
                                        <button className="sc-btn sc-btn-primary" style={{ width: 'auto', background: C.green, border: 'none' }} onClick={handleApprove}>
                                            <CheckCircle2 size={14} /> Approve
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Empty state */}
                            {totalSlots === 0 && (
                                <div style={{ textAlign: 'center', padding: '80px 0', background: C.surf, borderRadius: 20, border: `1px solid ${C.border}` }}>
                                    <Calendar size={40} color="rgba(249,115,22,0.2)" style={{ margin: '0 auto 16px' }} />
                                    <div style={{ fontSize: 18, fontFamily: 'Instrument Serif', fontStyle: 'italic', color: C.muted, marginBottom: 8 }}>No schedule generated yet</div>
                                    <div style={{ fontSize: 12, color: C.dim, marginBottom: 24 }}>Click Regenerate to auto-populate subjects from the curriculum</div>
                                    <button className="sc-btn sc-btn-primary" style={{ width: 'auto', margin: '0 auto' }} onClick={() => handleGenerate(section.id)}>
                                        <RefreshCw size={14} /> Generate Schedule
                                    </button>
                                </div>
                            )}

                            {/* Enhanced Schedule Table — School Format */}
                            {totalSlots > 0 && (
                                <div style={{ borderRadius: 20, overflow: 'hidden', border: `1px solid ${C.border}` }}>
                                    {/* Table Header */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '100px 1fr 80px 80px 120px 180px 180px 100px 48px',
                                        background: C.surf, padding: '14px 20px',
                                        borderBottom: `1px solid ${C.border}`,
                                        gap: 8,
                                    }}>
                                        {['Course Code', 'Course Description', 'Lec Units', 'Lab Units', 'Day', 'Time', 'Room', 'Section', ''].map((h, i) => (
                                            <div key={i} style={{ fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted }}>{h}</div>
                                        ))}
                                    </div>

                                    {/* Rows */}
                                    {allSlots.map((slot, idx) => {
                                        const hasLab = slot.lab_units > 0;
                                        const combinedTime = hasLab && slot.lab_start_time
                                            ? `${slot.lec_start_time?.substring(0,5)}–${slot.lec_end_time?.substring(0,5)} / ${slot.lab_start_time?.substring(0,5)}–${slot.lab_end_time?.substring(0,5)}`
                                            : `${slot.start_time?.substring(0,5)}–${slot.end_time?.substring(0,5)}`;

                                        return (
                                            <div key={slot.id} style={{
                                                display: 'grid',
                                                gridTemplateColumns: '100px 1fr 80px 80px 120px 180px 180px 100px 48px',
                                                alignItems: 'center', gap: 8,
                                                padding: '14px 20px',
                                                background: idx % 2 === 0 ? C.card : 'rgba(26,16,8,0.6)',
                                                borderBottom: `1px solid ${C.border}`,
                                                transition: 'background .15s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.05)'}
                                            onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? C.card : 'rgba(26,16,8,0.6)'}
                                            >
                                                {/* Course Code */}
                                                <div style={{
                                                    fontFamily: 'Space Mono, monospace', fontSize: 10, fontWeight: 700,
                                                    color: C.orange, background: 'rgba(249,115,22,0.08)',
                                                    padding: '3px 8px', borderRadius: 6,
                                                    border: `1px solid rgba(249,115,22,0.18)`,
                                                    display: 'inline-block',
                                                }}>
                                                    {slot.course_code ?? '—'}
                                                </div>

                                                {/* Course Description */}
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: 12, color: C.txt }}>{slot.subject}</div>
                                                    {slot.teacher && (
                                                        <div style={{ fontSize: 10, color: C.muted, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                            <User size={9} /> {slot.teacher.name}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Lec Units */}
                                                <div style={{ textAlign: 'center' }}>
                                                    <span style={{
                                                        fontSize: 13, fontWeight: 800, color: C.blue,
                                                        fontFamily: 'Space Mono, monospace',
                                                    }}>{slot.lec_units ?? '—'}</span>
                                                </div>

                                                {/* Lab Units */}
                                                <div style={{ textAlign: 'center' }}>
                                                    <span style={{
                                                        fontSize: 13, fontWeight: 800,
                                                        color: hasLab ? C.green : C.muted,
                                                        fontFamily: 'Space Mono, monospace',
                                                    }}>{slot.lab_units > 0 ? slot.lab_units : '—'}</span>
                                                </div>

                                                {/* Day — combined e.g. M/W */}
                                                <div>
                                                    <span style={{
                                                        display: 'inline-block', padding: '3px 10px', borderRadius: 6,
                                                        fontSize: 9, fontWeight: 800, textTransform: 'uppercase',
                                                        letterSpacing: '.08em', background: 'rgba(249,115,22,0.08)',
                                                        color: C.o2, border: `1px solid rgba(249,115,22,0.15)`,
                                                    }}>
                                                        {slot.day}
                                                    </span>
                                                </div>

                                                {/* Time — split Lec / Lab */}
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: hasLab ? 4 : 0 }}>
                                                        <Clock size={10} color={C.blue} />
                                                        <span style={{ fontSize: 11, color: C.txt, fontFamily: 'Space Mono, monospace' }}>
                                                            {slot.lec_start_time?.substring(0,5) ?? slot.start_time?.substring(0,5)}–{slot.lec_end_time?.substring(0,5) ?? slot.end_time?.substring(0,5)}
                                                        </span>
                                                        <span style={{ fontSize: 8, color: C.blue, fontWeight: 700 }}>LEC</span>
                                                    </div>
                                                    {hasLab && slot.lab_start_time && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                            <Clock size={10} color={C.green} />
                                                            <span style={{ fontSize: 11, color: C.txt, fontFamily: 'Space Mono, monospace' }}>
                                                                {slot.lab_start_time?.substring(0,5)}–{slot.lab_end_time?.substring(0,5)}
                                                            </span>
                                                            <span style={{ fontSize: 8, color: C.green, fontWeight: 700 }}>LAB</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Room — split Lec / Lab */}
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: hasLab ? 4 : 0 }}>
                                                        <MapPin size={10} color={C.blue} />
                                                        <span style={{ fontSize: 11, color: slot.lec_room ? C.txt : C.muted }}>
                                                            {slot.lec_room ?? slot.room ?? 'TBA'}
                                                        </span>
                                                    </div>
                                                    {hasLab && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                            <MapPin size={10} color={C.green} />
                                                            <span style={{ fontSize: 11, color: slot.lab_room ? C.txt : C.muted }}>
                                                                {slot.lab_room ?? 'TBA'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Section badge */}
                                                <div>
                                                    <span style={{
                                                        fontSize: 9, fontWeight: 800, padding: '2px 8px',
                                                        borderRadius: 6, background: 'rgba(167,139,250,0.1)',
                                                        color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)',
                                                        fontFamily: 'Space Mono, monospace',
                                                    }}>
                                                        {slot.section ?? section?.name ?? '—'}
                                                    </span>
                                                </div>

                                                {/* Delete */}
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <button
                                                        style={{ background: 'none', border: 'none', color: 'rgba(248,113,113,0.25)', cursor: 'pointer', padding: 4, borderRadius: 6, transition: 'color .15s' }}
                                                        onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                                                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(248,113,113,0.25)'}
                                                        onClick={() => router.delete(route('schedules.destroy', slot.id))}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Total Units Summary Footer */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '100px 1fr 80px 80px 120px 180px 180px 100px 48px',
                                        gap: 8, padding: '12px 20px',
                                        background: C.surf, borderTop: `1px solid ${C.border2}`,
                                    }}>
                                        <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', color: C.muted, gridColumn: '1/3', display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <BookOpen size={11} /> Total Units
                                        </div>
                                        <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 800, color: C.blue, fontFamily: 'Space Mono, monospace' }}>
                                            {allSlots.reduce((s, r) => s + (r.lec_units ?? 0), 0)}
                                        </div>
                                        <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 800, color: C.green, fontFamily: 'Space Mono, monospace' }}>
                                            {allSlots.reduce((s, r) => s + (r.lab_units ?? 0), 0)}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        );
                    })()}

                </div>
            </div>

            <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
                <div className="sc-modal-content">
                    <h2 className="sc-display" style={{ fontSize: 32, marginBottom: 24 }}>Add <em>Manual</em> Slot</h2>
                    <form onSubmit={submit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            <div>
                                <label className="sc-sec-flbl">Course Code</label>
                                <input className="sc-input" value={data.course_code ?? ''} onChange={e => setData('course_code', e.target.value)} placeholder="e.g. ITP105" />
                            </div>
                            <div>
                                <label className="sc-sec-flbl">Subject Description</label>
                                <input className="sc-input" value={data.subject} onChange={e => setData('subject', e.target.value)} placeholder="e.g. Networking and Communication 2" />
                            </div>
                            <div>
                                <label className="sc-sec-flbl">Lec Units</label>
                                <input type="number" className="sc-input" value={data.lec_units ?? 3} onChange={e => setData('lec_units', e.target.value)} min={0} max={6} />
                            </div>
                            <div>
                                <label className="sc-sec-flbl">Lab Units</label>
                                <input type="number" className="sc-input" value={data.lab_units ?? 0} onChange={e => setData('lab_units', e.target.value)} min={0} max={3} />
                            </div>
                            <div>
                                <label className="sc-sec-flbl">Lecture Day</label>
                                <select className="sc-input" value={data.lec_day ?? 'M'} onChange={e => setData('lec_day', e.target.value)}>
                                    {['M','T','W','Th','F','Sa'].map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="sc-sec-flbl">Lab Day</label>
                                <select className="sc-input" value={data.lab_day ?? ''} onChange={e => setData('lab_day', e.target.value)}>
                                    <option value="">None (no lab)</option>
                                    {['M','T','W','Th','F','Sa'].map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="sc-sec-flbl">Lec Start Time</label>
                                <input type="time" className="sc-input" value={data.lec_start_time ?? data.start_time} onChange={e => setData('lec_start_time', e.target.value)} />
                            </div>
                            <div>
                                <label className="sc-sec-flbl">Lec End Time</label>
                                <input type="time" className="sc-input" value={data.lec_end_time ?? data.end_time} onChange={e => setData('lec_end_time', e.target.value)} />
                            </div>
                            <div>
                                <label className="sc-sec-flbl">Lab Start Time</label>
                                <input type="time" className="sc-input" value={data.lab_start_time ?? ''} onChange={e => setData('lab_start_time', e.target.value)} />
                            </div>
                            <div>
                                <label className="sc-sec-flbl">Lab End Time</label>
                                <input type="time" className="sc-input" value={data.lab_end_time ?? ''} onChange={e => setData('lab_end_time', e.target.value)} />
                            </div>
                            <div>
                                <label className="sc-sec-flbl">Professor</label>
                                <select className="sc-input" value={data.teacher_id} onChange={e => setData('teacher_id', e.target.value)}>
                                    <option value="">TBA</option>
                                    {teachers?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="sc-sec-flbl">Lecture Room</label>
                                <input className="sc-input" value={data.lec_room ?? ''} onChange={e => setData('lec_room', e.target.value)} placeholder="e.g. BCH 310" />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label className="sc-sec-flbl">Lab Room</label>
                                <input className="sc-input" value={data.lab_room ?? ''} onChange={e => setData('lab_room', e.target.value)} placeholder="e.g. COMLAB 4" />
                            </div>
                        </div>
                        <div style={{ marginTop: 30, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => setShowAddModal(false)} className="sc-btn sc-btn-ghost" style={{ width: 'auto', margin: 0 }}>Cancel</button>
                            <button type="submit" className="sc-btn sc-btn-primary" style={{ width: 'auto' }} disabled={processing}>Save Slot</button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Toast Notification */}
            {toast && (
                <div className={`sc-toast ${toastType === 'error' ? 'sc-toast-error' : 'sc-toast-success'}`}>
                    {toastType === 'success'
                        ? <CheckCircle2 size={16} />
                        : <AlertCircle size={16} />}
                    {toast}
                </div>
            )}
        </AppLayout>
    );
}