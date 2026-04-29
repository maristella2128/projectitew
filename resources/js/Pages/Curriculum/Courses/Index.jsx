import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { useForm, usePage } from '@/inertia-adapter';
import {
    Plus, Search, Edit2, Trash2, BookOpen, CheckCircle2,
    Archive, ShieldCheck, Bookmark, Activity, X, Save, RefreshCcw, 
    ChevronRight, Filter, Info, Layers, GraduationCap, ChevronLeft
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────────────────────── */
const C = {
    bg: '#0a0704', surf: '#120c06', card: '#1a1008', card2: '#201408',
    orange: '#f97316', o2: '#fb923c', o3: '#c2410c',
    green: '#34d399', red: '#f87171', blue: '#60a5fa', purple: '#a78bfa',
    txt: '#fef3ec', muted: 'rgba(254,243,236,0.38)', dim: 'rgba(254,243,236,0.14)',
    border: 'rgba(249,115,22,0.09)', border2: 'rgba(249,115,22,0.22)',
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700;9..40,900&family=Instrument+Serif:ital@0;1&family=Space+Mono:wght@400;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.ps-root {
    background: ${C.bg}; min-height: 100%; color: ${C.txt};
    font-family: 'DM Sans', system-ui, sans-serif; position: relative;
    display: flex; flex-direction: column;
}

.ps-grid-tex {
    position: fixed; inset: 0;
    background-image: linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px);
    background-size: 52px 52px; pointer-events: none; z-index: 0;
}

.ps-topbar {
    position: sticky; top: 0; z-index: 50;
    background: rgba(10,7,4,0.82); backdrop-filter: blur(14px);
    border-bottom: 1px solid ${C.border};
    padding: 14px 32px; display: flex; align-items: center; justify-content: space-between; gap: 16px;
}

.ps-bc-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .14em; color: ${C.muted}; }
.ps-bc-sep { color: ${C.dim}; }
.ps-bc-active { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .14em; color: ${C.orange}; }

.ps-cta {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px; border-radius: 11px;
    background: linear-gradient(135deg, ${C.orange}, ${C.o3});
    color: #fff; font-size: 11px; font-weight: 800;
    text-transform: uppercase; letter-spacing: .08em;
    border: none; cursor: pointer; font-family: inherit;
    box-shadow: 0 4px 16px rgba(249,115,22,0.3); transition: all .2s;
}

.ps-body { flex: 1; position: relative; z-index: 1; padding: 20px 32px 60px; width: 100%; margin: 0; }

.ps-page-title { font-family: 'Instrument Serif', serif; font-size: 30px; font-style: italic; color: ${C.txt}; line-height: 1.05; }
.ps-page-title span { color: ${C.orange}; }
.ps-page-sub { font-size: 11px; color: ${C.muted}; margin-top: 4px; margin-bottom: 24px; }

