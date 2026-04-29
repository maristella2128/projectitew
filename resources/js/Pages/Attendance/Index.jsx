import React, { useState, useMemo, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm, router, Link } from '@inertiajs/react';
import { 
    Calendar, CheckCircle, XCircle, 
    Clock, AlertCircle, Save, 
    ArrowRight, Layers, User, Search,
    Check, X, Minus, ShieldCheck, Activity,
    ChevronRight, ChevronLeft, ArrowLeft, Filter, GraduationCap,
    RefreshCcw, Users, UserPlus, Download, FileText, Trash2
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS (Shared with Sections Module)
───────────────────────────────────────────────────────────────────────────── */
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
    border: 'rgba(10,7,4,0.12)',
    borderO: 'rgba(249,115,22,0.09)',
    borderO2: 'rgba(249,115,22,0.22)',
};

/* ─────────────────────────────────────────────────────────────────────────────
   STYLES (Dashboard Premium Theme)
───────────────────────────────────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700;9..40,900&family=Instrument+Serif:ital@0;1&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');

.at-root {
  background: ${C.bg};
  min-height: 100%;
  flex: 1; display: flex; flex-direction: column;
  font-family: 'DM Sans', system-ui, sans-serif;
  color: ${C.txt};
  position: relative;
}

/* ambient */
.at-grid {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    linear-gradient(${C.borderO} 1px, transparent 1px),
    linear-gradient(90deg, ${C.borderO} 1px, transparent 1px);
  background-size: 52px 52px;
}
.at-orb1 {
  position: fixed; top: -10%; left: -5%;
  width: 500px; height: 500px; border-radius: 50%;
  background: radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 70%);
  pointer-events: none; z-index: 0;
}

.at-content { position: relative; z-index: 1; max-width: 1400px; margin: 0 auto; width: 100%; padding: 0 32px 80px; }

/* topbar fallback / nav */
.at-topbar {
    position: sticky; top: 0; z-index: 50;
    background: rgba(10,7,4,0.82); backdrop-filter: blur(14px);
    border-bottom: 1px solid ${C.borderO};
    padding: 14px 32px;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    margin-bottom: 32px;
}
.at-breadcrumb { display: flex; align-items: center; gap: 8px; }
.at-bc-btn {
    font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .14em;
    color: ${C.muted}; cursor: pointer; background: none; border: none;
    font-family: inherit; transition: color .15s; padding: 0;
}
.at-bc-btn:hover { color: ${C.o2}; }
.at-bc-btn.active { color: ${C.orange}; cursor: default; }
.at-bc-sep { color: ${C.dim}; }

.at-title {
  font-family: 'Playfair Display', serif;
  font-size: 38px; font-weight: 900; color: ${C.txt};
  line-height: 0.9; letter-spacing: -.03em;
  margin-bottom: 4px;
}
.at-title em { color: ${C.orange}; font-style: italic; display: block; }
.at-sub { font-size: 11px; color: ${C.muted}; font-style: italic; }

/* programs grid */
.at-prog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
}

/* cards */
.at-card {
    background: ${C.card};
    border: 1px solid ${C.borderO};
    border-radius: 20px; overflow: hidden;
    transition: all .25s cubic-bezier(.4,0,.2,1);
    position: relative; cursor: pointer;
    display: flex; flex-direction: column;
}
.at-card:hover {
    border-color: rgba(249,115,22,0.35);
    transform: translateY(-4px);
    box-shadow: 0 14px 34px rgba(0,0,0,0.5), 0 0 0 1px rgba(249,115,22,0.08);
}
.at-card::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, ${C.orange}, ${C.o3}, transparent);
}
.at-card-body { padding: 24px; flex: 1; display: flex; flex-direction: column; }
.at-card-code { font-family: 'Instrument Serif', serif; font-size: 42px; font-style: italic; color: ${C.txt}; line-height: 1; }
.at-card-name { font-size: 12px; color: ${C.muted}; margin: 8px 0 16px; min-height: 36px; }
.at-chips { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
.at-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px;
    font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .07em;
}
.chip-o { background: rgba(249,115,22,0.1); color: ${C.o2}; border: 1px solid rgba(249,115,22,0.18); }
.chip-g { background: rgba(52,211,153,0.08); color: ${C.green}; border: 1px solid rgba(52,211,153,0.16); }

