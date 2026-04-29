/* ─── CCS PALETTE ─── */
export const C = {
    bg: "var(--background, #0c0805)",
    bg2: "var(--background-alt, #100a05)",
    surf: "var(--surface, #160e08)",
    surf2: "var(--surface-alt, #1c1208)",
    bdr: "var(--border, #2a1508)",
    bdr2: "var(--border-alt, #3a1e0a)",
    orange: "var(--primary, #f97316)",
    orange2: "var(--secondary, #fb923c)",
    orange3: "var(--accent, #fdba74)",
    orange4: "var(--primary-dark, #c2410c)",
    glow: "var(--primary-glow, rgba(249,115,22,0.12))",
    pbdr: "var(--primary-border, rgba(249,115,22,0.25))",
    txt: "var(--text-primary, #fef3ec)",
    muted: "var(--text-muted, rgba(254,243,236,0.45))",
    dim: "var(--text-dim, rgba(254,243,236,0.22))",
    faint: "var(--text-faint, rgba(254,243,236,0.08))",
};

export const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,900&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.si-root{
  background:${C.bg};
  min-height:100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  font-family: var(--body-font, 'DM Sans', system-ui, sans-serif);
  color:${C.txt};
  padding: var(--gap, 28px) var(--gap, 32px) 48px;
  position:relative;
  border-radius: var(--radius, 0);
}

/* ambient glow */
.si-root::before{
  content:'';
  position:fixed;top:-10%;right:-5%;
  width:520px;height:520px;
  background:radial-gradient(circle,rgba(249,115,22,0.05) 0%,transparent 65%);
  border-radius:50%;pointer-events:none;
}
.si-root::after{
  content:'';
  position:fixed;bottom:-8%;left:30%;
  width:320px;height:320px;
  background:radial-gradient(circle,rgba(194,65,12,0.04) 0%,transparent 65%);
  border-radius:50%;pointer-events:none;
}

/* subtle grid texture */
.si-grid{
  position:fixed;inset:0;
  background-image:
    linear-gradient(rgba(249,115,22,0.022) 1px,transparent 1px),
    linear-gradient(90deg,rgba(249,115,22,0.022) 1px,transparent 1px);
  background-size:48px 48px;
  pointer-events:none;z-index:0;
}

.si-content{position:relative;z-index:1;}

/* ── PAGE HEADER ── */
.si-hdr{
  display:flex;align-items:flex-start;
  justify-content:space-between;
  margin-bottom:24px;gap:16px;
}
.si-hdr-tags{display:flex;align-items:center;gap:6px;margin-bottom:10px;}
.si-tag{
  font-size:9px;font-weight:700;
  padding:2px 9px;border-radius:4px;
  letter-spacing:.08em;text-transform:uppercase;
}
.si-hdr-title{
  font-family: var(--display-font, 'Playfair Display', serif);
  font-size:30px;font-weight:900;
  color:${C.txt};line-height:1.05;
  letter-spacing:-.02em;
}
.si-hdr-title span{
  color:${C.orange};font-style:italic;
}
.si-hdr-sub{
  font-size:11px;color:${C.dim};margin-top:5px;
  font-style:italic;
}

.si-enroll-btn{
  display:inline-flex;align-items:center;gap:8px;
  padding:11px 20px;border-radius:11px;
  background:linear-gradient(135deg,${C.orange},${C.orange4});
  color:#fff;font-size:12px;font-weight:700;
  text-decoration:none;border:none;cursor:pointer;
  box-shadow:0 4px 18px rgba(249,115,22,0.32);
  transition:all .22s;white-space:nowrap;
  font-family:inherit;
  flex-shrink:0;margin-top:4px;
}
.si-enroll-btn:hover{
  transform:translateY(-2px);
  box-shadow:0 8px 26px rgba(249,115,22,0.42);
}

