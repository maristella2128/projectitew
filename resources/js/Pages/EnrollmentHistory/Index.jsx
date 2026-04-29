import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm, router, usePage, Link } from '@inertiajs/react';
import { 
    Plus, ScrollText, User, Layers, 
    Calendar, Save, Edit, Trash2, X, 
    Clock, CheckCircle, AlertCircle,
    Search, Filter, ShieldCheck, History,
    ArrowRight, Bookmark, GraduationCap, BookOpen
} from 'lucide-react';
import Modal from '@/Components/Modal';

/* ─────────────────────────────────────
   STYLES (Academic Registry Elite Theme)
───────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,900&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Outfit:wght@300;400;600;700;800&display=swap');

.eh-root {
  background: #080604;
  min-height: 100vh;
  flex: 1; display: flex; flex-direction: column;
  font-family: 'Outfit', sans-serif;
  color: #fef3ec;
  padding: 40px 48px;
  position: relative;
  overflow-x: hidden;
}
.eh-grid {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image: 
    radial-gradient(circle at 2px 2px, rgba(249,115,22,0.05) 1px, transparent 0);
  background-size: 32px 32px;
}
.eh-glow {
  position: fixed; top: -10%; right: -5%;
  width: 600px; height: 600px; border-radius: 50%;
  background: radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%);
  filter: blur(80px);
  pointer-events: none; z-index: 0;
}
.eh-content { position: relative; z-index: 1; max-width: 1400px; margin: 0 auto; width: 100%; }

.eh-header {
  display: flex; justify-content: space-between; align-items: flex-end;
  margin-bottom: 48px; border-bottom: 1px solid rgba(249,115,22,0.1);
  padding-bottom: 24px;
}
.eh-title {
  font-family: 'Playfair Display', serif;
  font-size: 48px; font-weight: 900; color: #fef3ec;
  line-height: 0.9; letter-spacing: -.03em;
}
.eh-title em { color: #f97316; font-style: italic; display: block; font-size: 56px; }
.eh-sub { 
  font-size: 13px; color: rgba(254,243,236,0.4); margin-top: 12px; 
  letter-spacing: 0.05em; font-weight: 400;
  display: flex; align-items: center; gap: 8px;
}

.eh-filters {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px; margin-bottom: 32px;
}
.eh-filter-box {
  background: rgba(22,14,8,0.6); backdrop-filter: blur(12px);
  border: 1px solid rgba(249,115,22,0.15);
  border-radius: 16px; padding: 14px 20px;
  display: flex; align-items: center; gap: 12px;
  transition: all 0.3s ease;
}
.eh-filter-box:focus-within {
  border-color: #f97316; box-shadow: 0 0 20px rgba(249,115,22,0.1);
  transform: translateY(-2px);
}
.eh-select {
  flex: 1; background: transparent; border: none; outline: none;
  font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 500; color: #fef3ec;
  cursor: pointer;
}
.eh-select option { background: #1c1208; color: #fef3ec; }

.eh-card {
  background: rgba(22,14,8,0.4); backdrop-filter: blur(20px);
  border: 1px solid rgba(249,115,22,0.1); border-radius: 28px;
  overflow: hidden; box-shadow: 0 25px 80px rgba(0,0,0,0.6);
}
.eh-table { width: 100%; border-collapse: separate; border-spacing: 0; }
.eh-th {
  text-align: left; padding: 24px; border-bottom: 1px solid rgba(249,115,22,0.1);
  font-family: 'Space Mono', monospace; font-size: 10px; color: rgba(249,115,22,0.6);
  text-transform: uppercase; letter-spacing: .2em; font-weight: 700;
}
.eh-tr { transition: all 0.2s ease; }
.eh-tr:hover { background: rgba(249,115,22,0.03); }
.eh-td { padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.03); }

.eh-student-tag { display: flex; align-items: center; gap: 16px; text-decoration: none; }
.eh-avatar {
  width: 44px; height: 44px; border-radius: 14px;
  background: linear-gradient(135deg, rgba(249,115,22,0.2), rgba(249,115,22,0.05));
  border: 1px solid rgba(249,115,22,0.3);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Space Mono', monospace; font-size: 14px; font-weight: 700; color: #f97316;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

.eh-status {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 16px; border-radius: 10px; font-size: 10px; font-weight: 800;
  text-transform: uppercase; letter-spacing: .12em; border: 1px solid transparent;
}
.eh-status.enrolled  { background: rgba(249,115,22,0.08); color: #f97316; border-color: rgba(249,115,22,0.2); }
.eh-status.completed { background: rgba(52,211,153,0.08); color: #34d399; border-color: rgba(52,211,153,0.2); }
.eh-status.dropped   { background: rgba(239,68,68,0.08); color: #f87171; border-color: rgba(239,68,68,0.2); }

.eh-btn-action {
  padding: 10px 18px; border-radius: 12px; font-size: 11px; font-weight: 800;
  text-transform: uppercase; letter-spacing: .1em; cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex; align-items: center; gap: 8px;
  border: 1px solid transparent;
}

.eh-btn-curriculum {
  background: rgba(96,165,250,0.1); border-color: rgba(96,165,250,0.3); color: #60a5fa;
}
.eh-btn-curriculum:hover {
  background: #60a5fa; color: #080604; transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(96,165,250,0.2);
}

.eh-modal { 
  background: #0d0905; color: #fef3ec; 
  border: 1px solid rgba(249,115,22,0.15); border-radius: 36px;
  box-shadow: 0 40px 120px rgba(0,0,0,0.9);
  overflow: hidden; position: relative;
}
.eh-modal-glow {
  position: absolute; top: -20%; left: -20%; width: 50%; height: 50%;
  background: radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%);
  filter: blur(60px); pointer-events: none;
}
.eh-label {
  display: block; font-family: 'Space Mono', monospace; font-size: 10px; 
  color: rgba(249,115,22,0.6); text-transform: uppercase; letter-spacing: .2em;
  font-weight: 700; margin-bottom: 12px;
}
.eh-input {
  width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px; padding: 14px 18px; color: #fef3ec;
  font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 500;
  transition: all 0.3s ease; outline: none;
}
.eh-input:focus {
  border-color: #f97316; background: rgba(249,115,22,0.05);
  box-shadow: 0 0 15px rgba(249,115,22,0.1);
}
.eh-input option { background: #1c1208; color: #fef3ec; }

.eh-btn-cancel {
  flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.3); py: 16px; border-radius: 16px;
  font-family: 'Space Mono', monospace; font-size: 10px; font-weight: 800;
  text-transform: uppercase; letter-spacing: .2em; cursor: pointer;
  transition: all 0.3s ease;
}
.eh-btn-cancel:hover {
  background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.2);
  color: #f87171;
}

.at-btn-save {
  flex: 2; background: linear-gradient(135deg, #f97316, #c2410c);
  color: #fff; border: none; padding: 16px 28px; border-radius: 18px;
  font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: .15em;
  display: flex; align-items: center; justify-content: center; gap: 12px; cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 40px rgba(249,115,22,0.3);
}
.at-btn-save:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 50px rgba(249,115,22,0.4);
  filter: brightness(1.15);
}
.at-btn-save:active { transform: translateY(-1px) scale(0.98); }
.at-btn-save:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }


`;

export default function EnrollmentIndex({ enrollments, students, sections, filters }) {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingEnrollment, setEditingEnrollment] = React.useState(null);
    const { auth } = usePage().props;
    const isAdmin = ['dean', 'teacher'].includes(auth.user.role);

    // Map numeric semester to readable string
    const semLabel = (s) => ({
        1: '1st Sem', 2: '2nd Sem', 3: 'Summer',
        '1': '1st Sem', '2': '2nd Sem', '3': 'Summer',
        '1st Semester': '1st Sem', '2nd Semester': '2nd Sem', 'Summer': 'Summer'
    }[s] ?? (s || '—'));

    // Full semester label for curriculum URL param
    const semFull = (s) => ({
        1: '1st Semester', 2: '2nd Semester', 3: 'Summer',
        '1': '1st Semester', '2': '2nd Semester', '3': 'Summer',
        '1st Semester': '1st Semester', '2nd Semester': '2nd Semester', 'Summer': 'Summer'
    }[s] ?? s);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        student_id: '',
        section_id: '',
        grade_level: '',
        school_year: '',
        status: 'enrolled',
        enrolled_date: new Date().toISOString().split('T')[0],
        completed_date: '',
    });

    const handleFilter = (key, value) => {
        router.get(route('enrollment-history.index'), { ...filters, [key]: value }, { preserveState: true });
    };

    const openModal = (enrollment = null) => {
        if (enrollment) {
            setEditingEnrollment(enrollment);
            setData({
                student_id: enrollment.student_id,
                section_id: enrollment.section_id || '',
                grade_level: enrollment.grade_level,
                school_year: enrollment.school_year,
                status: enrollment.status,
                enrolled_date: enrollment.enrolled_date,
                completed_date: enrollment.completed_date || '',
            });
        } else {
            setEditingEnrollment(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingEnrollment) {
            patch(route('enrollment-history.update', editingEnrollment.id), {
                onSuccess: () => { setIsModalOpen(false); reset(); }
            });
        } else {
            post(route('enrollment-history.store'), {
                onSuccess: () => { setIsModalOpen(false); reset(); }
            });
        }
    };

    return (
        <AppLayout title="Academic Progression" noPadding>
            <style>{css}</style>
            <div className="eh-root">
                <div className="eh-grid" />
                <div className="eh-glow" />
                
                <div className="eh-content">
                    {/* Header */}
                    <div className="eh-header">
                        <div>
                            <h1 className="eh-title">
                                Academic
                                <em>Progression</em>
                            </h1>
                            <div className="eh-sub">
                                <ShieldCheck size={14} color="#f97316" />
                                College of Computing Studies · Official Multi-Year Enrollment & Historical Tracking
                            </div>
                        </div>
                        {isAdmin && (
                            <button onClick={() => openModal()} className="gr-btn-primary" style={{ height: 50, padding: '0 32px', borderRadius: 16 }}>
                                <Plus size={18} /> <span>Initialize Record</span>
                            </button>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="eh-filters">
                        <div className="eh-filter-box">
                            <Filter size={18} color="#f97316" />
                            <select 
                                className="eh-select"
                                value={filters.section_id || ''}
                                onChange={e => handleFilter('section_id', e.target.value)}
                            >
                                <option value="">Filter by Block...</option>
                                {sections.map(s => <option key={s.id} value={s.id}>{s.name} ({s.grade_level})</option>)}
                            </select>
                        </div>
                        <div className="eh-filter-box">
                            <Search size={18} color="#f97316" />
                            <select 
                                className="eh-select"
                                value={filters.student_id || ''}
                                onChange={e => handleFilter('student_id', e.target.value)}
                            >
                                <option value="">Find Student Registry...</option>
                                {students.map(s => <option key={s.id} value={s.id}>{s.student_id} — {s.first_name} {s.last_name}</option>)}
                            </select>
                        </div>
                    </div>


                    <div className="eh-card">
                        <table className="eh-table">
                            <thead>
                                <tr>
                                    <th className="eh-th">Student Identity</th>
                                    <th className="eh-th">Level &amp; Block</th>
                                    <th className="eh-th text-center">Semester</th>
                                    <th className="eh-th text-center">Academic Cycle</th>
                                    <th className="eh-th">Commencement</th>
                                    <th className="eh-th">Status</th>
                                    <th className="eh-th text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.data.length > 0 ? enrollments.data.map((enrollment) => (
                                    <tr key={enrollment.id} className="eh-tr">
                                        <td className="eh-td">
                                            <Link href={route('students.show', enrollment.student_id)} className="eh-student-tag group">
                                                <div className="eh-avatar group-hover:scale-110 transition-transform">
                                                    {enrollment.student.first_name[0]}{enrollment.student.last_name[0]}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors">
                                                        {enrollment.student.first_name} {enrollment.student.last_name}
                                                    </div>
                                                    <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{enrollment.student.student_id}</div>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="eh-td">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white font-serif italic">{enrollment.grade_level}</span>
                                                <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{enrollment.section?.name || 'Unassigned'}</span>
                                            </div>
                                        </td>
                                        <td className="eh-td text-center">
                                            {enrollment.semester ? (
                                                <span className="eh-status enrolled">
                                                    {semLabel(enrollment.semester)}
                                                </span>
                                            ) : (
                                                <span style={{ fontSize: 10, color: 'rgba(254,243,236,0.2)', fontStyle: 'italic' }}>—</span>
                                            )}
                                        </td>
                                        <td className="eh-td text-center">
                                            <span className="text-xs font-bold text-orange-500/80 font-mono tracking-tighter">{enrollment.school_year}</span>
                                        </td>
                                        <td className="eh-td text-[11px] text-white/40 font-mono">
                                            {enrollment.enrolled_date}
                                        </td>
                                        <td className="eh-td">
                                            <span className={`eh-status ${enrollment.status}`}>
                                                {enrollment.status}
                                            </span>
                                        </td>
                                        <td className="eh-td text-right">
                                            <div className="flex justify-end gap-3">
                                                {enrollment.curriculum_id && (
                                                    <button
                                                        title="View Curriculum for this Semester"
                                                        onClick={() => router.visit(
                                                            route('curricula.show', enrollment.curriculum_id) +
                                                            `?student_id=${enrollment.student_id}&semester=${encodeURIComponent(semFull(enrollment.semester))}&year_level=${encodeURIComponent(enrollment.grade_level)}`
                                                        )}
                                                        className="eh-btn-action eh-btn-curriculum"
                                                    >
                                                        <BookOpen size={12} /> Curriculum
                                                    </button>
                                                )}
                                                {isAdmin && (
                                                    <div className="flex gap-1">
                                                        <button onClick={() => openModal(enrollment)} className="p-2.5 text-white/10 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                                            <Edit size={16} />
                                                        </button>
                                                        <button onClick={() => { if(confirm('Delete record?')) router.delete(route('enrollment-history.destroy', enrollment.id)); }} className="p-2.5 text-white/10 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7} className="p-40 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="p-6 rounded-full bg-orange-500/5 border border-orange-500/10">
                                                    <History size={48} className="text-orange-500/20" />
                                                </div>
                                                <div className="font-serif italic text-white/20 text-2xl">Historical registry empty</div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        
                        {/* Pagination Footer */}
                        {enrollments.total > enrollments.per_page && (
                            <div className="px-6 py-4 border-t border-white/5 flex justify-between items-center bg-black/20">
                                <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                                    Showing <span className="text-white/40">{enrollments.from}-{enrollments.to}</span> of <span className="text-white/40">{enrollments.total}</span> records
                                </div>
                                <div className="flex gap-2">
                                    {enrollments.links.map((link, i) => (
                                        <button
                                            key={i}
                                            disabled={!link.url || link.active}
                                            onClick={() => router.get(link.url, filters, { preserveScroll: true, preserveState: true })}
                                            className={`
                                                px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all
                                                ${link.active ? 'bg-orange-500 text-black' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}
                                                ${!link.url ? 'opacity-20 cursor-not-allowed' : ''}
                                            `}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>


                </div>
            </div>

            {/* Modal */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="xl">
                <div className="eh-modal">
                    <div className="eh-modal-glow" />
                    <div className="p-10 border-b border-white/5 flex justify-between items-end relative z-10 bg-gradient-to-b from-orange-500/[0.03] to-transparent">
                        <div>
                            <div className="eh-label" style={{ marginBottom: 8 }}>Registry Synchronization</div>
                            <h3 className="font-serif text-4xl font-black italic text-white leading-none tracking-tight">
                                {editingEnrollment ? 'Modify' : 'Initialize'} <span className="text-orange-500">Record</span>
                            </h3>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-10 space-y-8 relative z-10">
                        {!editingEnrollment && (
                            <div>
                                <label className="eh-label">Student Subject</label>
                                <select className="eh-input" value={data.student_id} onChange={e => setData('student_id', e.target.value)} required>
                                    <option value="">Identify Candidate...</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.student_id} | {s.first_name} {s.last_name}</option>)}
                                </select>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="eh-label">Year Level</label>
                                <select className="eh-input font-bold" value={data.grade_level} onChange={e => setData('grade_level', e.target.value)} required>
                                    <option value="">Select Level...</option>
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                </select>
                            </div>
                            <div>
                                <label className="eh-label">Academic Block</label>
                                <select className="eh-input font-bold" value={data.section_id} onChange={e => setData('section_id', e.target.value)}>
                                    <option value="">Pending Assignment</option>
                                    {sections.map(s => <option key={s.id} value={s.id}>{s.name} ({s.grade_level})</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="eh-label">Academic Cycle (SY)</label>
                                <input className="eh-input" value={data.school_year} onChange={e => setData('school_year', e.target.value)} placeholder="e.g. 2024-2025" required />
                            </div>
                            <div>
                                <label className="eh-label">Status Flag</label>
                                <select className="eh-input font-black uppercase text-[10px] tracking-widest" value={data.status} onChange={e => setData('status', e.target.value)} required>
                                    <option value="enrolled">Enrolled</option>
                                    <option value="completed">Completed</option>
                                    <option value="dropped">Dropped</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="eh-label">Fiscal Enrolled Date</label>
                            <input type="date" className="eh-input" value={data.enrolled_date} onChange={e => setData('enrolled_date', e.target.value)} required />
                        </div>
                        <div className="flex gap-6 pt-6">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="eh-btn-cancel">
                                Abandon
                            </button>
                            <button type="submit" disabled={processing} className="at-btn-save">
                                <Save size={18} strokeWidth={2.5} /> 
                                <span>Seal Progression Entry</span>
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AppLayout>
    );
}