.at-btn-manage {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 7px;
    padding: 12px; border-radius: 12px;
    background: rgba(249,115,22,0.07); border: 1px solid rgba(249,115,22,0.14);
    color: ${C.muted}; font-size: 10px; font-weight: 800;
    text-transform: uppercase; letter-spacing: .09em; font-family: inherit;
    cursor: pointer; transition: all .2s;
}
.at-card:hover .at-btn-manage {
    background: linear-gradient(135deg, ${C.orange}, ${C.o3});
    border-color: transparent; color: #fff;
}

/* section card specifics */
.at-sec-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 14px;
}
.at-year-lbl {
    font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700;
    color: ${C.o2}; text-transform: uppercase; letter-spacing: .12em;
    display: flex; align-items: center; gap: 12px; margin: 32px 0 16px;
}
.at-year-lbl::after { content: ''; flex: 1; height: 1px; background: rgba(249,115,22,0.1); }
.at-sec-name { font-family: 'Instrument Serif', serif; font-size: 28px; font-style: italic; color: ${C.txt}; margin-bottom: 2px; }
.at-sec-sy { font-family: 'Space Mono', monospace; font-size: 8px; font-weight: 700; color: ${C.dim}; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 14px; }
.at-sec-info { 
    display: flex; align-items: center; gap: 10px; margin-top: 12px; 
    padding-top: 12px; border-top: 1px solid rgba(249,115,22,0.06);
}
.at-sec-ico {
    width: 32px; height: 32px; border-radius: 8px;
    background: rgba(249,115,22,0.06); border: 1px solid rgba(249,115,22,0.1);
    display: flex; align-items: center; justify-content: center;
}

/* matrix view */
.at-table-card {
  background: ${C.card}; border: 1px solid ${C.borderO}; border-radius: 20px;
  overflow: hidden; box-shadow: 0 15px 50px rgba(0,0,0,0.5);
  animation: slideUp 0.4s ease-out;
}
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.at-table { width: 100%; border-collapse: collapse; }
.at-th {
  text-align: left; padding: 18px 24px; border-bottom: 1px solid ${C.borderO};
  font-family: 'Space Mono', monospace; font-size: 9px; color: ${C.muted};
  text-transform: uppercase; letter-spacing: .15em;
}
.at-td { padding: 20px 24px; border-bottom: 1px solid rgba(254,243,236,0.03); }

.at-student-info { display: flex; align-items: center; gap: 10px; }
.at-avatar {
  width: 32px; height: 32px; border-radius: 8px;
  background: rgba(249,115,22,0.06); border: 1px solid rgba(249,115,22,0.12);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700; color: ${C.orange};
}

/* Excel Style Table */
.at-table-excel { width: 100%; border-collapse: separate; border-spacing: 0; }
.at-th-excel {
  text-align: center; padding: 14px 10px; border-bottom: 1px solid ${C.borderO2};
  border-right: 1px solid rgba(249,115,22,0.05);
  font-family: 'Space Mono', monospace; font-size: 9px; color: ${C.muted};
  text-transform: uppercase; letter-spacing: .12em; background: rgba(255,255,255,0.01);
}
.at-th-excel:first-child { text-align: left; padding-left: 24px; }
.at-td-excel { 
  padding: 12px 10px; border-bottom: 1px solid rgba(255,255,255,0.03); 
  border-right: 1px solid rgba(255,255,255,0.02);
  vertical-align: middle;
}
.at-td-excel:first-child { padding-left: 24px; }
.at-td-excel:last-child { border-right: none; }

/* Status Toggle Cell */
.at-status-cell {
  width: 100%; display: flex; justify-content: center;
}
.at-status-toggle {
  width: 42px; height: 42px; border-radius: 12px;
  background: transparent; border: 1px solid transparent;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  cursor: pointer; transition: all .2s; gap: 3px;
  color: ${C.dim};
}
.at-status-toggle span { font-size: 6px; font-weight: 900; text-transform: uppercase; }

