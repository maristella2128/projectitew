import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link, usePage, router } from '@inertiajs/react';
import { 
    ChevronLeft, Calendar, User, 
    Users, Target, Trophy, Clock,
    Plus, Search, X, Check, Trash2,
    CheckCircle, UserPlus, Info, ExternalLink
} from 'lucide-react';
import Modal from '@/Components/Modal';

/* ─────────────────────────────────────
   STYLES (Activity Details Premium Theme)
───────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,900&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');

.ac-detail-root {
  background: #0c0805; min-height: 100%; flex: 1; display: flex; flex-direction: column;
  font-family: 'DM Sans', sans-serif; color: #fef3ec; padding: 40px; position: relative;
}
.ac-detail-grid {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image: linear-gradient(rgba(249,115,22,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.02) 1px, transparent 1px);
  background-size: 48px 48px;
}
.ac-detail-content { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; width: 100%; }

.ac-back {
  display: inline-flex; align-items: center; gap: 8px; color: #f97316; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: .2em; margin-bottom: 32px; text-decoration: none;
}
.ac-header-card {
  background: #160e08; border: 1px solid #2a1508; border-radius: 32px; padding: 48px; margin-bottom: 40px;
  position: relative; overflow: hidden;
}
.ac-header-card::after {
    content: ''; position: absolute; top: 0; right: 0; width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 70%);
    pointer-events: none;
}

.ac-title { font-family: 'Playfair Display', serif; font-size: 56px; font-weight: 900; font-style: italic; margin-bottom: 16px; line-height: 1.1; color: #fef3ec; }
.ac-desc { font-size: 16px; color: rgba(254,243,236,0.5); line-height: 1.7; max-width: 700px; }

.ac-section-title {
    font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 900; font-style: italic; color: #fef3ec; margin-bottom: 24px; display: flex; align-items: center; gap: 12px;
}
.ac-section-title span { color: #f97316; }

.student-card {
    background: #160e08; border: 1px solid #2a1508; border-radius: 20px; padding: 20px;
    display: flex; align-items: center; gap: 20px; transition: all 0.2s;
}
.student-card:hover { border-color: rgba(249,115,22,0.3); transform: translateX(5px); }

.avatar {
    width: 48px; height: 48px; border-radius: 14px; background: #2a1508;
    display: flex; align-items: center; justify-content: center; color: #f97316; font-weight: 900; font-size: 18px;
}

.student-list-item {
    padding: 16px; border-radius: 16px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.03);
    display: flex; align-items: center; gap: 16px; margin-bottom: 12px; transition: all 0.2s;
}
.student-list-item:hover { background: rgba(255,255,255,0.04); border-color: rgba(249,115,22,0.2); }

.checkbox-custom {
    width: 20px; height: 20px; border-radius: 6px; border: 2px solid #2a1508; background: #0c0805;
    display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;
}
.checkbox-custom.checked { background: #f97316; border-color: #f97316; }

.search-input {
    width: 100%; background: #0c0805; border: 1px solid #2a1508; border-radius: 16px;
    padding: 14px 20px 14px 48px; color: #fef3ec; font-size: 14px; outline: none;
}
.search-input:focus { border-color: #f97316; }

.ac-label { font-family: 'Space Mono', monospace; font-size: 10px; font-weight: 700; color: rgba(254,243,236,0.3); text-transform: uppercase; letter-spacing: .15em; margin-bottom: 4px; }
`;

export default function ActivityShow({ activity, availableStudents, userRole }) {
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = React.useState(false);
    const [enrollmentToRemove, setEnrollmentToRemove] = React.useState(null);
    const [studentSearch, setStudentSearch] = React.useState('');
    const [enrolledSearch, setEnrolledSearch] = React.useState('');
    const [selectedStudents, setSelectedStudents] = React.useState([]);
    const flash = usePage().props.flash;

    const filteredEnrolled = activity.enrollments.filter(e => 
        e.student.user.name.toLowerCase().includes(enrolledSearch.toLowerCase()) || 
        e.student.student_id.toLowerCase().includes(enrolledSearch.toLowerCase())
    );

    const filteredAvailable = availableStudents.filter(s => 
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
        s.student_id.toLowerCase().includes(studentSearch.toLowerCase())
    );

    const toggleStudent = (id) => {
        if (selectedStudents.includes(id)) {
            setSelectedStudents(selectedStudents.filter(sid => sid !== id));
        } else {
            setSelectedStudents([...selectedStudents, id]);
        }
    };

    const handleBulkAdd = () => {
        if (selectedStudents.length === 0) return;
        router.post(route('activities.students.bulk', activity.id), {
            student_ids: selectedStudents
        }, {
            onSuccess: () => {
                setIsAddModalOpen(false);
                setSelectedStudents([]);
            }
        });
    };

    const handleRemoveStudent = (enrollment) => {
        setEnrollmentToRemove(enrollment);
        setIsRemoveModalOpen(true);
    };

    const confirmRemove = () => {
        if (!enrollmentToRemove) return;
        router.delete(route('activities.enrollments.destroy', [activity.id, enrollmentToRemove.id]), {
            onSuccess: () => {
                setIsRemoveModalOpen(false);
                setEnrollmentToRemove(null);
            }
        });
    };

    return (
        <AppLayout title={activity.name} noPadding>
            <style>{css}</style>
            
            {/* Flash Messages */}
            <div className="fixed top-6 right-6 z-[100] space-y-3 pointer-events-none">
                {flash.success && (
                    <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-right-10 flex items-center gap-3 pointer-events-auto border border-emerald-400/20">
                        <CheckCircle size={18} />
                        <span className="text-[13px] font-bold">{flash.success}</span>
                    </div>
                )}
                {flash.error && (
                    <div className="bg-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-right-10 flex items-center gap-3 pointer-events-auto border border-red-400/20">
                        <X size={18} />
                        <span className="text-[13px] font-bold">{flash.error}</span>
                    </div>
                )}
            </div>

            <div className="ac-detail-root">
                <div className="ac-detail-grid" />
                <div className="ac-detail-content">
                    <Link href={route('activities.index')} className="ac-back hover:opacity-70 transition-opacity">
                        <ChevronLeft size={14} /> Back to Catalog
                    </Link>

                    {/* Header */}
                    <div className="ac-header-card shadow-2xl">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-2">
                                <span className="ac-badge px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-[9px] font-black uppercase text-orange-500 tracking-widest">{activity.type}</span>
                                <span className="ac-badge px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase text-white/40 tracking-widest">{activity.category}</span>
                            </div>
                            <div className="text-[11px] font-mono font-bold text-orange-500 bg-orange-500/10 px-3 py-1 rounded-lg">
                                +{activity.points} ENGAGEMENT POINTS
                            </div>
                        </div>

                        <h1 className="ac-title">{activity.name}</h1>
                        <p className="ac-desc">{activity.description || 'No detailed description available for this activity.'}</p>
                        
                        <div className="grid grid-cols-4 gap-8 mt-10 pt-10 border-t border-white/5">
                            <div>
                                <div className="ac-label">Status</div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-2 h-2 rounded-full ${activity.status === 'active' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                                    <span className="text-[13px] font-bold uppercase tracking-wider">{activity.status}</span>
                                </div>
                            </div>
                            <div>
                                <div className="ac-label">Advisor</div>
                                <div className="text-[13px] font-bold mt-1 text-white/80">{activity.advisor?.name || 'N/A'}</div>
                            </div>
                            <div>
                                <div className="ac-label">Timeline</div>
                                <div className="text-[13px] font-bold mt-1 text-white/80">
                                    {activity.start_date ? new Date(activity.start_date).toLocaleDateString() : 'Continuous'}
                                </div>
                            </div>
                            <div>
                                <div className="ac-label">Capacity</div>
                                <div className="text-[13px] font-bold mt-1 text-white/80">{activity.enrollments.length} / {activity.max_slots || '∞'} Students</div>
                            </div>
                        </div>
                    </div>

                    {/* Student Management Section */}
                    <div className="mt-12">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="ac-section-title">
                                    Enrolled <span>Students</span>
                                </h2>
                                <div className="flex items-center gap-6">
                                    <p className="text-[13px] text-white/20 uppercase tracking-widest font-black flex items-center gap-2">
                                        <Users size={14} className="text-orange-500" />
                                        Total Participants: {activity.enrollments.length}
                                    </p>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/10" size={12} />
                                        <input 
                                            className="bg-white/5 border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-[11px] text-white/60 outline-none focus:border-orange-500/50 transition-all w-48"
                                            placeholder="Filter enrolled..."
                                            value={enrolledSearch}
                                            onChange={e => setEnrolledSearch(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            {userRole === 'dean' && (
                                <button 
                                    onClick={() => {
                                        setIsAddModalOpen(true);
                                        setStudentSearch('');
                                        setSelectedStudents([]);
                                    }}
                                    className="px-6 py-3 rounded-2xl bg-orange-500 text-white text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-orange-500/20"
                                >
                                    <UserPlus size={16} /> Add Students
                                </button>
                            )}
                        </div>

                        {filteredEnrolled.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {filteredEnrolled.map((enrollment) => (
                                    <div key={enrollment.id} className="student-card group">
                                        <div className="avatar">
                                            {enrollment.student.user.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[10px] font-mono text-orange-500 font-bold mb-0.5">{enrollment.student.student_id}</div>
                                            <div className="text-[15px] font-bold text-white/90">{enrollment.student.user.name}</div>
                                            <div className="text-[11px] text-white/20 mt-0.5 uppercase tracking-wider font-bold">Joined: {new Date(enrollment.created_at).toLocaleDateString()}</div>
                                        </div>
                                        {userRole === 'dean' && (
                                            <button 
                                                onClick={() => handleRemoveStudent(enrollment)}
                                                className="p-3 rounded-xl bg-red-500/5 text-red-500/20 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01]">
                                <Users size={48} className="text-white/5 mx-auto mb-6" />
                                <h3 className="text-xl font-bold text-white/20 italic">No Students Enrolled</h3>
                                <p className="text-[11px] text-white/10 uppercase tracking-widest mt-2 font-bold">Start by adding students to this activity catalog</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Students Modal */}
            <Modal show={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} maxWidth="2xl">
                <div className="bg-[#160e08] border border-[#2a1508] rounded-[32px] overflow-hidden flex flex-col max-h-[85vh]">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-orange-500/10 to-transparent">
                        <div>
                            <div className="ac-label text-orange-500">Student Recruitment</div>
                            <h3 className="font-serif text-2xl font-black italic text-white leading-tight">Add Students to Catalog</h3>
                        </div>
                        <button onClick={() => setIsAddModalOpen(false)} className="text-white/20 hover:text-white p-2 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-8 border-b border-white/5">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input 
                                className="search-input"
                                placeholder="Search students by name or ID number..."
                                value={studentSearch}
                                onChange={e => setStudentSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 pt-0 custom-scrollbar">
                        <div className="mt-6">
                            <div className="ac-label mb-4">Available Students ({filteredAvailable.length})</div>
                            {filteredAvailable.length > 0 ? filteredAvailable.map(student => (
                                <div 
                                    key={student.id} 
                                    className="student-list-item cursor-pointer"
                                    onClick={() => toggleStudent(student.id)}
                                >
                                    <div className={`checkbox-custom ${selectedStudents.includes(student.id) ? 'checked' : ''}`}>
                                        {selectedStudents.includes(student.id) && <Check size={14} className="text-white" />}
                                    </div>
                                    <div className="avatar !w-10 !h-10 !text-sm">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-[13px] font-bold text-white/80">{student.name}</div>
                                        <div className="text-[10px] font-mono text-white/20">{student.student_id} · {student.email}</div>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-12 text-center opacity-20">
                                    <Search size={32} className="mx-auto mb-4" />
                                    <div className="text-sm italic">No students found matching your search.</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-8 bg-[#1a110a] border-t border-white/5 flex items-center justify-between">
                        <div className="text-[11px] font-bold text-white/40 uppercase tracking-widest">
                            <span className="text-orange-500">{selectedStudents.length}</span> Students Selected
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setIsAddModalOpen(false)}
                                className="px-6 py-3 rounded-xl bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-white/10"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleBulkAdd}
                                disabled={selectedStudents.length === 0}
                                className="px-8 py-3 rounded-xl bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                            >
                                Confirm Add
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Remove Confirmation Modal */}
            <Modal show={isRemoveModalOpen} onClose={() => setIsRemoveModalOpen(false)} maxWidth="md">
                <div className="bg-[#160e08] border border-red-500/20 rounded-[32px] overflow-hidden p-10 text-center relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/5 blur-[80px] rounded-full pointer-events-none" />
                    
                    <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-8 animate-bounce-subtle">
                        <Trash2 size={32} />
                    </div>

                    <div className="ac-label text-red-500 mb-2">Security Confirmation</div>
                    <h3 className="font-serif text-3xl font-black italic text-white mb-4">Remove Student?</h3>
                    <p className="text-[14px] text-white/40 leading-relaxed mb-10 max-w-sm mx-auto">
                        Are you sure you want to remove <span className="text-white font-bold">{enrollmentToRemove?.student?.user?.name}</span> from <span className="text-white font-bold">{activity.name}</span>? This action can be undone later by re-adding the student.
                    </p>

                    <div className="flex gap-4">
                        <button 
                            onClick={() => setIsRemoveModalOpen(false)}
                            className="flex-1 py-4 rounded-2xl bg-white/5 text-white/40 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
                        >
                            Nevermind
                        </button>
                        <button 
                            onClick={confirmRemove}
                            className="flex-1 py-4 rounded-2xl bg-red-500 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-red-500/20"
                        >
                            Confirm Removal
                        </button>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}
