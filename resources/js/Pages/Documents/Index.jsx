import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm, router } from '@inertiajs/react';
import {
    FileText, Plus, Save, X, User,
    Download, Trash2, File, Paperclip,
    ArrowUpCircle, Search, Shield,
    BookOpen, Award, FileCheck, MoreHorizontal, ChevronRight, Layers
} from 'lucide-react';
import axios from 'axios';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) axios.defaults.headers.common['X-XSRF-TOKEN'] = token.content;

/* ─────────────────────────────────────
   STYLES
───────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,900&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');

*,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── ROOT ── */
.di-root {
  background: #0c0805;
  flex: 1;
  display: flex;
  flex-direction: column;
  font-family: 'DM Sans', system-ui, sans-serif;
  color: #fef3ec;
  padding: 28px 32px 28px;
  position: relative;
  overflow: hidden;
}
.di-grid-tex {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    linear-gradient(rgba(249,115,22,0.022) 1px, transparent 1px),
    linear-gradient(90deg, rgba(249,115,22,0.022) 1px, transparent 1px);
  background-size: 48px 48px;
}
.di-orb1 {
  position: fixed; top: -8%; right: -4%;
  width: 480px; height: 480px; border-radius: 50%;
  background: radial-gradient(circle, rgba(249,115,22,0.055) 0%, transparent 65%);
  pointer-events: none; z-index: 0;
}
.di-orb2 {
  position: fixed; bottom: -6%; left: 28%;
  width: 340px; height: 340px; border-radius: 50%;
  background: radial-gradient(circle, rgba(194,65,12,0.04) 0%, transparent 65%);
  pointer-events: none; z-index: 0;
}
.di-content { position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; min-height: 0; }

/* ── HEADER ── */
.di-hdr {
  display: flex; align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 22px; gap: 16px;
}
.di-tags { display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap; }
.di-tag {
  font-size: 9px; font-weight: 700; padding: 2px 9px;
  border-radius: 4px; letter-spacing: .08em; text-transform: uppercase;
}
.di-title {
  font-family: 'Playfair Display', serif;
  font-size: 30px; font-weight: 900; color: #fef3ec;
  line-height: 1.0; letter-spacing: -.02em;
}
.di-title em { color: #f97316; font-style: italic; display: block; }
.di-sub { font-size: 11px; color: rgba(254,243,236,0.22); margin-top: 5px; font-style: italic; }

.di-upload-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 20px; border-radius: 11px;
  background: linear-gradient(135deg, #f97316, #c2410c);
  color: #fff; font-size: 12px; font-weight: 700;
  border: none; cursor: pointer;
  box-shadow: 0 4px 18px rgba(249,115,22,0.32);
  transition: all .22s; white-space: nowrap;
  font-family: inherit; flex-shrink: 0; margin-top: 4px;
}
.di-upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 26px rgba(249,115,22,0.42);
}

/* ── STAT STRIP ── */
.di-stats {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 10px; margin-bottom: 24px;
}
.di-stat {
  background: linear-gradient(145deg, rgba(249,115,22,0.07), rgba(0,0,0,0.38));
  border: 1px solid #2a1508; border-radius: 13px;
  padding: 14px 16px; position: relative; overflow: hidden;
  transition: border-color .22s, transform .18s;
}
.di-stat:hover { border-color: rgba(249,115,22,0.32); transform: translateY(-1px); }
.di-stat::after {
  content: ''; position: absolute; top: -28px; right: -28px;
  width: 72px; height: 72px; border-radius: 50%;
  background: rgba(249,115,22,0.07); transition: transform .35s;
}
.di-stat:hover::after { transform: scale(1.7); }
.di-stat-icon {
  width: 28px; height: 28px; border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 9px; position: relative; z-index: 1;
}
.di-stat-val {
  font-family: 'Space Mono', monospace;
  font-size: 22px; font-weight: 700; color: #fef3ec;
  line-height: 1; position: relative; z-index: 1;
}
.di-stat-lbl {
  font-size: 9px; font-weight: 700; color: rgba(254,243,236,0.45);
  margin-top: 4px; text-transform: uppercase; letter-spacing: .07em;
  position: relative; z-index: 1;
}

/* ── DOCUMENT GRID ── */
.di-doc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px; padding: 2px;
  padding-top: 14px;
}
.di-doc-grid::-webkit-scrollbar { width: 6px; }
.di-doc-grid::-webkit-scrollbar-track { background: transparent; }
.di-doc-grid::-webkit-scrollbar-thumb { background: rgba(249,115,22,0.2); border-radius: 4px; }
.di-doc-grid::-webkit-scrollbar-thumb:hover { background: rgba(249,115,22,0.4); }

/* ── DOCUMENT CARD ── */
.di-doc-card {
  background: #160e08;
  border: 1px solid #2a1508;
  border-radius: 14px; overflow: hidden;
  display: flex; flex-direction: column;
  transition: border-color .22s, transform .2s, box-shadow .2s;
  position: relative;
}
.di-doc-card:hover {
  border-color: rgba(249,115,22,0.35);
  transform: translateY(-3px);
  box-shadow: 0 10px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(249,115,22,0.08);
}

