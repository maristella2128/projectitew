import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Plus, Award, AlertCircle, Save, X, Filter,
    Layers, User, CheckCircle, ShieldCheck,
    ChevronLeft, ChevronRight, ExternalLink, Shield,
    Trash2, Search
} from 'lucide-react';
import Modal from '@/Components/Modal';

/* ──────────────────────────────────────────────────────────────────────────
   DESIGN SYSTEM — Exact match to screenshots (dark brown + orange)
   ────────────────────────────────────────────────────────────────────────── */
const C = {
    bg: '#0c0805',
    surf: '#160e08',
    surf2: '#1c1208',
    surf3: '#211408',
    bdr: '#2a1508',
    bdr2: '#3a1e0a',
    bdr3: 'rgba(249,115,22,0.25)',
    orange: '#f97316',
    o2: '#fb923c',
    o3: '#fdba74',
    txt: '#fef3ec',
    muted: 'rgba(254,243,236,0.35)',
    dim: 'rgba(254,243,236,0.18)',
    faint: 'rgba(254,243,236,0.06)',
    green: '#10b981',
    amber: '#f59e0b',
    red: '#ef4444',
};

const sevColor = s => s === 'high' ? C.red : s === 'medium' ? C.amber : C.green;
const sevBg = s => s === 'high' ? 'rgba(239,68,68,0.12)' : s === 'medium' ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)';
const sevBdr = s => s === 'high' ? 'rgba(239,68,68,0.25)' : s === 'medium' ? 'rgba(245,158,11,0.25)' : 'rgba(16,185,129,0.25)';
const typeColor = t => t === 'violation' ? C.red : C.green;
const typeBg = t => t === 'violation' ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)';
const typeBdr = t => t === 'violation' ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.25)';
const conductColor = v => v >= 90 ? C.green : v >= 75 ? C.amber : C.red;

/* ─── CSS ───────────────────────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,900&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');
*,*::before,*::after{box-sizing:border-box;}

.cr-root{background:${C.bg};min-height:100vh;flex:1;display:flex;flex-direction:column;font-family:'DM Sans',system-ui,sans-serif;color:${C.txt};padding:32px 40px 80px;position:relative;overflow-x:hidden;}
.cr-grid{position:fixed;inset:0;pointer-events:none;z-index:0;background-size:56px 56px;background-image:linear-gradient(${C.dim} 1px,transparent 1px),linear-gradient(90deg,${C.dim} 1px,transparent 1px);opacity:0.18;}
.cr-orb1{position:fixed;top:-10%;right:-5%;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(249,115,22,0.09) 0%,transparent 70%);pointer-events:none;z-index:0;}
.cr-orb2{position:fixed;bottom:-20%;left:-10%;width:800px;height:800px;border-radius:50%;background:radial-gradient(circle,rgba(239,68,68,0.04) 0%,transparent 70%);pointer-events:none;z-index:0;}
.cr-content{position:relative;z-index:1;max-width:1500px;margin:0 auto;width:100%;animation:fadeUp 0.5s cubic-bezier(0.16,1,0.3,1);}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

/* ── Metric cards ── */
.cr-stat{background:${C.surf};border:1px solid ${C.bdr};border-radius:24px;padding:22px 26px;position:relative;overflow:hidden;transition:all .35s cubic-bezier(0.16,1,0.3,1);}
.cr-stat:hover{border-color:rgba(249,115,22,0.25);transform:translateY(-3px);box-shadow:0 16px 40px rgba(0,0,0,0.45);}
.cr-stat-icon{position:absolute;top:16px;right:16px;opacity:0.07;}
.cr-stat-label{font-family:'Space Mono',monospace;font-size:9px;font-weight:700;color:${C.muted};text-transform:uppercase;letter-spacing:.15em;margin-bottom:10px;}
.cr-stat-val{font-family:'Playfair Display',serif;font-size:38px;font-weight:900;line-height:1;}

/* ── Distribution ── */
.cr-dist-wrap{background:${C.surf};border:1px solid ${C.bdr};border-radius:20px;padding:18px 24px;margin-bottom:26px;}
.cr-dist-track{height:8px;border-radius:6px;background:${C.faint};overflow:hidden;display:flex;margin:12px 0;}
.cr-dist-seg{transition:width .7s cubic-bezier(.4,0,.2,1);cursor:pointer;}
.cr-dist-seg:hover{filter:brightness(1.25);}
.cr-cat-chip{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;cursor:pointer;transition:all .15s;border:1px solid;font-family:'Space Mono';font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;}

/* ── Type tabs ── */
.cr-tabs-row{display:flex;align-items:center;gap:6px;margin-bottom:18px;}
.cr-tab{font-family:'Space Mono';font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;padding:8px 18px;border-radius:12px;cursor:pointer;transition:all .2s;border:1px solid;background:transparent;}