.ps-toolbar { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
.ps-search {
    flex: 1; min-width: 200px; background: ${C.surf};
    border: 1px solid ${C.border}; border-radius: 12px;
    padding: 10px 14px; display: flex; align-items: center; gap: 10px;
}
.ps-search input { background: none; border: none; outline: none; color: ${C.txt}; font-family: inherit; font-size: 13px; width: 100%; }

.ps-filter-wrap {
    background: ${C.surf}; border: 1px solid ${C.border};
    border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; gap: 10px;
}
.ps-filter-wrap select { 
    background: none; border: none; outline: none; color: ${C.txt}; 
    font-family: inherit; font-size: 11px; font-weight: 800; 
    text-transform: uppercase; letter-spacing: .08em; cursor: pointer; 
}

.ps-table-card { background: ${C.card}; border: 1px solid ${C.border}; border-radius: 20px; overflow: hidden; }
.ps-table-head {
    display: grid; grid-template-columns: 120px 1fr 140px 140px 80px 80px 80px 120px 100px;
    padding: 16px 24px; background: ${C.surf}; border-bottom: 1px solid ${C.border};
}
.ps-th { font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: .14em; color: ${C.muted}; }

.ps-row {
    display: grid; grid-template-columns: 120px 1fr 140px 140px 80px 80px 80px 120px 100px;
    align-items: center; padding: 18px 24px; border-bottom: 1px solid ${C.border}; transition: background .15s;
}
.ps-row:hover { background: rgba(249,115,22,0.03); }
.ps-badge { padding: 3px 8px; border-radius: 6px; font-size: 9px; font-weight: 800; text-transform: uppercase; }

.ps-pagination { display: flex; align-items: center; gap: 8px; margin-top: 24px; justify-content: center; }
.ps-pag-btn {
    width: 32px; height: 32px; border-radius: 10px; border: 1px solid ${C.border};
    background: ${C.card}; color: ${C.muted}; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .2s; font-size: 11px; font-weight: 700;
}
.ps-pag-btn:hover:not(:disabled) { border-color: ${C.orange}; color: ${C.orange}; }
.ps-pag-btn.active { background: ${C.orange}; color: #fff; border-color: ${C.orange}; }
.ps-pag-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.ps-modal { background: ${C.card2}; border: 1px solid ${C.border2}; border-radius: 20px; width: 100%; max-width: 580px; overflow: hidden; }
.ps-modal-hdr { padding: 20px 24px; border-bottom: 1px solid ${C.border}; display: flex; justify-content: space-between; }
.ps-modal-body { padding: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.ps-field { display: flex; flexDirection: column; gap: 6px; }
.ps-field-full { grid-column: 1 / -1; }
.ps-field-lbl { font-size: 10px; font-weight: 800; text-transform: uppercase; color: ${C.muted}; }
.ps-field-inp { 
    width: 100%; background: rgba(255,255,255,0.03); border: 1px solid ${C.border}; 
    border-radius: 10px; padding: 10px 14px; color: ${C.txt}; font-size: 13px; outline: none; 
}
.ps-field-inp:focus { border-color: ${C.orange}; }

.ps-fu { animation: fadeUp .3s ease both; }
@keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
`;

export default function CourseMasterIndex({ courses, preRequisites = [], filters = {}, departments = [] }) {
    const [modal, setModal] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [deptF, setDeptF]   = useState(filters.department || 'All');
    const [typeF, setTypeF]   = useState(filters.type || 'All');

    const { data, setData, post, patch, processing, reset, errors } = useForm({
        code: '', name: '', description: '',
        lec_units: 3, lab_units: 0,
        type: 'Core', department: '',
        pre_requisite_id: '', is_active: true
    });

    // Handle Server-side Filtering
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(route('courses.index'), {
                search, department: deptF, type: typeF
            }, { preserveState: true, replace: true });
        }, 400);
        return () => clearTimeout(timer);
    }, [search, deptF, typeF]);

    const openCreate = () => { reset(); setModal({ type: 'create' }); };
    const openEdit = (c) => {
        setData({
            code: c.code, name: c.name, description: c.description || '',
            lec_units: c.lec_units, lab_units: c.lab_units,
            type: c.type, department: c.department || '',
            pre_requisite_id: c.pre_requisite_id || '',
            is_active: !!c.is_active
        });
        setModal({ type: 'edit', course: c });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const action = modal.type === 'create' ? post : (url, options) => patch(route('courses.update', modal.course.id), options);
        action(route('courses.store'), {
            onSuccess: () => { setModal(null); reset(); }
        });
    };

    return (
        <AppLayout title="Course Registry" noPadding>
            <Head title="Course Master List" />
            <style>{css}</style>

            <div className="ps-root">
                <div className="ps-grid-tex" />
                <div className="ps-topbar">
                    <div className="ps-breadcrumb">
                        <span className="ps-bc-label">Management</span>
                        <ChevronRight size={13} className="ps-bc-sep" />
                        <span className="ps-bc-active">Course Registry</span>
                    </div>
                    <div className="ps-cta" onClick={openCreate}><Plus size={14} /> Register Subject</div>
                </div>

                <div className="ps-body">
                    <div className="ps-fu">
                        <h1 className="ps-page-title">Course <span>Catalog</span></h1>
                        <p className="ps-page-sub">Define core subjects and professional electives for the academic institution</p>
                    </div>

                    {/* Toolbar */}
                    <div className="ps-toolbar ps-fu">
                        <div className="ps-search">
                            <Search size={15} color={C.muted} />
                            <input placeholder="Search by code or title..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div className="ps-filter-wrap">
                            <Filter size={14} color={C.muted} />
                            <select value={deptF} onChange={e => setDeptF(e.target.value)}>
                                <option value="All">All Departments</option>
                                {departments.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="ps-filter-wrap">
                            <Layers size={14} color={C.muted} />
                            <select value={typeF} onChange={e => setTypeF(e.target.value)}>
                                <option value="All">All Types</option>
                                {['Major', 'Minor', 'GE', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="ps-table-card ps-fu">
                        <div className="ps-table-head">
                            <div className="ps-th">Code</div>
                            <div className="ps-th">Description</div>
                            <div className="ps-th">Department</div>
                            <div className="ps-th">Type</div>
                            <div className="ps-th" style={{ textAlign: 'center' }}>Lec</div>
                            <div className="ps-th" style={{ textAlign: 'center' }}>Lab</div>
                            <div className="ps-th" style={{ textAlign: 'center' }}>Units</div>
                            <div className="ps-th">Status</div>
                            <div className="ps-th" style={{ textAlign: 'right' }}>Actions</div>
                        </div>

                        {courses.data.length === 0 ? (
                            <div style={{ padding: '80px', textAlign: 'center' }}>
                                <BookOpen size={40} style={{ opacity: 0.1, marginBottom: 16 }} />
                                <div style={{ fontSize: 14, fontWeight: 700, color: C.muted }}>No subjects found matching your criteria</div>
                            </div>
                        ) : courses.data.map(c => (
                            <div key={c.id} className="ps-row">
                                <div style={{ fontFamily: 'Space Mono', fontSize: 13, fontWeight: 700, color: C.orange }}>{c.code}</div>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                                    {c.pre_requisite && <div style={{ fontSize: 10, color: C.muted }}>Pre-req: {c.pre_requisite.code}</div>}
                                </div>
                                <div><span className="ps-badge" style={{ background: 'rgba(255,255,255,0.05)', color: C.muted }}>{c.department || '—'}</span></div>
                                <div><span className="ps-badge" style={{ background: 'rgba(96,165,250,0.1)', color: C.blue }}>{c.type}</span></div>
                                <div style={{ textAlign: 'center', fontFamily: 'Space Mono', color: C.muted }}>{c.lec_units}</div>
                                <div style={{ textAlign: 'center', fontFamily: 'Space Mono', color: C.muted }}>{c.lab_units}</div>
                                <div style={{ textAlign: 'center', fontFamily: 'Space Mono', fontWeight: 700, color: C.orange }}>{c.lec_units + c.lab_units}</div>
                                <div>
                                    <span className="ps-badge" style={{ background: c.is_active ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)', color: c.is_active ? C.green : C.red }}>
                                        {c.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                    <button className="ps-pag-btn" style={{ width: 28, height: 28 }} onClick={() => openEdit(c)}><Edit2 size={12} /></button>
                                    <button className="ps-pag-btn" style={{ width: 28, height: 28 }} onClick={() => setModal({ type: 'delete', course: c })}><Trash2 size={12} color={C.red} /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {courses.links && courses.links.length > 3 && (
                        <div className="ps-pagination ps-fu">
                            {courses.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    className={`ps-pag-btn ${link.active ? 'active' : ''}`}
                                    onClick={() => router.get(link.url, {}, { preserveState: true })}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Create/Edit Modal */}
                {(modal?.type === 'create' || modal?.type === 'edit') && (
                    <div className="ps-overlay" onClick={() => setModal(null)}>
                        <div className="ps-modal" onClick={e => e.stopPropagation()}>
                            <div className="ps-modal-hdr">
                                <div className="ps-modal-title">{modal.type === 'create' ? 'Register' : 'Edit'} <span>Subject</span></div>
                                <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer' }}><X size={18} /></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="ps-modal-body">
                                    <div className="ps-field">
                                        <label className="ps-field-lbl">Subject Code *</label>
                                        <input className="ps-field-inp" value={data.code} onChange={e => setData('code', e.target.value.toUpperCase())} placeholder="e.g. ITP101" required />
                                        {errors.code && <div style={{ fontSize: 10, color: C.red }}>{errors.code}</div>}
                                    </div>
                                    <div className="ps-field">
                                        <label className="ps-field-lbl">Subject Name *</label>
                                        <input className="ps-field-inp" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g. Intro to Programming" required />
                                    </div>
                                    <div className="ps-field ps-field-full">
                                        <label className="ps-field-lbl">Description</label>
                                        <textarea className="ps-field-inp" style={{ height: 80, resize: 'none' }} value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Brief subject overview..." />
                                    </div>
                                    <div className="ps-field">
                                        <label className="ps-field-lbl">Department / College</label>
                                        <input className="ps-field-inp" value={data.department} onChange={e => setData('department', e.target.value)} placeholder="e.g. CCS" />
                                    </div>
                                    <div className="ps-field">
                                        <label className="ps-field-lbl">Subject Type</label>
                                        <select className="ps-field-inp" value={data.type} onChange={e => setData('type', e.target.value)}>
                                            {['Major', 'Minor', 'GE', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div className="ps-field">
                                        <label className="ps-field-lbl">Lec Units</label>
                                        <input type="number" className="ps-field-inp" value={data.lec_units} onChange={e => setData('lec_units', e.target.value)} min={0} />
                                    </div>
                                    <div className="ps-field">
                                        <label className="ps-field-lbl">Lab Units</label>
                                        <input type="number" className="ps-field-inp" value={data.lab_units} onChange={e => setData('lab_units', e.target.value)} min={0} />
                                    </div>
                                    <div className="ps-field">
                                        <label className="ps-field-lbl">Pre-requisite</label>
                                        <select className="ps-field-inp" value={data.pre_requisite_id} onChange={e => setData('pre_requisite_id', e.target.value)}>
                                            <option value="">None</option>
                                            {preRequisites.filter(p => p.id !== modal.course?.id).map(p => (
                                                <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="ps-field">
                                        <label className="ps-field-lbl">Status</label>
                                        <select className="ps-field-inp" value={data.is_active ? '1' : '0'} onChange={e => setData('is_active', e.target.value === '1')}>
                                            <option value="1">Active</option>
                                            <option value="0">Inactive / Archived</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="ps-modal-foot">
                                    <button type="submit" disabled={processing} className="ps-cta">
                                        <Save size={14} /> {processing ? 'Processing...' : 'Save Subject'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation */}
                {modal?.type === 'delete' && (
                    <div className="ps-overlay" onClick={() => setModal(null)}>
                        <div className="ps-modal" style={{ maxWidth: 400, textAlign: 'center', padding: 32 }}>
                            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(248,113,113,0.1)', color: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Trash2 size={24} /></div>
                            <h2 style={{ fontSize: 20, fontFamily: 'Instrument Serif', fontStyle: 'italic', marginBottom: 8 }}>Remove Subject?</h2>
                            <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>Deleting <strong style={{ color: C.txt }}>{modal.course.code}</strong> will remove it from the master catalog. This may affect existing curricula.</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <button onClick={() => setModal(null)} className="ps-pag-btn" style={{ width: '100%', height: 40 }}>Cancel</button>
                                <button onClick={() => { router.delete(route('courses.destroy', modal.course.id), { onSuccess: () => setModal(null) }); }} className="ps-cta" style={{ background: C.red, boxShadow: 'none' }}>Confirm Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
