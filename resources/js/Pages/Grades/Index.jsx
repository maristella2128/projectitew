import React, { useState, useMemo, useEffect, useCallback } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm, router, Head } from '@inertiajs/react';
import {
    Plus, GraduationCap, User, BookOpen,
    Calendar, TrendingUp, Save, Edit,
    Trash2, X, CheckCircle, Search, Filter,
    Layers, ChevronRight, ChevronDown, Award, ShieldAlert,
    ArrowUpRight, Target, Users, BarChart3,
    CheckCircle2, AlertTriangle, XCircle, Info, ChevronLeft,
    Hash, UserCircle, Briefcase, FileText, ArrowLeftCircle, ArrowLeft,
    ListChecks, Rocket, Zap, Brain, Trophy, Sparkles, SlidersHorizontal,
    Lock, Shield, Scale, FileCheck, AlertOctagon, UserPlus
} from 'lucide-react';
import Modal from '@/Components/Modal';

/* ──────────────────────────────────────────────────────────────────────────
   STYLES (Premium Dark Orange Theme)
   ────────────────────────────────────────────────────────────────────────── */
const C = {
    bg: '#0c0805', surf: '#160e08', surf2: '#1c1208', bdr: '#2a1508', bdr2: '#3a1e0a',
    orange: '#f97316', o2: '#fb923c', o3: '#fdba74', o4: '#c2410c',
    txt: '#fef3ec', muted: 'rgba(254,243,236,0.35)', dim: 'rgba(254,243,236,0.18)',
    faint: 'rgba(254,243,236,0.06)',
    green: '#10b981', amber: '#f59e0b', red: '#ef4444', teal: '#14b8a6', blue: '#3b82f6', purple: '#8b5cf6',
    
    // RosterView Inherited Tokens
    rv: {
        bg: '#080604',
        surf: '#0d0904',
        card: '#131009',
        card2: '#191309',
        card3: '#1f180a',
        elev: '#271d0d',
        o4: 'rgba(249,115,22,0.07)',
        o5: 'rgba(249,115,22,0.13)',
        o6: 'rgba(249,115,22,0.22)',
        muted: '#7d7065',
        dim: '#4a4038',
        ghost: '#2e2318',
        border: 'rgba(249,115,22,0.065)',
        border2: 'rgba(249,115,22,0.15)',
        border3: 'rgba(249,115,22,0.28)',
        g2: 'rgba(52,211,153,0.08)',
        text: '#ede8e2',
    }
};

const getScoreColor = (s) => (s >= 75 ? C.green : s >= 65 ? C.amber : C.red);
const getGwaColor = (gwa) => (gwa <= 1.75 ? C.green : gwa <= 2.5 ? C.amber : C.red);
const getRemarksStyle = (r) => {
    switch (r) {
        case 'Excellent': return { bg: 'rgba(20,184,166,0.1)', bdr: 'rgba(20,184,166,0.25)', c: C.teal };
        case 'Very Good': return { bg: 'rgba(16,185,129,0.1)', bdr: 'rgba(16,185,129,0.25)', c: C.green };
        case 'Satisfactory': return { bg: 'rgba(245,158,11,0.1)', bdr: 'rgba(245,158,11,0.25)', c: C.amber };
        case 'Needs Improvement': return { bg: 'rgba(249,115,22,0.1)', bdr: 'rgba(249,115,22,0.25)', c: C.orange };
        case 'Failed': return { bg: 'rgba(239,68,68,0.1)', bdr: 'rgba(239,68,68,0.25)', c: C.red };
        default: return { bg: C.faint, bdr: C.faint, c: C.muted };
    }
};

const PgBtn = ({ onClick, disabled, children }) => (
    <button 
        onClick={onClick} 
        disabled={disabled}
        className={`w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center transition-all ${disabled ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/5 hover:border-white/20 active:scale-95'}`}
    >
        {children}
    </button>
);

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,900&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');

.gr-root {
    background: ${C.bg}; min-height: 100vh; flex: 1; display: flex; flex-direction: column;
    font-family: 'DM Sans', system-ui, sans-serif; color: ${C.txt}; padding: 32px 40px 80px; position: relative;
    overflow-x: hidden;
}
.gr-grid-tex { position: absolute; inset: 0; pointer-events: none; z-index: 0; background-size: 56px 56px; background-image: linear-gradient(${C.dim} 1px, transparent 1px), linear-gradient(90deg, ${C.dim} 1px, transparent 1px); opacity: 0.3; }
.gr-orb1 { position: fixed; top: -10%; right: -5%; width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%); pointer-events: none; z-index: 0; }
.gr-orb2 { position: fixed; bottom: -20%; left: -10%; width: 800px; height: 800px; border-radius: 50%; background: radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%); pointer-events: none; z-index: 0; }

.gr-content { position: relative; z-index: 1; max-width: 1400px; margin: 0 auto; width: 100%; animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* ── Metrics ── */
.gr-metrics { display: grid; grid-template-columns: repeat(5, 1fr); gap: 24px; margin-bottom: 32px; }
.gr-stat-card { background: rgba(22,14,8,0.6); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.04); border-radius: 28px; padding: 24px; position: relative; overflow: hidden; transition: all .4s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
.gr-stat-card:hover { border-color: rgba(249,115,22,0.3); transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05); background: rgba(22,14,8,0.8); }
.gr-stat-val { font-family: 'Playfair Display', serif; font-size: 38px; font-weight: 900; line-height: 1; margin: 16px 0 4px; text-shadow: 0 4px 12px rgba(0,0,0,0.5); }
.gr-stat-lbl { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .15em; color: ${C.muted}; display: flex; align-items: center; gap: 8px; }
.gr-stat-icon { position: absolute; top: -10px; right: -10px; color: ${C.orange}; opacity: 0.1; transition: all .5s cubic-bezier(0.16, 1, 0.3, 1); transform: scale(1.5); }
.gr-stat-card:hover .gr-stat-icon { opacity: 0.25; transform: scale(1.6) rotate(-10deg); color: ${C.o3}; }

/* ── Distribution Bar ── */
.gr-dist-box { background: rgba(22,14,8,0.6); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.04); border-radius: 28px; padding: 24px 32px; margin-bottom: 40px; transition: all .3s ease; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
.gr-dist-box:hover { border-color: rgba(255,255,255,0.08); box-shadow: 0 15px 40px rgba(0,0,0,0.4); }
.gr-dist-bar { height: 10px; border-radius: 5px; background: rgba(255,255,255,0.03); overflow: hidden; display: flex; margin: 16px 0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3); }
.gr-dist-seg { transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
.gr-dist-seg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%); mix-blend-mode: overlay; }

/* ── Filters ── */
.gr-filters { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 40px; }
.gr-filter-box { background: rgba(22,14,8,0.5); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 18px 24px; display: flex; align-items: center; gap: 16px; transition: all .3s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
.gr-filter-box:focus-within { border-color: ${C.orange}; background: rgba(249,115,22,0.05); box-shadow: 0 0 0 4px rgba(249,115,22,0.1), 0 10px 30px rgba(249,115,22,0.15); transform: translateY(-2px); }
.gr-filter-el { flex: 1; background: transparent; border: none; outline: none; font-size: 14px; font-weight: 700; color: ${C.txt}; font-family: 'DM Sans'; }
.gr-filter-el::placeholder { color: ${C.dim}; font-weight: 500; }
.gr-filter-box svg { transition: all .3s ease; filter: drop-shadow(0 0 8px rgba(249,115,22,0.5)); }
.gr-filter-box:focus-within svg { transform: scale(1.1); color: ${C.o2}; filter: drop-shadow(0 0 12px rgba(249,115,22,0.8)); }

/* ── Table ── */
.gr-card { background: rgba(22,14,8,0.4); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.05); border-radius: 36px; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05); }
.gr-table { width: 100%; border-collapse: collapse; }
.gr-th { text-align: left; padding: 24px 32px; background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.05); font-family: 'Space Mono', monospace; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .15em; color: ${C.muted}; backdrop-filter: blur(4px); }
.gr-td { padding: 22px 32px; border-bottom: 1px solid rgba(255,255,255,0.02); vertical-align: middle; }
.gr-tr { transition: all .3s cubic-bezier(0.16, 1, 0.3, 1); position: relative; }
.gr-tr::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: linear-gradient(180deg, ${C.orange}, ${C.o3}); opacity: 0; transition: opacity .3s, transform .3s; transform: scaleY(0); }
.gr-tr:hover { background: rgba(255,255,255,0.03); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02); }
.gr-tr:hover::before { opacity: 1; transform: scaleY(1); }

/* ── Grade Meter ── */
.gr-meter-box { width: 120px; display: flex; flex-direction: column; gap: 6px; }
.gr-meter-val { font-family: 'Playfair Display'; font-size: 24px; font-weight: 900; line-height: 1; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
.gr-meter-track { height: 4px; border-radius: 2px; background: rgba(255,255,255,0.05); width: 100%; overflow: hidden; box-shadow: inset 0 1px 2px rgba(0,0,0,0.5); }
.gr-meter-fill { height: 100%; transition: width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1); border-radius: 2px; box-shadow: 0 0 10px currentColor; }

/* ── Badges ── */
.gr-remarks-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 12px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; border: 1px solid; backdrop-filter: blur(4px); box-shadow: auto; transition: all .3s ease; }
.gr-remarks-badge:hover { filter: brightness(1.2); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }

/* ── Inline Delete & Buttons ── */
.gr-tr-deleting { background: rgba(239,68,68,0.08) !important; border-left: 4px solid ${C.red} !important; }
.gr-delete-confirm { display: flex; align-items: center; gap: 12px; animation: slideIn .3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes slideIn { from { opacity:0; transform: translateX(20px); } to { opacity:1; transform: translateX(0); } }

/* ── Buttons ── */
.gr-btn-primary { background: linear-gradient(135deg, ${C.orange}, ${C.o4}); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 16px 28px; font-size: 12px; font-weight: 900; color: white; display: flex; align-items: center; gap: 10px; transition: all .3s cubic-bezier(0.16,1,0.3,1); box-shadow: 0 8px 24px rgba(249,115,22,0.3), inset 0 1px 0 rgba(255,255,255,0.2); text-transform: uppercase; letter-spacing: .1em; cursor: pointer; }
.gr-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(249,115,22,0.5), inset 0 1px 0 rgba(255,255,255,0.3); background: linear-gradient(135deg, ${C.o2}, ${C.orange}); }
.gr-btn-secondary { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 16px 28px; font-size: 12px; font-weight: 900; color: rgba(255,255,255,0.8); display: flex; align-items: center; gap: 10px; transition: all .3s cubic-bezier(0.16,1,0.3,1); box-shadow: 0 4px 12px rgba(0,0,0,0.2); text-transform: uppercase; letter-spacing: .1em; cursor: pointer; }
.gr-btn-secondary:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); transform: translateY(-2px); color: white; box-shadow: 0 8px 20px rgba(0,0,0,0.3); }

/* ── Segments ── */
.gr-segment { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 6px; display: inline-flex; gap: 6px; backdrop-filter: blur(12px); box-shadow: inset 0 2px 4px rgba(0,0,0,0.5); }
.gr-seg-btn { padding: 12px 28px; border-radius: 14px; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: .15em; transition: all .3s cubic-bezier(0.16,1,0.3,1); color: rgba(255,255,255,0.4); outline: none; }
.gr-seg-btn.active { background: linear-gradient(135deg, ${C.orange}, ${C.o4}); color: white; box-shadow: 0 8px 20px rgba(249,115,22,0.4), inset 0 1px 0 rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.1); }
.gr-seg-btn:not(.active):hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.05); }

/* ── Drawer ── */
.gr-drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(12px); z-index: 100; opacity: 0; pointer-events: none; transition: opacity .4s ease; }
.gr-drawer-overlay.active { opacity: 1; pointer-events: auto; }
.gr-drawer { position: fixed; top: 0; right: 0; height: 100vh; width: 600px; background: rgba(22,14,8,0.95); backdrop-filter: blur(24px); border-left: 1px solid rgba(255,255,255,0.08); z-index: 101; transform: translateX(100%); transition: transform .5s cubic-bezier(0.16, 1, 0.3, 1); padding: 48px; overflow-y: auto; box-shadow: -30px 0 80px rgba(0,0,0,0.8); }
.gr-drawer.active { transform: translateX(0); }

/* ── Curriculum Progress ── */
.gr-curr-toggle { width: 100%; display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 20px 24px; cursor: pointer; transition: all .3s; }
.gr-curr-toggle:hover { border-color: rgba(249,115,22,0.5); background: rgba(249,115,22,0.08); box-shadow: 0 10px 30px rgba(249,115,22,0.1); }
.gr-curr-body { animation: currFadeIn .3s ease; }
@keyframes currFadeIn { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
.gr-curr-prog-track { height: 10px; border-radius: 5px; background: rgba(255,255,255,0.06); overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3); }
.gr-curr-prog-fill { height: 100%; background: linear-gradient(90deg, ${C.green}, #34d399); border-radius: 5px; transition: width 1s cubic-bezier(0.4,0,0.2,1); box-shadow: 0 0 12px rgba(16,185,129,0.5); }
.gr-curr-yr-hdr { font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: .2em; color: ${C.orange}; padding: 18px 0 10px; border-bottom: 1px solid rgba(255,255,255,0.08); }
.gr-curr-sem-hdr { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .15em; color: ${C.muted}; padding: 12px 0 6px; }
.gr-curr-row { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 16px; transition: all .2s; border: 1px solid transparent; }
.gr-curr-row:hover { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.05); transform: translateX(4px); }

/* ── Modal ── */
.gr-modal { background: rgba(22,14,8,0.95); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 36px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1); }
.gr-input { width: 100%; background: rgba(0,0,0,0.3); border: 2px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 16px 20px; color: ${C.txt}; font-size: 14px; font-weight: 700; outline: none; transition: all .3s; box-shadow: inset 0 2px 6px rgba(0,0,0,0.5); }
.gr-input:focus { border-color: ${C.orange}; box-shadow: 0 0 0 4px rgba(249,115,22,0.15), inset 0 2px 6px rgba(0,0,0,0.5); background: rgba(0,0,0,0.5); }
.gr-input-glow:focus { box-shadow: 0 0 15px rgba(59, 130, 246, 0.3); border-color: rgba(59, 130, 246, 0.5); }
.gr-badge-shimmer { position: relative; overflow: hidden; }
.gr-badge-shimmer::after { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent); transform: rotate(45deg); animation: shimmer 3s infinite; }
@keyframes shimmer { 0% { transform: translateX(-100%) rotate(45deg); } 100% { transform: translateX(100%) rotate(45deg); } }
.gr-row-hover:hover { background: rgba(255,255,255,0.03); transform: scale(1.002); box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
.gr-glass { background: rgba(255,255,255,0.02); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); }
.gr-mesh { background-image: radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.05) 0, transparent 50%), radial-gradient(at 50% 0%, rgba(249, 115, 22, 0.05) 0, transparent 50%); }


