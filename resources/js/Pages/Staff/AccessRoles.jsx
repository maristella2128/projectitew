import { useState } from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/Layouts/AuthenticatedLayout";

// ─── Styles ────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --bg:#0d0a07; --surface:#161209; --card:#1c1610;
    --border:#2a2015; --border2:#3a2f1e;
    --accent:#e8650a; --accent2:#f5831f; --accentlow:rgba(232,101,10,0.12);
    --green:#22c55e; --greenlow:rgba(34,197,94,0.12);
    --red:#ef4444;   --redlow:rgba(239,68,68,0.12);
    --text:#f0e8d8;  --muted:#7a6a52; --muted2:#a08060;
    --purple:#7c3aed;
  }

  /* ── Reset ── */
  .ar * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Root ── */
  .ar { font-family: 'DM Sans', sans-serif; color: var(--text); padding: 24px 32px; }

  /* ── Page header ── */
  .ar-ph { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:28px; }
  .ar-ph-title {
    font-family:'Syne',sans-serif; font-size:26px; font-weight:800;
    color:var(--text); display:flex; align-items:center; gap:10px; margin-bottom:4px;
  }
  .ar-ph-title svg { color:var(--accent); }
  .ar-ph-sub { font-size:13px; color:var(--muted); }

  /* ── Buttons ── */
  .ar-btn {
    display:inline-flex; align-items:center; gap:6px;
    padding:8px 16px; border-radius:8px; font-size:13px;
    font-family:'DM Sans',sans-serif; font-weight:600;
    cursor:pointer; border:none; transition:all .18s;
  }
  .ar-btn-accent { background:var(--accent); color:#fff; }
  .ar-btn-accent:hover { background:var(--accent2); transform:translateY(-1px); box-shadow:0 4px 16px rgba(232,101,10,.35); }
  .ar-btn-accent:disabled { opacity:.45; cursor:not-allowed; transform:none; box-shadow:none; }
  .ar-btn-ghost { background:var(--card); color:var(--muted2); border:1px solid var(--border2); }
  .ar-btn-ghost:hover { background:var(--border2); color:var(--text); }
  .ar-btn-sm { padding:5px 10px; font-size:11px; }

  /* ── Section card ── */
  .ar-section { background:var(--surface); border:1px solid var(--border); border-radius:14px; overflow:hidden; margin-bottom:20px; }
  .ar-section-head {
    display:flex; align-items:center; justify-content:space-between;
    padding:14px 20px;
    background:linear-gradient(90deg, var(--purple) 0%, #4f1ea8 100%);
  }
  .ar-section-head.green-head { background:linear-gradient(90deg,#15803d 0%,#166534 100%); }
  .ar-section-title {
    display:flex; align-items:center; gap:8px;
    font-family:'Syne',sans-serif; font-weight:700; font-size:14px; color:#fff;
  }
  .ar-top-actions { display:flex; gap:8px; align-items:center; }

  /* ── Empty ── */
  .ar-empty { padding:40px 20px; text-align:center; color:var(--muted); font-size:13px; }

  /* ── Table ── */
  .ar-table { width:100%; border-collapse:collapse; }
  .ar-table thead tr { background:var(--card); border-bottom:1px solid var(--border); }
  .ar-table th {
    padding:10px 16px; text-align:left;
    font-size:10px; font-weight:700; letter-spacing:.08em;
    color:var(--muted); text-transform:uppercase;
  }
  .ar-table tbody tr { border-bottom:1px solid var(--border); transition:background .15s; }
  .ar-table tbody tr:last-child { border-bottom:none; }
  .ar-table tbody tr:hover { background:var(--card); }
  .ar-table td { padding:12px 16px; font-size:13px; vertical-align:middle; }

  /* ── Avatar ── */
  .ar-avatar {
    width:32px; height:32px; border-radius:50%;
    display:inline-flex; align-items:center; justify-content:center;
    font-size:12px; font-weight:700; color:#fff; flex-shrink:0;
  }
  .av-j{background:#0d6efd} .av-k{background:#dc3545} .av-m{background:#198754}
  .av-default{background:#6f42c1}
  .ar-name-cell { display:flex; align-items:center; gap:10px; }

  /* ── Badges ── */
  .ar-badge { display:inline-flex; align-items:center; padding:3px 9px; border-radius:20px; font-size:11px; font-weight:600; }
  .badge-hr   { background:rgba(13,110,253,.18); color:#60a5fa; }
  .badge-besu { background:rgba(239,68,68,.15);  color:#f87171; }
  .badge-treas{ background:rgba(34,197,94,.13);  color:#4ade80; }
  .badge-pos  { background:var(--accentlow);     color:var(--accent2); }
  .badge-group{ background:var(--card); color:var(--muted2); border:1px solid var(--border2); }
  .badge-role { background:rgba(124,58,237,.18); color:#a78bfa; }

  /* ── Status ── */
  .ar-status {
    display:inline-flex; align-items:center; gap:5px;
    padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600;
    background:var(--greenlow); color:var(--green);
  }
  .ar-status .dot { width:6px; height:6px; border-radius:50%; background:var(--green); display:inline-block; }

  /* ── Icon buttons ── */
  .ar-icon-btns { display:flex; align-items:center; gap:8px; }
  .ar-icon-btn {
    width:30px; height:30px; border-radius:7px;
    display:inline-flex; align-items:center; justify-content:center;
    cursor:pointer; border:none; transition:all .16s; background:transparent;
  }
  .ar-icon-btn:hover { transform:scale(1.12); }
  .ibtn-edit{ color:#4ade80; } .ibtn-edit:hover{ background:var(--greenlow); }
  .ibtn-view{ color:#60a5fa; } .ibtn-view:hover{ background:rgba(96,165,250,.13); }
  .ibtn-del { color:#f87171; } .ibtn-del:hover { background:var(--redlow); }

  /* ── Modal overlay ── */
  .ar-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,.72);
    backdrop-filter:blur(4px); display:flex; align-items:center;
    justify-content:center; z-index:1000;
    animation:arFadeIn .18s;
  }
  @keyframes arFadeIn { from{opacity:0} to{opacity:1} }
  .ar-modal {
    background:#1a1410; border:1px solid var(--border2);
    border-radius:18px; width:520px; max-width:95vw;
    max-height:88vh; overflow-y:auto;
    box-shadow:0 24px 60px rgba(0,0,0,.65);
    animation:arSlideUp .2s cubic-bezier(.22,.68,0,1.2);
  }
  @keyframes arSlideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
  .ar-modal-head {
    padding:22px 24px 16px;
    background:linear-gradient(135deg, var(--purple) 0%, #3b0f8c 100%);
    border-radius:18px 18px 0 0; position:relative;
  }
  .ar-modal-head.green-mhead { background:linear-gradient(135deg,#1a6b3c 0%,#0f4226 100%); }
  .ar-modal-head h2 { font-family:'Syne',sans-serif; font-size:18px; font-weight:800; color:#fff; }
  .ar-modal-head p  { font-size:12px; color:rgba(255,255,255,.65); margin-top:3px; }
  .ar-modal-close {
    position:absolute; top:16px; right:16px;
    width:28px; height:28px; border-radius:50%;
    background:rgba(255,255,255,.1); border:none; color:#fff;
    font-size:16px; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    transition:background .15s;
  }
  .ar-modal-close:hover { background:rgba(255,255,255,.22); }
  .ar-modal-body   { padding:22px 24px; }
  .ar-modal-footer {
    padding:16px 24px; border-top:1px solid var(--border);
    display:flex; align-items:center; justify-content:flex-end; gap:10px;
  }

  /* ── Form ── */
  .ar-form-group  { margin-bottom:18px; }
  .ar-form-label  { font-size:12px; font-weight:600; color:var(--muted2); margin-bottom:6px; display:block; letter-spacing:.04em; text-transform:uppercase; }
  .ar-input {
    width:100%; padding:10px 14px;
    background:var(--card); border:1px solid var(--border2);
    border-radius:9px; color:var(--text); font-size:13px;
    font-family:'DM Sans',sans-serif;
    transition:border-color .15s, box-shadow .15s; outline:none;
  }
  .ar-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(232,101,10,.15); }
  .ar-input::placeholder { color:var(--muted); }
  textarea.ar-input { resize:vertical; min-height:70px; }
  select.ar-input { cursor:pointer; }

  /* ── Search ── */
  .ar-search-wrap { position:relative; }
  .ar-search-wrap .ar-search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--muted); pointer-events:none; }
  .ar-search-wrap .ar-input { padding-left:36px; }

  /* ── Staff picker list ── */
  .ar-staff-list {
    border:1px solid var(--border); border-radius:9px;
    overflow:hidden; max-height:200px; overflow-y:auto; margin-top:8px;
  }
  .ar-staff-item {
    display:flex; align-items:center; gap:12px;
    padding:10px 14px; cursor:pointer; transition:background .14s;
    border-bottom:1px solid var(--border);
  }
  .ar-staff-item:last-child { border-bottom:none; }
  .ar-staff-item:hover { background:var(--card); }
  .ar-staff-item.selected { background:var(--accentlow); }
  .ar-staff-info { flex:1; }
  .ar-staff-name  { font-size:13px; font-weight:600; }
  .ar-staff-email { font-size:11px; color:var(--muted); }
  .ar-staff-tags  { display:flex; gap:4px; margin-top:3px; }
  .ar-check {
    width:18px; height:18px; border-radius:4px;
    border:2px solid var(--border2); flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
  }
  .ar-check.checked { background:var(--accent); border-color:var(--accent); }

  /* ── Permissions grid ── */
  .ar-perm-modal { width:700px; }
  .ar-perm-grid  { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
  .ar-perm-card  { background:var(--card); border:1px solid var(--border); border-radius:11px; padding:14px; transition:border-color .15s; }
  .ar-perm-card:hover { border-color:var(--border2); }
  .ar-perm-card-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
  .ar-perm-card-label { display:flex; align-items:center; gap:8px; }
  .ar-perm-icon { width:30px; height:30px; border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; color:#fff; }
  .pi-d{background:#0d6efd} .pi-r{background:#198754} .pi-doc{background:#6f42c1}
  .pi-h{background:#fd7e14} .pi-b{background:#dc3545} .pi-t{background:#20c997}
  .pi-o{background:#0dcaf0} .pi-s{background:#6610f2} .pi-c{background:#d63384}
  .pi-ss{background:#28a745} .pi-cc{background:#17a2b8} .pi-p{background:#795548}
  .ar-perm-name { font-size:12px; font-weight:700; color:var(--text); }
  .ar-perm-type { font-size:10px; color:var(--muted); }
  .ar-subsections { margin-top:8px; padding-left:4px; }
  .ar-sub-item { display:flex; align-items:center; justify-content:space-between; margin-bottom:7px; }
  .ar-sub-label { display:flex; align-items:center; gap:6px; font-size:11px; color:var(--muted2); }
  .ar-sub-dot   { width:5px; height:5px; border-radius:50%; background:var(--green); }

  /* ── Toggle ── */
  .ar-toggle { position:relative; width:38px; height:21px; flex-shrink:0; cursor:pointer; }
  .ar-toggle input { opacity:0; width:0; height:0; position:absolute; }
  .ar-toggle-track { position:absolute; inset:0; border-radius:99px; background:var(--border2); transition:.2s; }
  .ar-toggle input:checked + .ar-toggle-track { background:var(--green); }
  .ar-toggle-thumb { position:absolute; top:3px; left:3px; width:15px; height:15px; border-radius:50%; background:#fff; transition:.2s; pointer-events:none; }
  .ar-toggle input:checked ~ .ar-toggle-thumb { left:20px; }

  /* ── Scrollbar ── */
  .ar ::-webkit-scrollbar       { width:5px; height:5px; }
  .ar ::-webkit-scrollbar-track { background:var(--bg); }
  .ar ::-webkit-scrollbar-thumb { background:var(--border2); border-radius:3px; }
`;

// ─── Static module definitions ─────────────────────────────────────────────
const MODULES = [
    {
        id: "dashboard", label: "Dashboard", type: "Single module", icon: "D", cls: "pi-d", defaultOn: true,
        subs: []
    },
    {
        id: "residents", label: "Residents", type: "Multiple sections", icon: "R", cls: "pi-r", defaultOn: true,
        subs: [{ label: "Main Records", on: true }, { label: "Verification", on: true }, { label: "Disabled Residents", on: false }]
    },
    {
        id: "documents", label: "Documents", type: "Multiple sections", icon: "D", cls: "pi-doc", defaultOn: true,
        subs: [{ label: "Document Requests", on: false }, { label: "Document Records", on: false }]
    },
    { id: "household", label: "Household", type: "Single module", icon: "H", cls: "pi-h", defaultOn: false, subs: [] },
    { id: "blotter", label: "Blotter", type: "Single module", icon: "B", cls: "pi-b", defaultOn: false, subs: [] },
    { id: "treasurer", label: "Treasurer", type: "Single module", icon: "T", cls: "pi-t", defaultOn: false, subs: [] },
    { id: "officials", label: "Officials", type: "Single module", icon: "O", cls: "pi-o", defaultOn: false, subs: [] },
    { id: "staff", label: "Staff", type: "Single module", icon: "S", cls: "pi-s", defaultOn: false, subs: [] },
    { id: "communication", label: "Communication", type: "Single module", icon: "C", cls: "pi-c", defaultOn: false, subs: [] },
    {
        id: "social", label: "Social Services", type: "Multiple sections", icon: "S", cls: "pi-ss", defaultOn: true,
        subs: [{ label: "Programs", on: true }]
    },
    { id: "command", label: "Command Center", type: "Single module", icon: "C", cls: "pi-cc", defaultOn: false, subs: [] },
    { id: "projects", label: "Projects", type: "Single module", icon: "P", cls: "pi-p", defaultOn: false, subs: [] },
];

// Avatar helper — maps first letter to a colour class; falls back to purple
const AVATAR_COLORS = { J: "av-j", K: "av-k", M: "av-m" };
function avatarClass(name = "") {
    return AVATAR_COLORS[name[0]?.toUpperCase()] ?? "av-default";
}

// ─── Sub-components ────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
    return (
        <label className="ar-toggle">
            <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
            <span className="ar-toggle-track" />
            <span className="ar-toggle-thumb" />
        </label>
    );
}

// SVG icons (inline, no extra dependency)
const IconUsers = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const IconShield = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
const IconEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const IconTrash = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" /></svg>;
const IconEye = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
const IconSearch = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>;
const IconCheck = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>;

// ─── Create Group Modal ────────────────────────────────────────────────────
function CreateGroupModal({ staffList, onClose, onNext }) {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState([]);

    const filtered = staffList.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.email ?? "").toLowerCase().includes(search.toLowerCase())
    );
    const toggle = id => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

    return (
        <div className="ar-overlay" onClick={onClose}>
            <div className="ar-modal" onClick={e => e.stopPropagation()}>
                <div className="ar-modal-head">
                    <h2>Create Staff Group</h2>
                    <p>Create a group with shared permissions for staff members</p>
                    <button className="ar-modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="ar-modal-body">
                    <div className="ar-form-group">
                        <label className="ar-form-label">Group Name *</label>
                        <input className="ar-input" placeholder="e.g., Finance Team, HR Department"
                            value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="ar-form-group">
                        <label className="ar-form-label">Description</label>
                        <textarea className="ar-input" placeholder="Optional description for this group"
                            value={desc} onChange={e => setDesc(e.target.value)} />
                    </div>
                    <div className="ar-form-group">
                        <label className="ar-form-label">Select Staff Members</label>
                        <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>
                            Choose staff members to assign to this group (optional)
                        </p>
                        <div className="ar-search-wrap">
                            <span className="ar-search-icon"><IconSearch /></span>
                            <input className="ar-input" placeholder="Search staff by name, email, department, or position…"
                                value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div className="ar-staff-list">
                            {filtered.map(s => (
                                <div key={s.id}
                                    className={`ar-staff-item${selected.includes(s.id) ? " selected" : ""}`}
                                    onClick={() => toggle(s.id)}>
                                    <span className={`ar-avatar ${avatarClass(s.name)}`}>{s.name[0]}</span>
                                    <div className="ar-staff-info">
                                        <div className="ar-staff-name">{s.name}</div>
                                        <div className="ar-staff-email">{s.email}</div>
                                        <div className="ar-staff-tags">
                                            {s.department && <span className="ar-badge badge-hr">{s.department}</span>}
                                            {s.position && <span className="ar-badge badge-pos">{s.position}</span>}
                                        </div>
                                    </div>
                                    <div className={`ar-check${selected.includes(s.id) ? " checked" : ""}`}>
                                        {selected.includes(s.id) && <IconCheck />}
                                    </div>
                                </div>
                            ))}
                            {filtered.length === 0 && (
                                <div style={{ padding: "16px", textAlign: "center", color: "var(--muted)", fontSize: 12 }}>No staff found</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="ar-modal-footer">
                    <button className="ar-btn ar-btn-ghost" onClick={onClose}>Cancel</button>
                    <button className="ar-btn ar-btn-accent" disabled={!name.trim()}
                        onClick={() => onNext(name, desc, selected)}>
                        Next: Set Permissions →
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Create / Edit User Modal ──────────────────────────────────────────────
function UserModal({ user, roles, onClose }) {
    const [form, setForm] = useState({
        name: user?.name ?? "",
        email: user?.email ?? "",
        role: user?.role ?? (roles[0]?.name ?? ""),
        password: "",
    });
    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
    const isEdit = !!user;

    return (
        <div className="ar-overlay" onClick={onClose}>
            <div className="ar-modal" onClick={e => e.stopPropagation()}>
                <div className="ar-modal-head">
                    <h2>{isEdit ? "Edit User" : "Create New User"}</h2>
                    <p>{isEdit ? `Updating account for ${user.name}` : "Add a new system user account"}</p>
                    <button className="ar-modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="ar-modal-body">
                    <div className="ar-form-group">
                        <label className="ar-form-label">Full Name *</label>
                        <input className="ar-input" placeholder="e.g., Juan dela Cruz"
                            value={form.name} onChange={e => set("name", e.target.value)} />
                    </div>
                    <div className="ar-form-group">
                        <label className="ar-form-label">Email *</label>
                        <input className="ar-input" type="email" placeholder="user@example.com"
                            value={form.email} onChange={e => set("email", e.target.value)} />
                    </div>
                    <div className="ar-form-group">
                        <label className="ar-form-label">Role *</label>
                        <select className="ar-input" value={form.role} onChange={e => set("role", e.target.value)}>
                            {roles.map(r => <option key={r.id ?? r.name} value={r.name}>{r.name}</option>)}
                        </select>
                    </div>
                    <div className="ar-form-group">
                        <label className="ar-form-label">{isEdit ? "New Password (leave blank to keep)" : "Password *"}</label>
                        <input className="ar-input" type="password" placeholder="••••••••"
                            value={form.password} onChange={e => set("password", e.target.value)} />
                    </div>
                </div>
                <div className="ar-modal-footer">
                    <button className="ar-btn ar-btn-ghost" onClick={onClose}>Cancel</button>
                    <button className="ar-btn ar-btn-accent" onClick={onClose}>
                        {isEdit ? "Save Changes" : "Create User"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Permissions Modal ─────────────────────────────────────────────────────
function PermissionsModal({ target, onClose }) {
    const [perms, setPerms] = useState(() =>
        Object.fromEntries(MODULES.map(m => [m.id, m.defaultOn]))
    );
    const [subs, setSubs] = useState(() =>
        Object.fromEntries(
            MODULES.filter(m => m.subs.length > 0)
                .map(m => [m.id, Object.fromEntries(m.subs.map(s => [s.label, s.on]))])
        )
    );

    return (
        <div className="ar-overlay" onClick={onClose}>
            <div className="ar-modal ar-perm-modal" onClick={e => e.stopPropagation()}>
                <div className="ar-modal-head green-mhead">
                    <h2>Edit Module Permissions</h2>
                    <p>Editing permissions for {target}</p>
                    <button className="ar-modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="ar-modal-body">
                    <div className="ar-perm-grid">
                        {MODULES.map(m => (
                            <div className="ar-perm-card" key={m.id}>
                                <div className="ar-perm-card-head">
                                    <div className="ar-perm-card-label">
                                        <div className={`ar-perm-icon ${m.cls}`}>{m.icon}</div>
                                        <div>
                                            <div className="ar-perm-name">{m.label}</div>
                                            <div className="ar-perm-type">{m.type}</div>
                                        </div>
                                    </div>
                                    <Toggle checked={!!perms[m.id]} onChange={v => setPerms(p => ({ ...p, [m.id]: v }))} />
                                </div>
                                {m.subs.length > 0 && perms[m.id] && (
                                    <div className="ar-subsections">
                                        <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>
                                            Sub-sections:
                                        </div>
                                        {m.subs.map((sub, i) => (
                                            <div key={i} className="ar-sub-item">
                                                <div className="ar-sub-label"><span className="ar-sub-dot" />{sub.label}</div>
                                                <Toggle
                                                    checked={!!(subs[m.id] && subs[m.id][sub.label])}
                                                    onChange={v => setSubs(p => ({ ...p, [m.id]: { ...p[m.id], [sub.label]: v } }))}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="ar-modal-footer">
                    <button className="ar-btn ar-btn-ghost" onClick={onClose}>Cancel</button>
                    <button className="ar-btn ar-btn-accent" onClick={onClose}>Save Permissions</button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
/**
 * Props (passed from Laravel controller via Inertia):
 *   auth    – { user: { name, email, ... } }
 *   users   – Array<{ id, name, email, role, department?, position?, status? }>
 *   roles   – Array<{ id, name }> — if empty, preset roles are shown
 *   groups  – Array<{ id, name, member_count? }> — existing staff groups
 */
export default function AccessRoles({ auth, users = [], roles = [], groups: initialGroups = [] }) {

    // ── local UI state ──
    const [groups, setGroups] = useState(initialGroups);
    const [showDeact, setShowDeact] = useState(false);

    // modals
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);   // null = create
    const [showPerms, setShowPerms] = useState(false);
    const [permTarget, setPermTarget] = useState("");

    const openPerms = name => { setPermTarget(name); setShowPerms(true); };

    const handleGroupNext = (name, desc, selected) => {
        setShowCreateGroup(false);
        setGroups(p => [...p, { id: Date.now(), name, member_count: selected.length }]);
        openPerms(name);
    };

    const openCreateUser = () => { setEditingUser(null); setShowUserModal(true); };
    const openEditUser = user => { setEditingUser(user); setShowUserModal(true); };

    // Preset roles shown when controller sends no roles
    const displayRoles = roles.length > 0
        ? roles
        : [
            { id: 1, name: "Super Admin" },
            { id: 2, name: "Dean" },
            { id: 3, name: "Faculty" },
            { id: 4, name: "Student" },
        ];

    const staffList = users.length > 0 ? users : [
        { id: 1, name: "James Marc Puada", email: "jamespuada0@gmail.com", department: "hr", position: "Gmac" },
        { id: 2, name: "Kristine Ortega", email: "jericwinner000@gmail.com", department: "besu", position: "social_service" },
        { id: 3, name: "Mylene Yabao", email: "myleneyabao95@gmail.com", department: "Treasury", position: "treasurer" },
    ];

    const visibleStaff = showDeact ? staffList : staffList.filter(s => s.status !== "inactive");

    return (
        <AppLayout title="Access & Roles" user={auth.user}>
            <Head title="Access & Roles" />
            <style>{css}</style>

            <div className="ar">

                {/* ── Page Header ── */}
                <div className="ar-ph">
                    <div>
                        <div className="ar-ph-title"><IconShield /> Access &amp; Roles</div>
                        <p className="ar-ph-sub">Manage system users, staff groups, and module permissions.</p>
                    </div>
                    <button className="ar-btn ar-btn-accent" onClick={openCreateUser}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        New User
                    </button>
                </div>

                {/* ── Staff Groups ── */}
                <div className="ar-section">
                    <div className="ar-section-head">
                        <div className="ar-section-title">
                            <IconUsers /> Staff Groups ({groups.length})
                        </div>
                        <button className="ar-btn ar-btn-accent ar-btn-sm" onClick={() => setShowCreateGroup(true)}>
                            + Create Group
                        </button>
                    </div>

                    {groups.length === 0 ? (
                        <div className="ar-empty">
                            No staff groups created yet. Create a group to assign shared permissions to staff members.
                        </div>
                    ) : (
                        <table className="ar-table">
                            <thead>
                                <tr>
                                    <th>Group Name</th>
                                    <th>Members</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groups.map(g => (
                                    <tr key={g.id}>
                                        <td><span className="ar-badge badge-pos">{g.name}</span></td>
                                        <td><span style={{ color: "var(--muted)", fontSize: 12 }}>{g.member_count ?? 0} members</span></td>
                                        <td>
                                            <div className="ar-icon-btns">
                                                <button className="ar-icon-btn ibtn-edit" title="Edit permissions" onClick={() => openPerms(g.name)}>
                                                    <IconEdit />
                                                </button>
                                                <button className="ar-icon-btn ibtn-del" title="Delete"
                                                    onClick={() => setGroups(p => p.filter(x => x.id !== g.id))}>
                                                    <IconTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* ── System Users ── */}
                <div className="ar-section">
                    <div className="ar-section-head green-head">
                        <div className="ar-section-title">
                            <IconUsers /> Staff Members ({visibleStaff.length})
                        </div>
                        <div className="ar-top-actions">
                            <button className="ar-btn ar-btn-ghost ar-btn-sm" onClick={() => setShowDeact(p => !p)}>
                                {showDeact ? "✕ Hide" : "⊙ Show"} Deactivated
                            </button>
                            <button className="ar-btn ar-btn-ghost ar-btn-sm">↺ Refresh</button>
                            <button className="ar-btn ar-btn-accent ar-btn-sm" onClick={openCreateUser}>
                                + Create Staff Account
                            </button>
                        </div>
                    </div>

                    <table className="ar-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Position</th>
                                <th>Group</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleStaff.map(u => (
                                <tr key={u.id}>
                                    <td>
                                        <div className="ar-name-cell">
                                            <span className={`ar-avatar ${avatarClass(u.name)}`}>{u.name[0]}</span>
                                            <span style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</span>
                                        </div>
                                    </td>
                                    <td><span style={{ color: "var(--muted2)", fontSize: 12 }}>{u.email}</span></td>
                                    <td>
                                        {u.department
                                            ? <span className="ar-badge badge-hr">{u.department}</span>
                                            : <span style={{ color: "var(--muted)", fontSize: 12 }}>—</span>}
                                    </td>
                                    <td>
                                        {u.position
                                            ? <span className="ar-badge badge-pos">{u.position}</span>
                                            : <span style={{ color: "var(--muted)", fontSize: 12 }}>—</span>}
                                    </td>
                                    <td><span className="ar-badge badge-group">No group</span></td>
                                    <td>
                                        {u.role
                                            ? <span className="ar-badge badge-role">{u.role}</span>
                                            : <span style={{ color: "var(--muted)", fontSize: 12 }}>—</span>}
                                    </td>
                                    <td>
                                        <span className="ar-status"><span className="dot" />
                                            {u.status === "inactive" ? "Inactive" : "Active"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="ar-icon-btns">
                                            <button className="ar-icon-btn ibtn-edit" title="Edit permissions" onClick={() => openPerms(u.name)}>
                                                <IconEdit />
                                            </button>
                                            <button className="ar-icon-btn ibtn-view" title="View user" onClick={() => openEditUser(u)}>
                                                <IconEye />
                                            </button>
                                            <button className="ar-icon-btn ibtn-del" title="Delete">
                                                <IconTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {visibleStaff.length === 0 && (
                                <tr><td colSpan="8" style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>No staff members found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── Roles & Permissions Reference ── */}
                <div className="ar-section">
                    <div className="ar-section-head" style={{ background: "linear-gradient(90deg,#1e40af 0%,#1e3a8a 100%)" }}>
                        <div className="ar-section-title">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            Roles &amp; Permissions
                        </div>
                    </div>
                    <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12 }}>
                        {displayRoles.map(r => (
                            <div key={r.id ?? r.name}
                                style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 9,
                                    background: "var(--card)"
                                }}>
                                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{r.name}</span>
                                <button className="ar-icon-btn ibtn-edit" title="Edit role">
                                    <IconEdit />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* ── Modals ── */}
            {showCreateGroup && (
                <CreateGroupModal
                    staffList={staffList}
                    onClose={() => setShowCreateGroup(false)}
                    onNext={handleGroupNext}
                />
            )}
            {showUserModal && (
                <UserModal
                    user={editingUser}
                    roles={displayRoles}
                    onClose={() => setShowUserModal(false)}
                />
            )}
            {showPerms && (
                <PermissionsModal
                    target={permTarget}
                    onClose={() => setShowPerms(false)}
                />
            )}

        </AppLayout>
    );
}