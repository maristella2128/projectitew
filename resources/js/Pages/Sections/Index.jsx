import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Plus, Layers, Users, ArrowLeft, ChevronRight,
    Search, Filter, Edit, Trash2, UserPlus, ChevronDown, CheckCircle2,
    GraduationCap, RefreshCcw, User, X, AlertTriangle, Save
} from 'lucide-react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import RosterView from './RosterView';

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────────────────────── */
const C = {
    bg: '#0a0704',
    surf: '#120c06',
    card: '#1a1008',
    card2: '#201408',
    orange: '#f97316',
    o2: '#fb923c',
    o3: '#c2410c',
    green: '#34d399',
    red: '#f87171',
    blue: '#60a5fa',
    txt: '#fef3ec',
    muted: 'rgba(254,243,236,0.38)',
    dim: 'rgba(254,243,236,0.14)',
    border: 'rgba(249,115,22,0.09)',
    border2: 'rgba(249,115,22,0.22)',
};

/* ─────────────────────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700;9..40,900&family=Instrument+Serif:ital@0;1&family=Space+Mono:wght@400;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.ps-root {
    background: ${C.bg};
    min-height: 100%;
    color: ${C.txt};
    font-family: 'DM Sans', system-ui, sans-serif;
    position: relative;
    display: flex;
    flex-direction: column;
}

/* ambient */
.ps-orb {
    position: fixed; border-radius: 50%;
    pointer-events: none; z-index: 0;
}
.ps-orb1 { top: -12%; right: -6%; width: 480px; height: 480px; background: radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 65%); }
.ps-orb2 { bottom: -8%; left: 15%; width: 360px; height: 360px; background: radial-gradient(circle, rgba(52,211,153,0.04) 0%, transparent 65%); }
.ps-grid-tex {
    position: fixed; inset: 0;
    background-image: linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px);
    background-size: 52px 52px;
    pointer-events: none; z-index: 0;
}

/* topbar */
.ps-topbar {
    position: sticky; top: 0; z-index: 50;
    background: rgba(10,7,4,0.82); backdrop-filter: blur(14px);
    border-bottom: 1px solid ${C.border};
    padding: 14px 32px;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    flex-shrink: 0;
}
.ps-breadcrumb { display: flex; align-items: center; gap: 8px; }
.ps-bc-btn {
    font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .14em;
    color: ${C.muted}; cursor: pointer; background: none; border: none;
    font-family: inherit; transition: color .15s; padding: 0;
}
.ps-bc-btn:hover { color: ${C.o2}; }
.ps-bc-btn.active { color: ${C.orange}; cursor: default; }
.ps-bc-sep { color: ${C.dim}; }
.ps-topbar-right { display: flex; align-items: center; gap: 10px; }
.ps-refresh-btn {
    width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.04); border: 1px solid ${C.border};
    border-radius: 10px; color: ${C.muted}; cursor: pointer; transition: all .18s;
}
.ps-refresh-btn:hover { background: rgba(255,255,255,0.08); color: ${C.txt}; border-color: rgba(255,255,255,0.12); }
.ps-cta {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px; border-radius: 11px;
    background: linear-gradient(135deg, ${C.orange}, ${C.o3});
    color: #fff; font-size: 11px; font-weight: 800;
    text-transform: uppercase; letter-spacing: .08em;
    border: none; cursor: pointer; font-family: inherit;
    box-shadow: 0 4px 16px rgba(249,115,22,0.3);
    transition: all .2s; white-space: nowrap;
}
.ps-cta:hover { transform: translateY(-1px); box-shadow: 0 7px 22px rgba(249,115,22,0.42); }

/* page body */
.ps-body { flex: 1; position: relative; z-index: 1; padding: 32px 32px 80px; max-width: 1600px; margin: 0 auto; width: 100%; }

/* section title */
.ps-display {
    font-family: 'Instrument Serif', serif;
    font-style: italic; line-height: 1.05; letter-spacing: -.01em;
}

/* stat strip */
.ps-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 28px; }
@media (max-width: 900px) { .ps-stats { grid-template-columns: repeat(2, 1fr); } }
.ps-stat {
    background: ${C.card};
    border: 1px solid ${C.border};
    border-radius: 16px; padding: 16px 18px;
    position: relative; overflow: hidden;
    transition: border-color .2s, transform .18s; cursor: default;
}
.ps-stat:hover { border-color: ${C.border2}; transform: translateY(-1px); }
.ps-stat::after {
    content: ''; position: absolute; top: -22px; right: -22px;
    width: 70px; height: 70px; border-radius: 50%;
    background: rgba(249,115,22,0.06); transition: transform .35s;
}
.ps-stat:hover::after { transform: scale(1.9); }
.ps-stat-icon {
    width: 26px; height: 26px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 10px; position: relative; z-index: 1;
}
.ps-stat-val {
    font-family: 'Space Mono', monospace;
    font-size: 24px; font-weight: 700; color: ${C.txt};
    line-height: 1; position: relative; z-index: 1;
}
.ps-stat-lbl {
    font-size: 9px; font-weight: 800; color: ${C.muted};
    margin-top: 4px; text-transform: uppercase; letter-spacing: .1em;
    position: relative; z-index: 1;
}

/* toolbar */
.ps-toolbar { display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; }
.ps-search {
    flex: 1; min-width: 200px;
    background: ${C.surf}; border: 1px solid ${C.border};
    border-radius: 12px; padding: 10px 14px;
    display: flex; align-items: center; gap: 10px;
    transition: border-color .2s;
}
.ps-search:focus-within { border-color: ${C.border2}; box-shadow: 0 0 0 3px rgba(249,115,22,0.08); }
.ps-search input {
    background: none; border: none; outline: none;
    color: ${C.txt}; font-family: inherit; font-size: 13px; font-weight: 500; width: 100%;
}
.ps-search input::placeholder { color: ${C.muted}; }
.ps-filter-wrap {
    background: ${C.surf}; border: 1px solid ${C.border};
    border-radius: 12px; padding: 10px 14px;
    display: flex; align-items: center; gap: 10px;
    min-width: 180px;
}
.ps-filter-wrap select {
    background: none; border: none; outline: none;
    color: ${C.txt}; font-family: inherit; font-size: 11px;
    font-weight: 800; text-transform: uppercase; letter-spacing: .08em;
    cursor: pointer; width: 100%; appearance: none;
}
.ps-filter-wrap select option { background: ${C.card}; }

/* programs grid */
.ps-prog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 14px;
}

