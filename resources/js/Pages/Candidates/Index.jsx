import React, { useState, useCallback } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm, router, usePage, Link } from '@inertiajs/react';
import {
    UserPlus, Search, CheckCircle2, XCircle, RefreshCcw,
    ChevronRight, Users, Hourglass, ShieldCheck, Star,
    AlertTriangle, Mail, Phone, Copy, Check, Eye,
    ClipboardList, Plus, X
} from 'lucide-react';
import Modal from '@/Components/Modal';

/* ── Palette ── */
const C = {
    bg: '#0c0805', surf: '#160e08', surf2: '#1c1208', bdr: '#2a1508', bdr2: '#3a1e0a',
    orange: '#f97316', o2: '#fb923c', o3: '#fdba74', o4: '#c2410c',
    txt: '#fef3ec', muted: 'rgba(254,243,236,0.45)', dim: 'rgba(254,243,236,0.22)',
    faint: 'rgba(254,243,236,0.08)',
};

/* ── Status config ── */
const SC = {
    pending: { color: '#fdba74', bg: 'rgba(253,186,116,0.10)', border: 'rgba(253,186,116,0.25)', dot: '#fdba74', label: 'Pending', Icon: Hourglass },
    form_submitted: { color: '#fb923c', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.30)', dot: '#f97316', label: 'Form Submitted', Icon: ClipboardList },
    accepted: { color: '#34d399', bg: 'rgba(52,211,153,0.10)', border: 'rgba(52,211,153,0.28)', dot: '#34d399', label: 'Accepted', Icon: CheckCircle2 },
    rejected: { color: '#f87171', bg: 'rgba(239,68,68,0.10)', border: 'rgba(239,68,68,0.28)', dot: '#f87171', label: 'Rejected', Icon: XCircle },
    enrolled: { color: '#f97316', bg: 'rgba(249,115,22,0.16)', border: 'rgba(249,115,22,0.38)', dot: '#f97316', label: 'Enrolled', Icon: Star },
};

const YEAR_LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const STRANDS = []; // Dynamically populated from props

