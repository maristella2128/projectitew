import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm, router, usePage } from '@inertiajs/react';
import { 
    Heart, Plus, Save, X, User, 
    Calendar, Clipboard, Search,
    History, Activity, Stethoscope,
    Layers, ShieldCheck, Thermometer,
    ArrowRight, Filter, Download, Trash2, Edit2,
    Users, AlertCircle, FileText, CheckCircle
} from 'lucide-react';
import Modal from '@/Components/Modal';
import { RECORD_TYPE, STATUS_COLORS } from '@/constants/healthColors';

/* ─────────────────────────────────────
   STYLES (Dashboard Premium Theme)
   Extended for 6 record types
───────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,900&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');

.he-root {
  background: #0c0805;
  min-height: 100%;
  flex: 1; display: flex; flex-direction: column;
  font-family: 'DM Sans', system-ui, sans-serif;
  color: #fef3ec;
  padding: 28px 32px 56px;
  position: relative;
}
.he-grid {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    linear-gradient(rgba(249,115,22,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(249,115,22,0.02) 1px, transparent 1px);
  background-size: 48px 48px;
}
.he-content { position: relative; z-index: 1; max-width: 1300px; margin: 0 auto; width: 100%; }

.he-title {
  font-family: 'Playfair Display', serif;
  font-size: 36px; font-weight: 900; color: #fef3ec;
  line-height: 1.0; letter-spacing: -.02em;
}
.he-title em { color: #f97316; font-style: italic; display: block; }
.he-sub { font-size: 11px; color: rgba(254,243,236,0.25); margin-top: 8px; font-style: italic; }

.hr-stats {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px;
}
.stat-card {
  background: #160e08; border: 1px solid #2a1508; border-radius: 20px;
  padding: 20px; position: relative; overflow: hidden;
}
.stat-value { font-size: 24px; font-weight: 900; color: #fff; margin-bottom: 4px; }
.stat-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.2); text-transform: uppercase; letter-spacing: 0.1em; }

.he-filters { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 32px; }
.he-filter-box {
  background: #160e08; border: 1px solid #2a1508;
  border-radius: 14px; padding: 10px 14px;
  display: flex; align-items: center; gap: 8px;
}
.he-select, .he-date-input {
  flex: 1; background: transparent; border: none; outline: none;
  font-size: 12px; font-weight: 500; color: #fef3ec;
}
.he-select option { background: #1c1208; color: #fef3ec; }

.he-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 20px; }

.hr-card {
  background: #160e08; border: 1px solid #2a1508; border-radius: 24px;
  position: relative; overflow: hidden; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.hr-card:hover { transform: translateY(-4px); border-color: rgba(249,115,22,0.3); box-shadow: 0 12px 30px rgba(0,0,0,0.4); }
.hr-card-bar { height: 4px; width: 100%; }
.hr-card-body { padding: 24px; }

.hr-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.hr-type-badge { padding: 4px 10px; border-radius: 8px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
.hr-status-badge { font-size: 10px; font-weight: 700; display: flex; align-items: center; gap: 6px; }
.hr-status-badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

.hr-student-name { font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 2px; }
.hr-student-id { font-family: 'Space Mono', monospace; font-size: 11px; color: rgba(249,115,22,0.6); margin-bottom: 16px; }
.hr-summary { font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.5; margin-bottom: 16px; min-height: 40px; }
.hr-date { font-size: 11px; color: rgba(255,255,255,0.2); font-weight: 600; }

.hr-card-footer {
  padding: 16px 24px; border-top: 1px solid #2a1508;
  display: flex; justify-content: space-between; align-items: center;
  background: rgba(255,255,255,0.01);
}
.hr-creator { font-size: 10px; color: rgba(255,255,255,0.2); font-weight: 600; }
.hr-actions { display: flex; gap: 8px; }

.hr-btn-icon {
  width: 32px; height: 32px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.3); transition: all 0.2s;
}
.hr-btn-icon:hover { background: rgba(255,255,255,0.08); color: #fff; }
.hr-btn-pdf {
  padding: 0 12px; height: 32px; border-radius: 10px;
  display: flex; align-items: center; gap: 6px;
  background: rgba(29,158,117,0.1); border: 1px solid rgba(29,158,117,0.2);
  color: #1D9E75; font-size: 10px; font-weight: 900; text-transform: uppercase;
}

.he-modal { background: #120c08; border-radius: 32px; overflow: hidden; border: 1px solid #2a1508; }
.he-input, .he-textarea {
  width: 100%; background: #0c0805; border: 1px solid #2a1508;
  border-radius: 14px; padding: 12px 16px; color: #fff; font-size: 13px;
  outline: none; transition: border-color 0.2s;
}
.he-input:focus { border-color: #f97316; }

.he-label { font-size: 10px; font-weight: 800; color: rgba(255,255,255,0.2); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px; display: block; }
`;

function StatCard({ label, value, color }) {
    return (
        <div className="stat-card">
            <div className="absolute top-0 right-0 p-4 opacity-5" style={{ color }}>
                <Activity size={48} />
            </div>
            <div className="stat-value" style={{ color }}>{value}</div>
            <div className="stat-label">{label}</div>
        </div>
    );
}

function RecordCard({ record, userRole }) {
    const type = RECORD_TYPE[record.record_type] || RECORD_TYPE.consultation;
    const status = STATUS_COLORS[record.status] || STATUS_COLORS.active;

    const getSummary = (r) => {
        switch(r.record_type) {
            case 'consultation':        return r.consultation?.chief_complaint;
            case 'medical_certificate': return `${r.certificate?.certificate_type?.replace(/_/g,' ')} · ${r.certificate?.issued_by}`;
            case 'immunization':        return `${r.immunization?.vaccine_name} · ${r.immunization?.dose_number} dose`;
            case 'incident':            return `${r.incident?.incident_type?.replace(/_/g,' ')} · ${r.incident?.severity}`;
            case 'health_screening':    return `${r.screening?.school_year} ${r.screening?.semester} sem · ${r.screening?.clearance_status}`;
            case 'allergy_condition':   return `${r.allergy?.allergen} · ${r.allergy?.severity}`;
            default: return r.notes;
        }
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to remove this record?')) {
            router.delete(route('health.destroy', record.id));
        }
    };

    return (
        <div className="hr-card group">
            <div className="hr-card-bar" style={{ background: type.color }} />
            <div className="hr-card-body">
                <div className="hr-card-top">
                    <span className="hr-type-badge" style={{ color: type.color, background: type.bg }}>
                        {type.label}
                    </span>
                    <span className="hr-status-badge" style={{ color: status.color }}>
                        {status.label}
                    </span>
                </div>
                <div className="hr-student-name">
                    {record.student.user.name}
                </div>
                <div className="hr-student-id">{record.student.student_id}</div>
                <div className="hr-summary">{getSummary(record)}</div>
                <div className="hr-date">
                    <Calendar size={12} className="inline mr-1 opacity-50" />
                    {record.record_date}
                </div>
            </div>
            <div className="hr-card-footer">
                <span className="hr-creator">By {record.creator.name}</span>
                <div className="hr-actions">
                    {record.record_type === 'medical_certificate' && (
                        <a href={route('health.certificate.pdf', record.id)}
                           target="_blank" className="hr-btn-pdf hover:scale-105 transition-transform">
                            <Download size={14} /> PDF
                        </a>
                    )}
                    {userRole === 'dean' && (
                        <>
                            <button onClick={handleDelete} className="hr-btn-icon text-red-500/50 hover:text-red-500 hover:bg-red-500/10">
                                <Trash2 size={14} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function HealthIndex({ records, students, stats, userRole, filters }) {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        student_id: '',
        record_type: 'consultation',
        status: 'active',
        academic_block: '',
        notes: '',
        record_date: new Date().toISOString().split('T')[0],
        follow_up_date: '',
        detail: {},
    });

    const handleFilter = (key, value) => {
        router.get(route('health.index'), { ...filters, [key]: value }, { preserveState: true });
    };

    const handleTypeChange = (type) => {
        setData(prev => ({ ...prev, record_type: type, detail: {} }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('health.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const renderDynamicFields = () => {
        const updateDetail = (key, val) => {
            setData('detail', { ...data.detail, [key]: val });
        };

        switch(data.record_type) {
            case 'consultation':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="he-label">Chief Complaint</label>
                            <input className="he-input" value={data.detail.chief_complaint || ''} onChange={e => updateDetail('chief_complaint', e.target.value)} placeholder="Main reason for visit..." />
                        </div>
                        <div className="col-span-2">
                            <label className="he-label">Symptoms</label>
                            <textarea className="he-input h-20" value={data.detail.symptoms || ''} onChange={e => updateDetail('symptoms', e.target.value)} placeholder="Specific symptoms observed..." />
                        </div>
                        <div>
                            <label className="he-label">Diagnosis</label>
                            <input className="he-input" value={data.detail.diagnosis || ''} onChange={e => updateDetail('diagnosis', e.target.value)} />
                        </div>
                        <div>
                            <label className="he-label">Attending Physician</label>
                            <input className="he-input" value={data.detail.attending_physician || ''} onChange={e => updateDetail('attending_physician', e.target.value)} />
                        </div>
                    </div>
                );
            case 'medical_certificate':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="he-label">Certificate Type</label>
                            <select className="he-input" value={data.detail.certificate_type || ''} onChange={e => updateDetail('certificate_type', e.target.value)}>
                                <option value="">Select type...</option>
                                <option value="sick_leave">Sick Leave</option>
                                <option value="fit_to_return">Fit to Return</option>
                                <option value="fit_for_pe">Fit for PE</option>
                                <option value="general">General Certificate</option>
                            </select>
                        </div>
                        <div>
                            <label className="he-label">Condition Start</label>
                            <input type="date" className="he-input" value={data.detail.condition_start || ''} onChange={e => updateDetail('condition_start', e.target.value)} />
                        </div>
                        <div>
                            <label className="he-label">Condition End</label>
                            <input type="date" className="he-input" value={data.detail.condition_end || ''} onChange={e => updateDetail('condition_end', e.target.value)} />
                        </div>
                        <div>
                            <label className="he-label">Issued By</label>
                            <input className="he-input" value={data.detail.issued_by || ''} onChange={e => updateDetail('issued_by', e.target.value)} />
                        </div>
                        <div>
                            <label className="he-label">Issued Date</label>
                            <input type="date" className="he-input" value={data.detail.issued_date || ''} onChange={e => updateDetail('issued_date', e.target.value)} />
                        </div>
                    </div>
                );
            case 'immunization':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="he-label">Vaccine Name</label>
                            <input className="he-input" value={data.detail.vaccine_name || ''} onChange={e => updateDetail('vaccine_name', e.target.value)} />
                        </div>
                        <div>
                            <label className="he-label">Dose</label>
                            <select className="he-input" value={data.detail.dose_number || ''} onChange={e => updateDetail('dose_number', e.target.value)}>
                                <option value="1st">1st Dose</option>
                                <option value="2nd">2nd Dose</option>
                                <option value="3rd">3rd Dose</option>
                                <option value="booster">Booster</option>
                                <option value="annual">Annual</option>
                            </select>
                        </div>
                        <div>
                            <label className="he-label">Administered By</label>
                            <input className="he-input" value={data.detail.administered_by || ''} onChange={e => updateDetail('administered_by', e.target.value)} />
                        </div>
                    </div>
                );
            case 'incident':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="he-label">Incident Type</label>
                            <select className="he-input" value={data.detail.incident_type || ''} onChange={e => updateDetail('incident_type', e.target.value)}>
                                <option value="accident">Accident</option>
                                <option value="sports_injury">Sports Injury</option>
                                <option value="fainting">Fainting</option>
                                <option value="allergic_reaction">Allergic Reaction</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="he-label">Severity</label>
                            <select className="he-input" value={data.detail.severity || ''} onChange={e => updateDetail('severity', e.target.value)}>
                                <option value="minor">Minor</option>
                                <option value="moderate">Moderate</option>
                                <option value="major">Major</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="he-label">Location on Campus</label>
                            <input className="he-input" value={data.detail.location_on_campus || ''} onChange={e => updateDetail('location_on_campus', e.target.value)} />
                        </div>
                        <div className="col-span-2">
                            <label className="he-label">First Aid Given</label>
                            <input className="he-input" value={data.detail.first_aid_given || ''} onChange={e => updateDetail('first_aid_given', e.target.value)} />
                        </div>
                    </div>
                );
            case 'health_screening':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="he-label">School Year</label>
                            <input className="he-input" value={data.detail.school_year || ''} onChange={e => updateDetail('school_year', e.target.value)} placeholder="2024-2025" />
                        </div>
                        <div>
                            <label className="he-label">Semester</label>
                            <select className="he-input" value={data.detail.semester || ''} onChange={e => updateDetail('semester', e.target.value)}>
                                <option value="1st">1st Sem</option>
                                <option value="2nd">2nd Sem</option>
                                <option value="summer">Summer</option>
                            </select>
                        </div>
                        <div>
                            <label className="he-label">Clearance Status</label>
                            <select className="he-input" value={data.detail.clearance_status || ''} onChange={e => updateDetail('clearance_status', e.target.value)}>
                                <option value="pending">Pending</option>
                                <option value="cleared">Cleared</option>
                                <option value="flagged">Flagged</option>
                            </select>
                        </div>
                    </div>
                );
            case 'allergy_condition':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="he-label">Allergy Type</label>
                            <input className="he-input" value={data.detail.allergy_type || ''} onChange={e => updateDetail('allergy_type', e.target.value)} placeholder="Food, Drug, etc." />
                        </div>
                        <div>
                            <label className="he-label">Allergen</label>
                            <input className="he-input" value={data.detail.allergen || ''} onChange={e => updateDetail('allergen', e.target.value)} placeholder="Penicillin, Peanuts..." />
                        </div>
                        <div>
                            <label className="he-label">Severity</label>
                            <select className="he-input" value={data.detail.severity || ''} onChange={e => updateDetail('severity', e.target.value)}>
                                <option value="mild">Mild</option>
                                <option value="moderate">Moderate</option>
                                <option value="severe">Severe</option>
                                <option value="life_threatening">Life Threatening</option>
                            </select>
                        </div>
                        <div className="flex items-center pt-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={data.detail.show_alert_to_professors || false} onChange={e => updateDetail('show_alert_to_professors', e.target.checked)} className="rounded border-white/10 bg-black text-orange-500" />
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Alert Professors</span>
                            </label>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <AppLayout title="Clinical Registry" noPadding>
            <style>{css}</style>
            <div className="he-root">
                <div className="he-grid" />
                
                <div className="he-content">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h1 className="he-title">
                                Clinical
                                <em>Registry</em>
                            </h1>
                            <p className="he-sub">College of Computing Studies · Official Student Health & Wellness Repository</p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => router.get(route('health.directory.index'))} className="px-6 py-3 rounded-2xl bg-white/[0.05] border border-white/10 text-white text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all">
                                <Search size={14} /> Health Directory
                            </button>
                            {userRole === 'dean' && (
                                <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 rounded-2xl bg-orange-500 text-white text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-orange-500/20">
                                    <Plus size={14} /> New Record
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Stats Dashboard */}
                    {userRole === 'dean' && stats && (
                        <div className="hr-stats">
                            <StatCard label="Total records"     value={stats.total}           color="#378ADD" />
                            <StatCard label="Active incidents"  value={stats.active_incidents} color="#D85A30" />
                            <StatCard label="Certs issued"      value={stats.certs_issued}    color="#1D9E75" />
                            <StatCard label="Due for screening" value={stats.due_screening}   color="#BA7517" />
                        </div>
                    )}

                    {/* Filters */}
                    <div className="he-filters">
                        <div className="he-filter-box">
                            <Activity size={16} className="text-orange-500" />
                            <select className="he-select" value={filters.record_type || 'all'} onChange={e => handleFilter('record_type', e.target.value)}>
                                <option value="all">All Types</option>
                                {Object.entries(RECORD_TYPE).map(([key, type]) => (
                                    <option key={key} value={key}>{type.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="he-filter-box">
                            <User size={16} className="text-orange-500" />
                            <select className="he-select" value={filters.student_id || ''} onChange={e => handleFilter('student_id', e.target.value)}>
                                <option value="">Filter Student...</option>
                                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.student_id})</option>)}
                            </select>
                        </div>
                        <div className="he-filter-box">
                            <ShieldCheck size={16} className="text-orange-500" />
                            <select className="he-select" value={filters.status || ''} onChange={e => handleFilter('status', e.target.value)}>
                                <option value="">All Statuses</option>
                                {Object.entries(STATUS_COLORS).map(([key, s]) => (
                                    <option key={key} value={key}>{s.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="he-filter-box">
                            <Calendar size={16} className="text-orange-500" />
                            <input type="date" className="he-date-input" value={filters.date_from || ''} onChange={e => handleFilter('date_from', e.target.value)} />
                        </div>
                    </div>

                    {/* Records Grid */}
                    <div className="he-card-grid">
                        {records.data.length > 0 ? records.data.map((record) => (
                            <RecordCard key={record.id} record={record} userRole={userRole} />
                        )) : (
                            <div className="col-span-full py-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[32px] bg-white/[0.01]">
                                <AlertCircle size={48} className="text-white/5 mb-6" />
                                <h3 className="font-serif text-2xl italic font-bold text-white/20">No Clinical Records Found</h3>
                                <p className="text-sm text-white/10 mt-2">Try adjusting your filters or clinical search query.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <div className="he-modal">
                    <div className="p-8 border-b border-white/5 bg-gradient-to-r from-orange-500/10 to-transparent flex justify-between items-center">
                        <div>
                            <div className="he-label" style={{ color: '#f97316' }}>Confidential Entry</div>
                            <h3 className="font-serif text-3xl font-black italic text-white">New Health Record</h3>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/40 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="he-label">Identified Patient</label>
                                <select className="he-input" value={data.student_id} onChange={e => setData('student_id', e.target.value)}>
                                    <option value="">Select Student...</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.student_id})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="he-label">Record Type</label>
                                <select className="he-input" value={data.record_type} onChange={e => handleTypeChange(e.target.value)}>
                                    {Object.entries(RECORD_TYPE).map(([key, type]) => (
                                        <option key={key} value={key}>{type.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Dynamic Section */}
                        <div className="p-6 rounded-[20px] bg-white/[0.02] border border-white/5">
                            {renderDynamicFields()}
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="he-label">Status</label>
                                <select className="he-input" value={data.status} onChange={e => setData('status', e.target.value)}>
                                    <option value="active">Active</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="expired">Expired</option>
                                    <option value="flagged">Flagged</option>
                                </select>
                            </div>
                            <div>
                                <label className="he-label">Record Date</label>
                                <input type="date" className="he-input" value={data.record_date} onChange={e => setData('record_date', e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label className="he-label">Medical Observations & Notes</label>
                            <textarea className="he-input h-24 resize-none" value={data.notes} onChange={e => setData('notes', e.target.value)} placeholder="General notes or observations..." />
                        </div>

                        <button type="submit" disabled={processing} className="w-full py-4 rounded-2xl bg-orange-500 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-orange-500/20 flex items-center justify-center gap-3">
                            {processing ? 'Processing...' : <><Save size={16} /> Finalize Health Entry</>}
                        </button>
                    </form>
                </div>
            </Modal>
        </AppLayout>
    );
}
