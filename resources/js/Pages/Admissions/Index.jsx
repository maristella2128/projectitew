import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm, router, usePage, Link } from '@inertiajs/react';
import {
    UserPlus, Search, Filter,
    CheckCircle2, XCircle, Clock,
    Mail, Phone, Star, RefreshCcw,
    ArrowRight, ChevronRight, Users,
    TrendingUp, AlertTriangle, Hourglass,
    ShieldCheck, Sparkles, MoreHorizontal, Plus, Eye
} from 'lucide-react';
import Modal from '@/Components/Modal';

/* ─────────────────────────────────────
   CCS PALETTE
───────────────────────────────────── */
const C = {
    bg: "#0c0805",
    surf: "#160e08",
    surf2: "#1c1208",
    surf3: "#201408",
    bdr: "#2a1508",
    bdr2: "#3a1e0a",
    orange: "#f97316",
    o2: "#fb923c",
    o3: "#fdba74",
    o4: "#c2410c",
    txt: "#fef3ec",
    muted: "rgba(254,243,236,0.45)",
    dim: "rgba(254,243,236,0.22)",
    faint: "rgba(254,243,236,0.08)",
};

/* ─────────────────────────────────────
   STATUS CONFIGURATION
───────────────────────────────────── */
const STATUS_CFG = {
    pending: {
        color: "#fdba74", bg: "rgba(253,186,116,0.10)",
        border: "rgba(253,186,116,0.25)", dot: "#fdba74",
        label: "Pending", Icon: Hourglass,
    },
    form_submitted: {
        color: "#10b981", bg: "rgba(16,185,129,0.12)",
        border: "rgba(16,185,129,0.4)", dot: "#10b981",
        label: "Form Submitted", Icon: Search,
    },
    accepted: {
        color: "#34d399", bg: "rgba(52,211,153,0.10)",
        border: "rgba(52,211,153,0.28)", dot: "#34d399",
        label: "Accepted", Icon: CheckCircle2,
    },
    rejected: {
        color: "#f87171", bg: "rgba(239,68,68,0.10)",
        border: "rgba(239,68,68,0.28)", dot: "#f87171",
        label: "Rejected", Icon: XCircle,
    },
    enrolled: {
        color: "#f97316", bg: "rgba(249,115,22,0.16)",
        border: "rgba(249,115,22,0.38)", dot: "#f97316",
        label: "Enrolled", Icon: Star,
    },
};

/* ─────────────────────────────────────
   STYLES
───────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,900&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

/* ── ROOT ── */
.ai-root{
  background:${C.bg};min-height:100%;
  flex: 1; display: flex; flex-direction: column;
  font-family:'DM Sans',system-ui,sans-serif;
  color:${C.txt};padding:28px 32px 56px;
  position:relative;overflow:hidden;
}
.ai-grid{
  position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:
    linear-gradient(rgba(249,115,22,0.022) 1px,transparent 1px),
    linear-gradient(90deg,rgba(249,115,22,0.022) 1px,transparent 1px);
  background-size:48px 48px;
}
.ai-glow-1{
  position:fixed;top:-8%;right:-4%;width:480px;height:480px;
  background:radial-gradient(circle,rgba(249,115,22,0.055) 0%,transparent 65%);
  border-radius:50%;pointer-events:none;z-index:0;
}
.ai-glow-2{
  position:fixed;bottom:-6%;left:28%;width:340px;height:340px;
  background:radial-gradient(circle,rgba(194,65,12,0.04) 0%,transparent 65%);
  border-radius:50%;pointer-events:none;z-index:0;
}
.ai-content{position:relative;z-index:1;}

/* ── HEADER ── */
.ai-hdr{
  display:flex;align-items:flex-start;
  justify-content:space-between;margin-bottom:22px;gap:16px;
}
.ai-tags{display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;}
.ai-tag{
  font-size:9px;font-weight:700;padding:2px 9px;
  border-radius:4px;letter-spacing:.08em;text-transform:uppercase;
}
.ai-hdr-title{
  font-family:'Playfair Display',serif;
  font-size:30px;font-weight:900;color:${C.txt};
  line-height:1.0;letter-spacing:-.02em;
}
.ai-hdr-title em{color:${C.orange};font-style:italic;display:block;}
.ai-hdr-sub{font-size:11px;color:${C.dim};margin-top:5px;font-style:italic;}

/* ── PIPELINE COUNTER ── */
.ai-pipeline{
  display:flex;align-items:center;gap:11px;
  background:${C.surf};border:1px solid ${C.bdr};
  border-radius:12px;padding:12px 18px;
  flex-shrink:0;margin-top:4px;
}
.ai-pipeline-val{
  font-family:'Playfair Display',serif;
  font-size:26px;font-weight:900;color:${C.txt};line-height:1;
}
.ai-pipeline-lbl{
  font-size:8px;font-weight:700;text-transform:uppercase;
  letter-spacing:.16em;color:${C.dim};margin-bottom:2px;
}

