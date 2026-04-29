import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    ArrowLeft, Users, Search, Plus, Trash2, User, ChevronDown, X,
    CheckCircle2, ChevronLeft, ChevronRight, UserCheck, Shield, Layers,
    RefreshCw, UserPlus, Edit, Zap, BookOpen, ArrowUpRight, Filter
} from 'lucide-react';
import axios from 'axios';

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────────────────────── */
const C = {
    bg: '#080604',
    surf: '#0d0904',
    card: '#131009',
    card2: '#191309',
    card3: '#1f180a',
    elev: '#271d0d',
    orange: '#f97316',
    o2: '#fb923c',
    o3: '#c2410c',
    o4: 'rgba(249,115,22,0.07)',
    o5: 'rgba(249,115,22,0.13)',
    o6: 'rgba(249,115,22,0.22)',
    muted: '#7d7065',
    dim: '#4a4038',
    ghost: '#2e2318',
    border: 'rgba(249,115,22,0.065)',
    border2: 'rgba(249,115,22,0.15)',
    border3: 'rgba(249,115,22,0.28)',
    green: '#34d399',
    g2: 'rgba(52,211,153,0.08)',
    g3: 'rgba(52,211,153,0.2)',
    blue: '#60a5fa',
    b2: 'rgba(96,165,250,0.08)',
    red: '#f87171',
    r2: 'rgba(248,113,113,0.08)',
    r3: 'rgba(248,113,113,0.2)',
    text: '#ede8e2',
    textSub: '#c0b8af',
};