.si-enroll-btn.secondary {
  background: rgba(254,243,236,0.05);
  border: 1px solid rgba(254,243,236,0.15);
  color: ${C.txt};
  box-shadow: none;
}
.si-enroll-btn.secondary:hover {
  background: rgba(254,243,236,0.1);
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}

/* ── STATS ROW ── */
.si-stats{
  display:grid;grid-template-columns:repeat(4,1fr);
  gap:10px;margin-bottom:20px;
}
.si-stat{
  background:linear-gradient(145deg,rgba(249,115,22,0.08),rgba(0,0,0,0.4));
  border:1px solid ${C.bdr};border-radius:13px;
  padding:16px 18px;position:relative;
  overflow:hidden;cursor:pointer;
  transition:border-color .22s,transform .22s;
}
.si-stat:hover{border-color:rgba(249,115,22,0.35);transform:translateY(-1px);}
.si-stat::after{
  content:'';position:absolute;
  top:-30px;right:-30px;
  width:80px;height:80px;border-radius:50%;
  background:rgba(249,115,22,0.08);
  transition:transform .35s;
}
.si-stat:hover::after{transform:scale(1.6);}
.si-stat-icon{
  width:30px;height:30px;border-radius:8px;
  display:flex;align-items:center;justify-content:center;
  margin-bottom:10px;position:relative;z-index:1;
}
.si-stat-val{
  font-family:'Space Mono',monospace;
  font-size:24px;font-weight:700;
  color:${C.txt};line-height:1;
  position:relative;z-index:1;
}
.si-stat-lbl{
  font-size:10px;font-weight:600;
  color:${C.muted};margin-top:4px;
  text-transform:uppercase;letter-spacing:.07em;
  position:relative;z-index:1;
}
.si-stat-bar{
  height:2px;background:rgba(249,115,22,0.1);
  border-radius:1px;margin-top:11px;overflow:hidden;
  position:relative;z-index:1;
}
.si-stat-bar-fill{height:100%;border-radius:1px;}

/* ── FILTER BAR ── */
.si-filter{
  background:${C.surf};
  border:1px solid ${C.bdr};
  border-radius:13px;padding:14px 16px;
  display:flex;flex-wrap:wrap;
  gap:10px;align-items:center;
  margin-bottom:18px;
}
.si-filter-label{
  font-size:9px;font-weight:700;
  color:rgba(249,115,22,0.5);
  letter-spacing:.12em;text-transform:uppercase;
  padding-right:8px;border-right:1px solid ${C.bdr};
  white-space:nowrap;
}
.si-search-wrap{
  flex:1;min-width:180px;
  display:flex;align-items:center;gap:9px;
  background:rgba(249,115,22,0.06);
  border:1px solid ${C.bdr};border-radius:9px;
  padding:9px 13px;transition:all .2s;
}
.si-search-wrap:focus-within{
  border-color:rgba(249,115,22,0.45);
  background:rgba(249,115,22,0.1);
}
.si-search-wrap input, .si-search-wrap textarea{
  background:transparent;border:none;outline:none;
  color:${C.txt};font-size:12px;width:100%;
  font-family:inherit;
}
.si-search-wrap input::placeholder, .si-search-wrap textarea::placeholder{color:${C.dim};}
.si-search-wrap.error {
    border-color: rgba(239, 68, 68, 0.45);
    background: rgba(239, 68, 68, 0.1);
}

.si-select{
  background:rgba(249,115,22,0.06);
  border:1px solid ${C.bdr};border-radius:9px;
  color:${C.txt};font-size:12px;
  padding:9px 13px;outline:none;cursor:pointer;
  font-family:inherit;transition:all .2s;
  -webkit-appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(249,115,22,0.5)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat:no-repeat;
  background-position:right 12px center;
  padding-right:32px;
}
.si-select:focus{border-color:rgba(249,115,22,0.45);}
.si-select.error{border-color:rgba(239,68,68,0.45); background:rgba(239,68,68,0.1);}
.si-select option{background:${C.surf2};color:${C.txt};}