/* ── Filters ── */
.cr-filters-row{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:12px;margin-bottom:18px;}
.cr-fbox{background:${C.surf};border:1px solid ${C.bdr};border-radius:14px;padding:12px 16px;display:flex;align-items:center;gap:10px;transition:border-color .2s;}
.cr-fbox:focus-within{border-color:${C.orange};box-shadow:0 0 0 3px rgba(249,115,22,0.08);}
.cr-finput{flex:1;background:transparent;border:none;outline:none;font-family:'DM Sans';font-size:13px;font-weight:600;color:${C.txt};}
.cr-finput::placeholder{color:${C.muted};}
.cr-finput option{background:${C.surf2};}

/* ── Active filter tags ── */
.cr-tag-row{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;align-items:center;}
.cr-tag{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;background:rgba(249,115,22,0.1);border:1px solid rgba(249,115,22,0.22);border-radius:8px;font-family:'Space Mono';font-size:9px;font-weight:700;color:${C.orange};text-transform:uppercase;letter-spacing:.07em;}
.cr-tag button{background:none;border:none;cursor:pointer;color:${C.orange};opacity:0.6;display:flex;padding:0;transition:opacity .15s;}
.cr-tag button:hover{opacity:1;}
.cr-tag.vio{background:rgba(239,68,68,0.1);border-color:rgba(239,68,68,0.22);color:${C.red};}
.cr-tag.vio button{color:${C.red};}
.cr-tag.com{background:rgba(16,185,129,0.1);border-color:rgba(16,185,129,0.22);color:${C.green};}
.cr-tag.com button{color:${C.green};}

/* ── Banner ── */
.cr-banner{background:rgba(249,115,22,0.07);border:1px solid rgba(249,115,22,0.2);border-radius:18px;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;animation:slideDown .22s ease;}
@keyframes slideDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}

/* ══ TABLE CARD ══ */
.cr-table-card{border-radius:28px;border:1px solid ${C.bdr};background:${C.surf};overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.5);}

/* Result bar */
.cr-result-bar{background:${C.surf2};border-bottom:1px solid ${C.bdr};padding:12px 24px;display:flex;justify-content:space-between;align-items:center;}
.cr-result-label{font-family:'Space Mono';font-size:9px;font-weight:700;color:${C.muted};text-transform:uppercase;letter-spacing:.12em;}

/* Main table */
.cr-table{width:100%;border-collapse:collapse;}
.cr-th{background:rgba(255,255,255,0.015);padding:16px 24px;font-family:'Space Mono';font-size:9px;font-weight:700;color:${C.muted};text-transform:uppercase;letter-spacing:.18em;border-bottom:1px solid ${C.bdr2};text-align:left;white-space:nowrap;}
.cr-row{border-bottom:1px solid ${C.faint};transition:background .15s;}
.cr-row:last-child{border-bottom:none;}
.cr-row:hover{background:rgba(249,115,22,0.028);}
.cr-row.is-vio{border-left:3px solid transparent;}
.cr-row.is-vio:hover{border-left-color:${C.red};background:rgba(239,68,68,0.022);}
.cr-row.is-com{border-left:3px solid transparent;}
.cr-row.is-com:hover{border-left-color:${C.green};background:rgba(16,185,129,0.022);}
.cr-td{padding:20px 24px;vertical-align:middle;}

/* Avatar */
.cr-avatar{width:44px;height:44px;border-radius:16px;flex-shrink:0;background:${C.surf2};border:1px solid ${C.bdr2};display:flex;align-items:center;justify-content:center;font-family:'Space Mono';font-size:14px;font-weight:700;color:${C.orange};transition:all .2s;}
.cr-row:hover .cr-avatar{border-color:rgba(249,115,22,0.38);}
.cr-row.is-vio:hover .cr-avatar{color:${C.red};border-color:rgba(239,68,68,0.3);background:rgba(239,68,68,0.08);}
.cr-row.is-com:hover .cr-avatar{color:${C.green};border-color:rgba(16,185,129,0.3);background:rgba(16,185,129,0.08);}

/* Name */
.cr-name-main{font-size:14px;font-weight:700;color:${C.txt};text-transform:uppercase;transition:color .15s;}
.cr-row:hover .cr-name-main{color:#fff;}
.cr-name-id{font-family:'Space Mono';font-size:9px;color:rgba(249,115,22,0.45);text-transform:uppercase;letter-spacing:.18em;margin-top:3px;}

/* Category */
.cr-cat-name{font-family:'Playfair Display';font-style:italic;font-size:15px;font-weight:900;color:${C.txt};margin-bottom:4px;text-transform:capitalize;}
.cr-desc-snip{font-family:'Space Mono';font-size:9px;color:${C.muted};text-transform:uppercase;letter-spacing:.04em;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;max-width:200px;}

/* Badge */
.cr-badge{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:9px;font-family:'Space Mono';font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;border:1px solid;white-space:nowrap;}
.cr-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;}

