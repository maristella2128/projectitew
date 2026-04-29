import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { useForm } from '@/inertia-adapter';
import {
    Plus, Search, Trash2, BookOpen, CheckCircle2,
    Archive, X, RefreshCcw, ChevronRight, Eye,
    Filter, Layers, GraduationCap, ShieldCheck,
    Edit2, Save
} from 'lucide-react';

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   DESIGN TOKENS
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const C = {
    bg: '#0a0704', surf: '#120c06', card: '#1a1008', card2: '#201408',
    orange: '#f97316', o2: '#fb923c', o3: '#c2410c',
    green: '#34d399', red: '#f87171', blue: '#60a5fa', purple: '#a78bfa',
    txt: '#fef3ec', muted: 'rgba(254,243,236,0.38)', dim: 'rgba(254,243,236,0.14)',
    border: 'rgba(249,115,22,0.09)', border2: 'rgba(249,115,22,0.22)',
    slate: '#94a3b8'
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
.ps-orb { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; }
.ps-orb1 { top: -12%; right: -6%; width: 480px; height: 480px; background: radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 65%); }
.ps-orb2 { bottom: -8%; left: 15%; width: 360px; height: 360px; background: radial-gradient(circle, rgba(52,211,153,0.04) 0%, transparent 65%); }

.ps-topbar {
    position: sticky; top: 0; z-index: 50;
    background: rgba(10,7,4,0.82); backdrop-filter: blur(14px);
    border-bottom: 1px solid ${C.border};
    padding: 14px 32px; display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.ps-breadcrumb { display: flex; align-items: center; gap: 8px; }
.ps-bc-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .14em; color: ${C.muted}; }
.ps-bc-sep { color: ${C.dim}; }
.ps-bc-active { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .14em; color: ${C.orange}; }
.ps-topbar-right { display: flex; align-items: center; gap: 10px; }

.ps-refresh-btn {
    width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.04); border: 1px solid ${C.border};
    border-radius: 10px; color: ${C.muted}; cursor: pointer; transition: all .18s;
}
.ps-refresh-btn:hover { background: rgba(255,255,255,0.08); color: ${C.txt}; }

.ps-cta {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px; border-radius: 11px;
    background: linear-gradient(135deg, ${C.orange}, ${C.o3});
    color: #fff; font-size: 11px; font-weight: 800;
    text-transform: uppercase; letter-spacing: .08em;
    border: none; cursor: pointer; font-family: inherit;
    box-shadow: 0 4px 16px rgba(249,115,22,0.3); transition: all .2s;
}
.ps-cta:hover { transform: translateY(-1px); box-shadow: 0 7px 22px rgba(249,115,22,0.42); }
.ps-cta:disabled { opacity: 0.6; }

.ps-body { flex: 1; position: relative; z-index: 1; padding: 20px 32px 40px; width: 100%; margin: 0; }

.ps-page-title { font-family: 'Instrument Serif', serif; font-size: 28px; font-style: italic; color: ${C.txt}; line-height: 1.05; }
.ps-page-title span { color: ${C.orange}; }
.ps-page-sub { font-size: 11px; color: ${C.muted}; margin-top: 4px; margin-bottom: 20px; }

