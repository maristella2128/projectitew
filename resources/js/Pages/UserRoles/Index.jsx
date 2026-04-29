import { useState } from "react";
import Sidebar from "../../Components/Sidebar";
import Topbar from "../../Components/Topbar";
import { usePage, useForm, router } from '../../inertia-adapter';

// ─── Static data ───────────────────────────────────────────────────────────
const crud = (id, noun, addLabel = "Add") => [
    { id: `${id}_view`, name: `View ${noun}`, enabled: true },
    { id: `${id}_add`, name: `${addLabel} ${noun}`, enabled: true },
    { id: `${id}_edit`, name: `Edit ${noun}`, enabled: true },
    { id: `${id}_del`, name: `Delete ${noun}`, enabled: true },
];

const MODULES = [
    { id: "main", name: "Main (Dashboard)", icon: "D", color: "#22c55e", bg: "rgba(34,197,94,.18)", type: "Main", enabled: true, sub: [] },
    // Management
    { id: "mgt_students", name: "All Students", icon: "S", color: "#60a5fa", bg: "rgba(96,165,250,.18)", type: "Management", enabled: true, sub: crud("stu", "Student") },
    { id: "mgt_adms", name: "Admissions", icon: "A", color: "#60a5fa", bg: "rgba(96,165,250,.18)", type: "Management", enabled: true, sub: crud("adm", "Admission") },
    { id: "mgt_secs", name: "Sections", icon: "L", color: "#60a5fa", bg: "rgba(96,165,250,.18)", type: "Management", enabled: true, sub: crud("sec", "Section", "Create") },
    { id: "mgt_schs", name: "Schedules", icon: "C", color: "#60a5fa", bg: "rgba(96,165,250,.18)", type: "Management", enabled: true, sub: crud("sch", "Schedule", "Create") },
    { id: "mgt_docs", name: "Documents", icon: "F", color: "#60a5fa", bg: "rgba(96,165,250,.18)", type: "Management", enabled: true, sub: crud("doc", "Document", "Upload") },
    // Academic
    { id: "acad_rec", name: "Academic Records Overview", icon: "O", color: "#f59e0b", bg: "rgba(245,158,11,.18)", type: "Academic", enabled: true, sub: crud("rec", "Record") },
    { id: "acad_grd", name: "Grades", icon: "G", color: "#f59e0b", bg: "rgba(245,158,11,.18)", type: "Academic", enabled: true, sub: crud("grd", "Grade") },
    { id: "acad_enr", name: "Enrollment History", icon: "H", color: "#f59e0b", bg: "rgba(245,158,11,.18)", type: "Academic", enabled: true, sub: crud("enr", "History") },
    { id: "acad_att", name: "Attendance", icon: "P", color: "#f59e0b", bg: "rgba(245,158,11,.18)", type: "Academic", enabled: true, sub: crud("att", "Attendance") },
    { id: "acad_hlt", name: "Health Records", icon: "M", color: "#f59e0b", bg: "rgba(245,158,11,.18)", type: "Academic", enabled: true, sub: crud("hlt", "Health Record") },
    { id: "acad_ach", name: "Achievements", icon: "T", color: "#f59e0b", bg: "rgba(245,158,11,.18)", type: "Academic", enabled: true, sub: crud("ach", "Achievement") },
    { id: "acad_beh", name: "Behavior Logs", icon: "B", color: "#f59e0b", bg: "rgba(245,158,11,.18)", type: "Academic", enabled: true, sub: crud("beh", "Log") },
    // Communications
    { id: "comm_ann", name: "Announcements", icon: "N", color: "#a78bfa", bg: "rgba(167,139,250,.18)", type: "Communications", enabled: true, sub: crud("ann", "Announcement", "Post") },
];

const PALETTES = [
    { bg: "rgba(249,115,22,0.14)", border: "rgba(249,115,22,0.38)", text: "#fb923c" },
    { bg: "rgba(96,165,250,0.14)", border: "rgba(96,165,250,0.38)", text: "#60a5fa" },
    { bg: "rgba(34,197,94,0.14)", border: "rgba(34,197,94,0.38)", text: "#4ade80" },
    { bg: "rgba(167,139,250,0.14)", border: "rgba(167,139,250,0.38)", text: "#a78bfa" },
    { bg: "rgba(239,68,68,0.14)", border: "rgba(239,68,68,0.38)", text: "#fca5a5" },
];
const pal = id => PALETTES[id % PALETTES.length];
const init = (n = "") => n.split(" ").map(w => w[0] || "").join("").toUpperCase().slice(0, 2);