/* program card */
.ps-prog-card {
    background: ${C.card};
    border: 1px solid ${C.border};
    border-radius: 20px; overflow: hidden;
    transition: all .25s cubic-bezier(.4,0,.2,1);
    position: relative; cursor: pointer;
    display: flex; flex-direction: column;
}
.ps-prog-card:hover {
    border-color: rgba(249,115,22,0.35);
    transform: translateY(-4px);
    box-shadow: 0 14px 34px rgba(0,0,0,0.5), 0 0 0 1px rgba(249,115,22,0.08);
}
.ps-prog-card::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, ${C.orange}, ${C.o3}, transparent);
}
.ps-prog-body { padding: 22px; flex: 1; display: flex; flex-direction: column; }
.ps-prog-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; }
.ps-prog-code { font-family: 'Instrument Serif', serif; font-size: 40px; font-style: italic; color: ${C.txt}; line-height: 1; transition: color .18s; }
.ps-prog-card:hover .ps-prog-code { color: ${C.o2}; }
.ps-prog-actions { display: flex; gap: 4px; opacity: 0; transition: opacity .18s; }
.ps-prog-card:hover .ps-prog-actions { opacity: 1; }
.ps-act-btn {
    width: 28px; height: 28px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.05); border: 1px solid transparent;
    color: ${C.muted}; cursor: pointer; transition: all .15s;
}
.ps-act-btn:hover { background: rgba(249,115,22,0.12); border-color: rgba(249,115,22,0.22); color: ${C.o2}; }
.ps-act-btn.danger:hover { background: rgba(248,113,113,0.12); border-color: rgba(248,113,113,0.22); color: ${C.red}; }
.ps-prog-name { font-size: 11px; color: ${C.muted}; line-height: 1.5; flex: 1; margin-bottom: 14px; }
.ps-chips { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
.ps-chip {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 9px; border-radius: 20px;
    font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .07em;
}
.chip-o { background: rgba(249,115,22,0.1); color: ${C.o2}; border: 1px solid rgba(249,115,22,0.18); }
.chip-g { background: rgba(52,211,153,0.08); color: ${C.green}; border: 1px solid rgba(52,211,153,0.16); }
.chip-b { background: rgba(96,165,250,0.08); color: ${C.blue}; border: 1px solid rgba(96,165,250,0.16); }
.ps-fill { height: 3px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden; margin-bottom: 16px; }
.ps-fill-bar { height: 100%; background: linear-gradient(90deg, rgba(249,115,22,0.4), ${C.orange}); transition: width .5s ease; }
.ps-manage-btn {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 7px;
    padding: 11px; border-radius: 12px;
    background: rgba(249,115,22,0.07); border: 1px solid rgba(249,115,22,0.14);
    color: ${C.muted}; font-size: 10px; font-weight: 800;
    text-transform: uppercase; letter-spacing: .09em;
    cursor: pointer; transition: all .2s; font-family: inherit;
}
.ps-manage-btn:hover {
    background: linear-gradient(135deg, ${C.orange}, ${C.o3});
    border-color: transparent; color: #fff;
    box-shadow: 0 4px 14px rgba(249,115,22,0.3);
}
.ps-manage-btn .arr { transition: transform .18s; }
.ps-manage-btn:hover .arr { transform: translateX(3px); }

/* add card */
.ps-add-card {
    background: transparent;
    border: 2px dashed rgba(249,115,22,0.14);
    border-radius: 20px; min-height: 220px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    cursor: pointer; transition: all .22s; gap: 12px; padding: 28px;
}
.ps-add-card:hover { border-color: rgba(249,115,22,0.34); background: rgba(249,115,22,0.03); }
.ps-add-circle {
    width: 50px; height: 50px; border-radius: 50%;
    background: rgba(249,115,22,0.08);
    display: flex; align-items: center; justify-content: center;
    transition: all .25s;
}
.ps-add-card:hover .ps-add-circle { background: rgba(249,115,22,0.18); transform: scale(1.08); }
.ps-add-lbl { font-family: 'Instrument Serif', serif; font-size: 16px; font-style: italic; color: rgba(254,243,236,0.3); transition: color .18s; }
.ps-add-card:hover .ps-add-lbl { color: ${C.o2}; }
.ps-add-sub { font-size: 9px; text-transform: uppercase; letter-spacing: .1em; color: ${C.dim}; }

/* sections view */
.ps-back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .1em;
    color: rgba(249,115,22,0.5); cursor: pointer; background: none; border: none;
    font-family: inherit; transition: color .15s; padding: 0; margin-bottom: 20px;
}
.ps-back-btn:hover { color: ${C.orange}; }

.ps-year-group { margin-bottom: 36px; }
.ps-year-lbl {
    font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700;
    color: ${C.o2}; text-transform: uppercase; letter-spacing: .12em;
    display: flex; align-items: center; gap: 12px; margin-bottom: 14px;
}
.ps-year-lbl::after { content: ''; flex: 1; height: 1px; background: rgba(249,115,22,0.1); }
.ps-year-count {
    font-size: 9px; font-weight: 800; color: ${C.muted};
    background: rgba(249,115,22,0.07); padding: 2px 8px;
    border-radius: 10px; letter-spacing: .07em; text-transform: uppercase;
}

/* section cards grid */
.ps-sec-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 12px;
}

/* section card */
.ps-sec-card {
    background: ${C.card};
    border: 1px solid ${C.border};
    border-radius: 18px; overflow: hidden;
    transition: all .22s; position: relative;
    display: flex; flex-direction: column;
}
.ps-sec-card:hover {
    border-color: rgba(249,115,22,0.3);
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(0,0,0,0.4);
}
.ps-sec-bar { height: 3px; background: linear-gradient(90deg, ${C.orange}, ${C.o3}, transparent); flex-shrink: 0; }
.ps-sec-body { padding: 16px 18px; flex: 1; display: flex; flex-direction: column; }
.ps-sec-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 2px; }
.ps-sec-name { font-family: 'Instrument Serif', serif; font-size: 24px; font-style: italic; color: ${C.txt}; transition: color .18s; }
.ps-sec-card:hover .ps-sec-name { color: ${C.o2}; }
.ps-sec-actions { display: flex; gap: 3px; opacity: 0; transition: opacity .18s; }
.ps-sec-card:hover .ps-sec-actions { opacity: 1; }
.ps-sec-sy { font-family: 'Space Mono', monospace; font-size: 8px; font-weight: 700; color: ${C.dim}; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 12px; }
.ps-sec-divider { height: 1px; background: rgba(249,115,22,0.07); margin: 12px 0; }
.ps-sec-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.ps-sec-row:last-of-type { margin-bottom: 0; }
.ps-sec-ico {
    width: 30px; height: 30px; border-radius: 8px;
    background: rgba(249,115,22,0.07); border: 1px solid rgba(249,115,22,0.12);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.ps-sec-flbl { font-size: 8px; font-weight: 800; text-transform: uppercase; letter-spacing: .1em; color: ${C.dim}; line-height: 1; margin-bottom: 3px; }
.ps-sec-fval { font-size: 12px; font-weight: 600; color: ${C.txt}; }
.ps-count-row { display: flex; align-items: center; gap: 8px; }
.ps-count-track { flex: 1; height: 3px; background: rgba(249,115,22,0.08); border-radius: 2px; overflow: hidden; }
.ps-count-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, rgba(249,115,22,0.4), ${C.orange}); transition: width .5s ease; }
.ps-sec-footer { display: flex; gap: 6px; margin-top: 12px; }
.ps-roster-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px;
    padding: 9px; border-radius: 9px;
    background: rgba(249,115,22,0.07); border: 1px solid rgba(249,115,22,0.12);
    color: ${C.muted}; font-size: 10px; font-weight: 800;
    text-transform: uppercase; letter-spacing: .08em;
    cursor: pointer; transition: all .18s; font-family: inherit;
}
.ps-roster-btn:hover {
    background: linear-gradient(135deg, ${C.orange}, ${C.o3});
    border-color: transparent; color: #fff;
    box-shadow: 0 4px 12px rgba(249,115,22,0.28);
}
.ps-add-stu-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 9px 12px; border-radius: 9px;
    background: rgba(52,211,153,0.07); border: 1px solid rgba(52,211,153,0.15);
    color: rgba(52,211,153,0.55); font-size: 10px; font-weight: 800;
    text-transform: uppercase; letter-spacing: .08em;
    cursor: pointer; transition: all .18s; font-family: inherit; white-space: nowrap;
}
.ps-add-stu-btn:hover { background: rgba(52,211,153,0.14); border-color: rgba(52,211,153,0.3); color: ${C.green}; }