/* ── STATUS STAT CARDS ── */
.ai-stats{
  display:grid;grid-template-columns:repeat(5,1fr);
  gap:10px;margin-bottom:20px;
}
.ai-stat{
  background:linear-gradient(145deg,rgba(249,115,22,0.07),rgba(0,0,0,0.38));
  border:1px solid ${C.bdr};border-radius:13px;
  padding:14px 15px;position:relative;overflow:hidden;
  cursor:pointer;transition:border-color .22s,transform .18s;
}
.ai-stat:hover{border-color:rgba(249,115,22,0.32);transform:translateY(-1px);}
.ai-stat::after{
  content:'';position:absolute;top:-28px;right:-28px;
  width:72px;height:72px;border-radius:50%;
  background:rgba(249,115,22,0.07);transition:transform .35s;
}
.ai-stat:hover::after{transform:scale(1.7);}
.ai-stat-icon{
  width:28px;height:28px;border-radius:7px;
  display:flex;align-items:center;justify-content:center;
  margin-bottom:9px;position:relative;z-index:1;
}
.ai-stat-val{
  font-family:'Space Mono',monospace;font-size:22px;
  font-weight:700;color:${C.txt};line-height:1;
  position:relative;z-index:1;
}
.ai-stat-lbl{
  font-size:9px;font-weight:700;color:${C.muted};
  margin-top:4px;text-transform:uppercase;letter-spacing:.07em;
  position:relative;z-index:1;
}
.ai-stat-bar{
  height:2px;background:rgba(249,115,22,0.1);
  border-radius:1px;margin-top:10px;overflow:hidden;
  position:relative;z-index:1;
}
.ai-stat-bar-fill{height:100%;border-radius:1px;}

/* ── TABLE CARD ── */
.ai-card{
  background:${C.surf};border:1px solid ${C.bdr};
  border-radius:14px;overflow:hidden;margin-bottom:16px;
}
.ai-card-hdr{
  display:flex;align-items:center;justify-content:space-between;
  padding:14px 20px;border-bottom:1px solid ${C.bdr};
}
.ai-card-title{
  font-family:'Playfair Display',serif;
  font-size:15px;font-weight:700;color:${C.txt};
}
.ai-card-sub{font-size:10px;color:${C.dim};margin-top:1px;}
.ai-count-badge{
  font-family:'Space Mono',monospace;font-size:11px;
  font-weight:700;color:${C.orange};
  background:rgba(249,115,22,0.1);
  border:1px solid rgba(249,115,22,0.22);
  padding:3px 11px;border-radius:99px;
}

table.ai-table{width:100%;border-collapse:collapse;}
.ai-table thead tr{border-bottom:1px solid ${C.bdr};}
.ai-table th{
  padding:10px 18px;text-align:left;font-size:8px;
  font-weight:700;letter-spacing:.14em;
  color:rgba(249,115,22,0.42);text-transform:uppercase;
  background:rgba(249,115,22,0.03);white-space:nowrap;
}
.ai-table th:last-child{text-align:right;}

.ai-row{
  border-bottom:1px solid rgba(249,115,22,0.05);
  cursor:pointer;transition:background .14s;
}
.ai-row:hover{background:rgba(249,115,22,0.04);}
.ai-row:last-child{border-bottom:none;}
.ai-td{padding:13px 18px;vertical-align:middle;}

/* Avatar */
.ai-avatar{
  width:38px;height:38px;border-radius:10px;
  background:rgba(249,115,22,0.16);
  border:1px solid rgba(249,115,22,0.3);
  display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:700;color:${C.orange};
  font-family:'Space Mono',monospace;
  flex-shrink:0;transition:transform .18s;
}
.ai-row:hover .ai-avatar{transform:scale(1.08);}

.ai-name{
  font-family:'Playfair Display',serif;
  font-size:13px;font-weight:700;font-style:italic;color:${C.txt};
}
.ai-date{
  font-size:8px;color:${C.dim};
  text-transform:uppercase;letter-spacing:.08em;margin-top:2px;
  font-weight:700;
}

/* Code badge */
.ai-code{
  font-family:'Space Mono',monospace;
  font-size:9px;font-weight:700;letter-spacing:.06em;
  color:${C.o2};background:rgba(249,115,22,0.10);
  border:1px solid rgba(249,115,22,0.22);
  padding:3px 9px;border-radius:6px;
  display:inline-block;margin-top:3px;
}

/* Grade badge */
.ai-grade{
  font-size:9px;font-weight:700;
  text-transform:uppercase;letter-spacing:.07em;
  color:${C.muted};background:rgba(249,115,22,0.07);
  border:1px solid ${C.bdr};padding:3px 10px;border-radius:99px;
  font-family:'Space Mono',monospace;white-space:nowrap;
}

/* Contact */
.ai-contact-row{
  display:flex;align-items:center;gap:7px;
  font-size:10px;color:${C.dim};font-weight:600;margin-bottom:3px;
}
.ai-contact-row:last-child{margin-bottom:0;}

/* Status badge */
.ai-status{
  display:inline-flex;align-items:center;gap:6px;
  padding:4px 11px;border-radius:8px;
  font-size:9px;font-weight:700;letter-spacing:.08em;
  text-transform:uppercase;white-space:nowrap;
}
.ai-status-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;}

/* Action buttons */
.ai-actions{display:flex;align-items:center;justify-content:flex-end;gap:6px;}
.ai-enroll-btn{
  display:inline-flex;align-items:center;gap:6px;
  padding:7px 14px;border-radius:8px;
  background:rgba(52,211,153,0.1);
  border:1px solid rgba(52,211,153,0.28);
  color:#34d399;font-size:9px;font-weight:700;
  text-transform:uppercase;letter-spacing:.07em;
  cursor:pointer;transition:all .18s;font-family:inherit;
}
.ai-enroll-btn:hover{
  background:#34d399;color:#0c0805;
  box-shadow:0 3px 12px rgba(52,211,153,0.32);
}
.ai-process-btn{
  width:34px;height:34px;border-radius:8px;
  background:transparent;border:1px solid ${C.bdr};
  color:${C.dim};cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:all .16s;
}
.ai-process-btn:hover{
  color:${C.orange};background:rgba(249,115,22,0.1);
  border-color:rgba(249,115,22,0.3);
}