// ─── Icons ─────────────────────────────────────────────────────────────────
const IShield = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
const IUsers = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m9-4a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm6 4v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" /></svg>;
const IPlus = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const ISearch = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>;
const IX = ({ s = 13 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 18L18 6M6 6l12 12" /></svg>;
const IEdit = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 1 1 3.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
const ITrash = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" /></svg>;
const IEye = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const ILock = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
const IRefresh = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15" /></svg>;
const ICheck = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>;
const IChev = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 9l-7 7-7-7" /></svg>;
const IWarn = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg>;
const IRight = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>;

// ─── Toggle ────────────────────────────────────────────────────────────────
function Toggle({ on, onChange, small, disabled }) {
    const w = small ? 32 : 38, h = small ? 17 : 20, tw = small ? 11 : 14;
    return (
        <button type="button" onClick={() => !disabled && onChange?.(!on)} style={{
            position: "relative", width: w, height: h, borderRadius: 99,
            background: on ? "var(--primary)" : "color-mix(in srgb, var(--primary), transparent 82%)",
            border: `1px solid ${on ? "color-mix(in srgb, var(--primary), transparent 40%)" : "color-mix(in srgb, var(--primary), transparent 80%)"}`,
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? .45 : 1, flexShrink: 0, padding: 0,
            transition: "background .2s, border-color .2s",
        }}>
            <span style={{
                position: "absolute", top: 3, left: on ? (w - tw - 3) : 3,
                width: tw, height: tw, borderRadius: "50%",
                background: "#fff", transition: "left .2s",
                boxShadow: "0 1px 4px rgba(0,0,0,.3)", display: "block",
            }} />
        </button>
    );
}

// ─── Shared modal styles ───────────────────────────────────────────────────
const Tag = ({ children, bg, color, border }) => (
    <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 9px", borderRadius: 4, letterSpacing: ".08em", textTransform: "uppercase", background: bg, color, border: `1px solid ${border || "transparent"}`, fontFamily: "'DM Sans',sans-serif" }}>{children}</span>
);
const OV = { position: "fixed", inset: 0, zIndex: 1000, background: "rgba(5,2,0,.8)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 };
const MOD = mw => ({ background: "linear-gradient(145deg,color-mix(in srgb, var(--primary), transparent 93%),rgba(0,0,0,0.55))", border: "1px solid color-mix(in srgb, var(--primary), transparent 78%)", borderRadius: 18, width: "100%", maxWidth: mw, maxHeight: "90vh", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,.8)", display: "flex", flexDirection: "column" });
const MH = { padding: "20px 24px 16px", borderBottom: "1px solid color-mix(in srgb, var(--primary), transparent 90%)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexShrink: 0, background: "color-mix(in srgb, var(--primary), transparent 96%)" };
const MT = { fontSize: 16, fontWeight: 700, color: "#fef3ec", fontFamily: "'Playfair Display',serif" };
const MS = { fontSize: 11, color: "rgba(254,243,236,0.38)", marginTop: 3, fontFamily: "'DM Sans',sans-serif" };
const MB = { padding: "20px 24px", overflowY: "auto", flex: 1 };
const MF = { padding: "14px 24px", borderTop: "1px solid color-mix(in srgb, var(--primary), transparent 90%)", display: "flex", gap: 10, justifyContent: "flex-end", flexShrink: 0, background: "color-mix(in srgb, var(--primary), transparent 97%)" };
const CB = { width: 28, height: 28, borderRadius: 8, border: "1px solid color-mix(in srgb, var(--primary), transparent 80%)", background: "color-mix(in srgb, var(--primary), transparent 93%)", color: "rgba(254,243,236,0.5)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
const UIR = { display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", background: "color-mix(in srgb, var(--primary), transparent 93%)", border: "1px solid color-mix(in srgb, var(--primary), transparent 84%)", borderRadius: 12, marginBottom: 20 };
const MICON = { width: 34, height: 34, borderRadius: 9, background: "color-mix(in srgb, var(--primary), transparent 86%)", border: "1px solid color-mix(in srgb, var(--primary), transparent 70%)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", flexShrink: 0 };
const LBL = { display: "block", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "color-mix(in srgb, var(--primary), transparent 45%)", marginBottom: 6, fontFamily: "'DM Sans',sans-serif" };
const INP = { width: "100%", padding: "9px 13px", borderRadius: 10, border: "1px solid color-mix(in srgb, var(--primary), transparent 80%)", background: "color-mix(in srgb, var(--primary), transparent 94%)", color: "#fef3ec", fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", transition: "border-color .15s" };
const BPRIM = { display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, background: "linear-gradient(135deg,var(--primary),var(--secondary))", border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px color-mix(in srgb, var(--primary), transparent 70%)", fontFamily: "'DM Sans',sans-serif", transition: "all .15s" };
const BCANC = { padding: "9px 16px", borderRadius: 10, background: "color-mix(in srgb, var(--primary), transparent 93%)", border: "1px solid color-mix(in srgb, var(--primary), transparent 82%)", color: "rgba(254,243,236,0.55)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" };

// ─── Status Pill ──────────────────────────────────────────────────────────
function SPill({ label, type }) {
    const m = {
        dean: { bg: "rgba(249,115,22,0.18)", color: "#fb923c", border: "rgba(249,115,22,0.38)" },
        professor: { bg: "rgba(96,165,250,0.14)", color: "#60a5fa", border: "rgba(96,165,250,0.38)" },
        secretary: { bg: "rgba(167,139,250,0.14)", color: "#a78bfa", border: "rgba(167,139,250,0.38)" },
        students: { bg: "rgba(34,197,94,0.12)", color: "#4ade80", border: "rgba(34,197,94,0.3)" },
        student:  { bg: "rgba(34,197,94,0.12)", color: "#4ade80", border: "rgba(34,197,94,0.3)" },
        viewer:   { bg: "rgba(148,163,184,0.1)", color: "#94a3b8", border: "rgba(148,163,184,0.25)" },
        active: { bg: "rgba(34,197,94,0.12)", color: "#4ade80", border: "rgba(34,197,94,0.3)" },
        inactive: { bg: "rgba(148,163,184,0.1)", color: "#94a3b8", border: "rgba(148,163,184,0.25)" },
    };
    const s = m[type.toLowerCase()] || m.viewer;
    return <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: s.bg, color: s.color, border: `1px solid ${s.border}`, textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</span>;
}

// ─── Custom Select ────────────────────────────────────────────────────────
function CustomSelect({ value, options, onChange, label, error }) {
    const [open, setOpen] = useState(false);
    const selected = options.find(o => o.value === value);

    return (
        <div style={{ position: "relative" }}>
            {label && <label style={LBL}>{label}</label>}
            <div
                onClick={() => setOpen(!open)}
                style={{ ...INP, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", borderColor: open ? "var(--primary)" : INP.borderColor }}
            >
                <span style={{ color: selected ? "#fef3ec" : "rgba(254,243,236,0.3)" }}>{selected ? selected.label : "Select option..."}</span>
                <span style={{ color: "rgba(254,243,236,0.3)", transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: "flex" }}><IChev /></span>
            </div>

            {open && (
                <>
                    <div style={{ position: "fixed", inset: 0, zIndex: 100 }} onClick={() => setOpen(false)} />
                    <div style={{
                        position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
                        background: "#161109", border: "1px solid rgba(249,115,22,0.25)",
                        borderRadius: 12, overflow: "hidden", zIndex: 101, boxShadow: "0 12px 30px rgba(0,0,0,0.6)",
                        padding: 4
                    }}>
                        {options.map(o => (
                            <div
                                key={o.value}
                                onClick={() => { onChange(o.value); setOpen(false); }}
                                style={{
                                    padding: "9px 12px", fontSize: 13, color: o.value === value ? "var(--primary)" : "#fef3ec", cursor: "pointer",
                                    background: o.value === value ? "color-mix(in srgb, var(--primary), transparent 92%)" : "transparent",
                                    borderRadius: 8, transition: "all 0.15s", fontWeight: o.value === value ? 600 : 400
                                }}
                                onMouseEnter={e => { e.target.style.background = "color-mix(in srgb, var(--primary), transparent 88%)"; e.target.style.color = "var(--primary)"; }}
                                onMouseLeave={e => {
                                    e.target.style.background = o.value === value ? "color-mix(in srgb, var(--primary), transparent 92%)" : "transparent";
                                    e.target.style.color = o.value === value ? "var(--primary)" : "#fef3ec";
                                }}
                            >
                                {o.label}
                            </div>
                        ))}
                    </div>
                </>
            )}
            {error && <div style={{ color: "#fca5a5", fontSize: 10, marginTop: 4 }}>{error}</div>}
        </div>
    );
}

// ─── Create Group Modal ────────────────────────────────────────────────────
function CreateGroupModal({ staffList, onClose, onCreate }) {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [srch, setSrch] = useState("");
    const [sel, setSel] = useState([]);
    const filtered = staffList.filter(s => s.name.toLowerCase().includes(srch.toLowerCase()) || (s.email ?? "").toLowerCase().includes(srch.toLowerCase()));
    const tog = id => setSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
    return (
        <div style={OV} onClick={onClose}>
            <div style={MOD(560)} onClick={e => e.stopPropagation()}>
                <div style={MH}>
                    <div><div style={MT}>Create User Group</div><div style={MS}>Define a group to assign shared module permissions</div></div>
                    <button style={CB} onClick={onClose}><IX /></button>
                </div>
                <div style={MB}>
                    <div style={UIR}>
                        <div style={MICON}><IUsers /></div>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#fef3ec" }}>New Group</div>
                            <div style={{ fontSize: 11, color: "rgba(254,243,236,0.38)", marginTop: 1 }}>Members inherit this group's module permissions</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                            <label style={LBL}>Group Name <span style={{ color: "#fca5a5" }}>*</span></label>
                            <input style={INP} placeholder="e.g. IT Department, Finance Team" value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div>
                            <label style={LBL}>Description <span style={{ textTransform: "none", fontWeight: 400, color: "rgba(254,243,236,0.3)" }}>(optional)</span></label>
                            <textarea style={{ ...INP, resize: "vertical", minHeight: 64 }} placeholder="Optional description…" value={desc} onChange={e => setDesc(e.target.value)} />
                        </div>
                        <div>
                            <label style={LBL}>Select Staff Members <span style={{ textTransform: "none", fontWeight: 400, color: "rgba(254,243,236,0.3)" }}>(optional)</span></label>
                            <div style={{ position: "relative", marginBottom: 8 }}>
                                <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "rgba(254,243,236,0.3)", pointerEvents: "none" }}><ISearch /></span>
                                <input style={{ ...INP, paddingLeft: 34 }} placeholder="Search staff…" value={srch} onChange={e => setSrch(e.target.value)} />
                            </div>
                            <div style={{ border: "1px solid color-mix(in srgb, var(--primary), transparent 86%)", borderRadius: 10, overflow: "hidden", maxHeight: 220, overflowY: "auto" }}>
                                {filtered.map(s => (
                                    <div key={s.id} onClick={() => tog(s.id)} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid color-mix(in srgb, var(--primary), transparent 93%)", background: sel.includes(s.id) ? "color-mix(in srgb, var(--primary), transparent 92%)" : "transparent", transition: "background .12s" }}>
                                        <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: pal(s.id).bg, border: `1px solid ${pal(s.id).border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: pal(s.id).text }}>{init(s.name)}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: "#fef3ec" }}>{s.name}</div>
                                            <div style={{ fontSize: 11, color: "rgba(254,243,236,0.3)" }}>{s.email}</div>
                                        </div>
                                        <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${sel.includes(s.id) ? "var(--primary)" : "color-mix(in srgb, var(--primary), transparent 70%)"}`, background: sel.includes(s.id) ? "var(--primary)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .12s" }}>
                                            {sel.includes(s.id) && <ICheck />}
                                        </div>
                                    </div>
                                ))}
                                {filtered.length === 0 && <div style={{ padding: 16, textAlign: "center", color: "rgba(254,243,236,0.3)", fontSize: 12 }}>No staff found</div>}
                            </div>
                        </div>
                    </div>
                </div>
                <div style={MF}>
                    <button style={BCANC} onClick={onClose}>Cancel</button>
                    <button style={{ ...BPRIM, opacity: !name.trim() ? .45 : 1 }} disabled={!name.trim()} onClick={() => onCreate(name, desc, sel)}><IPlus /> Create Group</button>
                </div>
            </div>
        </div>
    );
}

// ─── User Modal ────────────────────────────────────────────────────────────
function UserModal({ user, roles = [], groups, onClose }) {
    const isEdit = !!user;
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: user?.name ?? "",
        email: user?.email ?? "",
        role: user?.role ?? (roles[0]?.name || "dean"),
        user_group: user?.user_group ?? "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            patch(route('user-roles.update', user.id), {
                onSuccess: () => { onClose(); reset(); },
            });
        } else {
            post(route('user-roles.store'), {
                onSuccess: () => { onClose(); reset(); },
            });
        }
    };

    return (
        <div style={OV} onClick={onClose}>
            <form onSubmit={handleSubmit} style={MOD(540)} onClick={e => e.stopPropagation()}>
                <div style={MH}>
                    <div><div style={MT}>{isEdit ? "Edit User Details" : "Add New Account"}</div><div style={MS}>{isEdit ? `Updating account for ${user.name}` : "Create a new account and assign a role"}</div></div>
                    <button type="button" style={CB} onClick={onClose}><IX /></button>
                </div>
                <div style={MB}>
                    {isEdit && (
                        <div style={{ ...UIR, marginBottom: 20 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: pal(user.id).bg, border: `1px solid ${pal(user.id).border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: pal(user.id).text }}>{init(user.name)}</div>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#fef3ec" }}>{user.name}</div>
                                <div style={{ fontSize: 11, color: "rgba(254,243,236,0.3)", fontFamily: "monospace" }}>{user.email}</div>
                            </div>
                        </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div>
                            <label style={LBL}>Full Name <span style={{ color: "#fca5a5" }}>*</span></label>
                            <input style={INP} type="text" placeholder="e.g. Juan dela Cruz" value={data.name} onChange={e => setData("name", e.target.value)} required />
                            {errors.name && <div style={{ color: "#fca5a5", fontSize: 10, marginTop: 4 }}>{errors.name}</div>}
                        </div>
                        <div>
                            <label style={LBL}>Email <span style={{ color: "#fca5a5" }}>*</span></label>
                            <input style={INP} type="email" placeholder="user@example.com" value={data.email} onChange={e => setData("email", e.target.value)} required />
                            {errors.email && <div style={{ color: "#fca5a5", fontSize: 10, marginTop: 4 }}>{errors.email}</div>}
                        </div>
                        <CustomSelect
                            label="Role"
                            value={data.role}
                            options={roles.length > 0 ? roles.map(r => ({ value: r.name, label: r.name.charAt(0).toUpperCase() + r.name.slice(1) })) : [
                                { value: "dean", label: "Dean" },
                                { value: "professor", label: "Professor" },
                                { value: "students", label: "Students" },
                                { value: "secretary", label: "Secretary" }
                            ]}
                            onChange={val => setData("role", val)}
                            error={errors.role}
                        />
                        <div>
                            <label style={LBL}>User Group</label>
                            <input style={INP} type="text" placeholder="e.g. Admin Group" value={data.user_group} onChange={e => setData("user_group", e.target.value)} />
                            {errors.user_group && <div style={{ color: "#fca5a5", fontSize: 10, marginTop: 4 }}>{errors.user_group}</div>}
                        </div>
                        <div>
                            <label style={LBL}>{isEdit ? "New Password (leave blank to keep)" : "Password *"}</label>
                            <input style={INP} type="password" placeholder="••••••••" value={data.password} onChange={e => setData("password", e.target.value)} required={!isEdit} />
                            {errors.password && <div style={{ color: "#fca5a5", fontSize: 10, marginTop: 4 }}>{errors.password}</div>}
                        </div>
                    </div>
                </div>
                <div style={MF}>
                    <button type="button" style={BCANC} onClick={onClose}>Cancel</button>
                    <button type="submit" style={{ ...BPRIM, opacity: processing ? .7 : 1 }} disabled={processing}>
                        {processing ? "Saving..." : (isEdit ? "Update User" : "Create Account")}
                    </button>
                </div>
            </form>
        </div>
    );
}

// ─── View User Modal ───────────────────────────────────────────────────────
function ViewUserModal({ user, onClose, onEdit }) {
    const p = pal(user.id);
    const [showResetPw, setShowResetPw] = useState(false);
    const [newPw, setNewPw] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [copied, setCopied] = useState("");

    const copy = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(""), 2000);
    };

    const CopyBtn = ({ value, field }) => (
        <button
            onClick={() => copy(value, field)}
            style={{
                padding: "4px 10px", borderRadius: 6, flexShrink: 0,
                background: copied === field ? "rgba(52,211,153,0.15)" : "color-mix(in srgb, var(--primary), transparent 90%)",
                border: `1px solid ${copied === field ? "rgba(52,211,153,0.3)" : "color-mix(in srgb, var(--primary), transparent 75%)"}`,
                color: copied === field ? "#34d399" : "var(--primary)",
                fontSize: 9, fontWeight: 800, textTransform: "uppercase",
                letterSpacing: ".1em", cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
            }}
        >
            {copied === field ? "✓ Copied" : "Copy"}
        </button>
    );

    return (
        <div style={OV} onClick={onClose}>
            <div style={MOD(520)} onClick={e => e.stopPropagation()}>
                <div style={MH}>
                    <div><div style={MT}>User Profile</div><div style={MS}>Account details and credentials</div></div>
                    <button style={CB} onClick={onClose}><IX /></button>
                </div>
                <div style={MB}>
                    {/* Avatar + name */}
                    <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 20, borderBottom: "1px solid rgba(249,115,22,0.1)", marginBottom: 20 }}>
                        <div style={{ width: 50, height: 50, borderRadius: 13, background: p.bg, border: `1.5px solid ${p.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, color: p.text, flexShrink: 0 }}>{init(user.name)}</div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: "#fef3ec", fontFamily: "'Playfair Display',serif", marginBottom: 3 }}>{user.name}</div>
                            <div style={{ fontSize: 12, color: "rgba(254,243,236,0.3)", fontFamily: "monospace" }}>{user.email}</div>
                            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                                <SPill label={user.role?.charAt(0).toUpperCase() + user.role?.slice(1)} type={user.role} />
                                <SPill label={user.is_active ? "Active" : "Inactive"} type={user.is_active ? "active" : "inactive"} />
                            </div>
                        </div>
                    </div>

                    {/* ── Credentials Section ── */}
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "color-mix(in srgb, var(--primary), transparent 50%)", marginBottom: 12 }}>Login Credentials</div>
 
                        {/* Email row */}
                        <div style={{ marginBottom: 10 }}>
                            <label style={LBL}>Email Address</label>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "color-mix(in srgb, var(--primary), transparent 94%)", border: "1px solid color-mix(in srgb, var(--primary), transparent 85%)", borderRadius: 9, padding: "9px 12px" }}>
                                <span style={{ flex: 1, fontSize: 13, color: "#fef3ec", fontFamily: "monospace" }}>{user.email}</span>
                                <CopyBtn value={user.email} field="email" />
                            </div>
                        </div>
 
                        {/* Student number row (if exists) */}
                        {user.student_number && (
                            <div style={{ marginBottom: 10 }}>
                                <label style={LBL}>Student Number</label>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "color-mix(in srgb, var(--primary), transparent 94%)", border: "1px solid color-mix(in srgb, var(--primary), transparent 85%)", borderRadius: 9, padding: "9px 12px" }}>
                                    <span style={{ flex: 1, fontSize: 13, color: "#fef3ec", fontFamily: "monospace" }}>{user.student_number}</span>
                                    <CopyBtn value={user.student_number} field="student_number" />
                                </div>
                            </div>
                        )}
 
                        {/* Password reset section */}
                        <div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                                <label style={{ ...LBL, marginBottom: 0 }}>Password</label>
                                <button
                                    onClick={() => { setShowResetPw(p => !p); setNewPw(""); }}
                                    style={{ fontSize: 9, fontWeight: 700, color: "var(--primary)", background: "none", border: "none", cursor: "pointer", textTransform: "uppercase", letterSpacing: ".08em", fontFamily: "'DM Sans',sans-serif" }}
                                >
                                    {showResetPw ? "✕ Cancel" : "⟳ Reset Password"}
                                </button>
                            </div>
 
                            {!showResetPw ? (
                                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "color-mix(in srgb, var(--primary), transparent 94%)", border: "1px solid color-mix(in srgb, var(--primary), transparent 85%)", borderRadius: 9, padding: "9px 12px" }}>
                                    <span style={{ flex: 1, fontSize: 13, color: "rgba(254,243,236,0.35)", letterSpacing: ".15em" }}>••••••••••</span>
                                    <span style={{ fontSize: 9, color: "rgba(254,243,236,0.25)", fontStyle: "italic" }}>hidden for security</span>
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: 8, background: "color-mix(in srgb, var(--primary), transparent 94%)", border: "1px solid color-mix(in srgb, var(--primary), transparent 80%)", borderRadius: 9, padding: 12 }}>
                                    <div style={{ fontSize: 10, color: "rgba(251,191,36,0.7)" }}>⚠ Enter a new password for this user. Share it with them securely.</div>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <div style={{ position: "relative", flex: 1 }}>
                                            <input
                                                type={showPw ? "text" : "password"}
                                                placeholder="New password..."
                                                value={newPw}
                                                onChange={e => setNewPw(e.target.value)}
                                                style={{ ...INP, paddingRight: 36, fontSize: 13 }}
                                            />
                                            <button
                                                onClick={() => setShowPw(p => !p)}
                                                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(254,243,236,0.35)", cursor: "pointer", padding: 0, display: "flex" }}
                                            >
                                                {showPw
                                                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                }
                                            </button>
                                        </div>
                                        {newPw && <CopyBtn value={newPw} field="newpw" />}
                                    </div>
                                    {newPw.length > 0 && newPw.length < 8 && (
                                        <div style={{ fontSize: 10, color: "#fca5a5" }}>Password must be at least 8 characters</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Other info grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        {[
                            ["Department", user.department || "Not assigned"],
                            ["Position",   user.position   || "Not specified"],
                            ["User Group", user.group_name || "No group assigned"],
                            ["Member Since", user.created_at || "—"],
                        ].map(([l, v]) => (
                            <div key={l}>
                                <div style={LBL}>{l}</div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: (v.includes?.("Not") || v === "—" || v.includes?.("No ")) ? "rgba(254,243,236,0.35)" : "#fef3ec" }}>{v}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={MF}>
                    <button style={BCANC} onClick={onClose}>Close</button>
                    {showResetPw && newPw.length >= 8 && (
                        <button
                            style={{ ...BPRIM, background: "linear-gradient(135deg,#f97316,#9a3412)" }}
                            onClick={() => {
                                // Submit password reset via Inertia
                                router.patch(route('user-roles.update', user.id), { password: newPw }, {
                                    onSuccess: () => { setShowResetPw(false); setNewPw(""); onClose(); }
                                });
                            }}
                        >
                            <ILock /> Save New Password
                        </button>
                    )}
                    <button style={BPRIM} onClick={() => { onClose(); onEdit(user); }}><IEdit /> Edit User</button>
                </div>
            </div>
        </div>
    );
}

// ─── Permissions Modal ─────────────────────────────────────────────────────
function PermissionsModal({ target, onClose }) {
    const [mods, setMods] = useState(() => MODULES.map(m => ({ ...m, sub: m.sub.map(s => ({ ...s })) })));
    const togMod = id => setMods(p => p.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
    const togSub = (mid, sid) => setMods(p => p.map(m => m.id === mid ? { ...m, sub: m.sub.map(s => s.id === sid ? { ...s, enabled: !s.enabled } : s) } : m));
    return (
        <div style={OV} onClick={onClose}>
            <div style={{ ...MOD(1400), width: "94vw", maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
                <div style={MH}>
                    <div><div style={MT}>Edit Module Permissions</div><div style={MS}>Editing permissions for <strong style={{ color: "#fb923c" }}>{target}</strong></div></div>
                    <button style={CB} onClick={onClose}><IX /></button>
                </div>
                <div style={{ padding: 24, overflowY: "auto", flex: 1, background: "rgba(0,0,0,0.35)", display: "flex", flexDirection: "column", gap: 32 }}>
                    {['Main', 'Management', 'Academic', 'Communications'].map(group => {
                        const groupMods = mods.filter(m => m.type === group);
                        if (groupMods.length === 0) return null;
                        return (
                            <div key={group}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(254,243,236,0.6)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14, borderBottom: "1px solid rgba(249,115,22,0.15)", paddingBottom: 8 }}>
                                    {group}
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 14 }}>
                                    {groupMods.map(mod => (
                                        <div key={mod.id} className="card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12, cursor: "default" }}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <div style={{ width: 36, height: 36, borderRadius: 9, background: mod.bg, border: `1.5px solid ${mod.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: mod.color, flexShrink: 0 }}>{mod.icon}</div>
                                                    <div>
                                                        <div style={{ fontSize: 12, fontWeight: 700, color: "#fef3ec" }}>{mod.name}</div>
                                                        <div style={{ fontSize: 9, color: "rgba(254,243,236,0.35)", textTransform: "uppercase", letterSpacing: ".05em" }}>{mod.type}</div>
                                                    </div>
                                                </div>
                                                <Toggle on={mod.enabled} onChange={() => togMod(mod.id)} />
                                            </div>
                                            {mod.sub.length > 0 && (
                                                <div style={{ display: "flex", flexDirection: "column", gap: 5, paddingTop: 10, borderTop: "1px dashed rgba(249,115,22,0.12)" }}>
                                                    {mod.sub.map(sub => (
                                                        <div key={sub.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 6px", borderRadius: 7, background: "rgba(249,115,22,0.03)", opacity: mod.enabled ? 1 : .4 }}>
                                                            <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(254,243,236,0.55)" }}>{sub.name}</span>
                                                            <Toggle small on={sub.enabled && mod.enabled} disabled={!mod.enabled} onChange={() => togSub(mod.id, sub.id)} />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div style={MF}>
                    <button style={BCANC} onClick={onClose}>Cancel</button>
                    <button style={BPRIM} onClick={onClose}><ICheck /> Save Permissions</button>
                </div>
            </div>
        </div>
    );
}

// ─── Delete Modal ──────────────────────────────────────────────────────────
function DeleteModal({ name, isGroup, onClose, onConfirm }) {
    return (
        <div style={OV} onClick={onClose}>
            <div style={MOD(420)} onClick={e => e.stopPropagation()}>
                <div style={MH}><div><div style={{ ...MT, color: "#fca5a5" }}>Delete {isGroup ? "User Group" : "User Account"}</div><div style={MS}>This action cannot be undone</div></div><button style={CB} onClick={onClose}><IX /></button></div>
                <div style={MB}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(239,68,68,0.14)", border: "1.5px solid rgba(239,68,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fca5a5" }}><IWarn /></div>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#fef3ec", lineHeight: 1.55 }}>Are you sure you want to delete <strong style={{ color: "#fb923c" }}>"{name}"</strong>?</p>
                            <p style={{ fontSize: 12, color: "rgba(254,243,236,0.38)", marginTop: 8, lineHeight: 1.6 }}>{isGroup ? "All members will be unassigned from this group. The group and its permissions will be permanently removed." : "This will permanently remove the user account and all associated data. This action cannot be reversed."}</p>
                        </div>
                    </div>
                </div>
                <div style={MF}>
                    <button style={BCANC} onClick={onClose}>Cancel</button>
                    <button style={{ ...BPRIM, background: "linear-gradient(135deg,#ef4444,#991b1b)", boxShadow: "0 4px 14px rgba(239,68,68,0.3)" }} onClick={onConfirm}><ITrash /> Yes, Delete {isGroup ? "Group" : "Account"}</button>
                </div>
            </div>
        </div>
    );
}

// ─── Default data ──────────────────────────────────────────────────────────
const DEF_GROUPS = [
    { id: 1, name: "IT Department", description: "Handles all IT infrastructure", member_count: 3 },
    { id: 2, name: "Finance Team", description: "Accounting and payroll", member_count: 2 },
];
const DEF_USERS = [
    { id: 1, name: "James Marc Puada", email: "jamespuada0@gmail.com", role: "dean", department: "IT", position: "System Admin", is_active: true },
    { id: 2, name: "Kristine Ortega", email: "kristine@example.com", role: "secretary", department: "Finance", position: "Accountant", is_active: true },
    { id: 3, name: "Mylene Yabao", email: "myleneyabao95@gmail.com", role: "professor", department: "HR", position: "HR Officer", is_active: true },
    { id: 4, name: "Ramon Dela Cruz", email: "ramon@example.com", role: "students", department: null, position: null, is_active: false },
    { id: 5, name: "Ana Santos", email: "ana@example.com", role: "professor", department: "IT", position: "Developer", is_active: true },
];

// ─── Main ──────────────────────────────────────────────────────────────────
export default function AccessRoles({ users = DEF_USERS, groups: ig = DEF_GROUPS, roles = [] }) {
    const { props } = usePage();
    const { auth } = props;
    const layout = props.customization?.layout || {};
    const isRight = layout.preset === "right";
    const hideSidebar = layout.preset === "topnav";

    const [groups, setGroups] = useState(ig);
    const [showDeact, setShowDeact] = useState(false);
    const [search, setSearch] = useState("");
    const [roleF, setRoleF] = useState("all");
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(null);
    const open = (type, payload = {}) => setModal({ type, payload });
    const close = () => setModal(null);

    const { delete: destroy } = useForm();

    const handleCreate = (name, desc, sel) => { setGroups(p => [...p, { id: Date.now(), name, description: desc, member_count: sel.length }]); close(); };
    const handleDelGrp = id => { setGroups(p => p.filter(g => g.id !== id)); close(); };

    const handleDelUser = (id) => {
        destroy(route('user-roles.destroy', id), {
            onSuccess: () => close(),
        });
    };

    const filtered = users.filter(u => {
        const q = search.toLowerCase();
        return (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
            && (roleF === "all" || u.role === roleF)
            && (showDeact || u.is_active);
    });
    const totalPg = Math.max(1, Math.ceil(filtered.length / perPage));
    const paged = filtered.slice((page - 1) * perPage, page * perPage);
    
    // Live counts
    const admins   = users.filter(u => u.role === "dean").length;
    const students = users.filter(u => u.role === "student").length;
    const others   = users.filter(u => u.role !== "dean" && u.role !== "student").length;

    const APill = ({ cls, onClick, children }) => <button onClick={onClick} className={`apill apill-${cls}`}>{children}</button>;

    // table head helper
    const TH = ({ children, right }) => (
        <th style={{ padding: "9px 16px", textAlign: right ? "right" : "left", fontSize: 8, fontWeight: 700, letterSpacing: ".1em", color: "color-mix(in srgb, var(--primary), transparent 58%)", textTransform: "uppercase" }}>{children}</th>
    );

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#0d0902", flexDirection: isRight ? "row-reverse" : "row" }}>
            {!hideSidebar && <Sidebar />}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
                <Topbar />

                <div className="gg" style={{ padding: "22px 26px", position: "relative", flex: 1 }}>

                    {/* Ambient glows */}
                    <div style={{ position: "fixed", top: "6%", right: "18%", width: 380, height: 380, background: "color-mix(in srgb, var(--primary), transparent 97%)", borderRadius: "50%", filter: "blur(90px)", pointerEvents: "none" }} />
                    <div style={{ position: "fixed", bottom: "10%", left: "30%", width: 260, height: 260, background: "color-mix(in srgb, var(--secondary, var(--primary)), transparent 97.5%)", borderRadius: "50%", filter: "blur(70px)", pointerEvents: "none" }} />

                    {/* ── PAGE HEADER ── */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                                <Tag bg="color-mix(in srgb, var(--primary), transparent 86%)" color="var(--primary)" border="color-mix(in srgb, var(--primary), transparent 70%)">User Management</Tag>
                                <Tag bg="rgba(255,255,255,0.06)" color="rgba(254,243,236,0.5)" border="rgba(255,255,255,0.1)">Admin Panel</Tag>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                                    <span className="pulse" />
                                    <Tag bg="color-mix(in srgb, var(--primary), transparent 92%)" color="var(--primary)" border="color-mix(in srgb, var(--primary), transparent 84%)">Live</Tag>
                                </span>
                            </div>
                            <h1 className="serif" style={{ fontSize: 26, color: "#fef3ec", lineHeight: 1.1 }}>
                                User Accounts &amp;<br />
                                <span style={{ color: "var(--primary)", fontStyle: "italic" }}>Access Control</span>
                            </h1>
                            <p style={{ fontSize: 11, color: "rgba(254,243,236,0.32)", marginTop: 6 }}>Manage system users, groups, and module permissions</p>
                        </div>
                        <div style={{ display: "flex", gap: 9, marginTop: 6 }}>
                            <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, cursor: "pointer", background: "color-mix(in srgb, var(--primary), transparent 93%)", border: "1px solid color-mix(in srgb, var(--primary), transparent 80%)", color: "rgba(254,243,236,0.55)", fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>
                                <IRefresh /> Refresh
                            </button>
                        </div>
                    </div>

                    {/* ── STAT CARDS — pcard style ── */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 18 }}>
                        {[
                            { label: "Total Accounts",  count: users.length, Icon: IUsers,  color: "#f97316" },
                            { label: "Administrators",  count: admins,        Icon: IShield, color: "#fb923c" },
                            { label: "Students",        count: students,      Icon: IUsers,  color: "#4ade80" },
                        ].map(({ label, count, Icon, color }) => (
                            <div key={label} className="pcard">
                                <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, background: `${color}1a`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", color }}>
                                    <Icon />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(254,243,236,0.5)", lineHeight: 1.3 }}>{label}</div>
                                    <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: "#fef3ec", marginTop: 2 }}>{count}</div>
                                </div>
                                <IRight />
                            </div>
                        ))}
                    </div>

                    {/* ── FILTER BAR ── */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "color-mix(in srgb, var(--primary), transparent 95%)", border: "1px solid color-mix(in srgb, var(--primary), transparent 87%)", borderRadius: 12, padding: "10px 16px", marginBottom: 18, flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 180, position: "relative" }}>
                            <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "rgba(254,243,236,0.3)", pointerEvents: "none" }}><ISearch /></span>
                            <input style={{ ...INP, paddingLeft: 34, paddingRight: search ? 32 : 13 }} placeholder="Search by name or email…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                            {search && (
                                <button onClick={() => { setSearch(""); setPage(1); }} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 20, height: 20, borderRadius: 5, border: "1px solid color-mix(in srgb, var(--primary), transparent 80%)", background: "color-mix(in srgb, var(--primary), transparent 90%)", color: "rgba(254,243,236,0.5)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <IX s={11} />
                                </button>
                            )}
                        </div>
                        <div style={{ position: "relative" }}>
                            <select style={{ ...INP, width: "auto", paddingRight: 28, minWidth: 130 }} value={roleF} onChange={e => { setRoleF(e.target.value); setPage(1); }}>
                                <option value="all">All Roles</option>
                                <option value="dean">Dean</option>
                                <option value="professor">Professor</option>
                                <option value="secretary">Secretary</option>
                                <option value="student">Student</option>
                                <option value="viewer">Viewer</option>
                            </select>
                            <span style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", color: "rgba(254,243,236,0.35)", pointerEvents: "none" }}><IChev /></span>
                        </div>
                        {(search || roleF !== "all") && (
                            <>
                                <button style={BCANC} onClick={() => { setSearch(""); setRoleF("all"); setPage(1); }}><IX s={11} /> Clear</button>
                                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "color-mix(in srgb, var(--primary), transparent 86%)", color: "var(--primary)", border: "1px solid color-mix(in srgb, var(--primary), transparent 70%)" }}>{filtered.length} results</span>
                            </>
                        )}
                    </div>

                    {/* ── USER GROUPS ── */}
                    <div className="card" style={{ overflow: "hidden", marginBottom: 14 }}>
                        <div style={{ padding: "15px 20px", borderBottom: "1px solid rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                                    <div className="serif" style={{ fontSize: 16, color: "#fef3ec" }}>User Groups</div>
                                    <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "rgba(167,139,250,0.14)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)" }}>{groups.length} {groups.length === 1 ? "group" : "groups"}</span>
                                </div>
                                <div style={{ fontSize: 10, color: "rgba(254,243,236,0.28)", marginTop: 2 }}>Assign shared permissions to groups of users</div>
                            </div>
                            <button style={BPRIM} onClick={() => open("createGroup")}><IPlus /> Create Group</button>
                        </div>

                        {groups.length === 0 ? (
                            <div style={{ padding: "52px 24px", textAlign: "center", color: "rgba(254,243,236,0.28)", fontSize: 12 }}>No user groups created yet. Create a group to assign shared permissions to users.</div>
                        ) : (
                            <>
                                <div style={{ overflowX: "auto" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                        <thead><tr style={{ borderBottom: "1px solid rgba(249,115,22,0.07)" }}><TH>Group Name</TH><TH>Description</TH><TH>Members</TH><TH right>Actions</TH></tr></thead>
                                        <tbody>
                                            {groups.map(g => (
                                                <tr key={g.id} className="trow">
                                                    <td style={{ padding: "12px 16px" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                                                            <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(167,139,250,0.14)", border: "1px solid rgba(167,139,250,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#a78bfa" }}>{g.name[0].toUpperCase()}</div>
                                                            <span style={{ fontSize: 12, fontWeight: 700, color: "#fef3ec" }}>{g.name}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: "12px 16px", fontSize: 12, color: "rgba(254,243,236,0.35)" }}>{g.description || "—"}</td>
                                                    <td style={{ padding: "12px 16px" }}><span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "rgba(167,139,250,0.14)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)" }}>{g.member_count ?? 0} members</span></td>
                                                    <td style={{ padding: "12px 16px" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }}>
                                                            <APill cls="perm" onClick={() => open("permissions", { target: g.name })}><ILock /> Permissions</APill>
                                                            <APill cls="edit" onClick={() => open("editGroup", { group: g })}><IEdit /> Edit</APill>
                                                            <APill cls="del" onClick={() => open("deleteGroup", { id: g.id, name: g.name })}><ITrash /> Delete</APill>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div style={{ padding: "9px 20px", fontSize: 10, color: "rgba(254,243,236,0.28)", borderTop: "1px solid rgba(249,115,22,0.07)" }}>Showing <strong style={{ color: "rgba(254,243,236,0.5)" }}>{groups.length}</strong> {groups.length === 1 ? "group" : "groups"}</div>
                            </>
                        )}
                    </div>

                    {/* ── USERS TABLE ── */}
                    <div className="card" style={{ overflow: "hidden", marginBottom: 32 }}>
                        <div style={{ padding: "15px 20px", borderBottom: "1px solid rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                                    <div className="serif" style={{ fontSize: 16, color: "#fef3ec" }}>Users &amp; Viewers</div>
                                    <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "rgba(34,197,94,0.12)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.3)" }}>{users.length} accounts</span>
                                </div>
                                <div style={{ fontSize: 10, color: "rgba(254,243,236,0.28)", marginTop: 2 }}>Showing <strong style={{ color: "rgba(254,243,236,0.5)" }}>{filtered.length}</strong> of {users.length} total accounts</div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                <button style={BCANC} onClick={() => setShowDeact(p => !p)}>{showDeact ? "Hide Deactivated" : "Show Deactivated"}</button>
                                <button style={{ ...BPRIM }} onClick={() => open("createUser")}><IPlus /> Add New Account</button>
                            </div>
                        </div>

                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead><tr style={{ borderBottom: "1px solid rgba(249,115,22,0.07)" }}><TH>Name</TH><TH>Email</TH><TH>Role</TH><TH>User Group</TH><TH>Status</TH><TH right>Actions</TH></tr></thead>
                                <tbody>
                                    {paged.map(u => {
                                        const p = pal(u.id);
                                        return (
                                            <tr key={u.id} className="trow">
                                                <td style={{ padding: "11px 16px" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                                                        <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: p.bg, border: `1px solid ${p.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: p.text }}>{init(u.name)}</div>
                                                        <div>
                                                            <div style={{ fontSize: 12, fontWeight: 600, color: "#fef3ec" }}>{u.name}</div>
                                                            {u.id === auth?.user?.id && <span style={{ fontSize: 8, fontWeight: 700, padding: "1px 6px", borderRadius: 20, background: "rgba(249,115,22,0.14)", color: "#fb923c", border: "1px solid rgba(249,115,22,0.3)" }}>You</span>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: "11px 16px", fontSize: 11, color: "rgba(254,243,236,0.38)", fontFamily: "monospace" }}>{u.email}</td>
                                                <td style={{ padding: "11px 16px" }}><SPill label={u.role?.charAt(0).toUpperCase() + u.role?.slice(1)} type={u.role} /></td>
                                                <td style={{ padding: "11px 16px", fontSize: 11, color: "rgba(254,243,236,0.38)" }}>{u.user_group || <span style={{ color: "rgba(254,243,236,0.2)" }}>—</span>}</td>
                                                <td style={{ padding: "11px 16px" }}>
                                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: u.is_active ? "#4ade80" : "rgba(254,243,236,0.3)" }}>
                                                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: u.is_active ? "#4ade80" : "rgba(254,243,236,0.2)", display: "inline-block" }} />
                                                        {u.is_active ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "11px 16px" }}>
                                                    {u.id !== auth?.user?.id ? (
                                                        <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }}>
                                                            <APill cls="edit" onClick={() => open("editUser", { user: u })}><IEdit /> Edit</APill>
                                                            <APill cls="view" onClick={() => open("viewUser", { user: u })}><IEye />  View</APill>
                                                            <APill cls="perm" onClick={() => open("permissions", { target: u.name })}><ILock /> Permissions</APill>
                                                            <APill cls="del" onClick={() => open("deleteUser", { id: u.id, name: u.name })}><ITrash /> Delete</APill>
                                                        </div>
                                                    ) : (
                                                        <div style={{ textAlign: "right" }}><span style={{ fontSize: 8, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "rgba(249,115,22,0.14)", color: "#fb923c", border: "1px solid rgba(249,115,22,0.3)" }}>You</span></div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filtered.length === 0 && (
                                        <tr><td colSpan={7}>
                                            <div style={{ padding: "60px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                                                <div style={{ width: 46, height: 46, borderRadius: 12, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.22)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, color: "#f97316" }}><ISearch /></div>
                                                <div style={{ fontSize: 15, fontWeight: 700, color: "#fef3ec", fontFamily: "'Playfair Display',serif", marginBottom: 5 }}>No users found</div>
                                                <div style={{ fontSize: 12, color: "rgba(254,243,236,0.35)" }}>Try a different name, email, or role filter.</div>
                                            </div>
                                        </td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 16px", borderTop: "1px solid rgba(249,115,22,0.07)", background: "rgba(249,115,22,0.03)", flexWrap: "wrap", gap: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 11, color: "rgba(254,243,236,0.38)" }}>
                                <span>Showing <strong style={{ color: "rgba(254,243,236,0.65)" }}>{Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)}</strong> of <strong style={{ color: "rgba(254,243,236,0.65)" }}>{filtered.length}</strong></span>
                                <span style={{ color: "rgba(249,115,22,0.2)" }}>|</span>
                                <label style={{ display: "flex", alignItems: "center", gap: 6 }}>Per page:
                                    <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }} style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", color: "#fef3ec", borderRadius: 6, padding: "2px 6px", fontSize: 11, cursor: "pointer" }}>
                                        {[10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </label>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ minWidth: 28, height: 28, borderRadius: 7, border: "1px solid rgba(249,115,22,0.2)", background: "rgba(249,115,22,0.07)", color: page <= 1 ? "rgba(254,243,236,0.2)" : "rgba(254,243,236,0.6)", cursor: page <= 1 ? "not-allowed" : "pointer", fontSize: 13 }}>‹</button>
                                {Array.from({ length: totalPg }, (_, i) => i + 1).map(p => (
                                    <button key={p} onClick={() => setPage(p)} style={{ minWidth: 28, height: 28, borderRadius: 7, border: `1px solid ${p === page ? "#f97316" : "rgba(249,115,22,0.2)"}`, background: p === page ? "linear-gradient(135deg,#f97316,#9a3412)" : "rgba(249,115,22,0.07)", color: p === page ? "#fff" : "rgba(254,243,236,0.55)", cursor: "pointer", fontSize: 11, fontWeight: p === page ? 700 : 400 }}>{p}</button>
                                ))}
                                <button disabled={page >= totalPg} onClick={() => setPage(p => p + 1)} style={{ minWidth: 28, height: 28, borderRadius: 7, border: "1px solid rgba(249,115,22,0.2)", background: "rgba(249,115,22,0.07)", color: page >= totalPg ? "rgba(254,243,236,0.2)" : "rgba(254,243,236,0.6)", cursor: page >= totalPg ? "not-allowed" : "pointer", fontSize: 13 }}>›</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Modals ── */}
            {modal?.type === "createUser" && <UserModal roles={roles} groups={groups} onClose={close} />}
            {modal?.type === "editUser" && <UserModal user={modal.payload.user} roles={roles} groups={groups} onClose={close} />}
            {modal?.type === "viewUser" && <ViewUserModal user={modal.payload.user} onClose={close} onEdit={u => open("editUser", { user: u })} />}
            {modal?.type === "permissions" && <PermissionsModal target={modal.payload.target} onClose={close} />}
            {modal?.type === "deleteUser" && <DeleteModal name={modal.payload.name} isGroup={false} onClose={close} onConfirm={() => handleDelUser(modal.payload.id)} />}
            {modal?.type === "deleteGroup" && <DeleteModal name={modal.payload.name} isGroup={true} onClose={close} onConfirm={() => handleDelGrp(modal.payload.id)} />}

            {/* ── Dashboard-cloned global styles ── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,900&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');
                * { box-sizing:border-box; }
                ::-webkit-scrollbar { width:3px; height:3px; }
                ::-webkit-scrollbar-thumb { background:#2a1204; border-radius:2px; }

                .gg {
                    background-image:
                        linear-gradient(color-mix(in srgb, var(--primary), transparent 97.8%) 1px, transparent 1px),
                        linear-gradient(90deg, color-mix(in srgb, var(--primary), transparent 97.8%) 1px, transparent 1px);
                    background-size: 44px 44px;
                }
 
                .card {
                    background: linear-gradient(145deg, color-mix(in srgb, var(--primary), transparent 93%), rgba(0,0,0,0.3));
                    border: 1px solid color-mix(in srgb, var(--primary), transparent 87%);
                    border-radius: 14px;
                    transition: border-color .22s;
                }
                .card:hover { border-color: color-mix(in srgb, var(--primary), transparent 72%); }
 
                .pcard {
                    display: flex; align-items: center; gap: 11px;
                    padding: 13px 16px; border-radius: 11px;
                    background: color-mix(in srgb, var(--primary), transparent 95%);
                    border: 1px solid color-mix(in srgb, var(--primary), transparent 89%);
                    cursor: pointer; transition: all .2s;
                }
                .pcard:hover { background: color-mix(in srgb, var(--primary), transparent 90%); border-color: color-mix(in srgb, var(--primary), transparent 74%); }
 
                .trow { cursor: pointer; transition: background .15s; border-bottom: 1px solid color-mix(in srgb, var(--primary), transparent 95%); }
                .trow:hover { background: color-mix(in srgb, var(--primary), transparent 96%); }
                .trow:last-child { border-bottom: none; }
 
                .apill {
                    display: inline-flex; align-items: center; gap: 4px;
                    padding: 5px 10px; border-radius: 8px;
                    font-size: 10px; font-weight: 700;
                    border: 1px solid color-mix(in srgb, var(--primary), transparent 84%);
                    background: color-mix(in srgb, var(--primary), transparent 94%); color: rgba(254,243,236,0.5);
                    cursor: pointer; transition: all .12s; font-family: 'DM Sans', sans-serif;
                }
                .apill:hover         { background: color-mix(in srgb, var(--primary), transparent 88%); border-color: color-mix(in srgb, var(--primary), transparent 65%); color: #fef3ec; }
                .apill-edit:hover    { color: #60a5fa; border-color: rgba(96,165,250,0.4);   background: rgba(96,165,250,0.1); }
                .apill-view:hover    { color: #a78bfa; border-color: rgba(167,139,250,0.4);  background: rgba(167,139,250,0.1); }
                .apill-perm:hover    { color: var(--primary); border-color: color-mix(in srgb, var(--primary), transparent 50%);   background: color-mix(in srgb, var(--primary), transparent 88%); }
                .apill-del:hover     { color: #fca5a5; border-color: rgba(239,68,68,0.4);    background: rgba(239,68,68,0.1); }
 
                .serif { font-family: var(--heading-font, 'Playfair Display'), serif; }
                .mono  { font-family: 'Space Mono', monospace; }
 
                @keyframes pnc-pulse {
                    0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--primary), transparent 50%); }
                    50%     { box-shadow: 0 0 0 5px color-mix(in srgb, var(--primary), transparent 100%); }
                }
                .pulse {
                    width: 7px; height: 7px; border-radius: 50%;
                    background: var(--primary); display: inline-block;
                    animation: pnc-pulse 2s infinite;
                }
            `}</style>
        </div>
    );
}