.si-filter-btn{
  display:flex;align-items:center;gap:7px;
  padding:9px 18px;border-radius:9px;
  background:linear-gradient(135deg,${C.orange},${C.orange4});
  border:none;color:#fff;font-size:12px;
  font-weight:700;cursor:pointer;
  font-family:inherit;transition:all .18s;
  box-shadow:0 3px 12px rgba(249,115,22,0.28);
}
.si-filter-btn:hover{
  box-shadow:0 5px 16px rgba(249,115,22,0.4);
  transform:translateY(-1px);
}

/* ── TABLE ── */
.si-card{
  background:${C.surf};
  border:1px solid ${C.bdr};
  border-radius:14px;overflow:hidden;
  margin-bottom:16px;
}
.si-card-hdr{
  display:flex;align-items:center;justify-content:space-between;
  padding:14px 20px;border-bottom:1px solid ${C.bdr};
}
.si-card-title{
  font-family:'Playfair Display',serif;
  font-size:15px;font-weight:700;color:${C.txt};
}
.si-card-sub{font-size:10px;color:${C.dim};margin-top:1px;}
.si-card-count{
  font-family:'Space Mono',monospace;
  font-size:11px;font-weight:700;color:${C.orange};
  background:rgba(249,115,22,0.1);
  border:1px solid rgba(249,115,22,0.22);
  padding:3px 11px;border-radius:99px;
}

table.si-table{width:100%;border-collapse:collapse;}
.si-table thead tr{
  border-bottom:1px solid ${C.bdr};
}
.si-table th{
  padding:10px 18px;
  text-align:left;font-size:8px;
  font-weight:700;letter-spacing:.14em;
  color:rgba(249,115,22,0.42);
  text-transform:uppercase;
  background:rgba(249,115,22,0.03);
  white-space:nowrap;
}
.si-table th:last-child{text-align:right;}
.si-row{
  border-bottom:1px solid rgba(249,115,22,0.05);
  cursor:pointer;transition:background .14s;
}
.si-row:hover{background:rgba(249,115,22,0.04);}
.si-row:last-child{border-bottom:none;}
.si-td{padding:13px 18px;vertical-align:middle;}

/* Avatar */
.si-avatar{
  width:36px;height:36px;border-radius:10px;
  background:rgba(249,115,22,0.18);
  border:1px solid rgba(249,115,22,0.32);
  display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:700;color:${C.orange};
  font-family:'Space Mono',monospace;
  flex-shrink:0;
  transition:transform .18s;
}
.si-row:hover .si-avatar{transform:scale(1.08);}

.si-name{font-size:12px;font-weight:600;color:${C.txt};}
.si-email{font-size:9px;color:${C.dim};margin-top:1px;letter-spacing:.02em;}
.si-lrn{
  font-family:'Space Mono',monospace;
  font-size:11px;color:${C.muted};letter-spacing:.04em;
}
.si-grade{font-size:12px;font-weight:600;color:${C.txt};}
.si-section{font-size:10px;color:${C.muted};font-style:italic;margin-top:1px;}

/* Status badges */
.si-badge{
  display:inline-flex;align-items:center;gap:5px;
  font-size:9px;font-weight:700;
  padding:3px 10px;border-radius:99px;
  text-transform:uppercase;letter-spacing:.08em;
  white-space:nowrap;
}
.si-badge-dot{width:5px;height:5px;border-radius:50%;}