.at-status-toggle:hover { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08); color: ${C.muted}; }

.at-status-toggle.active.present { color: ${C.green}; background: rgba(52,211,153,0.08); border-color: rgba(52,211,153,0.2); }
.at-status-toggle.active.absent  { color: ${C.red}; background: rgba(248,113,113,0.08); border-color: rgba(248,113,113,0.2); }
.at-status-toggle.active.late    { color: #fbbf24; background: rgba(251,191,36,0.08); border-color: rgba(251,191,36,0.2); }
.at-status-toggle.active.excused { color: ${C.blue}; background: rgba(96,165,250,0.08); border-color: rgba(96,165,250,0.2); }

.at-id-mono { font-family: 'Space Mono', monospace; font-size: 10px; color: ${C.orange}; opacity: 0.6; }

/* Function Bar */
.at-func-bar {
  display: flex; align-items: center; justify-content: space-between; gap: 20px;
  background: rgba(255,255,255,0.02); border: 1px solid ${C.borderO2};
  padding: 12px 24px; border-radius: 20px; margin-bottom: 20px;
}
.at-bulk-grp { display: flex; align-items: center; gap: 8px; }
.at-btn-bulk {
  padding: 8px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);
  background: rgba(255,255,255,0.03); color: ${C.muted};
  font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .1em;
  cursor: pointer; transition: all .2s;
}
.at-btn-bulk:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.15); color: ${C.txt}; }
.at-btn-bulk.p:hover { background: rgba(52,211,153,0.1); border-color: rgba(52,211,153,0.2); color: ${C.green}; }
.at-btn-bulk.a:hover { background: rgba(248,113,113,0.1); border-color: rgba(248,113,113,0.2); color: ${C.red}; }

.at-btn-export {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 16px; border-radius: 12px;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
  color: ${C.muted}; font-size: 10px; font-weight: 800;
  text-transform: uppercase; letter-spacing: .1em;
  cursor: pointer; transition: all .2s;
}
.at-btn-export:hover {
  background: rgba(249,115,22,0.1); border-color: rgba(249,115,22,0.3);
  color: ${C.orange}; transform: translateY(-1px);
}

.at-btn-clear {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 16px; border-radius: 12px;
  background: rgba(248,113,113,0.03); border: 1px solid rgba(248,113,113,0.1);
  color: rgba(248,113,113,0.5); font-size: 10px; font-weight: 800;
  text-transform: uppercase; letter-spacing: .1em;
  cursor: pointer; transition: all .2s;
}
.at-btn-clear:hover {
  background: rgba(248,113,113,0.1); border-color: rgba(248,113,113,0.3);
  color: #f87171; transform: translateY(-1px);
}

.at-history-modal {
  position: fixed; inset: 0; z-index: 10000;
  background: rgba(8,6,4,0.9); backdrop-filter: blur(20px);
  display: flex; align-items: center; justify-content: center; padding: 20px;
  animation: at-fade-in 0.3s ease;
}
@keyframes at-fade-in { from { opacity: 0; } to { opacity: 1; } }

.at-history-content {
  width: 100%; maxWidth: 500px; max-height: 80vh;
  background: ${C.surf}; border: 1px solid ${C.borderO2}; borderRadius: 32px;
  display: flex; flex-direction: column; overflow: hidden;
  box-shadow: 0 40px 100px rgba(0,0,0,0.8);
}
.at-history-body {
  flex: 1; overflow-y: auto; padding: 0 24px 32px;
}
.at-history-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.03);
}

.at-student-link {
  background: none; border: none; padding: 0; margin: 0;
  text-align: left; cursor: pointer; transition: all 0.2s;
  display: flex; flex-direction: column;
}
.at-student-link:hover .at-student-name { color: ${C.orange} !important; }
.at-student-link:hover .at-id-mono { color: ${C.txt} !important; opacity: 0.5; }