/* Impact */
.cr-impact{font-family:'Playfair Display';font-style:italic;font-size:28px;font-weight:900;line-height:1;}
.cr-impact-bar{height:3px;border-radius:2px;background:${C.faint};margin-top:6px;overflow:hidden;width:68px;}
.cr-impact-fill{height:100%;border-radius:2px;transition:width .8s ease;}

/* Actions */
.cr-action{width:34px;height:34px;border-radius:10px;border:1px solid ${C.bdr};background:transparent;display:flex;align-items:center;justify-content:center;color:rgba(254,243,236,0.2);cursor:pointer;transition:all .2s;}
.cr-action.view:hover{border-color:rgba(249,115,22,0.35);background:rgba(249,115,22,0.1);color:${C.orange};}
.cr-action.del:hover{border-color:rgba(239,68,68,0.28);background:rgba(239,68,68,0.1);color:${C.red};}

/* Empty */
.cr-empty{padding:64px 32px;text-align:center;}
.cr-empty-icon{width:60px;height:60px;border-radius:20px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;}
.cr-empty-title{font-family:'Playfair Display';font-style:italic;font-size:22px;color:${C.txt};margin-bottom:8px;}
.cr-empty-sub{font-family:'Space Mono';font-size:9px;font-weight:700;color:${C.muted};text-transform:uppercase;letter-spacing:.12em;}

/* Quick-access table */
.cr-quick-table{width:100%;border-collapse:collapse;}
.cr-quick-th{padding:16px 24px;font-family:'Space Mono';font-size:9px;font-weight:700;color:${C.muted};text-transform:uppercase;letter-spacing:.18em;border-bottom:1px solid ${C.bdr2};text-align:left;}
.cr-quick-row{border-bottom:1px solid ${C.faint};transition:background .15s;}
.cr-quick-row:last-child{border-bottom:none;}
.cr-quick-row:hover{background:rgba(249,115,22,0.025);}
.cr-quick-td{padding:20px 24px;vertical-align:middle;}
.cr-quick-avatar{width:44px;height:44px;border-radius:16px;flex-shrink:0;background:${C.surf2};border:1px solid ${C.bdr2};display:flex;align-items:center;justify-content:center;font-family:'Space Mono';font-size:14px;font-weight:700;color:${C.orange};transition:all .2s;}
.cr-quick-row:hover .cr-quick-avatar{border-color:rgba(249,115,22,0.38);}
.cr-quick-id{font-family:'Space Mono';font-size:11px;font-weight:700;color:rgba(249,115,22,0.45);text-transform:uppercase;letter-spacing:.18em;transition:color .2s;}
.cr-quick-row:hover .cr-quick-id{color:${C.orange};}
.cr-quick-verified{font-family:'Space Mono';font-size:9px;color:rgba(254,243,236,0.2);text-transform:uppercase;letter-spacing:.12em;margin-top:3px;transition:color .2s;}
.cr-quick-row:hover .cr-quick-verified{color:rgba(249,115,22,0.4);}
.cr-open-btn{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);font-family:'Space Mono';font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:rgba(254,243,236,0.4);cursor:pointer;transition:all .2s;}
.cr-open-btn:hover{color:${C.orange};border-color:rgba(249,115,22,0.3);background:rgba(249,115,22,0.08);transform:scale(1.03);}