/* Action buttons */
.si-actions{display:flex;align-items:center;justify-content:flex-end;gap:2px;}
.si-action-btn{
  width:32px;height:32px;border-radius:8px;
  display:flex;align-items:center;justify-content:center;
  background:transparent;border:1px solid transparent;
  color:${C.dim};cursor:pointer;
  transition:all .15s;
}
.si-action-btn:hover.view {color:${C.orange};background:rgba(249,115,22,0.1);border-color:rgba(249,115,22,0.22);}
.si-action-btn:hover.edit {color:${C.txt};background:rgba(254,243,236,0.06);border-color:rgba(254,243,236,0.1);}
.si-action-btn:hover.del  {color:#fca5a5;background:rgba(239,68,68,0.1);border-color:rgba(239,68,68,0.25);}
.si-action-btn:hover.shortcuts {color:${C.orange};background:rgba(249,115,22,0.1);border-color:rgba(249,115,22,0.22);}

.si-shortcut-item {
  cursor: pointer;
}
.si-shortcut-item:hover {
  background: rgba(249,115,22,0.1);
  transform: translateX(4px);
}
.si-shortcut-item:hover span {
  color: #fff !important;
}

@keyframes si-menu-in {
  from { opacity: 0; transform: translateY(10px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.si-fade-in {
  animation: si-menu-in 0.2s cubic-bezier(0.4, 0, 0.2, 1) both;
}


/* Empty state */
.si-empty{
  padding:60px 0;text-align:center;
}
.si-empty-icon{
  width:60px;height:60px;border-radius:16px;
  background:rgba(249,115,22,0.08);border:1px solid rgba(249,115,22,0.15);
  display:flex;align-items:center;justify-content:center;
  margin:0 auto 16px;
}
.si-empty-title{
  font-family:'Playfair Display',serif;
  font-size:18px;font-weight:700;font-style:italic;
  color:${C.muted};margin-bottom:6px;
}
.si-empty-sub{font-size:11px;color:${C.dim};}

/* ── PAGINATION ── */
.si-pager{
  display:flex;align-items:center;
  justify-content:space-between;
  background:${C.surf};border:1px solid ${C.bdr};
  border-radius:13px;padding:12px 18px;
  flex-wrap:wrap;gap:10px;
}
.si-pager-info{
  font-size:10px;color:${C.dim};font-style:italic;
  font-family:'Space Mono',monospace;
}
.si-pager-links{display:flex;gap:5px;flex-wrap:wrap;}
.si-pager-btn{
  padding:7px 13px;border-radius:8px;
  font-size:10px;font-weight:700;
  text-decoration:none;display:inline-block;
  transition:all .15s;font-family:'Space Mono',monospace;
  border:1px solid ${C.bdr};
}
.si-pager-btn.active{
  background:linear-gradient(135deg,${C.orange},${C.orange4});
  color:#fff;border-color:transparent;
  box-shadow:0 3px 10px rgba(249,115,22,0.32);
}
.si-pager-btn.inactive{
  color:${C.muted};background:rgba(249,115,22,0.04);
}
.si-pager-btn.inactive:hover{
  color:${C.txt};background:rgba(249,115,22,0.1);
  border-color:rgba(249,115,22,0.25);
}
.si-pager-btn.disabled{
  color:${C.dim};background:transparent;
  border-color:rgba(249,115,22,0.05);
  pointer-events:none;opacity:.4;
}

/* ── Checkboxes ── */
.si-checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: ${C.muted};
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all .2s;
}
.si-checkbox-wrapper:hover {
  background: rgba(249,115,22,0.04);
  border-color: rgba(249,115,22,0.1);
  color: ${C.txt};
}
.si-checkbox {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 4px;
  border: 1px solid rgba(249,115,22,0.3);
  background: rgba(249,115,22,0.05);
  display: grid;
  place-content: center;
  margin: 0;
  cursor: pointer;
}
.si-checkbox::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 2px;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  background-color: ${C.orange};
}
.si-checkbox:checked::before {
  transform: scale(1);
}

/* ── ENTRANCE ANIMATION ── */
@keyframes si-up{
  from{opacity:0;transform:translateY(14px);}
  to{opacity:1;transform:translateY(0);}
}
.si-fade{animation:si-up .38s ease both;}
.si-fade-1{animation-delay:.04s;}
.si-fade-2{animation-delay:.09s;}
.si-fade-3{animation-delay:.14s;}
.si-fade-4{animation-delay:.19s;}
.si-fade-5{animation-delay:.24s;}

`;