.at-stats-grp { display: flex; align-items: center; gap: 24px; }
.at-stat-item { display: flex; flex-direction: column; align-items: center; }
.at-stat-val { font-family: 'Space Mono', monospace; font-size: 16px; font-weight: 700; color: ${C.txt}; line-height: 1; }
.at-stat-lbl { font-size: 8px; font-weight: 900; text-transform: uppercase; color: ${C.muted}; margin-top: 4px; }

/* Notice */
.at-notice {
  position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
  background: rgba(10,7,4,0.9); backdrop-filter: blur(20px);
  border: 1px solid ${C.green}; border-radius: 20px;
  padding: 16px 32px; display: flex; align-items: center; gap: 16px;
  color: ${C.green}; font-size: 13px; font-weight: 600;
  box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 40px rgba(52,211,153,0.1);
  z-index: 1000; animation: noticeIn .4s cubic-bezier(.4,0,.2,1);
}
@keyframes noticeIn { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }

.at-step-btn {
  width: 34px; height: 34px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  color: ${C.muted}; cursor: pointer; transition: all .2s;
}
.at-step-btn:hover { background: rgba(249,115,22,0.1); color: ${C.orange}; border-color: rgba(249,115,22,0.3); }

/* Unified filter item for date */
.at-date-container {
  display: flex; align-items: center; gap: 4px;
  background: rgba(255,255,255,0.02); border: 1px solid ${C.borderO2};
  padding: 4px; border-radius: 14px;
}

.at-date-input-wrapper {
  display: flex; align-items: center; justify-content: center;
  padding: 0 16px; min-width: 140px; position: relative;
}

.at-date {
  background: transparent; border: none; outline: none;
  font-family: 'Space Mono', monospace; font-size: 14px; font-weight: 700;
  color: ${C.txt}; cursor: pointer; width: 100%; text-align: center;
}

/* Make whole input clickable to show picker and hide native icon */
.at-date::-webkit-calendar-picker-indicator {
  position: absolute; left: 0; top: 0; width: 100%; height: 100%;
  margin: 0; padding: 0; cursor: pointer; opacity: 0;
}