/* Pagination */
.cr-pg{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:32px;}
.cr-pg-btn{width:36px;height:36px;border-radius:10px;border:1px solid ${C.bdr};background:${C.surf};display:flex;align-items:center;justify-content:center;font-family:'Space Mono';font-size:11px;font-weight:700;color:${C.muted};cursor:pointer;transition:all .2s;}
.cr-pg-btn:hover:not(:disabled):not(.active){border-color:rgba(249,115,22,0.3);color:${C.orange};background:rgba(249,115,22,0.08);}
.cr-pg-btn.active{background:${C.orange};border-color:${C.orange};color:#0a0500;}
.cr-pg-btn:disabled{opacity:0.25;cursor:not-allowed;}

/* Modal */
.cr-modal{background:${C.surf};color:${C.txt};border:1px solid ${C.bdr};border-radius:24px;font-family:'DM Sans',sans-serif;}
.cr-input{width:100%;background:${C.bg};border:1px solid ${C.bdr};border-radius:13px;padding:13px 15px;color:${C.txt};font-size:13px;font-family:'DM Sans',sans-serif;font-weight:600;transition:all .2s;outline:none;}
.cr-input:focus{border-color:${C.orange};box-shadow:0 0 0 3px rgba(249,115,22,0.1);}
.cr-input option{background:${C.surf2};}
.cr-date{color-scheme:dark;}
.cr-lbl{font-family:'Space Mono';font-size:9px;font-weight:700;color:${C.muted};text-transform:uppercase;letter-spacing:.12em;margin-bottom:6px;display:block;}
.cr-type-toggle{display:flex;gap:6px;margin-bottom:18px;}
.cr-type-btn{flex:1;padding:10px;border-radius:11px;cursor:pointer;font-family:'DM Sans';font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;transition:all .2s;border:1px solid;}

::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:${C.bdr2};border-radius:3px;}
`;

/* ─── Small helpers ─────────────────────────────────────────────────────── */
const Dot = ({ color }) => <div className="cr-dot" style={{ background: color }} />;

const Badge = ({ children, bg, bdr, color }) => (
    <span className="cr-badge" style={{ background: bg, borderColor: bdr, color }}>
        {children}
    </span>
);

/* ─── MAIN ──────────────────────────────────────────────────────────────── */
export default function Index({ logs, sections, students, available_students = [], filters, category_summary, available_categories }) {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [searchVal, setSearchVal] = React.useState(filters.search || '');

    const { data, setData, post, processing, errors, reset } = useForm({
        student_id: '', type: 'violation', category: 'other',
        severity: 'low', description: '',
        date: new Date().toISOString().split('T')[0],
    });

    const applyFilter = (key, val) =>
        router.get(route('behavior.index'), { ...filters, [key]: val, page: 1 }, { preserveState: true, preserveScroll: true });

    // Debounce search
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (searchVal !== (filters.search || '')) {
                applyFilter('search', searchVal);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [searchVal]);

    const dropFilter = (key) => {
        const next = { ...filters }; delete next[key];
        router.get(route('behavior.index'), next, { preserveState: true, preserveScroll: true });
    };

    const clearAll = () => router.get(route('behavior.index'));

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('behavior.store'), { onSuccess: () => { setIsModalOpen(false); reset(); } });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to remove this conduct log entry? This action cannot be undone.')) {
            router.delete(route('behavior.destroy', id), { preserveScroll: true });
        }
    };

    const summaryArr = Array.isArray(category_summary) ? category_summary : [];
    const totalLogs = summaryArr.reduce((a, c) => a + (c.count || 0), 0);
    const totalViolations = summaryArr.reduce((a, c) => !['excellence', 'leadership', 'community'].includes(c.category) ? a + (c.count || 0) : a, 0);
    const totalCommendations = summaryArr.reduce((a, c) => ['excellence', 'leadership', 'community'].includes(c.category) ? a + (c.count || 0) : a, 0);
    const activeFilters = [filters.type, filters.category, filters.section_id, filters.student_id, filters.search].filter(Boolean);
    const hasFilter = activeFilters.length > 0;
    const studentList = Array.isArray(available_students) ? available_students : [];
    const selectedStudent = filters.student_id ? studentList.find(s => String(s.id) === String(filters.student_id)) : null;

    return (
        <AppLayout title="Conduct Registry" noPadding>
            <Head title="Conduct Registry" />
            <style>{css}</style>

            <div className="cr-root">
                <div className="cr-grid" />
                <div className="cr-orb1" />
                <div className="cr-orb2" />

                <div className="cr-content">

                    {/* ── HEADER ── */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 44 }}>
                        <div>
                            <div style={{ fontFamily: 'Space Mono', fontSize: 10, fontWeight: 700, color: C.orange, textTransform: 'uppercase', letterSpacing: '.2em', marginBottom: 12 }}>
                                Student Integrity System
                            </div>
                            <h1 style={{ fontFamily: 'Playfair Display', fontSize: 50, fontWeight: 900, fontStyle: 'italic', color: C.txt, lineHeight: 1 }}>
                                Conduct <span style={{ color: C.orange }}>Registry</span>
                            </h1>
                            <p style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginTop: 10 }}>
                                College of Computing Studies · Student Integrity &amp; Merit Performance System
                            </p>
                        </div>
                        <button onClick={() => setIsModalOpen(true)}
                            style={{ fontFamily: 'DM Sans', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 24px', borderRadius: 14, background: `${C.orange}1a`, border: `1px solid ${C.orange}40`, color: C.orange, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.12em', cursor: 'pointer', transition: 'all .2s' }}
                            onMouseOver={e => e.currentTarget.style.background = `${C.orange}2e`}
                            onMouseOut={e => e.currentTarget.style.background = `${C.orange}1a`}>
                            <Plus size={14} /> Log Incident
                        </button>
                    </div>

                    {/* ── METRICS ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 28 }}>
                        {[
                            { label: 'Total Records', val: logs.total, color: C.orange, icon: <Shield size={60} /> },
                            { label: 'Violations', val: totalViolations, color: C.red, icon: <AlertCircle size={60} /> },
                            { label: 'Commendations', val: totalCommendations, color: C.green, icon: <Award size={60} /> },
                            { label: 'Categories Active', val: category_summary?.length ?? 0, color: C.amber, icon: <Filter size={60} /> },
                        ].map((s, i) => (
                            <div key={i} className="cr-stat">
                                <div className="cr-stat-label">{s.label}</div>
                                <div className="cr-stat-val" style={{ color: s.color }}>{s.val}</div>
                                <div className="cr-stat-icon" style={{ color: s.color }}>{s.icon}</div>
                            </div>
                        ))}
                    </div>

                    {/* ── DISTRIBUTION ── */}
                    {summaryArr.length > 0 && (
                        <div className="cr-dist-wrap">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontFamily: 'Space Mono', fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.15em' }}>Category Distribution</div>
                                <div style={{ fontFamily: 'Space Mono', fontSize: 9, color: C.dim }}>{totalLogs} entries</div>
                            </div>
                            <div className="cr-dist-track">
                                {summaryArr.map((cat, i) => (
                                    <div key={i} className="cr-dist-seg"
                                        onClick={() => applyFilter('category', cat.category === filters.category ? '' : cat.category)}
                                        title={`${cat.label}: ${cat.count}`}
                                        style={{ width: `${(cat.count / (totalLogs || 1)) * 100}%`, background: cat.color, minWidth: cat.count > 0 ? 3 : 0 }} />
                                ))}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                                {summaryArr.map((cat, i) => {
                                    const active = filters.category === cat.category;
                                    return (
                                        <div key={i} className="cr-cat-chip"
                                            onClick={() => applyFilter('category', active ? '' : cat.category)}
                                            style={{ background: active ? `${cat.color}18` : 'rgba(0,0,0,0.25)', borderColor: active ? `${cat.color}38` : 'rgba(255,255,255,0.05)', color: active ? cat.color : C.muted }}>
                                            <div style={{ width: 5, height: 5, borderRadius: '50%', background: cat.color }} />
                                            {cat.label}: <strong style={{ color: active ? cat.color : C.txt }}>{cat.count}</strong>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── TYPE TABS ── */}
                    <div className="cr-tabs-row">
                        {[
                            { key: '', label: 'All Records' },
                            { key: 'violation', label: '⚠ Violations' },
                            { key: 'commendation', label: '★ Commendations' },
                        ].map(t => {
                            const active = (filters.type || '') === t.key;
                            const ac = t.key === 'violation' ? C.red : t.key === 'commendation' ? C.green : C.orange;
                            return (
                                <button key={t.key} className="cr-tab" onClick={() => applyFilter('type', t.key)}
                                    style={{ background: active ? `${ac}18` : 'transparent', borderColor: active ? `${ac}3a` : C.bdr, color: active ? ac : C.muted }}>
                                    {t.label}
                                </button>
                            );
                        })}
                        {hasFilter && (
                            <button onClick={clearAll}
                                style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'Space Mono', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', padding: '7px 13px', borderRadius: 10, cursor: 'pointer', background: 'transparent', border: `1px solid ${C.bdr}`, color: C.muted, transition: 'all .2s' }}
                                onMouseOver={e => e.currentTarget.style.color = C.orange}
                                onMouseOut={e => e.currentTarget.style.color = C.muted}>
                                <X size={9} /> Clear {activeFilters.length} filter{activeFilters.length > 1 ? 's' : ''}
                            </button>
                        )}
                    </div>

                    {/* ── FILTER STRIP ── */}
                    <div className="cr-filters-row">
                        <div className="cr-fbox">
                            <Search size={14} color={C.orange} />
                            <input className="cr-finput" placeholder="Search student name, ID, category…"
                                value={searchVal}
                                onChange={e => setSearchVal(e.target.value)} />
                            {searchVal && (
                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex', padding: 0 }}
                                    onClick={() => { setSearchVal(''); applyFilter('search', ''); }}>
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                        <div className="cr-fbox">
                            <Layers size={14} color={C.orange} />
                            <select className="cr-finput" value={filters.section_id || ''} onChange={e => applyFilter('section_id', e.target.value)}>
                                <option value="">All Sections</option>
                                {sections.map(s => <option key={s.id} value={s.id}>{s.name} ({s.grade_level})</option>)}
                            </select>
                        </div>
                        <div className="cr-fbox">
                            <User size={14} color={C.orange} />
                            <select className="cr-finput" value={filters.student_id || ''} onChange={e => applyFilter('student_id', e.target.value)}>
                                <option value="">All Students</option>
                                {studentList.map(s => <option key={s.id} value={s.id}>{s.student_id} — {s.first_name} {s.last_name}</option>)}
                            </select>
                        </div>
                        <div className="cr-fbox">
                            <Filter size={14} color={C.orange} />
                            <select className="cr-finput" value={filters.category || ''} onChange={e => applyFilter('category', e.target.value)}>
                                <option value="">All Categories</option>
                                {available_categories && Object.entries(available_categories).map(([k, v]) => (
                                    <option key={k} value={k}>{v}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* ── ACTIVE FILTER TAGS ── */}
                    {hasFilter && (
                        <div className="cr-tag-row">
                            {filters.type && (
                                <div className={`cr-tag ${filters.type === 'violation' ? 'vio' : filters.type === 'commendation' ? 'com' : ''}`}>
                                    {filters.type === 'violation' ? '⚠' : filters.type === 'commendation' ? '★' : ''} {filters.type}
                                    <button onClick={() => dropFilter('type')}><X size={9} /></button>
                                </div>
                            )}
                            {filters.category && (
                                <div className="cr-tag">
                                    {available_categories?.[filters.category] || filters.category}
                                    <button onClick={() => dropFilter('category')}><X size={9} /></button>
                                </div>
                            )}
                            {filters.section_id && (
                                <div className="cr-tag">
                                    {sections.find(s => String(s.id) === String(filters.section_id))?.name || filters.section_id}
                                    <button onClick={() => dropFilter('section_id')}><X size={9} /></button>
                                </div>
                            )}
                            {filters.student_id && selectedStudent && (
                                <div className="cr-tag">
                                    {selectedStudent.first_name} {selectedStudent.last_name}
                                    <button onClick={() => dropFilter('student_id')}><X size={9} /></button>
                                </div>
                            )}
                            {filters.search && (
                                <div className="cr-tag">
                                    "{filters.search}"
                                    <button onClick={() => { setSearchVal(''); dropFilter('search'); }}><X size={9} /></button>
                                </div>
                            )}
                            <span style={{ fontFamily: 'Space Mono', fontSize: 9, color: C.dim, marginLeft: 4 }}>
                                {logs.total} result{logs.total !== 1 ? 's' : ''}
                            </span>
                        </div>
                    )}



                    {/* ══════════════════════════════════════
                        DYNAMIC TABLE CONTAINER
                    ══════════════════════════════════════ */}
                    <div className="cr-table-card shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
                        
                        {/* ── Determine View Mode ── */}
                        {(() => {
                            // Focus on logs if searching conduct-specific criteria OR 
                            // if a general search yields no identity matches (likely searching for incidents)
                            const isLogFocus = !!(filters.category || filters.type || filters.section_id || (filters.search && students.length === 0));
                            
                            if (isLogFocus) {
                                return (
                                    <>
                                        <div className="cr-result-bar bg-white/[0.01]">
                                            <div className="cr-result-label">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{ padding: '4px 10px', background: `${C.orange}15`, borderRadius: 8, color: C.orange, fontSize: 8 }}>LOG REGISTRY</div>
                                                    <span>Identified <strong style={{ color: C.txt }}>{logs.total}</strong> matching incidents for current query</span>
                                                </div>
                                            </div>
                                        </div>

                                        <table className="cr-table">
                                            <thead>
                                                <tr>
                                                    <th className="cr-th">STUDENT IDENTITY</th>
                                                    <th className="cr-th">INCIDENT CATEGORY</th>
                                                    <th className="cr-th">CLASSIFICATION</th>
                                                    <th className="cr-th">IMPACT</th>
                                                    <th className="cr-th">GRAVITY</th>
                                                    <th className="cr-th">TOTAL</th>
                                                    <th className="cr-th">TOTAL CONDUCT</th>
                                                    <th className="cr-th">RECORDED BY</th>
                                                    <th className="cr-th" style={{ textAlign: 'right' }}>ACTIONS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {logs.data.length > 0 ? (
                                                    logs.data.map((log) => {
                                                        const isVio = log.type === 'violation';
                                                        const tc = typeColor(log.type);
                                                        const tbg = typeBg(log.type);
                                                        const tbdr = typeBdr(log.type);
                                                        const sc = sevColor(log.severity);
                                                        const sbg = sevBg(log.severity);
                                                        const sbdr = sevBdr(log.severity);
                                                        const student = log.student || { first_name: '?', last_name: 'Unknown', student_id: 'N/A' };
                                                        const init = ((student.first_name?.[0] || '') + (student.last_name?.[0] || '')).toUpperCase() || '?';
                                                        const conduct = student.conduct_score?.total_score ?? 100;
                                                        const cc = conductColor(conduct);
                                                        const pct = Math.min(Math.max(Math.abs(log.points) * 10, 20), 100);
                                                        const sIcon = log.severity === 'high' ? <AlertCircle size={10} /> : log.severity === 'medium' ? <Shield size={10} /> : <CheckCircle size={10} />;
                                                        return (
                                                            <tr key={log.id} className={`cr-row ${isVio ? 'is-vio' : 'is-com'}`}>
                                                                <td className="cr-td">
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                                                        <div className="cr-avatar">{init}</div>
                                                                        <div>
                                                                            <div className="cr-name-main">{student.first_name} {student.last_name}</div>
                                                                            <div className="cr-name-id">{student.student_id}</div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="cr-td">
                                                                    <div className="cr-cat-name" style={{ color: C.txt }}>{log.category?.replace(/_/g, ' ')}</div>
                                                                    <div className="cr-desc-snip" style={{ color: C.muted }}>{log.description}</div>
                                                                </td>
                                                                <td className="cr-td">
                                                                    <Badge bg={tbg} bdr={tbdr} color={tc}>
                                                                        <Dot color={tc} /> {log.type}
                                                                    </Badge>
                                                                </td>
                                                                <td className="cr-td">
                                                                    <div className="cr-impact" style={{ color: tc }}>
                                                                        {isVio ? (log.points < 0 ? log.points : `-${log.points}`) : `+${Math.abs(log.points)}`}
                                                                    </div>
                                                                    <div className="cr-impact-bar" style={{ background: `${tc}10` }}>
                                                                        <div className="cr-impact-fill" style={{ width: `${pct}%`, background: tc }} />
                                                                    </div>
                                                                </td>
                                                                <td className="cr-td">
                                                                    <Badge bg={sbg} bdr={sbdr} color={sc}>
                                                                        {sIcon} {log.severity}
                                                                    </Badge>
                                                                </td>
                                                                <td className="cr-td">
                                                                    <div className="cr-dot-pill" style={{ background: `${tc}08`, borderColor: `${tc}15` }}>
                                                                        <Dot color={tc} /> <span style={{ color: tc }}>{log.points}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="cr-td">
                                                                    <div style={{ fontFamily: 'Playfair Display', fontSize: 24, fontWeight: 900, fontStyle: 'italic', color: cc }}>{conduct}</div>
                                                                    <div style={{ fontSize: 8, fontWeight: 700, color: `${cc}60`, textTransform: 'uppercase', letterSpacing: '.05em' }}>Current Unit</div>
                                                                </td>
                                                                <td className="cr-td">
                                                                    <div style={{ fontFamily: 'Space Mono', fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase' }}>{log.logger?.name || 'ADMIN'}</div>
                                                                </td>
                                                                <td className="cr-td" style={{ textAlign: 'right' }}>
                                                                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                                                        <button className="cr-action view" onClick={() => router.visit(route('conduct.student', log.student_id))} title="Timeline">
                                                                            <ExternalLink size={14} />
                                                                        </button>
                                                                        <button className="cr-action del" onClick={() => handleDelete(log.id)} title="Delete">
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td className="cr-td" colSpan="9">
                                                            <div className="cr-empty" style={{ padding: '80px 40px' }}>
                                                                <Filter size={32} color={C.orange} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                                                                <h3 className="cr-empty-title">No matching incident logs</h3>
                                                                <p className="cr-empty-sub">Try adjusting category or classification filters</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </>
                                );
                            }

                            // Default Focus: Finding Students (3 Column Browser)
                            return (
                                <>
                                    <div className="cr-result-bar bg-white/[0.01]">
                                        <div className="cr-result-label">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ padding: '4px 10px', background: `${C.orange}15`, borderRadius: 8, color: C.orange, fontSize: 8 }}>STUDENT BROWSER</div>
                                                <span>Showing <strong style={{ color: C.txt }}>{students.length}</strong> matched identities</span>
                                            </div>
                                        </div>
                                    </div>
                                    <table className="cr-quick-table">
                                        <thead>
                                            <tr>
                                                <th className="cr-quick-th">STUDENT IDENTITY</th>
                                                <th className="cr-quick-th">ID NUMBER</th>
                                                <th className="cr-quick-th" style={{ textAlign: 'right' }}>ACTION PORTAL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.length > 0 ? (
                                                students.map(s => {
                                                    const init = ((s.first_name?.[0] || '') + (s.last_name?.[0] || '')).toUpperCase() || '?';
                                                    return (
                                                        <tr key={s.id} className="cr-quick-row">
                                                            <td className="cr-quick-td">
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                                                    <div className="cr-quick-avatar" style={{ width: 48, height: 48, borderRadius: 18 }}>{init}</div>
                                                                    <div>
                                                                        <div className="text-[16px] font-bold text-white/90 group-hover:text-white transition-colors">{s.first_name} {s.last_name}</div>
                                                                        <div className="cr-quick-verified" style={{ fontSize: 10 }}>Institutional Identity Verified</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="cr-quick-td">
                                                                <div className="cr-quick-id" style={{ fontSize: 13, letterSpacing: '.25em' }}>{s.student_id}</div>
                                                            </td>
                                                            <td className="cr-quick-td" style={{ textAlign: 'right' }}>
                                                                <button className="cr-open-btn px-6 py-3" onClick={() => router.visit(route('conduct.student', s.id))}>
                                                                    <ExternalLink size={14} /> Open Full Timeline
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="cr-td">
                                                        <div className="cr-empty">
                                                            <Search size={32} color={C.orange} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                                                            <h3 className="cr-empty-title">Student not found</h3>
                                                            <p className="cr-empty-sub">Check if the ID number or name spelling is correct.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </>
                            );
                        })()}
                    </div>

                    {/* ── PAGINATION ── */}
                    {logs.last_page > 1 && (
                        <div className="cr-pg">
                            <button className="cr-pg-btn" disabled={!logs.prev_page_url} onClick={() => router.get(logs.prev_page_url, {}, { preserveState: true })}>
                                <ChevronLeft size={13} />
                            </button>
                            {Array.from({ length: Math.min(logs.last_page, 7) }, (_, i) => i + 1).map(page => (
                                <button key={page} className={`cr-pg-btn${logs.current_page === page ? ' active' : ''}`}
                                    onClick={() => router.get(route('behavior.index'), { ...filters, page }, { preserveState: true })}>
                                    {page}
                                </button>
                            ))}
                            {logs.last_page > 7 && <span style={{ color: C.muted, fontSize: 12 }}>…</span>}
                            <button className="cr-pg-btn" disabled={!logs.next_page_url} onClick={() => router.get(logs.next_page_url, {}, { preserveState: true })}>
                                <ChevronRight size={13} />
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {/* ══ MODAL ══ */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="lg">
                <div className="cr-modal">
                    <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.bdr}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: `linear-gradient(to right,${C.orange}0d,transparent)` }}>
                        <div>
                            <div style={{ fontFamily: 'Space Mono', fontSize: 9, fontWeight: 700, color: C.orange, textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 6 }}>Conduct System</div>
                            <h3 style={{ fontFamily: 'Playfair Display', fontSize: 22, fontWeight: 900, fontStyle: 'italic', color: C.txt }}>Log Incident</h3>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} style={{ width: 32, height: 32, borderRadius: 9, background: C.surf2, border: `1px solid ${C.bdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, cursor: 'pointer' }}>
                            <X size={14} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {/* Type toggle */}
                        <div className="cr-type-toggle">
                            {['violation', 'commendation'].map(t => (
                                <button key={t} type="button" onClick={() => setData('type', t)} className="cr-type-btn"
                                    style={{ background: data.type === t ? (t === 'violation' ? `${C.red}18` : `${C.green}18`) : 'transparent', borderColor: data.type === t ? (t === 'violation' ? `${C.red}35` : `${C.green}35`) : C.bdr, color: data.type === t ? (t === 'violation' ? C.red : C.green) : C.muted }}>
                                    {t === 'violation' ? '⚠ Violation' : '★ Commendation'}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <label className="cr-lbl">Student</label>
                                <select className="cr-input" value={data.student_id} onChange={e => setData('student_id', e.target.value)}>
                                    <option value="">Select student…</option>
                                    {studentList.map(s => <option key={s.id} value={s.id}>{s.student_id} | {s.first_name} {s.last_name}</option>)}
                                </select>
                                {errors.student_id && <div style={{ fontSize: 9, color: C.red, marginTop: 4, fontWeight: 700 }}>{errors.student_id}</div>}
                            </div>
                            <div>
                                <label className="cr-lbl">Incident Date</label>
                                <input type="date" className="cr-input cr-date" value={data.date} onChange={e => setData('date', e.target.value)} />
                                {errors.date && <div style={{ fontSize: 9, color: C.red, marginTop: 4, fontWeight: 700 }}>{errors.date}</div>}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <label className="cr-lbl">Category</label>
                                <select className="cr-input" value={data.category} onChange={e => setData('category', e.target.value)}>
                                    {available_categories && Object.entries(available_categories).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="cr-lbl">Severity</label>
                                <select className="cr-input" value={data.severity} onChange={e => setData('severity', e.target.value)}>
                                    <option value="low">Low — Standard</option>
                                    <option value="medium">Medium — Intermediate</option>
                                    <option value="high">High — Critical</option>
                                </select>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 7 }}>
                                    <div style={{ flex: 1, height: 3, borderRadius: 2, background: C.faint, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: data.severity === 'low' ? '33%' : data.severity === 'medium' ? '66%' : '100%', background: sevColor(data.severity), transition: 'width .3s,background .3s' }} />
                                    </div>
                                    <span style={{ fontFamily: 'Space Mono', fontSize: 8, fontWeight: 700, color: sevColor(data.severity), textTransform: 'uppercase', letterSpacing: '.05em', minWidth: 36 }}>{data.severity}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="cr-lbl">Factual Description</label>
                            <textarea className="cr-input" style={{ height: 90, resize: 'none' }} value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Provide a factual account of the incident or merit performance…" />
                            {errors.description && <div style={{ fontSize: 9, color: C.red, marginTop: 4, fontWeight: 700 }}>{errors.description}</div>}
                        </div>

                        <button type="submit" disabled={processing}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '14px', borderRadius: 14, background: processing ? `${C.orange}12` : `${C.orange}1a`, border: `1px solid ${C.orange}38`, color: C.orange, fontFamily: 'DM Sans', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', cursor: processing ? 'not-allowed' : 'pointer', transition: 'all .2s' }}
                            onMouseOver={e => { if (!processing) e.currentTarget.style.background = `${C.orange}2e`; }}
                            onMouseOut={e => e.currentTarget.style.background = processing ? `${C.orange}12` : `${C.orange}1a`}>
                            <Save size={14} /> {processing ? 'Recording…' : 'Authorize Log Entry'}
                        </button>
                    </form>
                </div>
            </Modal>
        </AppLayout>
    );
}