.ps-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.ps-stat {
    background: ${C.card}; border: 1px solid ${C.border};
    border-radius: 18px; padding: 20px 24px;
    transition: all .2s;
}
.ps-stat:hover { border-color: ${C.border2}; transform: translateY(-1px); }
.ps-stat-icon { width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
.ps-stat-val { font-family: 'Space Mono', monospace; font-size: 20px; font-weight: 700; color: ${C.txt}; line-height: 1; }
.ps-stat-lbl { font-size: 8px; font-weight: 800; color: ${C.muted}; margin-top: 3px; text-transform: uppercase; letter-spacing: .1em; }

.ps-toolbar { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
.ps-search {
    flex: 0 1 600px; background: ${C.surf};
    border: 1px solid ${C.border}; border-radius: 12px;
    padding: 8px 12px; display: flex; align-items: center; gap: 10px;
}
.ps-search input { background: none; border: none; outline: none; color: ${C.txt}; font-family: inherit; font-size: 12px; width: 100%; }
.ps-filter-wrap {
    background: ${C.surf}; border: 1px solid ${C.border};
    border-radius: 10px; padding: 8px 12px; display: flex; align-items: center; gap: 10px;
}
.ps-filter-wrap select { background: none; border: none; outline: none; color: ${C.txt}; font-family: inherit; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; cursor: pointer; appearance: none; }
.ps-filter-wrap select option { background: ${C.card2}; color: ${C.txt}; }

.ps-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 18px; }
.ps-card {
    background: ${C.card}; border: 1px solid ${C.border}; border-radius: 20px; overflow: hidden;
    position: relative; transition: all .22s; padding: 24px; cursor: pointer;
}
.ps-card:hover { border-color: rgba(249,115,22,0.3); transform: translateY(-3px); }
.ps-badge { padding: 2px 7px; border-radius: 5px; font-size: 9px; font-weight: 800; text-transform: uppercase; }

.ps-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.72); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 20px; }
.ps-modal { background: ${C.card2}; border: 1px solid ${C.border2}; border-radius: 20px; width: 100%; max-width: 480px; overflow: hidden; }
.ps-modal-hdr { padding: 18px 22px 14px; border-bottom: 1px solid ${C.border}; display: flex; align-items: flex-start; justify-content: space-between; }
.ps-modal-body { padding: 16px 22px; }
.ps-modal-foot { padding: 12px 22px 18px; border-top: 1px solid ${C.border}; display: flex; gap: 8px; justify-content: flex-end; }
.ps-modal-title { font-family: 'Instrument Serif', serif; font-size: 20px; font-style: italic; color: ${C.txt}; }
.ps-modal-title span { color: ${C.orange}; }
.ps-modal-close {
    width: 28px; height: 28px; border-radius: 7px;
    background: rgba(255,255,255,0.04); border: 1px solid ${C.border};
    color: ${C.muted}; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all .15s;
}
.ps-modal-close:hover { color: ${C.txt}; background: rgba(255,255,255,0.09); }