/* top accent bar */
.di-doc-bar {
  height: 3px; width: 100%;
  background: linear-gradient(90deg, #f97316, #c2410c, transparent);
  flex-shrink: 0;
}

/* inner top glow on hover */
.di-doc-card::before {
  content: ''; position: absolute;
  top: 0; left: 0; right: 0; height: 100px;
  background: linear-gradient(180deg, rgba(249,115,22,0.04), transparent);
  pointer-events: none; opacity: 0; transition: opacity .28s;
}
.di-doc-card:hover::before { opacity: 1; }

.di-doc-body {
  flex: 1; padding: 18px 16px 14px;
  display: flex; flex-direction: column;
  align-items: center; text-align: center; gap: 10px;
}

/* file icon container */
.di-doc-icon {
  width: 56px; height: 56px; border-radius: 14px;
  background: rgba(249,115,22,0.1);
  border: 1px solid rgba(249,115,22,0.22);
  display: flex; align-items: center; justify-content: center;
  transition: background .2s, border-color .2s;
}
.di-doc-card:hover .di-doc-icon {
  background: rgba(249,115,22,0.18);
  border-color: rgba(249,115,22,0.38);
}

.di-doc-name {
  font-family: 'Playfair Display', serif;
  font-size: 13px; font-weight: 700; font-style: italic;
  color: #fef3ec; line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  max-width: 160px;
}
.di-doc-type {
  font-family: 'Space Mono', monospace;
  font-size: 8px; font-weight: 700;
  text-transform: uppercase; letter-spacing: .1em;
  color: rgba(249,115,22,0.55);
  background: rgba(249,115,22,0.08);
  border: 1px solid rgba(249,115,22,0.18);
  padding: 2px 9px; border-radius: 4px;
}
.di-doc-student {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px; font-style: italic;
  color: rgba(254,243,236,0.35);
}

/* card footer */
.di-doc-footer {
  padding: 10px 14px;
  border-top: 1px solid rgba(249,115,22,0.08);
  background: rgba(249,115,22,0.03);
  display: flex; align-items: center; justify-content: space-between;
}
.di-action-btn {
  width: 30px; height: 30px; border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  background: transparent; border: 1px solid transparent;
  color: rgba(254,243,236,0.28); cursor: pointer;
  transition: all .15s; text-decoration: none;
}
.di-action-btn.dl:hover {
  color: #fb923c;
  background: rgba(249,115,22,0.12);
  border-color: rgba(249,115,22,0.25);
}
.di-action-btn.del:hover {
  color: #f87171;
  background: rgba(239,68,68,0.1);
  border-color: rgba(239,68,68,0.28);
}

/* ── EMPTY STATE ── */
.di-empty {
  grid-column: 1 / -1;
  padding: 80px 24px; text-align: center;
  background: #160e08;
  border: 1px dashed rgba(249,115,22,0.15);
  border-radius: 16px;
}
.di-empty-icon {
  width: 64px; height: 64px; border-radius: 18px;
  background: rgba(249,115,22,0.08);
  border: 1px solid rgba(249,115,22,0.15);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 18px;
}
.di-empty-title {
  font-family: 'Playfair Display', serif;
  font-size: 20px; font-weight: 700; font-style: italic;
  color: rgba(254,243,236,0.3); margin-bottom: 7px;
}
.di-empty-sub { font-size: 11px; color: rgba(254,243,236,0.18); }

/* ── MODAL OVERLAY ── */
.di-overlay {
  position: fixed; inset: 0; z-index: 100;
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
  background: rgba(12,8,5,0.82);
  backdrop-filter: blur(8px);
  animation: di-fade-in .2s ease;
}
@keyframes di-fade-in { from { opacity: 0; } to { opacity: 1; } }

.di-modal {
  background: #160e08;
  border: 1px solid #2a1508;
  border-radius: 18px; overflow: hidden;
  width: 100%; max-width: 480px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.75), 0 0 0 1px rgba(249,115,22,0.08);
  animation: di-modal-in .28s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes di-modal-in {
  from { opacity: 0; transform: translateY(16px) scale(0.97); }
  to   { opacity: 1; transform: none; }
}

.di-modal-hdr {
  padding: 18px 22px 16px;
  background: linear-gradient(135deg, rgba(249,115,22,0.1), rgba(0,0,0,0.4));
  border-bottom: 1px solid #2a1508;
  display: flex; align-items: center; gap: 12px;
  position: relative; overflow: hidden;
}
.di-modal-hdr::before {
  content: ''; position: absolute; top: -40px; right: -40px;
  width: 120px; height: 120px; border-radius: 50%;
  background: rgba(249,115,22,0.08);
}
.di-modal-hdr-icon {
  width: 36px; height: 36px; border-radius: 9px;
  background: rgba(249,115,22,0.18);
  border: 1px solid rgba(249,115,22,0.3);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; position: relative; z-index: 1;
}
.di-modal-title {
  font-family: 'Playfair Display', serif;
  font-size: 18px; font-weight: 900; font-style: italic;
  color: #fef3ec; line-height: 1;
  position: relative; z-index: 1;
}
.di-modal-sub {
  font-size: 9px; font-weight: 700; text-transform: uppercase;
  letter-spacing: .14em; color: rgba(249,115,22,0.45);
  margin-top: 3px; position: relative; z-index: 1;
}
.di-modal-close {
  margin-left: auto; width: 28px; height: 28px; border-radius: 7px;
  background: rgba(249,115,22,0.08); border: 1px solid rgba(249,115,22,0.18);
  color: rgba(254,243,236,0.45); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all .15s; flex-shrink: 0; position: relative; z-index: 1;
}
.di-modal-close:hover { color: #fef3ec; background: rgba(249,115,22,0.15); }

.di-modal-body { padding: 18px 22px; display: flex; flex-direction: column; gap: 14px; }
.di-field-lbl {
  font-size: 8px; font-weight: 700; text-transform: uppercase;
  letter-spacing: .14em; color: rgba(249,115,22,0.45);
  display: block; margin-bottom: 6px;
}
.di-field {
  width: 100%;
  background: rgba(249,115,22,0.06);
  border: 1px solid #2a1508;
  border-radius: 9px; color: #fef3ec;
  font-size: 12px; padding: 10px 13px;
  outline: none; font-family: inherit;
  transition: border-color .18s;
  -webkit-appearance: none;
}
.di-field:focus { border-color: rgba(249,115,22,0.45); }
.di-field::placeholder { color: rgba(254,243,236,0.22); }
.di-field option { background: #1c1208; }

/* file input */
.di-file-wrap {
  width: 100%;
  background: rgba(249,115,22,0.04);
  border: 1px dashed rgba(249,115,22,0.22);
  border-radius: 9px; padding: 14px;
  text-align: center; cursor: pointer;
  transition: border-color .18s, background .18s;
  position: relative;
}
.di-file-wrap:hover {
  border-color: rgba(249,115,22,0.42);
  background: rgba(249,115,22,0.07);
}
.di-file-wrap input[type="file"] {
  position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
}
.di-file-icon {
  width: 32px; height: 32px; border-radius: 8px;
  background: rgba(249,115,22,0.12);
  border: 1px solid rgba(249,115,22,0.22);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 8px;
}
.di-file-lbl { font-size: 10px; font-weight: 600; color: rgba(254,243,236,0.5); }
.di-file-sub { font-size: 8px; color: rgba(254,243,236,0.22); margin-top: 2px; }

.di-modal-footer {
  padding: 12px 22px 18px;
  border-top: 1px solid #2a1508;
}
.di-submit-btn {
  width: 100%; padding: 11px;
  background: linear-gradient(135deg, #f97316, #c2410c);
  border: none; border-radius: 10px;
  color: #fff; font-size: 12px; font-weight: 700;
  text-transform: uppercase; letter-spacing: .1em;
  cursor: pointer; transition: all .2s; font-family: inherit;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  box-shadow: 0 4px 16px rgba(249,115,22,0.3);
}
.di-submit-btn:hover { transform: translateY(-1px); box-shadow: 0 7px 22px rgba(249,115,22,0.42); }
.di-submit-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }

/* ── PROGRAM & SECTION CARDS ── */
.di-prog-card {
  background: #160e08;
  border: 1px solid #2a1508;
  border-radius: 0 16px 16px 16px;
  padding: 24px;
  position: relative;
  transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 40px rgba(0,0,0,0.6);
  margin-top: 14px;
}
/* Folder tab — top-left notch */
.di-prog-card::after {
  content: '';
  position: absolute;
  top: -14px;
  left: -1px;
  width: 72px;
  height: 14px;
  background: #160e08;
  border: 1px solid #2a1508;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
}
/* Orange top accent line sits ON the folder body, not the tab */
.di-prog-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, #f97316, #c2410c, transparent);
  border-radius: 0 16px 0 0;
}
/* Hover — tab glows orange */
.di-prog-card:hover::after {
  background: #1e1008;
  border-color: rgba(249,115,22,0.35);
}
.di-prog-card:hover {
  border-color: rgba(249,115,22,0.45);
  transform: translateY(-4px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(249,115,22,0.08);
}

.di-prog-code {
  font-family: 'Playfair Display', serif;
  font-size: 32px; font-weight: 900; font-style: italic;
  color: #fef3ec; line-height: 1; margin-bottom: 8px;
  text-shadow: 0 0 20px rgba(255,255,255,0.1);
}
.di-prog-name {
  font-size: 10px; font-weight: 700; color: rgba(254,243,236,0.3);
  text-transform: uppercase; letter-spacing: .05em; margin-bottom: 16px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

.di-prog-stats { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
.di-prog-stat {
  display: flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 6px; font-size: 9px; font-weight: 800;
  text-transform: uppercase; letter-spacing: .02em;
}

.di-progress-track {
  width: 100%; height: 3px; background: rgba(255,255,255,0.05);
  border-radius: 2px; margin-bottom: 20px; position: relative;
}
.di-progress-bar {
  position: absolute; left: 0; top: 0; height: 100%;
  background: #f97316; border-radius: 2px;
  box-shadow: 0 0 12px rgba(249,115,22,0.5);
}

.di-manage-btn {
  width: 100%; padding: 12px; border-radius: 10px;
  background: rgba(249,115,22,0.04);
  border: 1px solid rgba(249,115,22,0.1);
  color: rgba(254,243,236,0.4); font-size: 10px; font-weight: 800;
  text-transform: uppercase; letter-spacing: .12em;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  cursor: pointer; transition: all .2s;
}
.di-prog-card:hover .di-manage-btn {
  background: rgba(249,115,22,0.08);
  color: #fef3ec; border-color: rgba(249,115,22,0.2);
}

.di-dashed-card {
  border: 1px solid #2a1508;
  background: rgba(249,115,22,0.01); justify-content: center; align-items: center;
  text-align: center; cursor: pointer;
}
.di-dashed-card:hover {
  border-color: rgba(249,115,22,0.4);
  background: rgba(249,115,22,0.03);
}
.di-plus-box {
  width: 48px; height: 48px; border-radius: 12px;
  background: rgba(249,115,22,0.05);
  border: 1px solid rgba(249,115,22,0.2);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px; transition: all .2s;
}
.di-dashed-card:hover .di-plus-box {
  background: rgba(249,115,22,0.1);
  border-color: rgba(249,115,22,0.4);
  transform: scale(1.05);
}

/* Section specific */
.di-year-hdr {
  grid-column: 1 / -1; margin: 24px 0 12px;
  display: flex; align-items: center; gap: 12px;
}
.di-year-title {
  font-size: 12px; font-weight: 900; color: #f97316;
  text-transform: uppercase; letter-spacing: .15em;
  display: flex; align-items: center; gap: 10px;
}
.di-year-title span {
  font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 4px;
  background: rgba(249,115,22,0.1); color: rgba(249,115,22,0.6);
}
.di-year-line { flex: 1; height: 1px; background: linear-gradient(90deg, rgba(249,115,22,0.2), transparent); }

.di-info-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.di-info-icon {
  width: 32px; height: 32px; border-radius: 9px;
  background: rgba(255,255,255,0.03);
  display: flex; align-items: center; justify-content: center;
  color: rgba(254,243,236,0.25);
}
.di-info-cnt { display: flex; flex-direction: column; }
.di-info-lbl { font-size: 8px; font-weight: 700; color: rgba(254,243,236,0.25); text-transform: uppercase; letter-spacing: .08em; }
.di-info-val { font-size: 11px; font-weight: 800; color: #fef3ec; margin-top: 1px; }

/* STAGGER CARDS */
.di-card-wrap:nth-child(1)  { animation: di-up .36s .10s ease both; }
.di-card-wrap:nth-child(2)  { animation: di-up .36s .14s ease both; }
.di-card-wrap:nth-child(3)  { animation: di-up .36s .18s ease both; }
.di-card-wrap:nth-child(4)  { animation: di-up .36s .22s ease both; }
.di-card-wrap:nth-child(5)  { animation: di-up .36s .26s ease both; }
.di-card-wrap:nth-child(6)  { animation: di-up .36s .30s ease both; }
.di-card-wrap:nth-child(7)  { animation: di-up .36s .34s ease both; }
.di-card-wrap:nth-child(8)  { animation: di-up .36s .38s ease both; }
.di-card-wrap:nth-child(n+9){ animation: di-up .36s .40s ease both; }

@keyframes toast-shrink {
    from { width: 100%; }
    to   { width: 0%; }
}
`;

/* ── TYPE → ICON MAP ── */
const TYPE_ICON = {
    "Report Card": FileText,
    "Birth Certificate": Shield,
    "Medical Certificate": FileCheck,
    "Certificate of Completion": Award,
};
const TYPE_COLOR = {
    "Report Card": "#f97316",
    "Birth Certificate": "#fb923c",
    "Medical Certificate": "#34d399",
    "Certificate of Completion": "#fdba74",
    "Other": "#94a3b8",
};

// Fetches and displays plain text files
const TextPreview = ({ url }) => {
    const [text, setText] = React.useState('Loading…');
    React.useEffect(() => {
        fetch(url)
            .then(r => r.text())
            .then(setText)
            .catch(() => setText('Could not load file content.'));
    }, [url]);
    return (
        <pre style={{
            padding: '24px', color: 'rgba(254,243,236,0.7)',
            fontSize: '12px', lineHeight: 1.7, fontFamily: "'Space Mono', monospace",
            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            maxHeight: '75vh', overflow: 'auto', width: '100%',
        }}>
            {text}
        </pre>
    );
};


export default function DocumentIndex({ auth, documents, students, programs: initialPrograms, folders: initialFolders }) {
    const [previewDoc, setPreviewDoc] = React.useState(null); // null = closed, doc object = open
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isProgramModalOpen, setIsProgramModalOpen] = React.useState(false);
    const [deleteModal, setDeleteModal] = React.useState(null); // null | { id, title }
    const [toast, setToast] = React.useState(null); // null | { type: 'success'|'error', message }

    // Auto-dismiss toast after 3 seconds
    React.useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(t);
    }, [toast]);
    const [view, setView] = React.useState('programs'); // 'programs', 'sections', 'documents'
    const [selectedProgram, setSelectedProgram] = React.useState(null);
    const [selectedSection, setSelectedSection] = React.useState(null);
    
    // Custom Folders Navigation
    const [selectedFolder, setSelectedFolder] = React.useState(null);
    const [folderStack, setFolderStack] = React.useState([]); // breadcrumb trail
    const [folderContents, setFolderContents] = React.useState(null); // { subfolders, documents }
    const [isSubfolderModalOpen, setIsSubfolderModalOpen] = React.useState(false);
    const [isFolderUploadModalOpen, setIsFolderUploadModalOpen] = React.useState(false);
    const [folderUploadForm, setFolderUploadForm] = React.useState({ title: '', file: null });

    // Section-level actions
    const [isSectionUploadOpen, setIsSectionUploadOpen] = React.useState(false);
    const [isSectionFolderOpen, setIsSectionFolderOpen] = React.useState(false);
    const [sectionUploadForm, setSectionUploadForm] = React.useState({ title: '', file: null });
    const sectionFolderCreateForm = useForm({ name: '' });
    const [sectionFolders, setSectionFolders] = React.useState([]);

    const [uploadProgress, setUploadProgress] = React.useState(null); // null = idle, { current, total, currentFile } = uploading
    const subfolderForm = useForm({ name: '' });

    const getFileType = (filePath) => {
        if (!filePath) return 'unknown';
        const ext = filePath.split('.').pop().toLowerCase();
        if (ext === 'pdf') return 'pdf';
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
        if (['txt', 'csv'].includes(ext)) return 'text';
        return 'unknown';
    };

    // Deduplicate programs by ID
    const programs = React.useMemo(() => {
        const uniqueMap = new Map();
        (initialPrograms || []).forEach(p => {
            if (!uniqueMap.has(p.id)) uniqueMap.set(p.id, p);
        });
        return Array.from(uniqueMap.values());
    }, [initialPrograms]);

    const folders = React.useMemo(() => {
        const uniqueMap = new Map();
        (initialFolders || []).forEach(f => {
            // Only include root-level folders (no parent)
            if (!uniqueMap.has(f.id) && !f.parent_id) {
                uniqueMap.set(f.id, f);
            }
        });
        return Array.from(uniqueMap.values());
    }, [initialFolders]);

    const user = auth.user;
    const userRole = user.role || (user.roles && user.roles[0]?.name);

    // Form for documents
    const { data, setData, post, delete: destroyDoc, processing, errors, reset } = useForm({
        program_id: '',
        folder_id: '',
        title: '',
        file: null,
    });

    // Form for new programs
    const programForm = useForm({
        name: '',
    });

    const handleFolderFromPC = async (e) => {
        const files = Array.from(e.target.files);
        e.target.value = ''; // reset so same folder can be re-selected
        if (!files.length) return;

        try {
            // Group files by their relative folder path
            const folderMap = {};
            files.forEach(file => {
                const parts = file.webkitRelativePath.split('/');
                const folderPath = parts.slice(0, -1).join('/'); // everything except filename
                if (!folderMap[folderPath]) folderMap[folderPath] = [];
                folderMap[folderPath].push(file);
            });

            // Build folder hierarchy — sort paths so parents are created before children
            const sortedPaths = Object.keys(folderMap).sort();
            const totalFiles = files.length;
            let uploadedCount = 0;
            const pathToFolderId = {};

            // If we are currently inside a folder, we use it as the base parent
            const baseParentId = selectedFolder?.id || null;

            for (const folderPath of sortedPaths) {
                const parts = folderPath.split('/');
                const folderName = parts[parts.length - 1];
                const parentPath = parts.slice(0, -1).join('/');
                
                // If it's a root folder from the selection, its parent is baseParentId
                // Otherwise, its parent is the folderId we just created for parentPath
                const parentId = parentPath ? pathToFolderId[parentPath] : baseParentId;

                // Create the folder via API
                const res = await axios.post('/api/folders', {
                    name: folderName,
                    parent_id: parentId,
                });
                const newFolderId = res.data.id;
                pathToFolderId[folderPath] = newFolderId;

                // Upload each file inside this folder
                for (const file of folderMap[folderPath]) {
                    console.log('Uploading file:', file.name, 'to folder ID:', newFolderId);

                    setUploadProgress({
                        current: uploadedCount + 1,
                        total: totalFiles,
                        currentFile: file.name,
                    });

                    const formData = new FormData();
                    formData.append('title', file.name);
                    formData.append('file', file);
                    const uploadRes = await axios.post(`/api/folders/${newFolderId}/upload`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    console.log('Upload response:', uploadRes.data);
                    uploadedCount++;
                }
            }

            setUploadProgress(null);
            window.location.reload();
        } catch (err) {
            setUploadProgress(null);
            console.error('Folder upload failed:', err);
            alert(`Upload failed: ${err?.response?.data?.message || err.message || 'Unknown error'}`);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('documents.store'), {
            onSuccess: () => { setIsModalOpen(false); reset(); }
        });
    };

    const folderForm = useForm({ name: '' });

    const handleFolderSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/folders', folderForm.data)
            .then(() => { window.location.reload(); })
            .catch(err => {
                if (err.response?.data?.errors) {
                    folderForm.setError(err.response.data.errors);
                }
            });
    };



    const handleSectionUpload = async (e) => {
        e.preventDefault();
        if (!sectionUploadForm.file) {
            alert('Please select a file.');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('title',      sectionUploadForm.title);
            formData.append('file',       sectionUploadForm.file);
            formData.append('section_id', selectedSection.id);
            formData.append('type',       'Other');
            formData.append('visibility', 'everyone');

            console.log('Uploading to section:', selectedSection?.id, selectedSection?.name);
            console.log('Form data title:', sectionUploadForm.title);
            console.log('Form data file:', sectionUploadForm.file);

            await axios.post('/api/section-documents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setIsSectionUploadOpen(false);
            setSectionUploadForm({ title: '', file: null });
            window.location.reload();
        } catch (err) {
            console.error('Section upload error:', err);
            alert(`Upload failed: ${err?.response?.data?.message || err.message}`);
        }
    };

    const openFolder = async (folder) => {
        const res = await axios.get(`/api/folders/${folder.id}`);
        setSelectedFolder(folder);
        // If the folder is already in the stack, we might be navigating back.
        // But the simple logic from the user is to just append.
        // Actually, Step 10 logic implies stack management.
        // Let's refine the stack logic: if folder is in stack, slice it.
        setFolderStack(prev => {
            const idx = prev.findIndex(f => f.id === folder.id);
            if (idx !== -1) return prev.slice(0, idx + 1);
            return [...prev, folder];
        });
        setFolderContents({
            subfolders: res.data.children || [],
            documents: res.data.documents || [],
        });
        setView('folderContents');
    };

    const goUpFolder = () => {
        const newStack = [...folderStack];
        newStack.pop();
        if (newStack.length === 0) {
            setView('programs');
            setSelectedFolder(null);
            setFolderStack([]);
            setFolderContents(null);
        } else {
            const parent = newStack[newStack.length - 1];
            setFolderStack(newStack);
            // We need to re-fetch to update contents correctly
            axios.get(`/api/folders/${parent.id}`).then(res => {
                setSelectedFolder(parent);
                setFolderContents({
                    subfolders: res.data.children || [],
                    documents: res.data.documents || [],
                });
            });
        }
    };

    const handleSubfolderSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/folders', {
            name: subfolderForm.data.name,
            parent_id: selectedFolder.id,
        }).then(() => {
            subfolderForm.reset();
            setIsSubfolderModalOpen(false);
            openFolder(selectedFolder);
        }).catch(err => subfolderForm.setError(err.response?.data?.errors || {}));
    };

    const handleFolderUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', folderUploadForm.title);
        formData.append('file', folderUploadForm.file);
        await axios.post(`/api/folders/${selectedFolder.id}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        openFolder(selectedFolder); // refresh
        setIsFolderUploadModalOpen(false);
        setFolderUploadForm({ title: '', file: null });
    };


    const handleDelete = (id, title) => {
        setDeleteModal({ id, title });
    };

    const confirmDelete = async () => {
        if (!deleteModal) return;
        const { id } = deleteModal;
        setDeleteModal(null);
        try {
            await axios.delete(route('documents.destroy', id));

            setToast({ type: 'success', message: 'Document deleted successfully.' });

            if (view === 'folderContents' && selectedFolder) {
                await openFolder(selectedFolder);
                return;
            }

            router.reload({
                only: ['documents'],
                preserveState: true,
                preserveScroll: true,
            });

        } catch (err) {
            console.error('Delete error:', err);
            setToast({ type: 'error', message: err?.response?.data?.message || 'Failed to delete document.' });
        }
    };

    const handleDeleteFolder = (id) => {
        if (confirm('Permanently delete this folder and its subfolders?')) {
            axios.delete(`/api/folders/${id}`).then(() => {
                window.location.reload();
            }).catch(err => {
                alert('Failed to delete folder: ' + (err.response?.data?.message || err.message));
            });
        }
    };

    // Filter documents based on drill-down state
    const allDocs = documents.data;

    // Filter documents for the current view
    const filteredDocs = React.useMemo(() => {
        if (view !== 'documents') return [];
        if (selectedFolder) {
            return allDocs.filter(d => d.folder_id === selectedFolder.id);
        }
        if (!selectedSection) return allDocs;
        return allDocs.filter(d => {
            // Match by direct section_id (use == for number/string coercion safety)
            if (d.section_id != null && d.section_id == selectedSection.id) return true;
            // Match by student's section
            if (d.student && d.student.section_id == selectedSection.id) return true;
            return false;
        });
    }, [view, selectedSection, selectedFolder, allDocs]);

    const myUploads = filteredDocs.filter(d => d.uploaded_by === user.id);
    const sharedByDean = filteredDocs.filter(d => d.uploaded_by_role === 'dean' && d.uploaded_by !== user.id);
    /* stat counts */
    const typeCounts = allDocs.reduce((acc, d) => {
        acc[d.type] = (acc[d.type] || 0) + 1;
        return acc;
    }, {});

    // Group sections by year level
    const groupedSections = React.useMemo(() => {
        if (!selectedProgram) return {};
        return selectedProgram.sections.reduce((acc, sec) => {
            const year = sec.grade_level;
            if (!acc[year]) acc[year] = [];
            acc[year].push(sec);
            return acc;
        }, {});
    }, [selectedProgram]);

    const statCards = [
        { label: "Total Files", val: allDocs.length, color: "#f97316", Icon: Paperclip },
        { label: "Report Cards", val: typeCounts["Report Card"] || 0, color: "#fb923c", Icon: FileText },
        { label: "Certificates", val: (typeCounts["Certificate of Completion"] || 0) + (typeCounts["Birth Certificate"] || 0), color: "#fdba74", Icon: Award },
        { label: "Medical", val: typeCounts["Medical Certificate"] || 0, color: "#34d399", Icon: FileCheck },
    ];

    const VisibilityBadge = ({ visibility }) => {
        const styles = {
            everyone: { bg: 'rgba(52,211,153,0.1)', color: '#34d399', text: 'Everyone' },
            professors: { bg: 'rgba(249,115,22,0.1)', color: '#fb923c', text: 'Professors Only' },
            students: { bg: 'rgba(56,189,248,0.1)', color: '#38bdf8', text: 'Students Only' },
            specific: { bg: 'rgba(168,85,247,0.1)', color: '#a855f7', text: 'Specific Users' },
        };
        const s = styles[visibility] || styles.everyone;
        return (
            <span className="di-tag" style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}25`, fontSize: '7px', marginTop: '4px' }}>
                {s.text}
            </span>
        );
    };

    const DocumentCard = ({ doc }) => {
        const DocIcon = TYPE_ICON[doc.type] || FileText;
        const docColor = TYPE_COLOR[doc.type] || "#f97316";
        return (
            <div className="di-card-wrap">
                <div
                    className="di-doc-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setPreviewDoc(doc)}
                >
                    <div className="di-doc-bar"
                        style={{ background: `linear-gradient(90deg,${docColor},${docColor}55,transparent)` }}
                    />
                    <div className="di-doc-body">
                        <div className="di-doc-icon"
                            style={{ background: `${docColor}14`, border: `1px solid ${docColor}28` }}>
                            <DocIcon size={26} color={docColor} strokeWidth={1.5} />
                        </div>
                        <div>
                            <div className="di-doc-name">{doc.title || doc.name}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                            <span className="di-doc-type"
                                style={{ color: docColor, background: `${docColor}10`, border: `1px solid ${docColor}20` }}>
                                {doc.type}
                            </span>
                            {userRole === 'dean' && <VisibilityBadge visibility={doc.visibility} />}
                        </div>
                        <div className="di-doc-student">
                            {doc.student ? `${doc.student.first_name} ${doc.student.last_name}` : 'General File'}
                        </div>
                        {doc.uploader && (
                            <div className="di-doc-student" style={{ opacity: 0.6, fontSize: '8px', marginTop: '2px' }}>
                                Uploaded by {doc.uploader.name} ({doc.uploaded_by_role})
                            </div>
                        )}
                    </div>
                    <div className="di-doc-footer" onClick={e => e.stopPropagation()}>
                        <a
                            href={`/storage/${doc.file_path}`}
                            target="_blank"
                            className="di-action-btn dl"
                            title="Download file"
                            onClick={e => e.stopPropagation()}
                        >
                            <Download size={14} />
                        </a>
                        {(userRole === 'dean' || doc.uploaded_by === user.id) && (
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(doc.id, doc.title || doc.name); }}
                                className="di-action-btn del"
                                title="Delete document"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Breadcrumb Component
    const Breadcrumbs = () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '11px', fontWeight: 600, color: 'rgba(254,243,236,0.3)' }}>
            <span
                onClick={() => { 
                    setView('programs'); 
                    setSelectedProgram(null); 
                    setSelectedSection(null); 
                    setSelectedFolder(null);
                    setFolderStack([]);
                    setFolderContents(null);
                    setSectionFolders([]);
                }}
                style={{ cursor: 'pointer', color: view === 'programs' ? '#f97316' : 'inherit' }}
            >
                ARCHIVE FOLDERS
            </span>
            {selectedProgram && (
                <>
                    <span>/</span>
                    <span
                        onClick={() => { setView('sections'); setSelectedSection(null); setSelectedFolder(null); setSectionFolders([]); }}
                        style={{ cursor: 'pointer', color: view === 'sections' ? '#f97316' : 'inherit' }}
                    >
                        {selectedProgram.code}
                    </span>
                </>
            )}
            {selectedSection && (
                <>
                    <span>/</span>
                    <span style={{ color: '#f97316' }}>{selectedSection.name}</span>
                </>
            )}
            {folderStack.map((f, i) => (
                <React.Fragment key={f.id}>
                    <span>/</span>
                    <span
                        onClick={() => {
                            if (i < folderStack.length - 1) openFolder(f);
                        }}
                        style={{ cursor: i < folderStack.length - 1 ? 'pointer' : 'default', color: i === folderStack.length - 1 ? '#f97316' : 'inherit' }}
                    >
                        {f.name}
                    </span>
                </React.Fragment>
            ))}
        </div>
    );


    return (
        <AppLayout title="Student Documents" noPadding>
            <style>{css}</style>
            <div className="di-root">
                <div className="di-grid-tex" />
                <div className="di-orb1" />
                <div className="di-orb2" />
                <div className="di-content" style={{ flex: 1 }}>

                    {/* ── HEADER ── */}
                    <div className="di-hdr di-fade">
                        <div>
                            <div className="di-tags">
                                <span className="di-tag" style={{ background: "rgba(249,115,22,0.14)", color: "#fb923c", border: "1px solid rgba(249,115,22,0.28)" }}>
                                    CCS · ProFile
                                </span>
                                <span className="di-tag" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(254,243,236,0.45)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                    Documents
                                </span>
                                <span className="di-tag" style={{ background: "rgba(52,211,153,0.10)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" }}>
                                    ● {userRole?.toUpperCase()} ACCESS
                                </span>
                            </div>
                            <h1 className="di-title">
                                Document
                                <em>Archive</em>
                            </h1>
                            <p className="di-sub">
                                College of Computing Studies · Official student files, certifications, and academic reports
                            </p>
                        </div>
                        {userRole !== 'student' && (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => setIsModalOpen(true)} className="di-upload-btn">
                                    <Plus size={15} /> Upload New File
                                </button>
                                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '11px 20px', borderRadius: '11px', cursor: 'pointer',
                                    background: 'rgba(56,189,248,0.1)',
                                    border: '1px solid rgba(56,189,248,0.25)',
                                    color: '#38bdf8', fontSize: '12px', fontWeight: 700,
                                    boxShadow: 'none', whiteSpace: 'nowrap', fontFamily: 'inherit',
                                    marginTop: '4px'
                                }}>
                                    <ArrowUpCircle size={15} />
                                    Upload Folder from PC
                                    <input
                                        type="file"
                                        style={{ display: 'none' }}
                                        webkitdirectory=""
                                        mozdirectory=""
                                        multiple
                                        onChange={handleFolderFromPC}
                                    />
                                </label>
                            </div>
                        )}
                    </div>

                    <Breadcrumbs />

                    {/* ── STAT STRIP ── */}
                    {view === 'programs' && (
                        <div className="di-stats di-fade di-d1">
                            {statCards.map((s, i) => (
                                <div key={i} className="di-stat">
                                    <div className="di-stat-icon" style={{ background: `${s.color}18`, border: `1px solid ${s.color}28` }}>
                                        <s.Icon size={13} color={s.color} />
                                    </div>
                                    <div className="di-stat-val">{s.val}</div>
                                    <div className="di-stat-lbl">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── DRILL-DOWN GRID ── */}
                    <div className="di-doc-grid di-fade di-d2">
                        {view === 'programs' && (
                            <>
                                {/* ── ROW 1: Official Programs (from programs table) ── */}
                                {programs.map(prog => (
                                    <div key={prog.id} className="di-card-wrap">
                                        <div className="di-prog-card" style={{ cursor: 'pointer' }}
                                            onClick={() => { setSelectedProgram(prog); setView('sections'); }}>
                                            <span style={{
                                                position: 'absolute', top: '-13px', left: '6px',
                                                fontSize: '7px', fontWeight: 800,
                                                color: 'rgba(249,115,22,0.5)',
                                                textTransform: 'uppercase', letterSpacing: '.1em',
                                                lineHeight: '13px', zIndex: 1, pointerEvents: 'none',
                                            }}>
                                                PROGRAM
                                            </span>
                                            <div className="di-prog-code">{prog.code}</div>
                                            <div className="di-prog-name">{prog.name}</div>
                                            <div className="di-prog-stats">
                                                <div className="di-prog-stat" style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316' }}>
                                                    <BookOpen size={10} /> {prog.sections_count} SECTIONS
                                                </div>
                                                <div className="di-prog-stat" style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399' }}>
                                                    <User size={10} /> {prog.students_count} STUDENTS
                                                </div>
                                            </div>
                                            <div className="di-progress-track">
                                                <div className="di-progress-bar" style={{ width: '45%' }} />
                                            </div>
                                            <div className="di-manage-btn" style={{ marginTop: 'auto' }}>
                                                VIEW FOLDER CONTENTS <ChevronRight size={12} />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* ── DIVIDER ── */}
                                <div style={{ gridColumn: '1 / -1', margin: '20px 0 10px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <span style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(249,115,22,0.45)', textTransform: 'uppercase', letterSpacing: '.18em', whiteSpace: 'nowrap' }}>
                                        Folders
                                    </span>
                                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(249,115,22,0.25), transparent)' }} />
                                </div>

                                {/* ── ROW 2: User-Created Folders (from folders table) ── */}
                                {folders.map(folder => (
                                    <div key={folder.id} className="di-card-wrap">
                                        <div className="di-prog-card" style={{ cursor: 'pointer' }}
                                            onClick={() => openFolder(folder)}>
                                            <span style={{
                                                position: 'absolute', top: '-13px', left: '6px',
                                                fontSize: '7px', fontWeight: 800,
                                                color: 'rgba(249,115,22,0.5)',
                                                textTransform: 'uppercase', letterSpacing: '.1em',
                                                lineHeight: '13px', zIndex: 1, pointerEvents: 'none',
                                            }}>
                                                FOLDER
                                            </span>
                                            <div className="di-prog-code" style={{
                                                fontSize: '18px',
                                                fontStyle: 'italic',
                                                lineHeight: 1.2,
                                                marginBottom: '8px',
                                                wordBreak: 'break-word',
                                                whiteSpace: 'normal',
                                            }}>
                                                {folder.name}
                                            </div>
                                            {userRole === 'dean' && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }}
                                                    style={{
                                                        position: 'absolute', top: '10px', right: '10px',
                                                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                                                        color: '#ef4444', padding: '6px', borderRadius: '8px',
                                                        cursor: 'pointer', zIndex: 2
                                                    }}
                                                    title="Delete Folder"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            )}
                                            <div className="di-prog-stats">
                                                <div className="di-prog-stat" style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316' }}>
                                                    <Paperclip size={10} /> {folder.documents_count} FILES
                                                </div>
                                            </div>
                                            <div className="di-progress-track">
                                                <div className="di-progress-bar" style={{ width: `${Math.min((folder.documents_count / 10) * 100, 100)}%` }} />
                                            </div>
                                            <div className="di-manage-btn" style={{ marginTop: 'auto' }}>
                                                OPEN FOLDER <ChevronRight size={12} />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* ── CREATE FOLDER CARD ── */}
                                {userRole === 'dean' && (
                                    <div className="di-card-wrap">
                                        <div className="di-prog-card di-dashed-card" onClick={() => setIsProgramModalOpen(true)}>
                                            <div className="di-plus-box">
                                                <Plus size={24} color="#f97316" />
                                            </div>
                                            <div className="di-prog-code" style={{ fontSize: '18px', opacity: 0.6 }}>Create Folder</div>
                                            <div className="di-prog-name">Define new academic track</div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {view === 'sections' && (
                            <>
                                {Object.entries(groupedSections).map(([year, secs]) => (
                                    <React.Fragment key={year}>
                                        <div className="di-year-hdr">
                                            <div className="di-year-title">
                                                {year.toUpperCase()} <span>{secs.length} CLASS FOLDERS</span>
                                            </div>
                                            <div className="di-year-line" />
                                        </div>
                                        {secs.map(sec => (
                                            <div key={sec.id} className="di-card-wrap">
                                                <div className="di-prog-card" style={{ cursor: 'pointer' }} onClick={async () => {
                                                    setSelectedSection(sec);
                                                    setView('documents');
                                                    try {
                                                        const res = await axios.get(`/api/sections/${sec.id}/folders`);
                                                        setSectionFolders(res.data);
                                                    } catch (err) {
                                                        console.error('Failed to load section folders:', err);
                                                        setSectionFolders([]);
                                                    }
                                                }}>
                                                    <div className="di-prog-code">{sec.name}</div>
                                                    <div className="di-prog-name" style={{ marginBottom: '20px' }}>{sec.school_year} · {year} YEAR</div>

                                                    <div className="di-info-row">
                                                        <div className="di-info-icon"><User size={14} /></div>
                                                        <div className="di-info-cnt">
                                                            <div className="di-info-lbl">Adviser</div>
                                                            <div className="di-info-val">{sec.adviser?.name || 'TBA'}</div>
                                                        </div>
                                                    </div>

                                                    <div className="di-info-row" style={{ marginBottom: '16px' }}>
                                                        <div className="di-info-icon"><MoreHorizontal size={14} /></div>
                                                        <div className="di-info-cnt">
                                                            <div className="di-info-lbl">Enrollment</div>
                                                            <div className="di-info-val">{sec.students_count} students</div>
                                                        </div>
                                                    </div>

                                                    <div className="di-progress-track">
                                                        <div className="di-progress-bar" style={{ width: `${(sec.students_count / (sec.max_capacity || 40)) * 100}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </>
                        )}

                        {view === 'folderContents' && folderContents && (
                            <>
                                {/* ── TOOLBAR ── */}
                                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', marginBottom: '8px' }}>
                                    <button className="di-upload-btn" style={{ fontSize: '11px', padding: '9px 16px' }}
                                        onClick={() => setIsSubfolderModalOpen(true)}>
                                        <Plus size={13} /> New Subfolder
                                    </button>
                                    <button className="di-upload-btn" style={{ fontSize: '11px', padding: '9px 16px', background: 'rgba(249,115,22,0.12)', boxShadow: 'none', border: '1px solid rgba(249,115,22,0.25)', color: '#fb923c' }}
                                        onClick={() => setIsFolderUploadModalOpen(true)}>
                                        <ArrowUpCircle size={13} /> Upload File
                                    </button>
                                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px',
                                        padding: '9px 16px', borderRadius: '11px', cursor: 'pointer',
                                        background: 'rgba(56,189,248,0.1)',
                                        border: '1px solid rgba(56,189,248,0.25)',
                                        color: '#38bdf8', fontSize: '11px', fontWeight: 700,
                                        boxShadow: 'none', whiteSpace: 'nowrap', fontFamily: 'inherit',
                                    }}>
                                        <ArrowUpCircle size={13} />
                                        Upload Folder from PC
                                        <input
                                            type="file"
                                            style={{ display: 'none' }}
                                            webkitdirectory=""
                                            mozdirectory=""
                                            multiple
                                            onChange={handleFolderFromPC}
                                        />
                                    </label>
                                </div>

                                {/* ── SUBFOLDERS ── */}
                                {folderContents.subfolders.length > 0 && (
                                    <div style={{ gridColumn: '1 / -1', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(249,115,22,0.45)', textTransform: 'uppercase', letterSpacing: '.14em' }}>
                                            Subfolders
                                        </span>
                                    </div>
                                )}
                                {folderContents.subfolders.map(sub => (
                                    <div key={sub.id} className="di-card-wrap">
                                        <div className="di-prog-card" style={{ cursor: 'pointer' }} onClick={() => openFolder(sub)}>
                                            <span style={{ position: 'absolute', top: '-13px', left: '6px', fontSize: '7px', fontWeight: 800, color: 'rgba(249,115,22,0.5)', textTransform: 'uppercase', letterSpacing: '.1em', lineHeight: '13px', zIndex: 1 }}>
                                                FOLDER
                                            </span>
                                            <div className="di-prog-code" style={{
                                                fontSize: '18px',
                                                fontStyle: 'italic',
                                                lineHeight: 1.2,
                                                marginBottom: '8px',
                                                wordBreak: 'break-word',
                                                whiteSpace: 'normal',
                                            }}>
                                                {sub.name}
                                            </div>
                                            {userRole === 'dean' && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteFolder(sub.id); }}
                                                    style={{
                                                        position: 'absolute', top: '10px', right: '10px',
                                                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                                                        color: '#ef4444', padding: '6px', borderRadius: '8px',
                                                        cursor: 'pointer', zIndex: 2
                                                    }}
                                                    title="Delete Folder"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            )}
                                            <div className="di-prog-stats">
                                                <div className="di-prog-stat" style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316' }}>
                                                    <Paperclip size={10} /> {sub.documents?.length || 0} FILES
                                                </div>
                                            </div>
                                            <div className="di-manage-btn" style={{ marginTop: 'auto' }}>
                                                OPEN <ChevronRight size={12} />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* ── DOCUMENTS ── */}
                                {folderContents.documents.length > 0 && (
                                    <div style={{ gridColumn: '1 / -1', margin: '16px 0 8px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <span style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(249,115,22,0.45)', textTransform: 'uppercase', letterSpacing: '.14em', whiteSpace: 'nowrap' }}>
                                            Files
                                        </span>
                                        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(249,115,22,0.2), transparent)' }} />
                                    </div>
                                )}
                                {folderContents.documents.map(doc => (
                                    <DocumentCard key={doc.id} doc={doc} />
                                ))}

                                {/* ── EMPTY STATE ── */}
                                {folderContents.subfolders.length === 0 && folderContents.documents.length === 0 && (
                                    <div className="di-empty">
                                        <div className="di-empty-icon"><Paperclip size={28} color="rgba(249,115,22,0.45)" /></div>
                                        <div className="di-empty-title">This folder is empty.</div>
                                        <div className="di-empty-sub">Upload a file or create a subfolder to get started.</div>
                                    </div>
                                )}
                            </>
                        )}

                        {view === 'documents' && (
                            <>
                                {/* ── SECTION TOOLBAR ── */}
                                {userRole !== 'student' && (
                                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                        {/* Upload File */}
                                        <button
                                            className="di-upload-btn"
                                            style={{ fontSize: '11px', padding: '9px 16px' }}
                                            onClick={() => setIsSectionUploadOpen(true)}
                                        >
                                            <Plus size={13} /> Upload File
                                        </button>

                                        {/* New Section Folder */}
                                        <button
                                            className="di-upload-btn"
                                            style={{
                                                fontSize: '11px', padding: '9px 16px',
                                                background: 'rgba(249,115,22,0.12)',
                                                boxShadow: 'none',
                                                border: '1px solid rgba(249,115,22,0.25)',
                                                color: '#fb923c',
                                            }}
                                            onClick={() => setIsSectionFolderOpen(true)}
                                        >
                                            <BookOpen size={13} /> New Section Folder
                                        </button>

                                        {/* Upload Folder from PC — label wrapping hidden input */}
                                        <label style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                                            padding: '9px 16px', borderRadius: '11px', cursor: 'pointer',
                                            background: 'rgba(56,189,248,0.1)',
                                            border: '1px solid rgba(56,189,248,0.25)',
                                            color: '#38bdf8', fontSize: '11px', fontWeight: 700,
                                            whiteSpace: 'nowrap', fontFamily: 'inherit',
                                        }}>
                                            <ArrowUpCircle size={13} />
                                            Upload Folder from PC
                                            <input
                                                type="file"
                                                style={{ display: 'none' }}
                                                webkitdirectory=""
                                                mozdirectory=""
                                                multiple
                                                onChange={handleFolderFromPC}
                                            />
                                        </label>
                                    </div>
                                )}

                                {/* ── SECTION FOLDERS ── */}
                                {sectionFolders.length > 0 && (
                                    <>
                                        <div style={{ gridColumn: '1 / -1', margin: '4px 0 8px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                                            <span style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(249,115,22,0.45)', textTransform: 'uppercase', letterSpacing: '.14em', whiteSpace: 'nowrap' }}>
                                                Folders
                                            </span>
                                            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(249,115,22,0.2), transparent)' }} />
                                        </div>
                                        {sectionFolders.map(folder => (
                                            <div key={folder.id} className="di-card-wrap">
                                                <div className="di-prog-card" style={{ cursor: 'pointer', position: 'relative' }} onClick={() => openFolder(folder)}>
                                                    <span style={{
                                                        position: 'absolute', top: '-13px', left: '6px',
                                                        fontSize: '7px', fontWeight: 800,
                                                        color: 'rgba(249,115,22,0.5)',
                                                        textTransform: 'uppercase', letterSpacing: '.1em',
                                                        lineHeight: '13px', zIndex: 1, pointerEvents: 'none',
                                                    }}>
                                                        FOLDER
                                                    </span>
                                                    {userRole === 'dean' && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }}
                                                            style={{
                                                                position: 'absolute', top: '10px', right: '10px',
                                                                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                                                                color: '#ef4444', padding: '6px', borderRadius: '8px',
                                                                cursor: 'pointer', zIndex: 2
                                                            }}
                                                            title="Delete Folder"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    )}
                                                    <div className="di-prog-code" style={{
                                                        fontSize: '18px',
                                                        fontStyle: 'italic',
                                                        lineHeight: 1.2,
                                                        marginBottom: '8px',
                                                        wordBreak: 'break-word',
                                                        whiteSpace: 'normal',
                                                    }}>
                                                        {folder.name}
                                                    </div>
                                                    <div className="di-prog-stats">
                                                        <div className="di-prog-stat" style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316' }}>
                                                            <Paperclip size={10} /> {folder.documents_count} FILES
                                                        </div>
                                                    </div>
                                                    <div className="di-progress-track">
                                                        <div className="di-progress-bar" style={{ width: `${Math.min((folder.documents_count / 10) * 100, 100)}%` }} />
                                                    </div>
                                                    <div className="di-manage-btn" style={{ marginTop: 'auto' }}>
                                                        OPEN FOLDER <ChevronRight size={12} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}

                                {/* ── FILES DIVIDER ── */}
                                {filteredDocs.length > 0 && (
                                    <div style={{
                                        gridColumn: '1 / -1',
                                        margin: '8px 0 4px',
                                        display: 'flex', alignItems: 'center', gap: '14px',
                                    }}>
                                        <span style={{
                                            fontSize: '9px', fontWeight: 800,
                                            color: 'rgba(249,115,22,0.45)',
                                            textTransform: 'uppercase', letterSpacing: '.14em',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            Files
                                        </span>
                                        <div style={{
                                            flex: 1, height: '1px',
                                            background: 'linear-gradient(90deg, rgba(249,115,22,0.2), transparent)',
                                        }} />
                                    </div>
                                )}

                                {filteredDocs.map(doc => <DocumentCard key={doc.id} doc={doc} />)}

                                {/* empty state */}
                                {filteredDocs.length === 0 && (
                                    <div className="di-empty">
                                        <div className="di-empty-icon">
                                            <Paperclip size={28} color="rgba(249,115,22,0.45)" />
                                        </div>
                                        <div className="di-empty-title">This section has no files yet.</div>
                                        <div className="di-empty-sub">
                                            Upload a file or create a folder to get started.
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                </div>
            </div>

            {/* ── UPLOAD MODAL ── */}
            {isModalOpen && (
                <div className="di-overlay">
                    <div className="di-modal">
                        <div className="di-modal-hdr">
                            <div className="di-modal-hdr-icon">
                                <ArrowUpCircle size={17} color="#f97316" />
                            </div>
                            <div>
                                <div className="di-modal-title">Upload to Archive</div>
                                <div className="di-modal-sub">Upload to Folder · {userRole?.toUpperCase()}</div>
                            </div>
                            <button className="di-modal-close" onClick={() => setIsModalOpen(false)}>
                                <X size={13} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="di-modal-body">
                                <div>
                                    <label className="di-field-lbl">Select Destination</label>
                                    <select
                                        className="di-field"
                                        value={data.program_id ? `p-${data.program_id}` : (data.folder_id ? `f-${data.folder_id}` : '')}
                                        onChange={e => {
                                            const val = e.target.value;
                                            if (val.startsWith('p-')) {
                                                setData({ ...data, program_id: val.replace('p-', ''), folder_id: '' });
                                            } else if (val.startsWith('f-')) {
                                                setData({ ...data, folder_id: val.replace('f-', ''), program_id: '' });
                                            } else {
                                                setData({ ...data, program_id: '', folder_id: '' });
                                            }
                                        }}
                                        required
                                    >
                                        <option value="">Choose Folder…</option>
                                        <optgroup label="Academic Programs">
                                            {programs.map(p => (
                                                <option key={p.id} value={`p-${p.id}`}>{p.code} — {p.name}</option>
                                            ))}
                                        </optgroup>
                                        <optgroup label="Custom Folders">
                                            {folders.map(f => (
                                                <option key={f.id} value={`f-${f.id}`}>{f.code} — {f.name}</option>
                                            ))}
                                        </optgroup>
                                    </select>
                                </div>

                                <div>
                                    <label className="di-field-lbl">Document Title</label>
                                    <input
                                        type="text"
                                        className="di-field"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        placeholder="e.g. Enrollment Report 2025"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="di-field-lbl">Attachment (PDF / JPG / PNG)</label>
                                    <div className="di-file-wrap">
                                        <input
                                            type="file"
                                            onChange={e => setData('file', e.target.files[0])}
                                            required
                                        />
                                        <div className="di-file-icon">
                                            <Paperclip size={15} color="rgba(249,115,22,0.6)" />
                                        </div>
                                        <div className="di-file-lbl">
                                            {data.file ? data.file.name : "Click to browse or drag file here"}
                                        </div>
                                        <div className="di-file-sub">PDF · JPG · PNG · Max 10MB</div>
                                    </div>
                                </div>
                            </div>

                            <div className="di-modal-footer">
                                <button type="submit" disabled={processing} className="di-submit-btn">
                                    <Save size={14} />
                                    {processing ? 'Uploading…' : 'Upload & Archive'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* ── PROGRAM MODAL ── */}
            {isProgramModalOpen && (
                <div className="di-overlay">
                    <div className="di-modal">
                        <div className="di-modal-hdr">
                            <div className="di-modal-hdr-icon">
                                <Layers size={17} color="#f97316" />
                            </div>
                            <div>
                                <div className="di-modal-title">Create Archive Folder</div>
                                <div className="di-modal-sub">New Academic Folder</div>
                            </div>
                            <button className="di-modal-close" onClick={() => setIsProgramModalOpen(false)}>
                                <X size={13} />
                            </button>
                        </div>

                        <form onSubmit={handleFolderSubmit}>
                            <div className="di-modal-body">
                                <div>
                                    <label className="di-field-lbl">Folder Name</label>
                                    <input
                                        type="text"
                                        className="di-field"
                                        value={folderForm.data.name}
                                        onChange={e => folderForm.setData('name', e.target.value)}
                                        placeholder="Folder name…"
                                        required
                                    />
                                    {folderForm.errors.name && (
                                        <div style={{ color: '#ef4444', fontSize: '10px', marginTop: '4px' }}>
                                            {folderForm.errors.name}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="di-modal-footer">
                                <button type="submit" disabled={folderForm.processing} className="di-submit-btn">
                                    <Save size={14} />
                                    {folderForm.processing ? 'Creating…' : 'Create Folder'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* ── SECTION MODAL ── */}


            {/* ── SUBFOLDER MODAL ── */}
            {isSubfolderModalOpen && (
                <div className="di-overlay">
                    <div className="di-modal">
                        <div className="di-modal-hdr">
                            <div className="di-modal-hdr-icon"><BookOpen size={17} color="#f97316" /></div>
                            <div>
                                <div className="di-modal-title">New Subfolder</div>
                                <div className="di-modal-sub">Inside · {selectedFolder?.name}</div>
                            </div>
                            <button className="di-modal-close" onClick={() => setIsSubfolderModalOpen(false)}><X size={13} /></button>
                        </div>
                        <form onSubmit={handleSubfolderSubmit}>
                            <div className="di-modal-body">
                                <div>
                                    <label className="di-field-lbl">Subfolder Name</label>
                                    <input type="text" className="di-field"
                                        value={subfolderForm.data.name}
                                        onChange={e => subfolderForm.setData('name', e.target.value)}
                                        placeholder="Name this folder…" required />
                                </div>
                            </div>
                            <div className="di-modal-footer">
                                <button type="submit" className="di-submit-btn">
                                    <Save size={14} /> Create Subfolder
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── FOLDER FILE UPLOAD MODAL ── */}
            {isFolderUploadModalOpen && (
                <div className="di-overlay">
                    <div className="di-modal">
                        <div className="di-modal-hdr">
                            <div className="di-modal-hdr-icon"><ArrowUpCircle size={17} color="#f97316" /></div>
                            <div>
                                <div className="di-modal-title">Upload File</div>
                                <div className="di-modal-sub">To · {selectedFolder?.name}</div>
                            </div>
                            <button className="di-modal-close" onClick={() => setIsFolderUploadModalOpen(false)}><X size={13} /></button>
                        </div>
                        <form onSubmit={handleFolderUpload}>
                            <div className="di-modal-body">
                                <div>
                                    <label className="di-field-lbl">File Title</label>
                                    <input type="text" className="di-field"
                                        value={folderUploadForm.title}
                                        onChange={e => setFolderUploadForm(p => ({ ...p, title: e.target.value }))}
                                        placeholder="e.g. Enrollment Report 2025" required />
                                </div>
                                <div>
                                    <label className="di-field-lbl">Attachment (PDF / JPG / PNG)</label>
                                    <div className="di-file-wrap">
                                        <input type="file"
                                            onChange={e => setFolderUploadForm(p => ({ ...p, file: e.target.files[0] }))}
                                            required />
                                        <div className="di-file-icon"><Paperclip size={15} color="rgba(249,115,22,0.6)" /></div>
                                        <div className="di-file-lbl">
                                            {folderUploadForm.file ? folderUploadForm.file.name : 'Click to browse or drag file here'}
                                        </div>
                                        <div className="di-file-sub">PDF · JPG · PNG · Max 10MB</div>
                                    </div>
                                </div>
                            </div>
                            <div className="di-modal-footer">
                                <button type="submit" className="di-submit-btn">
                                    <Save size={14} /> Upload File
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {uploadProgress && (
                <div style={{
                    position: 'fixed', bottom: '24px', right: '24px', zIndex: 200,
                    background: '#160e08', border: '1px solid rgba(249,115,22,0.3)',
                    borderRadius: '14px', padding: '16px 20px', minWidth: '280px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#f97316', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '8px' }}>
                        Uploading Folder…
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(254,243,236,0.6)', marginBottom: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {uploadProgress.currentFile}
                    </div>
                    {/* Progress bar */}
                    <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                        <div style={{
                            height: '100%', borderRadius: '2px',
                            background: 'linear-gradient(90deg, #f97316, #c2410c)',
                            width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                            transition: 'width .3s ease',
                            boxShadow: '0 0 10px rgba(249,115,22,0.5)',
                        }} />
                    </div>
                    <div style={{ fontSize: '9px', color: 'rgba(254,243,236,0.3)', marginTop: '6px', textAlign: 'right' }}>
                        {uploadProgress.current} / {uploadProgress.total} files
                    </div>
                </div>
            )}
            {previewDoc && (
                <div className="di-overlay" onClick={() => setPreviewDoc(null)}>
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: '#0f0a06',
                            border: '1px solid #2a1508',
                            borderRadius: '18px',
                            overflow: 'hidden',
                            width: '100%',
                            maxWidth: '860px',
                            maxHeight: '90vh',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 32px 80px rgba(0,0,0,0.85)',
                            animation: 'di-modal-in .28s cubic-bezier(0.34,1.56,0.64,1)',
                        }}
                    >
                        {/* ── PREVIEW HEADER ── */}
                        <div style={{
                            padding: '14px 20px',
                            background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(0,0,0,0.4))',
                            borderBottom: '1px solid #2a1508',
                            display: 'flex', alignItems: 'center', gap: '12px',
                        }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '8px',
                                background: 'rgba(249,115,22,0.18)',
                                border: '1px solid rgba(249,115,22,0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <FileText size={15} color="#f97316" />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: '15px', fontWeight: 900, fontStyle: 'italic',
                                    color: '#fef3ec', overflow: 'hidden',
                                    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}>
                                    {previewDoc.title}
                                </div>
                                <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(249,115,22,0.45)', textTransform: 'uppercase', letterSpacing: '.1em', marginTop: '2px' }}>
                                    {previewDoc.type} · {previewDoc.file_path?.split('.').pop().toUpperCase()}
                                </div>
                            </div>
                            {/* Download button */}
                            <a
                                href={`/storage/${previewDoc.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={previewDoc.title}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    padding: '7px 14px', borderRadius: '8px',
                                    background: 'rgba(249,115,22,0.1)',
                                    border: '1px solid rgba(249,115,22,0.25)',
                                    color: '#fb923c', fontSize: '10px', fontWeight: 700,
                                    textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '.08em',
                                    transition: 'all .15s',
                                }}
                            >
                                <Download size={12} /> Download
                            </a>
                            {/* Close button */}
                            <button
                                onClick={() => setPreviewDoc(null)}
                                style={{
                                    width: '28px', height: '28px', borderRadius: '7px',
                                    background: 'rgba(249,115,22,0.08)',
                                    border: '1px solid rgba(249,115,22,0.18)',
                                    color: 'rgba(254,243,236,0.45)', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                <X size={13} />
                            </button>
                        </div>

                        {/* ── PREVIEW BODY ── */}
                        <div style={{ flex: 1, overflow: 'auto', background: '#0a0603', minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {(() => {
                                const fileType = getFileType(previewDoc.file_path);
                                const fileUrl  = `/storage/${previewDoc.file_path}`;

                                if (fileType === 'pdf') {
                                    return (
                                        <object
                                            data={`${fileUrl}#toolbar=1&navpanes=0`}
                                            type="application/pdf"
                                            style={{ width: '100%', height: '75vh', border: 'none', display: 'block' }}
                                        >
                                            {/* Fallback if object tag fails */}
                                            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                                                <div style={{
                                                    fontFamily: "'Playfair Display', serif",
                                                    fontSize: '16px', fontWeight: 700, fontStyle: 'italic',
                                                    color: 'rgba(254,243,236,0.3)', marginBottom: '12px',
                                                }}>
                                                    PDF cannot be displayed inline.
                                                </div>
                                                <a
                                                    href={fileUrl}
                                                    target="_blank"
                                                    style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                                        padding: '10px 20px', borderRadius: '10px',
                                                        background: 'linear-gradient(135deg, #f97316, #c2410c)',
                                                        color: '#fff', fontSize: '11px', fontWeight: 700,
                                                        textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '.1em',
                                                    }}
                                                >
                                                    <Download size={13} /> Open PDF in New Tab
                                                </a>
                                            </div>
                                        </object>
                                    );
                                }

                                if (fileType === 'image') {
                                    return (
                                        <img
                                            src={fileUrl}
                                            alt={previewDoc.title}
                                            style={{
                                                maxWidth: '100%', maxHeight: '75vh',
                                                objectFit: 'contain', display: 'block',
                                                borderRadius: '4px',
                                            }}
                                        />
                                    );
                                }

                                if (fileType === 'text') {
                                    return (
                                        <TextPreview url={fileUrl} />
                                    );
                                }

                                // Unsupported file type fallback
                                return (
                                    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                                        <div style={{
                                            width: '64px', height: '64px', borderRadius: '16px',
                                            background: 'rgba(249,115,22,0.08)',
                                            border: '1px solid rgba(249,115,22,0.15)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            margin: '0 auto 20px',
                                        }}>
                                            <FileText size={28} color="rgba(249,115,22,0.4)" />
                                        </div>
                                        <div style={{
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: '18px', fontWeight: 700, fontStyle: 'italic',
                                            color: 'rgba(254,243,236,0.3)', marginBottom: '8px',
                                        }}>
                                            Preview not available
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'rgba(254,243,236,0.18)', marginBottom: '20px' }}>
                                            This file type cannot be previewed in the browser.
                                        </div>
                                        <a
                                            href={`/storage/${previewDoc.file_path}`}
                                            target="_blank"
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                                padding: '10px 20px', borderRadius: '10px',
                                                background: 'linear-gradient(135deg, #f97316, #c2410c)',
                                                color: '#fff', fontSize: '11px', fontWeight: 700,
                                                textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '.1em',
                                            }}
                                        >
                                            <Download size={13} /> Download to View
                                        </a>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {isSectionUploadOpen && (
                <div className="di-overlay">
                    <div className="di-modal">
                        <div className="di-modal-hdr">
                            <div className="di-modal-hdr-icon">
                                <ArrowUpCircle size={17} color="#f97316" />
                            </div>
                            <div>
                                <div className="di-modal-title">Upload File</div>
                                <div className="di-modal-sub">To · {selectedSection?.name}</div>
                            </div>
                            <button className="di-modal-close" onClick={() => setIsSectionUploadOpen(false)}>
                                <X size={13} />
                            </button>
                        </div>
                        <form onSubmit={handleSectionUpload}>
                            <div className="di-modal-body">
                                <div>
                                    <label className="di-field-lbl">File Title</label>
                                    <input
                                        type="text"
                                        className="di-field"
                                        value={sectionUploadForm.title}
                                        onChange={e => setSectionUploadForm(p => ({ ...p, title: e.target.value }))}
                                        placeholder="e.g. Class Record 2025"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="di-field-lbl">Attachment (PDF / JPG / PNG)</label>
                                    <div className="di-file-wrap">
                                        <input
                                            type="file"
                                            onChange={e => setSectionUploadForm(p => ({ ...p, file: e.target.files[0] }))}
                                            required
                                        />
                                        <div className="di-file-icon">
                                            <Paperclip size={15} color="rgba(249,115,22,0.6)" />
                                        </div>
                                        <div className="di-file-lbl">
                                            {sectionUploadForm.file ? sectionUploadForm.file.name : 'Click to browse or drag file here'}
                                        </div>
                                        <div className="di-file-sub">PDF · JPG · PNG · Max 10MB</div>
                                    </div>
                                </div>
                            </div>
                            <div className="di-modal-footer">
                                <button type="submit" className="di-submit-btn">
                                    <Save size={14} /> Upload File
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isSectionFolderOpen && (
                <div className="di-overlay">
                    <div className="di-modal">
                        <div className="di-modal-hdr">
                            <div className="di-modal-hdr-icon">
                                <BookOpen size={17} color="#f97316" />
                            </div>
                            <div>
                                <div className="di-modal-title">New Section Folder</div>
                                <div className="di-modal-sub">Inside · {selectedSection?.name}</div>
                            </div>
                            <button className="di-modal-close" onClick={() => setIsSectionFolderOpen(false)}>
                                <X size={13} />
                            </button>
                        </div>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                await axios.post('/api/folders', {
                                    name:       sectionFolderCreateForm.data.name,
                                    section_id: selectedSection.id,
                                    parent_id:  null,
                                });
                                sectionFolderCreateForm.reset();
                                setIsSectionFolderOpen(false);
                                // Refresh section folders without full page reload
                                const res = await axios.get(`/api/sections/${selectedSection.id}/folders`);
                                setSectionFolders(res.data);
                            } catch (err) {
                                console.error('Folder create error:', err);
                                alert(`Failed: ${err?.response?.data?.message || err.message}`);
                            }
                        }}>
                            <div className="di-modal-body">
                                <div>
                                    <label className="di-field-lbl">Folder Name</label>
                                    <input
                                        type="text"
                                        className="di-field"
                                        value={sectionFolderCreateForm.data.name}
                                        onChange={e => sectionFolderCreateForm.setData('name', e.target.value)}
                                        placeholder="Name this folder…"
                                        required
                                    />
                                    {sectionFolderCreateForm.errors.name && (
                                        <div style={{ color: '#ef4444', fontSize: '10px', marginTop: '4px' }}>
                                            {sectionFolderCreateForm.errors.name}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="di-modal-footer">
                                <button type="submit" className="di-submit-btn">
                                    <Save size={14} /> Create Folder
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isSectionUploadOpen && (
                <div className="di-overlay">
                    <div className="di-modal">
                        <div className="di-modal-hdr">
                            <div className="di-modal-hdr-icon">
                                <ArrowUpCircle size={17} color="#f97316" />
                            </div>
                            <div>
                                <div className="di-modal-title">Upload File</div>
                                <div className="di-modal-sub">To · {selectedSection?.name}</div>
                            </div>
                            <button className="di-modal-close" onClick={() => setIsSectionUploadOpen(false)}>
                                <X size={13} />
                            </button>
                        </div>
                        <form onSubmit={handleSectionUpload}>
                            <div className="di-modal-body">
                                <div>
                                    <label className="di-field-lbl">File Title</label>
                                    <input
                                        type="text"
                                        className="di-field"
                                        value={sectionUploadForm.title}
                                        onChange={e => setSectionUploadForm(p => ({ ...p, title: e.target.value }))}
                                        placeholder="e.g. Class Record 2025"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="di-field-lbl">Attachment (PDF / JPG / PNG)</label>
                                    <div className="di-file-wrap">
                                        <input
                                            type="file"
                                            onChange={e => setSectionUploadForm(p => ({ ...p, file: e.target.files[0] }))}
                                            required
                                        />
                                        <div className="di-file-icon">
                                            <Paperclip size={15} color="rgba(249,115,22,0.6)" />
                                        </div>
                                        <div className="di-file-lbl">
                                            {sectionUploadForm.file
                                                ? sectionUploadForm.file.name
                                                : 'Click to browse or drag file here'}
                                        </div>
                                        <div className="di-file-sub">PDF · JPG · PNG · Max 10MB</div>
                                    </div>
                                </div>
                            </div>
                            <div className="di-modal-footer">
                                <button type="submit" className="di-submit-btn">
                                    <Save size={14} /> Upload File
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteModal && (
                <div className="di-overlay">
                    <div className="di-modal" style={{ maxWidth: '400px' }}>
                        <div className="di-modal-hdr">
                            <div className="di-modal-hdr-icon" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
                                <Trash2 size={17} color="#f87171" />
                            </div>
                            <div>
                                <div className="di-modal-title" style={{ fontSize: '16px' }}>Delete Document</div>
                                <div className="di-modal-sub">This action cannot be undone</div>
                            </div>
                            <button className="di-modal-close" onClick={() => setDeleteModal(null)}>
                                <X size={13} />
                            </button>
                        </div>
                        <div className="di-modal-body">
                            <div style={{
                                background: 'rgba(239,68,68,0.06)',
                                border: '1px solid rgba(239,68,68,0.15)',
                                borderRadius: '10px', padding: '14px 16px',
                            }}>
                                <div style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(254,243,236,0.4)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '6px' }}>
                                    Document to be deleted
                                </div>
                                <div style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: '14px', fontWeight: 700, fontStyle: 'italic',
                                    color: '#fef3ec',
                                }}>
                                    {deleteModal.title}
                                </div>
                            </div>
                            <p style={{ fontSize: '11px', color: 'rgba(254,243,236,0.35)', lineHeight: 1.6, marginTop: '10px' }}>
                                This will permanently remove the document and its file from the archive. This cannot be recovered.
                            </p>
                        </div>
                        <div className="di-modal-footer" style={{ display: 'flex', gap: '10px', padding: '12px 22px 18px' }}>
                            <button
                                onClick={() => setDeleteModal(null)}
                                style={{
                                    flex: 1, padding: '11px', borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    color: 'rgba(254,243,236,0.5)', fontSize: '11px', fontWeight: 700,
                                    textTransform: 'uppercase', letterSpacing: '.1em',
                                    cursor: 'pointer', fontFamily: 'inherit',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                style={{
                                    flex: 1, padding: '11px', borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                                    border: 'none', color: '#fff',
                                    fontSize: '11px', fontWeight: 700,
                                    textTransform: 'uppercase', letterSpacing: '.1em',
                                    cursor: 'pointer', fontFamily: 'inherit',
                                    boxShadow: '0 4px 16px rgba(239,68,68,0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                }}
                            >
                                <Trash2 size={13} /> Delete Permanently
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <div style={{
                    position: 'fixed', bottom: '24px', left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 300,
                    background: toast.type === 'success' ? '#0f2a1a' : '#2a0f0f',
                    border: `1px solid ${toast.type === 'success' ? 'rgba(52,211,153,0.35)' : 'rgba(239,68,68,0.35)'}`,
                    borderRadius: '12px',
                    padding: '12px 20px',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                    animation: 'di-modal-in .25s cubic-bezier(0.34,1.56,0.64,1)',
                    minWidth: '260px', maxWidth: '420px',
                }}>
                    <div style={{
                        width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                        background: toast.type === 'success' ? 'rgba(52,211,153,0.15)' : 'rgba(239,68,68,0.15)',
                        border: `1px solid ${toast.type === 'success' ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {toast.type === 'success'
                            ? <FileCheck size={14} color="#34d399" />
                            : <X size={14} color="#f87171" />
                        }
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{
                            fontSize: '10px', fontWeight: 800,
                            color: toast.type === 'success' ? '#34d399' : '#f87171',
                            textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '2px',
                        }}>
                            {toast.type === 'success' ? 'Success' : 'Error'}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(254,243,236,0.7)', fontWeight: 500 }}>
                            {toast.message}
                        </div>
                    </div>
                    <button
                        onClick={() => setToast(null)}
                        style={{
                            width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                            background: 'transparent', border: 'none',
                            color: 'rgba(254,243,236,0.3)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <X size={11} />
                    </button>
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0,
                        height: '2px', borderRadius: '0 0 12px 12px',
                        background: toast.type === 'success' ? '#34d399' : '#ef4444',
                        animation: 'toast-shrink 3s linear forwards',
                    }} />
                </div>
            )}

        </AppLayout>
    );
}