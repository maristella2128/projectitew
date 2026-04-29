import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm, usePage } from '@/inertia-adapter';
import { Plus, Trash2, ArrowLeft, BookOpen, Clock, Layers, Edit2, Save, X, Search } from 'lucide-react';

const C = {
    bg: '#0a0704', surf: '#120c06', card: '#1a1008',
    orange: '#f97316', o2: '#fb923c',
    txt: '#fef3ec', muted: 'rgba(254,243,236,0.38)',
    border: 'rgba(249,115,22,0.09)', border2: 'rgba(249,115,22,0.22)',
    green: '#34d399', blue: '#60a5fa',
};

// Map numeric semester (1/2/3) to curriculum string key
const semesterLabel = (s) => ({ 1: '1st Semester', 2: '2nd Semester', 3: 'Summer' }[parseInt(s)] ?? s);

export default function CurriculumShow({ curriculum, grouped, allCourses, programs = [], studentContext = null }) {
    const [modal, setModal] = useState(null); // {year_level, semester} | {type: 'edit_curriculum'}
    const [searchTerm, setSearchTerm] = useState('');
    
    // Form for Adding Courses
    const courseForm = useForm({
        course_id: '',
        year_level: '',
        semester: '',
        order: 0,
    });

    // Form for Editing Curriculum Metadata
    const currForm = useForm({
        name: curriculum.name,
        program_id: curriculum.program_id,
        effective_year: curriculum.effective_year,
        status: curriculum.status,
    });

    // Form for Master Course Definition
    const masterForm = useForm({
        id: '', code: '', name: '', lec_units: 0, lab_units: 0, type: 'Major', department: 'CS', description: ''
    });

    const [masterView, setMasterView] = useState(null); // null | 'create' | 'edit'
    const [confirmModal, setConfirmModal] = useState(null); // { type, id, title, desc, action }

    const handleUpdateCurriculum = (e) => {
        e.preventDefault();
        currForm.patch(route('curricula.update', curriculum.id), {
            onSuccess: () => setModal(null)
        });
    };

    const handleSaveMaster = (e) => {
        e.preventDefault();
        const url = masterView === 'create' ? route('courses.store') : route('courses.update', masterForm.data.id);
        const method = masterView === 'create' ? 'post' : 'patch';
        
        masterForm[method](url, {
            onSuccess: () => {
                setMasterView(null);
                masterForm.reset();
            }
        });
    };

    const handleDeleteMaster = (id) => {
        setConfirmModal({
            type: 'delete_master', id,
            title: 'Delete Master Course',
            desc: 'This will permanently remove this course from the global registry. This action cannot be undone.',
            action: () => router.delete(route('courses.destroy', id), { onSuccess: () => setConfirmModal(null) })
        });
    };

    const openAdd = (yl, sem) => {
        setSearchTerm('');
        courseForm.setData({ course_id: '', year_level: yl, semester: sem, order: 0 });
        setModal({ year_level: yl, semester: sem });
    };

    const handleAdd = (e) => {
        e.preventDefault();
        courseForm.post(route('curricula.courses.add', curriculum.id), {
            onSuccess: () => { setModal(null); courseForm.reset(); }
        });
    };

    const handleRemove = (courseId) => {
        setConfirmModal({
            type: 'remove_assignment', id: courseId,
            title: 'Remove Assignment',
            desc: 'Are you sure you want to remove this course from the curriculum? The master course definition will remain intact.',
            action: () => router.delete(route('curricula.courses.remove', [curriculum.id, courseId]), { onSuccess: () => setConfirmModal(null) })
        });
    };

    const INP = { width: '100%', background: C.surf, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 13px', color: C.txt, fontSize: 13, outline: 'none', fontFamily: 'inherit' };
    const LBL = { display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'rgba(249,115,22,0.5)', marginBottom: 5 };

    const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
    const SEMS  = ['1st Semester', '2nd Semester', 'Summer'];
    // If student context is provided, default to their year level
    const contextYear = studentContext?.year_level ?? '1st Year';
    const contextSem  = studentContext ? semesterLabel(studentContext.semester) : null;
    const [selectedYear, setSelectedYear] = useState(contextYear);

    return (
        <AppLayout noPadding>
            <Head title={`Curriculum: ${curriculum.name}`} />
            <div style={{ padding: '20px 32px 40px', background: C.bg, minHeight: '100vh', width: '100%', color: C.txt, fontFamily: "'DM Sans', sans-serif" }}>

                {/* Student Context Banner */}
                {studentContext && (
                    <div style={{
                        marginBottom: 20, padding: '14px 20px', borderRadius: 14,
                        background: 'linear-gradient(135deg, rgba(96,165,250,0.08), rgba(167,139,250,0.05))',
                        border: '1px solid rgba(96,165,250,0.2)',
                        display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap'
                    }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Layers size={16} color={C.blue} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.12em', color: C.blue, marginBottom: 3 }}>Viewing as Student</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: C.txt }}>{studentContext.name} <span style={{ fontFamily: 'Space Mono', fontSize: 10, color: C.muted, fontWeight: 400 }}>· {studentContext.student_no}</span></div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            <span style={{ padding: '4px 12px', borderRadius: 8, background: 'rgba(249,115,22,0.1)', color: C.orange, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em' }}>
                                {studentContext.year_level}
                            </span>
                            {contextSem && (
                                <span style={{ padding: '4px 12px', borderRadius: 8, background: 'rgba(52,211,153,0.1)', color: C.green, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em' }}>
                                    {contextSem} Only
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => router.visit(route('curricula.show', curriculum.id))}
                            style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, color: C.muted, padding: '6px 12px', borderRadius: 8, fontSize: 10, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '.08em' }}
                        >
                            View Full Curriculum
                        </button>
                    </div>
                )}

                {/* Header */}
                <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        <button onClick={() => window.history.back()} 
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, 
                                padding: '8px 14px', borderRadius: 10, color: C.txt, fontSize: 11, fontWeight: 700, cursor: 'pointer', marginBottom: 16, 
                                textTransform: 'uppercase', letterSpacing: '.12em', transition: 'all .2s' 
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = C.o2; e.currentTarget.style.color = C.orange; e.currentTarget.style.background = 'rgba(249,115,22,0.05)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.txt; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                        >
                            <ArrowLeft size={14} /> Back
                        </button>
                        <div>
                            <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.18em', color: C.orange, marginBottom: 6, opacity: 0.8 }}>System / Academic / Curriculum</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <h1 style={{ fontSize: 32, fontWeight: 700, color: C.txt, fontFamily: "'Playfair Display', serif", margin: 0 }}>
                                    {curriculum.name} <span style={{ color: C.orange, fontSize: 20, fontStyle: 'italic', fontWeight: 400, marginLeft: 10 }}>{curriculum.program?.code}</span>
                                </h1>
                                <button 
                                    onClick={() => setModal({ type: 'edit_curriculum' })}
                                    style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, padding: '6px 10px', borderRadius: 8, color: C.muted, cursor: 'pointer', transition: 'all .2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.color = C.txt; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                                >
                                    <Edit2 size={13} />
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                                <div style={{ fontSize: 12, color: C.muted }}><strong style={{ color: C.o2 }}>Revision:</strong> {curriculum.effective_year}</div>
                                <div style={{ fontSize: 12, color: C.muted }}><strong style={{ color: C.o2 }}>Status:</strong> {curriculum.status}</div>
                            </div>
                        </div>
                    </div>

                    {/* Year Tabs - MORE PROMINENT */}
                    <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: 6, borderRadius: 16, border: `1px solid ${C.border2}`, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                        {YEARS.map(year => (
                            <button
                                key={year}
                                onClick={() => setSelectedYear(year)}
                                style={{
                                    padding: '12px 24px', borderRadius: 12, border: 'none', fontSize: 13, fontWeight: 800, cursor: 'pointer', transition: 'all .3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    background: selectedYear === year ? `linear-gradient(135deg, ${C.orange}, ${C.o2})` : 'transparent',
                                    color: selectedYear === year ? '#fff' : C.muted,
                                    transform: selectedYear === year ? 'scale(1.05)' : 'scale(1)',
                                    boxShadow: selectedYear === year ? '0 8px 20px rgba(249,115,22,0.4)' : 'none',
                                    letterSpacing: '.02em'
                                }}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid of Semesters for selected year */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24 }}>
                    {SEMS.map(sem => {
                        const courses = grouped[selectedYear]?.[sem] ?? [];
                        const totalUnits = courses.reduce((sum, c) => sum + (c.lec_units + c.lab_units), 0);
                        // Dim non-active semesters when student context is active
                        const isStudentSem = contextSem === sem;
                        const isDimmed = contextSem && !isStudentSem;

                        return (
                            <div key={sem} style={{ background: C.card, border: `1px solid ${isDimmed ? C.border : isStudentSem ? 'rgba(52,211,153,0.25)' : C.border}`, borderRadius: 24, overflow: 'hidden', height: 'fit-content', boxShadow: isDimmed ? 'none' : isStudentSem ? '0 4px 24px rgba(52,211,153,0.08)' : '0 4px 24px rgba(0,0,0,0.1)', opacity: isDimmed ? 0.4 : 1, transition: 'all .3s' }}>
                                <div style={{ padding: '18px 24px', background: isStudentSem ? 'rgba(52,211,153,0.05)' : 'rgba(255,255,255,0.02)', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: isStudentSem ? C.green : C.orange, boxShadow: `0 0 10px ${isStudentSem ? C.green : C.orange}` }} />
                                        <div style={{ fontSize: 15, fontWeight: 700, color: C.txt, letterSpacing: '.02em' }}>{sem}</div>
                                        {isStudentSem && <span style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', color: C.green, background: 'rgba(52,211,153,0.1)', padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(52,211,153,0.2)' }}>Enrolled</span>}
                                    </div>
                                    <div style={{ fontSize: 11, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: 8 }}>{totalUnits} Units Total</div>
                                </div>

                                <div style={{ padding: '16px' }}>
                                    {courses.length === 0 ? (
                                        <div style={{ padding: '60px 20px', textAlign: 'center', color: 'rgba(254,243,236,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                                            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <BookOpen size={20} style={{ opacity: 0.3 }} />
                                            </div>
                                            <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: '.03em' }}>No courses assigned for this period</div>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            {courses.map(c => (
                                                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', borderRadius: 16, transition: 'all .2s' }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateX(0)'; }}
                                                >
                                                    <div style={{ width: 64, fontFamily: 'Space Mono', fontSize: 11, fontWeight: 800, color: C.orange, background: 'rgba(249,115,22,0.1)', padding: '4px 8px', borderRadius: 6, textAlign: 'center', border: `1px solid rgba(249,115,22,0.2)` }}>{c.code}</div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: 13, fontWeight: 600, color: C.txt }}>{c.name}</div>
                                                        <div style={{ fontSize: 11, color: C.muted }}>{c.lec_units} Lec · {c.lab_units} Lab</div>
                                                    </div>
                                                    <button onClick={() => handleRemove(c.id)} style={{ background: 'none', border: 'none', color: 'rgba(248,113,113,0.15)', cursor: 'pointer', padding: 6, borderRadius: 8, transition: 'all .2s' }} onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'rgba(248,113,113,0.15)'; e.currentTarget.style.background = 'transparent'; }}><Trash2 size={14} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <button onClick={() => openAdd(selectedYear, sem)} 
                                        style={{ 
                                            width: '100%', marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', 
                                            borderRadius: 14, background: 'rgba(249,115,22,0.03)', border: `1px dashed ${C.border2}`, color: C.o2, fontSize: 12, 
                                            fontWeight: 700, cursor: 'pointer', transition: 'all .2s' 
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = C.o2; e.currentTarget.style.background = 'rgba(249,115,22,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = C.border2; e.currentTarget.style.background = 'rgba(249,115,22,0.03)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                    >
                                        <Plus size={14} /> Add Course
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Add Course Modal */}
                {modal && modal.type !== 'edit_curriculum' && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(5,2,0,.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setModal(null)}>
                        <div style={{ background: C.bg, border: `1px solid ${C.border2}`, borderRadius: 18, width: '100%', maxWidth: 460, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                            <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${C.border}`, background: 'rgba(249,115,22,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: C.txt, fontFamily: "'Playfair Display', serif" }}>{masterView ? (masterView === 'create' ? 'Register New Subject' : 'Edit Subject Definition') : `Add Course to ${modal.year_level}`}</div>
                                    <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{masterView ? 'Master Course Registry' : modal.semester}</div>
                                </div>
                                {!masterView && (
                                    <button 
                                        onClick={() => { setMasterView('create'); masterForm.reset(); }}
                                        style={{ background: 'rgba(249,115,22,0.1)', border: `1px solid ${C.border2}`, color: C.orange, padding: '6px 12px', borderRadius: 8, fontSize: 10, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                                    >
                                        <Plus size={12} /> New Subject
                                    </button>
                                )}
                                {masterView && (
                                    <button onClick={() => setMasterView(null)} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer' }}><ArrowLeft size={16} /></button>
                                )}
                            </div>
                            
                            {masterView ? (
                                <form onSubmit={handleSaveMaster}>
                                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 12 }}>
                                            <div>
                                                <label style={LBL}>Code</label>
                                                <input style={INP} value={masterForm.data.code} onChange={e => masterForm.setData('code', e.target.value)} required />
                                            </div>
                                            <div>
                                                <label style={LBL}>Subject Name</label>
                                                <input style={INP} value={masterForm.data.name} onChange={e => masterForm.setData('name', e.target.value)} required />
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
                                            <div style={{ gridColumn: 'span 2' }}>
                                                <label style={LBL}>Department</label>
                                                <input style={INP} value={masterForm.data.department} onChange={e => masterForm.setData('department', e.target.value)} required />
                                            </div>
                                            <div>
                                                <label style={LBL}>Lec</label>
                                                <input type="number" style={INP} value={masterForm.data.lec_units} onChange={e => masterForm.setData('lec_units', e.target.value)} required />
                                            </div>
                                            <div>
                                                <label style={LBL}>Lab</label>
                                                <input type="number" style={INP} value={masterForm.data.lab_units} onChange={e => masterForm.setData('lab_units', e.target.value)} required />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={LBL}>Type</label>
                                            <select style={INP} value={masterForm.data.type} onChange={e => masterForm.setData('type', e.target.value)}>
                                                <option value="Major">Major Course</option>
                                                <option value="Minor">Minor Course</option>
                                                <option value="GE">General Education</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ padding: '14px 24px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 10, justifyContent: 'flex-end', background: 'rgba(255,255,255,0.01)' }}>
                                        <button type="button" onClick={() => setMasterView(null)} style={{ padding: '9px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, color: C.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                        <button type="submit" disabled={masterForm.processing} style={{ padding: '9px 20px', borderRadius: 10, background: `linear-gradient(135deg, ${C.orange}, #c2410c)`, border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                            {masterForm.processing ? 'Saving...' : (masterView === 'create' ? 'Register Subject' : 'Update Subject')}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleAdd}>
                                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div>
                                        <label style={LBL}>Search Course</label>
                                        <div style={{ position: 'relative', marginBottom: 10 }}>
                                            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
                                            <input 
                                                type="text" 
                                                placeholder="Type to filter courses..." 
                                                style={{ ...INP, paddingLeft: 36 }}
                                                value={searchTerm}
                                                onChange={e => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <label style={LBL}>Available Courses *</label>
                                        <div style={{ 
                                            maxHeight: 220, overflowY: 'auto', background: 'rgba(0,0,0,0.2)', 
                                            border: `1px solid ${C.border}`, borderRadius: 12, padding: 6,
                                            display: 'flex', flexDirection: 'column', gap: 2
                                        }}>
                                            {(() => {
                                                const assignedIds = Object.values(grouped).flatMap(y => Object.values(y).flatMap(s => s.map(c => c.id)));
                                                const available = allCourses.filter(c => !assignedIds.includes(c.id));
                                                const filtered = available.filter(c => 
                                                    c.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                                    c.name.toLowerCase().includes(searchTerm.toLowerCase())
                                                );
                                                
                                                if (filtered.length === 0) return (
                                                    <div style={{ padding: '20px', textAlign: 'center', color: C.dim, fontSize: 11 }}>No matches found</div>
                                                );

                                                return filtered.map(c => (
                                                    <div 
                                                        key={c.id} 
                                                        onClick={() => courseForm.setData('course_id', c.id)}
                                                        style={{ 
                                                            padding: '8px 12px', borderRadius: 10, cursor: 'pointer', transition: 'all .2s',
                                                            background: courseForm.data.course_id == c.id ? 'rgba(249,115,22,0.12)' : 'transparent',
                                                            border: `1px solid ${courseForm.data.course_id == c.id ? 'rgba(249,115,22,0.3)' : 'transparent'}`,
                                                            display: 'flex', alignItems: 'center', gap: 10, position: 'relative'
                                                        }}
                                                        onMouseEnter={e => { if (courseForm.data.course_id != c.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                                                        onMouseLeave={e => { if (courseForm.data.course_id != c.id) e.currentTarget.style.background = 'transparent'; }}
                                                    >
                                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                                                            <div style={{ fontFamily: 'Space Mono', fontSize: 9, fontWeight: 800, opacity: 0.8, color: courseForm.data.course_id == c.id ? C.orange : C.muted, width: 45 }}>{c.code}</div>
                                                            <div style={{ fontSize: 12, fontWeight: 500, color: courseForm.data.course_id == c.id ? C.o2 : C.txt }}>{c.name}</div>
                                                        </div>
                                                        
                                                        {/* Quick Actions */}
                                                        <div style={{ display: 'flex', gap: 4 }}>
                                                            <button 
                                                                type="button"
                                                                onClick={(e) => { 
                                                                    e.stopPropagation(); 
                                                                    masterForm.setData({ ...c });
                                                                    setMasterView('edit');
                                                                }}
                                                                style={{ background: 'rgba(255,255,255,0.03)', border: 'none', color: C.muted, padding: 6, borderRadius: 6, cursor: 'pointer' }}
                                                                onMouseEnter={e => e.currentTarget.style.color = C.txt}
                                                                onMouseLeave={e => e.currentTarget.style.color = C.muted}
                                                            >
                                                                <Edit2 size={11} />
                                                            </button>
                                                            <button 
                                                                type="button"
                                                                onClick={(e) => { e.stopPropagation(); handleDeleteMaster(c.id); }}
                                                                style={{ background: 'rgba(255,255,255,0.03)', border: 'none', color: 'rgba(239,68,68,0.3)', padding: 6, borderRadius: 6, cursor: 'pointer' }}
                                                                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                                                onMouseLeave={e => e.currentTarget.style.color = 'rgba(239,68,68,0.3)'}
                                                            >
                                                                <Trash2 size={11} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                    <div>
                                        <label style={LBL}>Display Order</label>
                                        <input type="number" style={INP} value={courseForm.data.order} onChange={e => courseForm.setData('order', e.target.value)} />
                                    </div>
                                </div>
                                <div style={{ padding: '14px 24px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                    <button type="button" onClick={() => setModal(null)} style={{ padding: '9px 16px', borderRadius: 10, background: 'rgba(249,115,22,0.08)', border: `1px solid ${C.border}`, color: C.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                                    <button type="submit" disabled={courseForm.processing} style={{ padding: '9px 20px', borderRadius: 10, background: `linear-gradient(135deg, ${C.orange}, #c2410c)`, border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', opacity: courseForm.processing ? .7 : 1, fontFamily: 'inherit' }}>
                                        {courseForm.processing ? 'Adding...' : 'Add to Curriculum'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
                )}

                {/* Edit Curriculum Metadata Modal */}
                {modal?.type === 'edit_curriculum' && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(5,2,0,.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setModal(null)}>
                        <div style={{ background: C.bg, border: `1px solid ${C.border2}`, borderRadius: 20, width: '100%', maxWidth: 460, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }} onClick={e => e.stopPropagation()}>
                            <div style={{ padding: '24px', borderBottom: `1px solid ${C.border}`, background: 'rgba(249,115,22,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: C.txt, fontFamily: "'Playfair Display', serif" }}>Edit Curriculum Details</div>
                                    <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Modify core identification and metadata</div>
                                </div>
                                <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer' }}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleUpdateCurriculum}>
                                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div>
                                        <label style={LBL}>Curriculum Name</label>
                                        <input className="ps-field-inp" style={INP} value={currForm.data.name} onChange={e => currForm.setData('name', e.target.value)} required />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                        <div>
                                            <label style={LBL}>Program / Department</label>
                                            <select style={INP} value={currForm.data.program_id} onChange={e => currForm.setData('program_id', e.target.value)}>
                                                {programs.map(p => <option key={p.id} value={p.id}>{p.code}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={LBL}>Effective Year</label>
                                            <input type="number" style={INP} value={currForm.data.effective_year} onChange={e => currForm.setData('effective_year', e.target.value)} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={LBL}>Status</label>
                                        <select style={INP} value={currForm.data.status} onChange={e => currForm.setData('status', e.target.value)}>
                                            <option value="Draft">Draft</option>
                                            <option value="Active">Active</option>
                                            <option value="Archived">Archived</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 10, justifyContent: 'flex-end', background: 'rgba(255,255,255,0.01)' }}>
                                    <button type="button" onClick={() => setModal(null)} style={{ padding: '10px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, color: C.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" disabled={currForm.processing} style={{ padding: '10px 24px', borderRadius: 12, background: `linear-gradient(135deg, ${C.orange}, #c2410c)`, border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Save size={14} /> {currForm.processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Confirmation Modal */}
                {confirmModal && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(5,2,0,.92)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setConfirmModal(null)}>
                        <div style={{ background: C.bg, border: `1px solid rgba(239,68,68,0.3)`, borderRadius: 24, width: '100%', maxWidth: 400, overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
                            <div style={{ padding: '32px 32px 24px', textAlign: 'center' }}>
                                <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(239,68,68,0.2)' }}>
                                    <Trash2 size={28} color="#ef4444" />
                                </div>
                                <h3 style={{ fontSize: 20, fontWeight: 700, color: C.txt, margin: '0 0 10px', fontFamily: "'Playfair Display', serif" }}>{confirmModal.title}</h3>
                                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0 }}>{confirmModal.desc}</p>
                            </div>
                            <div style={{ padding: '20px 32px 32px', display: 'flex', gap: 12 }}>
                                <button onClick={() => setConfirmModal(null)} style={{ flex: 1, padding: '12px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, color: C.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                <button onClick={confirmModal.action} style={{ flex: 1, padding: '12px', borderRadius: 14, background: 'linear-gradient(135deg, #ef4444, #991b1b)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px rgba(239,68,68,0.2)' }}>Confirm</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