/* ─────────────────────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────────────────────── */
const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&display=swap');

    .rv-spin { animation: rv-spin 1s linear infinite; }
    @keyframes rv-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .rv-fade { animation: rv-fade 0.25s ease forwards; }
    @keyframes rv-fade { from { opacity: 0; transform: translateY(-6px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
    .rv-modal-in { animation: rv-modal-in 0.36s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes rv-modal-in { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
    .rv-preview-in { animation: rv-preview-in 0.22s ease forwards; }
    @keyframes rv-preview-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .rv-serif { font-family: 'Instrument Serif', serif; }
    .rv-mono { font-family: 'JetBrains Mono', monospace; letter-spacing: -0.02em; }
    .rv-tag { padding: 3px 9px; border-radius: 6px; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; display: inline-flex; align-items: center; gap: 4px; }
    .rv-s-row { transition: background 0.15s; }
    .rv-s-row::before { content: ''; position: absolute; left: 0; top: 8px; bottom: 8px; width: 2.5px; background: ${C.orange}; border-radius: 0 2px 2px 0; opacity: 0; transition: opacity 0.18s; }
    .rv-s-row:hover { background: rgba(249,115,22,0.04) !important; }
    .rv-s-row:hover::before { opacity: 1; }
    .rv-del-btn { opacity: 0; transform: scale(0.82); transition: all 0.18s; }
    .rv-s-row:hover .rv-del-btn { opacity: 1; transform: scale(1); }
    .rv-del-btn:hover { background: ${C.r3} !important; border-color: rgba(248,113,113,0.28) !important; color: ${C.red} !important; }
    .rv-add-btn:hover { background: ${C.g3} !important; transform: scale(1.1); }
    .rv-dir-item:hover, .rv-dir-item.sel { background: ${C.card2} !important; border-color: ${C.border2} !important; }
    .rv-adv-opt:hover { background: ${C.card2}; }
    .rv-scroll::-webkit-scrollbar { width: 3px; }
    .rv-scroll::-webkit-scrollbar-track { background: transparent; }
    .rv-scroll::-webkit-scrollbar-thumb { background: ${C.border3}; border-radius: 8px; }
    .rv-stat:hover { background: rgba(255,255,255,0.035) !important; border-color: rgba(255,255,255,0.085) !important; }
    .rv-adv-card:hover { border-color: ${C.border2} !important; }
    .rv-refresh:hover { background: ${C.card2} !important; border-color: ${C.border3} !important; color: ${C.orange} !important; transform: rotate(45deg); }
    .rv-add-student-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 28px rgba(52,211,153,0.35) !important; filter: brightness(1.06); }
    .rv-chg-btn:hover { background: ${C.elev} !important; border-color: ${C.border3} !important; color: ${C.o2} !important; }
    .rv-modal-x:hover { background: ${C.elev} !important; border-color: ${C.border3} !important; color: ${C.text} !important; }
    .rv-enroll-btn:hover { transform: scale(1.05); filter: brightness(1.08); }

    /* Grid background */
    .rv-grid-bg {
        position: fixed; inset: 0; pointer-events: none; z-index: 0;
        background-image: linear-gradient(rgba(249,115,22,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.022) 1px, transparent 1px);
        background-size: 52px 52px;
    }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function RosterView({ sectionId, activeCourse, onBack, showToast, focusTrigger = 0 }) {
    const [section, setSection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [studentsDir, setStudentsDir] = useState([]);
    const [teachersDir, setTeachersDir] = useState([]);
    const [searchDir, setSearchDir] = useState('');
    const [searchRoster, setSearchRoster] = useState('');
    const [showAdviserPicker, setShowAdviserPicker] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rosterPage, setRosterPage] = useState(1);
    const [removingId, setRemovingId] = useState(null);
    const [showDirModal, setShowDirModal] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const [showUnassignedOnly, setShowUnassignedOnly] = useState(true);
    
    // Grade Encoding States
    const [gradeEncodingMode, setGradeEncodingMode] = useState(false);
    const [gradingStudent, setGradingStudent] = useState(null);
    const [gradesData, setGradesData] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [activeSubjectId, setActiveSubjectId] = useState('');
    const [periodGrades, setPeriodGrades] = useState({
        prelim: '',
        midterm: '',
        prefinal: '',
        final: ''
    });
    const [isSavingGrade, setIsSavingGrade] = useState(false);
    const [savingGradeId, setSavingGradeId] = useState(null);

    // Modal States
    const [clearanceStudent, setClearanceStudent] = useState(null);
    const [clearanceData, setClearanceData] = useState(null);
    const [isClearing, setIsClearing] = useState(null); // ID of entry being cleared

    const adviserRef = useRef(null);
    const dirSearchRef = useRef(null);
    const ITEMS_PER_PAGE = 10;
    const ROSTER_LIMIT = 10;

    const fetchSection = useCallback(async () => {
        try {
            const res = await axios.get(`/api/sections/${sectionId}/details`);
            setSection(res.data);
        } catch {
            showToast('Failed to load section details.');
            onBack();
        } finally {
            setLoading(false);
        }
    }, [sectionId, onBack, showToast]);

    const fetchDirectory = useCallback(async () => {
        try {
            const [stRes, thRes] = await Promise.all([
                axios.get('/api/directory/students'),
                axios.get('/api/directory/teachers'),
            ]);
            setStudentsDir(stRes.data);
            setTeachersDir(thRes.data);
        } catch {
            showToast('Failed to load directory.');
        }
    }, [showToast]);

    const fetchGrades = useCallback(async (studentId = null) => {
        try {
            const endpoint = studentId ? '/api/grade-entries' : `/api/sections/${sectionId}/grades`;
            const params = studentId ? { 
                student_id: studentId, 
                semester: section?.semester || 1, 
                academic_year: section?.school_year || '2024-2025' 
            } : {};
            const res = await axios.get(endpoint, { params });
            setGradesData(res.data);
        } catch {
            showToast('Failed to load grade records.');
        }
    }, [sectionId, showToast]);

    const fetchClearance = useCallback(async (studentId) => {
        try {
            const res = await axios.get(`/api/students/${studentId}/clearance`, {
                params: { semester: 1, academic_year: '2024-2025' }
            });
            setClearanceData(res.data);
        } catch {
            showToast('Failed to load clearance status.');
        }
    }, [showToast]);

    const handleClearDepartment = async (entryId) => {
        setIsClearing(entryId);
        try {
            await axios.patch(`/api/clearance-entries/${entryId}/clear`);
            showToast('Department cleared!');
            if (clearanceStudent) fetchClearance(clearanceStudent.id);
        } catch {
            showToast('Failed to clear department.');
        } finally {
            setIsClearing(null);
        }
    };

    useEffect(() => { fetchSection(); fetchDirectory(); fetchGrades(); }, [fetchSection, fetchDirectory, fetchGrades]);

    useEffect(() => {
        if (clearanceStudent) {
            setClearanceData(null);
            fetchClearance(clearanceStudent.id);
        }
    }, [clearanceStudent, fetchClearance]);

    useEffect(() => {
        const handler = (e) => {
            if (adviserRef.current && !adviserRef.current.contains(e.target))
                setShowAdviserPicker(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        if (!focusTrigger) return;
        setShowDirModal(true);
    }, [focusTrigger]);

    useEffect(() => {
        if (showDirModal) {
            setTimeout(() => dirSearchRef.current?.focus(), 80);
        } else {
            setSearchDir('');
            setCurrentPage(1);
            setSelectedStudent(null);
        }
    }, [showDirModal]);

    const handleRefresh = async () => {
        setSpinning(true);
        await fetchSection();
        await fetchDirectory();
        setTimeout(() => setSpinning(false), 600);
        showToast('Roster refreshed!');
    };

    const handleAssignAdviser = async (teacherId) => {
        try {
            await axios.patch(`/api/sections/${sectionId}/adviser`, { adviser_id: teacherId });
            fetchSection();
            setShowAdviserPicker(false);
            showToast('Adviser assigned successfully!');
        } catch {
            showToast('Failed to assign adviser.');
        }
    };

    const handleAddStudent = async (studentId) => {
        try {
            await axios.post(`/api/sections/${sectionId}/assign-students`, { student_ids: [studentId] });
            setSelectedStudent(null);
            fetchSection();
            showToast('Student enrolled in section!');
        } catch {
            showToast('Failed to add student.');
        }
    };

    const handleRemoveStudent = async (studentId) => {
        setRemovingId(studentId);
        try {
            await axios.delete(`/api/sections/${sectionId}/remove-student/${studentId}`);
            fetchSection();
            showToast('Student removed from section.');
        } catch {
            showToast('Failed to remove student.');
        } finally {
            setRemovingId(null);
        }
    };

    const handleSaveGrade = async (subjectId, data) => {
        setSavingGradeId(subjectId);
        try {
            await axios.patch(`/api/grades/${subjectId}/inline-update`, data);
            showToast('Grade updated!');
            fetchGrades(); 
        } catch {
            showToast('Failed to update grade.');
        } finally {
            setSavingGradeId(null);
        }
    };

    const handleModalSaveGrade = async () => {
        if (!selectedSubject) {
            showToast('Please select a subject');
            return;
        }

        setIsSavingGrade(true);
        try {
            await axios.post('/api/grade-entries/batch', {
                student_id: gradingStudent.id,
                section_id: sectionId,
                semester: section?.semester || 1,
                academic_year: section?.school_year || '2024-2025',
                grades: [{
                    subject_code: selectedSubject,
                    ...periodGrades
                }]
            });
            showToast('Grades saved successfully!');
            fetchGrades(gradingStudent.id);
            setGradingStudent(null);
        } catch (error) {
            console.error('Error saving grades:', error);
            showToast('Failed to save grades.');
        } finally {
            setIsSavingGrade(false);
        }
    };

    const enrolledIds = useMemo(() => new Set((section?.students ?? []).map(s => s.id)), [section]);

    const availableStudents = useMemo(() => studentsDir
        .filter(s => {
            if (showUnassignedOnly) return !s.section_id;
            return !enrolledIds.has(s.id);
        })
        .filter(s =>
            `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchDir.toLowerCase()) ||
            (s.student_id && String(s.student_id).includes(searchDir))
        ), [studentsDir, enrolledIds, searchDir, showUnassignedOnly]);

    const filteredRosterFull = useMemo(() => (section?.students ?? []).filter(s =>
        `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchRoster.toLowerCase()) ||
        (s.student_id && String(s.student_id).includes(searchRoster))
    ), [section, searchRoster]);

    const rosterTotalPages = Math.ceil(filteredRosterFull.length / ROSTER_LIMIT);
    const filteredRoster = filteredRosterFull.slice((rosterPage - 1) * ROSTER_LIMIT, rosterPage * ROSTER_LIMIT);
    const totalPages = Math.ceil(availableStudents.length / ITEMS_PER_PAGE);
    const paginatedStudents = availableStudents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    if (loading) {
        return (
            <>
                <style>{styles}</style>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, fontFamily: 'DM Sans', background: C.bg }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', border: `2px solid ${C.border2}`, borderTopColor: C.orange }} className="rv-spin" />
                    <div style={{ color: C.muted, fontSize: 12, letterSpacing: '.04em' }}>Loading Roster…</div>
                </div>
            </>
        );
    }

    if (!section) return null;

    const students = section.students ?? [];

    return (
        <>
            <style>{styles}</style>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'DM Sans', color: C.text, background: 'transparent', position: 'relative' }}>
                <div className="rv-grid-bg" />

                {/* ── PAGE BODY ── */}
                <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1 }} className="rv-scroll">
                    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '32px 32px 40px' }}>
                        
                        {/* Header Top Row */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                            <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: C.dim, fontSize: 10, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', transition: 'color .15s', fontFamily: 'DM Sans, sans-serif' }}>
                                <ArrowLeft size={10} strokeWidth={2.5} />
                                {activeCourse} / Sections
                            </button>
                        </div>

                        {/* Header Main */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', position: 'relative' }}>
                            <div>
                                <div className="rv-serif" style={{ fontSize: 36, fontStyle: 'italic', color: C.orange, lineHeight: 1, letterSpacing: '-0.01em' }}>{section.name}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 9, flexWrap: 'wrap' }}>
                                    <div className="rv-tag" style={{ background: C.o4, color: C.o2, border: `1px solid ${C.border2}` }}>
                                        <Layers size={9} />
                                        {activeCourse}
                                    </div>
                                    <span style={{ fontSize: 10, color: C.dim, fontWeight: 700 }}>•</span>
                                    <span style={{ fontSize: 10.5, fontWeight: 600, color: C.muted }}>{String(section.grade_level) === '1' ? '1st Year' : String(section.grade_level) === '2' ? '2nd Year' : String(section.grade_level) === '3' ? '3rd Year' : String(section.grade_level) === '4' ? '4th Year' : `${section.grade_level} Year`}</span>
                                    <span style={{ fontSize: 10, color: C.dim, fontWeight: 700 }}>•</span>
                                    <span className="rv-mono" style={{ fontSize: 10, color: C.dim }}>S.Y. {section.school_year || '2024-2025'}</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                <StatCard icon={<Users size={13} />} label="ENROLLED" val={students.length} />
                                <StatCard icon={<UserPlus size={13} />} label="AVAILABLE" val={availableStudents.length} color={C.blue} bg={C.b2} />
                                <StatCard icon={<Shield size={13} />} label="ADVISER" val={section.adviser ? (section.adviser.name || 'Adviser').split(' ').pop() : 'None'} color={C.green} bg={C.g2} />
                            </div>
                        </div>

                        {/* Adviser Section */}
                        <div 
                            className="rv-adv-card"
                            style={{ 
                                marginTop: 28, background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`, borderRadius: 14, 
                                padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                transition: 'all .25s ease', position: 'relative'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 1 }}>
                                <div style={{ width: 42, height: 42, borderRadius: 12, background: C.card, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.green, border: `1px solid ${C.border2}` }}>
                                    <User size={20} />
                                </div>
                                <div>
                                    <div style={{ fontSize: 9, fontWeight: 900, color: C.green, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 4 }}>Section Adviser</div>
                                    <div className="rv-serif" style={{ fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: '-0.01em' }}>{section.adviser ? (section.adviser.name || 'Adviser') : 'No Adviser Assigned'}</div>
                                </div>
                            </div>

                            <div style={{ position: 'relative' }}>
                                <div style={{ fontSize: 9, fontWeight: 900, color: C.dim, textTransform: 'uppercase', letterSpacing: '.08em', padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}` }}>
                                    Adviser Assignment is locked to Sections View
                                </div>
                            </div>
                        </div>

                        {/* Roster Panel */}
                        <div style={{ marginTop: 32, background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                            {/* Roster Header */}
                            <div style={{ padding: '13px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: `linear-gradient(180deg, ${C.card2} 0%, transparent 100%)`, flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: 8, background: C.o4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.orange }}>
                                        <Users size={13} />
                                    </div>
                                    <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.07em' }}>Enrolled Students</span>
                                    <span className="rv-mono" style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 800, background: C.o4, color: C.o2, border: `1px solid ${C.border2}` }}>{students.length}</span>
                                </div>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>


                                    {gradeEncodingMode && gradesData.length > 0 && gradesData[0].subjects && gradesData[0].subjects.length > 0 && (
                                        <select 
                                            value={activeSubjectId || gradesData[0].subjects[0].subject_code}
                                            onChange={(e) => setActiveSubjectId(e.target.value)}
                                            style={{ 
                                                background: C.card3, border: `1px solid ${C.border}`, color: C.text, 
                                                padding: '6px 10px', borderRadius: 8, fontSize: 11, outline: 'none', 
                                                fontFamily: 'DM Sans, sans-serif'
                                            }}
                                        >
                                            {gradesData[0].subjects.map(subj => (
                                                <option key={subj.subject_code} value={subj.subject_code}>{subj.subject_name}</option>
                                            ))}
                                        </select>
                                    )}

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ position: 'relative' }}>
                                            <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.dim, pointerEvents: 'none' }} />
                                            <input
                                                type="text" placeholder="Filter roster…"
                                                value={searchRoster}
                                                onChange={e => { setSearchRoster(e.target.value); setRosterPage(1); }}
                                                style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${C.border}`, color: C.text, padding: '7px 12px 7px 29px', borderRadius: 9, fontSize: 11, outline: 'none', fontFamily: 'DM Sans, sans-serif', transition: 'border-color .2s', minWidth: 160 }}
                                            />
                                        </div>
                                        <button 
                                            onClick={async () => {
                                                try {
                                                    await axios.post(`/api/sections/${sectionId}/sync-grades`);
                                                    fetchGrades();
                                                    showToast('Section grades synced!');
                                                } catch (e) {
                                                    showToast(e.response?.data?.message || 'Sync failed', 'error');
                                                }
                                            }}
                                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 9, background: 'rgba(52,211,153,0.06)', border: `1px solid rgba(52,211,153,0.15)`, color: C.green, fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', cursor: 'pointer' }}
                                        >
                                            <Zap size={10} /> Sync
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Roster Rows */}
                            {filteredRoster.length === 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 20px', gap: 14 }}>
                                    <Users size={26} style={{ color: C.ghost }} />
                                    <div className="rv-serif" style={{ fontSize: 18, fontStyle: 'italic', color: C.ghost }}>{searchRoster ? 'No matches found' : 'No students enrolled'}</div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {filteredRoster.map((s, i) => {
                                        const studentGradeData = gradesData.find(g => g.student_id === s.id);
                                        const activeSubjectData = studentGradeData?.subjects?.find(subj => subj.subject_code === (activeSubjectId || (gradesData[0]?.subjects && gradesData[0].subjects.length > 0 ? gradesData[0].subjects[0].subject_code : null)));

                                        return (
                                            <div key={s.id} className="rv-s-row" style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', gap: 14, borderBottom: i < filteredRoster.length - 1 ? `1px solid ${C.border}` : 'none', position: 'relative' }}>
                                                <span className="rv-mono" style={{ width: 20, color: C.dim, fontSize: 10, fontWeight: 700, flexShrink: 0, textAlign: 'right' }}>{String((rosterPage - 1) * ROSTER_LIMIT + i + 1).padStart(2, '0')}</span>
                                                <InitialsAvatar firstName={s.first_name} lastName={s.last_name} size={33} />
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{s.last_name}, {s.first_name}</span>
                                                    </div>
                                                    <div className="rv-mono" style={{ fontSize: 10, color: C.dim, marginTop: 1 }}>{s.student_id}</div>
                                                </div>

                                                {gradeEncodingMode ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        {activeSubjectData ? (
                                                            <>
                                                                {['prelim_grade', 'midterm_grade', 'prefinal_grade', 'final_grade'].map(period => (
                                                                    <div key={period} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                                                        <span style={{ fontSize: 8, color: C.dim, textTransform: 'uppercase', letterSpacing: '.05em' }}>{period.split('_')[0]}</span>
                                                                        <input 
                                                                            type="number" 
                                                                            min="0" max="100"
                                                                            defaultValue={activeSubjectData[period] || ''}
                                                                            onBlur={(e) => {
                                                                                if(e.target.value !== String(activeSubjectData[period] || '')) {
                                                                                    handleSaveGrade(activeSubjectData.id, { [period]: e.target.value });
                                                                                }
                                                                            }}
                                                                            disabled={activeSubjectData.is_locked || savingGradeId === activeSubjectData.id}
                                                                            style={{ 
                                                                                width: 46, background: C.card2, border: `1px solid ${C.border}`, color: C.text, 
                                                                                padding: '4px 6px', borderRadius: 6, fontSize: 11, textAlign: 'center',
                                                                                outline: 'none', fontFamily: 'JetBrains Mono, monospace'
                                                                            }}
                                                                        />
                                                                    </div>
                                                                ))}
                                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, marginLeft: 8, paddingLeft: 8, borderLeft: `1px solid ${C.border}` }}>
                                                                    <span style={{ fontSize: 8, color: C.muted, textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 700 }}>Total</span>
                                                                    <div className="rv-mono" style={{ fontSize: 12, fontWeight: 800, color: activeSubjectData.status === 'passed' ? C.green : (activeSubjectData.status === 'failed' ? C.red : C.orange) }}>
                                                                        {activeSubjectData.prelim_grade !== null ? ((parseFloat(activeSubjectData.prelim_grade || 0) * 0.2) + (parseFloat(activeSubjectData.midterm_grade || 0) * 0.3) + (parseFloat(activeSubjectData.prefinal_grade || 0) * 0.2) + (parseFloat(activeSubjectData.final_grade || 0) * 0.3)).toFixed(1) : '-'}
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div style={{ fontSize: 10, color: C.dim, fontStyle: 'italic' }}>No subject data</div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <button 
                                                            style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.08)`, color: C.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .2s' }}
                                                            onClick={() => (window.location.href = `/grades?student_id=${s.id}`)}
                                                            onMouseEnter={e => { e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                                                            onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                                                        >
                                                            <ArrowUpRight size={15} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {/* Pagination */}
                                    {rosterTotalPages > 1 && (
                                        <div style={{ padding: '16px 20px', borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                                            <button
                                                onClick={() => setRosterPage(p => Math.max(1, p - 1))}
                                                disabled={rosterPage === 1}
                                                style={{ width: 32, height: 32, borderRadius: 8, background: C.card, border: `1px solid ${C.border}`, color: rosterPage === 1 ? C.dim : C.text, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: rosterPage === 1 ? 'default' : 'pointer' }}
                                            >
                                                <ChevronLeft size={16} />
                                            </button>
                                            <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                                                Page <span style={{ color: C.text }}>{rosterPage}</span> of {rosterTotalPages}
                                            </span>
                                            <button
                                                onClick={() => setRosterPage(p => Math.min(rosterTotalPages, p + 1))}
                                                disabled={rosterPage === rosterTotalPages}
                                                style={{ width: 32, height: 32, borderRadius: 8, background: C.card, border: `1px solid ${C.border}`, color: rosterPage === rosterTotalPages ? C.dim : C.text, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: rosterPage === rosterTotalPages ? 'default' : 'pointer' }}
                                            >
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── DIRECTORY MODAL ── */}
            {showDirModal && (
                <div onClick={() => setShowDirModal(false)} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5,3,1,0.9)', backdropFilter: 'blur(18px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '80px 20px 20px' }}>
                    <div onClick={e => e.stopPropagation()} className="rv-modal-in" style={{ width: '100%', maxWidth: 516, maxHeight: '85vh', background: C.bg, border: `1px solid ${C.border2}`, borderRadius: 28, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 32px 100px rgba(0,0,0,0.92)' }}>
                        <div style={{ height: 3, background: `linear-gradient(90deg, ${C.orange}, rgba(249,115,22,0.1))`, flexShrink: 0 }} />

                        {/* Modal Header */}
                        <div style={{ padding: '28px 26px 18px', borderBottom: `1px solid ${C.border}`, position: 'relative', flexShrink: 0 }}>
                            <button className="rv-modal-x" onClick={() => setShowDirModal(false)} style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: 9, background: C.card2, border: `1px solid ${C.border2}`, color: C.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .18s' }}>
                                <X size={15} />
                            </button>
                            <div className="rv-serif" style={{ fontSize: 30, fontStyle: 'italic', color: '#fff', lineHeight: 1.2, marginBottom: 5 }}>Student Directory</div>
                            <div className="rv-mono" style={{ fontSize: 10, color: C.muted, fontWeight: 800, letterSpacing: '.09em', textTransform: 'uppercase' }}>{availableStudents.length} Students Available</div>
                        </div>

                        {/* Search & Filters */}
                        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, background: `linear-gradient(180deg, ${C.card2} 0%, transparent 100%)`, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.dim, pointerEvents: 'none' }} />
                                <input
                                    ref={dirSearchRef} type="text"
                                    placeholder="Search by name or student ID…"
                                    value={searchDir}
                                    onChange={e => { setSearchDir(e.target.value); setCurrentPage(1); }}
                                    style={{ width: '100%', background: C.card3, border: `1px solid ${C.border}`, color: '#fff', padding: '11px 16px 11px 38px', borderRadius: 12, fontSize: 12, outline: 'none', fontFamily: 'DM Sans, sans-serif', transition: 'border-color .2s' }}
                                    onFocus={e => e.target.style.borderColor = C.border3}
                                    onBlur={e => e.target.style.borderColor = C.border}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <button 
                                        onClick={() => { setShowUnassignedOnly(!showUnassignedOnly); setCurrentPage(1); }}
                                        style={{ 
                                            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, 
                                            background: !showUnassignedOnly ? C.o4 : 'rgba(255,255,255,0.02)', 
                                            border: `1px solid ${!showUnassignedOnly ? C.orange : C.border}`, 
                                            color: !showUnassignedOnly ? C.orange : C.muted, 
                                            fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', cursor: 'pointer', transition: 'all .2s' 
                                        }}
                                    >
                                        <Filter size={10} />
                                        {!showUnassignedOnly ? 'Showing All (Strict)' : 'Show Only Unassigned'}
                                    </button>
                                </div>
                                <div className="rv-mono" style={{ fontSize: 9, color: C.dim }}>{availableStudents.length} Students found</div>
                            </div>
                        </div>

                        {/* Preview Panel */}
                        {selectedStudent && (
                            <div className="rv-preview-in" style={{ margin: '11px 17px', padding: '13px 17px', background: C.card2, border: `1px solid ${C.border2}`, borderRadius: 17, display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                                <InitialsAvatar firstName={selectedStudent.first_name} lastName={selectedStudent.last_name} size={44} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ color: '#fff', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedStudent.last_name}, {selectedStudent.first_name}</div>
                                    <div className="rv-mono" style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>{selectedStudent.student_id || 'No ID'}</div>
                                </div>
                                {!enrolledIds.has(selectedStudent.id) && (
                                    <button className="rv-enroll-btn" onClick={() => handleAddStudent(selectedStudent.id)} style={{ padding: '8px 18px', borderRadius: 10, background: C.green, color: '#042010', border: 'none', fontWeight: 800, fontSize: 12, cursor: 'pointer', transition: 'all .2s', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}>
                                        Enroll
                                    </button>
                                )}
                                <button onClick={() => setSelectedStudent(null)} style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, color: C.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .18s', flexShrink: 0 }}>
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        {/* Directory List */}
                        <div className="rv-scroll" style={{ flex: 1, overflowY: 'auto', padding: '10px 16px' }}>
                            {paginatedStudents.map(s => (
                                <div
                                    key={s.id}
                                    className={`rv-dir-item${selectedStudent?.id === s.id ? ' sel' : ''}`}
                                    onClick={() => setSelectedStudent(s)}
                                    style={{ display: 'flex', alignItems: 'center', padding: '9px 13px', borderRadius: 12, cursor: 'pointer', marginBottom: 4, border: `1px solid ${selectedStudent?.id === s.id ? C.border2 : 'transparent'}`, background: selectedStudent?.id === s.id ? C.card2 : 'transparent', transition: 'all .16s' }}
                                >
                                    <InitialsAvatar firstName={s.first_name} lastName={s.last_name} size={36} />
                                    <div style={{ flex: 1, marginLeft: 12, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                            <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.last_name}, {s.first_name}</div>
                                            {s.section_id ? (
                                                <div className="rv-tag" style={{ background: 'rgba(255,255,255,0.03)', color: C.dim, border: `1px solid ${C.border}`, textTransform: 'none' }}>
                                                    {s.section?.name || 'Enrolled'}
                                                </div>
                                            ) : (
                                                <div className="rv-tag" style={{ background: C.g2, color: C.green, border: `1px solid ${C.g3}`, scale: '0.85', transformOrigin: 'left' }}>
                                                    UNASSIGNED
                                                </div>
                                            )}
                                        </div>
                                        <div className="rv-mono" style={{ fontSize: 10, color: C.dim, marginTop: 1 }}>{s.student_id}</div>
                                    </div>
                                    {s.section_id ? (
                                        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.02)', color: C.dim, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.border}`, opacity: 0.5, cursor: 'not-allowed' }} title="Already enrolled in another section">
                                            <CheckCircle2 size={14} />
                                        </div>
                                    ) : (
                                        <button
                                            className="rv-add-btn"
                                            onClick={e => { e.stopPropagation(); handleAddStudent(s.id); }}
                                            style={{ width: 30, height: 30, borderRadius: 8, background: C.g2, color: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid rgba(52,211,153,0.14)`, cursor: 'pointer', transition: 'all .18s', flexShrink: 0 }}
                                        >
                                            <Plus size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Modal Footer */}
                        <div style={{ padding: '10px 20px', borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: `linear-gradient(0deg, ${C.card2} 0%, transparent 100%)` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontSize: 9.5, color: C.dim, fontWeight: 700, letterSpacing: '.05em' }}>LIMIT</span>
                                <span className="rv-mono" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, color: C.muted, fontSize: 10, borderRadius: 6, padding: '2px 8px' }}>10</span>
                            </div>
                            {totalPages > 1 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <PgBtn onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} dir="left" small />
                                    <span className="rv-mono" style={{ fontSize: 10.5, color: C.muted, fontWeight: 500 }}>{currentPage} / {totalPages}</span>
                                    <PgBtn onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} dir="right" small />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* ── ENCODE GRADES MODAL ── */}
            {gradingStudent && (
                <div onClick={() => setGradingStudent(null)} style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                    <div onClick={e => e.stopPropagation()} className="rv-modal-in" style={{ width: '100%', maxWidth: 480, background: C.card2, border: `1px solid ${C.border3}`, borderRadius: 24, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                        <div style={{ padding: '24px 28px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div className="rv-serif" style={{ fontSize: 24, fontStyle: 'italic', color: C.o2 }}>Encode <span>Grades</span></div>
                                <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{gradingStudent.last_name}, {gradingStudent.first_name}</div>
                            </div>
                            <button onClick={() => setGradingStudent(null)} style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, color: C.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <X size={16} />
                            </button>
                        </div>
                        <div style={{ padding: 28 }}>
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Select Subject</label>
                                <select 
                                    value={selectedSubject}
                                    onChange={(e) => {
                                        const code = e.target.value;
                                        setSelectedSubject(code);
                                        // Auto-fill existing grades if any
                                        const existing = gradesData.find(g => g.subject_code === code);
                                        if (existing) {
                                            setPeriodGrades({
                                                prelim: existing.prelim || '',
                                                midterm: existing.midterm || '',
                                                prefinal: existing.prefinal || '',
                                                final: existing.final || ''
                                            });
                                        } else {
                                            setPeriodGrades({ prelim: '', midterm: '', prefinal: '', final: '' });
                                        }
                                    }}
                                    style={{ width: '100%', background: C.bg, border: `1px solid ${C.border2}`, color: C.text, padding: '12px 14px', borderRadius: 12, fontSize: 13, outline: 'none' }}
                                >
                                    <option value="">Select a subject…</option>
                                    {(section?.curriculum_subjects || []).map(s => (
                                        <option key={s.subject_code} value={s.subject_code}>{s.subject_name} ({s.subject_code})</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                {[
                                    { id: 'prelim', label: 'Prelim' },
                                    { id: 'midterm', label: 'Midterm' },
                                    { id: 'prefinal', label: 'Pre-Final' },
                                    { id: 'final', label: 'Final' }
                                ].map(p => (
                                    <div key={p.id}>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>{p.label}</label>
                                        <input 
                                            type="number" 
                                            placeholder="0.0" 
                                            value={periodGrades[p.id]}
                                            onChange={(e) => setPeriodGrades(prev => ({ ...prev, [p.id]: e.target.value }))}
                                            style={{ width: '100%', background: C.bg, border: `1px solid ${C.border2}`, color: C.text, padding: '10px 14px', borderRadius: 10, fontSize: 14, fontWeight: 600, fontFamily: 'JetBrains Mono' }} 
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ padding: '20px 28px 28px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 10 }}>
                            <button onClick={() => setGradingStudent(null)} style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, color: C.muted, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Cancel</button>
                            <button 
                                onClick={handleModalSaveGrade}
                                disabled={isSavingGrade}
                                style={{ flex: 1, padding: '12px', borderRadius: 12, background: isSavingGrade ? C.dim : `linear-gradient(135deg, ${C.orange}, ${C.o3})`, color: '#fff', border: 'none', fontWeight: 800, fontSize: 12, cursor: isSavingGrade ? 'default' : 'pointer', boxShadow: '0 4px 15px rgba(249,115,22,0.3)' }}
                            >
                                {isSavingGrade ? 'Saving…' : 'Save Entry'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── CLEARANCE MODAL ── */}
            {clearanceStudent && (
                <div onClick={() => setClearanceStudent(null)} style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                    <div onClick={e => e.stopPropagation()} className="rv-modal-in" style={{ width: '100%', maxWidth: 500, background: C.card2, border: `1px solid ${C.border3}`, borderRadius: 24, overflow: 'hidden' }}>
                        <div style={{ padding: '24px 28px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div className="rv-serif" style={{ fontSize: 24, fontStyle: 'italic', color: C.green }}>Student <span>Clearance</span></div>
                                <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{clearanceStudent.last_name}, {clearanceStudent.first_name}</div>
                            </div>
                            <button onClick={() => setClearanceStudent(null)} style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, color: C.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <X size={16} />
                            </button>
                        </div>
                        <div style={{ padding: 20, maxHeight: 450, overflowY: 'auto' }} className="rv-scroll">
                            {!clearanceData ? (
                                <div style={{ textAlign: 'center', padding: 40, color: C.muted, fontSize: 12 }}>Loading clearance data…</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {/* Overall Progress */}
                                    <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: 18, marginBottom: 8 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                            <div style={{ fontSize: 10, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em' }}>Overall Progress</div>
                                            <div style={{ fontSize: 12, fontWeight: 900, color: C.green }}>{Math.round((clearanceData.cleared_count / clearanceData.total_departments) * 100)}%</div>
                                        </div>
                                        <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${(clearanceData.cleared_count / clearanceData.total_departments) * 100}%`, background: `linear-gradient(90deg, ${C.green}, #10b981)`, transition: 'width .6s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                                        </div>
                                    </div>

                                    {clearanceData.departments.map(dept => (
                                        <div key={dept.id} style={{ padding: '16px 20px', background: C.bg, border: `1px solid ${dept.status === 'cleared' ? 'rgba(52,211,153,0.1)' : C.border}`, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all .2s' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                                <div style={{ width: 38, height: 38, borderRadius: 12, background: dept.status === 'cleared' ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${dept.status === 'cleared' ? 'rgba(52,211,153,0.2)' : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: dept.status === 'cleared' ? C.green : C.dim }}>
                                                    {dept.status === 'cleared' ? <CheckCircle2 size={18} /> : <Shield size={18} />}
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{dept.dept_name}</div>
                                                    <div style={{ fontSize: 10, color: dept.status === 'cleared' ? C.green : (dept.status === 'on_hold' ? C.red : C.dim), textTransform: 'uppercase', letterSpacing: '.06em', marginTop: 3, fontWeight: 800 }}>
                                                        {dept.status === 'cleared' ? 'Cleared' : dept.status.replace('_', ' ')}
                                                    </div>
                                                </div>
                                            </div>
                                            {dept.status !== 'cleared' ? (
                                                <button 
                                                    onClick={() => handleClearDepartment(dept.id)}
                                                    disabled={isClearing === dept.id}
                                                    style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(52,211,153,0.08)', border: `1px solid rgba(52,211,153,0.15)`, color: C.green, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.05em', cursor: 'pointer', transition: 'all .2s' }}
                                                >
                                                    {isClearing === dept.id ? '...' : 'Sign Off'}
                                                </button>
                                            ) : (
                                                <div style={{ fontSize: 9, color: C.muted, fontStyle: 'italic' }}>{new Date(dept.cleared_at).toLocaleDateString()}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div style={{ padding: '20px 28px 28px', borderTop: `1px solid ${C.border}`, textAlign: 'center' }}>
                            <div style={{ fontSize: 10, color: C.dim, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>Overall Status</div>
                            <div style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 20, 
                                background: clearanceData?.overall_status === 'fully_cleared' ? 'rgba(52,211,153,0.05)' : 'rgba(248,113,113,0.05)', 
                                border: `1px solid ${clearanceData?.overall_status === 'fully_cleared' ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)'}`, 
                                color: clearanceData?.overall_status === 'fully_cleared' ? C.green : C.red, 
                                fontSize: 11, fontWeight: 800 
                            }}>
                                {clearanceData?.overall_status === 'fully_cleared' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                                {clearanceData?.overall_status === 'fully_cleared' ? 'FULLY CLEARED' : 'ENROLLMENT BLOCKED'}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────────────────────────────────────── */
const StatCard = ({ icon, label, val, color = '#f97316', bg = 'rgba(249,115,22,0.1)' }) => (
    <div className="rv-stat" style={{ padding: '11px 17px', background: bg, border: `1px solid ${C.border2}`, borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12, minWidth: 108, position: 'relative', overflow: 'hidden', transition: 'border-color .2s, background .2s', cursor: 'default' }}>
        <div style={{ width: 33, height: 33, borderRadius: 9, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>{icon}</div>
        <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: 8.5, fontWeight: 700, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '.07em', marginTop: 3, whiteSpace: 'nowrap' }}>{label}</div>
        </div>
    </div>
);

const PgBtn = ({ onClick, disabled, dir, small }) => {
    const sz = small ? 26 : 28;
    return (
        <button onClick={onClick} disabled={disabled} style={{ width: sz, height: sz, borderRadius: 7, background: '#191309', border: '1px solid rgba(249,115,22,0.065)', color: '#4a4038', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: disabled ? 'default' : 'pointer', transition: 'all .18s', opacity: disabled ? 0.3 : 1, flexShrink: 0 }}>
            {dir === 'left' ? <ChevronLeft size={small ? 11 : 12} /> : <ChevronRight size={small ? 11 : 12} />}
        </button>
    );
};

const InitialsAvatar = ({ firstName, lastName, size = 33 }) => {
    const initials = `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase();
    return (
        <div style={{ width: size, height: size, borderRadius: size * 0.3, background: 'rgba(249,115,22,0.18)', border: '1px solid rgba(249,115,22,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316', fontSize: size * 0.35, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>
            {initials || '?'}
        </div>
    );
};