/* Add Candidate button */
.ai-add-btn{
  display:inline-flex;align-items:center;gap:8px;
  padding:10px 20px;border-radius:10px;
  background:linear-gradient(135deg,${C.orange},${C.o4});
  border:none;color:#fff;font-size:11px;font-weight:700;
  text-transform:uppercase;letter-spacing:.09em;
  cursor:pointer;transition:all .2s;font-family:inherit;
  box-shadow:0 4px 14px rgba(249,115,22,0.3);
  flex-shrink:0;
}
.ai-add-btn:hover{transform:translateY(-1px);box-shadow:0 7px 20px rgba(249,115,22,0.4);}

/* Empty state */
.ai-empty{padding:60px 0;text-align:center;}
.ai-empty-icon{
  width:60px;height:60px;border-radius:16px;
  background:rgba(249,115,22,0.08);
  border:1px solid rgba(249,115,22,0.15);
  display:flex;align-items:center;justify-content:center;
  margin:0 auto 16px;
}
.ai-empty-title{
  font-family:'Playfair Display',serif;
  font-size:18px;font-weight:700;font-style:italic;
  color:${C.muted};margin-bottom:5px;
}
.ai-empty-sub{font-size:11px;color:${C.dim};}

/* ── MODAL ── */
.ai-modal{
  background:${C.surf};border:1px solid ${C.bdr};
  border-radius:18px;overflow:hidden;
  box-shadow:0 24px 60px rgba(0,0,0,0.7),0 0 0 1px rgba(249,115,22,0.1);
  font-family:'DM Sans',sans-serif;
}
.ai-modal-hdr{
  padding:20px 24px 16px;
  border-bottom:1px solid ${C.bdr};
  background:linear-gradient(135deg,rgba(249,115,22,0.07),rgba(0,0,0,0.3));
  position:relative;overflow:hidden;
}
.ai-modal-hdr::before{
  content:'';position:absolute;top:-40px;right:-40px;
  width:120px;height:120px;border-radius:50%;
  background:rgba(249,115,22,0.08);
}
.ai-modal-eyebrow{
  font-size:8px;font-weight:700;text-transform:uppercase;
  letter-spacing:.18em;color:rgba(249,115,22,0.5);
  margin-bottom:6px;
}
.ai-modal-title{
  font-family:'Playfair Display',serif;
  font-size:22px;font-weight:900;font-style:italic;
  color:${C.txt};letter-spacing:-.01em;line-height:1;
  position:relative;z-index:1;
}
.ai-modal-sub{
  font-size:10px;color:${C.muted};margin-top:5px;
  position:relative;z-index:1;
}
.ai-modal-body{padding:20px 24px;display:flex;flex-direction:column;gap:14px;}
.ai-field-lbl{
  font-size:8px;font-weight:700;text-transform:uppercase;
  letter-spacing:.14em;color:rgba(249,115,22,0.45);
  display:block;margin-bottom:6px;
}
.ai-modal-input{
  width:100%;background:rgba(249,115,22,0.06);
  border:1px solid ${C.bdr};border-radius:9px;
  color:${C.txt};font-size:13px;padding:11px 14px;
  outline:none;font-family:inherit;transition:border-color .18s;
}
.ai-modal-input:focus{border-color:rgba(249,115,22,0.45);}
.ai-modal-input::placeholder{color:${C.dim};}
.ai-modal-select{
  width:100%;background:rgba(249,115,22,0.06);
  border:1px solid ${C.bdr};border-radius:9px;
  color:${C.txt};font-size:13px;padding:11px 14px;
  outline:none;cursor:pointer;font-family:inherit;
  transition:border-color .18s;
  -webkit-appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(249,115,22,0.5)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 14px center;
  padding-right:36px;
}
.ai-modal-select:focus{border-color:rgba(249,115,22,0.45);}
.ai-modal-select option{background:${C.surf2};color:${C.txt};}
.ai-modal-textarea{
  width:100%;background:rgba(249,115,22,0.06);
  border:1px solid ${C.bdr};border-radius:9px;
  color:${C.txt};font-size:13px;padding:11px 14px;
  outline:none;font-family:inherit;resize:vertical;
  min-height:90px;transition:border-color .18s;line-height:1.6;
}
.ai-modal-textarea:focus{border-color:rgba(249,115,22,0.45);}
.ai-modal-textarea::placeholder{color:${C.dim};}
.ai-modal-footer{
  padding:14px 24px 20px;
  display:flex;align-items:center;justify-content:flex-end;gap:10px;
  border-top:1px solid ${C.bdr};
}
.ai-cancel-btn{
  padding:9px 18px;border-radius:9px;
  background:transparent;border:1px solid ${C.bdr};
  color:${C.muted};font-size:11px;font-weight:700;
  text-transform:uppercase;letter-spacing:.09em;
  cursor:pointer;transition:all .18s;font-family:inherit;
}
.ai-cancel-btn:hover{color:${C.txt};border-color:rgba(249,115,22,0.28);}
.ai-commit-btn{
  padding:9px 24px;border-radius:9px;
  background:linear-gradient(135deg,${C.orange},${C.o4});
  border:none;color:#fff;font-size:11px;font-weight:700;
  text-transform:uppercase;letter-spacing:.09em;
  cursor:pointer;transition:all .2s;font-family:inherit;
  display:flex;align-items:center;gap:7px;
  box-shadow:0 4px 14px rgba(249,115,22,0.3);
}
.ai-commit-btn:hover{transform:translateY(-1px);box-shadow:0 7px 20px rgba(249,115,22,0.4);}
.ai-commit-btn:disabled{opacity:.5;cursor:not-allowed;transform:none;}

/* two-col grid inside modal */
.ai-2col{display:grid;grid-template-columns:1fr 1fr;gap:14px;}