/* ══════════════════ STYLES ══════════════════ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
.cr-root{background:${C.bg};min-height:100%;flex:1;display:flex;flex-direction:column;font-family:'DM Sans',sans-serif;color:${C.txt};padding:28px 32px 56px;position:relative;overflow:hidden;}
.cr-grid{position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(249,115,22,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.022) 1px,transparent 1px);background-size:48px 48px;}
.cr-glow1{position:fixed;top:-8%;right:-4%;width:480px;height:480px;background:radial-gradient(circle,rgba(249,115,22,0.055) 0%,transparent 65%);border-radius:50%;pointer-events:none;z-index:0;}
.cr-glow2{position:fixed;bottom:-6%;left:28%;width:340px;height:340px;background:radial-gradient(circle,rgba(194,65,12,0.04) 0%,transparent 65%);border-radius:50%;pointer-events:none;z-index:0;}
.cr-content{position:relative;z-index:1;}
/* Header */
.cr-hdr{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:22px;gap:16px;}
.cr-tags{display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;}
.cr-tag{font-size:9px;font-weight:700;padding:2px 9px;border-radius:4px;letter-spacing:.08em;text-transform:uppercase;}
.cr-title{font-family:'Playfair Display',serif;font-size:30px;font-weight:900;color:${C.txt};line-height:1;letter-spacing:-.02em;}
.cr-title em{color:${C.orange};font-style:italic;display:block;}
.cr-sub{font-size:11px;color:${C.dim};margin-top:5px;font-style:italic;}
.cr-add-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:10px;background:linear-gradient(135deg,${C.orange},${C.o4});border:none;color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;cursor:pointer;transition:all .2s;font-family:inherit;box-shadow:0 4px 14px rgba(249,115,22,0.3);white-space:nowrap;}
.cr-add-btn:hover{transform:translateY(-1px);box-shadow:0 7px 20px rgba(249,115,22,0.4);}
/* Pipeline */
.cr-pipeline{display:flex;align-items:center;gap:11px;background:${C.surf};border:1px solid ${C.bdr};border-radius:12px;padding:12px 18px;flex-shrink:0;}
.cr-pipe-val{font-family:'Playfair Display',serif;font-size:26px;font-weight:900;color:${C.txt};line-height:1;}
.cr-pipe-lbl{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:${C.dim};margin-bottom:2px;}
/* Stat cards */
.cr-stats{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:20px;}
.cr-stat{background:linear-gradient(145deg,rgba(249,115,22,0.07),rgba(0,0,0,0.38));border:1px solid ${C.bdr};border-radius:13px;padding:14px 15px;position:relative;overflow:hidden;transition:border-color .22s,transform .18s;}
.cr-stat:hover{border-color:rgba(249,115,22,0.32);transform:translateY(-1px);}
.cr-stat::after{content:'';position:absolute;top:-28px;right:-28px;width:72px;height:72px;border-radius:50%;background:rgba(249,115,22,0.07);transition:transform .35s;}
.cr-stat:hover::after{transform:scale(1.7);}
.cr-stat-icon{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;margin-bottom:9px;position:relative;z-index:1;}
.cr-stat-val{font-family:'Space Mono',monospace;font-size:22px;font-weight:700;color:${C.txt};line-height:1;position:relative;z-index:1;}
.cr-stat-lbl{font-size:9px;font-weight:700;color:${C.muted};margin-top:4px;text-transform:uppercase;letter-spacing:.07em;position:relative;z-index:1;}
.cr-stat-bar{height:2px;background:rgba(249,115,22,0.1);border-radius:1px;margin-top:10px;overflow:hidden;position:relative;z-index:1;}
.cr-stat-bar-fill{height:100%;border-radius:1px;}
/* Table card */
.cr-card{background:${C.surf};border:1px solid ${C.bdr};border-radius:14px;overflow:hidden;margin-bottom:16px;}
.cr-card-hdr{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid ${C.bdr};}
.cr-card-title{font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:${C.txt};}
.cr-card-sub{font-size:10px;color:${C.dim};margin-top:1px;}
.cr-badge{font-family:'Space Mono',monospace;font-size:11px;font-weight:700;color:${C.orange};background:rgba(249,115,22,0.1);border:1px solid rgba(249,115,22,0.22);padding:3px 11px;border-radius:99px;}
table.cr-table{width:100%;border-collapse:collapse;}
.cr-table thead tr{border-bottom:1px solid ${C.bdr};}
.cr-table th{padding:10px 18px;text-align:left;font-size:8px;font-weight:700;letter-spacing:.14em;color:rgba(249,115,22,0.42);text-transform:uppercase;background:rgba(249,115,22,0.03);white-space:nowrap;}
.cr-table th:last-child{text-align:right;}
.cr-row{border-bottom:1px solid rgba(249,115,22,0.05);transition:background .14s;}
.cr-row:hover{background:rgba(249,115,22,0.04);}
.cr-row:last-child{border-bottom:none;}
.cr-td{padding:13px 18px;vertical-align:middle;}
.cr-avatar{width:38px;height:38px;border-radius:10px;background:rgba(249,115,22,0.16);border:1px solid rgba(249,115,22,0.3);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:${C.orange};font-family:'Space Mono',monospace;flex-shrink:0;transition:transform .18s;}
.cr-row:hover .cr-avatar{transform:scale(1.08);}
.cr-name{font-family:'Playfair Display',serif;font-size:13px;font-weight:700;font-style:italic;color:${C.txt};text-decoration:none;}
.cr-date{font-size:8px;color:${C.dim};text-transform:uppercase;letter-spacing:.08em;margin-top:2px;font-weight:700;}
.cr-code-pill{font-family:'Space Mono',monospace;font-size:9px;font-weight:700;color:${C.o2};background:rgba(249,115,22,0.10);border:1px solid rgba(249,115,22,0.22);padding:4px 10px;border-radius:6px;cursor:pointer;transition:all .18s;display:inline-flex;align-items:center;gap:5px;user-select:all;}
.cr-code-pill:hover{background:rgba(249,115,22,0.18);border-color:rgba(249,115,22,0.4);}
.cr-grade{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:${C.muted};background:rgba(249,115,22,0.07);border:1px solid ${C.bdr};padding:3px 10px;border-radius:99px;font-family:'Space Mono',monospace;white-space:nowrap;}
.cr-status{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:8px;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;}
.cr-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;}
.cr-actions{display:flex;align-items:center;justify-content:flex-end;gap:6px;flex-wrap:nowrap;}
.cr-btn-ghost{height:32px;padding:0 12px;border-radius:8px;background:rgba(249,115,22,0.08);border:1px solid rgba(249,115,22,0.28);color:#fb923c;cursor:pointer;display:inline-flex;align-items:center;gap:5px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;transition:all .2s;font-family:inherit;white-space:nowrap;box-shadow:0 2px 8px rgba(249,115,22,0.1);}
.cr-btn-ghost:hover{color:#fff;background:linear-gradient(135deg,#f97316,#c2410c);border-color:#f97316;box-shadow:0 4px 14px rgba(249,115,22,0.35);transform:translateY(-1px);}
.cr-btn-decide{height:32px;padding:0 12px;border-radius:8px;background:rgba(251,146,60,0.10);border:1px solid rgba(251,146,60,0.32);color:#fb923c;cursor:pointer;display:inline-flex;align-items:center;gap:5px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;transition:all .2s;font-family:inherit;white-space:nowrap;box-shadow:0 2px 8px rgba(251,146,60,0.10);}
.cr-btn-decide:hover{color:#fff;background:linear-gradient(135deg,#fb923c,#c2410c);border-color:#fb923c;box-shadow:0 4px 14px rgba(251,146,60,0.38);transform:translateY(-1px);}
.cr-btn-green{height:32px;padding:0 12px;border-radius:8px;background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.28);color:#34d399;cursor:pointer;display:inline-flex;align-items:center;gap:5px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;transition:all .18s;font-family:inherit;white-space:nowrap;}
.cr-btn-green:hover{background:#34d399;color:#0c0805;box-shadow:0 3px 12px rgba(52,211,153,0.32);}
.cr-btn-icon{width:32px;height:32px;border-radius:8px;background:transparent;border:1px solid ${C.bdr};color:${C.dim};cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .16s;}
.cr-btn-icon:hover{color:${C.orange};background:rgba(249,115,22,0.1);border-color:rgba(249,115,22,0.3);}
/* Empty */
.cr-empty{padding:60px 0;text-align:center;}
.cr-empty-icon{width:60px;height:60px;border-radius:16px;background:rgba(249,115,22,0.08);border:1px solid rgba(249,115,22,0.15);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;}
.cr-empty-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;font-style:italic;color:${C.muted};margin-bottom:5px;}
.cr-empty-sub{font-size:11px;color:${C.dim};}
/* Flash */
.cr-flash{display:flex;align-items:center;gap:14px;border-radius:12px;padding:14px 20px;margin-bottom:20px;}
.cr-flash-green{background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.22);}
.cr-flash-red{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);}
/* Modal */
.cr-modal{background:${C.surf};border:1px solid ${C.bdr};border-radius:18px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.7),0 0 0 1px rgba(249,115,22,0.1);font-family:'DM Sans',sans-serif;}
.cr-mhdr{padding:20px 24px 16px;border-bottom:1px solid ${C.bdr};background:linear-gradient(135deg,rgba(249,115,22,0.07),rgba(0,0,0,0.3));position:relative;overflow:hidden;}
.cr-mhdr::before{content:'';position:absolute;top:-40px;right:-40px;width:120px;height:120px;border-radius:50%;background:rgba(249,115,22,0.08);}
.cr-meyebrow{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.18em;color:rgba(249,115,22,0.5);margin-bottom:6px;}
.cr-mtitle{font-family:'Playfair Display',serif;font-size:22px;font-weight:900;font-style:italic;color:${C.txt};letter-spacing:-.01em;line-height:1;position:relative;z-index:1;}
.cr-msub{font-size:10px;color:${C.muted};margin-top:5px;position:relative;z-index:1;}
.cr-mbody{padding:20px 24px;display:flex;flex-direction:column;gap:14px;}
.cr-mfooter{padding:14px 24px 20px;display:flex;align-items:center;justify-content:flex-end;gap:10px;border-top:1px solid ${C.bdr};}
.cr-lbl{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:rgba(249,115,22,0.45);display:block;margin-bottom:6px;}
.cr-input{width:100%;background:rgba(249,115,22,0.06);border:1px solid ${C.bdr};border-radius:9px;color:${C.txt};font-size:13px;padding:11px 14px;outline:none;font-family:inherit;transition:border-color .18s;}
.cr-input:focus{border-color:rgba(249,115,22,0.45);}
.cr-input::placeholder{color:${C.dim};}
.cr-select{width:100%;background:rgba(249,115,22,0.06);border:1px solid ${C.bdr};border-radius:9px;color:${C.txt};font-size:13px;padding:11px 14px;outline:none;cursor:pointer;font-family:inherit;transition:border-color .18s;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(249,115,22,0.5)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:36px;}
.cr-select:focus{border-color:rgba(249,115,22,0.45);}
.cr-select option{background:${C.surf2};color:${C.txt};}
.cr-textarea{width:100%;background:rgba(249,115,22,0.06);border:1px solid ${C.bdr};border-radius:9px;color:${C.txt};font-size:13px;padding:11px 14px;outline:none;font-family:inherit;resize:vertical;min-height:90px;transition:border-color .18s;line-height:1.6;}
.cr-textarea:focus{border-color:rgba(249,115,22,0.45);}
.cr-textarea::placeholder{color:${C.dim};}
.cr-2col{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.cr-err{color:#f87171;font-size:10px;margin-top:4px;}
.cr-cancel-btn{padding:9px 18px;border-radius:9px;background:transparent;border:1px solid ${C.bdr};color:${C.muted};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;cursor:pointer;transition:all .18s;font-family:inherit;}
.cr-cancel-btn:hover{color:${C.txt};border-color:rgba(249,115,22,0.28);}
.cr-commit-btn{padding:9px 24px;border-radius:9px;background:linear-gradient(135deg,${C.orange},${C.o4});border:none;color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;cursor:pointer;transition:all .2s;font-family:inherit;display:flex;align-items:center;gap:7px;box-shadow:0 4px 14px rgba(249,115,22,0.3);}
.cr-commit-btn:hover{transform:translateY(-1px);box-shadow:0 7px 20px rgba(249,115,22,0.4);}
.cr-commit-btn:disabled{opacity:.5;cursor:not-allowed;transform:none;}
/* Code box inside modal */
.cr-code-box{display:flex;align-items:center;justify-content:space-between;background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.25);border-radius:10px;padding:12px 16px;margin-top:4px;}
.cr-code-big{font-family:'Space Mono',monospace;font-size:20px;font-weight:700;color:#34d399;letter-spacing:.08em;}
.cr-copy-btn{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:7px;background:rgba(52,211,153,0.12);border:1px solid rgba(52,211,153,0.28);color:#34d399;font-size:9px;font-weight:700;text-transform:uppercase;cursor:pointer;font-family:inherit;transition:all .18s;}
.cr-copy-btn:hover{background:rgba(52,211,153,0.22);}
/* Status toggle */
.cr-toggle-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.cr-toggle{padding:14px;border-radius:10px;border:2px solid transparent;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;transition:all .18s;display:flex;align-items:center;justify-content:center;gap:8px;}
.cr-toggle-accept{background:rgba(52,211,153,0.08);border-color:rgba(52,211,153,0.2);color:rgba(52,211,153,0.6);}
.cr-toggle-accept.active,.cr-toggle-accept:hover{background:rgba(52,211,153,0.14);border-color:#34d399;color:#34d399;}
.cr-toggle-reject{background:rgba(239,68,68,0.08);border-color:rgba(239,68,68,0.2);color:rgba(239,68,68,0.6);}
.cr-toggle-reject.active,.cr-toggle-reject:hover{background:rgba(239,68,68,0.14);border-color:#f87171;color:#f87171;}
/* Form preview */
.cr-preview-section{margin-bottom:20px;}
.cr-preview-section-title{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:rgba(249,115,22,0.5);border-bottom:1px solid ${C.bdr};padding-bottom:8px;margin-bottom:12px;}
.cr-preview-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.cr-preview-field{background:rgba(249,115,22,0.04);border:1px solid ${C.bdr};border-radius:8px;padding:10px 12px;}
.cr-preview-field-lbl{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:rgba(249,115,22,0.4);margin-bottom:4px;}
.cr-preview-field-val{font-size:12px;color:${C.txt};font-weight:500;}
.cr-preview-tag{display:inline-block;background:rgba(249,115,22,0.1);border:1px solid rgba(249,115,22,0.2);color:${C.o2};font-size:9px;font-weight:700;padding:2px 8px;border-radius:5px;margin:2px;}
/* Candidate snapshot strip */
.cr-strip{background:rgba(249,115,22,0.06);border:1px solid rgba(249,115,22,0.15);border-radius:10px;padding:12px 14px;display:flex;align-items:center;gap:12px;}
/* Animations */
@keyframes cr-up{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:none;}}
.cr-fade{animation:cr-up .36s ease both;}
.cr-d1{animation-delay:.04s;}.cr-d2{animation-delay:.09s;}.cr-d3{animation-delay:.14s;}
/* Pagination */
.cr-pagination{display:flex;justify-content:center;gap:6px;padding:16px 20px;border-top:1px solid ${C.bdr};}
.cr-page-btn{padding:5px 12px;border-radius:7px;font-size:11px;font-weight:700;font-family:'Space Mono',monospace;text-decoration:none;border:1px solid ${C.bdr};color:${C.muted};transition:all .18s;}
.cr-page-btn.active{background:${C.orange};color:#fff;border-color:${C.orange};}
.cr-page-btn:not(.active):hover{border-color:rgba(249,115,22,0.3);color:${C.orange};}
`;

/* ══════════════════ HELPERS ══════════════════ */
function CandidateStrip({ c }) {
    const sc = SC[c.status] || SC.pending;
    return (
        <div className="cr-strip">
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(249,115,22,0.18)', border: '1px solid rgba(249,115,22,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#f97316', fontFamily: "'Space Mono',monospace", flexShrink: 0 }}>
                {c.first_name?.[0]}{c.last_name?.[0]}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontWeight: 700, fontStyle: 'italic', color: C.txt }}>
                    {c.first_name} {c.last_name}
                </div>
                <div style={{ fontSize: 9, color: C.dim, textTransform: 'uppercase', letterSpacing: '.07em', fontWeight: 700, marginTop: 2 }}>
                    {c.year_level_applied}{c.strand ? ` · ${c.strand}` : ''} · {c.registration_code}
                </div>
            </div>
            <span className="cr-status" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                <span className="cr-dot" style={{ background: sc.dot }} />
                {sc.label}
            </span>
        </div>
    );
}

/* ══════════════════ ADD CANDIDATE MODAL ══════════════════ */
function AddCandidateModal({ show, onClose, flash, programs = [] }) {
    const form = useForm({ first_name: '', last_name: '', email: '', phone: '', year_level_applied: '', strand: '' });
    const [copied, setCopied] = useState(false);
    const [doneBanner, setDoneBanner] = useState(null);

    // When flash.code arrives (after back()->with), show success banner
    React.useEffect(() => {
        if (flash?.code && show) setDoneBanner(flash.code);
    }, [flash?.code]);

    const submit = (e) => {
        e.preventDefault();
        form.post(route('candidates.store'), {
            onSuccess: () => { form.reset(); },
        });
    };

    const copyCode = () => {
        if (!doneBanner) return;
        navigator.clipboard?.writeText(doneBanner);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClose = () => { setDoneBanner(null); form.reset(); onClose(); };

    return (
        <Modal show={show} onClose={handleClose} maxWidth="lg">
            <div className="cr-modal">
                <div className="cr-mhdr">
                    <div className="cr-meyebrow">Candidate Registry · New Entry</div>
                    <div className="cr-mtitle">Add Candidate</div>
                    <div className="cr-msub">A unique REG-XXXX code will be generated automatically</div>
                </div>

                {doneBanner ? (
                    <>
                        <div className="cr-mbody">
                            <div style={{ textAlign: 'center', padding: '8px 0' }}>
                                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                                    <CheckCircle2 size={24} color="#34d399" />
                                </div>
                                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, fontStyle: 'italic', color: C.txt, marginBottom: 6 }}>Candidate Added!</div>
                                <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>
                                    Give this registration code to the student so they can fill out their profile form.
                                </div>
                                <div className="cr-code-box" style={{ justifyContent: 'center', gap: 16 }}>
                                    <span className="cr-code-big">{doneBanner}</span>
                                    <button className="cr-copy-btn" onClick={copyCode}>
                                        {copied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="cr-mfooter">
                            <button className="cr-commit-btn" onClick={handleClose}>Done</button>
                        </div>
                    </>
                ) : (
                    <form onSubmit={submit}>
                        <div className="cr-mbody">
                            <div className="cr-2col">
                                <div>
                                    <label className="cr-lbl">First Name *</label>
                                    <input id="add-first" className="cr-input" value={form.data.first_name} onChange={e => form.setData('first_name', e.target.value)} placeholder="e.g. Juan" required />
                                    {form.errors.first_name && <div className="cr-err">{form.errors.first_name}</div>}
                                </div>
                                <div>
                                    <label className="cr-lbl">Last Name *</label>
                                    <input id="add-last" className="cr-input" value={form.data.last_name} onChange={e => form.setData('last_name', e.target.value)} placeholder="e.g. Dela Cruz" required />
                                    {form.errors.last_name && <div className="cr-err">{form.errors.last_name}</div>}
                                </div>
                            </div>
                            <div className="cr-2col">
                                <div>
                                    <label className="cr-lbl">Email <span style={{ opacity: .5 }}>(optional)</span></label>
                                    <input id="add-email" className="cr-input" type="email" value={form.data.email} onChange={e => form.setData('email', e.target.value)} placeholder="juan@example.com" />
                                    {form.errors.email && <div className="cr-err">{form.errors.email}</div>}
                                </div>
                                <div>
                                    <label className="cr-lbl">Phone <span style={{ opacity: .5 }}>(optional)</span></label>
                                    <input id="add-phone" className="cr-input" value={form.data.phone} onChange={e => form.setData('phone', e.target.value)} placeholder="09XX XXX XXXX" />
                                </div>
                            </div>
                            <div className="cr-2col">
                                <div>
                                    <label className="cr-lbl">Year Level Applied *</label>
                                    <select id="add-year" className="cr-select" value={form.data.year_level_applied} onChange={e => form.setData('year_level_applied', e.target.value)} required>
                                        <option value="">Select level…</option>
                                        {YEAR_LEVELS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                    {form.errors.year_level_applied && <div className="cr-err">{form.errors.year_level_applied}</div>}
                                </div>
                                <div>
                                    <label className="cr-lbl">Applied Program <span style={{ opacity: .5 }}>(optional)</span></label>
                                    <select id="add-strand" className="cr-select" value={form.data.strand} onChange={e=>form.setData('strand',e.target.value)}>
                                        <option value="">None / N/A</option>
                                        {programs.map(p=><option key={p.id} value={p.code}>{p.code} - {p.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="cr-mfooter">
                            <button type="button" className="cr-cancel-btn" onClick={handleClose}>Cancel</button>
                            <button type="submit" className="cr-commit-btn" disabled={form.processing}>
                                {form.processing ? <><RefreshCcw size={13} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : <><Plus size={13} /> Register Candidate</>}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    );
}

/* ══════════════════ STATUS MODAL ══════════════════ */
function StatusModal({ show, onClose, candidate }) {
    const form = useForm({ status: 'accepted', remarks: '' });

    React.useEffect(() => {
        if (show) form.reset();
    }, [show]);

    const submit = (e) => {
        e.preventDefault();
        if (!candidate) return;
        form.patch(route('candidates.updateStatus', candidate.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <div className="cr-modal">
                <div className="cr-mhdr">
                    <div className="cr-meyebrow">Candidate Registry · Decision Gateway</div>
                    <div className="cr-mtitle">Accept or Reject</div>
                    {candidate && <div className="cr-msub">Processing: <strong style={{ color: '#fb923c' }}>{candidate.first_name} {candidate.last_name}</strong></div>}
                </div>
                <form onSubmit={submit}>
                    <div className="cr-mbody">
                        {candidate && <CandidateStrip c={candidate} />}
                        <div>
                            <label className="cr-lbl">Decision</label>
                            <div className="cr-toggle-row">
                                <button type="button" className={`cr-toggle cr-toggle-accept${form.data.status === 'accepted' ? ' active' : ''}`} onClick={() => form.setData('status', 'accepted')}>
                                    <CheckCircle2 size={15} /> Accept
                                </button>
                                <button type="button" className={`cr-toggle cr-toggle-reject${form.data.status === 'rejected' ? ' active' : ''}`} onClick={() => form.setData('status', 'rejected')}>
                                    <XCircle size={15} /> Reject
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="cr-lbl">Remarks <span style={{ opacity: .5 }}>(optional)</span></label>
                            <textarea id="status-remarks" className="cr-textarea" value={form.data.remarks} onChange={e => form.setData('remarks', e.target.value)} placeholder="Internal notes on this decision…" />
                        </div>
                        {form.data.status && SC[form.data.status] && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 13px', borderRadius: 9, background: SC[form.data.status].bg, border: `1px solid ${SC[form.data.status].border}` }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: SC[form.data.status].dot, flexShrink: 0 }} />
                                <span style={{ fontSize: 10, fontWeight: 700, color: SC[form.data.status].color, textTransform: 'uppercase', letterSpacing: '.08em' }}>
                                    Will be set to: {SC[form.data.status].label}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="cr-mfooter">
                        <button type="button" className="cr-cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="cr-commit-btn" disabled={form.processing}>
                            {form.processing ? <><RefreshCcw size={13} style={{ animation: 'spin 1s linear infinite' }} /> Processing…</> : <><ShieldCheck size={13} /> Commit Decision</>}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

/* ══════════════════ FORM PREVIEW MODAL ══════════════════ */
function FormPreviewModal({ show, onClose, candidate }) {
    const fd = candidate?.form_data;

    const Field = ({ label, value, full }) => (
        <div className="cr-preview-field" style={full ? { gridColumn: '1/-1' } : {}}>
            <div className="cr-preview-field-lbl">{label}</div>
            <div className="cr-preview-field-val">{value || <span style={{ opacity: .35 }}>—</span>}</div>
        </div>
    );

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="cr-modal">
                <div className="cr-mhdr">
                    <div className="cr-meyebrow">Candidate Registry · Submitted Form</div>
                    <div className="cr-mtitle">Form Preview</div>
                    {candidate && <div className="cr-msub"><strong style={{ color: '#fb923c' }}>{candidate.first_name} {candidate.last_name}</strong> · {candidate.registration_code}</div>}
                </div>
                <div className="cr-mbody" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {!fd ? (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                                <ClipboardList size={22} color="rgba(249,115,22,0.4)" />
                            </div>
                            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, fontStyle: 'italic', color: C.muted, marginBottom: 5 }}>Form not yet submitted</div>
                            <div style={{ fontSize: 11, color: C.dim }}>The student has not completed their registration form yet.</div>
                        </div>
                    ) : (
                        <>
                            <div className="cr-preview-section">
                                <div className="cr-preview-section-title">Identity</div>
                                <div className="cr-preview-grid">
                                    <Field label="First Name" value={fd.first_name} />
                                    <Field label="Last Name" value={fd.last_name} />
                                    <Field label="Middle Name" value={fd.middle_name} />
                                    <Field label="LRN" value={fd.lrn} />
                                    <Field label="Birthdate" value={fd.birthdate} />
                                    <Field label="Gender" value={fd.gender} />
                                    <Field label="Address" value={fd.address} full />
                                </div>
                            </div>
                            <div className="cr-preview-section">
                                <div className="cr-preview-section-title">Academic Placement</div>
                                <div className="cr-preview-grid">
                                    <Field label="Year Level" value={candidate?.year_level_applied} />
                                    <Field label="Applied Program" value={candidate?.strand} />
                                    <Field label="Section ID" value={fd.section_id} />
                                </div>
                            </div>
                            <div className="cr-preview-section">
                                <div className="cr-preview-section-title">Guardian</div>
                                <div className="cr-preview-grid">
                                    <Field label="Guardian Name" value={fd.guardian_name} />
                                    <Field label="Contact" value={fd.guardian_contact} />
                                    <Field label="Relationship" value={fd.guardian_relationship} full />
                                </div>
                            </div>
                            {(fd.skills?.length > 0 || fd.activities?.length > 0) && (
                                <div className="cr-preview-section">
                                    <div className="cr-preview-section-title">Skills &amp; Activities</div>
                                    <div className="cr-preview-grid">
                                        <div className="cr-preview-field">
                                            <div className="cr-preview-field-lbl">Skills</div>
                                            <div style={{ marginTop: 2 }}>{fd.skills?.length > 0 ? fd.skills.map(s => <span key={s} className="cr-preview-tag">{s}</span>) : <span style={{ opacity: .35 }}>—</span>}</div>
                                        </div>
                                        <div className="cr-preview-field">
                                            <div className="cr-preview-field-lbl">Activities</div>
                                            <div style={{ marginTop: 2 }}>{fd.activities?.length > 0 ? fd.activities.map(a => <span key={a} className="cr-preview-tag">{a}</span>) : <span style={{ opacity: .35 }}>—</span>}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
                <div className="cr-mfooter">
                    <button className="cr-cancel-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </Modal>
    );
}

/* ══════════════════ ENROLL MODAL ══════════════════ */
function EnrollModal({ show, onClose, candidate, onSuccess }) {
    const [processing, setProcessing] = useState(false);
    const [enrollError, setEnrollError] = useState(null);
    const confirm = async () => {
        if (!candidate) return;
        setProcessing(true);
        setEnrollError(null);
        try {
            const response = await axios.post(route('candidates.enroll', candidate.id));
            
            if (response.data.redirect) {
                onClose();
                router.visit(response.data.redirect);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Enrollment failed. Please try again.';
            setEnrollError(message);
            console.error('Enroll error:', message);
        } finally {
            setProcessing(false);
        }
    };
    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="cr-modal">
                <div className="cr-mhdr" style={{ background: 'linear-gradient(135deg,rgba(52,211,153,0.08),rgba(0,0,0,0.3))' }}>
                    <div className="cr-meyebrow" style={{ color: 'rgba(52,211,153,0.5)' }}>Candidate Registry</div>
                    <div className="cr-mtitle">Authorize Enrollment</div>
                </div>
                <div className="cr-mbody" style={{ textAlign: 'center' }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <UserPlus size={26} color="#34d399" />
                    </div>
                    <p style={{ fontSize: 14, color: C.txt, lineHeight: 1.6, marginBottom: 12 }}>
                        You are about to enroll<br />
                        <strong style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 18, color: '#34d399' }}>
                            {candidate ? `${candidate.first_name} ${candidate.last_name}` : ''}
                        </strong>
                    </p>
                    <p style={{ fontSize: 11, color: C.dim, lineHeight: 1.5, background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 8, border: `1px solid ${C.bdr}` }}>
                        This will create a <span style={{ color: '#34d399', fontWeight: 700 }}>student record</span> and a{' '}
                        <span style={{ color: '#34d399', fontWeight: 700 }}>user account</span> seeded from the submitted form data. This action cannot be undone.
                    </p>

                    {enrollError && (
                        <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <AlertTriangle size={16} color="#f87171" style={{ flexShrink: 0 }} />
                            <div style={{ fontSize: 11, color: '#f87171', textAlign: 'left', fontWeight: 500 }}>{enrollError}</div>
                        </div>
                    )}
                </div>
                <div className="cr-mfooter">
                    <button className="cr-cancel-btn" onClick={onClose}>Cancel</button>
                    <button id="btn-confirm-enroll" className="cr-commit-btn" onClick={confirm} disabled={processing}
                        style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 4px 14px rgba(16,185,129,0.3)' }}>
                        {processing ? <><RefreshCcw size={13} style={{ animation: 'spin 1s linear infinite' }} /> Enrolling…</> : <><ShieldCheck size={13} /> Confirm Enrollment</>}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

/* ══════════════════ MAIN PAGE ══════════════════ */
export default function CandidatesIndex({ candidates, counts, programs = [], newCredentials }) {
    const { errors, flash } = usePage().props;

    const [showAdd, setShowAdd] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showEnroll, setShowEnroll] = useState(false);
    const [target, setTarget] = useState(null);
    const [copiedCode, setCopiedCode] = useState(null);

    // ── Credentials Modal State ──
    const [showCredentials, setShowCredentials] = React.useState(!!newCredentials);
    const [credentials, setCredentials]         = React.useState(newCredentials || null);
    const [copied, setCopied]                   = React.useState('');

    // Watch for new credentials from the server (after redirect)
    React.useEffect(() => {
        if (newCredentials) {
            setCredentials(newCredentials);
            setShowCredentials(true);
        }
    }, [newCredentials]);

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(''), 2000);
    };

    const open = (modal, c) => { setTarget(c); modal(true); };

    const copyCode = (code, e) => {
        e.stopPropagation();
        navigator.clipboard?.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const total = Number(counts?.total ?? 0);
    const statCards = [
        { key: 'total', label: 'Pipeline', val: total, color: '#f97316', Icon: Users },
        { key: 'pending', label: 'Pending', val: Number(counts?.pending ?? 0), color: '#fdba74', Icon: Hourglass },
        { key: 'form_submitted', label: 'Form Submitted', val: Number(counts?.form_submitted ?? 0), color: '#fb923c', Icon: ClipboardList },
        { key: 'accepted', label: 'Accepted', val: Number(counts?.accepted ?? 0), color: '#34d399', Icon: CheckCircle2 },
        { key: 'rejected', label: 'Rejected', val: Number(counts?.rejected ?? 0), color: '#f87171', Icon: XCircle },
    ];

    const rows = candidates?.data ?? [];

    return (
        <AppLayout title="Candidate Registry" noPadding>
            <style>{css}</style>
            <div className="cr-root">
                <div className="cr-grid" /><div className="cr-glow1" /><div className="cr-glow2" />
                <div className="cr-content" style={{ flex: 1 }}>

                    {/* ── Flash: success ── */}
                    {flash?.success && (
                        <div className={`cr-flash cr-flash-green cr-fade`} style={{ marginBottom: 20 }}>
                            <div style={{ background: '#34d399', color: '#0c0805', padding: 8, borderRadius: 10, flexShrink: 0 }}>
                                <CheckCircle2 size={18} />
                            </div>
                            <span style={{ fontSize: 13, color: C.txt, fontWeight: 500 }}>{flash.success}</span>
                        </div>
                    )}

                    {/* ── Flash: enrollment error ── */}
                    {errors?.enrollment && (
                        <div className="cr-flash cr-flash-red cr-fade" style={{ marginBottom: 20 }}>
                            <div style={{ background: '#ef4444', color: 'white', padding: 8, borderRadius: 10, flexShrink: 0 }}>
                                <AlertTriangle size={18} />
                            </div>
                            <div>
                                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.12em', color: '#f87171', marginBottom: 2 }}>Enrollment Error</div>
                                <div style={{ fontSize: 13, color: C.muted }}>{errors.enrollment}</div>
                            </div>
                        </div>
                    )}

                    {/* ── Header ── */}
                    <div className="cr-hdr cr-fade">
                        <div>
                            <div className="cr-tags">
                                <span className="cr-tag" style={{ background: 'rgba(249,115,22,0.14)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.28)' }}>CCS · ProFile</span>
                                <span className="cr-tag" style={{ background: 'rgba(255,255,255,0.05)', color: C.dim, border: '1px solid rgba(255,255,255,0.08)' }}>Candidates</span>
                                <span className="cr-tag" style={{ background: 'rgba(52,211,153,0.10)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}>● Live</span>
                            </div>
                            <h1 className="cr-title">Candidate<em>Registry</em></h1>
                            <p className="cr-sub">Students cleared by the external admissions office</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 4 }}>
                            <button id="btn-add-candidate" className="cr-add-btn" onClick={() => setShowAdd(true)}>
                                <Plus size={14} /> Add Candidate
                            </button>
                            <div className="cr-pipeline">
                                <div>
                                    <div className="cr-pipe-lbl">Total Pipeline</div>
                                    <div className="cr-pipe-val">{candidates?.total ?? 0}</div>
                                </div>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(249,115,22,0.14)', border: '1px solid rgba(249,115,22,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Users size={18} color="#f97316" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Stat cards ── */}
                    <div className="cr-stats cr-fade cr-d1">
                        {statCards.map(s => (
                            <div key={s.key} className="cr-stat">
                                <div className="cr-stat-icon" style={{ background: `${s.color}18`, border: `1px solid ${s.color}2e` }}>
                                    <s.Icon size={13} color={s.color} />
                                </div>
                                <div className="cr-stat-val">{s.val}</div>
                                <div className="cr-stat-lbl">{s.label}</div>
                                <div className="cr-stat-bar">
                                    <div className="cr-stat-bar-fill" style={{ width: s.key === 'total' ? '100%' : `${Math.round(s.val / Math.max(total, 1) * 100)}%`, background: `linear-gradient(90deg,${s.color}55,${s.color})` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Table card ── */}
                    <div className="cr-card cr-fade cr-d2">
                        <div className="cr-card-hdr">
                            <div>
                                <div className="cr-card-title">Registered Candidates</div>
                                <div className="cr-card-sub">Code · Level · Status · Decision Gateway</div>
                            </div>
                            <span className="cr-badge">{candidates?.total ?? 0} candidates</span>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table className="cr-table">
                                <thead>
                                    <tr>
                                        <th>Candidate</th>
                                        <th>Year Level</th>
                                        <th>Program</th>
                                        <th>Reg Code</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map(c => {
                                        const sc = SC[c.status] || SC.pending;
                                        const initials = `${c.first_name?.[0] ?? '?'}${c.last_name?.[0] ?? '?'}`;
                                        const added = new Date(c.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
                                        const canViewForm = ['form_submitted', 'accepted', 'enrolled'].includes(c.status);
                                        const canDecide = c.status === 'form_submitted';
                                        const canEnroll = c.status === 'accepted';
                                        const noActions = ['rejected', 'enrolled'].includes(c.status) && !canViewForm;

                                        return (
                                            <tr key={c.id} className="cr-row">
                                                <td className="cr-td">
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                                                        <div className="cr-avatar">{initials}</div>
                                                        <div>
                                                            <div className="cr-name">{c.first_name} {c.last_name}</div>
                                                            <div className="cr-date">Added {added}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="cr-td">
                                                    <span className="cr-grade">{c.year_level_applied}</span>
                                                </td>
                                                <td className="cr-td">
                                                    {c.strand && <div style={{ fontSize: 11, color: C.orange, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', fontFamily: "'Space Mono',monospace" }}>{c.strand}</div>}
                                                </td>
                                                <td className="cr-td">
                                                    <span className="cr-code-pill" onClick={e => copyCode(c.registration_code, e)} title="Click to copy">
                                                        {copiedCode === c.registration_code ? <Check size={10} /> : <Copy size={10} />}
                                                        {c.registration_code}
                                                    </span>
                                                </td>
                                                <td className="cr-td">
                                                    <span className="cr-status" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                                                        <span className="cr-dot" style={{ background: sc.dot }} />
                                                        <sc.Icon size={11} />
                                                        {sc.label}
                                                    </span>
                                                </td>
                                                <td className="cr-td">
                                                    <div className="cr-actions">
                                                        {canViewForm && (
                                                            <button className="cr-btn-ghost" onClick={() => open(setShowPreview, c)} title="View submitted form">
                                                                <Eye size={11} /> View Form
                                                            </button>
                                                        )}
                                                        {canDecide && (
                                                            <button className="cr-btn-ghost" onClick={() => open(setShowStatus, c)} title="Accept or Reject">
                                                                <ShieldCheck size={11} /> Decide
                                                            </button>
                                                        )}
                                                        {canEnroll && (
                                                            <button className="cr-btn-green" onClick={() => open(setShowEnroll, c)}>
                                                                <UserPlus size={11} /> Enroll
                                                            </button>
                                                        )}
                                                        <Link href={route('candidates.show', c.id)} className="cr-btn-icon" title="View details">
                                                            <ChevronRight size={14} />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {rows.length === 0 && (
                                        <tr><td colSpan={5}>
                                            <div className="cr-empty">
                                                <div className="cr-empty-icon"><UserPlus size={26} color="rgba(249,115,22,0.5)" /></div>
                                                <div className="cr-empty-title">No candidates yet</div>
                                                <div className="cr-empty-sub">Click <strong>Add Candidate</strong> to register the first one</div>
                                            </div>
                                        </td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {candidates?.links?.length > 3 && (
                            <div className="cr-pagination">
                                {candidates.links.map((link, i) => (
                                    <Link key={i} href={link.url ?? '#'}
                                        className={`cr-page-btn${link.active ? ' active' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        style={{ pointerEvents: link.url ? 'auto' : 'none', opacity: link.url ? 1 : .35 }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <AddCandidateModal show={showAdd} onClose={() => setShowAdd(false)} flash={flash} programs={programs} />
            <StatusModal show={showStatus} onClose={() => setShowStatus(false)} candidate={target} />
            <FormPreviewModal show={showPreview} onClose={() => setShowPreview(false)} candidate={target} />
            <EnrollModal
                show={showEnroll}
                onClose={() => setShowEnroll(false)}
                candidate={target}
                onSuccess={(creds) => {
                    setCredentials(creds);
                    setShowCredentials(true);
                }}
            />

            {/* ══════════════════════════════════════
                STUDENT CREDENTIALS MODAL
            ══════════════════════════════════════ */}
            <Modal show={showCredentials} onClose={() => setShowCredentials(false)} maxWidth="lg">
                <div className="cr-modal">
                    {/* Header */}
                    <div className="cr-mhdr" style={{
                        background: 'linear-gradient(135deg, rgba(52,211,153,0.1), rgba(0,0,0,0.4))'
                    }}>
                        <div className="cr-meyebrow" style={{ color: 'rgba(52,211,153,0.6)' }}>
                            Enrollment Complete · Student Account Created
                        </div>
                        <div className="cr-mtitle" style={{ color: '#34d399' }}>
                            Account Credentials
                        </div>
                        <div className="cr-msub">
                            Share these credentials with the student. The password cannot be recovered after closing.
                        </div>
                    </div>

                    <div className="cr-mbody">

                        {/* Student name banner */}
                        <div style={{
                            background: 'rgba(52,211,153,0.08)',
                            border: '1px solid rgba(52,211,153,0.2)',
                            borderRadius: '12px', padding: '14px 18px',
                            display: 'flex', alignItems: 'center', gap: '14px',
                        }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '10px',
                                background: 'rgba(52,211,153,0.15)',
                                border: '1px solid rgba(52,211,153,0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '14px', fontWeight: 700, color: '#34d399',
                                fontFamily: "'Space Mono', monospace",
                            }}>
                                {credentials?.student_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                                <div style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: '16px', fontWeight: 900, fontStyle: 'italic',
                                    color: '#fef3ec',
                                }}>
                                    {credentials?.student_name}
                                </div>
                                <div style={{ fontSize: '9px', color: 'rgba(52,211,153,0.6)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', marginTop: '2px' }}>
                                    ● Successfully Enrolled
                                </div>
                            </div>
                        </div>

                        {/* Warning */}
                        <div style={{
                            background: 'rgba(251,191,36,0.08)',
                            border: '1px solid rgba(251,191,36,0.2)',
                            borderRadius: '10px', padding: '12px 16px',
                            display: 'flex', alignItems: 'center', gap: '10px',
                        }}>
                            <span style={{ fontSize: '16px' }}>⚠️</span>
                            <p style={{ fontSize: '11px', color: 'rgba(251,191,36,0.8)', lineHeight: 1.5 }}>
                                <strong>Save these credentials now.</strong> The password will not be shown again after you close this window.
                            </p>
                        </div>

                        {/* Credential fields */}
                        {[
                            { label: 'Student Number',  value: credentials?.student_number, field: 'number'   },
                            { label: 'Email Address',   value: credentials?.email,          field: 'email'    },
                            { label: 'Password',        value: credentials?.password,       field: 'password', mono: true },
                        ].map(item => (
                            <div key={item.field}>
                                <label className="cr-lbl">{item.label}</label>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    background: 'rgba(249,115,22,0.06)',
                                    border: `1px solid ${C.bdr}`,
                                    borderRadius: '9px', padding: '11px 14px',
                                }}>
                                    <span style={{
                                        flex: 1,
                                        fontFamily: item.mono ? "'Space Mono', monospace" : 'inherit',
                                        fontSize: item.mono ? '16px' : '13px',
                                        fontWeight: item.mono ? 700 : 500,
                                        color: item.field === 'password' ? '#fb923c' : '#fef3ec',
                                        letterSpacing: item.mono ? '.08em' : 'normal',
                                    }}>
                                        {item.value}
                                    </span>
                                    <button
                                        onClick={() => copyToClipboard(item.value, item.field)}
                                        style={{
                                            padding: '5px 12px', borderRadius: '7px', flexShrink: 0,
                                            background: copied === item.field ? 'rgba(52,211,153,0.15)' : 'rgba(249,115,22,0.1)',
                                            border: `1px solid ${copied === item.field ? 'rgba(52,211,153,0.3)' : 'rgba(249,115,22,0.25)'}`,
                                            color: copied === item.field ? '#34d399' : '#fb923c',
                                            fontSize: '9px', fontWeight: 800,
                                            textTransform: 'uppercase', letterSpacing: '.1em',
                                            cursor: 'pointer', fontFamily: 'inherit',
                                            transition: 'all .2s',
                                        }}
                                    >
                                        {copied === item.field ? '✓ Copied' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Copy all button */}
                        <button
                            onClick={() => copyToClipboard(
                                `Student: ${credentials?.student_name}\nStudent No: ${credentials?.student_number}\nEmail: ${credentials?.email}\nPassword: ${credentials?.password}`,
                                'all'
                            )}
                            style={{
                                width: '100%', padding: '11px',
                                background: 'rgba(52,211,153,0.08)',
                                border: '1px solid rgba(52,211,153,0.25)',
                                borderRadius: '10px',
                                color: '#34d399', fontSize: '11px', fontWeight: 700,
                                textTransform: 'uppercase', letterSpacing: '.1em',
                                cursor: 'pointer', fontFamily: 'inherit',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                transition: 'all .2s',
                            }}
                        >
                            {copied === 'all' ? '✓ All Credentials Copied!' : '📋 Copy All Credentials'}
                        </button>
                    </div>

                    <div className="cr-mfooter">
                        <button
                            className="cr-commit-btn"
                            onClick={() => setShowCredentials(false)}
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            <CheckCircle2 size={14} /> Done — I've Saved the Credentials
                        </button>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}