/* ── Section Cards (Inherited from Sections Module) ── */
.ps-year-group { margin-bottom: 36px; }
.ps-year-lbl { font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700; color: ${C.o2}; text-transform: uppercase; letter-spacing: .12em; display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.ps-year-lbl::after { content: ''; flex: 1; height: 1px; background: rgba(249,115,22,0.1); }
.ps-year-count { font-size: 9px; font-weight: 800; color: ${C.muted}; background: rgba(249,115,22,0.07); padding: 2px 8px; border-radius: 10px; letter-spacing: .07em; text-transform: uppercase; }
.ps-sec-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.ps-sec-card { background: rgba(26,16,8,0.4); border: 1px solid rgba(249,115,22,0.09); border-radius: 20px; overflow: hidden; transition: all .25s cubic-bezier(.4,0,.2,1); position: relative; display: flex; flex-direction: column; cursor: pointer; }
.ps-sec-card:hover { border-color: rgba(249,115,22,0.3); transform: translateY(-4px); box-shadow: 0 14px 34px rgba(0,0,0,0.5), 0 0 0 1px rgba(249,115,22,0.08); }
.ps-sec-bar { height: 3px; background: linear-gradient(90deg, ${C.orange}, ${C.o4}, transparent); flex-shrink: 0; }
.ps-sec-body { padding: 22px; flex: 1; display: flex; flex-direction: column; }
.ps-sec-name { font-family: 'Playfair Display', serif; font-size: 28px; font-style: italic; color: ${C.txt}; transition: color .18s; line-height: 1; margin-bottom: 4px; }
.ps-sec-card:hover .ps-sec-name { color: ${C.o2}; }
.ps-sec-sy { font-family: 'Space Mono', monospace; font-size: 9px; font-weight: 700; color: ${C.muted}; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 16px; }
.ps-sec-divider { height: 1px; background: rgba(249,115,22,0.07); margin: 16px 0; }
.ps-sec-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.ps-sec-row:last-of-type { margin-bottom: 0; }
.ps-sec-ico { width: 34px; height: 34px; border-radius: 10px; background: rgba(249,115,22,0.07); border: 1px solid rgba(249,115,22,0.12); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ps-sec-flbl { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .1em; color: ${C.muted}; line-height: 1; margin-bottom: 4px; }
.ps-sec-fval { font-size: 13px; font-weight: 600; color: ${C.txt}; }
.ps-count-row { display: flex; align-items: center; gap: 10px; }
.ps-count-track { flex: 1; height: 4px; background: rgba(249,115,22,0.08); border-radius: 2px; overflow: hidden; }
.ps-count-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, rgba(249,115,22,0.4), ${C.orange}); transition: width .5s ease; }
.ps-sec-footer { display: flex; gap: 8px; margin-top: 18px; }
.ps-roster-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 12px; border-radius: 12px; background: rgba(249,115,22,0.07); border: 1px solid rgba(249,115,22,0.14); color: ${C.muted}; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .1em; cursor: pointer; transition: all .2s; font-family: inherit; }
.ps-roster-btn:hover { background: linear-gradient(135deg, ${C.orange}, ${C.o4}); border-color: transparent; color: #fff; box-shadow: 0 4px 14px rgba(249,115,22,0.3); }
.ps-add-stu-btn { display: flex; align-items: center; gap: 6px; padding: 12px 16px; border-radius: 12px; background: rgba(16,185,129,0.07); border: 1px solid rgba(16,185,129,0.15); color: rgba(16,185,129,0.6); font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .1em; cursor: pointer; transition: all .2s; font-family: inherit; }
.ps-add-stu-btn:hover { background: rgba(16,185,129,0.14); border-color: rgba(16,185,129,0.3); color: ${C.green}; }

/* ── RosterView Inherited Styles (Level 3) ── */
.rv-serif { font-family: 'Instrument Serif', serif; }
.rv-mono { font-family: 'JetBrains Mono', monospace; letter-spacing: -0.02em; }
.rv-tag { padding: 3px 9px; border-radius: 6px; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; display: inline-flex; align-items: center; gap: 4px; }
.rv-stat:hover { background: rgba(255,255,255,0.035) !important; border-color: rgba(255,255,255,0.085) !important; }
.rv-adv-card:hover { border-color: ${C.rv.border2} !important; }
.rv-s-row { transition: background 0.15s; position: relative; }
.rv-s-row::before { content: ''; position: absolute; left: 0; top: 8px; bottom: 8px; width: 2.5px; background: ${C.orange}; border-radius: 0 2px 2px 0; opacity: 0; transition: opacity 0.18s; }
.rv-s-row:hover { background: rgba(249,115,22,0.04) !important; }
.rv-s-row:hover::before { opacity: 1; }
.rv-grid-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; background-image: linear-gradient(rgba(249,115,22,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.022) 1px, transparent 1px); background-size: 52px 52px; }
.rv-action-btn { font-size: 10px; color: ${C.orange}; text-decoration: none; fontWeight: 700; text-transform: uppercase; letter-spacing: .05em; padding: 6px 14px; border: 1px solid ${C.rv.border}; border-radius: 8px; background: ${C.rv.o4}; transition: all .2s; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
.rv-action-btn:hover { background: ${C.rv.o5}; border-color: ${C.rv.border2}; transform: translateY(-1px); }
.rv-action-btn.emerald { color: ${C.green}; background: ${C.rv.g2}; }
.rv-action-btn.emerald:hover { background: rgba(52,211,153,0.12); border-color: rgba(52,211,153,0.25); }
`;
const YEAR_LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

/* ── Helper Components (Inherited) ── */
const StatCard = ({ icon, label, val, color = '#f97316', bg = 'rgba(249,115,22,0.1)' }) => (
    <div className="rv-stat" style={{ padding: '11px 17px', background: bg, border: `1px solid ${C.rv.border2}`, borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12, minWidth: 108, position: 'relative', overflow: 'hidden', transition: 'border-color .2s, background .2s', cursor: 'default' }}>
        <div style={{ width: 33, height: 33, borderRadius: 9, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>{icon}</div>
        <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: 8.5, fontWeight: 700, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '.07em', marginTop: 3, whiteSpace: 'nowrap' }}>{label}</div>
        </div>
    </div>
);

const InitialsAvatar = ({ firstName, lastName, size = 33 }) => {
    const initials = `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase();
    return (
        <div style={{ width: size, height: size, borderRadius: size * 0.3, background: 'rgba(249,115,22,0.18)', border: '1px solid rgba(249,115,22,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316', fontSize: size * 0.35, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>
            {initials || '?'}
        </div>
    );
};

export default function Index({
    grades, sections, students, studentSemesterRecords,
    filters, summary, curriculumSubjects,
    leaderboard = [], recommendations, activityCategories,
    studentRankings, conductData, programs: initialPrograms
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rosterPage, setRosterPage] = useState(1);
    const ROSTER_LIMIT = 10;

    const [editingGrade, setEditingGrade] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                handleFilter('search', searchTerm);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const [drillLevel, setDrillLevel] = useState('programs'); // 'programs' | 'sections' | 'students'
    const [activeProgram, setActiveProgram] = useState(null);
    const [activeSection, setActiveSection] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [modalSectionId, setModalSectionId] = useState('');
    const [isCreateProgramOpen, setIsCreateProgramOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        if (filters?.student_id && students.length > 0) {
            const st = students.find(s => String(s.id) === String(filters.student_id));
            if (st) {
                setSelectedStudent(st);
                setDrillLevel('students');
                if (st.course) setActiveProgram(st.course);
                if (st.section) setActiveSection(st.section);
            }
        }
    }, [filters?.student_id, students]);
    const [profileEditOpen, setProfileEditOpen] = useState(false);
    const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
    const [reportStudentId, setReportStudentId] = useState('');
    const [isAddingSkill, setIsAddingSkill] = useState(false);
    
    // Grade Encoding States
    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
    const [gradingStudent, setGradingStudent] = useState(null);
    const [gradingSemester, setGradingSemester] = useState(1);
    const [gradingYear, setGradingYear] = useState('2024-2025');
    const [gradeInputs, setGradeInputs] = useState({});
    const [gradeSubmitting, setGradeSubmitting] = useState(false);
    const [gradeBatchValidation, setGradeBatchValidation] = useState([]);

    const gradeScaleMap = [
        { min: 97, max: 100, gwa: 1.00 },
        { min: 94, max: 96,  gwa: 1.25 },
        { min: 91, max: 93,  gwa: 1.50 },
        { min: 88, max: 90,  gwa: 1.75 },
        { min: 85, max: 87,  gwa: 2.00 },
        { min: 82, max: 84,  gwa: 2.25 },
        { min: 79, max: 81,  gwa: 2.50 },
        { min: 76, max: 78,  gwa: 2.75 },
        { min: 75, max: 75,  gwa: 3.00 },
        { min: 65, max: 74,  gwa: 4.00 },
        { min: 0,  max: 64,  gwa: 5.00 },
    ];

    const getGwaEquivalent = (score) => {
        if (!score || score === '--') return '--';
        const s = parseFloat(score);
        const match = gradeScaleMap.find(m => s >= m.min && s <= m.max);
        return match ? match.gwa.toFixed(2) : '5.00';
    };

    // Clearance States
    const [isClearanceModalOpen, setIsClearanceModalOpen] = useState(false);
    const [clearanceStudent, setClearanceStudent] = useState(null);
    const [allClearanceData, setAllClearanceData] = useState({});
    const [holdModalEntry, setHoldModalEntry] = useState(null);
    const [holdReason, setHoldReason] = useState('');
    const [holdNote, setHoldNote] = useState('');
    const [expandedDepts, setExpandedDepts] = useState([]);
    const [activityLog, setActivityLog] = useState([]);
    const [isLogOpen, setIsLogOpen] = useState(false);

    const getDeptRequirements = (name) => {
        const reqs = {
            'LIBRARY': ['No Overdue Books', 'Return Borrowed Laptop', 'Clear Fines'],
            'LABORATORY': ['Return Equipment', 'Clean Workspace', 'Inventory Check'],
            'ACCOUNTING': ['No Balance', 'Payment Receipt Verified'],
            'REGISTRAR': ['Official Transcript Verified', 'Enrollment Form Submitted'],
            'DEAN\'S OFFICE': ['Exit Interview', 'Grade Verification'],
            'ADVISER': ['Career Path Consulted', 'Semester Evaluation'],
            'GUIDANCE OFFICE': ['Exit Counseling', 'Psychological Test (Freshmen)']
        };
        return reqs[name.toUpperCase()] || ['Verify Documentation'];
    };

    const toggleDept = (deptName) => {
        setExpandedDepts(prev => 
            prev.includes(deptName) ? prev.filter(d => d !== deptName) : [...prev, deptName]
        );
    };

    
    const [toast, setToast] = useState(null);
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const skillForm = useForm({
        skill: '',
        proficiency: 'intermediate',
    });

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        student_id: '',
        subject: '',
        semester: 1,
        score: '',
    });

    const profileForm = useForm({
        course: '',
        major: '',
        year_level: '',
        academic_status: '',
    });

    // ── Handlers ──
    const handleFilter = (key, val) => {
        router.get(route('grades.index'), { ...filters, [key]: val, page: 1 }, { preserveState: true });
    };

    const studentRecommendations = useMemo(() =>
        recommendations?.[selectedStudent?.id] || [],
        [selectedStudent, recommendations]);

    const studentConduct = useMemo(() =>
        conductData?.[selectedStudent?.id] ?? null,
        [selectedStudent, conductData]);

    const openModal = (g = null) => {
        if (g) {
            setEditingGrade(g);
            setData({ student_id: g.student_id, subject: g.subject, semester: g.semester, score: g.score });
            const s = students.find(s => s.id === g.student_id);
            setModalSectionId(s?.section_id || '');
        } else {
            setEditingGrade(null);
            reset();
            setModalSectionId('');
        }
        setIsModalOpen(true);
    };


    const openGradeModal = async (student) => {
        setGradingStudent(student);
        try {
            const gridRes = await axios.get(`/grades/sections/${student.section_id}/encoding-grid`, {
                params: { student_id: student.id }
            });
            const currData = gridRes.data;
            const studentData = currData.students?.[0]; // Filtered by ID server-side
            
            const inputs = {};
            if (studentData && studentData.subjects) {
                studentData.subjects.forEach(sub => {
                    inputs[sub.subject_code] = {
                        id: sub.enrollment_id,
                        curriculum_course_id: sub.curriculum_course_id,
                        subject_code: sub.subject_code,
                        subject_name: sub.subject_name,
                        units: sub.units,
                        prelim: sub.prelim,
                        midterm: sub.midterm,
                        final: sub.final,
                        status: sub.status,
                        is_locked: sub.is_locked
                    };
                });
            }

            setGradingSemester(currData.semester);
            setGradingYear(currData.academic_year);
            setGradeInputs(inputs);
            setIsGradeModalOpen(true);
        } catch (e) { 
            console.error(e);
            showToast('Failed to load grades grid', 'error'); 
        }
    };

    const openClearanceModal = async (student) => {
        setClearanceStudent(student);
        try {
            const res = await axios.get(`/api/students/${student.id}/clearance`, {
                params: { semester: gradingSemester, academic_year: gradingYear }
            });
            setAllClearanceData(prev => ({ ...prev, [student.id]: res.data }));
            setIsClearanceModalOpen(true);
        } catch (e) { showToast('Failed to load clearance', 'error'); }
    };

    const handleUpdateClearance = async (id, action, data = {}) => {
        if (!id) {
            showToast('Clearance record not initialized', 'error');
            return;
        }
        try {
            if (action === 'hold') {
                await axios.patch(`/api/clearance-entries/${id}/hold`, { reason: data.reason, note: data.note });
            } else {
                await axios.patch(`/api/clearance-entries/${id}/${action}`);
            }
            const res = await axios.get(`/api/students/${clearanceStudent.id}/clearance`);
            setAllClearanceData(prev => ({ ...prev, [clearanceStudent.id]: res.data }));
            showToast(`Clearance ${action}ed`);
        } catch (e) {
            showToast('Update failed', 'error');
        }
    };

    const handleBack = () => {
        if (drillLevel === 'students') setDrillLevel('sections');
        else if (drillLevel === 'sections') setDrillLevel('programs');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const config = { onSuccess: () => { setIsModalOpen(false); reset(); } };
        editingGrade ? patch(route('grades.update', editingGrade.id), config) : post(route('grades.store'), config);
    };

    const confirmDelete = (id) => {
        destroy(route('grades.destroy', id), { onSuccess: () => setDeletingId(null) });
    };

    const handleSaveProgram = async (prog) => {
        try {
            await axios.post('/api/programs', prog);
            setIsCreateProgramOpen(false);
            // Refresh page to show new program
            router.reload({ only: ['students'] }); // Or just reload the whole page
            // showToast handled by response or just assume success for now as we don't have Toast in Grades/Index
        } catch (error) {
            console.error("Failed to create program:", error);
        }
    };

    const handleDeleteProgram = async (code) => {
        try {
            await axios.delete(`/api/programs/${code}`);
            setDeleteTarget(null);
            router.reload();
        } catch (error) {
            console.error("Failed to delete program:", error);
        }
    };

    // ── Drill-down Computations ──
    const programsList = useMemo(() => initialPrograms || [], [initialPrograms]);

    const activeProgramSections = useMemo(() => {
        if (!activeProgram) return [];
        return sections.filter(s => s.name.startsWith(activeProgram + '-') || s.name.startsWith(activeProgram + ' '));
    }, [sections, activeProgram]);

    const filteredRoster = useMemo(() => {
        if (!activeSection) return [];
        let base = students.filter(s => String(s.section_id) === String(activeSection.id));
        if (searchTerm) {
            const low = searchTerm.toLowerCase();
            base = base.filter(s => 
                s.first_name.toLowerCase().includes(low) || 
                s.last_name.toLowerCase().includes(low) || 
                s.student_id.toLowerCase().includes(low)
            );
        }
        return base;
    }, [students, activeSection, searchTerm]);

    const paginatedRoster = useMemo(() => {
        const start = (rosterPage - 1) * ROSTER_LIMIT;
        return filteredRoster.slice(start, start + ROSTER_LIMIT);
    }, [filteredRoster, rosterPage]);

    const totalRosterPages = Math.ceil(filteredRoster.length / ROSTER_LIMIT);

    useEffect(() => {
        setRosterPage(1);
    }, [activeSection, searchTerm]);

    // ── Computed Modal State ──
    const filteredStudents = useMemo(() => {
        if (!modalSectionId) return students;
        return students.filter(s => s.section_id == modalSectionId);
    }, [students, modalSectionId]);

    const liveRemarks = useMemo(() => {
        const s = parseInt(data.score);
        if (isNaN(s)) return null;
        if (s >= 90) return 'Excellent';
        if (s >= 80) return 'Very Good';
        if (s >= 75) return 'Satisfactory';
        if (s >= 65) return 'Needs Improvement';
        return 'Failed';
    }, [data.score]);

    // ── Drawer GWA Calculations ──
    const overallGwa = useMemo(() => {
        if (!studentSemesterRecords || !selectedStudent || !studentSemesterRecords[selectedStudent.id]) return 0;
        const records = studentSemesterRecords[selectedStudent.id];
        let totalWeightedGwa = 0;
        let totalUnits = 0;

        records.forEach(record => {
            const relevantSubjects = (record.subjects || []).filter(s => ['passed', 'failed'].includes(s.status));
            relevantSubjects.forEach(s => {
                totalUnits += Number(s.units);
                totalWeightedGwa += (Number(s.grade) * Number(s.units));
            });
        });

        return totalUnits > 0 ? (totalWeightedGwa / totalUnits).toFixed(2) : 0;
    }, [selectedStudent, studentSemesterRecords]);

    // ── Curriculum Progress State ──
    const [curriculumOpen, setCurriculumOpen] = useState(false);
    const [curriculumLoading, setCurriculumLoading] = useState(false);
    const [fullCurriculumMap, setFullCurriculumMap] = useState({});

    const fetchCurriculumProgress = async (studentId) => {
        setCurriculumLoading(true);
        try {
            const res = await axios.get(`/api/students/${studentId}/curriculum-progress`);
            setFullCurriculumMap(prev => ({ ...prev, [studentId]: res.data }));
        } catch (e) {
            console.error(e);
            showToast('Failed to load curriculum progress', 'error');
        } finally {
            setCurriculumLoading(false);
        }
    };

    useEffect(() => {
        if (curriculumOpen && selectedStudent) {
            fetchCurriculumProgress(selectedStudent.id);
        }
    }, [curriculumOpen, selectedStudent]);

    // ── Document State ──
    const [docDeletingId, setDocDeletingId] = useState(null);
    const docForm = useForm({
        document_type: '',
        document: null,
    });

    // ── Extracurricular Intelligence State ──
    const [viewMode, setViewMode] = useState('academic'); // academic | engagement
    const [leaderboardFilter, setLeaderboardFilter] = useState({
        course: filters.course || '',
        year_level: filters.year_level || '',
    });

    // ── Student Profiler State ──
    const [isProfilerOpen, setIsProfilerOpen] = useState(false);
    const [isProfilingLoading, setIsProfilingLoading] = useState(false);
    const [profilingResults, setProfilingResults] = useState(null);
    const [profilerFilters, setProfilerFilters] = useState({
        engagement_level: '',
        min_points: 0,
        has_leadership: false,
        has_awards: false,
        category_ids: [],
        activity_type: ''
    });

    const triggerAdvancedFilter = async () => {
        setIsProfilingLoading(true);
        try {
            const queryData = new URLSearchParams();
            if (profilerFilters.engagement_level) queryData.append('engagement_level', profilerFilters.engagement_level);
            if (profilerFilters.min_points > 0) queryData.append('min_points', profilerFilters.min_points);
            if (profilerFilters.has_leadership) queryData.append('has_leadership', 'true');
            if (profilerFilters.has_awards) queryData.append('has_awards', 'true');
            if (profilerFilters.activity_type) queryData.append('activity_type', profilerFilters.activity_type);
            profilerFilters.category_ids.forEach(id => queryData.append('category_ids[]', id));
            
            if (filters.course) queryData.append('course', filters.course);
            if (filters.year_level) queryData.append('year_level', filters.year_level);
            if (filters.academic_status) queryData.append('academic_status', filters.academic_status);

            const res = await fetch(route('students.advanced-filter') + '?' + queryData.toString());
            const json = await res.json();
            setProfilingResults(json.students);
        } catch (error) {
            console.error(error);
        } finally {
            setIsProfilingLoading(false);
            setIsProfilerOpen(false);
        }
    };

    const handleProfileCategoryToggle = (id) => {
        setProfilerFilters(prev => {
            if (prev.category_ids.includes(id)) {
                return { ...prev, category_ids: prev.category_ids.filter(cid => cid !== id) };
            }
            return { ...prev, category_ids: [...prev.category_ids, id] };
        });
    };

    const exportProfileString = () => {
        const queryData = new URLSearchParams();
        if (profilerFilters.engagement_level) queryData.append('engagement_level', profilerFilters.engagement_level);
        if (profilerFilters.min_points > 0) queryData.append('min_points', profilerFilters.min_points);
        if (profilerFilters.has_leadership) queryData.append('has_leadership', 'true');
        if (profilerFilters.has_awards) queryData.append('has_awards', 'true');
        if (profilerFilters.activity_type) queryData.append('activity_type', profilerFilters.activity_type);
        profilerFilters.category_ids.forEach(id => queryData.append('category_ids[]', id));
        if (filters.course) queryData.append('course', filters.course);
        if (filters.year_level) queryData.append('year_level', filters.year_level);
        return encodeURI(route('exports.profile') + '?' + queryData.toString());
    };


    const handleLeaderboardFilter = (key, val) => {
        setLeaderboardFilter(prev => ({ ...prev, [key]: val }));
        router.get(route('grades.index'), { ...filters, [key]: val }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDocUpload = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        docForm.data.document_type = type;
        docForm.data.document = file;

        docForm.post(route('student-documents.store', selectedStudent?.id), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                docForm.reset();
                e.target.value = null;
            },
            onError: () => {
                e.target.value = null;
            }
        });
    };

    const handleDeleteDoc = (id) => {
        if (docDeletingId === id) {
            router.delete(route('student-documents.destroy', id), {
                preserveScroll: true,
                onFinish: () => setDocDeletingId(null)
            });
        } else {
            setDocDeletingId(id);
            setTimeout(() => setDocDeletingId(null), 3000);
        }
    };

    const studentProgress = selectedStudent ? (fullCurriculumMap[selectedStudent.id] || { progress: {} }) : { progress: {} };
    const curriculumData = useMemo(() => {
        return Object.values(studentProgress.progress || {}).flatMap(sem => Object.values(sem)).flat();
    }, [studentProgress]);

    // Group curriculum by year_level → semester
    const curriculumGrouped = useMemo(() => {
        const byYear = {};
        curriculumData.forEach(sub => {
            const yr = sub.year_level;
            const sem = sub.semester;
            if (!byYear[yr]) byYear[yr] = {};
            if (!byYear[yr][sem]) byYear[yr][sem] = [];
            byYear[yr][sem].push(sub);
        });
        return byYear;
    }, [curriculumData]);

    const curriculumStats = useMemo(() => {
        const completed = curriculumData.filter(s => s.status === 'passed').length;
        return { total: curriculumData.length, completed: completed.length };
    }, [curriculumData]);

    // ── Added Subtle Stats Counter ──
    const subtleStats = useMemo(() => {
        return {
            alerts: students.filter(s => s.alerts && s.alerts.length > 0).length,
            deansList: students.filter(s => s.latin_honors || (s.academic_status === 'regular' && s.alerts?.length === 0)).length,
            graduated: students.filter(s => s.academic_status === 'graduated').length,
            probation: students.filter(s => s.academic_status === 'probation').length,
        };
    }, [students]);

    return (
        <AppLayout title="Academic Registry" noPadding>
            <Head title="Grade Registry" />
            <style>{css}</style>

            <div className="gr-root">
                <div className="gr-grid-tex" />
                <div className="gr-orb2" />

                <div className="gr-content">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <h1 style={{ fontFamily: 'Playfair Display', fontSize: 48, fontWeight: 900, italic: true, color: C.txt, lineHeight: 1.1, textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                                Academic <span style={{ color: C.orange, fontStyle: 'italic' }}>History</span>
                            </h1>
                            <p style={{ fontSize: 13, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.25em', marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span className="w-8 h-px bg-orange-500/50"></span>
                                College of Computing Studies · Official Academic Portal
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => router.visit(route('conduct.index'))} 
                                className="gr-btn-secondary"
                                style={{ borderColor: 'rgba(249,115,22,0.15)', color: C.orange }}
                            >
                                <ShieldAlert size={16} /> Conduct Registry
                            </button>
                            <button 
                                onClick={() => router.visit(route('clearance.index'))} 
                                className="gr-btn-secondary"
                                style={{ borderColor: 'rgba(16,185,129,0.15)', color: C.green }}
                            >
                                <CheckCircle size={16} /> Clearance
                            </button>
                            <button 
                                onClick={() => router.visit(route('leaderboard.index'))} 
                                className="gr-btn-secondary"
                                style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                            >
                                <Trophy size={16} className="text-amber-500" /> Leaderboard
                            </button>
                            <button onClick={() => setIsReportsModalOpen(true)} className="gr-btn-secondary">
                                <FileText size={16} /> Reports
                            </button>
                        </div>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex justify-center mb-12">
                        <div className="gr-segment">
                            <button
                                onClick={() => setViewMode('academic')}
                                className={`gr-seg-btn ${viewMode === 'academic' ? 'active' : ''}`}
                            >
                                Academic History
                            </button>
                            <button
                                onClick={() => setViewMode('engagement')}
                                className={`gr-seg-btn ${viewMode === 'engagement' ? 'active' : ''}`}
                            >
                                Engagement Leaderboard
                            </button>
                        </div>
                    </div>

                    {viewMode === 'academic' ? (
                        <>
                            {/* Summary Metrics */}
                            <div className="gr-metrics">
                                <div className="gr-stat-card">
                                    <Target size={40} className="gr-stat-icon" />
                                    <div className="gr-stat-lbl">Overall Average</div>
                                    <div className="gr-stat-val" style={{ color: getScoreColor(summary.average_score) }}>{summary.average_score}</div>
                                    <div style={{ fontSize: 10, color: C.muted }}>Weighted Mean (Current View)</div>
                                </div>
                                <div className="gr-stat-card">
                                    <Award size={40} className="gr-stat-icon" />
                                    <div className="gr-stat-lbl">Highest Performer</div>
                                    <div className="gr-stat-val" style={{ color: C.orange }}>{summary.highest_score?.score || 0}</div>
                                    <div style={{ fontSize: 10, color: C.muted, fontWeight: 700 }}>{summary.highest_score?.name || 'N/A'}</div>
                                </div>
                                <div className="gr-stat-card">
                                    <Rocket size={40} className="gr-stat-icon" />
                                    <div className="gr-stat-lbl">Avg Engagement</div>
                                    <div className="gr-stat-val" style={{ color: C.orange }}>{summary.avg_engagement || 0}</div>
                                    <div style={{ fontSize: 10, color: C.muted }}>Student Participation Depth</div>
                                </div>
                                <div className="gr-stat-card">
                                    <Trophy size={40} className="gr-stat-icon" />
                                    <div className="gr-stat-lbl">Lead Engagement</div>
                                    <div className="gr-stat-val" style={{ color: C.amber }}>{summary.top_engagement?.score || 0}</div>
                                    <div style={{ fontSize: 10, color: C.muted, fontWeight: 700 }}>{summary.top_engagement?.name || 'N/A'}</div>
                                </div>
                                <div className="gr-stat-card">
                                    <BarChart3 size={40} className="gr-stat-icon" />
                                    <div className="gr-stat-lbl">Passing Rate</div>
                                    <div className="gr-stat-val" style={{ color: C.green }}>
                                        {summary.total_records > 0 ? Math.round((summary.passing_count / summary.total_records) * 100) : 0}%
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full mt-2">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full"
                                            style={{ width: `${(summary.passing_count / summary.total_records) * 100}%`, transition: 'width 1s ease' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="gr-stat-card flex items-center justify-between py-6">
                                    <div className="flex items-center gap-4">
                                        <Users size={32} className="text-orange-500/50" />
                                        <div>
                                            <div className="gr-stat-lbl">Total Submissions</div>
                                            <div className="text-2xl font-black">{summary.total_records}</div>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <div className="gr-stat-lbl text-red-500"><ShieldAlert size={10} /> Conduct Alerts</div>
                                        <div className="text-2xl font-black text-red-500">{summary.active_conduct_alerts || 0}</div>
                                    </div>
                                </div>
                                <div className="gr-dist-box mb-0 flex-1 flex flex-col justify-center">
                                    <div className="flex justify-between items-center mb-1">
                                        <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', color: C.txt }}>Grade Distribution</span>
                                        <div className="flex gap-4 text-[10px] font-black italic">
                                            <span style={{ color: C.green }}>PASS: {summary.passing_count}</span>
                                            <span style={{ color: C.red }}>FAIL: {summary.failing_count}</span>
                                        </div>
                                    </div>
                                    <div className="gr-dist-bar">
                                        <div className="gr-dist-seg" style={{ width: `${(summary.passing_count / (summary.total_records || 1)) * 100}%`, background: C.green }} />
                                        <div className="gr-dist-seg" style={{ width: `${(summary.failing_count / (summary.total_records || 1)) * 100}%`, background: C.red }} />
                                    </div>
                                </div>
                            </div>

                            {/* Filters 2x2 Grid */}
                            <div className="gr-filters">
                                <div className="gr-filter-box">
                                    <Search size={16} color={C.orange} />
                                    <input
                                        className="gr-filter-el"
                                        placeholder="Search by Student Name or ID..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="gr-filter-box">
                                    <Layers size={16} color={C.orange} />
                                    <select
                                        className="gr-filter-el"
                                        value={filters.section_id || ''}
                                        onChange={e => handleFilter('section_id', e.target.value)}
                                    >
                                        <option value="">All Academic Sections</option>
                                        {sections.map(s => <option key={s.id} value={s.id}>{s.name} ({s.grade_level})</option>)}
                                    </select>
                                </div>
                                <div className="gr-filter-box">
                                    <User size={16} color={C.orange} />
                                    <select
                                        className="gr-filter-el"
                                        value={filters.student_id || ''}
                                        onChange={e => handleFilter('student_id', e.target.value)}
                                    >
                                        <option value="">Select Specific Student</option>
                                        {students.map(s => <option key={s.id} value={s.id}>{s.student_id} — {s.first_name} {s.last_name}</option>)}
                                    </select>
                                </div>
                                <div className="gr-filter-box">
                                    <Calendar size={16} color={C.orange} />
                                    <select
                                        className="gr-filter-el"
                                        value={filters.semester || ''}
                                        onChange={e => handleFilter('semester', e.target.value)}
                                    >
                                        <option value="">All Semesters</option>
                                        <option value="1">1st Semester</option>
                                        <option value="2">2nd Semester</option>
                                        <option value="3">Summer Session</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* Advanced Filter Button */}
                            <div className="flex justify-end mb-6">
                                <button 
                                    onClick={() => setIsProfilerOpen(true)} 
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl border border-orange-500/30 text-orange-500 hover:bg-orange-500/10 transition-all font-black uppercase text-[10px] tracking-widest cursor-pointer"
                                    style={{ backdropFilter: 'blur(12px)' }}
                                >
                                    <SlidersHorizontal size={14} className="text-orange-500" /> Advanced Student Profiling
                                </button>
                            </div>

                            {/* Profiling Results Horizontal Slider */}
                            {profilingResults && (
                                <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
                                    <div className="flex justify-between items-end mb-4">
                                        <h3 style={{ fontFamily: 'Playfair Display', fontSize: 28, fontWeight: 900, color: C.txt, letterSpacing: '-0.01em', fontStyle: 'italic' }}>
                                            Profiling Results <span className="text-orange-500">— {profilingResults.length} matches</span>
                                        </h3>
                                        <div className="flex gap-2">
                                            <a href={exportProfileString()} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 text-[10px] uppercase font-black tracking-widest border border-teal-500/20">
                                                <Save size={14} /> Export List
                                            </a>
                                            <button onClick={() => setProfilingResults(null)} className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scroll" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                        {profilingResults.map(p => (
                                            <div 
                                                key={p.id} 
                                                onClick={() => { setSelectedStudent(p); }} 
                                                className="snap-start flex-none w-[300px] gr-card p-5 cursor-pointer hover:border-orange-500/30 hover:shadow-[0_10px_30px_rgba(249,115,22,0.15)] group transition-all"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center font-black text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                                        {p.first_name[0]}{p.last_name[0]}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <div className="font-bold text-sm tracking-tight text-white">{p.first_name} {p.last_name}</div>
                                                            {p.ranking?.total_points > 0 && <span className="text-[10px] bg-orange-500 text-white font-black px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(249,115,22,0.5)]">{p.ranking.total_points}pt</span>}
                                                        </div>
                                                        <div className="text-[10px] font-mono text-orange-500/60 mt-1 uppercase tracking-widest">{p.course} • Year {p.year_level}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {profilingResults.length === 0 && (
                                            <div className="w-full py-8 text-center text-white/30 text-xs font-black uppercase tracking-widest">No students matched the profile.</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Drill-down Breadcrumb */}
                            <div className="flex items-center gap-3 mb-6 text-sm font-bold uppercase tracking-widest text-white/50 bg-black/20 p-4 rounded-xl border border-white/5 w-fit">
                                <button 
                                    onClick={() => { setDrillLevel('programs'); setActiveProgram(null); setActiveSection(null); }}
                                    className={`hover:text-orange-500 transition-colors ${drillLevel === 'programs' ? 'text-orange-500' : ''}`}
                                >
                                    Programs
                                </button>
                                {activeProgram && (
                                    <>
                                        <ChevronRight size={14} className="text-white/20" />
                                        <button 
                                            onClick={() => { setDrillLevel('sections'); setActiveSection(null); }}
                                            className={`hover:text-orange-500 transition-colors ${drillLevel === 'sections' ? 'text-orange-500' : ''}`}
                                        >
                                            {activeProgram}
                                        </button>
                                    </>
                                )}
                                {activeSection && (
                                    <>
                                        <ChevronRight size={14} className="text-white/20" />
                                        <span className="text-white">{activeSection.name}</span>
                                    </>
                                )}
                            </div>

                            {/* Level 1: Programs */}
                            {drillLevel === 'programs' && (
                                <div className="grid grid-cols-auto-fill min-[270px] gap-4 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))' }}>
                                    {programsList.map((program, idx) => (
                                        <div 
                                            key={idx}
                                            onClick={() => { setActiveProgram(program.name); setDrillLevel('sections'); }}
                                            className="group relative flex flex-col bg-[#1a1008] border border-orange-500/20 rounded-[20px] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_14px_34px_rgba(0,0,0,0.5)]"
                                        >
                                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 via-orange-400 to-transparent" />
                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="font-serif italic text-[40px] font-black text-white leading-none group-hover:text-orange-400 transition-colors">{program.name}</div>
                                                    <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                                        <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:bg-orange-500/20 hover:text-orange-500 transition-all border border-white/5">
                                                            <Edit size={12} />
                                                        </button>
                                                        <button 
                                                            onClick={() => setDeleteTarget({ type: 'program', code: program.name })}
                                                            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:bg-red-500/20 hover:text-red-500 transition-all border border-white/5"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] text-white/40 leading-relaxed flex-1 mb-4 uppercase">{program.fullName}</div>
                                                
                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                                        <Layers size={9} /> {program.sectionCount} SECTIONS
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        <Users size={9} /> {program.studentCount} STUDENTS
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                        CCS
                                                    </span>
                                                </div>
                                                
                                                <div className="h-[3px] bg-white/5 rounded-full overflow-hidden mb-4">
                                                    <div className="h-full bg-gradient-to-r from-orange-500/40 to-orange-500 transition-all duration-500" style={{ width: `${Math.min((program.sectionCount/10)*100, 100)}%` }} />
                                                </div>
                                                
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setActiveProgram(program.name); setDrillLevel('sections'); }} 
                                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-white/40 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-600 hover:text-white hover:border-transparent hover:shadow-[0_4px_14px_rgba(249,115,22,0.3)] group/btn"
                                                >
                                                    View Program Sections <ChevronRight size={12} className="transition-transform group-hover/btn:translate-x-1" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            )}

                            {/* Level 2: Sections */}
                            {drillLevel === 'sections' && (
                                <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500 mb-8">
                                    {YEAR_LEVELS.map((year, gi) => {
                                        const ys = activeProgramSections.filter(s => s.grade_level === year || s.grade_level === year.replace(' Year', ''));
                                        if (ys.length === 0) return null;
                                        
                                        return (
                                            <div key={year} className="ps-year-group" style={{ animationDelay: `${gi * 0.1}s` }}>
                                                <div className="ps-year-lbl">
                                                    {year}
                                                    <span className="ps-year-count">{ys.length} section{ys.length !== 1 ? 's' : ''}</span>
                                                </div>
                                                
                                                <div className="ps-sec-grid">
                                                    {ys.map((sec, idx) => {
                                                        const fillPct = Math.min((sec.students_count / 50) * 100, 100);
                                                        return (
                                                            <div key={sec.id} className="ps-sec-card" onClick={() => { setActiveSection(sec); setDrillLevel('students'); }}>
                                                                <div className="ps-sec-bar" />
                                                                <div className="ps-sec-body">
                                                                    <div className="ps-sec-name">{sec.name}</div>
                                                                    <div className="ps-sec-sy">{sec.school_year} · {sec.grade_level} Year</div>
                                                                    
                                                                    <div className="ps-sec-divider" />
                                                                    
                                                                    <div className="ps-sec-row">
                                                                        <div className="ps-sec-ico">
                                                                            <UserCircle size={16} className="text-orange-500/60" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="ps-sec-flbl">Adviser</div>
                                                                            <div className="ps-sec-fval">
                                                                                {sec.adviser?.name || <span className="text-white/20 italic text-[11px]">TBA</span>}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div className="ps-sec-row">
                                                                        <div className="ps-sec-ico">
                                                                            <Users size={16} className="text-orange-500/60" />
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <div className="ps-sec-flbl">Enrollment</div>
                                                                            <div className="ps-count-row">
                                                                                <span className="ps-sec-fval">{sec.students_count} students</span>
                                                                                <div className="ps-count-track">
                                                                                    <div className="ps-count-fill" style={{ width: `${fillPct}%` }} />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div className="ps-sec-footer">
                                                                        <button 
                                                                            onClick={(e) => { e.stopPropagation(); setActiveSection(sec); setDrillLevel('students'); }}
                                                                            className="ps-roster-btn"
                                                                        >
                                                                            Manage Roster <ChevronRight size={12} className="ml-1 opacity-40" />
                                                                        </button>
                                                                        <button 
                                                                            onClick={(e) => { e.stopPropagation(); router.visit(route('sections.index', { program: activeProgram })); }}
                                                                            className="ps-add-stu-btn"
                                                                        >
                                                                            <Plus size={14} /> Add
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

                                    {activeProgramSections.length === 0 && (
                                        <div className="col-span-4 p-20 text-center border-2 border-dashed border-white/10 rounded-3xl">
                                            <div className="text-lg font-black text-white/30 italic mb-2">No sections found</div>
                                            <div className="text-xs text-white/20 uppercase tracking-widest">No active sections mapped for {activeProgram}</div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Level 3: Students */}
                            {drillLevel === 'students' && activeSection && (
                                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 mb-8 max-w-[1300px] mx-auto relative">
                                    <div className="rv-grid-bg" />
                                    
                                    {/* Header Section (Inherited from RosterView) */}
                                    <div className="relative z-10">
                                        {/* Back Button */}
                                        <div className="mb-4">
                                            <button 
                                                onClick={() => setDrillLevel('sections')} 
                                                className="inline-flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-[0.1em] hover:text-orange-500 transition-colors"
                                            >
                                                <ArrowLeft size={12} /> {activeProgram} / Sections
                                            </button>
                                        </div>

                                        {/* Main Header Info */}
                                        <div className="flex items-end justify-between gap-6 flex-wrap">
                                            <div>
                                                <h1 className="rv-serif text-6xl italic text-orange-500 leading-none mb-5">{activeSection.name}</h1>
                                                <div className="flex items-center gap-3">
                                                    <div className="rv-tag bg-orange-500/10 text-orange-500 border border-orange-500/20">
                                                        <Layers size={10} /> {activeProgram}
                                                    </div>
                                                    <span className="text-white/20 font-bold">•</span>
                                                    <span className="text-[11px] font-bold text-white/40">{activeSection.grade_level} Year</span>
                                                    <span className="text-white/20 font-bold">•</span>
                                                    <span className="rv-mono text-[10px] text-white/30 uppercase">S.Y. {activeSection.school_year}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <StatCard icon={<Users size={14} />} label="ENROLLED" val={filteredRoster.length} />
                                                <StatCard icon={<UserPlus size={14} />} label="AVAILABLE" val={50 - filteredRoster.length} color={C.blue} bg="rgba(59,130,246,0.1)" />
                                                <StatCard icon={<Shield size={14} />} label="ADVISER" val={activeSection.adviser ? activeSection.adviser.name.split(' ').pop() : 'One'} color={C.green} bg="rgba(16,185,129,0.1)" />
                                            </div>
                                        </div>

                                        {/* Adviser Card */}
                                        <div className="rv-adv-card mt-8 bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex items-center justify-between transition-all hover:bg-white/[0.04] hover:border-white/10">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-xl bg-orange-500/5 border border-orange-500/10 flex items-center justify-center text-emerald-500">
                                                    <User size={24} />
                                                </div>
                                                <div>
                                                    <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">Section Adviser</div>
                                                    <div className="text-lg font-bold text-white">{activeSection.adviser?.name || 'No Adviser Assigned'}</div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => router.visit(route('sections.index', { program: activeProgram, section: activeSection.id }))}
                                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
                                            >
                                                Change <ChevronDown size={14} />
                                            </button>
                                        </div>

                                        {/* Roster Table */}
                                        <div className="mt-8 bg-[#131009] border border-white/[0.05] rounded-[24px] overflow-hidden shadow-2xl shadow-black">
                                            <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between bg-gradient-to-b from-white/[0.02] to-transparent">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                                                        <Users size={14} />
                                                    </div>
                                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Enrolled Students</span>
                                                    <span className="rv-mono px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-500 text-[10px] font-bold border border-orange-500/20">{filteredRoster.length}</span>
                                                </div>
                                                
                                                <div className="flex items-center gap-4">

                                                    <div className="relative">
                                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                                                        <input 
                                                            type="text" 
                                                            placeholder="Filter roster..." 
                                                            className="bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-white/20 focus:border-orange-500/50 transition-all outline-none w-64"
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col min-h-[400px]">
                                                {paginatedRoster.length > 0 ? paginatedRoster.map((student, idx) => (
                                                    <div key={student.id} className="rv-s-row flex items-center justify-between p-4 border-b border-white/[0.03] last:border-0 group bg-transparent">
                                                        <div className="flex items-center gap-4 flex-1">
                                                            <span className="rv-mono w-6 text-[10px] font-black text-white/20 text-right shrink-0">{String((rosterPage - 1) * ROSTER_LIMIT + idx + 1).padStart(2, '0')}</span>
                                                            <InitialsAvatar firstName={student.first_name} lastName={student.last_name} size={36} />
                                                            <div className="min-w-0 ml-2">
                                                                <div className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors uppercase tracking-tight flex items-center gap-2">
                                                                    <span className="truncate">{student.last_name}, {student.first_name}</span>
                                                                </div>
                                                                <div className="rv-mono text-[9px] text-white/20 mt-1 uppercase tracking-wider">{student.student_id}</div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <button 
                                                                onClick={() => openGradeModal(student)}
                                                                className="rv-action-btn"
                                                            >
                                                                <BookOpen size={12} /> Encode Grades
                                                            </button>
                                                            <button 
                                                                onClick={() => openClearanceModal(student)}
                                                                className="rv-action-btn emerald"
                                                            >
                                                                <CheckCircle size={12} /> Clearance
                                                            </button>
                                                            <button 
                                                                onClick={() => setSelectedStudent(student)}
                                                                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:bg-white/10 hover:text-white transition-all"
                                                            >
                                                                <ArrowUpRight size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )) : (
                                                    <div className="p-20 text-center bg-white/[0.01]">
                                                        <Users size={40} className="mx-auto mb-4 text-white/5" />
                                                        <div className="rv-serif text-xl italic text-white/20">No students found</div>
                                                    </div>
                                                )}
                                            </div>

                                             {/* Table Footer / Pagination */}
                                             <div className="px-6 py-4 border-t border-white/[0.05] flex items-center justify-between bg-black/20">
                                                 <div className="flex items-center gap-6">
                                                     <div className="flex items-center gap-2">
                                                         <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Limit</span>
                                                         <span className="rv-mono px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-orange-500">{ROSTER_LIMIT}</span>
                                                     </div>
                                                     <div className="w-px h-4 bg-white/10" />
                                                     <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                                                         Showing <span className="text-white/60">{(rosterPage - 1) * ROSTER_LIMIT + 1}-{Math.min(rosterPage * ROSTER_LIMIT, filteredRoster.length)}</span> of <span className="text-white/60">{filteredRoster.length}</span> entries
                                                     </div>
                                                 </div>

                                                 {totalRosterPages > 1 && (
                                                     <div className="flex items-center gap-2">
                                                         <PgBtn onClick={() => setRosterPage(p => Math.max(1, p - 1))} disabled={rosterPage === 1}>
                                                             <ChevronLeft size={14} />
                                                         </PgBtn>
                                                         <div className="rv-mono text-[11px] font-bold text-white/40 px-3">
                                                             {rosterPage} <span className="text-white/10 mx-1">/</span> {totalRosterPages}
                                                         </div>
                                                         <PgBtn onClick={() => setRosterPage(p => Math.min(totalRosterPages, p + 1))} disabled={rosterPage === totalRosterPages}>
                                                             <ChevronRight size={14} />
                                                         </PgBtn>
                                                     </div>
                                                 )}
                                             </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        /* ── Leaderboard View ── */
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-end mb-10">
                                <div>
                                    <h2 style={{ fontFamily: 'Playfair Display', fontSize: 48, fontWeight: 900, fontStyle: 'italic', color: C.txt, letterSpacing: '-0.02em', textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                                        Engagement <span style={{ color: C.orange }}>Leaderboard</span>
                                    </h2>
                                    <p style={{ fontSize: 11, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.25em', marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span className="w-6 h-px bg-orange-500/50"></span> Top 50 Students by Extracurricular Participation
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <select
                                        className="gr-input w-48"
                                        value={leaderboardFilter.course}
                                        onChange={e => handleLeaderboardFilter('course', e.target.value)}
                                    >
                                        <option value="">All Programs</option>
                                        {Array.from(new Set(students.map(s => s.course))).map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                    <select
                                        className="gr-input w-36"
                                        value={leaderboardFilter.year_level}
                                        onChange={e => handleLeaderboardFilter('year_level', e.target.value)}
                                    >
                                        <option value="">All Years</option>
                                        {[1, 2, 3, 4, 5].map(y => <option key={y} value={y}>{y}th Year</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="bg-black/40 border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/5 border-b border-white/5">
                                            <th className="p-6 text-[10px] font-black text-white/40 uppercase tracking-widest">Rank</th>
                                            <th className="p-6 text-[10px] font-black text-white/40 uppercase tracking-widest">Student Information</th>
                                            <th className="p-6 text-[10px] font-black text-white/40 uppercase tracking-widest text-center">Activities</th>
                                            <th className="p-6 text-[10px] font-black text-white/40 uppercase tracking-widest text-center">Leadership</th>
                                            <th className="p-6 text-[10px] font-black text-white/40 uppercase tracking-widest">Top Category</th>
                                            <th className="p-6 text-[10px] font-black text-white/40 uppercase tracking-widest text-right">Points</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.02]">
                                        {leaderboard.length > 0 ? leaderboard.map((entry) => {
                                            const isTop3 = entry.rank <= 3;
                                            const rankColor = entry.rank === 1 ? '#fbbf24' : entry.rank === 2 ? '#94a3b8' : entry.rank === 3 ? '#b45309' : C.txt;

                                            return (
                                                <tr key={entry.student_id} className="group hover:bg-white/[0.02] transition-colors">
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-3">
                                                            <span style={{
                                                                fontSize: isTop3 ? 24 : 14,
                                                                fontWeight: 900,
                                                                fontFamily: 'Space Mono',
                                                                color: rankColor,
                                                                opacity: isTop3 ? 1 : 0.4
                                                            }}>
                                                                #{entry.rank.toString().padStart(2, '0')}
                                                            </span>
                                                            {isTop3 && <Trophy size={18} style={{ color: rankColor }} />}
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-xs font-black text-white group-hover:bg-orange-500/20 group-hover:text-orange-500 transition-all border border-white/5 overflow-hidden">
                                                                <span className="opacity-40">{(entry.first_name || entry.full_name || '?')[0]}{(entry.last_name || '')[0]}</span>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-bold text-white uppercase tracking-tight mb-1">{entry.full_name}</div>
                                                                <div className="flex items-center gap-2">
                                                                    <span style={{ fontSize: 9, fontWeight: 900, color: C.orange }}>{entry.student_id}</span>
                                                                    <span style={{ fontSize: 9, color: C.dim }}>•</span>
                                                                    <span style={{ fontSize: 9, fontWeight: 900, color: C.muted }}>{entry.course} - Year {entry.year_level}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full">
                                                            <Zap size={10} className="text-orange-500" />
                                                            <span style={{ fontSize: 11, fontWeight: 900, color: C.txt }}>{entry.activity_count}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                                                            <ShieldAlert size={10} className="text-blue-500" />
                                                            <span style={{ fontSize: 11, fontWeight: 900, color: C.txt }}>{entry.leadership_count}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="px-3 py-1.5 bg-black/40 border border-white/5 rounded-xl w-fit">
                                                            <span style={{ fontSize: 9, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em' }}>{entry.top_category}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-6 text-right">
                                                        <div className="flex flex-col items-end">
                                                            <div style={{ fontSize: 22, fontWeight: 900, color: C.orange, fontFamily: 'Space Mono', lineHeight: 1 }}>{entry.total_points}</div>
                                                            <div style={{ fontSize: 9, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.05em', marginTop: 4 }}>Engagement: {entry.engagement_score}</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }) : (
                                            <tr>
                                                <td colSpan="6" className="p-20 text-center">
                                                    <div style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 24, color: C.muted }}>No leaderboard data found</div>
                                                    <div style={{ fontSize: 10, fontWeight: 900, color: C.dim, textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 8 }}>Try adjusting your filters or checking back later.</div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Student GWA Drawer ── */}
            <div className={`gr-drawer-overlay ${selectedStudent ? 'active' : ''}`} onClick={() => setSelectedStudent(null)} />
            <div className={`gr-drawer ${selectedStudent ? 'active' : ''}`}>
                <div className="flex justify-between items-start mb-10 relative">
                    {/* Decorative blurred blob for drawer */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/20 blur-[50px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10 w-full">
                        <div className="flex justify-between items-start mt-2">
                            <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/30 flex items-center justify-center text-2xl font-black text-orange-500 font-mono mb-6 italic shadow-[0_0_20px_rgba(249,115,22,0.15)] shadow-inner">
                                {selectedStudent?.first_name[0]}{selectedStudent?.last_name[0]}
                            </div>
                            <div className="flex items-center gap-3">
                                {selectedStudent && (
                                    <>
                                        <button 
                                            onClick={() => window.open(route('students.portfolio', selectedStudent.id), '_blank')}
                                            className="p-3.5 bg-transparent rounded-2xl border border-orange-500/40 text-orange-500 hover:bg-orange-500/10 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest backdrop-blur-md"
                                        >
                                            <FileText size={14} /> View Portfolio
                                        </button>
                                        <a href={route('exports.student-summary', selectedStudent.id)} target="_blank" rel="noreferrer" className="p-3.5 bg-white/5 rounded-2xl hover:bg-orange-500/20 hover:text-orange-500 transition-all text-white/60 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/5 hover:border-orange-500/30">
                                            <FileText size={16} /> PDF
                                        </a>
                                        <a href={route('exports.grade-report', filters)} className="p-3.5 bg-white/5 rounded-2xl hover:bg-teal-500/20 hover:text-teal-500 transition-all text-white/60 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/5 hover:border-teal-500/30">
                                            <Save size={16} /> Excel
                                        </a>
                                    </>
                                )}
                                <button onClick={() => setSelectedStudent(null)} className="p-3.5 bg-white/5 rounded-2xl hover:bg-red-500/20 hover:text-red-500 transition-all text-white/60 border border-white/5 hover:border-red-500/30 ml-2">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <h2 style={{ fontFamily: 'Playfair Display', fontSize: 32, fontWeight: 900, color: C.txt, letterSpacing: '-0.01em', fontStyle: 'italic', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                            {selectedStudent?.first_name} {selectedStudent?.last_name}
                        </h2>
                        <p style={{ fontSize: 10, fontWeight: 900, color: C.orange, letterSpacing: '.35em', textTransform: 'uppercase', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span className="w-4 h-px bg-orange-500/50"></span> Academic Portfolio
                        </p>
                    </div>
                </div>

                {selectedStudent?.alerts?.length > 0 && (
                    <div className="mb-8 space-y-3">
                        {selectedStudent.alerts.map((alert, idx) => {
                            const isHigh = alert.severity === 'high';
                            const isMed = alert.severity === 'medium';
                            const colors = isHigh ? { bg: `${C.red}15`, border: `${C.red}30`, text: C.red }
                                : isMed ? { bg: `${C.amber}15`, border: `${C.amber}30`, text: C.amber }
                                    : { bg: `${C.orange}10`, border: `${C.orange}20`, text: C.orange };

                            return (
                                <div key={idx} style={{ background: colors.bg, borderColor: colors.border }} className="p-4 border rounded-3xl flex items-start gap-4">
                                    <div className="mt-1 shrink-0" style={{ color: colors.text }}>
                                        <ShieldAlert size={20} />
                                    </div>
                                    <div>
                                        <div style={{ background: `${colors.text}20`, border: `1px solid ${colors.text}40`, color: colors.text, fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', padding: '3px 8px', borderRadius: 8, display: 'inline-block', marginBottom: 6 }}>
                                            {alert.type.replace(/_/g, ' ')}
                                        </div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: C.txt, lineHeight: 1.4 }}>
                                            {alert.message}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {selectedStudent?.latin_honors && (
                    <div className="mb-8 p-6 bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-3xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                            <Award size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.2em', color: '#fcd34d' }}>
                                Honors & Recognition
                            </h3>
                            <div style={{ fontFamily: 'Playfair Display', fontSize: 22, fontWeight: 900, color: C.amber, fontStyle: 'italic' }}>
                                {selectedStudent.latin_honors}
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-10">
                    {/* Row 1: Overall GWA | Section/ID */}
                    <div className="bg-black/30 border border-white/5 rounded-3xl p-6 relative group overflow-hidden">
                        <div style={{ fontSize: 9, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Overall GWA</div>
                        <div style={{ fontFamily: 'Playfair Display', fontSize: 32, fontWeight: 900, color: getGwaColor(overallGwa) }}>{overallGwa}</div>
                        <div style={{ fontSize: 9, fontWeight: 800, color: C.dim, marginTop: 4 }}>Weighted academic mean</div>
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-current"><Target size={80} /></div>
                    </div>
                    <div className="bg-black/30 border border-white/5 rounded-3xl p-6 flex flex-col justify-between relative group overflow-hidden">
                        <div>
                            <div style={{ fontSize: 9, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Program & Section</div>
                            <div style={{ fontSize: 13, fontWeight: 900, color: C.txt, lineHeight: 1.2 }}>{selectedStudent?.course || 'No Course'}</div>
                            <div style={{ fontSize: 10, fontWeight: 800, color: C.orange, marginTop: 2 }}>{selectedStudent?.section?.name}</div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <div style={{ fontSize: 9, fontWeight: 800, color: C.dim }}>{selectedStudent?.student_id}</div>
                            <button onClick={() => setProfileEditOpen(!profileEditOpen)} className="p-2 bg-white/5 hover:bg-orange-500/20 hover:text-orange-500 rounded-xl transition-all text-white/40"><Edit size={14} /></button>
                        </div>
                    </div>

                    {/* Row 2: Activity Points | Campus Rank */}
                    <div className="bg-black/30 border border-white/5 rounded-3xl p-6 relative group overflow-hidden">
                        <div style={{ fontSize: 9, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Activity Points</div>
                        <div style={{ fontFamily: 'Playfair Display', fontSize: 32, fontWeight: 900, color: C.amber }}>{studentRankings?.[selectedStudent?.id]?.total_points ?? 0}</div>
                        <div style={{ fontSize: 9, fontWeight: 800, color: C.dim, marginTop: 4 }}>Total engagement points</div>
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-amber-500"><Zap size={80} /></div>
                    </div>
                    <div className="bg-black/30 border border-white/5 rounded-3xl p-6 relative group overflow-hidden">
                        <div style={{ fontSize: 9, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Campus Rank</div>
                        <div style={{ fontFamily: 'Playfair Display', fontSize: 32, fontWeight: 900, color: C.orange }}>#{studentRankings?.[selectedStudent?.id]?.rank ?? '—'}</div>
                        <div style={{ fontSize: 9, fontWeight: 800, color: C.dim, marginTop: 4 }}>Global student rank</div>
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-orange-500"><Trophy size={80} /></div>
                    </div>

                    {/* Row 3: Behavior Score | Clearance Status */}
                    <div className="bg-black/30 border border-white/5 rounded-3xl p-6 relative group overflow-hidden">
                        <div style={{ fontSize: 9, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Behavior Score</div>
                        <div style={{ fontFamily: 'Playfair Display', fontSize: 32, fontWeight: 900, color: conductData?.[selectedStudent?.id]?.score?.score_color || C.dim }}>
                            {conductData?.[selectedStudent?.id]?.score?.total_score ?? '—'}
                        </div>
                        <div style={{ fontSize: 9, fontWeight: 800, color: C.dim, marginTop: 4 }}>
                            Status: <span style={{ color: conductData?.[selectedStudent?.id]?.score?.score_status?.replace('_', ' ') || 'Pending' }}>{conductData?.[selectedStudent?.id]?.score?.score_status?.replace('_', ' ') || 'Pending'}</span>
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-current"><Shield size={80} /></div>
                    </div>
                    <div className="bg-black/30 border border-white/5 rounded-3xl p-6 relative group overflow-hidden">
                        <div style={{ fontSize: 9, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Clearance Status</div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: conductData?.[selectedStudent?.id]?.clearance?.status_color || C.dim, textTransform: 'uppercase', letterSpacing: '.05em', marginTop: 4 }}>
                            {conductData?.[selectedStudent?.id]?.clearance?.status_label || 'Evaluating'}
                        </div>
                        <div style={{ fontSize: 9, fontWeight: 800, color: C.dim, marginTop: 6 }} className="italic">
                            {conductData?.[selectedStudent?.id]?.clearance?.hold_reason || 'No active holds'}
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-current"><FileCheck size={80} /></div>
                    </div>
                </div>

                {/* ── Conduct & Behavior ── */}
                <div className="mt-10 pt-10 border-t border-white/10 mb-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shadow-inner">
                                <Shield size={18} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.2em', color: C.txt }}>
                                    Conduct Overview
                                </h3>
                                <p style={{ fontSize: 9, fontWeight: 800, color: C.dim, textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 2 }}>
                                    Disciplinary & Clearance Details
                                </p>
                            </div>
                        </div>
                        {studentConduct?.clearance?.status === 'cleared' && (
                            <div style={{ background: `${C.green}15`, border: `1px solid ${C.green}30`, color: C.green, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', padding: '6px 12px', borderRadius: 12, letterSpacing: '.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <CheckCircle size={14} /> Fully Cleared
                            </div>
                        )}
                        {studentConduct?.clearance?.status === 'hold' && (
                            <div style={{ background: `${C.red}15`, border: `1px solid ${C.red}30`, color: C.red, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', padding: '6px 12px', borderRadius: 12, letterSpacing: '.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Lock size={14} /> Academically Held
                            </div>
                        )}
                        {studentConduct?.clearance?.status === 'under_disciplinary_action' && (
                            <div style={{ background: `${C.orange}15`, border: `1px solid ${C.orange}30`, color: C.orange, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', padding: '6px 12px', borderRadius: 12, letterSpacing: '.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <AlertTriangle size={14} /> Disciplinary Prob.
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <div style={{ fontSize: 9, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em' }}>Detailed Intelligence</div>
                        <button 
                            onClick={() => router.visit(route('conduct.student', { student: selectedStudent.id }))}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                            View Full Timeline <ArrowUpRight size={14} />
                        </button>
                    </div>

                    {/* Category Breakdown Mini */}
                    {studentConduct?.category_summary?.length > 0 && (
                        <div className="mb-8 bg-black/20 border border-white/5 rounded-2xl p-5">
                            <div style={{ fontSize: 9, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>Incident Proportions</div>
                            <div className="w-full h-1 rounded-full overflow-hidden flex bg-white/5 mb-3">
                                {studentConduct.category_summary.map((cat, idx) => {
                                    const total = studentConduct.category_summary.reduce((acc, c) => acc + c.count, 0);
                                    const width = (cat.count / total) * 100 + '%';
                                    return <div key={idx} style={{ width, background: cat.color }} title={`${cat.category}: ${cat.count}`} />
                                })}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {[...studentConduct.category_summary].sort((a,b)=>b.count - a.count).slice(0, 2).map((cat, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/60 border border-white/5">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: cat.color }} />
                                        {cat.category.replace(/_/g, ' ')}: {cat.count}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Unresolved Alerts Strip */}
                    {studentConduct?.unresolvedAlerts?.length > 0 && (
                        <div className="space-y-3 mb-8">
                            <div style={{ fontSize: 10, fontWeight: 900, color: C.orange, textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 8 }}>Active Conduct Alerts</div>
                            {studentConduct.unresolvedAlerts.map(alert => {
                                const isCritical = alert.severity === 'critical';
                                const isHigh = alert.severity === 'high';
                                const cBg = isCritical ? `${C.red}15` : isHigh ? `${C.orange}15` : `${C.amber}15`;
                                const cBorder = isCritical ? `${C.red}30` : isHigh ? `${C.orange}30` : `${C.amber}30`;
                                const cTxt = isCritical ? C.red : isHigh ? C.orange : C.amber;

                                return (
                                    <div key={alert.id} className="p-4 rounded-[20px] flex items-start gap-4" style={{ background: cBg, border: `1px solid ${cBorder}` }}>
                                        <div className="mt-1" style={{ color: cTxt }}><ShieldAlert size={18} /></div>
                                        <div>
                                            <div style={{ fontSize: 9, fontWeight: 900, color: cTxt, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }} className="bg-black/20 inline-block px-2 py-0.5 rounded-md">{alert.type.replace(/_/g, ' ')}</div>
                                            <div style={{ fontSize: 12, fontWeight: 700, color: C.txt, lineHeight: 1.4 }}>{alert.message}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Recent Logs List */}
                    {studentConduct?.recentLogs?.length > 0 && (
                        <div>
                            <div style={{ fontSize: 10, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 12 }}>Recent Log Entries</div>
                            <div className="space-y-3">
                                {studentConduct.recentLogs.map(log => {
                                    const isViolation = log.type === 'violation';
                                    const logColor = isViolation ? C.red : C.green;
                                    
                                    return (
                                        <div key={log.id} className="bg-black/40 border border-white/5 rounded-[24px] p-5 flex items-center justify-between hover:bg-white/[0.03] transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-transform" style={{ background: `${logColor}15`, color: logColor, border: `1px solid ${logColor}30` }}>
                                                    {isViolation ? <AlertOctagon size={16} /> : <Award size={16} />}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-white uppercase tracking-tight">{log.category.replace(/_/g, ' ')}</div>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <span style={{ fontSize: 9, fontWeight: 900, color: logColor, textTransform: 'uppercase' }}>{log.severity} Severity</span>
                                                        <span style={{ fontSize: 9, color: C.dim }}>•</span>
                                                        <span style={{ fontSize: 9, fontWeight: 800, color: C.muted }}>{new Date(log.date || log.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div style={{ fontSize: 16, fontWeight: 900, color: logColor, fontFamily: 'Space Mono' }}>
                                                    {log.points > 0 ? `+${log.points}` : log.points}
                                                </div>
                                                <div style={{ fontSize: 8, fontWeight: 900, color: C.muted, textTransform: 'uppercase', marginTop: 2 }}>Points</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {profileEditOpen && (
                    <div className="mb-4 bg-black/40 border border-orange-500/30 rounded-3xl p-5 relative">
                        <div style={{ fontSize: 10, fontWeight: 900, color: C.orange, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>Modify Academic Profile</div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            profileForm.put(route('student-profile.update', selectedStudent.id), {
                                onSuccess: () => setProfileEditOpen(false),
                                preserveScroll: true
                            });
                        }}>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div>
                                    <label style={{ fontSize: 9, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.05em' }}>Course Program</label>
                                    <input className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white mt-1 outline-none focus:border-orange-500 focus:bg-orange-500/10" value={profileForm.data.course} onChange={e => profileForm.setData('course', e.target.value)} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 9, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.05em' }}>Major (Options)</label>
                                    <input className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white mt-1 outline-none focus:border-orange-500 focus:bg-orange-500/10" value={profileForm.data.major} onChange={e => profileForm.setData('major', e.target.value)} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 9, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.05em' }}>Year Level</label>
                                    <select className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white mt-1 outline-none focus:border-orange-500 focus:bg-orange-500/10" value={profileForm.data.year_level} onChange={e => profileForm.setData('year_level', e.target.value)}>
                                        <option value="1">1st Year</option>
                                        <option value="2">2nd Year</option>
                                        <option value="3">3rd Year</option>
                                        <option value="4">4th Year</option>
                                        <option value="5">5th Year</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: 9, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.05em' }}>Status</label>
                                    <select className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white mt-1 outline-none focus:border-orange-500 focus:bg-orange-500/10" value={profileForm.data.academic_status} onChange={e => profileForm.setData('academic_status', e.target.value)}>
                                        <option value="regular">Regular</option>
                                        <option value="irregular">Irregular</option>
                                        <option value="probation">Probation</option>
                                        <option value="graduated">Graduated</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setProfileEditOpen(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/50 transition-all">Cancel</button>
                                <button type="submit" disabled={profileForm.processing} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-orange-500/30 transition-all">{profileForm.processing ? 'Saving...' : 'Save Profile'}</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-black/30 border border-white/5 rounded-3xl p-6">
                        <div style={{ fontSize: 9, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Year Level</div>
                        <div style={{ fontSize: 20, fontWeight: 900, color: C.txt, fontFamily: 'Playfair Display', fontStyle: 'italic' }}>
                            {selectedStudent?.year_level ? `${selectedStudent.year_level}${['st', 'nd', 'rd', 'th'][selectedStudent.year_level - 1] || 'th'} Year` : 'N/A'}
                        </div>
                    </div>
                    <div className="bg-black/30 border border-white/5 rounded-3xl p-6">
                        <div style={{ fontSize: 9, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Status</div>
                        <div
                            className="gr-remarks-badge"
                            style={{
                                background: `${C[selectedStudent?.academic_status_color] || C.dim}15`,
                                borderColor: `${C[selectedStudent?.academic_status_color] || C.dim}30`,
                                color: C[selectedStudent?.academic_status_color] || C.dim,
                                padding: '6px 12px',
                                fontSize: 10
                            }}
                        >
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: C[selectedStudent?.academic_status_color] || C.dim }} />
                            {selectedStudent?.academic_status}
                        </div>
                    </div>

                </div>



                {/* ── Skills & Competencies ── */}
                <div className="mb-10 pt-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Brain size={14} className="text-orange-500" />
                            <h3 style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.2em', color: C.orange }}>
                                Skills & Competencies
                            </h3>
                        </div>
                        <button 
                            onClick={() => setIsAddingSkill(!isAddingSkill)}
                            className="text-[10px] font-black text-orange-500/60 hover:text-orange-500 uppercase tracking-widest flex items-center gap-1 transition-colors"
                        >
                            <Plus size={12} /> {isAddingSkill ? 'Cancel' : 'Add Skill'}
                        </button>
                    </div>

                    {isAddingSkill && (
                        <div className="mb-6 animate-in slide-in-from-top-2 duration-300">
                            <form 
                                className="flex gap-2 p-3 bg-black/40 border border-orange-500/20 rounded-2xl"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    skillForm.post(route('student-skills.store', selectedStudent.id), {
                                        preserveScroll: true,
                                        onSuccess: () => {
                                            skillForm.reset();
                                            setIsAddingSkill(false);
                                        }
                                    });
                                }}
                            >
                                <input 
                                    className="flex-1 bg-transparent border-none outline-none text-xs font-bold text-white px-2"
                                    placeholder="Skill name (e.g. React, Python)"
                                    value={skillForm.data.skill}
                                    onChange={e => skillForm.setData('skill', e.target.value)}
                                    required
                                />
                                <select 
                                    className="bg-white/5 border-none outline-none text-[9px] font-black text-white/60 uppercase rounded-xl px-3 h-8"
                                    value={skillForm.data.proficiency}
                                    onChange={e => skillForm.setData('proficiency', e.target.value)}
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                                <button 
                                    type="submit" 
                                    disabled={skillForm.processing}
                                    className="px-4 h-8 bg-orange-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all"
                                >
                                    Save
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                        {(studentSemesterRecords?.[selectedStudent?.id]?.skills || selectedStudent?.student_skills || []).map((s, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/5 py-2 px-3 rounded-2xl group hover:border-orange-500/30 transition-all">
                                <div className="text-xs font-bold text-white uppercase tracking-tight">{s.skill.replace(/_/g, ' ')}</div>
                                <div style={{
                                    fontSize: 8,
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    padding: '2px 6px',
                                    borderRadius: 6,
                                    background: s.proficiency === 'advanced' ? `${C.green}15` : s.proficiency === 'intermediate' ? `${C.amber}15` : `${C.dim}10`,
                                    color: s.proficiency === 'advanced' ? C.green : s.proficiency === 'intermediate' ? C.amber : C.muted,
                                    border: '1px solid currentColor'
                                }}>
                                    {s.proficiency}
                                </div>
                            </div>
                        ))}
                        {(!studentSemesterRecords?.[selectedStudent?.id]?.skills && !selectedStudent?.student_skills?.length) && (
                            <div style={{ fontSize: 10, fontWeight: 700, fontStyle: 'italic', color: C.dim, padding: '10px 0' }}>No skills recorded yet.</div>
                        )}
                    </div>
                </div>

                {/* ── Suggested for You ── */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-6">
                        <Sparkles size={14} className="text-orange-500" />
                        <h3 style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.2em', color: C.orange }}>
                            Suggested for You
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {studentRecommendations.length > 0 ? studentRecommendations.map((rec, i) => {
                            const barColor = rec.match_score >= 80 ? C.green : rec.match_score >= 50 ? C.amber : C.orange;

                            return (
                                <div key={i} className="bg-black/30 border border-white/5 rounded-[24px] p-5 relative group hover:border-orange-500/20 transition-all">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full mt-1.5" style={{ background: rec.category_color }} />
                                            <div>
                                                <div style={{ fontSize: 14, fontWeight: 700, color: C.txt, marginBottom: 2 }}>{rec.name}</div>
                                                <div className="inline-block px-2 py-0.5 bg-white/5 rounded-full text-[8px] font-black text-white/40 uppercase tracking-widest">
                                                    {rec.activity_type}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ padding: '4px 10px', background: `${C.amber}15`, border: `1px solid ${C.amber}30`, borderRadius: 10, fontSize: 9, fontWeight: 900, color: C.amber }}>
                                            +{rec.base_points} PTS
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden mb-1.5">
                                            <div
                                                className="h-full transition-all duration-1000"
                                                style={{ width: `${rec.match_score}%`, background: barColor }}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div style={{ fontSize: 9, fontWeight: 800, color: C.muted }}>Match Score: {rec.match_score}%</div>
                                            <div style={{ fontSize: 8, fontWeight: 900, color: barColor, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                                                {rec.match_score >= 80 ? 'Perfect Match' : rec.match_score >= 50 ? 'Strong Potential' : 'New Opportunity'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        {(rec.reasons || []).map((reason, ri) => (
                                            <div key={ri} style={{ fontSize: 10, fontWeight: 500, color: C.dim, fontStyle: 'italic' }}>
                                                › {reason}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        }) : (
                            <div style={{ fontSize: 11, fontWeight: 500, fontStyle: 'italic', color: C.muted, textAlign: 'center', padding: '20px' }}>
                                No new activities to suggest — this student is highly engaged!
                            </div>
                        )}
                    </div>
                </div>


                {/* ── Recent Engagement History ── */}
                <div className="mt-10 pt-10 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                            <Rocket size={18} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.2em', color: C.txt }}>
                                Recent Engagement History
                            </h3>
                            <p style={{ fontSize: 9, fontWeight: 800, color: C.dim, textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 2 }}>
                                Detailed Participation Log
                            </p>
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div style={{ fontSize: 10, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.15em' }}>Extracurricular History</div>
                        </div>
                        <div className="space-y-3">
                            {selectedStudent?.student_activities?.length > 0 ? selectedStudent.student_activities.map((a, i) => (
                                <div key={i} className="bg-black/30 border border-white/5 rounded-3xl p-5 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-inner" style={{ background: `${a.activity?.category?.color || C.orange}15`, color: a.activity?.category?.color || C.orange }}>
                                            <Zap size={18} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white uppercase tracking-tight">{a.activity?.name}</div>
                                            <div className="flex items-center gap-2">
                                                <span style={{ fontSize: 9, fontWeight: 900, color: C.dim, textTransform: 'uppercase' }}>{a.activity?.category?.name}</span>
                                                <span style={{ fontSize: 9, color: C.dim }}>•</span>
                                                <span style={{ fontSize: 9, fontWeight: 900, color: C.orange, textTransform: 'uppercase' }}>{a.role}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div style={{ fontSize: 13, fontWeight: 900, color: C.green, fontFamily: 'Space Mono' }}>+{a.points_awarded}</div>
                                        <div style={{ fontSize: 8, fontWeight: 900, color: C.muted, textTransform: 'uppercase' }}>Awd. Pts</div>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ fontSize: 10, fontWeight: 700, fontStyle: 'italic', color: C.dim, padding: '16px', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: 20, textAlign: 'center' }}>No recent extracurricular engagements.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Semester Breakdown ── */}
                <div className="mt-16 pt-10 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                            <BookOpen size={18} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.2em', color: C.txt }}>
                                Semester Breakdown
                            </h3>
                            <p style={{ fontSize: 9, fontWeight: 800, color: C.dim, textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 2 }}>
                                Authenticated Transcript Mirror
                            </p>
                        </div>
                    </div>

                    {selectedStudent && studentSemesterRecords?.[selectedStudent.id] && studentSemesterRecords[selectedStudent.id].length > 0 ? (
                        <div className="space-y-12">
                            {studentSemesterRecords[selectedStudent.id].map(record => {
                                const relevantSubjects = (record.subjects || []).filter(s => ['passed', 'failed'].includes(s.status));
                                const totalUnits = relevantSubjects.reduce((acc, s) => acc + Number(s.units), 0);
                                const semGwa = totalUnits > 0 ? relevantSubjects.reduce((acc, s) => acc + (Number(s.grade) * Number(s.units)), 0) / totalUnits : 0;

                                const getSubjectGradeColor = (status) => {
                                    switch (status) {
                                        case 'passed': return C.green;
                                        case 'failed': return C.red;
                                        case 'ongoing': return C.amber;
                                        case 'dropped': return C.muted;
                                        default: return C.dim;
                                    }
                                };

                                const getStatusBadge = (status) => {
                                    const map = {
                                        passed: { bg: `${C.green}15`, bdr: `${C.green}30`, c: C.green, label: 'Passed' },
                                        failed: { bg: `${C.red}15`, bdr: `${C.red}30`, c: C.red, label: 'Failed' },
                                        ongoing: { bg: `${C.amber}15`, bdr: `${C.amber}30`, c: C.amber, label: 'Ongoing' },
                                        dropped: { bg: `${C.muted}10`, bdr: `${C.muted}20`, c: C.muted, label: 'Dropped' },
                                    };
                                    return map[status] || { bg: C.faint, bdr: C.faint, c: C.dim, label: status || '—' };
                                };

                                return (
                                    <div key={record.id}>
                                        <div className="flex justify-between items-end mb-6">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <div style={{ fontSize: 9, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.15em' }}>
                                                        {record.semester === 1 ? '1ST SEMESTER' : record.semester === 2 ? '2ND SEMESTER' : 'SUMMER SESSION'}
                                                    </div>
                                                    {record.honors_eligibility === 'deans_list' && (
                                                        <div style={{ background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)', color: '#14b8a6', fontSize: 8, fontWeight: 900, textTransform: 'uppercase', padding: '2px 8px', borderRadius: 8, letterSpacing: '.1em' }}>
                                                            Dean's List
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: 20, fontWeight: 900, color: C.txt, fontFamily: 'Playfair Display', fontStyle: 'italic' }}>{record.academic_year}</div>
                                            </div>
                                            <div className="text-right">
                                                <div style={{ fontSize: 9, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 4 }}>Weighted GWA</div>
                                                <div style={{ fontSize: 28, fontWeight: 900, color: semGwa > 0 ? getGwaColor(semGwa) : C.dim, fontFamily: 'Playfair Display', lineHeight: 1 }}>
                                                    {semGwa > 0 ? semGwa.toFixed(2) : '--'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-black/40 border border-white/5 rounded-[32px] overflow-hidden">
                                            <div className="grid grid-cols-[1fr,60px,70px,100px] gap-2 p-5 bg-white/5 border-b border-white/5 items-center">
                                                <div style={{ fontSize: 9, fontWeight: 900, color: C.dim, textTransform: 'uppercase', letterSpacing: '.1em' }}>Subject</div>
                                                <div style={{ fontSize: 9, fontWeight: 900, color: C.dim, textTransform: 'uppercase', letterSpacing: '.1em' }}>Units</div>
                                                <div style={{ fontSize: 9, fontWeight: 900, color: C.dim, textTransform: 'uppercase', letterSpacing: '.1em' }}>Grade</div>
                                                <div style={{ fontSize: 9, fontWeight: 900, color: C.dim, textTransform: 'uppercase', letterSpacing: '.1em', textAlign: 'right' }}>Status</div>
                                            </div>
                                            <div className="divide-y divide-white/5">
                                                {(record.subjects || []).map(subject => {
                                                    const badge = getStatusBadge(subject.status);
                                                    return (
                                                        <div key={subject.id} className="grid grid-cols-[1fr,60px,70px,100px] gap-2 p-5 items-center hover:bg-white/[0.03] transition-colors group">
                                                            <div>
                                                                <div className="text-[13px] font-bold text-white mb-1 group-hover:text-orange-500 transition-colors uppercase tracking-tight">{subject.subject_name}</div>
                                                                <div className="flex items-center gap-3">
                                                                    <span style={{ fontSize: 10, fontWeight: 900, color: C.dim, fontFamily: 'Space Mono' }}>{subject.subject_code}</span>
                                                                    {subject.is_retake && (
                                                                        <div style={{ background: `${C.orange}20`, border: `1px solid ${C.orange}40`, color: C.orange, fontSize: 8, fontWeight: 900, textTransform: 'uppercase', padding: '1px 6px', borderRadius: 6, letterSpacing: '.05em' }}>Retake</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <span style={{ background: `${C.orange}12`, border: `1px solid ${C.orange}25`, color: C.o3, fontSize: 10, fontWeight: 900, padding: '3px 8px', borderRadius: 8 }}>{subject.units}u</span>
                                                            </div>
                                                            <div style={{
                                                                fontSize: 16,
                                                                fontWeight: 900,
                                                                fontFamily: 'Space Mono',
                                                                color: getSubjectGradeColor(subject.status)
                                                            }}>
                                                                {subject.grade ? Number(subject.grade).toFixed(2) : '--'}
                                                            </div>
                                                            <div className="flex justify-end">
                                                                <div
                                                                    style={{
                                                                        fontSize: 9,
                                                                        fontWeight: 900,
                                                                        textTransform: 'uppercase',
                                                                        letterSpacing: '.05em',
                                                                        padding: '4px 10px',
                                                                        borderRadius: 8,
                                                                        border: '1px solid',
                                                                        background: badge.bg,
                                                                        borderColor: badge.bdr,
                                                                        color: badge.c
                                                                    }}
                                                                >
                                                                    {badge.label}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-black/30 border border-white/5 border-dashed rounded-3xl p-12 text-center opacity-30">
                            <div style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 20, color: C.txt, marginBottom: 8 }}>No Transcripts Found</div>
                            <div style={{ fontSize: 10, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em' }}>This student does not have any recorded semester records in the new registry.</div>
                        </div>
                    )}
                </div>

                {/* ── Curriculum Progress ── */}
                <div className="mt-10 pt-10 border-t border-white/10 pb-24">
                    {/* Section header + toggle button */}
                    <button
                        className="gr-curr-toggle mb-6"
                        onClick={() => setCurriculumOpen(o => !o)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                                <ListChecks size={16} />
                            </div>
                            <div className="text-left">
                                <div style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.2em', color: C.txt }}>Curriculum Progress</div>
                                {curriculumData.length > 0 && (
                                    <div style={{ fontSize: 9, fontWeight: 800, color: C.green, marginTop: 2 }}>
                                        {curriculumStats.completed} / {curriculumStats.total} required subjects completed
                                    </div>
                                )}
                            </div>
                        </div>
                        <ChevronDown
                            size={18}
                            style={{
                                color: C.muted,
                                transform: curriculumOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform .25s'
                            }}
                        />
                    </button>

                    {curriculumOpen && (
                        <div className="gr-curr-body">
                            {curriculumLoading ? (
                                <div style={{ textAlign: 'center', padding: '32px', fontSize: 11, fontWeight: 700, color: C.dim, textTransform: 'uppercase', letterSpacing: '.1em' }}>
                                    Loading curriculum…
                                </div>
                            ) : curriculumData.length === 0 ? (
                                <div className="bg-black/30 border border-white/5 border-dashed rounded-3xl p-10 text-center opacity-40">
                                    <div style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 18, color: C.txt, marginBottom: 6 }}>No Curriculum Data</div>
                                    <div style={{ fontSize: 9, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em' }}>No subjects found for this program.</div>
                                </div>
                            ) : (
                                <>
                                    {/* Progress bar */}
                                    <div className="mb-8 bg-black/30 border border-white/5 rounded-2xl p-5">
                                        <div className="flex justify-between items-center mb-3">
                                            <span style={{ fontSize: 10, fontWeight: 900, color: C.txt, textTransform: 'uppercase', letterSpacing: '.1em' }}>Overall Completion</span>
                                            <span style={{ fontSize: 13, fontWeight: 900, fontFamily: 'Playfair Display', color: C.green }}>
                                                {curriculumStats.completed}<span style={{ fontSize: 9, color: C.muted }}> / {curriculumStats.total}</span>
                                            </span>
                                        </div>
                                        <div className="gr-curr-prog-track">
                                            <div
                                                className="gr-curr-prog-fill"
                                                style={{ width: curriculumStats.total > 0 ? `${(curriculumStats.completed / curriculumStats.total) * 100}%` : '0%' }}
                                            />
                                        </div>
                                        <div className="flex gap-4 mt-3" style={{ fontSize: 9, fontWeight: 800 }}>
                                            <span style={{ color: C.green }}>✓ Completed</span>
                                            <span style={{ color: C.amber }}>● Ongoing</span>
                                            <span style={{ color: C.red }}>✗ Failed</span>
                                            <span style={{ color: C.dim }}>— Not Taken</span>
                                        </div>
                                    </div>

                                    {/* Year / Semester grouped subjects */}
                                    {Object.keys(curriculumGrouped).sort((a, b) => a - b).map(yr => (
                                        <div key={yr} className="mb-6">
                                            <div className="gr-curr-yr-hdr mb-2">
                                                {yr === '1' ? '1st Year' : yr === '2' ? '2nd Year' : yr === '3' ? '3rd Year' : `${yr}th Year`}
                                            </div>
                                            {Object.keys(curriculumGrouped[yr]).sort((a, b) => a - b).map(sem => (
                                                <div key={sem} className="mb-4">
                                                    <div className="gr-curr-sem-hdr">
                                                        {sem === '1' ? '1st Semester' : sem === '2' ? '2nd Semester' : 'Summer Session'}
                                                    </div>
                                                    <div>
                                                        {curriculumGrouped[yr][sem].map((sub, idx) => {
                                                            const statusIcon = sub.status === 'passed'
                                                                ? <span style={{ color: C.green, fontSize: 14, fontWeight: 900 }}>✓</span>
                                                                : sub.status === 'ongoing'
                                                                    ? <span style={{ color: C.amber, fontSize: 14, fontWeight: 900 }}>●</span>
                                                                    : sub.status === 'failed'
                                                                        ? <span style={{ color: C.red, fontSize: 14, fontWeight: 900 }}>✗</span>
                                                                        : <span style={{ color: C.dim, fontSize: 14, fontWeight: 900 }}>—</span>;

                                                            const gradeColor = sub.status === 'passed' ? C.green
                                                                : sub.status === 'failed' ? C.red
                                                                    : sub.status === 'ongoing' ? C.amber
                                                                        : C.dim;

                                                            return (
                                                                <div key={idx} className="gr-curr-row">
                                                                    <div style={{ width: 20, textAlign: 'center', flexShrink: 0 }}>{statusIcon}</div>
                                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                                        <div style={{
                                                                            fontSize: 12, fontWeight: 700, color: sub.status === 'not_taken' ? C.muted : C.txt, lineHeight: 1.3,
                                                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                                                        }}>
                                                                            {sub.subject_name}
                                                                        </div>
                                                                        <div style={{ fontSize: 9, fontWeight: 800, color: C.dim, fontFamily: 'Space Mono', marginTop: 2 }}>
                                                                            {sub.subject_code}
                                                                            {!sub.is_required && <span style={{ color: C.orange, marginLeft: 6 }}>ELECTIVE</span>}
                                                                        </div>
                                                                    </div>
                                                                    <div style={{ fontSize: 10, fontWeight: 700, color: C.dim, flexShrink: 0 }}>{sub.units}u</div>
                                                                    <div style={{ fontSize: 12, fontWeight: 900, fontFamily: 'Space Mono', color: gradeColor, flexShrink: 0, minWidth: 32, textAlign: 'right' }}>
                                                                        {sub.grade != null ? Number(sub.grade).toFixed(2) : ''}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Capstone / Thesis ── */}
                <div className="mt-10 pt-10 border-t border-white/10 pb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                            <GraduationCap size={18} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.2em', color: C.txt }}>
                                Capstone & Thesis
                            </h3>
                            <p style={{ fontSize: 9, fontWeight: 800, color: C.dim, textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 2 }}>
                                Final Degree Project
                            </p>
                        </div>
                    </div>

                    {!selectedStudent?.capstone ? (
                        <div className="bg-black/30 border border-white/5 border-dashed rounded-3xl p-10 text-center opacity-40">
                            <div style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 18, color: C.txt, marginBottom: 4 }}>No Capstone Record</div>
                            <div style={{ fontSize: 9, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em' }}>Student has not registered a final degree project yet.</div>
                        </div>
                    ) : (
                        <div className="bg-black/40 border border-white/5 rounded-[32px] p-6 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <div className="pr-2">
                                    <h4 style={{ fontFamily: 'Playfair Display', fontSize: 24, fontWeight: 900, fontStyle: 'italic', color: C.txt, lineHeight: 1.2, marginBottom: 8 }}>
                                        {selectedStudent.capstone.title}
                                    </h4>
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                                        <div className="flex items-center gap-1.5"><User size={12} className="text-orange-500/50" /> {selectedStudent.capstone.adviser_name}</div>
                                        <div className="flex items-center gap-1.5"><Calendar size={12} className="text-orange-500/50" /> {selectedStudent.capstone.academic_year} · {selectedStudent.capstone.semester === 1 ? '1st Sem' : selectedStudent.capstone.semester === 2 ? '2nd Sem' : 'Summer'}</div>
                                    </div>
                                </div>
                                <div style={{ background: `${C[selectedStudent.capstone.status_color]}15`, border: `1px solid ${C[selectedStudent.capstone.status_color]}30`, color: C[selectedStudent.capstone.status_color], fontSize: 9, fontWeight: 900, textTransform: 'uppercase', padding: '6px 12px', borderRadius: 12, letterSpacing: '.1em', flexShrink: 0 }}>
                                    {selectedStudent.capstone.status_label}
                                </div>
                            </div>

                            {selectedStudent.capstone.grade != null && (
                                <div className="mb-6 p-4 bg-white/5 rounded-2xl flex justify-between items-center border border-white/5">
                                    <span style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.15em', color: C.muted }}>Final Assessment Grade</span>
                                    <span style={{ fontSize: 20, fontWeight: 900, fontFamily: 'Space Mono', color: C.green }}>{Number(selectedStudent.capstone.grade).toFixed(2)}</span>
                                </div>
                            )}

                            <div>
                                <div style={{ fontSize: 9, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 8 }}>Project Members</div>
                                <div className="flex flex-wrap gap-2">
                                    {(selectedStudent.capstone.members || []).map(member => (
                                        <div key={member.id} className="flex items-center gap-2 bg-black/40 border border-white/5 py-1.5 px-3 rounded-full">
                                            <div style={{ width: 16, height: 16, borderRadius: 8, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 900, color: C.orange }}>
                                                {member.first_name[0]}{member.last_name[0]}
                                            </div>
                                            <span style={{ fontSize: 11, fontWeight: 700, color: C.txt }}>{member.first_name} {member.last_name}</span>
                                            {member.pivot?.role && (
                                                <span style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.05em', color: C.dim, marginLeft: 2 }}>({member.pivot.role})</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Documents ── */}
                <div className="mt-10 pt-10 border-t border-white/10 pb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                            <FileText size={18} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.2em', color: C.txt }}>
                                Academic Documents
                            </h3>
                            <p style={{ fontSize: 9, fontWeight: 800, color: C.dim, textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 2 }}>
                                Transcripts & Certificates
                            </p>
                        </div>
                    </div>

                    {['transcript', 'cor', 'internship_certificate', 'other'].map(docType => {
                        const docs = selectedStudent?.student_documents?.filter(d => d.document_type === docType) || [];
                        const typeLabel = docType === 'cor' ? 'Certificate of Registration'
                            : docType === 'internship_certificate' ? 'Internship Certificate'
                                : docType.charAt(0).toUpperCase() + docType.slice(1);

                        return (
                            <div key={docType} className="mb-6 bg-black/30 border border-white/5 rounded-[24px] p-5">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.15em', color: C.orange }}>{typeLabel}</h4>
                                    <label className={`cursor-pointer ${docForm.processing && docForm.data.document_type === docType ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <div style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', padding: '4px 10px', borderRadius: 12, fontSize: 9, fontWeight: 900, textTransform: 'uppercase', color: C.orange, letterSpacing: '.1em', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Plus size={10} /> {docForm.processing && docForm.data.document_type === docType ? 'Uploading...' : 'Upload'}
                                        </div>
                                        <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleDocUpload(e, docType)} />
                                    </label>
                                </div>

                                {docs.length === 0 ? (
                                    <div style={{ fontSize: 10, fontWeight: 700, fontStyle: 'italic', color: C.dim }}>No {typeLabel.toLowerCase()} on record.</div>
                                ) : (
                                    <div className="space-y-2">
                                        {docs.map(doc => {
                                            const isDeleting = docDeletingId === doc.id;
                                            return (
                                                <div key={doc.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-2xl group hover:border-orange-500/30 transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                                            <FileText size={14} />
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: 12, fontWeight: 700, color: C.txt }}>{doc.file_name}</div>
                                                            <div style={{ fontSize: 9, fontWeight: 800, color: C.dim, fontFamily: 'Space Mono', marginTop: 2 }}>
                                                                {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                                                                {doc.academic_year && ` · AY ${doc.academic_year}`}
                                                                {doc.semester && ` · Sem ${doc.semester}`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <a href={route('student-documents.download', doc.id)} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-orange-500 hover:bg-orange-500/10 transition-colors">
                                                            <ArrowUpRight size={14} />
                                                        </a>
                                                        <button
                                                            onClick={() => handleDeleteDoc(doc.id)}
                                                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${isDeleting ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-white/5 text-white/40 hover:text-red-500 hover:bg-red-500/10'
                                                                }`}
                                                        >
                                                            {isDeleting ? <CheckCircle size={14} /> : <Trash2 size={14} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Add/Edit Modal ── */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="lg">
                <div className="gr-modal">
                    <div className="p-8 border-b border-white/5 bg-gradient-to-r from-orange-500/10 to-transparent flex justify-between items-center">
                        <div>
                            <div style={{ fontSize: 10, fontWeight: 900, color: C.orange, textTransform: 'uppercase', letterSpacing: '.2em', marginBottom: 6 }}>Academic Evaluation</div>
                            <h2 style={{ fontFamily: 'Playfair Display', fontSize: 28, fontWeight: 900, fontStyle: 'italic' }}>
                                {editingGrade ? 'Adjust Existing Record' : 'Publish New Metric'}
                            </h2>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="text-white/20 hover:text-red-500 transition-colors"><X size={24} /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {!editingGrade && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label style={{ fontSize: 10, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', display: 'block', marginBottom: 10 }}>Filter by Section</label>
                                    <select className="gr-input" value={modalSectionId} onChange={e => setModalSectionId(e.target.value)}>
                                        <option value="">All Students</option>
                                        {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: 10, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', display: 'block', marginBottom: 10 }}>Student Name</label>
                                    <select className="gr-input" value={data.student_id} onChange={e => setData('student_id', e.target.value)}>
                                        <option value="">{modalSectionId ? 'Students in this section...' : 'Select Student...'}</option>
                                        {filteredStudents.map(s => <option key={s.id} value={s.id}>{s.student_id} | {s.first_name} {s.last_name}</option>)}
                                    </select>
                                    {errors.student_id && <div style={{ color: C.red, fontSize: 10, fontWeight: 700, marginTop: 4 }}>{errors.student_id}</div>}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label style={{ fontSize: 10, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', display: 'block', marginBottom: 10 }}>Academic Area (Subject)</label>
                                <input className="gr-input" placeholder="e.g. Data Structures" value={data.subject} onChange={e => setData('subject', e.target.value)} />
                                {errors.subject && <div style={{ color: C.red, fontSize: 10, fontWeight: 700, marginTop: 4 }}>{errors.subject}</div>}
                            </div>
                            <div>
                                <label style={{ fontSize: 10, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', display: 'block', marginBottom: 10 }}>Term / Semester</label>
                                <select className="gr-input" value={data.semester} onChange={e => setData('semester', e.target.value)}>
                                    <option value={1}>1st Semester</option>
                                    <option value={2}>2nd Semester</option>
                                    <option value={3}>Summer Session</option>
                                </select>
                            </div>
                        </div>

                        {/* Live Score Preview */}
                        <div className="bg-black/40 border border-white/5 rounded-3xl p-8 text-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform"><TrendingUp size={100} /></div>
                            <label style={{ fontSize: 10, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', display: 'block', marginBottom: 16 }}>Numeric Measurement (0–100)</label>
                            <input
                                type="number"
                                className="bg-transparent border-none outline-none text-center text-7xl font-black font-serif italic text-white w-full"
                                placeholder="00"
                                value={data.score}
                                onChange={e => setData('score', e.target.value)}
                            />
                            {liveRemarks && (
                                <div className="mt-6 flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="gr-remarks-badge" style={{ background: getRemarksStyle(liveRemarks).bg, borderColor: getRemarksStyle(liveRemarks).bdr, color: getRemarksStyle(liveRemarks).c, fontSize: 12, padding: '8px 24px' }}>
                                        {liveRemarks}
                                    </div>
                                    <div className="w-1/2 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full transition-all duration-500" style={{ width: `${data.score}%`, background: getScoreColor(data.score) }} />
                                    </div>
                                </div>
                            )}
                            {errors.score && <div style={{ color: C.red, fontSize: 10, fontWeight: 700, marginTop: 12 }}>{errors.score}</div>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="gr-btn-primary w-full py-5 text-xs font-black shadow-orange-500/20"
                        >
                            {processing ? 'Processing Authorization...' : (editingGrade ? 'Commit Administrative Adjustment' : 'Authorize & Publish Entry')}
                        </button>
                    </form>
                </div>
            </Modal>
            {/* Reports & Export Modal */}
            <Modal show={isReportsModalOpen} onClose={() => setIsReportsModalOpen(false)} maxWidth="2xl">
                <div className="gr-modal p-10 pb-12 relative overflow-hidden group">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-orange-500/10 transition-all duration-1000" />

                    <div className="flex justify-between items-start mb-10 relative z-10">
                        <div>
                            <h2 style={{ fontFamily: 'Playfair Display', fontSize: 32, fontWeight: 900, color: C.txt, letterSpacing: '-0.02em', fontStyle: 'italic', lineHeight: 1.1 }}>
                                Reports & <span style={{ color: C.orange }}>Exports</span>
                            </h2>
                            <p style={{ fontSize: 10, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.2em', marginTop: 8 }}>
                                Secure Document Generation Menu
                            </p>
                        </div>
                        <button onClick={() => setIsReportsModalOpen(false)} className="p-3 bg-white/5 rounded-2xl hover:bg-red-500/20 hover:text-red-500 transition-all text-white/20">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-10 relative z-10">
                        {/* SECTION A */}
                        <div className="bg-black/30 border border-white/5 rounded-3xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.2em', color: C.txt }}>
                                        Student Academic Summary
                                    </h3>
                                    <p style={{ fontSize: 9, fontWeight: 800, color: C.dim, textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 2 }}>
                                        Comprehensive PDF Transcript Output
                                    </p>
                                </div>
                            </div>

                            <select className="gr-input mb-6" value={reportStudentId} onChange={e => setReportStudentId(e.target.value)}>
                                <option value="">— Select Target Student —</option>
                                {students.map(s => (
                                    <option key={s.id} value={s.id}>{s.last_name}, {s.first_name} ({s.student_id})</option>
                                ))}
                            </select>

                            {reportStudentId && (() => {
                                const st = students.find(s => s.id == reportStudentId);
                                if (!st) return null;
                                return (
                                    <div className="bg-white/5 border border-white/5 rounded-2xl p-5 mb-6 flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div style={{ fontFamily: 'Playfair Display', fontSize: 20, fontWeight: 900, color: C.txt, fontStyle: 'italic' }}>
                                                    {st.first_name} {st.last_name}
                                                </div>
                                                <div style={{ fontSize: 10, fontWeight: 900, color: C.orange, marginTop: 4 }}>
                                                    {st.course} • {st.year_level} Year
                                                </div>
                                            </div>
                                            {(st.latin_honors || st.alerts?.length > 0) && (
                                                <div className="text-right">
                                                    {st.latin_honors && <div style={{ fontSize: 10, fontWeight: 900, color: C.amber }}>★ {st.latin_honors}</div>}
                                                    {st.alerts?.length > 0 && <div style={{ fontSize: 10, fontWeight: 900, color: C.red, marginTop: 4 }}>⚠ {st.alerts.length} Alerts</div>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}

                            <a
                                href={reportStudentId ? route('exports.student-summary', reportStudentId) : '#'}
                                target="_blank"
                                className={`block text-center w-full py-4 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${reportStudentId
                                        ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20'
                                        : 'bg-white/5 text-white/20 cursor-not-allowed pointer-events-none'
                                    }`}
                                onClick={e => { if (!reportStudentId) e.preventDefault(); }}
                            >
                                Generate PDF Profile
                            </a>
                        </div>

                        {/* SECTION B */}
                        <div className="bg-black/30 border border-white/5 rounded-3xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500">
                                    <Save size={18} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.2em', color: C.txt }}>
                                        Master Grade Report
                                    </h3>
                                    <p style={{ fontSize: 9, fontWeight: 800, color: C.dim, textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 2 }}>
                                        Current Filtered View ({grades.total} Records)
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 mb-6">
                                <div className="flex-1 bg-white/5 border border-white/5 rounded-xl p-4">
                                    <div style={{ fontSize: 8, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>Target Section</div>
                                    <div style={{ fontSize: 12, fontWeight: 800, color: C.orange }}>{filters.section_id ? sections.find(s => s.id == filters.section_id)?.name || 'All Sections' : 'All Sections'}</div>
                                </div>
                                <div className="flex-1 bg-white/5 border border-white/5 rounded-xl p-4">
                                    <div style={{ fontSize: 8, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>Term Filter</div>
                                    <div style={{ fontSize: 12, fontWeight: 800, color: C.txt }}>{filters.semester ? `Semester ${filters.semester}` : 'All Semesters'}</div>
                                </div>
                                <div className="flex-1 bg-white/5 border border-white/5 rounded-xl p-4">
                                    <div style={{ fontSize: 8, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>AVG GWA</div>
                                    <div style={{ fontSize: 12, fontWeight: 800, color: getScoreColor(summary.average_score) }}>{summary.average_score}</div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <a
                                    href={route('exports.grade-report', filters)}
                                    className="flex-1 text-center py-4 text-xs font-black uppercase tracking-widest rounded-xl transition-all bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
                                >
                                    <Save size={16} /> Export to Excel
                                </a>
                                <a
                                    href={route('exports.grade-report', { ...filters, pdf: 1 })}
                                    className="flex-1 text-center py-4 text-xs font-black uppercase tracking-widest rounded-xl transition-all bg-white/5 hover:bg-white/10 text-white/60 border border-white/5 hover:border-white/10 flex items-center justify-center gap-2 w-full mt-3 mt-0"
                                >
                                    <FileText size={16} /> Export to PDF
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </Modal>
            {/* ── Advanced Student Profiler Left Drawer ── */}
            <div className={`gr-drawer-overlay ${isProfilerOpen ? 'active' : ''}`} onClick={() => setIsProfilerOpen(false)} style={{ zIndex: 105 }} />
            <div className={`gr-drawer ${isProfilerOpen ? 'active' : ''}`} style={{ left: 0, right: 'auto', transform: isProfilerOpen ? 'translateX(0)' : 'translateX(-100%)', zIndex: 106, borderLeft: 'none', borderRight: '1px solid rgba(255,255,255,0.08)', width: 420 }}>
                <div className="flex justify-between items-start mb-8 relative">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                    <div className="relative z-10 w-full">
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 mb-6 shadow-inner shadow-orange-500/20">
                                <SlidersHorizontal size={20} />
                            </div>
                            <button onClick={() => setIsProfilerOpen(false)} className="p-3 bg-white/5 rounded-2xl hover:bg-red-500/20 hover:text-red-500 transition-all text-white/40 border border-transparent hover:border-red-500/30">
                                <X size={20} />
                            </button>
                        </div>
                        <h2 style={{ fontFamily: 'Playfair Display', fontSize: 28, fontWeight: 900, color: C.txt, letterSpacing: '-0.01em', fontStyle: 'italic' }}>
                            Student <span className="text-orange-500">Profiler</span>
                        </h2>
                        <p style={{ fontSize: 10, fontWeight: 900, color: C.muted, letterSpacing: '.15em', textTransform: 'uppercase', mt: 4 }}>
                            Multi-Dimensional Filtering
                        </p>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Engagement Level */}
                    <div>
                        <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-3">Engagement Level</div>
                        <div className="flex gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5">
                            {['high', 'medium', 'low'].map(lvl => (
                                <button
                                    key={lvl}
                                    onClick={() => setProfilerFilters(f => ({ ...f, engagement_level: f.engagement_level === lvl ? '' : lvl }))}
                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${profilerFilters.engagement_level === lvl ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-white/40 hover:text-white/60 hover:bg-white/5'}`}
                                >
                                    {lvl}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Minimum Points Slider */}
                    <div>
                        <div className="flex justify-between items-end mb-3">
                            <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Activity Points</div>
                            <div className="text-xs font-mono font-bold text-white tracking-widest border border-white/10 px-2 py-1 rounded bg-black/50">min {profilerFilters.min_points}</div>
                        </div>
                        <input 
                            type="range" 
                            min="0" max="500" step="10" 
                            value={profilerFilters.min_points}
                            onChange={e => setProfilerFilters(f => ({ ...f, min_points: parseInt(e.target.value) }))}
                            className="w-full accent-orange-500 bg-white/5 rounded-lg appearance-none h-2 cursor-pointer"
                        />
                    </div>

                    {/* Toggles */}
                    <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:border-orange-500/30 transition-all group">
                            <div>
                                <div className="text-[11px] font-black text-white uppercase tracking-wider group-hover:text-orange-500 transition-colors">Has Leadership Role</div>
                                <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Officer, President, Coach</div>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={profilerFilters.has_leadership}
                                onChange={e => setProfilerFilters(f => ({ ...f, has_leadership: e.target.checked }))}
                                className="w-5 h-5 rounded border-white/10 bg-black/50 text-orange-500 focus:ring-orange-500 focus:ring-offset-black transition-all"
                            />
                        </label>

                        <label className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:border-orange-500/30 transition-all group">
                            <div>
                                <div className="text-[11px] font-black text-white uppercase tracking-wider group-hover:text-orange-500 transition-colors">Has Awards</div>
                                <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Competition / Achievement</div>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={profilerFilters.has_awards}
                                onChange={e => setProfilerFilters(f => ({ ...f, has_awards: e.target.checked }))}
                                className="w-5 h-5 rounded border-white/10 bg-black/50 text-orange-500 focus:ring-orange-500 focus:ring-offset-black transition-all"
                            />
                        </label>
                    </div>

                    {/* Categories Multi-select */}
                    <div>
                        <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-3">Participation Categories</div>
                        <div className="flex flex-wrap gap-2">
                            {activityCategories?.map(cat => {
                                const selected = profilerFilters.category_ids.includes(cat.id);
                                return (
                                    <button 
                                        key={cat.id}
                                        onClick={() => handleProfileCategoryToggle(cat.id)}
                                        className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${selected ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20' : 'bg-black/30 text-white/40 border-white/10 hover:border-orange-500/30 hover:text-orange-500'}`}
                                    >
                                        {cat.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* Activity Type */}
                    <div>
                        <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-3">Activity Type</div>
                        <select 
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-[11px] font-bold text-white uppercase tracking-widest outline-none focus:border-orange-500 transition-colors"
                            value={profilerFilters.activity_type}
                            onChange={e => setProfilerFilters(f => ({ ...f, activity_type: e.target.value }))}
                        >
                            <option value="">Any Type</option>
                            <option value="Event">Event</option>
                            <option value="Competition">Competition</option>
                            <option value="Organization">Organization</option>
                        </select>
                    </div>

                </div>

                <div className="mt-12 sticky bottom-0 pt-4 bg-gradient-to-t from-[#1c1208] to-transparent pb-8 z-20">
                    <button 
                        onClick={triggerAdvancedFilter}
                        disabled={isProfilingLoading}
                        className="w-full gr-btn-primary flex justify-center py-5 text-sm tracking-widest rounded-2xl relative overflow-hidden group disabled:opacity-50"
                    >
                        {isProfilingLoading ? (
                            <span className="animate-pulse">Profiling...</span>
                        ) : (
                            <>
                                <Sparkles size={16} className="mr-2 group-hover:rotate-12 transition-transform" /> 
                                Generate Profile
                            </>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                    </button>
                </div>
            </div>
            {/* ── Delete Confirmation Modal ── */}
            {deleteTarget && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="gr-modal p-8 max-w-md w-full border border-white/10 shadow-2xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-serif italic font-black text-white">Delete Program?</h3>
                                <p className="text-sm text-white/40 mt-1 uppercase tracking-widest font-black text-[10px]">Irreversible Action</p>
                            </div>
                        </div>
                        
                        <p className="text-white/60 text-sm leading-relaxed mb-8">
                            Are you sure you want to delete <span className="text-white font-bold">{deleteTarget.code}</span>? This will remove all associated records.
                        </p>
                        
                        <div className="flex gap-4">
                            <button onClick={() => setDeleteTarget(null)} className="flex-1 gr-btn-secondary py-4 justify-center">Cancel</button>
                            <button onClick={() => handleDeleteProgram(deleteTarget.code)} className="flex-1 py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest text-[11px] transition-all shadow-[0_4px_14px_rgba(239,68,68,0.3)]">Confirm Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Create Program Modal ── */}
            {isCreateProgramOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="gr-modal p-10 max-w-xl w-full border border-white/10 shadow-3xl overflow-hidden relative">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-transparent" />
                        
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="text-4xl font-serif italic font-black text-white leading-none">Establish <span className="text-orange-500">Program</span></h3>
                                <p className="text-xs text-white/30 mt-3 uppercase tracking-[0.2em] font-black">Add a new academic course</p>
                            </div>
                            <button onClick={() => setIsCreateProgramOpen(false)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 transition-all border border-white/5">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            handleSaveProgram({
                                code: formData.get('code').toUpperCase(),
                                name: formData.get('name'),
                                dept: formData.get('dept'),
                                curriculum_version: formData.get('curriculum_version'),
                                total_units: formData.get('total_units')
                            });
                        }} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-orange-500/60 uppercase tracking-[0.2em] ml-1">Program Code</label>
                                <input name="code" className="gr-input h-16 text-xl tracking-widest" placeholder="e.g. BSIT" required />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-orange-500/60 uppercase tracking-[0.2em] ml-1">Full Program Name</label>
                                <input name="name" className="gr-input h-16" placeholder="Bachelor of Science in..." required />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-orange-500/60 uppercase tracking-[0.2em] ml-1">Curriculum Version</label>
                                    <input name="curriculum_version" className="gr-input h-14" placeholder="e.g. 2024v1" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-orange-500/60 uppercase tracking-[0.2em] ml-1">Total Units Required</label>
                                    <input name="total_units" type="number" className="gr-input h-14" placeholder="e.g. 145" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-orange-500/60 uppercase tracking-[0.2em] ml-1">Department</label>
                                <select name="dept" className="gr-input h-16 appearance-none">
                                    <option value="CCS">College of Computing Studies</option>
                                    <option value="CAS">College of Arts & Sciences</option>
                                    <option value="COE">College of Engineering</option>
                                    <option value="CBA">College of Business Admin</option>
                                </select>
                            </div>

                            <button type="submit" className="w-full h-16 rounded-[24px] bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black uppercase tracking-[0.2em] text-[11px] hover:from-orange-500 hover:to-orange-400 transition-all duration-300 shadow-xl shadow-orange-500/20 border border-orange-400/50">
                                Establish Program
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Grade Encoding Modal ── */}
            {isGradeModalOpen && gradingStudent && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="gr-modal p-0 max-w-7xl w-full border border-white/10 shadow-3xl overflow-hidden relative max-h-[90vh] flex flex-col">
                        
                        {/* Modal Header */}
                        <div className="p-10 border-b border-white/5 gr-glass gr-mesh relative">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-orange-500 to-transparent opacity-50" />
                            
                            <div className="flex justify-between items-start mb-10">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                            <Sparkles size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-4xl font-serif italic font-black text-white tracking-tight">Encode <span className="text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">Grades</span></h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-[0.2em]">
                                                    <Calendar size={10} /> {gradingYear}
                                                </div>
                                                <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[9px] font-black uppercase tracking-[0.2em]">
                                                    Semester {gradingSemester}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-white/40 uppercase tracking-[0.3em] font-black flex items-center gap-3 pl-16">
                                        <User size={12} className="text-blue-500" />
                                        {gradingStudent.first_name} {gradingStudent.last_name} 
                                        <span className="w-1 h-1 rounded-full bg-white/10" /> 
                                        {gradingStudent.student_id} 
                                        <span className="w-1 h-1 rounded-full bg-white/10" /> 
                                        {activeSection?.name}
                                    </p>
                                </div>
                                <button onClick={() => setIsGradeModalOpen(false)} className="group w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:bg-red-500 hover:text-white transition-all duration-300 border border-white/10 hover:border-red-400 shadow-xl">
                                    <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>

                            {/* Workflow Stepper - Enhanced */}
                            <div className="flex items-center justify-between px-20 relative pt-4">
                                <div className="absolute top-9 left-32 right-32 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />
                                {[
                                    { id: 'draft', label: 'Faculty Encoding', icon: Edit, color: 'blue' },
                                    { id: 'submitted', label: 'Head Review', icon: Rocket, color: 'amber' },
                                    { id: 'approved', label: 'Registrar Approval', icon: CheckCircle, color: 'emerald' },
                                    { id: 'locked', label: 'Registry Locked', icon: Lock, color: 'slate' }
                                ].map((step, idx) => {
                                    const colors = {
                                        blue: { text: 'text-blue-400', bg: 'bg-blue-500/10', bdr: 'border-blue-500/30', glow: 'shadow-blue-500/20' },
                                        amber: { text: 'text-amber-400', bg: 'bg-amber-500/10', bdr: 'border-amber-500/30', glow: 'shadow-amber-500/20' },
                                        emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', bdr: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' },
                                        slate: { text: 'text-slate-400', bg: 'bg-slate-500/10', bdr: 'border-slate-500/30', glow: 'shadow-slate-500/20' }
                                    }[step.color];

                                    return (
                                        <div key={step.id} className="relative z-10 flex flex-col items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${colors.bdr} ${colors.bg} backdrop-blur-xl shadow-2xl ${colors.glow} transition-all duration-500 hover:scale-110 group`}>
                                                <step.icon size={20} className={`${colors.text} group-hover:scale-110 transition-transform`} />
                                                {/* Active Pulse for current step would go here */}
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${colors.text}`}>{step.label}</span>
                                                <span className="text-[8px] text-white/20 font-bold uppercase mt-0.5">Step 0{idx + 1}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-10 bg-[#080604] relative">
                            <div className="gr-grid-tex opacity-10" />
                            <table className="w-full text-left border-collapse relative z-10">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="pb-6 text-[11px] font-black text-white/20 uppercase tracking-[0.2em] w-[25%]">Course Subject</th>
                                        <th className="pb-6 text-[11px] font-black text-white/20 uppercase tracking-[0.2em] text-center w-[8%]">Units</th>
                                        <th className="pb-6 text-[11px] font-black text-white/20 uppercase tracking-[0.2em] text-center">Prelim</th>
                                        <th className="pb-6 text-[11px] font-black text-white/20 uppercase tracking-[0.2em] text-center">Midterm</th>
                                        <th className="pb-6 text-[11px] font-black text-white/20 uppercase tracking-[0.2em] text-center">Final</th>
                                        <th className="pb-6 text-[11px] font-black text-white/20 uppercase tracking-[0.2em] text-center">Result</th>
                                        <th className="pb-6 text-[11px] font-black text-white/20 uppercase tracking-[0.2em] text-center">GWA</th>
                                        <th className="pb-6 text-[11px] font-black text-white/20 uppercase tracking-[0.2em] text-center">Status</th>
                                        <th className="pb-6 text-right">
                                            {activeSection?.allows_manual_subjects && (
                                                <button 
                                                    onClick={() => {
                                                        const code = `NEW-${Date.now()}`;
                                                        setGradeInputs(prev => ({
                                                            ...prev,
                                                            [code]: {
                                                                id: null,
                                                                subject_code: code,
                                                                subject_name: 'New Subject',
                                                                units: 3,
                                                                prelim: null, midterm: null, final: null,
                                                                status: 'draft',
                                                                isManual: true
                                                            }
                                                        }));
                                                    }}
                                                    className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg shadow-blue-500/10"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            )}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {Object.values(gradeInputs).map((subject) => {
                                        const isLocked = subject.status === 'locked' || subject.status === 'approved';
                                        const hasAny = subject.prelim !== null || subject.midterm !== null || subject.prefinal !== null || subject.final !== null;
                                        
                                        const computed = (() => {
                                            if (!hasAny) return '--';
                                            const p = parseFloat(subject.prelim || 0);
                                            const m = parseFloat(subject.midterm || 0);
                                            const f = parseFloat(subject.final || 0);
                                            
                                            // 30/30/40 logic
                                            return ((p * 0.3) + (m * 0.3) + (f * 0.4)).toFixed(1);
                                        })();
                                        const gwa = getGwaEquivalent(computed);

                                        return (
                                            <tr key={subject.subject_code} className="group gr-row-hover transition-all duration-300">
                                                <td className="py-6">
                                                    {subject.isManual ? (
                                                        <div className="space-y-2 pr-4">
                                                            <input 
                                                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-bold uppercase tracking-tight text-xs outline-none focus:border-blue-500/50 focus:bg-white/10 w-full transition-all"
                                                                value={subject.subject_name}
                                                                placeholder="Subject Name"
                                                                onChange={e => setGradeInputs(prev => ({
                                                                    ...prev,
                                                                    [subject.subject_code]: { ...prev[subject.subject_code], subject_name: e.target.value }
                                                                }))}
                                                            />
                                                            <div className="flex items-center gap-2">
                                                                <Hash size={10} className="text-white/20" />
                                                                <input 
                                                                    className="bg-transparent border-b border-white/10 text-[10px] font-mono text-white/40 uppercase outline-none focus:border-blue-500 w-full"
                                                                    value={subject.subject_code_display || ''}
                                                                    placeholder="Code (e.g. IT101)"
                                                                    onChange={e => setGradeInputs(prev => ({
                                                                        ...prev,
                                                                        [subject.subject_code]: { ...prev[subject.subject_code], subject_code_display: e.target.value }
                                                                    }))}
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all">
                                                                <BookOpen size={18} />
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-white uppercase tracking-tight text-[13px] group-hover:text-blue-100 transition-colors">{subject.subject_name}</div>
                                                                <div className="text-[10px] font-mono text-white/30 uppercase mt-0.5 tracking-wider">{subject.subject_code}</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-6 text-center">
                                                    <span className="rv-mono px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/60 text-[11px] font-bold">
                                                        {subject.units}
                                                    </span>
                                                </td>
                                                {['prelim', 'midterm', 'final'].map(period => (
                                                    <td key={period} className="py-6 text-center px-2">
                                                        <div className="relative group/input inline-block">
                                                            <input 
                                                                type="number" 
                                                                value={subject[period] ?? ''}
                                                                onChange={(e) => {
                                                                    const val = e.target.value === '' ? null : parseFloat(e.target.value);
                                                                    setGradeInputs(prev => ({
                                                                        ...prev,
                                                                        [subject.subject_code]: { ...prev[subject.subject_code], [period]: val }
                                                                    }));
                                                                }}
                                                                disabled={isLocked}
                                                                className="w-20 h-12 bg-black/60 border border-white/10 rounded-xl text-center font-mono text-base font-bold text-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all disabled:opacity-50 gr-input-glow"
                                                            />
                                                            {isLocked && (
                                                                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center shadow-lg">
                                                                    <Lock size={8} className="text-white/40" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                ))}
                                                <td className="py-6 text-center">
                                                    <div className={`text-lg font-black font-mono drop-shadow-sm ${computed !== '--' ? (parseFloat(computed) >= 75 ? 'text-emerald-400' : 'text-red-400') : 'text-white/5'}`}>
                                                        {computed}{computed !== '--' && <span className="text-[10px] ml-0.5 opacity-60">%</span>}
                                                    </div>
                                                </td>
                                                <td className="py-6 text-center">
                                                    <div className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center text-sm font-black font-mono border ${
                                                        gwa === '--' ? 'bg-white/5 border-white/5 text-white/5' : 
                                                        (parseFloat(gwa) <= 1.75 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10' : 
                                                         parseFloat(gwa) <= 3.0 ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 
                                                         'bg-red-500/10 border-red-500/30 text-red-400')
                                                    }`}>
                                                        {gwa}
                                                    </div>
                                                </td>
                                                <td className="py-6 text-center">
                                                    <span className={`gr-badge-shimmer px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] border ${
                                                        subject.status === 'locked' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' :
                                                        subject.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                        subject.status === 'submitted' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        'bg-white/5 text-white/20 border-white/10'
                                                    }`}>
                                                        {subject.status || 'Draft'}
                                                    </span>
                                                </td>
                                                <td className="py-6 text-right">
                                                    {subject.status === 'locked' ? (
                                                        <button className="px-4 py-2 rounded-xl bg-orange-500/5 border border-orange-500/10 text-[9px] font-black text-orange-500 uppercase tracking-widest hover:bg-orange-500/20 transition-all flex items-center gap-2 ml-auto">
                                                            <AlertTriangle size={12} /> Appeal
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={async () => {
                                                                try {
                                                                    if (!subject.id) {
                                                                        const mappedSubject = {
                                                                            ...subject,
                                                                            subject_code: subject.isManual ? (subject.subject_code_display || subject.subject_code) : subject.subject_code
                                                                        };
                                                                        await axios.post('/api/semester-subjects/batch', {
                                                                            student_id: gradingStudent.id,
                                                                            semester: gradingSemester,
                                                                            academic_year: gradingYear,
                                                                            entries: [mappedSubject]
                                                                        });
                                                                        // Refresh to get the new ID
                                                                        const entryRes = await axios.get(`/grades/sections/${gradingStudent.section_id}/encoding-grid`, {
                                                                            params: { student_id: gradingStudent.id }
                                                                        });
                                                                        const updatedInputs = { ...gradeInputs };
                                                                        const studentData = entryRes.data.students?.[0];
                                                                        if (studentData && studentData.subjects) {
                                                                            studentData.subjects.forEach(sub => {
                                                                                updatedInputs[sub.subject_code] = {
                                                                                    ...updatedInputs[sub.subject_code],
                                                                                    ...sub,
                                                                                    id: sub.enrollment_id,
                                                                                };
                                                                            });
                                                                        }
                                                                        setGradeInputs(updatedInputs);
                                                                    } else {
                                                                        await axios.post('/api/semester-subjects/batch', {
                                                                            entries: [{ ...subject, id: subject.id }]
                                                                        });
                                                                    }
                                                                    showToast('Subject Draft Saved');
                                                                } catch (e) { 
                                                                    const msg = e.response?.data?.message || 'Save failed';
                                                                    showToast(msg, 'error'); 
                                                                }
                                                            }}
                                                            className="group/save w-10 h-10 rounded-2xl bg-white/5 border border-white/10 text-white/20 flex items-center justify-center hover:bg-blue-500 hover:text-white hover:border-blue-400 transition-all duration-300 ml-auto shadow-xl"
                                                        >
                                                            <Save size={18} className="group-hover/save:scale-110 transition-transform" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-10 border-t border-white/5 flex justify-between items-center gr-glass gr-mesh relative">
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-orange-500 opacity-20" />
                            
                            <div className="flex items-center gap-8">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">System Validation</span>
                                    <div className="flex items-center gap-4">
                                        <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">All Records Synchronized</span>
                                        </div>
                                        <div className="px-4 py-2 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-2">
                                            <Info size={12} className="text-blue-400" />
                                            <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Auto-Save Active</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <button 
                                    onClick={async () => {
                                        setGradeSubmitting(true);
                                        try {
                                            const payload = Object.values(gradeInputs)
                                                .filter(g => g.id !== null)
                                                .map(g => ({
                                                    id: g.id,
                                                    prelim: g.prelim,
                                                    midterm: g.midterm,
                                                    final: g.final
                                                }));
                                            
                                            await axios.post('/api/semester-subjects/batch', { entries: payload });
                                            showToast('Academic records updated');
                                            router.reload({ only: ['studentSemesterRecords', 'sections'] });
                                        } catch (e) { showToast('Update failed', 'error'); }
                                        finally { setGradeSubmitting(false); }
                                    }}
                                    disabled={gradeSubmitting}
                                    className="group h-16 px-10 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 flex items-center gap-3 shadow-2xl"
                                >
                                    <Save size={20} className="group-hover:-translate-y-1 transition-transform" /> Save Current Session
                                </button>
                                <button 
                                    onClick={async () => {
                                        if (!confirm('Finalize and lock these grades?')) return;
                                        setGradeSubmitting(true);
                                        try {
                                            const subjectIds = Object.values(gradeInputs)
                                                .filter(g => g.id !== null)
                                                .map(g => g.id);
                                            
                                            await axios.post('/api/semester-subjects/batch-submit', { subject_ids: subjectIds });
                                            showToast('Academic batch transmitted');
                                            setIsGradeModalOpen(false);
                                            router.reload({ only: ['studentSemesterRecords', 'sections'] });
                                        } catch (e) { showToast('Transmission failed', 'error'); }
                                        finally { setGradeSubmitting(false); }
                                    }}
                                    disabled={gradeSubmitting}
                                    className="group h-16 px-10 rounded-2xl bg-blue-600 border border-blue-400 text-white font-black uppercase tracking-[0.2em] text-[11px] hover:bg-blue-500 transition-all duration-300 flex items-center gap-3 shadow-2xl shadow-blue-500/20"
                                >
                                    <Rocket size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Final Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Clearance Modal ── */}
            {isClearanceModalOpen && clearanceStudent && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-500">
                    <div className="gr-modal p-0 max-w-6xl w-full border border-white/10 shadow-3xl overflow-hidden relative max-h-[90vh] flex flex-col">
                        
                        {/* Modal Header */}
                        <div className="p-10 border-b border-white/5 gr-glass gr-mesh relative">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-transparent opacity-50" />
                            
                            <div className="flex justify-between items-start mb-8">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                            <CheckCircle2 size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-4xl font-serif italic font-black text-white tracking-tight">Clearance <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">Registry</span></h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em]">
                                                    <Calendar size={10} /> {gradingYear}
                                                </div>
                                                <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[9px] font-black uppercase tracking-[0.2em]">
                                                    Semester {gradingSemester}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-white/40 uppercase tracking-[0.3em] font-black flex items-center gap-3 pl-16">
                                        <User size={12} className="text-emerald-500" />
                                        {clearanceStudent.first_name} {clearanceStudent.last_name} 
                                        <span className="w-1 h-1 rounded-full bg-white/10" /> 
                                        {clearanceStudent.student_id} 
                                        <span className="w-1 h-1 rounded-full bg-white/10" /> 
                                        {activeSection?.name}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => setIsLogOpen(!isLogOpen)}
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 shadow-xl ${
                                            isLogOpen ? 'bg-emerald-500 text-white border-transparent' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                                        }`}
                                        title="View Activity Log"
                                    >
                                        <ListChecks size={20} />
                                    </button>
                                    <button onClick={() => setIsClearanceModalOpen(false)} className="group w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:bg-red-500 hover:text-white transition-all duration-300 border border-white/10 hover:border-red-400 shadow-xl">
                                        <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-10 bg-[#080604] relative">
                            <div className="gr-grid-tex opacity-10" />
                            <table className="w-full text-left border-collapse relative z-10">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="pb-6 text-[11px] font-black text-white/20 uppercase tracking-[0.2em] w-[25%]">Department</th>
                                        <th className="pb-6 text-[11px] font-black text-white/20 uppercase tracking-[0.2em] text-center w-[15%]">Status</th>
                                        <th className="pb-6 text-[11px] font-black text-white/20 uppercase tracking-[0.2em]">Concern / Hold Reason</th>
                                        <th className="pb-6 text-[11px] font-black text-white/20 uppercase tracking-[0.2em]">Evaluated By</th>
                                        <th className="pb-6 text-[11px] font-black text-white/20 uppercase tracking-[0.2em] text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {allClearanceData[clearanceStudent.id]?.departments?.map((entry) => (
                                        <React.Fragment key={entry.id}>
                                            <tr 
                                                onClick={() => toggleDept(entry.dept_name)}
                                                className={`group transition-all duration-300 cursor-pointer ${expandedDepts.includes(entry.dept_name) ? 'bg-white/[0.03]' : 'gr-row-hover'}`}
                                            >
                                                <td className="py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                                            entry.status === 'cleared' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 border border-white/10 text-white/20'
                                                        }`}>
                                                            <Shield size={18} />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-white uppercase tracking-tight text-[13px] group-hover:text-emerald-100 transition-colors flex items-center gap-2">
                                                                {entry.dept_name}
                                                                <ChevronDown size={12} className={`transition-transform duration-300 ${expandedDepts.includes(entry.dept_name) ? 'rotate-180 text-emerald-400' : 'text-white/20'}`} />
                                                            </div>
                                                            <div className="text-[9px] text-white/20 uppercase mt-0.5 tracking-widest font-bold">
                                                                {entry.blocks_enrollment ? 'Blocks Enrollment' : 'Regular Clearance'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 text-center">
                                                    <div className={`gr-badge-shimmer inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] border ${
                                                        entry.status === 'cleared' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                        entry.status === 'on_hold' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                        'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                    }`}>
                                                        {entry.status === 'on_hold' ? <Lock size={10} /> : (entry.status === 'cleared' ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />)}
                                                        {entry.status === 'on_hold' ? 'Locked' : (entry.status === 'cleared' ? 'Cleared' : 'Pending')}
                                                    </div>
                                                </td>
                                                <td className="py-6">
                                                    {holdModalEntry === entry.id ? (
                                                        <div className="space-y-2 pr-4 animate-in slide-in-from-left-2" onClick={e => e.stopPropagation()}>
                                                            <input 
                                                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white font-bold text-[11px] outline-none focus:border-red-500/50 w-full"
                                                                value={holdReason}
                                                                placeholder="Hold Reason"
                                                                onChange={e => setHoldReason(e.target.value)}
                                                                autoFocus
                                                            />
                                                            <div className="flex gap-2">
                                                                <button 
                                                                    onClick={() => handleUpdateClearance(entry.id, 'hold', { reason: holdReason })}
                                                                    className="px-2 py-1 rounded-md bg-red-500 text-white text-[9px] font-black uppercase tracking-widest"
                                                                >Save</button>
                                                                <button 
                                                                    onClick={() => setHoldModalEntry(null)}
                                                                    className="px-2 py-1 rounded-md bg-white/5 text-white/40 text-[9px] font-black uppercase tracking-widest"
                                                                >Cancel</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-[11px] text-white/40 italic max-w-[200px] truncate group-hover:text-white/60 transition-colors">
                                                            {entry.hold_reason || entry.note || '--'}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-6">
                                                    <div className="text-[10px] font-black text-white/60 uppercase tracking-widest group-hover:text-emerald-400/80 transition-colors">{entry.cleared_by_name || '--'}</div>
                                                    <div className="text-[9px] font-mono text-white/20 mt-1">{entry.cleared_at ? new Date(entry.cleared_at).toLocaleDateString() : ''}</div>
                                                </td>
                                                <td className="py-6 text-right" onClick={e => e.stopPropagation()}>
                                                    <div className="flex items-center justify-end gap-3">
                                                        {entry.status === 'cleared' ? (
                                                            <button 
                                                                onClick={() => handleUpdateClearance(entry.id, 'revoke')}
                                                                className="px-3 py-1.5 rounded-xl bg-red-500/5 border border-red-500/10 text-[9px] font-black text-red-500/40 uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all shadow-xl"
                                                            >
                                                                Revoke
                                                            </button>
                                                        ) : (
                                                            <>
                                                                <button 
                                                                    onClick={() => handleUpdateClearance(entry.id, 'clear')}
                                                                    className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-emerald-500 hover:text-white transition-all shadow-xl shadow-emerald-500/10"
                                                                >
                                                                    Clear
                                                                </button>
                                                                <button 
                                                                    onClick={() => {
                                                                        setHoldModalEntry(entry.id);
                                                                        setHoldReason(entry.hold_reason || '');
                                                                    }}
                                                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/20 flex items-center justify-center hover:bg-white/10 hover:text-white hover:border-white/20 transition-all shadow-xl"
                                                                    title="Place on Hold"
                                                                >
                                                                    <Edit size={16} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedDepts.includes(entry.dept_name) && (
                                                <tr className="bg-white/[0.015] border-b border-white/5 animate-in slide-in-from-top-2 duration-300">
                                                    <td colSpan="5" className="p-8">
                                                        <div className="grid grid-cols-2 gap-10">
                                                            <div className="space-y-4">
                                                                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">
                                                                    <ListChecks size={14} /> Departmental Requirements
                                                                </div>
                                                                <div className="grid grid-cols-1 gap-2">
                                                                    {getDeptRequirements(entry.dept_name).map((req, ridx) => (
                                                                        <div key={ridx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group/req hover:border-emerald-500/30 transition-all">
                                                                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                                                                                entry.status === 'cleared' ? 'bg-emerald-500 text-white border-transparent' : 'bg-white/5 border-white/10 group-hover/req:border-emerald-500/50'
                                                                            }`}>
                                                                                <CheckCircle size={10} />
                                                                            </div>
                                                                            <span className={`text-[11px] font-bold ${entry.status === 'cleared' ? 'text-white' : 'text-white/40'}`}>{req}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">
                                                                    <Zap size={14} /> Quick Remarks
                                                                </div>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {['Docs verified', 'Paid all dues', 'Equipment returned', 'Pending review'].map((rem, ridx) => (
                                                                        <button 
                                                                            key={ridx}
                                                                            onClick={() => {
                                                                                setHoldReason(rem);
                                                                                setHoldModalEntry(entry.id);
                                                                            }}
                                                                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-white/30 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/20 transition-all"
                                                                        >
                                                                            {rem}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Modal Footer */}
                        <div className="p-10 border-t border-white/5 flex justify-between items-center gr-glass gr-mesh relative">
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-emerald-400 opacity-20" />
                            
                            <div className="flex items-center gap-10">
                                <div className="relative group/prog">
                                    <svg className="w-16 h-16 transform -rotate-90">
                                        <circle
                                            cx="32" cy="32" r="28"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="transparent"
                                            className="text-white/5"
                                        />
                                        <circle
                                            cx="32" cy="32" r="28"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="transparent"
                                            strokeDasharray={2 * Math.PI * 28}
                                            strokeDashoffset={2 * Math.PI * 28 * (1 - (allClearanceData[clearanceStudent.id]?.cleared_count || 0) / (allClearanceData[clearanceStudent.id]?.total_departments || 7))}
                                            strokeLinecap="round"
                                            className="text-emerald-500 transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-black text-white">
                                        {Math.round(((allClearanceData[clearanceStudent.id]?.cleared_count || 0) / (allClearanceData[clearanceStudent.id]?.total_departments || 7)) * 100)}%
                                    </div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-white leading-none flex items-baseline gap-1 font-mono">
                                        {allClearanceData[clearanceStudent.id]?.cleared_count}
                                        <span className="text-sm text-white/20">/</span>
                                        <span className="text-sm text-white/40">{allClearanceData[clearanceStudent.id]?.total_departments}</span>
                                    </div>
                                    <div className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-black mt-2">Departments Cleared</div>
                                </div>
                                <div className="h-12 w-px bg-white/10" />
                                <div>
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${
                                        allClearanceData[clearanceStudent.id]?.overall_status === 'fully_cleared' 
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                                    }`}>
                                        {allClearanceData[clearanceStudent.id]?.overall_status === 'fully_cleared' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                                        <span className="text-[11px] font-black uppercase tracking-[0.1em]">
                                            {allClearanceData[clearanceStudent.id]?.overall_status === 'fully_cleared' ? 'Fully Cleared ✓' : 'Enrollment Blocked ⚠️'}
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-black mt-2 pl-2">Overall Registry Status</div>
                                </div>
                            </div>

                            {/* Activity Log Overlay */}
                            {isLogOpen && (
                                <div className="absolute bottom-full right-10 mb-6 w-96 max-h-96 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-[32px] shadow-3xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 z-50 flex flex-col">
                                    <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Clearance Activity Log</div>
                                        <button onClick={() => setIsLogOpen(false)} className="text-white/20 hover:text-white transition-colors"><X size={14} /></button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                        {[
                                            { user: 'Admin Sarah', action: 'Cleared Library', time: '2 mins ago' },
                                            { user: 'System', action: 'Placed Laboratory on Hold', time: '1 hour ago' },
                                            { user: 'Registrar', action: 'Revoked Accounting', time: 'Yesterday' }
                                        ].map((log, lidx) => (
                                            <div key={lidx} className="flex gap-4 group/log">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-white/40 group-hover/log:border-emerald-500/30 transition-all">
                                                    {log.user[0]}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[11px] font-bold text-white leading-tight">{log.action}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{log.user}</span>
                                                        <span className="text-white/10">•</span>
                                                        <span className="text-[9px] text-white/20 font-mono">{log.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 bg-emerald-500/5 text-center">
                                        <button className="text-[9px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-400 transition-colors">View All History</button>
                                    </div>
                                </div>
                            )}

                            <button 
                                onClick={() => {
                                    showToast('Preparing PDF...', 'info');
                                    setTimeout(() => window.print(), 1000);
                                }}
                                className="group h-16 px-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black uppercase tracking-[0.2em] text-[11px] hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 flex items-center gap-3 shadow-[0_10px_40px_rgba(16,185,129,0.3)] border border-emerald-400/50"
                            >
                                <FileText size={20} className="group-hover:-translate-y-1 transition-transform" /> Export Clearance Slip
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-8 right-8 z-[99999] px-6 py-3 rounded-2xl border backdrop-blur-md shadow-2xl animate-in slide-in-from-right-10 duration-300 flex items-center gap-3 ${
                    toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                }`}>
                    {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertOctagon size={18} />}
                    <span className="text-xs font-black uppercase tracking-widest">{toast.message}</span>
                </div>
            )}
        </AppLayout>
    );
}