/* empty */
.ps-empty {
    grid-column: 1 / -1; padding: 80px 24px; text-align: center;
    border: 1px dashed rgba(249,115,22,0.12); border-radius: 20px;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.ps-empty-ico {
    width: 60px; height: 60px; border-radius: 16px;
    background: rgba(249,115,22,0.07); border: 1px solid rgba(249,115,22,0.14);
    display: flex; align-items: center; justify-content: center;
}
.ps-empty-title { font-family: 'Instrument Serif', serif; font-size: 18px; font-style: italic; color: rgba(254,243,236,0.25); }
.ps-empty-sub { font-size: 11px; color: ${C.dim}; }

/* modal */
.ps-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.72); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center; padding: 20px;
}
.ps-modal {
    background: ${C.card2}; border: 1px solid ${C.border2};
    border-radius: 24px; width: 100%; max-width: 480px; overflow: hidden;
    animation: modalIn .28s cubic-bezier(.16,1,.3,1);
}
@keyframes modalIn { from { opacity:0; transform:translateY(20px) scale(.97); } to { opacity:1; transform:none; } }
.ps-modal-hdr {
    padding: 24px 26px 18px; border-bottom: 1px solid ${C.border};
    display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
}
.ps-modal-title { font-family: 'Instrument Serif', serif; font-size: 22px; font-style: italic; color: ${C.txt}; }
.ps-modal-title span { color: ${C.orange}; }
.ps-modal-sub { font-size: 11px; color: ${C.muted}; margin-top: 3px; }
.ps-filter-wrap select { background: none; border: none; outline: none; color: ${C.txt}; font-family: inherit; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; cursor: pointer; appearance: none; }
.ps-filter-wrap select option { background: ${C.card2}; color: #fef3ec; }
.ps-modal-close {
    width: 28px; height: 28px; border-radius: 7px;
    background: rgba(255,255,255,0.04); border: 1px solid ${C.border};
    color: ${C.muted}; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all .15s; flex-shrink: 0;
}
.ps-modal-close:hover { color: ${C.txt}; background: rgba(255,255,255,0.09); }
.ps-modal-body { padding: 20px 26px; }
.ps-modal-foot { padding: 16px 26px 22px; border-top: 1px solid ${C.border}; display: flex; gap: 8px; justify-content: flex-end; }
.ps-field { margin-bottom: 16px; }
.ps-field-lbl { display: block; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .09em; color: ${C.muted}; margin-bottom: 7px; }
.ps-field-inp {
    width: 100%; background: rgba(255,255,255,0.04); border: 1px solid ${C.border};
    border-radius: 10px; padding: 11px 13px; font-size: 13px; font-weight: 500;
    color: ${C.txt}; font-family: inherit; outline: none; transition: border-color .18s;
}
.ps-field-inp:focus { border-color: rgba(249,115,22,0.4); }
.ps-field-inp::placeholder { color: ${C.dim}; }
.ps-field-inp option { background: ${C.card2}; color: #fef3ec; }
.ps-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.ps-btn-ghost {
    padding: 9px 18px; border-radius: 10px;
    background: rgba(255,255,255,0.04); border: 1px solid ${C.border};
    color: ${C.muted}; font-size: 11px; font-weight: 800;
    text-transform: uppercase; letter-spacing: .08em;
    cursor: pointer; transition: all .18s; font-family: inherit;
}
.ps-btn-ghost:hover { background: rgba(255,255,255,0.08); color: ${C.txt}; }
.ps-btn-submit {
    padding: 9px 18px; border-radius: 10px;
    background: linear-gradient(135deg, ${C.orange}, ${C.o3});
    color: #fff; font-size: 11px; font-weight: 800;
    text-transform: uppercase; letter-spacing: .08em;
    border: none; cursor: pointer; font-family: inherit;
    box-shadow: 0 4px 14px rgba(249,115,22,0.28); transition: all .18s;
    display: flex; align-items: center; gap: 6px;
}
.ps-btn-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(249,115,22,0.38); }
.ps-btn-danger {
    padding: 9px 18px; border-radius: 10px;
    background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.2);
    color: ${C.red}; font-size: 11px; font-weight: 800;
    text-transform: uppercase; letter-spacing: .08em;
    cursor: pointer; font-family: inherit; transition: all .18s;
    display: flex; align-items: center; gap: 6px;
}
.ps-btn-danger:hover { background: rgba(248,113,113,0.2); }

/* delete modal */
.ps-del-modal {
    background: ${C.card2}; border: 1px solid rgba(248,113,113,0.2);
    border-radius: 24px; width: 100%; max-width: 400px; overflow: hidden;
    animation: modalIn .28s cubic-bezier(.16,1,.3,1);
}
.ps-del-ico {
    width: 52px; height: 52px; border-radius: 14px;
    background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.2);
    display: flex; align-items: center; justify-content: center; margin: 0 auto 14px;
}

/* toast */
.ps-toast {
    position: fixed; bottom: 28px; right: 28px; z-index: 300;
    padding: 14px 20px; border-radius: 14px;
    background: linear-gradient(135deg, rgba(249,115,22,0.92), rgba(194,65,12,0.92));
    backdrop-filter: blur(12px); border: 1px solid rgba(249,115,22,0.3);
    color: #fff; display: flex; align-items: center; gap: 12px;
    box-shadow: 0 8px 28px rgba(0,0,0,0.4);
    animation: toastUp .38s cubic-bezier(.16,1,.3,1);
}
@keyframes toastUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
.ps-toast-tag { font-size: 8px; font-weight: 800; text-transform: uppercase; letter-spacing: .1em; color: rgba(255,255,255,0.5); margin-bottom: 1px; }
.ps-toast-msg { font-size: 13px; font-weight: 700; }
.ps-toast-x { background: none; border: none; color: rgba(255,255,255,0.45); cursor: pointer; font-size: 18px; margin-left: 8px; line-height: 1; transition: color .15s; }
.ps-toast-x:hover { color: #fff; }

/* page header */
.ps-page-hdr { margin-bottom: 24px; }
.ps-page-title { font-family: 'Instrument Serif', serif; font-size: 34px; font-style: italic; color: ${C.txt}; line-height: 1.05; }
.ps-page-title span { color: ${C.orange}; }
.ps-page-sub { font-size: 12px; color: ${C.muted}; margin-top: 5px; }

/* animations */
@keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
.ps-fu { animation: fadeUp .36s ease both; }
.ps-d1 { animation-delay: .05s; }
.ps-d2 { animation-delay: .1s; }
.ps-d3 { animation-delay: .15s; }

/* stat strip for sections (3 cols) */
.ps-stats-3 { grid-template-columns: repeat(3, 1fr); }
@media (max-width: 700px) { .ps-stats-3 { grid-template-columns: 1fr 1fr; } }

.ps-btn-submit:hover { transform: translateY(-1px); box-shadow: 0 7px 22px rgba(249,115,22,0.42); }

.ps-action-card {
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
    padding: 10px 16px; border-radius: 12px; background: rgba(249,115,22,0.04);
    border: 1px solid rgba(249,115,22,0.15); cursor: pointer; transition: all .2s;
    color: ${C.orange}; font-family: inherit; width: 110px; flex-shrink: 0;
}
.ps-action-card:hover { background: rgba(249,115,22,0.08); border-color: ${C.orange}; transform: translateY(-2px); }
.ps-action-card span { font-size: 8px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; line-height: 1.2; text-align: center; }

/* scrollbar */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(249,115,22,0.18); border-radius: 3px; }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS & HELPERS
───────────────────────────────────────────────────────────────────────────── */
const YEAR_LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const SEMESTERS = ['1st Semester', '2nd Semester', 'Summer'];

const Svg = ({ d, size = 14, color = 'currentColor', stroke = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke}>
        <path d={d} />
    </svg>
);