.at-save-bar { position: sticky; bottom: 0; background: linear-gradient(to top, #0c0805 80%, transparent); padding: 32px 0 20px; display: flex; justify-content: flex-end; }
.at-btn-save {
  background: linear-gradient(135deg, ${C.orange}, ${C.o3});
  color: white; padding: 14px 36px; border-radius: 16px;
  font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: .12em;
  border: none; cursor: pointer; box-shadow: 0 8px 30px rgba(249,115,22,0.3);
  display: flex; align-items: center; gap: 10px; transition: all .2s;
}
.at-btn-save:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(249,115,22,0.45); }

.at-filter-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 20px; background: ${C.card2}; border-radius: 16px;
  border: 1px solid ${C.borderO2};
}
.at-date {
  background: transparent; border: none; outline: none;
  color: ${C.txt}; font-size: 13px; font-weight: 700;
}
`;

const YEAR_LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function AttendanceIndex({ programs, sections, students, currentDate, currentSection, currentProgram }) {
    const { data, setData, post, transform, processing } = useForm({
        date: currentDate,
        attendance: students.map(s => ({
            student_id: s.id,
            status: s.attendance[0]?.status || 'present'
        }))
    });

    const [notice, setNotice] = useState(null);
    const [search, setSearch] = useState(''); // Re-added for sections view
    const [matrixSearch, setMatrixSearch] = useState('');

    // History Modal States
    const [historyStudent, setHistoryStudent] = useState(null);
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const handleShowHistory = async (student) => {
        setHistoryStudent(student);
        setHistoryLoading(true);
        try {
            const res = await axios.get(route('attendance.student-history', student.id));
            setAttendanceHistory(res.data.history);
        } catch (err) {
            console.error(err);
        } finally {
            setHistoryLoading(false);
        }
    };

    // SYNC DATE: Ensure form date matches the prop when navigating
    useEffect(() => {
        setData('date', currentDate);
    }, [currentDate]);

    useEffect(() => {
        setData('attendance', students.map(s => ({
            student_id: s.id,
            status: s.attendance[0]?.status || null // Default to null (unmarked)
        })));
    }, [students]);

    // STATS CALCULATION
    const stats = useMemo(() => {
        return data.attendance.reduce((acc, curr) => {
            if (curr.status) acc[curr.status] = (acc[curr.status] || 0) + 1;
            return acc;
        }, { present: 0, absent: 0, late: 0, excused: 0 });
    }, [data.attendance]);

    const handleNavigate = (program, sectionId, date) => {
        const params = { date: date || data.date };
        if (program) params.program = program;
        if (sectionId) params.section_id = sectionId;
        
        // Pass params inside route() for robust Zaggy resolution
        router.get(route('attendance.index', params), {}, { 
            preserveState: !!sectionId,
            preserveScroll: true 
        });
    };

    const markAllStatus = (status) => {
        const newAttendance = data.attendance.map(a => ({ ...a, status }));
        setData('attendance', newAttendance);
    };

    const stepDate = (days) => {
        const d = new Date(data.date);
        d.setDate(d.getDate() + days);
        const newDate = d.toISOString().split('T')[0];
        setData('date', newDate);
        handleNavigate(currentProgram, currentSection, newDate);
    };

    const updateStatus = (index, status) => {
        const newAttendance = [...data.attendance];
        newAttendance[index].status = status;
        setData('attendance', newAttendance);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const hasMarked = data.attendance.some(a => a.status !== null);
        
        if (!hasMarked) {
            setNotice('Please mark at least one student');
            setTimeout(() => setNotice(null), 3000);
            return;
        }

        // Apply transformation before posting
        transform((data) => ({
            ...data,
            attendance: data.attendance.filter(a => a.status !== null)
        }));

        post(route('attendance.store'), {
            onSuccess: () => {
                setNotice('Registry synced successfully');
                setTimeout(() => setNotice(null), 4000);
            }
        });
    };

    const activeProgram = programs.find(p => p.code === currentProgram);
    const activeSection = sections.find(s => s.id === currentSection);

    const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
    const isToday = data.date === todayStr;
    const isFutureDate = data.date > todayStr;

    // Breadcrumbs logic
    const breadcrumbs = [
        { label: 'Programs', action: () => handleNavigate(null, null) }
    ];
    if (activeProgram) {
        breadcrumbs.push({ label: activeProgram.code, action: () => handleNavigate(activeProgram.code, null) });
    }
    if (activeSection) {
        breadcrumbs.push({ label: activeSection.name, action: null });
    }

    const filteredSections = useMemo(() => 
        sections.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    , [sections, search]);

    const filteredStudents = useMemo(() => 
        students.filter(s => `${s.first_name} ${s.last_name}`.toLowerCase().includes(matrixSearch.toLowerCase()))
    , [students, matrixSearch]);

    return (
        <AppLayout title="Presence Tracking" noPadding>
            <style>{css}</style>
            <div className="at-root">
                <div className="at-grid" />
                <div className="at-orb1" />

                {/* ── TOP NAV ── */}
                <div className="at-topbar">
                    <div className="at-breadcrumb">
                        {breadcrumbs.map((b, i) => (
                            <React.Fragment key={i}>
                                <button
                                    className={`at-bc-btn ${i === breadcrumbs.length - 1 ? 'active' : ''}`}
                                    onClick={b.action || undefined}
                                    disabled={!b.action}
                                >
                                    {b.label}
                                </button>
                                {i < breadcrumbs.length - 1 && (
                                    <ChevronRight size={13} className="at-bc-sep" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-white/20 hover:text-white transition-colors" onClick={() => handleNavigate(currentProgram, currentSection)}>
                            <RefreshCcw size={16} />
                        </button>
                    </div>
                </div>
                
                <div className="at-content">
                    {/* Header */}
                    {!activeSection && (
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h1 className="at-title">
                                    Presence
                                    <em>Registry</em>
                                </h1>
                                <p className="at-sub">College of Computing Studies · Select target tracking block</p>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center justify-end gap-2 text-[10px] font-black uppercase text-orange-500/60 tracking-wider mb-2">
                                    <ShieldCheck size={12} /> Institutional Registry
                                </div>
                                <div className="text-[20px] font-serif font-black italic text-white/50">
                                    Academic Term 2026
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ════════════════════════════════ PROGRAMS VIEW ═══ */}
                    {!currentProgram && !currentSection && (
                        <div className="at-prog-grid">
                            {programs.map(p => (
                                <div key={p.code} className="at-card">
                                    <div className="at-card-body">
                                        <div className="at-card-code">{p.code}</div>
                                        <div className="at-card-name">{p.name}</div>
                                        <div className="at-chips">
                                            <span className="at-chip chip-o"><Layers size={10} /> {p.sections_count} Sections</span>
                                            <span className="at-chip chip-g"><Users size={10} /> {p.student_count} Students</span>
                                        </div>
                                        <Link 
                                            href={route('attendance.index', { program: p.code, date: currentDate })}
                                            className="at-btn-manage"
                                        >
                                            Track Presence <ChevronRight size={12} />
                                        </Link>
                                    </div>
                                    {/* Transparent overlay to make whole card clickable while keeping Link accessible */}
                                    <Link 
                                        href={route('attendance.index', { program: p.code, date: currentDate })}
                                        className="absolute inset-0 z-[1]"
                                        aria-label={`Track Presence for ${p.code}`}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ════════════════════════════════ SECTIONS VIEW ═══ */}
                    {currentProgram && !currentSection && (
                        <>
                            <div className="flex justify-between items-center mb-8">
                                <div className="font-serif italic text-2xl text-white/90">
                                    Available <span className="text-orange-500">{currentProgram}</span> Blocks
                                </div>
                                <div className="at-filter-item" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.05)', padding: '10px 16px' }}>
                                    <Search size={14} className="text-white/20" />
                                    <input 
                                        className="bg-transparent border-none outline-none text-xs text-white" 
                                        placeholder="Search sections..." 
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            {YEAR_LEVELS.map(year => {
                                const yearSections = filteredSections.filter(s => s.grade_level === year);
                                if (yearSections.length === 0) return null;
                                return (
                                    <div key={year} className="mb-10">
                                        <div className="at-year-lbl">{year}</div>
                                        <div className="at-sec-grid">
                                            {yearSections.map(s => (
                                                <div key={s.id} className="at-card">
                                                    <div className="at-card-body">
                                                        <div className="at-sec-name">{s.name}</div>
                                                        <div className="at-sec-sy">{s.school_year}</div>
                                                        <div className="at-chips">
                                                            <span className="at-chip chip-g" style={{ background: 'rgba(52,211,153,0.05)' }}>
                                                                <Users size={10} /> {s.students_count} Enrolled
                                                            </span>
                                                        </div>
                                                        <div className="at-sec-info">
                                                            <div className="at-sec-ico"><User size={14} color={C.orange} /></div>
                                                            <div className="text-[10px] uppercase font-bold text-white/40">
                                                                <div className="text-[8px] opacity-50">Adviser</div>
                                                                {s.adviser?.name || 'TBA'}
                                                            </div>
                                                        </div>
                                                        <div className="mt-6">
                                                            <Link 
                                                                href={route('attendance.index', { program: currentProgram, section_id: s.id, date: currentDate })}
                                                                className="at-btn-manage"
                                                            >
                                                                Select Block <ArrowRight size={12} />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <Link 
                                                        href={route('attendance.index', { program: currentProgram, section_id: s.id, date: currentDate })}
                                                        className="absolute inset-0 z-[1]"
                                                        aria-label={`Select section ${s.name}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {filteredSections.length === 0 && (
                                <div className="at-page-empty ps-fu" style={{ padding: '80px 0', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: 24, background: 'rgba(255,255,255,0.01)' }}>
                                    <Layers size={42} className="mx-auto text-white/5 mb-4" />
                                    <div className="font-serif italic text-white/20 text-xl">No sections found for this program</div>
                                    <p className="text-xs text-white/5 mt-1">Make sure you have sections established in the Sections module.</p>
                                </div>
                            )}
                        </>
                    )}

                    {/* ════════════════════════════════ MATRIX VIEW ═══ */}
                    {currentSection && (
                        <form onSubmit={handleSubmit}>
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="font-serif italic text-3xl text-white">{activeSection?.name}</h2>
                                    <p className="text-[10px] uppercase tracking-widest text-white/30 mt-1">Enrollment Roster Matrix · Academic Service 2026</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="at-date-container">
                                        <button type="button" onClick={() => stepDate(-1)} className="at-step-btn" title="Previous Day"><ChevronLeft size={16} /></button>
                                        <div className="at-date-input-wrapper">
                                            <input 
                                                type="date" 
                                                className="at-date" 
                                                value={data.date}
                                                max={todayStr}
                                                onChange={e => {
                                                    setData('date', e.target.value);
                                                    handleNavigate(currentProgram, currentSection, e.target.value);
                                                }}
                                            />
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => stepDate(1)} 
                                            className={`at-step-btn ${isToday || isFutureDate ? 'opacity-20 cursor-not-allowed' : ''}`}
                                            disabled={isToday || isFutureDate}
                                            title={isToday ? "You are on the current date" : "Next Day"}
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* SHEET FUNCTIONS */}
                            <div className="at-func-bar">
                                <div className="at-bulk-grp">
                                    <button type="button" onClick={() => markAllStatus('present')} className="at-btn-bulk p">Mark All Present</button>
                                    <button type="button" onClick={() => markAllStatus('absent')} className="at-btn-bulk a">Mark All Absent</button>
                                    <button type="button" onClick={() => markAllStatus(null)} className="at-btn-clear">
                                        <Trash2 size={14} /> Clear Registry
                                    </button>
                                    <div className="w-px h-4 bg-white/5 mx-2" />
                                    <button 
                                        type="button" 
                                        className="at-btn-export"
                                        onClick={() => window.open(route('attendance.export-monthly', { section_id: currentSection, month: data.date.substring(0, 7) }))}
                                    >
                                        <Download size={14} /> Monthly Report
                                    </button>
                                    <div className="w-px h-4 bg-white/5 mx-2" />
                                    <div className="at-filter-item" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.05)', padding: '6px 12px' }}>
                                        <Search size={12} className="text-white/20" />
                                        <input 
                                            className="bg-transparent border-none outline-none text-[10px] text-white w-32" 
                                            placeholder="Find student..." 
                                            value={matrixSearch}
                                            onChange={e => setMatrixSearch(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="at-stats-grp">
                                    <div className="at-stat-item">
                                        <div className="at-stat-val text-green-400">{stats.present}</div>
                                        <div className="at-stat-lbl">Present</div>
                                    </div>
                                    <div className="at-stat-item">
                                        <div className="at-stat-val text-red-400">{stats.absent}</div>
                                        <div className="at-stat-lbl">Absent</div>
                                    </div>
                                    <div className="at-stat-item">
                                        <div className="at-stat-val text-amber-400">{stats.late}</div>
                                        <div className="at-stat-lbl">Late</div>
                                    </div>
                                    <div className="at-stat-item">
                                        <div className="at-stat-val text-blue-400">{stats.excused}</div>
                                        <div className="at-stat-lbl">Excused</div>
                                    </div>
                                </div>
                            </div>

                            <div className="at-table-card">
                                <table className="at-table-excel">
                                    <thead>
                                        <tr>
                                            <th className="at-th-excel" style={{ width: '50px' }}>#</th>
                                            <th className="at-th-excel" style={{ textAlign: 'left' }}>Student Identity</th>
                                            <th className="at-th-excel" style={{ width: '80px' }}>P</th>
                                            <th className="at-th-excel" style={{ width: '80px' }}>A</th>
                                            <th className="at-th-excel" style={{ width: '80px' }}>L</th>
                                            <th className="at-th-excel" style={{ width: '80px' }}>E</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStudents.length > 0 ? filteredStudents.map((student) => {
                                            const idx = students.findIndex(s => s.id === student.id);
                                            return (
                                                <tr key={student.id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="at-td-excel text-[10px] font-mono text-white/20">
                                                    {(idx + 1).toString().padStart(2, '0')}
                                                </td>
                                                <td className="at-td-excel">
                                                    <div className="at-student-info">
                                                        <div className="at-avatar">{student.first_name[0]}{student.last_name[0]}</div>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => handleShowHistory(student)}
                                                            className="at-student-link"
                                                        >
                                                            <div className="text-[13px] font-bold text-white transition-colors at-student-name">
                                                                {student.first_name} {student.last_name}
                                                            </div>
                                                            <div className="at-id-mono uppercase tracking-widest">{student.student_id}</div>
                                                        </button>
                                                    </div>
                                                </td>
                                                {[
                                                    { id: 'present', icon: CheckCircle, label: 'Present' },
                                                    { id: 'absent', icon: XCircle, label: 'Absent' },
                                                    { id: 'late', icon: Clock, label: 'Late' },
                                                    { id: 'excused', icon: AlertCircle, label: 'Excused' },
                                                ].map((status) => (
                                                    <td key={status.id} className="at-td-excel">
                                                        <div className="at-status-cell">
                                                            <button
                                                                type="button"
                                                                onClick={() => updateStatus(idx, status.id)}
                                                                className={`at-status-toggle ${status.id} ${data.attendance[idx]?.status === status.id ? 'active' : ''}`}
                                                                title={status.label}
                                                            >
                                                                <status.icon size={16} />
                                                                <span>{status.id[0]}</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                ))}
                                            </tr>
                                            );
                                        }) : (
                                            <tr>
                                                <td colSpan="6" className="p-24 text-center">
                                                    <div className="font-serif italic text-white/10 text-xl">No students enrolled in this block</div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="at-save-bar">
                                {isFutureDate && (
                                    <div className="flex items-center gap-2 mr-6 text-amber-500 text-[10px] uppercase font-bold tracking-widest bg-amber-500/5 px-4 py-2 rounded-xl border border-amber-500/20">
                                        <AlertCircle size={14} /> Future sessions cannot be marked
                                    </div>
                                )}
                                <button 
                                    type="submit" 
                                    disabled={processing || isFutureDate} 
                                    className={`at-btn-save ${isFutureDate ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                                >
                                    {processing ? <RefreshCcw className="animate-spin" size={16} /> : <Save size={16} />} 
                                    Authorize & Sync Registry
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* SUCCESS NOTICE */}
            {notice && (
                <div className="at-notice">
                    <CheckCircle size={18} />
                    {notice}
                </div>
            )}
            {/* Attendance History Modal */}
            {historyStudent && (
                <div className="at-history-modal" onClick={() => setHistoryStudent(null)}>
                    <div className="at-history-content" onClick={e => e.stopPropagation()}>
                        <div className="p-8 pb-4 flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-serif font-black italic text-white leading-none">Attendance Log</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mt-3">{historyStudent.first_name} {historyStudent.last_name}</p>
                            </div>
                            <button onClick={() => setHistoryStudent(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X size={20} className="text-white/20" />
                            </button>
                        </div>

                        <div className="at-history-body at-scroll">
                            {historyLoading ? (
                                <div className="py-20 flex flex-col items-center gap-4">
                                    <RefreshCcw size={24} className="text-orange-500 animate-spin" />
                                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Fetching Records...</span>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {attendanceHistory.length > 0 ? attendanceHistory.map((h) => (
                                        <div key={h.id} className="at-history-row">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-xl bg-white/[0.03] flex items-center justify-center">
                                                    <Calendar size={14} className="text-white/20" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-white">
                                                        {new Date(h.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Recorded by {h.recorder?.name || 'System'}</span>
                                                </div>
                                            </div>
                                            <div className={`at-status-toggle ${h.status} active !cursor-default scale-75 transform-origin-right px-4`}>
                                                {h.status === 'present' && <CheckCircle size={14} />}
                                                {h.status === 'absent' && <XCircle size={14} />}
                                                {h.status === 'late' && <Clock size={14} />}
                                                {h.status === 'excused' && <AlertCircle size={14} />}
                                                <span className="uppercase ml-2 tracking-tighter">{h.status}</span>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="py-20 text-center">
                                            <p className="text-serif italic text-white/20 text-lg">No records found yet.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