.ps-field { margin-bottom: 16px; }
.ps-field-lbl { display: block; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .09em; color: ${C.muted}; margin-bottom: 7px; }
.ps-field-inp { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid ${C.border}; border-radius: 10px; padding: 11px 13px; font-size: 13px; color: ${C.txt}; outline: none; font-family: inherit; }
.ps-field-inp option { background: ${C.card2}; color: #fef3ec; }
.ps-field-inp:focus { border-color: ${C.o2}; }
`;

export default function Index({ curricula, programs }) {
    const [search, setSearch] = useState('');
    const [progF, setProgF] = useState('All');
    const [modal, setModal] = useState(null);
    const currForm = useForm({ 
        name: '', 
        program_id: programs[0]?.id || '', 
        effective_year: new Date().getFullYear(), 
        status: 'Draft' 
    });

    const handleUpdate = (e) => {
        e.preventDefault();
        currForm.patch(route('curricula.update', modal.curriculum.id), {
            onSuccess: () => { setModal(null); currForm.reset(); },
        });
    };

    const handleCreate = (e) => {
        e.preventDefault();
        currForm.post(route('curricula.store'), {
            onSuccess: () => { setModal(null); currForm.reset(); },
        });
    };

    const handleDelete = () => {
        router.delete(route('curricula.destroy', modal.curriculum.id), {
            onSuccess: () => setModal(null)
        });
    };

    const openEdit = (c) => {
        currForm.setData({
            name: c.name,
            program_id: c.program_id,
            effective_year: c.effective_year,
            status: c.status,
        });
        setModal({ type: 'edit', curriculum: c });
    };

    const filtered = curricula.filter(c => {
        const q = search.toLowerCase();
        return (!q || c.name.toLowerCase().includes(q))
            && (progF === 'All' || c.program_id?.toString() === progF);
    });

    const statusStyle = (s) => ({
        Draft:    { bg: 'rgba(249,115,22,0.1)',  color: C.o2 },
        Active:   { bg: 'rgba(52,211,153,0.1)',  color: C.green },
        Archived: { bg: 'rgba(148,163,184,0.1)', color: C.slate },
    }[s] ?? { bg: 'rgba(254,243,236,0.05)', color: C.muted });

    const stats = [
        { icon: <GraduationCap size={13} color={C.orange} />, val: curricula.length, lbl: 'Total Curricula', bg: 'rgba(249,115,22,0.1)' },
        { icon: <CheckCircle2 size={13} color={C.green} />,   val: curricula.filter(c => c.status === 'Active').length, lbl: 'Active', bg: 'rgba(52,211,153,0.1)' },
        { icon: <Archive size={13} color={C.blue} />,         val: curricula.filter(c => c.status === 'Draft').length,  lbl: 'Drafts', bg: 'rgba(96,165,250,0.1)' },
        { icon: <Layers size={13} color={C.purple} />,        val: programs.length, lbl: 'Programs', bg: 'rgba(167,139,250,0.1)' },
    ];

    return (
        <AppLayout title="Curriculum Management" noPadding>
            <Head title="Curriculum" />
            <style>{css}</style>

            <div className="ps-root">
                <div className="ps-grid-tex" />
                <div className="ps-orb ps-orb1" />
                <div className="ps-orb ps-orb2" />

                {/* Topbar */}
                <div className="ps-topbar">
                    <div className="ps-breadcrumb">
                        <span className="ps-bc-label">Management</span>
                        <ChevronRight size={13} className="ps-bc-sep" />
                        <span className="ps-bc-active">Curriculum</span>
                    </div>
                    <div className="ps-topbar-right">
                        <button className="ps-refresh-btn" onClick={() => router.reload()} title="Refresh"><RefreshCcw size={15} /></button>
                        <button className="ps-cta" onClick={() => setModal({ type: 'create' })}><Plus size={14} /> New Curriculum</button>
                    </div>
                </div>

                <div className="ps-body">
                    <div className="ps-fu" style={{ marginBottom: 8 }}>
                        <h1 className="ps-page-title">Curriculum <span>Builder</span></h1>
                        <p className="ps-page-sub">Design and structure academic programs — click a curriculum to manage its courses by year and semester</p>
                    </div>

                    {/* Stats */}
                    <div className="ps-stats ps-fu">
                        {stats.map((s, i) => (
                            <div key={i} className="ps-stat">
                                <div className="ps-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                                <div className="ps-stat-val">{s.val}</div>
                                <div className="ps-stat-lbl">{s.lbl}</div>
                            </div>
                        ))}
                    </div>

                    {/* Toolbar */}
                    <div className="ps-toolbar ps-fu">
                        <div className="ps-search">
                            <Search size={15} color={C.muted} />
                            <input placeholder="Search curriculum..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div className="ps-filter-wrap">
                            <Filter size={14} color={C.muted} />
                            <select value={progF} onChange={e => setProgF(e.target.value)}>
                                <option value="All">All Programs</option>
                                {programs.map(p => <option key={p.id} value={p.id.toString()}>{p.code}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Curricula Grid */}
                    <div className="ps-grid ps-fu">
                        {filtered.length === 0 ? (
                            <div style={{ gridColumn: '1/-1', padding: '70px', textAlign: 'center', border: '1px dashed rgba(249,115,22,0.18)', borderRadius: 24 }}>
                                <GraduationCap size={36} style={{ opacity: 0.18, marginBottom: 14, color: C.orange }} />
                                <div style={{ fontSize: 14, fontWeight: 700, color: C.muted }}>No curricula found</div>
                                <div style={{ fontSize: 12, color: C.dim, marginTop: 6 }}>Create your first curriculum using the button above</div>
                            </div>
                        ) : filtered.map(c => {
                            const ss = statusStyle(c.status);
                            return (
                                <div key={c.id} className="ps-card" onClick={() => router.visit(route('curricula.show', c.id))}>
                                    <div style={{ position: 'absolute', right: -8, top: 36, fontSize: 76, fontWeight: 900, color: 'rgba(249,115,22,0.03)', pointerEvents: 'none', lineHeight: 1 }}>{c.effective_year}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                                        <span className="ps-badge" style={{ background: 'rgba(249,115,22,0.1)', color: C.orange }}>{c.program?.code ?? '—'}</span>
                                        <span className="ps-badge" style={{ background: ss.bg, color: ss.color }}>{c.status}</span>
                                    </div>
                                    <h3 style={{ fontSize: 22, fontFamily: 'Instrument Serif', fontStyle: 'italic', marginBottom: 6, color: C.txt }}>{c.name}</h3>
                                    <p style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>
                                        {c.courses_count || 0} Subjects
                                        <span style={{ margin: '0 8px', opacity: .4 }}>·</span>
                                        <span style={{ color: C.orange, fontWeight: 700 }}>{c.effective_year}</span>
                                    </p>
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <button
                                            className="ps-cta"
                                            style={{ flex: 1, padding: '11px', fontSize: 11 }}
                                            onClick={e => { e.stopPropagation(); router.visit(route('curricula.show', c.id)); }}
                                        >
                                            <Eye size={14} /> Manage
                                        </button>
                                        <button
                                            className="ps-refresh-btn"
                                            style={{ width: 40, height: 40 }}
                                            onClick={e => { e.stopPropagation(); openEdit(c); }}
                                            title="Edit curriculum"
                                        >
                                            <Edit2 size={14} color={C.muted} />
                                        </button>
                                        <button
                                            className="ps-refresh-btn"
                                            style={{ width: 40, height: 40 }}
                                            onClick={e => { e.stopPropagation(); setModal({ type: 'delete', curriculum: c }); }}
                                            title="Delete curriculum"
                                        >
                                            <Trash2 size={14} color={C.red} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Create/Edit Modal */}
                {(modal?.type === 'create' || modal?.type === 'edit') && (
                    <div className="ps-overlay" onClick={() => setModal(null)}>
                        <div className="ps-modal" onClick={e => e.stopPropagation()}>
                            <div className="ps-modal-hdr">
                                <div className="ps-modal-title">{modal.type === 'create' ? 'New' : 'Edit'} <span>Curriculum</span></div>
                                <button className="ps-modal-close" onClick={() => setModal(null)}><X size={14} /></button>
                            </div>
                            <form onSubmit={modal.type === 'create' ? handleCreate : handleUpdate}>
                                <div className="ps-modal-body">
                                    <div className="ps-field">
                                        <label className="ps-field-lbl">Curriculum Name</label>
                                        <input className="ps-field-inp" value={currForm.data.name} onChange={e => currForm.setData('name', e.target.value)} placeholder="e.g. BSIT Curriculum 2024" required />
                                        {currForm.errors.name && <div style={{ color: C.red, fontSize: 11, marginTop: 4 }}>{currForm.errors.name}</div>}
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                        <div className="ps-field">
                                            <label className="ps-field-lbl">Program</label>
                                            <select className="ps-field-inp" value={currForm.data.program_id} onChange={e => currForm.setData('program_id', e.target.value)}>
                                                {programs.map(p => <option key={p.id} value={p.id}>{p.code} — {p.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="ps-field">
                                            <label className="ps-field-lbl">Effective Year</label>
                                            <input type="number" className="ps-field-inp" value={currForm.data.effective_year} onChange={e => currForm.setData('effective_year', e.target.value)} min={2000} max={2099} />
                                        </div>
                                    </div>
                                    <div className="ps-field">
                                        <label className="ps-field-lbl">Status</label>
                                        <select className="ps-field-inp" value={currForm.data.status} onChange={e => currForm.setData('status', e.target.value)}>
                                            <option value="Draft">Draft</option>
                                            <option value="Active">Active</option>
                                            <option value="Archived">Archived</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="ps-modal-foot">
                                    <button type="button" className="ps-refresh-btn" style={{ width: 'auto', padding: '0 16px', fontSize: 12 }} onClick={() => setModal(null)}>Cancel</button>
                                    <button type="submit" disabled={currForm.processing} className="ps-cta">
                                        {modal.type === 'create' ? <Plus size={14} /> : <Save size={14} />} 
                                        {currForm.processing ? 'Processing...' : (modal.type === 'create' ? 'Create Curriculum' : 'Update Details')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Modal */}
                {modal?.type === 'delete' && (
                    <div className="ps-overlay" onClick={() => setModal(null)}>
                        <div className="ps-modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
                            <div className="ps-modal-hdr">
                                <div className="ps-modal-title" style={{ color: C.red }}>Delete <span style={{ color: C.red }}>Curriculum</span></div>
                                <button className="ps-modal-close" onClick={() => setModal(null)}><X size={14} /></button>
                            </div>
                            <div className="ps-modal-body">
                                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>Are you sure you want to delete <strong style={{ color: C.txt }}>{modal.curriculum?.name}</strong>? All course assignments within this curriculum will also be removed.</p>
                            </div>
                            <div className="ps-modal-foot">
                                <button className="ps-refresh-btn" style={{ width: 'auto', padding: '0 16px', fontSize: 12 }} onClick={() => setModal(null)}>Cancel</button>
                                <button className="ps-cta" style={{ background: 'linear-gradient(135deg,#ef4444,#991b1b)', boxShadow: 'none' }} onClick={handleDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