/* ─────────────────────────────────────────────────────────────────────────────
   TOAST
───────────────────────────────────────────────────────────────────────────── */
const Toast = ({ message, onClose }) => {
    useEffect(() => {
        const t = setTimeout(onClose, 4000);
        return () => clearTimeout(t);
    }, [onClose]);
    return (
        <div className="ps-toast">
            <div>
                <div className="ps-toast-tag">Success</div>
                <div className="ps-toast-msg">{message}</div>
            </div>
            <button className="ps-toast-x" onClick={onClose}>✕</button>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────────────────────────
   CREATE PROGRAM MODAL
───────────────────────────────────────────────────────────────────────────── */
const CreateProgramModal = ({ onClose, onSave, curricula }) => {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [dept, setDept] = useState('CCS');
    const [activeCurriculumId, setActiveCurriculumId] = useState('');

    const submit = (e) => {
        e.preventDefault();
        if (!code.trim() || !name.trim()) return;
        onSave({ code: code.trim().toUpperCase(), name: name.trim(), dept, active_curriculum_id: activeCurriculumId || null, section_count: 0, student_count: 0 });
    };

    return (
        <div className="ps-overlay" onClick={onClose}>
            <div className="ps-modal" onClick={e => e.stopPropagation()}>
                <div className="ps-modal-hdr">
                    <div>
                        <div className="ps-modal-title">Establish <span>Program</span></div>
                        <div className="ps-modal-sub">Add a new academic program to CCS</div>
                    </div>
                    <button className="ps-modal-close" onClick={onClose}><X size={14} /></button>
                </div>
                <form onSubmit={submit}>
                    <div className="ps-modal-body">
                        <div className="ps-field">
                            <label className="ps-field-lbl">Program Code</label>
                            <input className="ps-field-inp" placeholder="e.g. BSIT, BSCS" value={code} onChange={e => setCode(e.target.value)} required />
                        </div>
                        <div className="ps-field">
                            <label className="ps-field-lbl">Full Program Name</label>
                            <input className="ps-field-inp" placeholder="Bachelor of Science in…" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="ps-field">
                            <label className="ps-field-lbl">Department</label>
                            <select className="ps-field-inp" value={dept} onChange={e => setDept(e.target.value)}>
                                <option value="CCS">College of Computing Studies</option>
                                <option value="CAS">College of Arts &amp; Sciences</option>
                                <option value="COE">College of Engineering</option>
                            </select>
                        </div>
                        <div className="ps-field">
                            <label className="ps-field-lbl">PRIMARY CURRICULUM</label>
                            <select 
                                className="ps-field-inp"
                                value={activeCurriculumId}
                                onChange={e => setActiveCurriculumId(e.target.value)}
                                style={{ background: '#1a1410', color: '#fff' }}
                            >
                                <option value="" style={{ background: '#1a1410' }}>— Select Curriculum —</option>
                                {curricula?.map(c => (
                                    <option key={c.id} value={c.id} style={{ background: '#1a1410' }}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="ps-modal-foot" style={{ alignItems: 'flex-end' }}>
                        <button 
                            type="button" 
                            className="ps-action-card"
                            style={{ marginRight: 'auto' }}
                            onClick={() => router.visit(route('curricula.index'))}
                        >
                            <Layers size={16} />
                            <span>Manage<br/>Curricula</span>
                        </button>
                        <button type="button" className="ps-btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="ps-btn-submit">
                            <Plus size={13} /> Establish Program
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────────────────────────
   EDIT PROGRAM MODAL
 ───────────────────────────────────────────────────────────────────────────── */
const EditProgramModal = ({ program, curricula, onClose, onSave }) => {
    const [name, setName] = useState(program.name);
    const [dept, setDept] = useState(program.dept);
    const [activeCurriculumId, setActiveCurriculumId] = useState(program.active_curriculum_id || '');

    const submit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSave(program.code, { name: name.trim(), dept, active_curriculum_id: activeCurriculumId || null });
    };

    return (
        <div className="ps-overlay" onClick={onClose}>
            <div className="ps-modal" onClick={e => e.stopPropagation()}>
                <div className="ps-modal-hdr">
                    <div>
                        <div className="ps-modal-title">Edit <span>Program</span></div>
                        <div className="ps-modal-sub">Updating {program.code} program details</div>
                    </div>
                    <button className="ps-modal-close" onClick={onClose}><X size={14} /></button>
                </div>
                <form onSubmit={submit}>
                    <div className="ps-modal-body">
                        <div className="ps-field">
                            <label className="ps-field-lbl">Program Code (Read-only)</label>
                            <input className="ps-field-inp" value={program.code} disabled style={{ opacity: 0.6 }} />
                        </div>
                        <div className="ps-field">
                            <label className="ps-field-lbl">Full Program Name</label>
                            <input className="ps-field-inp" placeholder="Bachelor of Science in…" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="ps-field">
                            <label className="ps-field-lbl">Department</label>
                            <select className="ps-field-inp" value={dept} onChange={e => setDept(e.target.value)}>
                                <option value="CCS">College of Computing Studies</option>
                                <option value="CAS">College of Arts &amp; Sciences</option>
                                <option value="COE" style={{ background: '#1a1410' }}>College of Engineering</option>
                            </select>
                        </div>

                        <div className="ps-field">
                            <label className="ps-field-lbl">PRIMARY CURRICULUM</label>
                            <select 
                                className="ps-field-inp"
                                value={activeCurriculumId}
                                onChange={e => setActiveCurriculumId(e.target.value)}
                                style={{ background: '#1a1410', color: '#fff' }}
                            >
                                <option value="" style={{ background: '#1a1410' }}>— Select Curriculum —</option>
                                {curricula?.map(c => (
                                    <option key={c.id} value={c.id} style={{ background: '#1a1410' }}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="ps-modal-foot" style={{ alignItems: 'flex-end' }}>
                        <button 
                            type="button" 
                            className="ps-action-card"
                            style={{ marginRight: 'auto' }}
                            onClick={() => router.visit(route('curricula.index', { program: program.id }))}
                        >
                            <Layers size={16} />
                            <span>Manage<br/>Curricula</span>
                        </button>
                        <button type="button" className="ps-btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="ps-btn-submit">
                            <Save size={13} /> Update Program
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────────────────────────
   CUSTOM ADVISER SELECT
───────────────────────────────────────────────────────────────────────────── */
const CustomAdviserSelect = ({ value, onChange, teachers }) => {
    const [open, setOpen] = useState(false);
    const selRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (selRef.current && !selRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const selectedTeacher = teachers.find(t => String(t.id) === String(value));

    return (
        <div className="ps-adv-sel" ref={selRef} style={{ position: 'relative' }}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: C.bg, border: `1px solid ${open ? C.orange : C.border2}`, color: selectedTeacher ? '#fff' : C.dim,
                    padding: '11px 16px', borderRadius: 12, fontSize: 13, fontFamily: 'DM Sans, sans-serif',
                    transition: 'all .2s', cursor: 'pointer', textAlign: 'left'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {selectedTeacher ? (
                        <>
                            <div style={{ width: 20, height: 20, borderRadius: 6, background: C.card2, color: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800 }}>
                                {((selectedTeacher.name || selectedTeacher.first_name || '?')[0]).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 500 }}>{selectedTeacher.name || `${selectedTeacher.first_name} ${selectedTeacher.last_name}`}</span>
                        </>
                    ) : (
                        <span>— No Adviser Assigned —</span>
                    )}
                </div>
                <ChevronDown size={14} style={{ color: C.muted, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
            </button>

            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 100,
                    background: C.card, border: `1px solid ${C.border3}`, borderRadius: 12,
                    boxShadow: '0 12px 40px rgba(0,0,0,0.5)', overflow: 'hidden', maxHeight: 220,
                    display: 'flex', flexDirection: 'column'
                }}>
                    <div style={{ padding: 6, overflowY: 'auto' }} className="rv-scroll">
                        <button
                            type="button"
                            onClick={() => { onChange(''); setOpen(false); }}
                            style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                                background: !value ? C.card2 : 'transparent', border: 'none', borderRadius: 8,
                                color: !value ? '#fff' : C.dim, cursor: 'pointer', textAlign: 'left', transition: 'all .15s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = C.card2}
                            onMouseLeave={e => e.currentTarget.style.background = !value ? C.card2 : 'transparent'}
                        >
                            <span style={{ fontSize: 12, fontWeight: 500, fontStyle: 'italic' }}>— No Adviser —</span>
                            {!value && <CheckCircle2 size={13} color={C.green} style={{ marginLeft: 'auto' }} />}
                        </button>
                        {teachers.map(t => {
                            const isSel = String(t.id) === String(value);
                            return (
                                <button
                                    key={t.id} type="button"
                                    onClick={() => { onChange(t.id); setOpen(false); }}
                                    style={{
                                        width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                                        background: isSel ? 'rgba(249,115,22,0.08)' : 'transparent', border: 'none', borderRadius: 8,
                                        color: isSel ? '#fff' : C.muted, cursor: 'pointer', textAlign: 'left', transition: 'all .15s',
                                        marginTop: 2
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = isSel ? 'rgba(249,115,22,0.08)' : 'rgba(255,255,255,0.03)'}
                                    onMouseLeave={e => e.currentTarget.style.background = isSel ? 'rgba(249,115,22,0.08)' : 'transparent'}
                                >
                                    <div style={{ width: 24, height: 24, borderRadius: 6, background: isSel ? C.orange : C.card2, color: isSel ? '#fff' : C.dim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>
                                        {((t.name || t.first_name || '?')[0]).toUpperCase()}
                                    </div>
                                    <span style={{ fontSize: 13, fontWeight: 500 }}>{t.name || `${t.first_name} ${t.last_name}`}</span>
                                    {isSel && <CheckCircle2 size={13} color={C.orange} style={{ marginLeft: 'auto' }} />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─────────────────────────────────────────────────────────────────────────────
   CREATE SECTION MODAL
───────────────────────────────────────────────────────────────────────────── */
const CreateSectionModal = ({ course, teachers, curricula, programs, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [year, setYear] = useState('1st Year');
    const [sy, setSy] = useState('2024-2025');
    const [semester, setSemester] = useState('1st Semester');
    const [adviserId, setAdviserId] = useState('');
    // Filter curricula for this program
    const program = programs.find(p => p.code === course);

    const submit = (e) => {
        e.preventDefault();
        if (!name.trim() || !sy.trim()) return;
        // Prefix name with course code (e.g. BSIT-Alpha) and send basic fields
        onSave({ 
            name: `${course}-${name.trim()}`, 
            grade_level: year, 
            school_year: sy.trim(),
            semester: semester,
            adviser_id: adviserId
        });
    };

    return (
        <div className="ps-overlay" onClick={onClose}>
            <div className="ps-modal" onClick={e => e.stopPropagation()}>
                <div className="ps-modal-hdr">
                    <div>
                        <div className="ps-modal-title">New <span>Section</span></div>
                        <div className="ps-modal-sub">Adding to {course} program</div>
                    </div>
                    <button className="ps-modal-close" onClick={onClose}><X size={14} /></button>
                </div>
                <form onSubmit={submit}>
                    <div className="ps-modal-body">
                        <div className="ps-field">
                            <label className="ps-field-lbl">Section Name</label>
                            <input className="ps-field-inp" placeholder="e.g. Alpha, Beta, A1" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="ps-two-col">
                            <div className="ps-field">
                                <label className="ps-field-lbl">Year Level</label>
                                <select className="ps-field-inp" value={year} onChange={e => setYear(e.target.value)}>
                                    {YEAR_LEVELS.map(y => <option key={y}>{y}</option>)}
                                </select>
                            </div>
                            <div className="ps-field">
                                <label className="ps-field-lbl">School Year</label>
                                <input className="ps-field-inp" placeholder="2024-2025" value={sy} onChange={e => setSy(e.target.value)} required />
                            </div>
                        </div>
                        <div className="ps-two-col">
                            <div className="ps-field">
                                <label className="ps-field-lbl">Semester</label>
                                <select className="ps-field-inp" value={semester} onChange={e => setSemester(e.target.value)}>
                                    {SEMESTERS.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="ps-field">
                                <label className="ps-field-lbl">Section Adviser</label>
                                <CustomAdviserSelect value={adviserId} onChange={setAdviserId} teachers={teachers} />
                            </div>
                        </div>
                    </div>
                    <div className="ps-modal-foot">
                        <button type="button" className="ps-btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="ps-btn-submit">
                            <Plus size={13} /> Create Section
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────────────────────────
   EDIT SECTION MODAL
───────────────────────────────────────────────────────────────────────────── */
const EditSectionModal = ({ section, teachers, curricula, programs, onClose, onSave }) => {
    const [name, setName] = useState(section.name.split('-').slice(1).join('-') || section.name);
    const [year, setYear] = useState(section.grade_level);
    const [sy, setSy] = useState(section.school_year);
    const [semester, setSemester] = useState(section.semester || '1st Semester');
    const [adviserId, setAdviserId] = useState(section.adviser_id || '');

    const course = section.name.split('-')[0];
    const program = programs.find(p => p.code === course);

    const submit = (e) => {
        e.preventDefault();
        if (!name.trim() || !sy.trim()) return;
        const course = section.name.split('-')[0];
        onSave(section.id, { 
            name: `${course}-${name.trim()}`, 
            grade_level: year, 
            school_year: sy.trim(),
            semester: semester,
            adviser_id: adviserId
        });
    };

    return (
        <div className="ps-overlay" onClick={onClose}>
            <div className="ps-modal" onClick={e => e.stopPropagation()}>
                <div className="ps-modal-hdr">
                    <div>
                        <div className="ps-modal-title">Edit <span>Section</span></div>
                        <div className="ps-modal-sub">Update details for {section.name}</div>
                    </div>
                    <button className="ps-modal-close" onClick={onClose}><X size={14} /></button>
                </div>
                <form onSubmit={submit}>
                    <div className="ps-modal-body">
                        <div className="ps-field">
                            <label className="ps-field-lbl">Section Name</label>
                            <input className="ps-field-inp" placeholder="e.g. Alpha, Beta, A1" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="ps-two-col">
                            <div className="ps-field">
                                <label className="ps-field-lbl">Year Level</label>
                                <select className="ps-field-inp" value={year} onChange={e => setYear(e.target.value)}>
                                    {YEAR_LEVELS.map(y => <option key={y}>{y}</option>)}
                                </select>
                            </div>
                            <div className="ps-field">
                                <label className="ps-field-lbl">School Year</label>
                                <input className="ps-field-inp" placeholder="2024-2025" value={sy} onChange={e => setSy(e.target.value)} required />
                            </div>
                        </div>
                        <div className="ps-two-col">
                            <div className="ps-field">
                                <label className="ps-field-lbl">Semester</label>
                                <select className="ps-field-inp" value={semester} onChange={e => setSemester(e.target.value)}>
                                    {SEMESTERS.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="ps-field">
                                <label className="ps-field-lbl">Section Adviser</label>
                                <CustomAdviserSelect value={adviserId} onChange={setAdviserId} teachers={teachers} />
                            </div>
                        </div>
                    </div>
                    <div className="ps-modal-foot">
                        <button type="button" className="ps-btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="ps-btn-submit">
                            <Save size={13} /> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────────────────────────
   DELETE MODAL
───────────────────────────────────────────────────────────────────────────── */
const DeleteModal = ({ title, desc, onClose, onConfirm }) => (
    <div className="ps-overlay" onClick={onClose}>
        <div className="ps-del-modal" onClick={e => e.stopPropagation()}>
            <div className="ps-modal-hdr" style={{ borderColor: 'rgba(248,113,113,0.15)' }}>
                <div className="ps-modal-title" style={{ color: C.red }}>Confirm <span style={{ color: C.red }}>Delete</span></div>
                <button className="ps-modal-close" onClick={onClose}><X size={14} /></button>
            </div>
            <div className="ps-modal-body" style={{ textAlign: 'center', paddingTop: 24 }}>
                <div className="ps-del-ico">
                    <Trash2 size={22} color={C.red} />
                </div>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 17, fontStyle: 'italic', color: C.txt, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.55 }}>{desc}</div>
            </div>
            <div className="ps-modal-foot">
                <button className="ps-btn-ghost" onClick={onClose}>Cancel</button>
                <button className="ps-btn-danger" onClick={onConfirm}>
                    <Trash2 size={13} /> Delete
                </button>
            </div>
        </div>
    </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN EXPORT — single-page, state-driven
───────────────────────────────────────────────────────────────────────────── */
export default function SectionIndex({ curricula, programs: initialPrograms }) {
    /* ── view state ── */
    const [activeCourse, setActiveCourse] = useState(() => {
        if (typeof window !== 'undefined') {
            return new URLSearchParams(window.location.search).get('program') || null;
        }
        return null;
    }); 
    const [activeSectionRoster, setActiveSectionRoster] = useState(() => {
        if (typeof window !== 'undefined') {
            const sec = new URLSearchParams(window.location.search).get('section');
            return sec ? parseInt(sec) : null;
        }
        return null;
    });

    /* ── data state ── */
    const [programs, setPrograms] = useState([]);
    const [sectionsMap, setSectionsMap] = useState({}); // { [code]: Section[] }
    const [teachers, setTeachers] = useState([]);
    const [loadingSections, setLoadingSections] = useState(false);
    const [loadingPrograms, setLoadingPrograms] = useState(true);

    /* ── search / filter ── */
    const [search, setSearch] = useState('');
    const [yearFilter, setYearFilter] = useState('All');

    /* ── modals ── */
    const [createProgram, setCreateProgram] = useState(false);
    const [editProgram, setEditProgram] = useState(null);
    const [createSection, setCreateSection] = useState(false);
    const [editSection, setEditSection] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null); // { type, id/code, title, desc }
    const [addStudentFocus, setAddStudentFocus] = useState(0); // increments to trigger focus in RosterView

    /* ── toast ── */
    const [toast, setToast] = useState(null);
    const showToast = useCallback((msg) => setToast(msg), []);

    /* ── fetch programs ── */
    const fetchPrograms = useCallback(async () => {
        setLoadingPrograms(true);
        try {
            const res = await axios.get('/api/programs', { headers: { 'Accept': 'application/json' } });
            setPrograms(res.data);
        } catch (error) {
            console.error("Failed to load programs:", error);
            showToast("Failed to load programs.");
        } finally {
            setLoadingPrograms(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchPrograms();
        axios.get('/api/directory/teachers').then(res => setTeachers(res.data)).catch(() => {});
    }, [fetchPrograms]);

    /* ── fetch sections when drilling in ── */
    useEffect(() => {
        if (!activeCourse) return;
        if (sectionsMap[activeCourse]) return; // already loaded
        
        const fetchCourseSections = async () => {
            setLoadingSections(true);
            try {
                const res = await axios.get(`/api/programs/${activeCourse}/sections`);
                setSectionsMap(prev => ({ ...prev, [activeCourse]: res.data }));
            } catch (error) {
                console.error("Failed to fetch sections:", error);
                showToast("Failed to fetch sections.");
            } finally {
                setLoadingSections(false);
            }
        };
        fetchCourseSections();
    }, [activeCourse, sectionsMap, showToast]);

    /* ── reset search when switching views ── */
    useEffect(() => {
        setSearch('');
        setYearFilter('All');
    }, [activeCourse]);

    /* ── derived data ── */
    const sections = activeCourse ? (sectionsMap[activeCourse] || []) : [];
    const totalSections = programs.reduce((a, p) => a + p.section_count, 0);
    const totalStudents = programs.reduce((a, p) => a + p.student_count, 0);

    const filteredPrograms = useMemo(() =>
        programs.filter(p =>
            p.code.toLowerCase().includes(search.toLowerCase()) ||
            p.name.toLowerCase().includes(search.toLowerCase())
        ), [programs, search]);

    const filteredSections = useMemo(() =>
        sections.filter(s =>
            (yearFilter === 'All' || s.grade_level === yearFilter) &&
            s.name.toLowerCase().includes(search.toLowerCase())
        ), [sections, search, yearFilter]);

    /* ── handlers ── */
    const handleSaveProgram = useCallback(async (prog) => {
        try {
            const res = await axios.post('/api/programs', prog);
            setPrograms(prev => [...prev, res.data]);
            setSectionsMap(prev => ({ ...prev, [res.data.code]: [] }));
            setCreateProgram(false);
            showToast(`Program ${res.data.code} established!`);
        } catch (error) {
            console.error("Failed to create program:", error);
            showToast("Failed to create program.");
        }
    }, [showToast]);

    const handleUpdateProgram = useCallback(async (code, data) => {
        try {
            const res = await axios.patch(`/api/programs/${code}`, data);
            setPrograms(prev => prev.map(p => p.code === code ? { ...p, ...res.data } : p));
            setEditProgram(null);
            showToast(`Program ${code} updated!`);
        } catch (error) {
            console.error("Failed to update program:", error);
            showToast("Failed to update program.");
        }
    }, [showToast]);

    const handleSaveSection = useCallback(async (sec) => {
        try {
            const res = await axios.post(`/api/programs/${activeCourse}/sections`, sec);
            setSectionsMap(prev => ({
                ...prev,
                [activeCourse]: [...(prev[activeCourse] || []), res.data]
            }));
            setPrograms(prev => prev.map(p =>
                p.code === activeCourse
                    ? { ...p, section_count: p.section_count + 1 }
                    : p
            ));
            setCreateSection(false);
            showToast(`Section "${res.data.name}" created!`);
        } catch (error) {
            console.error("Failed to create section:", error);
            showToast("Failed to create section.");
        }
    }, [activeCourse, showToast]);

    const handleUpdateSection = useCallback(async (id, data) => {
        try {
            const res = await axios.patch(`/api/sections/${id}`, data);
            setSectionsMap(prev => ({
                ...prev,
                [activeCourse]: prev[activeCourse].map(s => s.id === id ? { ...s, ...res.data } : s)
            }));
            setEditSection(null);
            showToast(`Section "${res.data.name}" updated!`);
        } catch (error) {
            console.error("Failed to update section:", error);
            showToast("Failed to update section.");
        }
    }, [activeCourse, showToast]);

    const handleDeleteProgram = useCallback(async (code) => {
        try {
            await axios.delete(`/api/programs/${code}`);
            setPrograms(prev => prev.filter(p => p.code !== code));
            setDeleteTarget(null);
            showToast(`Program ${code} deleted`);
            
            if (activeCourse === code) {
                setActiveCourse(null);
            }
        } catch (error) {
            console.error("Failed to delete program:", error);
            showToast("Failed to delete program.");
        }
    }, [activeCourse, showToast]);

    const handleDeleteSection = useCallback(async (id) => {
        try {
            await axios.delete(`/api/sections/${id}`);
            setSectionsMap(prev => ({
                ...prev,
                [activeCourse]: prev[activeCourse].filter(s => s.id !== id)
            }));
            setPrograms(prev => prev.map(p =>
                p.code === activeCourse
                    ? { ...p, section_count: Math.max(0, p.section_count - 1) }
                    : p
            ));
            setDeleteTarget(null);
            showToast('Section deleted');
        } catch (error) {
            console.error("Failed to delete section:", error);
            showToast("Failed to delete section.");
        }
    }, [activeCourse, showToast]);

    const handleRefresh = useCallback(() => {
        fetchPrograms();
        if (activeCourse) {
            setSectionsMap(prev => {
                const newMap = { ...prev };
                delete newMap[activeCourse];
                return newMap;
            });
        }
        showToast('Data refreshed');
    }, [activeCourse, fetchPrograms, showToast]);

    /* ── breadcrumb ── */
    const activeSection = sections.find(s => s.id === activeSectionRoster);
    const sectionDisplayName = activeSection ? activeSection.name : 'Roster';

    let breadcrumbs = [];
    if (activeSectionRoster) {
        breadcrumbs = [
            { label: 'Programs & Sections', action: () => { setActiveSectionRoster(null); setActiveCourse(null); } },
            { label: activeCourse, action: () => setActiveSectionRoster(null) },
            { label: sectionDisplayName, action: null },
        ];
    } else if (activeCourse) {
        breadcrumbs = [
            { label: 'Programs & Sections', action: () => setActiveCourse(null) },
            { label: activeCourse, action: null },
        ];
    } else {
        breadcrumbs = [{ label: 'Programs & Sections', action: null }];
    }

    /* ─────────────────────────────────────────────────────────────────────
       RENDER
    ───────────────────────────────────────────────────────────────────── */
    return (
        <AppLayout title={activeCourse ? `${activeCourse} Sections` : 'Programs & Sections'} noPadding>
            <style>{css}</style>
            <div className="ps-root">
                <div className="ps-grid-tex" />
                <div className="ps-orb ps-orb1" />
                <div className="ps-orb ps-orb2" />

                {/* ── TOPBAR ── */}
                <div className="ps-topbar">
                    <div className="ps-breadcrumb">
                        {breadcrumbs.map((b, i) => (
                            <React.Fragment key={i}>
                                <button
                                    className={`ps-bc-btn ${i === breadcrumbs.length - 1 ? 'active' : ''}`}
                                    onClick={b.action || undefined}
                                    disabled={!b.action}
                                >
                                    {b.label}
                                </button>
                                {i < breadcrumbs.length - 1 && (
                                    <ChevronRight size={13} className="ps-bc-sep" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="ps-topbar-right">
                        <button className="ps-refresh-btn" onClick={handleRefresh} title="Refresh">
                            <RefreshCcw size={15} />
                        </button>
                        {!activeCourse ? (
                            <button className="ps-cta" onClick={() => setCreateProgram(true)}>
                                <Plus size={14} /> New Program
                            </button>
                        ) : activeSectionRoster ? (
                            <button className="ps-cta" onClick={() => setAddStudentFocus(f => f + 1)} style={{ background: 'linear-gradient(135deg, #34d399, #059669)', boxShadow: '0 4px 16px rgba(52,211,153,0.3)' }}>
                                <UserPlus size={14} /> Add Student
                            </button>
                        ) : (
                            <button className="ps-cta" onClick={() => setCreateSection(true)}>
                                <Plus size={14} /> New Section
                            </button>
                        )}
                    </div>
                </div>

                {/* ── PAGE BODY ── */}
                <div className="ps-body">

                    {activeSectionRoster && (
                        <RosterView 
                            sectionId={activeSectionRoster} 
                            activeCourse={activeCourse}
                            onBack={() => { setActiveSectionRoster(null); handleRefresh(); }} 
                            showToast={showToast}
                            focusTrigger={addStudentFocus}
                        />
                    )}

                    {/* ════════════════════════════════ PROGRAMS VIEW ═══ */}
                    {!activeCourse && !activeSectionRoster && (
                        <>
                            <div className="ps-page-hdr ps-fu">
                                <div className="ps-page-title">Academic <span>Programs</span> &amp; Sections</div>
                                <div className="ps-page-sub">College of Computing Studies · Manage course programs and their sections</div>
                            </div>

                            {/* stat strip */}
                            <div className="ps-stats ps-fu ps-d1">
                                {[
                                    { icon: <GraduationCap size={13} color={C.orange} />, bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.18)', val: programs.length, lbl: 'Total Programs' },
                                    { icon: <Layers size={13} color={C.o2} />, bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.18)', val: totalSections, lbl: 'Total Sections' },
                                    { icon: <Users size={13} color={C.green} />, bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.18)', val: totalStudents, lbl: 'Total Students' },
                                    { icon: <User size={13} color={C.blue} />, bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.18)', val: totalSections ? Math.round(totalStudents / totalSections) : 0, lbl: 'Avg per Section' },
                                ].map((s, i) => (
                                    <div key={i} className="ps-stat">
                                        <div className="ps-stat-icon" style={{ background: s.bg, border: `1px solid ${s.border}` }}>{s.icon}</div>
                                        <div className="ps-stat-val">{s.val}</div>
                                        <div className="ps-stat-lbl">{s.lbl}</div>
                                    </div>
                                ))}
                            </div>

                            {/* search */}
                            <div className="ps-toolbar ps-fu ps-d2">
                                <div className="ps-search">
                                    <Search size={15} color={C.muted} />
                                    <input
                                        placeholder="Search programs by code or name…"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* programs grid */}
                            <div className="ps-prog-grid ps-fu ps-d3">
                                {filteredPrograms.map(p => {
                                    const fillPct = Math.min((p.section_count / 10) * 100, 100);
                                    return (
                                        <div key={p.code} className="ps-prog-card" onClick={() => setActiveCourse(p.code)}>
                                            <div className="ps-prog-body">
                                                <div className="ps-prog-top">
                                                    <div className="ps-prog-code">{p.code}</div>
                                                    <div className="ps-prog-actions" onClick={e => e.stopPropagation()}>
                                                        <button className="ps-act-btn" title="Edit" onClick={() => setEditProgram(p)}>
                                                            <Edit size={12} />
                                                        </button>
                                                        <button className="ps-act-btn danger" title="Delete"
                                                            onClick={() => setDeleteTarget({
                                                                type: 'program', code: p.code,
                                                                title: `Delete ${p.code}?`,
                                                                desc: `This will remove all ${p.section_count} section(s) and ${p.student_count} student enrollment(s).`,
                                                            })}>
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="ps-prog-name">{p.name}</div>
                                                <div className="ps-chips">
                                                    <span className="ps-chip chip-o"><Layers size={9} /> {p.section_count} Sections</span>
                                                    <span className="ps-chip chip-g"><Users size={9} /> {p.student_count} Students</span>
                                                    <span className="ps-chip chip-b">{p.dept}</span>
                                                </div>
                                                <div className="ps-fill">
                                                    <div className="ps-fill-bar" style={{ width: `${fillPct}%` }} />
                                                </div>
                                                <button className="ps-manage-btn" onClick={e => { e.stopPropagation(); setActiveCourse(p.code); }}>
                                                    Manage Sections <ChevronRight size={12} className="arr" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* add card */}
                                <div className="ps-add-card" onClick={() => setCreateProgram(true)}>
                                    <div className="ps-add-circle">
                                        <Plus size={22} color={C.orange} />
                                    </div>
                                    <div className="ps-add-lbl">Establish Program</div>
                                    <div className="ps-add-sub">Click to add new course</div>
                                </div>

                                {filteredPrograms.length === 0 && search && (
                                    <div className="ps-empty">
                                        <div className="ps-empty-ico"><Search size={24} color="rgba(249,115,22,0.45)" /></div>
                                        <div className="ps-empty-title">No programs match "{search}"</div>
                                        <div className="ps-empty-sub">Try a different keyword</div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* ════════════════════════════════ SECTIONS VIEW ═══ */}
                    {activeCourse && !activeSectionRoster && (() => {
                        const prog = programs.find(p => p.code === activeCourse);
                        const secTotal = sections.reduce((a, s) => a + s.students_count, 0);
                        return (
                            <>
                                {/* back + header */}
                                <div className="ps-fu">
                                    <button className="ps-back-btn" onClick={() => setActiveCourse(null)}>
                                        <ArrowLeft size={13} /> Back to Programs
                                    </button>
                                    <div className="ps-page-hdr">
                                        <div className="ps-page-title">
                                            <span>{activeCourse}</span> &nbsp;<span style={{ color: C.muted, fontSize: 24 }}>Sections</span>
                                        </div>
                                        <div className="ps-page-sub">{prog?.name}</div>
                                    </div>
                                </div>

                                {/* 3-stat strip */}
                                <div className="ps-stats ps-stats-3 ps-fu ps-d1">
                                    {[
                                        { icon: <Layers size={13} color={C.orange} />, bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.18)', val: sections.length, lbl: 'Total Sections' },
                                        { icon: <Users size={13} color={C.green} />, bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.18)', val: secTotal, lbl: 'Total Students' },
                                        { icon: <User size={13} color={C.blue} />, bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.18)', val: sections.length ? Math.round(secTotal / sections.length) : 0, lbl: 'Avg per Section' },
                                    ].map((s, i) => (
                                        <div key={i} className="ps-stat">
                                            <div className="ps-stat-icon" style={{ background: s.bg, border: `1px solid ${s.border}` }}>{s.icon}</div>
                                            <div className="ps-stat-val">{s.val}</div>
                                            <div className="ps-stat-lbl">{s.lbl}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* toolbar */}
                                <div className="ps-toolbar ps-fu ps-d2">
                                    <div className="ps-search">
                                        <Search size={15} color={C.muted} />
                                        <input
                                            placeholder="Search sections or adviser…"
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                        />
                                    </div>
                                    <div className="ps-filter-wrap">
                                        <Filter size={14} color={C.muted} />
                                        <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
                                            <option value="All">All Years</option>
                                            {YEAR_LEVELS.map(y => <option key={y}>{y}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* loading */}
                                {loadingSections && (
                                    <div style={{ textAlign: 'center', padding: '60px 0', color: C.muted, fontSize: 13 }}>Loading sections…</div>
                                )}

                                {/* empty */}
                                {!loadingSections && sections.length === 0 && (
                                    <div className="ps-empty ps-fu ps-d3">
                                        <div className="ps-empty-ico"><Layers size={26} color="rgba(249,115,22,0.45)" /></div>
                                        <div className="ps-empty-title">No sections for {activeCourse} yet</div>
                                        <div className="ps-empty-sub">Create the first section to start organizing students</div>
                                    </div>
                                )}

                                {/* year groups */}
                                {!loadingSections && YEAR_LEVELS.map((year, gi) => {
                                    const ys = filteredSections.filter(s => s.grade_level === year);
                                    if (ys.length === 0) return null;
                                    return (
                                        <div key={year} className="ps-year-group ps-fu" style={{ animationDelay: `${0.1 + gi * 0.05}s` }}>
                                            <div className="ps-year-lbl">
                                                {year}
                                                <span className="ps-year-count">{ys.length} section{ys.length !== 1 ? 's' : ''}</span>
                                            </div>
                                            <div className="ps-sec-grid">
                                                {ys.map(s => {
                                                    const fillPct = Math.min((s.students_count / 50) * 100, 100);
                                                    return (
                                                        <div key={s.id} className="ps-sec-card">
                                                            <div className="ps-sec-bar" />
                                                            <div className="ps-sec-body">
                                                                <div className="ps-sec-top">
                                                                    <div className="ps-sec-name">{s.name}</div>
                                                                    <div className="ps-sec-actions">
                                                                        <button className="ps-act-btn" title="Add Student" onClick={() => { setActiveSectionRoster(s.id); setAddStudentFocus(f => f + 1); }}>
                                                                            <UserPlus size={12} color={C.green} />
                                                                        </button>
                                                                        <button className="ps-act-btn" title="Edit" onClick={() => setEditSection(s)}>
                                                                            <Edit size={12} />
                                                                        </button>
                                                                        <button className="ps-act-btn danger" title="Delete"
                                                                            onClick={() => setDeleteTarget({
                                                                                type: 'section', id: s.id,
                                                                                title: `Delete section "${s.name}"?`,
                                                                                desc: `${s.students_count} student(s) will be unenrolled from this section.`,
                                                                            })}>
                                                                            <Trash2 size={12} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className="ps-sec-sy">{s.school_year} · {s.grade_level}</div>
                                                                <div className="ps-sec-divider" />
                                                                <div className="ps-sec-row">
                                                                    <div className="ps-sec-ico"><User size={13} color="rgba(249,115,22,0.55)" /></div>
                                                                    <div>
                                                                        <div className="ps-sec-flbl">Adviser</div>
                                                                        <div className="ps-sec-fval">
                                                                            {s.adviser?.name || <span style={{ color: C.dim, fontStyle: 'italic', fontSize: 11 }}>TBA</span>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="ps-sec-row">
                                                                    <div className="ps-sec-ico"><Users size={13} color="rgba(249,115,22,0.55)" /></div>
                                                                    <div style={{ flex: 1 }}>
                                                                        <div className="ps-sec-flbl">Enrollment</div>
                                                                        <div className="ps-count-row">
                                                                            <span className="ps-sec-fval">{s.students_count} students</span>
                                                                            <div className="ps-count-track">
                                                                                <div className="ps-count-fill" style={{ width: `${fillPct}%` }} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="ps-sec-footer">
                                                                    <button className="ps-roster-btn" onClick={() => setActiveSectionRoster(s.id)}>
                                                                        Manage Roster <ChevronRight size={12} />
                                                                    </button>
                                                                    <button className="ps-add-stu-btn" onClick={() => setActiveSectionRoster(s.id)}>
                                                                        <UserPlus size={11} /> Add
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        );
                    })()}
                </div>

                {/* ── MODALS ── */}
                {createProgram && (
                    <CreateProgramModal
                        curricula={curricula}
                        onClose={() => setCreateProgram(false)}
                        onSave={handleSaveProgram}
                    />
                )}
                {editProgram && (
                    <EditProgramModal
                        curricula={curricula}
                        program={editProgram}
                        onClose={() => setEditProgram(null)}
                        onSave={handleUpdateProgram}
                    />
                )}
                {createSection && (
                    <CreateSectionModal
                        course={activeCourse}
                        teachers={teachers}
                        curricula={curricula}
                        programs={programs}
                        onClose={() => setCreateSection(false)}
                        onSave={handleSaveSection}
                    />
                )}
                {editSection && (
                    <EditSectionModal
                        section={editSection}
                        teachers={teachers}
                        curricula={curricula}
                        programs={programs}
                        onClose={() => setEditSection(null)}
                        onSave={handleUpdateSection}
                    />
                )}
                {deleteTarget && (
                    <DeleteModal
                        title={deleteTarget.title}
                        desc={deleteTarget.desc}
                        onClose={() => setDeleteTarget(null)}
                        onConfirm={() =>
                            deleteTarget.type === 'program'
                                ? handleDeleteProgram(deleteTarget.code)
                                : handleDeleteSection(deleteTarget.id)
                        }
                    />
                )}

                {/* ── TOAST ── */}
                {toast && <Toast message={toast} onClose={() => setToast(null)} />}
            </div>
        </AppLayout>
    );
}