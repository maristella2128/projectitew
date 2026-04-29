import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import {
    LayoutGrid, ChevronRight, Users, User, FileText,
    Upload, Trash2, Eye, Calendar, ArrowLeft,
    Search, Activity, ShieldCheck, Heart, AlertCircle,
    Download, Clock, ExternalLink, X, Layers
} from 'lucide-react';
import axios from 'axios';
import Modal from '@/Components/Modal';

/* ─────────────────────────────────────
   STYLES (Hierarchical Premium Theme)
───────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,900&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');

.hd-root {
  background: #0c0805; min-height: 100%; flex: 1; display: flex; flex-direction: column;
  font-family: 'DM Sans', sans-serif; color: #fef3ec; padding: 28px 32px 56px; position: relative;
}
.hd-grid-bg {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image: linear-gradient(rgba(249,115,22,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.02) 1px, transparent 1px);
  background-size: 48px 48px;
}
.hd-content { position: relative; z-index: 1; max-width: 1400px; margin: 0 auto; width: 100%; }

.hd-title { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 900; color: #fef3ec; line-height: 1.1; }
.hd-title em { color: #f97316; font-style: italic; }

.hd-breadcrumb { display: flex; align-items: center; gap: 8px; margin-bottom: 32px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.3); }
.hd-breadcrumb-item { cursor: pointer; transition: color 0.2s; }
.hd-breadcrumb-item:hover { color: #f97316; }
.hd-breadcrumb-item.active { color: #fff; pointer-events: none; }

.hd-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }

.hd-card {
  background: linear-gradient(165deg, rgba(28, 18, 10, 0.8) 0%, rgba(12, 8, 5, 0.9) 100%);
  backdrop-filter: blur(20px); border: 1px solid rgba(254,243,236,0.05); border-radius: 24px; padding: 32px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; overflow: hidden;
  text-align: left; cursor: default;
}
.hd-card::before {
  content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 2px;
  background: linear-gradient(90deg, transparent, rgba(249,115,22,0.8), transparent); opacity: 0; transition: opacity 0.4s;
}
.hd-card:hover::before { opacity: 1; }
.hd-card:hover { transform: translateY(-4px); border-color: rgba(249,115,22,0.2); box-shadow: 0 20px 40px rgba(0,0,0,0.5); }

.hd-card-title {
  font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 900; color: #fef3ec;
  font-style: italic; letter-spacing: -0.02em; margin-bottom: 8px; line-height: 1;
}
.hd-card-subtitle {
  font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 800; color: rgba(254,243,236,0.4);
  text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 24px;
}

.hd-badge {
  display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 100px;
  font-family: 'DM Sans', sans-serif; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;
}
.hd-badge-orange { background: rgba(249,115,22,0.1); color: #f97316; border: 1px solid rgba(249,115,22,0.2); }
.hd-badge-green { background: rgba(16,185,129,0.1); color: #34d399; border: 1px solid rgba(16,185,129,0.2); }
.hd-badge-blue { background: rgba(59,130,246,0.1); color: #60a5fa; border: 1px solid rgba(59,130,246,0.2); }

.hd-btn-secondary {
  background: rgba(254,243,236,0.03); border: 1px solid rgba(254,243,236,0.1); color: rgba(254,243,236,0.6);
  padding: 12px 24px; border-radius: 12px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;
  display: flex; align-items: center; justify-content: space-between; transition: all 0.3s;
  width: 100%; cursor: pointer; margin-top: 24px;
}
.hd-btn-secondary:hover { background: rgba(249,115,22,0.1); border-color: rgba(249,115,22,0.3); color: #f97316; }

.hd-profile-root { display: grid; grid-template-columns: 350px 1fr; gap: 32px; }
.hd-profile-sidebar { background: #160e08; border: 1px solid #2a1508; border-radius: 32px; padding: 32px; height: fit-content; }
.hd-profile-main { display: flex; flex-direction: column; gap: 24px; }

.hd-doc-card {
  background: #1c1208; border: 1px solid #2a1508; border-radius: 20px; padding: 16px;
  display: flex; align-items: center; justify-content: space-between; transition: all 0.2s;
}
.hd-doc-card:hover { border-color: rgba(29,158,117,0.4); background: #1f140c; }

.hd-btn-upload {
  background: linear-gradient(135deg, #f97316, #d85a30); color: #fff; padding: 12px 24px; border-radius: 16px;
  font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em;
  display: flex; align-items: center; gap: 8px; transition: all 0.3s;
}
.hd-btn-upload:hover { transform: scale(1.02); box-shadow: 0 8px 20px rgba(249,115,22,0.3); }

.he-input-file { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

.hd-table-container { background: #160e08; border: 1px solid #2a1508; border-radius: 24px; overflow: hidden; margin-top: 24px; }
.hd-table-header { display: grid; grid-template-columns: 2.5fr 1fr 1fr 1fr 1fr 0.5fr; gap: 16px; padding: 16px 24px; background: rgba(249,115,22,0.05); border-bottom: 1px solid #2a1508; text-transform: uppercase; font-size: 10px; font-weight: 800; color: rgba(249,115,22,0.6); letter-spacing: 0.1em; }
.hd-table-row { display: grid; grid-template-columns: 2.5fr 1fr 1fr 1fr 1fr 0.5fr; gap: 16px; padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.02); transition: all 0.2s; align-items: center; }
.hd-table-row:hover { background: rgba(255,255,255,0.02); }
.hd-table-row:last-child { border-bottom: none; }
.hd-status-badge { padding: 4px 10px; border-radius: 8px; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; display: inline-flex; align-items: center; gap: 4px; }
.hd-status-enrolled { background: rgba(29,158,117,0.1); color: #1d9e75; border: 1px solid rgba(29,158,117,0.2); }
.hd-status-record { background: rgba(249,115,22,0.1); color: #f97316; border: 1px solid rgba(249,115,22,0.2); }
.hd-status-norecord { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.4); border: 1px solid rgba(255,255,255,0.1); }

.hd-filter-btn { padding: 10px 16px; border-radius: 12px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.2s; border: 1px solid transparent; }
.hd-filter-btn.active { background: rgba(249,115,22,0.1); color: #f97316; border-color: rgba(249,115,22,0.3); }
.hd-filter-btn.inactive { background: #160e08; color: rgba(255,255,255,0.4); border-color: rgba(255,255,255,0.05); }
.hd-filter-btn.inactive:hover { background: rgba(255,255,255,0.05); color: #fff; }
`;

export default function HealthDirectory({ programs }) {
    const [view, setView] = useState('programs'); // programs, sections, students, profile
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const [sections, setSections] = useState([]);
    const [students, setStudents] = useState([]);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    // Search & Filtering
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, has_record, no_record

    // Fetch Sections
    const handleProgramClick = async (program) => {
        setLoading(true);
        setSelectedProgram(program);
        try {
            const res = await axios.get(`/api/health/programs/${program.id}/sections`);
            setSections(res.data);
            setView('sections');
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    // Fetch Students
    const handleSectionClick = async (section) => {
        setLoading(true);
        setSelectedSection(section);
        try {
            const res = await axios.get(`/api/health/sections/${section.id}/students`);
            setStudents(res.data);
            setView('students');
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    // Fetch Student Profile
    const handleStudentClick = async (student) => {
        setLoading(true);
        setSelectedStudent(student);
        try {
            const res = await axios.get(`/api/health/students/${student.id}/profile`);
            setProfileData(res.data);
            setView('profile');
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const handleBack = () => {
        if (view === 'profile') setView('students');
        else if (view === 'students') { setView('sections'); setSearchQuery(''); setFilterStatus('all'); }
        else if (view === 'sections') setView('programs');
    };

    // Document Management
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post(`/api/health/students/${selectedStudent.id}/documents`, formData);
            setProfileData(prev => ({
                ...prev,
                documents: [res.data, ...prev.documents]
            }));
        } catch (err) { setUploadError('Upload failed. Ensure file is under 50MB and is a PDF or Image.'); }
    };

    const handleDeleteDoc = async (docId) => {
        if (!confirm('Are you sure you want to delete this medical record?')) return;
        try {
            await axios.delete(`/api/health/documents/${docId}`);
            setProfileData(prev => ({
                ...prev,
                documents: prev.documents.filter(d => d.id !== docId)
            }));
        } catch (err) { console.error(err); }
    };

    const filteredStudents = students.filter(s => {
        const matchesSearch = s.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.student_id.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesFilter = true;
        if (filterStatus === 'has_record') matchesFilter = s.has_medical_record > 0;
        if (filterStatus === 'no_record') matchesFilter = s.has_medical_record === 0;

        return matchesSearch && matchesFilter;
    });

    return (
        <AppLayout title="Health Directory" noPadding>
            <style>{css}</style>
            <div className="hd-root">
                <div className="hd-grid-bg" />
                <div className="hd-content">

                    {/* Header */}
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-8 h-[1px] bg-orange-500/50" />
                                <span className="font-mono text-[10px] text-orange-500 tracking-[0.4em] uppercase">Administrative Portal</span>
                            </div>
                            <h1 className="hd-title">
                                Health <em>Directory</em>
                            </h1>
                            <p className="font-mono text-[10px] text-white/40 mt-4 font-bold uppercase tracking-[0.1em]">
                                College of Computing Studies — Clinical Registry Center
                            </p>
                        </div>
                        {view !== 'programs' && (
                            <button onClick={handleBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-400 transition-colors">
                                <ArrowLeft size={14} /> Back to {view === 'profile' ? 'List' : view === 'students' ? 'Sections' : 'Programs'}
                            </button>
                        )}
                    </div>

                    {/* Breadcrumbs */}
                    <div className="hd-breadcrumb">
                        <span className={`hd-breadcrumb-item ${view === 'programs' ? 'active' : ''}`} onClick={() => setView('programs')}>Programs</span>
                        {selectedProgram && (
                            <>
                                <ChevronRight size={12} />
                                <span className={`hd-breadcrumb-item ${view === 'sections' ? 'active' : ''}`} onClick={() => setView('sections')}>{selectedProgram.code}</span>
                            </>
                        )}
                        {selectedSection && view !== 'sections' && (
                            <>
                                <ChevronRight size={12} />
                                <span className={`hd-breadcrumb-item ${view === 'students' ? 'active' : ''}`} onClick={() => setView('students')}>{selectedSection.name}</span>
                            </>
                        )}
                        {selectedStudent && view === 'profile' && (
                            <>
                                <ChevronRight size={12} />
                                <span className="hd-breadcrumb-item active">{selectedStudent.user.name}</span>
                            </>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-40">
                            <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* View: Programs */}
                            {view === 'programs' && (
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-6">Programs</h4>
                                    <div className="hd-card-grid">
                                        {programs.map(p => (
                                            <div key={p.id} className="hd-card">
                                                <h2 className="hd-card-title">{p.code}</h2>
                                                <p className="hd-card-subtitle">{p.name}</p>
                                                <div className="flex gap-2 flex-wrap mb-6">
                                                    <span className="hd-badge hd-badge-orange"><LayoutGrid size={12} /> {p.sections_count} SECTIONS</span>
                                                    <span className="hd-badge hd-badge-green"><Users size={12} /> {p.students_count || 0} STUDENTS</span>
                                                    <span className="hd-badge hd-badge-blue">CCS</span>
                                                </div>
                                                <div className="w-full h-1 bg-white/5 rounded-full mb-6">
                                                    <div className="h-full bg-orange-500 rounded-full" style={{ width: p.sections_count > 0 ? '100%' : '10%' }}></div>
                                                </div>
                                                <button className="hd-btn-secondary group" onClick={() => handleProgramClick(p)}>
                                                    VIEW PROGRAM SECTIONS <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* View: Sections */}
                            {view === 'sections' && (
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-6">{selectedProgram.code} Sections</h4>
                                    <div className="hd-card-grid">
                                        {sections.length > 0 ? sections.map(s => (
                                            <div key={s.id} className="hd-card">
                                                <h2 className="hd-card-title">{s.name}</h2>
                                                <p className="hd-card-subtitle">YEAR {s.grade_level} SECTION</p>
                                                <div className="flex gap-2 flex-wrap mb-6">
                                                    <span className="hd-badge hd-badge-green"><Users size={12} /> {s.students_count || 0} STUDENTS</span>
                                                    <span className="hd-badge hd-badge-blue">ACTIVE</span>
                                                </div>
                                                <div className="w-full h-1 bg-white/5 rounded-full mb-6">
                                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: s.students_count > 0 ? '100%' : '10%' }}></div>
                                                </div>
                                                <button className="hd-btn-secondary group" onClick={() => handleSectionClick(s)}>
                                                    VIEW HEALTH RECORDS <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        )) : (
                                            <EmptyState message="No sections found in this program." />
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* View: Students (Enhanced Table View) */}
                            {view === 'students' && (
                                <div>
                                    <div className="flex flex-col md:flex-row justify-between gap-4 items-center bg-[#160e08] p-4 border border-white/5 rounded-2xl mb-6">
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <div className="relative w-full md:w-80">
                                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                                <input
                                                    type="text"
                                                    placeholder="Search student name or ID..."
                                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 transition-colors"
                                                    value={searchQuery}
                                                    onChange={e => setSearchQuery(e.target.value)}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-white/30 whitespace-nowrap">{filteredStudents.length} results</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => setFilterStatus('all')} className={`hd-filter-btn ${filterStatus === 'all' ? 'active' : 'inactive'}`}>All Students</button>
                                            <button onClick={() => setFilterStatus('has_record')} className={`hd-filter-btn ${filterStatus === 'has_record' ? 'active' : 'inactive'}`}>With Record</button>
                                            <button onClick={() => setFilterStatus('no_record')} className={`hd-filter-btn ${filterStatus === 'no_record' ? 'active' : 'inactive'}`}>No Record</button>
                                        </div>
                                    </div>

                                    {filteredStudents.length > 0 ? (
                                        <div className="hd-table-container">
                                            <div className="hd-table-header">
                                                <div>Student Info</div>
                                                <div>LRN / ID</div>
                                                <div>Year & Section</div>
                                                <div>Status</div>
                                                <div>Medical Record</div>
                                                <div className="text-right">Actions</div>
                                            </div>
                                            {filteredStudents.map(s => (
                                                <div key={s.id} className="hd-table-row">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 overflow-hidden shrink-0">
                                                            {s.photo ? <img src={`/storage/${s.photo}`} className="w-full h-full object-cover" /> : <User size={20} />}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-bold text-white truncate">{s.user.name}</div>
                                                            <div className="text-[10px] text-white/40 truncate">{s.user.email}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs font-mono font-bold text-orange-500/80">{s.student_id}</div>
                                                    <div className="text-xs font-bold text-white/70">
                                                        <span className="text-orange-500">Year {selectedSection?.grade_level}</span><br />
                                                        <span className="text-[10px] text-white/30 uppercase">{selectedSection?.name}</span>
                                                    </div>
                                                    <div>
                                                        <span className="hd-status-badge hd-status-enrolled"><span className="w-1.5 h-1.5 rounded-full bg-[#1d9e75]"></span> Enrolled</span>
                                                    </div>
                                                    <div>
                                                        {s.has_medical_record > 0 ? (
                                                            <span className="hd-status-badge hd-status-record"><FileText size={10} /> Has File ({s.has_medical_record})</span>
                                                        ) : (
                                                            <span className="hd-status-badge hd-status-norecord">No File</span>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <button onClick={() => handleStudentClick(s)} className="p-2 rounded-lg bg-white/[0.03] text-white/40 hover:text-white hover:bg-white/10 transition-colors" title="View Profile">
                                                            <Eye size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState message="No students found matching the criteria." />
                                    )}
                                </div>
                            )}

                            {/* View: Profile */}
                            {view === 'profile' && profileData && (
                                <div className="hd-profile-root">
                                    {/* Sidebar: Personal Info */}
                                    <div className="hd-profile-sidebar">
                                        <div className="flex flex-col items-center text-center mb-8">
                                            <div className="w-32 h-32 rounded-[40px] bg-white/[0.03] border border-white/5 flex items-center justify-center text-orange-500 mb-6 overflow-hidden">
                                                {profileData.student.photo ? <img src={`/storage/${profileData.student.photo}`} className="w-full h-full object-cover" /> : <User size={64} />}
                                            </div>
                                            <h2 className="text-2xl font-black text-white">{profileData.student.user.name}</h2>
                                            <p className="text-[11px] font-mono font-bold text-orange-500/60 mt-1 uppercase tracking-widest">{profileData.student.student_id}</p>
                                        </div>

                                        <div className="space-y-6">
                                            <InfoItem label="Program" value={profileData.student.section.program.name} />
                                            <InfoItem label="Section" value={profileData.student.section.name} />
                                            <InfoItem label="Gender" value={profileData.student.gender} />
                                            <InfoItem label="Birthdate" value={profileData.student.birthdate} />
                                            <InfoItem label="Contact" value={profileData.student.guardian_contact} />
                                        </div>
                                    </div>

                                    {/* Main: Medical Records */}
                                    <div className="hd-profile-main">
                                        <div className="bg-[#160e08] border border-white/5 rounded-[32px] p-8">
                                            <div className="flex justify-between items-center mb-8">
                                                <div>
                                                    <h3 className="font-serif text-2xl font-black italic text-white flex items-center gap-3">
                                                        <Heart size={24} className="text-orange-500" />
                                                        Medical Records
                                                    </h3>
                                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Official Student Health Documentation</p>
                                                </div>
                                                <div className="relative">
                                                    <button className="hd-btn-upload">
                                                        <Upload size={14} /> Upload Record
                                                        <input type="file" className="he-input-file" onChange={handleFileUpload} accept=".pdf,image/*" />
                                                    </button>
                                                </div>
                                            </div>

                                            {profileData.documents.length > 0 ? (
                                                <div className="space-y-3">
                                                    {profileData.documents.map(doc => (
                                                        <div key={doc.id} className="hd-doc-card">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-white/40">
                                                                    <FileText size={20} />
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-bold text-white">{doc.file_name}</div>
                                                                    <div className="text-[10px] text-white/20 font-bold uppercase tracking-wider">
                                                                        {(doc.file_size / 1024 / 1024).toFixed(2)} MB · {new Date(doc.created_at).toLocaleDateString()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <a href={`/storage/${doc.file_path}`} target="_blank" className="p-2 rounded-lg bg-white/[0.03] text-white/40 hover:text-white transition-colors">
                                                                    <Eye size={16} />
                                                                </a>
                                                                <button onClick={() => handleDeleteDoc(doc.id)} className="p-2 rounded-lg bg-red-500/10 text-red-500/50 hover:text-red-500 transition-colors">
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="py-20 text-center border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                                                    <ShieldCheck size={40} className="text-white/5 mx-auto mb-4" />
                                                    <div className="text-sm font-bold text-white/20 italic">No medical records uploaded yet.</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Clinical Audit (Mini View) */}
                                        <div className="bg-[#160e08] border border-white/5 rounded-[32px] p-8 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-6">Recent Clinical Entries</h4>
                                            {profileData.student.health_records?.length > 0 ? (
                                                <div className="space-y-4">
                                                    {profileData.student.health_records.slice(0, 3).map(hr => (
                                                        <div key={hr.id} className="flex justify-between items-center text-sm border-b border-white/[0.03] pb-3">
                                                            <div>
                                                                <span className="text-orange-500 font-bold uppercase text-[10px] mr-3">{hr.record_type}</span>
                                                                <span className="text-white/60">{hr.notes || 'No description'}</span>
                                                            </div>
                                                            <span className="text-[10px] font-mono text-white/20">{hr.record_date}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-[10px] font-bold text-white/10 uppercase tracking-widest italic text-center py-4">No recent clinical activity.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                </div>
            </div>

            <Modal show={!!uploadError} onClose={() => setUploadError('')} maxWidth="sm">
                <div className="p-6 bg-[#160e08] border border-white/5">
                    <div className="flex items-center gap-4 text-red-500 mb-4">
                        <AlertCircle size={24} />
                        <h3 className="text-lg font-bold">Upload Error</h3>
                    </div>
                    <p className="text-sm text-white/70 mb-6">{uploadError}</p>
                    <div className="flex justify-end">
                        <button onClick={() => setUploadError('')} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}

function InfoItem({ label, value }) {
    return (
        <div>
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">{label}</div>
            <div className="text-sm font-bold text-white/70 italic">{value || 'N/A'}</div>
        </div>
    );
}

function EmptyState({ message }) {
    return (
        <div className="col-span-full py-40 text-center border border-dashed border-white/10 rounded-[40px] bg-white/[0.01]">
            <AlertCircle size={48} className="text-white/5 mx-auto mb-6" />
            <div className="text-lg font-serif italic text-white/20 font-bold">{message}</div>
        </div>
    );
}