/* Flash success banner */
.ai-flash{
  display:flex;align-items:center;gap:14px;
  background:rgba(52,211,153,0.08);
  border:1px solid rgba(52,211,153,0.22);
  border-radius:12px;padding:14px 20px;margin-bottom:20px;
}
.ai-flash-code{
  font-family:'Space Mono',monospace;font-size:15px;font-weight:700;
  color:#34d399;background:rgba(52,211,153,0.12);
  border:1px solid rgba(52,211,153,0.25);
  padding:5px 14px;border-radius:8px;letter-spacing:.06em;margin-top:4px;
  display:inline-block;
}

/* ── ENTRANCE ANIMATION ── */
@keyframes ai-up{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:none;}}
.ai-fade{animation:ai-up .36s ease both;}
.ai-d1{animation-delay:.04s;} .ai-d2{animation-delay:.09s;}
.ai-d3{animation-delay:.14s;} .ai-d4{animation-delay:.19s;}
`;

/* ─────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────── */
export default function AdmissionIndex({ candidates, counts, newCredentials }) {
    const { errors, flash } = usePage().props;

    // ── Modal state ──
    const [showAddModal, setShowAddModal]         = React.useState(false);
    const [showProcessModal, setShowProcessModal] = React.useState(false);
    const [showEnrollModal, setShowEnrollModal]   = React.useState(false);
    const [selectedCandidate, setSelectedCandidate] = React.useState(null);
    const [enrollTarget, setEnrollTarget]           = React.useState(null);

    // ── Credentials Modal State ──
    const [showCredentials, setShowCredentials] = React.useState(!!newCredentials);
    const [credentials, setCredentials]         = React.useState(newCredentials || null);
    const [copied, setCopied]                   = React.useState('');

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(''), 2000);
    };

    // ── Forms ──
    const addForm = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        year_level_applied: '',
        strand: '',
    });

    const statusForm = useForm({
        status: '',
        remarks: '',
    });

    const { post: postEnroll, processing: enrollProcessing } = useForm({});

    /* ── stat cards ── */
    const total = candidates?.total ?? 0;

    const statCards = [
        { key: 'total',          label: 'Pipeline',      val: Number(counts?.total          ?? total), color: '#f97316', Icon: Users        },
        { key: 'pending',        label: 'Pending',        val: Number(counts?.pending        ?? 0),     color: '#fdba74', Icon: Hourglass     },
        { key: 'form_submitted', label: 'Form Submitted', val: Number(counts?.form_submitted ?? 0),     color: '#fb923c', Icon: Search        },
        { key: 'accepted',       label: 'Accepted',       val: Number(counts?.accepted       ?? 0),     color: '#34d399', Icon: CheckCircle2  },
        { key: 'rejected',       label: 'Rejected',       val: Number(counts?.rejected       ?? 0),     color: '#f87171', Icon: XCircle       },
    ];

    /* ── handlers ── */
    const openAdd = () => {
        addForm.reset();
        setShowAddModal(true);
    };

    const submitAdd = (e) => {
        e.preventDefault();
        addForm.post(route('candidates.store'), {
            onSuccess: () => {
                setShowAddModal(false);
                addForm.reset();
            },
        });
    };

    const handleProcess = (c) => {
        setSelectedCandidate(c);
        statusForm.setData({ status: c.status, remarks: c.remarks || '' });
        setShowProcessModal(true);
    };

    const submitUpdate = (e) => {
        e.preventDefault();
        statusForm.patch(route('candidates.updateStatus', selectedCandidate.id), {
            onSuccess: () => setShowProcessModal(false),
        });
    };

    const handleEnroll = (c) => {
        setEnrollTarget(c);
        setShowEnrollModal(true);
    };

    const confirmEnroll = () => {
        if (!enrollTarget) return;
        router.post(route('candidates.enroll', enrollTarget.id), {}, {
            onSuccess: (page) => {
                setShowEnrollModal(false);
                setEnrollTarget(null);
                // The credentials will be in page.props.newCredentials because we pull them in the controller
                if (page.props.newCredentials) {
                    setCredentials(page.props.newCredentials);
                    setShowCredentials(true);
                }
            },
        });
    };

    const rows = candidates?.data ?? [];

    return (
        <AppLayout title="Candidates Pipeline" noPadding>
            <style>{css}</style>
            <div className="ai-root">
                <div className="ai-grid" />
                <div className="ai-glow-1" />
                <div className="ai-glow-2" />
                <div className="ai-content" style={{ flex: 1 }}>

                    {/* ── FLASH: new registration code ── */}
                    {flash?.success && flash?.code && (
                        <div className="ai-flash ai-fade">
                            <div style={{
                                background: '#34d399', color: '#0c0805',
                                padding: '8px', borderRadius: '10px', flexShrink: 0
                            }}>
                                <CheckCircle2 size={18} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.12em', color: '#34d399', marginBottom: 2 }}>
                                    Candidate Added
                                </div>
                                <div style={{ fontSize: 12, color: C.muted }}>
                                    Registration code generated:
                                </div>
                                <span className="ai-flash-code">{flash.code}</span>
                            </div>
                        </div>
                    )}

                    {/* ── GENERIC SUCCESS ── */}
                    {flash?.success && !flash?.code && (
                        <div className="ai-flash ai-fade">
                            <div style={{ background: '#34d399', color: '#0c0805', padding: '8px', borderRadius: '10px', flexShrink: 0 }}>
                                <CheckCircle2 size={18} />
                            </div>
                            <span style={{ fontSize: 13, color: C.txt, fontWeight: 500 }}>{flash.success}</span>
                        </div>
                    )}

                    {/* ── ENROLLMENT ERROR ── */}
                    {errors.enrollment && (
                        <div className="ai-fade" style={{ marginBottom: 20 }}>
                            <div style={{
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.25)',
                                borderRadius: '12px', padding: '16px 20px',
                                display: 'flex', alignItems: 'center', gap: 14,
                            }}>
                                <div style={{ background: '#ef4444', color: 'white', padding: 8, borderRadius: 10 }}>
                                    <AlertTriangle size={18} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ color: '#ef4444', fontWeight: 900, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 2 }}>
                                        Enrollment Error
                                    </h4>
                                    <p style={{ color: C.muted, fontSize: 13 }}>{errors.enrollment}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── PAGE HEADER ── */}
                    <div className="ai-hdr ai-fade">
                        <div>
                            <div className="ai-tags">
                                <span className="ai-tag" style={{ background: 'rgba(249,115,22,0.14)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.28)' }}>
                                    CCS · ProFile
                                </span>
                                <span className="ai-tag" style={{ background: 'rgba(255,255,255,0.05)', color: C.dim, border: '1px solid rgba(255,255,255,0.08)' }}>
                                    Candidates
                                </span>
                                <span className="ai-tag" style={{ background: 'rgba(52,211,153,0.10)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}>
                                    ● Live
                                </span>
                            </div>
                            <h1 className="ai-hdr-title">
                                Candidate
                                <em>Registry</em>
                            </h1>
                            <p className="ai-hdr-sub">
                                Registrar-managed candidates from the external admissions system
                            </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 4 }}>
                            {/* Add Candidate */}
                            <button id="btn-add-candidate" className="ai-add-btn" onClick={openAdd}>
                                <Plus size={14} />
                                Add Candidate
                            </button>

                            {/* Pipeline total */}
                            <div className="ai-pipeline">
                                <div>
                                    <div className="ai-pipeline-lbl">Total Pipeline</div>
                                    <div className="ai-pipeline-val">{candidates?.total ?? 0}</div>
                                </div>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 10,
                                    background: 'rgba(249,115,22,0.14)',
                                    border: '1px solid rgba(249,115,22,0.28)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Users size={18} color="#f97316" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── STATUS STAT CARDS ── */}
                    <div className="ai-stats ai-fade ai-d1">
                        {statCards.map((s) => (
                            <div key={s.key} className="ai-stat">
                                <div className="ai-stat-icon" style={{ background: `${s.color}18`, border: `1px solid ${s.color}2e` }}>
                                    <s.Icon size={13} color={s.color} />
                                </div>
                                <div className="ai-stat-val">{s.val}</div>
                                <div className="ai-stat-lbl">{s.label}</div>
                                <div className="ai-stat-bar">
                                    <div className="ai-stat-bar-fill" style={{
                                        width: s.key === 'total' ? '100%' : `${Math.round(s.val / Math.max(Number(counts?.total ?? total), 1) * 100)}%`,
                                        background: `linear-gradient(90deg,${s.color}55,${s.color})`
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── TABLE CARD ── */}
                    <div className="ai-card ai-fade ai-d2">
                        <div className="ai-card-hdr">
                            <div>
                                <div className="ai-card-title">Registered Candidates</div>
                                <div className="ai-card-sub">Code · Year Level · Strand · Status · Decision Gateway</div>
                            </div>
                            <span className="ai-count-badge">{candidates?.total ?? 0} candidates</span>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table className="ai-table">
                                <thead>
                                    <tr>
                                        <th>Candidate</th>
                                        <th>Year Level / Strand</th>
                                        <th>Contact</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((c) => {
                                        const sc = STATUS_CFG[c.status] || STATUS_CFG.pending;
                                        const initials = `${c.first_name?.[0] ?? '?'}${c.last_name?.[0] ?? '?'}`;
                                        const added = new Date(c.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });

                                        return (
                                            <tr key={c.id} className="ai-row">

                                                {/* Candidate */}
                                                <td className="ai-td">
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                                                        <div className="ai-avatar">{initials}</div>
                                                        <div>
                                                            <Link
                                                                href={route('candidates.show', c.id)}
                                                                className="ai-name"
                                                                style={{ textDecoration: 'none' }}
                                                            >
                                                                {c.first_name} {c.last_name}
                                                            </Link>
                                                            <div className="ai-date">Added {added}</div>
                                                            {c.registration_code && (
                                                                <span className="ai-code">{c.registration_code}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Year Level / Strand */}
                                                <td className="ai-td">
                                                    <span className="ai-grade">{c.year_level_applied}</span>
                                                    {c.strand && (
                                                        <div style={{ fontSize: 9, color: C.dim, marginTop: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em' }}>
                                                            {c.strand}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Contact */}
                                                <td className="ai-td">
                                                    {c.email ? (
                                                        <div className="ai-contact-row">
                                                            <Mail size={11} color="#f97316" />
                                                            {c.email}
                                                        </div>
                                                    ) : (
                                                        <div className="ai-contact-row" style={{ opacity: .4 }}>
                                                            <Mail size={11} color="#f97316" /> —
                                                        </div>
                                                    )}
                                                    {c.phone ? (
                                                        <div className="ai-contact-row">
                                                            <Phone size={11} color="#f97316" />
                                                            {c.phone}
                                                        </div>
                                                    ) : (
                                                        <div className="ai-contact-row" style={{ opacity: .4 }}>
                                                            <Phone size={11} color="#f97316" /> —
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Status */}
                                                <td className="ai-td">
                                                    <span className="ai-status" style={{
                                                        background: sc.bg, color: sc.color,
                                                        border: `1px solid ${sc.border}`,
                                                    }}>
                                                        <span className="ai-status-dot" style={{ background: sc.dot }} />
                                                        <sc.Icon size={11} />
                                                        {sc.label}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="ai-td" style={{ textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        {c.status === 'form_submitted' && (
                                                            <Link
                                                                href={route('candidates.show', c.id)}
                                                                style={{
                                                                    display: 'inline-flex', alignItems: 'center', gap: 7,
                                                                    padding: '5px 14px', borderRadius: 10,
                                                                    background: 'rgba(249,115,22,0.06)',
                                                                    border: '1px solid rgba(249,115,22,0.45)',
                                                                    color: C.orange, fontSize: 10, fontWeight: 800,
                                                                    textTransform: 'uppercase', letterSpacing: '.05em',
                                                                    textDecoration: 'none', transition: 'all .2s'
                                                                }}
                                                                onMouseOver={e => {
                                                                    e.currentTarget.style.background = C.orange;
                                                                    e.currentTarget.style.color = '#fff';
                                                                }}
                                                                onMouseOut={e => {
                                                                    e.currentTarget.style.background = 'rgba(249,115,22,0.06)';
                                                                    e.currentTarget.style.color = C.orange;
                                                                }}
                                                            >
                                                                <Eye size={13} strokeWidth={2.5} />
                                                                View Form
                                                            </Link>
                                                        )}

                                                        {(c.status === 'pending' || c.status === 'form_submitted') && (
                                                            <button
                                                                onClick={() => handleProcess(c)}
                                                                style={{
                                                                    display: 'inline-flex', alignItems: 'center', gap: 7,
                                                                    padding: '5px 14px', borderRadius: 10,
                                                                    background: 'rgba(249,115,22,0.06)',
                                                                    border: '1px solid rgba(249,115,22,0.45)',
                                                                    color: C.orange, fontSize: 10, fontWeight: 800,
                                                                    textTransform: 'uppercase', letterSpacing: '.05em',
                                                                    cursor: 'pointer', transition: 'all .2s'
                                                                }}
                                                                onMouseOver={e => {
                                                                    e.currentTarget.style.background = C.orange;
                                                                    e.currentTarget.style.color = '#fff';
                                                                }}
                                                                onMouseOut={e => {
                                                                    e.currentTarget.style.background = 'rgba(249,115,22,0.06)';
                                                                    e.currentTarget.style.color = C.orange;
                                                                }}
                                                            >
                                                                <ShieldCheck size={13} strokeWidth={2.5} />
                                                                Decide
                                                            </button>
                                                        )}

                                                        {c.status === 'accepted' && (
                                                            <button
                                                                onClick={() => handleEnroll(c)}
                                                                style={{
                                                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                                                    padding: '6px 14px', borderRadius: 10,
                                                                    background: 'linear-gradient(135deg,#10b981,#059669)',
                                                                    border: 'none',
                                                                    color: '#fff', fontSize: 10, fontWeight: 700,
                                                                    textTransform: 'uppercase', letterSpacing: '.05em',
                                                                    cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.2)'
                                                                }}
                                                            >
                                                                <UserPlus size={13} />
                                                                Finalize Enrollment
                                                            </button>
                                                        )}

                                                        <Link
                                                            href={route('candidates.show', c.id)}
                                                            className="ai-chevron-btn"
                                                            style={{
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                width: 32, height: 32, borderRadius: 10,
                                                                background: 'rgba(249,115,22,0.06)',
                                                                border: '1px solid rgba(249,115,22,0.45)',
                                                                color: C.orange, transition: 'all .2s'
                                                            }}
                                                            onMouseOver={e => {
                                                                e.currentTarget.style.background = C.orange;
                                                                e.currentTarget.style.color = '#fff';
                                                            }}
                                                            onMouseOut={e => {
                                                                e.currentTarget.style.background = 'rgba(249,115,22,0.06)';
                                                                e.currentTarget.style.color = C.orange;
                                                            }}
                                                        >
                                                            <ChevronRight size={16} strokeWidth={2.5} />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {rows.length === 0 && (
                                        <tr>
                                            <td colSpan={5}>
                                                <div className="ai-empty">
                                                    <div className="ai-empty-icon">
                                                        <UserPlus size={26} color="rgba(249,115,22,0.5)" />
                                                    </div>
                                                    <div className="ai-empty-title">No candidates yet</div>
                                                    <div className="ai-empty-sub">
                                                        Click <strong>Add Candidate</strong> to register the first one
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination links */}
                        {candidates?.links && candidates.links.length > 3 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '16px 20px', borderTop: `1px solid ${C.bdr}` }}>
                                {candidates.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url ?? '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        style={{
                                            padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 700,
                                            fontFamily: "'Space Mono',monospace",
                                            background: link.active ? C.orange : 'transparent',
                                            color: link.active ? '#fff' : C.muted,
                                            border: `1px solid ${link.active ? C.orange : C.bdr}`,
                                            pointerEvents: link.url ? 'auto' : 'none',
                                            opacity: link.url ? 1 : 0.35,
                                            textDecoration: 'none',
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* ══════════════════════════════════════
                ADD CANDIDATE MODAL
            ══════════════════════════════════════ */}
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)} maxWidth="lg">
                <div className="ai-modal">
                    <div className="ai-modal-hdr">
                        <div className="ai-modal-eyebrow">Candidate Registry · New Entry</div>
                        <div className="ai-modal-title">Add Candidate</div>
                        <div className="ai-modal-sub">
                            A registration code (REG-XXXX) will be generated automatically
                        </div>
                    </div>

                    <form onSubmit={submitAdd}>
                        <div className="ai-modal-body">
                            {/* Name row */}
                            <div className="ai-2col">
                                <div>
                                    <label className="ai-field-lbl">First Name *</label>
                                    <input
                                        id="add-first-name"
                                        className="ai-modal-input"
                                        value={addForm.data.first_name}
                                        onChange={e => addForm.setData('first_name', e.target.value)}
                                        placeholder="e.g. Juan"
                                        required
                                    />
                                    {addForm.errors.first_name && (
                                        <div style={{ color: '#f87171', fontSize: 10, marginTop: 4 }}>{addForm.errors.first_name}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="ai-field-lbl">Last Name *</label>
                                    <input
                                        id="add-last-name"
                                        className="ai-modal-input"
                                        value={addForm.data.last_name}
                                        onChange={e => addForm.setData('last_name', e.target.value)}
                                        placeholder="e.g. Dela Cruz"
                                        required
                                    />
                                    {addForm.errors.last_name && (
                                        <div style={{ color: '#f87171', fontSize: 10, marginTop: 4 }}>{addForm.errors.last_name}</div>
                                    )}
                                </div>
                            </div>

                            {/* Contact row */}
                            <div className="ai-2col">
                                <div>
                                    <label className="ai-field-lbl">Email <span style={{ opacity: .5 }}>(optional)</span></label>
                                    <input
                                        id="add-email"
                                        className="ai-modal-input"
                                        type="email"
                                        value={addForm.data.email}
                                        onChange={e => addForm.setData('email', e.target.value)}
                                        placeholder="juan@example.com"
                                    />
                                    {addForm.errors.email && (
                                        <div style={{ color: '#f87171', fontSize: 10, marginTop: 4 }}>{addForm.errors.email}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="ai-field-lbl">Phone <span style={{ opacity: .5 }}>(optional)</span></label>
                                    <input
                                        id="add-phone"
                                        className="ai-modal-input"
                                        value={addForm.data.phone}
                                        onChange={e => addForm.setData('phone', e.target.value)}
                                        placeholder="09XX XXX XXXX"
                                    />
                                </div>
                            </div>

                            {/* Year level / Strand row */}
                            <div className="ai-2col">
                                <div>
                                    <label className="ai-field-lbl">Year Level Applied *</label>
                                    <select
                                        id="add-year-level"
                                        className="ai-modal-select"
                                        value={addForm.data.year_level_applied}
                                        onChange={e => addForm.setData('year_level_applied', e.target.value)}
                                        required
                                    >
                                        <option value="">Select level…</option>
                                        <option value="Grade 7">Grade 7</option>
                                        <option value="Grade 8">Grade 8</option>
                                        <option value="Grade 9">Grade 9</option>
                                        <option value="Grade 10">Grade 10</option>
                                        <option value="Grade 11">Grade 11</option>
                                        <option value="Grade 12">Grade 12</option>
                                        <option value="1st Year College">1st Year College</option>
                                        <option value="2nd Year College">2nd Year College</option>
                                        <option value="3rd Year College">3rd Year College</option>
                                        <option value="4th Year College">4th Year College</option>
                                    </select>
                                    {addForm.errors.year_level_applied && (
                                        <div style={{ color: '#f87171', fontSize: 10, marginTop: 4 }}>{addForm.errors.year_level_applied}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="ai-field-lbl">Strand <span style={{ opacity: .5 }}>(optional)</span></label>
                                    <input
                                        id="add-strand"
                                        className="ai-modal-input"
                                        value={addForm.data.strand}
                                        onChange={e => addForm.setData('strand', e.target.value)}
                                        placeholder="e.g. STEM, ABM, HUMSS…"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="ai-modal-footer">
                            <button type="button" className="ai-cancel-btn" onClick={() => setShowAddModal(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="ai-commit-btn" disabled={addForm.processing}>
                                {addForm.processing
                                    ? <><RefreshCcw size={13} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
                                    : <><Plus size={13} /> Register Candidate</>
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* ══════════════════════════════════════
                DECISION / STATUS MODAL
            ══════════════════════════════════════ */}
            <Modal show={showProcessModal} onClose={() => setShowProcessModal(false)} maxWidth="lg">
                <div className="ai-modal">
                    <div className="ai-modal-hdr">
                        <div className="ai-modal-eyebrow">Candidate Registry · Decision Gateway</div>
                        <div className="ai-modal-title">Update Status</div>
                        {selectedCandidate && (
                            <div className="ai-modal-sub">
                                Processing candidate{' '}
                                <span style={{ color: '#fb923c', fontWeight: 700 }}>
                                    {selectedCandidate.first_name} {selectedCandidate.last_name}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Candidate snapshot */}
                    {selectedCandidate && (
                        <div style={{
                            margin: '16px 24px 0', padding: '12px 14px', borderRadius: 10,
                            background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)',
                            display: 'flex', alignItems: 'center', gap: 12
                        }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 9,
                                background: 'rgba(249,115,22,0.18)', border: '1px solid rgba(249,115,22,0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 11, fontWeight: 700, color: '#f97316',
                                fontFamily: "'Space Mono',monospace", flexShrink: 0
                            }}>
                                {selectedCandidate.first_name?.[0]}{selectedCandidate.last_name?.[0]}
                            </div>
                            <div>
                                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontWeight: 700, fontStyle: 'italic', color: C.txt }}>
                                    {selectedCandidate.first_name} {selectedCandidate.last_name}
                                </div>
                                <div style={{ fontSize: 9, color: C.dim, textTransform: 'uppercase', letterSpacing: '.07em', fontWeight: 700, marginTop: 2 }}>
                                    {selectedCandidate.year_level_applied}{selectedCandidate.strand ? ` · ${selectedCandidate.strand}` : ''} · {selectedCandidate.registration_code}
                                </div>
                            </div>
                            <div style={{ marginLeft: 'auto' }}>
                                {(() => {
                                    const sc = STATUS_CFG[selectedCandidate.status] || STATUS_CFG.pending;
                                    return (
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 5,
                                            padding: '3px 10px', borderRadius: 7,
                                            background: sc.bg, color: sc.color,
                                            border: `1px solid ${sc.border}`,
                                            fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em'
                                        }}>
                                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: sc.dot }} />
                                            {sc.label}
                                        </span>
                                    );
                                })()}
                            </div>
                        </div>
                    )}

                    <form onSubmit={submitUpdate}>
                        <div className="ai-modal-body">
                            <div>
                                <label className="ai-field-lbl">New Status</label>
                                <select
                                    id="status-select"
                                    className="ai-modal-select"
                                    value={statusForm.data.status}
                                    onChange={e => statusForm.setData('status', e.target.value)}
                                >
                                    <option value="accepted">Grant Acceptance</option>
                                    <option value="rejected">Issue Rejection</option>
                                </select>
                                {statusForm.errors.status && (
                                    <div style={{ color: '#f87171', fontSize: 10, marginTop: 4 }}>{statusForm.errors.status}</div>
                                )}
                            </div>

                            <div>
                                <label className="ai-field-lbl">Official Remarks</label>
                                <textarea
                                    id="remarks-textarea"
                                    className="ai-modal-textarea"
                                    value={statusForm.data.remarks}
                                    onChange={e => statusForm.setData('remarks', e.target.value)}
                                    placeholder="Internal notes on candidate evaluation…"
                                />
                            </div>

                            {statusForm.data.status && STATUS_CFG[statusForm.data.status] && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 9, padding: '10px 13px',
                                    borderRadius: 9, background: STATUS_CFG[statusForm.data.status].bg,
                                    border: `1px solid ${STATUS_CFG[statusForm.data.status].border}`
                                }}>
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_CFG[statusForm.data.status].dot, flexShrink: 0 }} />
                                    <span style={{ fontSize: 10, fontWeight: 700, color: STATUS_CFG[statusForm.data.status].color, textTransform: 'uppercase', letterSpacing: '.08em' }}>
                                        Will be set to: {STATUS_CFG[statusForm.data.status].label}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="ai-modal-footer">
                            <button type="button" className="ai-cancel-btn" onClick={() => setShowProcessModal(false)}>
                                Cancel
                            </button>
                            <button type="submit" disabled={statusForm.processing} className="ai-commit-btn">
                                {statusForm.processing
                                    ? <><RefreshCcw size={13} style={{ animation: 'spin 1s linear infinite' }} /> Processing…</>
                                    : <><ShieldCheck size={13} /> Commit Decision</>
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* ══════════════════════════════════════
                ENROLLMENT CONFIRMATION MODAL
            ══════════════════════════════════════ */}
            <Modal show={showEnrollModal} onClose={() => setShowEnrollModal(false)} maxWidth="sm">
                <div className="ai-modal">
                    <div className="ai-modal-hdr" style={{ background: 'linear-gradient(135deg,rgba(52,211,153,0.08),rgba(0,0,0,0.3))' }}>
                        <div className="ai-modal-eyebrow" style={{ color: 'rgba(52,211,153,0.5)' }}>Candidate Registry</div>
                        <div className="ai-modal-title">Authorize Enrollment</div>
                    </div>

                    <div className="ai-modal-body" style={{ padding: 24, textAlign: 'center' }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: 16,
                            background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px'
                        }}>
                            <UserPlus size={26} color="#34d399" />
                        </div>

                        <p style={{ fontSize: 14, color: C.txt, lineHeight: 1.6, marginBottom: 12 }}>
                            You are about to enroll <br />
                            <strong style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 18, color: '#34d399' }}>
                                {enrollTarget ? `${enrollTarget.first_name} ${enrollTarget.last_name}` : ''}
                            </strong>
                        </p>

                        <p style={{ fontSize: 11, color: C.dim, lineHeight: 1.5, background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 8, border: `1px solid ${C.bdr}` }}>
                            This will create a <span style={{ color: '#34d399', fontWeight: 700 }}>student record</span> and a{' '}
                            <span style={{ color: '#34d399', fontWeight: 700 }}>user account</span>. This action cannot be undone.
                        </p>
                    </div>

                    <div className="ai-modal-footer">
                        <button type="button" className="ai-cancel-btn" onClick={() => setShowEnrollModal(false)}>
                            Cancel
                        </button>
                        <button
                            id="btn-confirm-enroll"
                            type="button"
                            onClick={confirmEnroll}
                            className="ai-commit-btn"
                            style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 4px 14px rgba(16,185,129,0.3)' }}
                        >
                            <ShieldCheck size={13} /> Confirm Enrollment
                        </button>
                    </div>
                </div>
            </Modal>

            {/* ══════════════════════════════════════
                STUDENT CREDENTIALS MODAL
            ══════════════════════════════════════ */}
            <Modal show={showCredentials} onClose={() => setShowCredentials(false)} maxWidth="lg">
                <div className="ai-modal">
                    {/* Header */}
                    <div className="ai-modal-hdr" style={{
                        background: 'linear-gradient(135deg, rgba(52,211,153,0.1), rgba(0,0,0,0.4))'
                    }}>
                        <div className="ai-modal-eyebrow" style={{ color: 'rgba(52,211,153,0.6)' }}>
                            Enrollment Complete · Student Account Created
                        </div>
                        <div className="ai-modal-title" style={{ color: '#34d399' }}>
                            Account Credentials
                        </div>
                        <div className="ai-modal-sub">
                            Share these credentials with the student. The password cannot be recovered after closing.
                        </div>
                    </div>

                    <div className="ai-modal-body">

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
                                <label className="ai-field-lbl">{item.label}</label>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    background: 'rgba(249,115,22,0.06)',
                                    border: '1px solid #2a1508',
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

                    <div className="ai-modal-footer">
                        <button
                            className="ai-commit-btn"
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