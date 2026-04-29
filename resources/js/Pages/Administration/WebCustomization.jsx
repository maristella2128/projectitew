import { useState, useRef, useCallback, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
    Palette, Type, Layout, Box, Shield, Settings, Save, RotateCcw,
    Download, Upload, Zap, Monitor, Tablet, Smartphone, ChevronLeft,
    ChevronDown, ChevronUp, Check, Plus, Eye, Layers, Undo2, Redo2,
    ZoomIn, ZoomOut, Brush, Sparkles, PanelLeft, PanelRight, PanelTop,
    LayoutDashboard, Users, GraduationCap, BookOpen, Calendar, Star,
    Bell, Award, Database, TrendingUp, X, RefreshCw, Copy, Wand2,
    Lock, Image, BarChart3, BarChart2, PieChart, LogIn, Search, Filter,
    Home, Grid, Layers2, Activity, FileText, UserCheck, Building2,
    ClipboardList, Globe, BookMarked, Microscope, Cpu, Hash,
    AlertTriangle, CheckCircle, Info, MessageCircle, Heart,
    Bookmark, Tag, Zap as Lightning, Target, Compass, Map,
    Package, Archive, Folder, FolderOpen, HardDrive, Cloud,
    Coffee, Music, Camera, Mic, Video, Phone, Mail, Link,
    Code2, Terminal, GitBranch, Layers3, SquareStack,
    Flame, Droplets, Leaf, Sun, Moon, Wind, Thermometer,
    Trophy, Medal, Crown, Diamond, Gem, Hexagon, Triangle,
    Circle, Square, Pentagon, Octagon, Infinity,
    ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight,
    ChevronRight, ChevronsRight, MoreHorizontal, MoreVertical,
    Sliders, SlidersHorizontal, ToggleLeft, ToggleRight,
    Maximize2, Minimize2, Expand, Shrink, Move, MousePointer2,
    Edit, Edit2, Edit3, Pen, Pencil, Highlighter, Eraser,
    Trash, Trash2, Delete, XCircle, MinusCircle, PlusCircle,
    PlayCircle, PauseCircle, StopCircle, SkipForward, SkipBack,
    List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
    Bold, Italic, Underline, Strikethrough,
    Table, Columns, Rows, LayoutGrid, LayoutList,
    Bell as BellIcon, BellOff, BellRing, Volume, VolumeX,
} from "lucide-react";

/* ══════════════════════════════════════════════════
   ICON LIBRARY — all available icons for picker
══════════════════════════════════════════════════ */
const ICON_LIB = {
    Navigation: [
        { id: "LayoutDashboard", ic: LayoutDashboard, label: "Dashboard" },
        { id: "Home", ic: Home, label: "Home" },
        { id: "Grid", ic: Grid, label: "Grid" },
        { id: "Compass", ic: Compass, label: "Compass" },
        { id: "Map", ic: Map, label: "Map" },
        { id: "ArrowLeft", ic: ArrowLeft, label: "Arrow L" },
        { id: "ArrowRight", ic: ArrowRight, label: "Arrow R" },
        { id: "ChevronRight", ic: ChevronRight, label: "Chevron R" },
        { id: "ChevronsRight", ic: ChevronsRight, label: "Chevrons" },
    ],
    People: [
        { id: "Users", ic: Users, label: "Users" },
        { id: "GraduationCap", ic: GraduationCap, label: "Graduate" },
        { id: "UserCheck", ic: UserCheck, label: "User Check" },
        { id: "Award", ic: Award, label: "Award" },
        { id: "Crown", ic: Crown, label: "Crown" },
        { id: "Trophy", ic: Trophy, label: "Trophy" },
        { id: "Medal", ic: Medal, label: "Medal" },
        { id: "Heart", ic: Heart, label: "Heart" },
    ],
    Academic: [
        { id: "BookOpen", ic: BookOpen, label: "Book Open" },
        { id: "BookMarked", ic: BookMarked, label: "Bookmarked" },
        { id: "BookOpen", ic: BookOpen, label: "Book" },
        { id: "ClipboardList", ic: ClipboardList, label: "Clipboard" },
        { id: "FileText", ic: FileText, label: "File Text" },
        { id: "Microscope", ic: Microscope, label: "Microscope" },
        { id: "Cpu", ic: Cpu, label: "CPU" },
        { id: "Code2", ic: Code2, label: "Code" },
        { id: "Terminal", ic: Terminal, label: "Terminal" },
        { id: "GitBranch", ic: GitBranch, label: "Git" },
    ],
    Data: [
        { id: "Database", ic: Database, label: "Database" },
        { id: "BarChart3", ic: BarChart3, label: "Bar Chart 3" },
        { id: "BarChart2", ic: BarChart2, label: "Bar Chart 2" },
        { id: "PieChart", ic: PieChart, label: "Pie Chart" },
        { id: "TrendingUp", ic: TrendingUp, label: "Trending" },
        { id: "Activity", ic: Activity, label: "Activity" },
        { id: "Layers", ic: Layers, label: "Layers" },
        { id: "Layers2", ic: Layers2, label: "Layers 2" },
        { id: "SquareStack", ic: SquareStack, label: "Stack" },
        { id: "Archive", ic: Archive, label: "Archive" },
        { id: "HardDrive", ic: HardDrive, label: "Drive" },
        { id: "Cloud", ic: Cloud, label: "Cloud" },
    ],
    Organization: [
        { id: "Calendar", ic: Calendar, label: "Calendar" },
        { id: "Star", ic: Star, label: "Star" },
        { id: "Globe", ic: Globe, label: "Globe" },
        { id: "Building2", ic: Building2, label: "Building" },
        { id: "Folder", ic: Folder, label: "Folder" },
        { id: "FolderOpen", ic: FolderOpen, label: "Open Dir" },
        { id: "Package", ic: Package, label: "Package" },
        { id: "Tag", ic: Tag, label: "Tag" },
        { id: "Bookmark", ic: Bookmark, label: "Bookmark" },
        { id: "Target", ic: Target, label: "Target" },
    ],
    Alerts: [
        { id: "Bell", ic: Bell, label: "Bell" },
        { id: "BellOff", ic: BellOff, label: "Bell Off" },
        { id: "BellRing", ic: BellRing, label: "Bell Ring" },
        { id: "AlertTriangle", ic: AlertTriangle, label: "Warning" },
        { id: "CheckCircle", ic: CheckCircle, label: "Check" },
        { id: "XCircle", ic: XCircle, label: "X Circle" },
        { id: "Info", ic: Info, label: "Info" },
        { id: "MessageCircle", ic: MessageCircle, label: "Message" },
        { id: "Zap", ic: Lightning, label: "Zap" },
        { id: "Flame", ic: Flame, label: "Flame" },
    ],
    Controls: [
        { id: "Settings", ic: Settings, label: "Settings" },
        { id: "Sliders", ic: Sliders, label: "Sliders" },
        { id: "SlidersH", ic: SlidersHorizontal, label: "Sliders H" },
        { id: "Filter", ic: Filter, label: "Filter" },
        { id: "Search", ic: Search, label: "Search" },
        { id: "Download", ic: Download, label: "Download" },
        { id: "Upload", ic: Upload, label: "Upload" },
        { id: "Lock", ic: Lock, label: "Lock" },
        { id: "Shield", ic: Shield, label: "Shield" },
        { id: "Trash2", ic: Trash2, label: "Trash" },
        { id: "Edit2", ic: Edit2, label: "Edit" },
        { id: "Copy", ic: Copy, label: "Copy" },
        { id: "Link", ic: Link, label: "Link" },
        { id: "Mail", ic: Mail, label: "Mail" },
        { id: "Phone", ic: Phone, label: "Phone" },
    ],
    Shapes: [
        { id: "Circle", ic: Circle, label: "Circle" },
        { id: "Square", ic: Square, label: "Square" },
        { id: "Triangle", ic: Triangle, label: "Triangle" },
        { id: "Hexagon", ic: Hexagon, label: "Hexagon" },
        { id: "Pentagon", ic: Pentagon, label: "Pentagon" },
        { id: "Diamond", ic: Diamond, label: "Diamond" },
        { id: "Gem", ic: Gem, label: "Gem" },
        { id: "Infinity", ic: Infinity, label: "Infinity" },
    ],
};

// Flat map for lookup
const ICON_MAP = Object.values(ICON_LIB).flat().reduce((acc, item) => {
    acc[item.id] = item.ic;
    return acc;
}, {});

/* ══════════════════════════════════════════════════
   DEFAULT ICON SLOTS  (nav items + UI slots)
══════════════════════════════════════════════════ */
const DEFAULT_ICONS = {
    // Sidebar nav
    nav_overview: "LayoutDashboard",
    nav_students: "Users",
    nav_faculty: "GraduationCap",
    nav_instruction: "BookOpen",
    nav_scheduling: "Calendar",
    nav_events: "Star",
    nav_reports: "Database",
    nav_settings: "Settings",
    // Topbar
    top_bell: "Bell",
    top_search: "Search",
    // KPI cards
    kpi_students: "Users",
    kpi_faculty: "GraduationCap",
    kpi_sections: "Layers",
    kpi_gwa: "TrendingUp",
    // Actions
    action_plus: "Plus",
    action_download: "Download",
    action_upload: "Upload",
    action_eye: "Eye",
    action_report: "BarChart2",
    // Branding
    brand_logo: "Shield",
};

const ICON_SLOT_LABELS = {
    nav_overview: "Overview (Sidebar)",
    nav_students: "Students (Sidebar)",
    nav_faculty: "Faculty (Sidebar)",
    nav_instruction: "Instruction (Sidebar)",
    nav_scheduling: "Scheduling (Sidebar)",
    nav_events: "Events (Sidebar)",
    nav_reports: "Reports (Sidebar)",
    nav_settings: "Settings (Sidebar)",
    top_bell: "Notifications Bell",
    top_search: "Search Icon",
    kpi_students: "KPI — Students",
    kpi_faculty: "KPI — Faculty",
    kpi_sections: "KPI — Sections",
    kpi_gwa: "KPI — GWA",
    action_plus: "Add / Plus button",
    action_download: "Download button",
    action_upload: "Upload button",
    action_eye: "View / Eye button",
    action_report: "Generate Report button",
    brand_logo: "Brand Logo Icon",
};

/* ══════════════════════════════════════════════════
   CONSTANTS & DEFAULTS
══════════════════════════════════════════════════ */
const DEFAULT = {
    primary: "#f97316", secondary: "#fb923c", background: "#0c0805", surface: "#160e08",
    border: "#2a1508", textPrimary: "#fef3ec", textMuted: "rgba(254,243,236,0.4)",
    sidebar: "#0c0805", topbar: "#0c0805",
    danger: "#ef4444", warning: "#f59e0b", success: "#22c55e", info: "#3b82f6",
    displayFont: "'Playfair Display', serif", bodyFont: "'DM Sans', sans-serif",
    monoFont: "'Space Mono', monospace",
    fontSize: 14, fontWeight: 700, lineHeight: "normal", letterSpacing: "normal",
    radius: 14, gap: 14, sidebarW: 280, topbarH: 64, density: "default",
    layout: "classic", contentWidth: "full",
    buttonStyle: "filled", buttonShape: "rounded", inputStyle: "outlined",
    cardStyle: "bordered", shadowDepth: "medium", tableStyle: "borderless",
    avatarShape: "rounded", badgeShape: "pill",
    iconSize: "medium", iconStroke: "1.5", iconStyle: "outline", iconColor: "brand",
    darkMode: true, animations: true, ambientGlow: true, bgTexture: "grid",
    glassBlur: 12, hoverEffect: "glow", transSpeed: "normal",
    highContrast: false, reducedMotion: false,
    systemTitle: "CCS Comprehensive Profiling System",
    institution: "Pamantasan ng Cabuyao",
    deptAbbrev: "CCS", academicYear: "2025–2026", semester: "1st Semester",
    footerText: "© 2025 Pamantasan ng Cabuyao · College of Computing Studies",
    icons: { ...DEFAULT_ICONS },
    // Browser Tab customization
    browserTabTitle: "CCS ProFile · Login",
    browserTabUrl: "ccs.pnc.edu.ph/login",
    browserTabTheme: "dark",       // "dark" | "light"
    browserTabAccent: "#f97316",
    // Alerts / Announcement banner customization
    alertBg: "#0a1f0a",
    alertBorder: "#14532d55",
    alertText: "#4ade80",
    alertIconColor: "#4ade80",
    alertMessage: "",           // empty = use auto message
    alertPosition: "top",        // "top" | "bottom" | "floating"
    alertStyle: "bar",        // "bar" | "toast" | "banner"
    alertDismissable: true,
    showAlerts: true,
};

const COLOR_PRESETS = [
    { name: "PNC Dark", primary: "#f97316", secondary: "#ea580c", bg: "#0c0805", surface: "#160e08", border: "#2a1508", tp: "#fef3ec", tm: "rgba(254,243,236,0.4)" },
    { name: "Midnight Gold", primary: "#fbbf24", secondary: "#d97706", bg: "#020617", surface: "#0f172a", border: "#1e293b", tp: "#f8fafc", tm: "#94a3b8" },
    { name: "Amethyst Deep", primary: "#a855f7", secondary: "#7e22ce", bg: "#0f0714", surface: "#1a0d24", border: "#2d1640", tp: "#f5f3ff", tm: "rgba(245,243,255,0.4)" },
    { name: "Emerald Knight", primary: "#10b981", secondary: "#059669", bg: "#06120e", surface: "#0d241c", border: "#1e3a2f", tp: "#ecfdf5", tm: "rgba(236,253,245,0.4)" },
    { name: "Crimson Rose", primary: "#f43f5e", secondary: "#e11d48", bg: "#0f0507", surface: "#1c0d10", border: "#35161c", tp: "#fff1f2", tm: "rgba(255,241,242,0.4)" },
    { name: "Oceanic Slate", primary: "#0ea5e9", secondary: "#0284c7", bg: "#020617", surface: "#0f172a", border: "#1e293b", tp: "#f0f9ff", tm: "rgba(240,249,255,0.4)" },
    { name: "Forest Cream", primary: "#166534", secondary: "#14532d", bg: "#f0fdf4", surface: "#ffffff", border: "#dcfce7", tp: "#052e16", tm: "#4ade80" },
    { name: "Nordic Minimal", primary: "#475569", secondary: "#334155", bg: "#f8fafc", surface: "#ffffff", border: "#e2e8f0", tp: "#0f172a", tm: "#64748b" },
];

const LAYOUT_OPTIONS = [
    { id: "classic", label: "Classic Sidebar", desc: "Fixed left sidebar + topbar" },
    { id: "topnav", label: "Top Navigation", desc: "Horizontal nav, no sidebar" },
    { id: "iconrail", label: "Icon Rail", desc: "52px icon-only slim sidebar" },
    { id: "dualpanel", label: "Dual Panel", desc: "Left nav + right context" },
    { id: "right", label: "Right Sidebar", desc: "Mirrored — nav on the right" },
    { id: "gridmode", label: "Widget Grid", desc: "No sidebar, draggable grid" },
];

const FONT_PAIRS = [
    { display: "'Playfair Display', serif", body: "'DM Sans', sans-serif", mono: "'Space Mono', monospace", label: "Editorial" },
    { display: "'DM Serif Display', serif", body: "'Outfit', sans-serif", mono: "'Space Mono', monospace", label: "Modern" },
    { display: "'Fraunces', serif", body: "'DM Sans', sans-serif", mono: "'Space Mono', monospace", label: "Literary" },
    { display: "'Syne', sans-serif", body: "'DM Sans', sans-serif", mono: "'Space Mono', monospace", label: "Geometric" },
];

const RADIUS_PRESETS = [
    { label: "Sharp", value: 0 }, { label: "Soft", value: 8 }, { label: "Rounded", value: 14 }, { label: "Pill", value: 30 },
];

const O = "#f97316";

/* ══════════════════════════════════════════════════
   ICON PICKER MODAL
══════════════════════════════════════════════════ */
function IconPickerModal({ slot, currentIconId, onSelect, onClose, primary }) {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");

    const filtered = Object.entries(ICON_LIB).reduce((acc, [cat, icons]) => {
        const f = icons.filter(i =>
            (activeCategory === "all" || activeCategory === cat) &&
            i.label.toLowerCase().includes(search.toLowerCase())
        );
        if (f.length) acc.push({ cat, icons: f });
        return acc;
    }, []);

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)" }}
            onClick={onClose}>
            <div onClick={e => e.stopPropagation()} style={{ width: 560, maxHeight: "80vh", background: "#110903", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 16, display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(0,0,0,0.8)", overflow: "hidden" }}>

                {/* Header */}
                <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(249,115,22,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "rgba(249,115,22,0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.28)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Sparkles size={14} color={O} />
                        </div>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#fef3ec" }}>Choose Icon</div>
                            <div style={{ fontSize: 9, color: "rgba(254,243,236,0.38)", marginTop: 1, fontFamily: "'Space Mono',monospace" }}>{ICON_SLOT_LABELS[slot] || slot}</div>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.22)", color: "rgba(249,115,22,0.7)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={13} /></button>
                </div>

                {/* Search + category row */}
                <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(249,115,22,0.09)", flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.16)", borderRadius: 9, padding: "7px 12px", marginBottom: 10 }}>
                        <Search size={13} style={{ color: "rgba(249,115,22,0.45)", flexShrink: 0 }} />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search icons…"
                            style={{ background: "transparent", border: "none", outline: "none", color: "#fef3ec", fontSize: 12, width: "100%", fontFamily: "'DM Sans',sans-serif" }} />
                        {search && <button onClick={() => setSearch("")} style={{ background: "transparent", border: "none", color: "rgba(249,115,22,0.4)", cursor: "pointer", padding: 0 }}><X size={12} /></button>}
                    </div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {["all", ...Object.keys(ICON_LIB)].map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: "3px 10px", borderRadius: 5, fontSize: 9, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", background: activeCategory === cat ? `linear-gradient(135deg,${O},#c2410c)` : "rgba(249,115,22,0.06)", color: activeCategory === cat ? "#fff" : "rgba(254,243,236,0.45)", border: activeCategory === cat ? "none" : "1px solid rgba(249,115,22,0.13)", letterSpacing: ".04em", textTransform: "uppercase" }}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Icon grid */}
                <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
                    {filtered.length === 0
                        ? <div style={{ textAlign: "center", padding: "30px", color: "rgba(254,243,236,0.3)", fontSize: 12 }}>No icons found for "{search}"</div>
                        : filtered.map(({ cat, icons }) => (
                            <div key={cat} style={{ marginBottom: 18 }}>
                                {activeCategory === "all" && <div style={{ fontSize: 8, fontWeight: 700, color: "rgba(249,115,22,0.38)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>{cat}</div>}
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 6 }}>
                                    {icons.map(item => {
                                        const active = item.id === currentIconId;
                                        return (
                                            <button key={item.id + item.label} onClick={() => { onSelect(slot, item.id); onClose(); }}
                                                title={item.label}
                                                style={{
                                                    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                                                    padding: "8px 4px", borderRadius: 9, cursor: "pointer",
                                                    background: active ? `linear-gradient(135deg,rgba(249,115,22,0.2),rgba(194,65,12,0.1))` : "rgba(249,115,22,0.04)",
                                                    border: active ? `1px solid rgba(249,115,22,0.45)` : "1px solid rgba(249,115,22,0.1)",
                                                    transition: "all .15s",
                                                }}>
                                                <item.ic size={18} color={active ? O : "rgba(254,243,236,0.6)"} />
                                                <span style={{ fontSize: 7, fontWeight: active ? 700 : 500, color: active ? O : "rgba(254,243,236,0.38)", textAlign: "center", lineHeight: 1.2, letterSpacing: ".02em" }}>{item.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    }
                </div>

                {/* Footer: current selection */}
                <div style={{ padding: "12px 18px", borderTop: "1px solid rgba(249,115,22,0.1)", background: "rgba(249,115,22,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {(() => { const Ic = ICON_MAP[currentIconId] || Shield; return <Ic size={16} color={O} />; })()}
                        <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(254,243,236,0.55)" }}>Current: <span style={{ color: O, fontFamily: "'Space Mono',monospace" }}>{currentIconId}</span></span>
                    </div>
                    <button onClick={() => { onSelect(slot, DEFAULT_ICONS[slot] || "Shield"); onClose(); }}
                        style={{ fontSize: 9, fontWeight: 700, color: "rgba(254,243,236,0.45)", background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.16)", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>Reset</button>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════
   ICON CUSTOMIZATION PANEL
══════════════════════════════════════════════════ */
function IconCustomPanel({ theme, update }) {
    const [pickerSlot, setPickerSlot] = useState(null);
    const [iconSearch, setIconSearch] = useState("");

    const icons = theme.icons || DEFAULT_ICONS;

    const handleIconChange = (slot, iconId) => {
        update("icons", { ...icons, [slot]: iconId });
    };

    const resetAll = () => {
        if (window.confirm("Reset all icons to default?")) {
            update("icons", { ...DEFAULT_ICONS });
        }
    };

    const slotGroups = [
        { label: "Sidebar Navigation", slots: ["nav_overview", "nav_students", "nav_faculty", "nav_instruction", "nav_scheduling", "nav_events", "nav_reports", "nav_settings"] },
        { label: "Topbar UI", slots: ["top_bell", "top_search"] },
        { label: "KPI Cards", slots: ["kpi_students", "kpi_faculty", "kpi_sections", "kpi_gwa"] },
        { label: "Action Buttons", slots: ["action_plus", "action_download", "action_upload", "action_eye", "action_report"] },
        { label: "Brand & Identity", slots: ["brand_logo"] },
    ];

    return (
        <div style={{ flex: 1, overflowY: "auto", padding: 14, fontFamily: "'DM Sans',sans-serif" }}>
            {pickerSlot && (
                <IconPickerModal
                    slot={pickerSlot}
                    currentIconId={icons[pickerSlot] || DEFAULT_ICONS[pickerSlot] || "Shield"}
                    onSelect={handleIconChange}
                    onClose={() => setPickerSlot(null)}
                    primary={theme.primary}
                />
            )}

            {/* Header strip */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(249,115,22,0.14)", border: "1px solid rgba(249,115,22,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Sparkles size={13} color={O} />
                    </div>
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#fef3ec" }}>Icon Replacement</div>
                        <div style={{ fontSize: 8, color: "rgba(254,243,236,0.35)", marginTop: 1 }}>Click any icon to swap it</div>
                    </div>
                </div>
                <button onClick={resetAll} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 7, background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.16)", color: "rgba(254,243,236,0.5)", fontSize: 9, fontWeight: 600, cursor: "pointer" }}>
                    <RefreshCw size={11} /> Reset All
                </button>
            </div>

            {/* Global icon settings */}
            <div style={{ marginBottom: 16, padding: "12px 14px", borderRadius: 10, background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.1)" }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: "rgba(249,115,22,0.5)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>Global Icon Style</div>

                {/* Size */}
                <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(254,243,236,0.38)", letterSpacing: ".09em", textTransform: "uppercase", marginBottom: 6 }}>Size</div>
                    <div style={{ display: "flex", gap: 5 }}>
                        {[{ l: "14px", v: "small" }, { l: "16px", v: "medium" }, { l: "20px", v: "large" }, { l: "24px", v: "xl" }].map(o => (
                            <button key={o.v} onClick={() => update("iconSize", o.v)} style={{ flex: 1, padding: "5px 4px", borderRadius: 6, fontSize: 9, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", background: theme.iconSize === o.v ? `linear-gradient(135deg,${O},#c2410c)` : "rgba(249,115,22,0.06)", color: theme.iconSize === o.v ? "#fff" : "rgba(254,243,236,0.45)", border: theme.iconSize === o.v ? "none" : "1px solid rgba(249,115,22,0.14)" }}>{o.l}</button>
                        ))}
                    </div>
                </div>

                {/* Stroke */}
                <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(254,243,236,0.38)", letterSpacing: ".09em", textTransform: "uppercase", marginBottom: 6 }}>Stroke Weight</div>
                    <div style={{ display: "flex", gap: 5 }}>
                        {[{ l: "1.0", v: "1" }, { l: "1.5", v: "1.5" }, { l: "2.0", v: "2" }, { l: "2.5", v: "2.5" }].map(o => (
                            <button key={o.v} onClick={() => update("iconStroke", o.v)} style={{ flex: 1, padding: "5px 4px", borderRadius: 6, fontSize: 9, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", background: theme.iconStroke === o.v ? `linear-gradient(135deg,${O},#c2410c)` : "rgba(249,115,22,0.06)", color: theme.iconStroke === o.v ? "#fff" : "rgba(254,243,236,0.45)", border: theme.iconStroke === o.v ? "none" : "1px solid rgba(249,115,22,0.14)" }}>{o.l}</button>
                        ))}
                    </div>
                </div>

                {/* Color mode */}
                <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(254,243,236,0.38)", letterSpacing: ".09em", textTransform: "uppercase", marginBottom: 6 }}>Color Mode</div>
                    <div style={{ display: "flex", gap: 5 }}>
                        {[{ l: "Follow Brand", v: "brand" }, { l: "Follow Text", v: "text" }, { l: "Muted", v: "muted" }, { l: "Custom", v: "custom" }].map(o => (
                            <button key={o.v} onClick={() => update("iconColor", o.v)} style={{ flex: 1, padding: "5px 4px", borderRadius: 6, fontSize: 8, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", background: theme.iconColor === o.v ? `linear-gradient(135deg,${O},#c2410c)` : "rgba(249,115,22,0.06)", color: theme.iconColor === o.v ? "#fff" : "rgba(254,243,236,0.45)", border: theme.iconColor === o.v ? "none" : "1px solid rgba(249,115,22,0.14)" }}>{o.l}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Per-slot replacements */}
            {slotGroups.map(({ label, slots }) => (
                <div key={label} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 9 }}>
                        <div style={{ height: 1, flex: 1, background: "rgba(249,115,22,0.1)" }} />
                        <span style={{ fontSize: 8, fontWeight: 700, color: "rgba(249,115,22,0.4)", letterSpacing: ".1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</span>
                        <div style={{ height: 1, flex: 1, background: "rgba(249,115,22,0.1)" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                        {slots.map(slot => {
                            const iconId = icons[slot] || DEFAULT_ICONS[slot] || "Shield";
                            const Ic = ICON_MAP[iconId] || Shield;
                            const isDefault = iconId === DEFAULT_ICONS[slot];
                            return (
                                <button key={slot} onClick={() => setPickerSlot(slot)}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 9, padding: "9px 11px", borderRadius: 9, cursor: "pointer", textAlign: "left",
                                        background: "rgba(249,115,22,0.05)", border: `1px solid ${!isDefault ? "rgba(249,115,22,0.35)" : "rgba(249,115,22,0.1)"}`,
                                        transition: "all .18s", position: "relative", overflow: "hidden"
                                    }}>
                                    {/* Icon display */}
                                    <div style={{ width: 30, height: 30, borderRadius: 8, background: !isDefault ? "rgba(249,115,22,0.16)" : "rgba(249,115,22,0.1)", border: `1px solid ${!isDefault ? "rgba(249,115,22,0.35)" : "rgba(249,115,22,0.18)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <Ic size={14} color={!isDefault ? O : "rgba(249,115,22,0.65)"} strokeWidth={Number(theme.iconStroke) || 1.5} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 10, fontWeight: 600, color: "#fef3ec", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ICON_SLOT_LABELS[slot] || slot}</div>
                                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, color: !isDefault ? O : "rgba(254,243,236,0.32)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{iconId}</div>
                                    </div>
                                    {/* "Changed" badge */}
                                    {!isDefault && (
                                        <div style={{ position: "absolute", top: 5, right: 5, width: 6, height: 6, borderRadius: "50%", background: O }} />
                                    )}
                                    {/* Swap hint */}
                                    <Edit2 size={10} color="rgba(249,115,22,0.3)" style={{ flexShrink: 0 }} />
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Changed icons summary */}
            {Object.keys(icons).some(k => icons[k] !== DEFAULT_ICONS[k]) && (
                <div style={{ marginTop: 4, padding: "10px 12px", borderRadius: 9, background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.2)" }}>
                    <div style={{ fontSize: 8, fontWeight: 700, color: O, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 7 }}>
                        {Object.keys(icons).filter(k => icons[k] !== DEFAULT_ICONS[k]).length} ICON{Object.keys(icons).filter(k => icons[k] !== DEFAULT_ICONS[k]).length !== 1 ? "S" : ""} CHANGED
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {Object.entries(icons).filter(([k, v]) => v !== DEFAULT_ICONS[k]).map(([k, v]) => {
                            const Ic = ICON_MAP[v] || Shield;
                            return (
                                <div key={k} style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 7px", borderRadius: 5, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)" }}>
                                    <Ic size={11} color={O} />
                                    <span style={{ fontSize: 8, color: "rgba(254,243,236,0.6)", fontFamily: "'Space Mono',monospace" }}>{k.replace("nav_", "").replace("kpi_", "").replace("top_", "").replace("action_", "").replace("brand_", "")}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════════════
   SHARED UI PRIMITIVES
══════════════════════════════════════════════════ */
const SliderRow = ({ label, k, min, max, unit = "", theme, update }) => (
    <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <label style={{ fontSize: 9, fontWeight: 700, color: "rgba(254,243,236,0.38)", letterSpacing: ".09em", textTransform: "uppercase" }}>{label}</label>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: O, fontWeight: 700, background: "rgba(249,115,22,0.1)", padding: "1px 7px", borderRadius: 5 }}>{theme[k]}{unit}</span>
        </div>
        <div style={{ position: "relative", height: 4, borderRadius: 2, background: "rgba(249,115,22,0.1)" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", borderRadius: 2, background: `linear-gradient(90deg,rgba(249,115,22,0.35),${O})`, width: `${((theme[k] - min) / (max - min)) * 100}%` }} />
            <input type="range" min={min} max={max} value={theme[k]} onChange={e => update(k, Number(e.target.value))} style={{ position: "absolute", inset: 0, width: "100%", opacity: 0, cursor: "pointer", height: "100%" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
            <span style={{ fontSize: 7, color: "rgba(254,243,236,0.16)" }}>{min}{unit}</span>
            <span style={{ fontSize: 7, color: "rgba(254,243,236,0.16)" }}>{max}{unit}</span>
        </div>
    </div>
);

const ChipRow = ({ label, k, opts, theme, update }) => (
    <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 9, fontWeight: 700, color: "rgba(254,243,236,0.38)", letterSpacing: ".09em", textTransform: "uppercase", display: "block", marginBottom: 7 }}>{label}</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {opts.map(o => { const val = o.v || o; const lbl = o.l || o; const active = val === theme[k]; return <button key={val} onClick={() => update(k, val)} style={{ padding: "5px 11px", borderRadius: 7, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .15s", background: active ? `linear-gradient(135deg,${O},#c2410c)` : "rgba(249,115,22,0.06)", color: active ? "#fff" : "rgba(254,243,236,0.45)", border: active ? "none" : "1px solid rgba(249,115,22,0.14)", boxShadow: active ? "0 2px 8px rgba(249,115,22,0.28)" : "none" }}>{lbl}</button>; })}
        </div>
    </div>
);

const ColorRow = ({ label, k, theme, update, sub }) => (
    <div style={{ marginBottom: 13 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <label style={{ fontSize: 9, fontWeight: 700, color: "rgba(254,243,236,0.38)", letterSpacing: ".09em", textTransform: "uppercase" }}>{label}</label>
            {sub && <span style={{ fontSize: 8, color: "rgba(254,243,236,0.22)" }}>{sub}</span>}
        </div>
        <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
            <input type="color" value={theme[k]?.startsWith("rgba") || theme[k]?.startsWith("rgb") ? "#888888" : theme[k] || "#000000"} onChange={e => update(k, e.target.value)} style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid rgba(249,115,22,0.22)`, cursor: "pointer", background: "transparent", padding: 2 }} />
            <input type="text" value={theme[k] || ""} onChange={e => update(k, e.target.value)} style={{ flex: 1, background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.14)", borderRadius: 8, padding: "7px 10px", fontSize: 10, fontFamily: "'Space Mono',monospace", color: "#fef3ec", outline: "none" }} />
            <div style={{ width: 34, height: 34, borderRadius: 8, background: theme[k], border: "1px solid rgba(249,115,22,0.2)", flexShrink: 0 }} />
        </div>
    </div>
);

const ToggleRow = ({ label, sub, k, theme, update }) => (
    <div onClick={() => update(k, !theme[k])} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 11px", borderRadius: 9, background: "rgba(249,115,22,0.04)", border: "1px solid rgba(249,115,22,0.09)", marginBottom: 7, cursor: "pointer" }}>
        <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(254,243,236,0.68)" }}>{label}</div>
            {sub && <div style={{ fontSize: 8, color: "rgba(254,243,236,0.28)", marginTop: 1 }}>{sub}</div>}
        </div>
        <div style={{ width: 34, height: 18, borderRadius: 9, background: theme[k] ? `linear-gradient(135deg,${O},#c2410c)` : "rgba(255,255,255,0.1)", position: "relative", flexShrink: 0, transition: "all .2s", boxShadow: theme[k] ? "0 2px 8px rgba(249,115,22,0.32)" : "none" }}>
            <div style={{ position: "absolute", top: 1, width: 16, height: 16, borderRadius: "50%", background: "#fff", left: theme[k] ? 16 : 1, transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
        </div>
    </div>
);

const SectionDivider = ({ label }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "14px 0 10px" }}>
        <div style={{ height: 1, flex: 1, background: "rgba(249,115,22,0.1)" }} />
        <span style={{ fontSize: 8, fontWeight: 700, color: "rgba(249,115,22,0.38)", letterSpacing: ".12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</span>
        <div style={{ height: 1, flex: 1, background: "rgba(249,115,22,0.1)" }} />
    </div>
);

const TextInput = ({ label, k, theme, update, placeholder }) => (
    <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 9, fontWeight: 700, color: "rgba(254,243,236,0.38)", letterSpacing: ".09em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{label}</label>
        <input value={theme[k] || ""} onChange={e => update(k, e.target.value)} placeholder={placeholder} style={{ width: "100%", background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.14)", borderRadius: 9, padding: "9px 12px", fontSize: 12, color: "#fef3ec", outline: "none", fontFamily: "'DM Sans',sans-serif" }} />
    </div>
);

/* ══════════════════════════════════════════════════
   ICON RESOLVER — get icon from theme or default
══════════════════════════════════════════════════ */
function useIcon(theme, slot) {
    const iconId = theme?.icons?.[slot] || DEFAULT_ICONS[slot] || "Shield";
    return ICON_MAP[iconId] || Shield;
}

/* ══════════════════════════════════════════════════
   LOGIN PREVIEW  — warm dark orange palette
══════════════════════════════════════════════════ */
function LoginPreview({ theme, showBrowserChrome = false }) {
    const p = "#f97316";
    const p2 = "#c2410c";
    const p3 = "#fb923c";
    const r = Math.min(theme.radius || 14, 18);
    const LogoIcon = useIcon(theme, "brand_logo");
    const stroke = Number(theme.iconStroke) || 1.5;

    // Dark warm palette — matches actual Login.jsx exactly
    const BG = "#1A0A00";
    const CARD = "rgba(255,255,255,0.97)";
    const INK = "#1A0A00";
    const INK2 = "rgba(26,10,0,0.45)";
    const INK3 = "rgba(26,10,0,0.22)";
    const INPBG = "#FEF3E8";
    const INPBD = "#F4D5B8";

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", fontFamily: "'Outfit',sans-serif", overflow: "hidden" }}>
            {/* Browser chrome — uses theme.browserTab* fields */}
            {showBrowserChrome && (() => {
                const bLight = theme.browserTabTheme === "light";
                const bAccent = theme.browserTabAccent || p;
                const bTitle = theme.browserTabTitle || `${theme.deptAbbrev || "CCS"} ProFile · Login`;
                const bUrl = theme.browserTabUrl || "ccs.pnc.edu.ph/login";
                const tabBg = bLight ? "#ffffff" : "#1e0d02";
                const chrBg = bLight ? "#f1f5f9" : "#120800";
                const chrBdr = bLight ? "#dde4f0" : "#2a1005";
                const tabBdr = bLight ? "#dde4f0" : "#3a1a08";
                const txtCol = bLight ? "#334155" : "#fef3ec";
                const urlCol = bLight ? "#64748b" : "rgba(254,243,236,0.45)";
                const mutCol = bLight ? "#94a3b8" : "rgba(254,243,236,0.35)";
                const adrBg = bLight ? "#fff" : "#0f0702";
                return (
                    <div style={{ height: 38, background: chrBg, borderBottom: `1px solid ${chrBdr}`, display: "flex", alignItems: "flex-end", padding: "0 12px", gap: 8, flexShrink: 0 }}>
                        <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 6 }}>
                            {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
                        </div>
                        {/* Active tab */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, background: tabBg, border: `1px solid ${tabBdr}`, borderBottom: `1px solid ${tabBg}`, borderRadius: "5px 5px 0 0", padding: "5px 12px 6px", marginBottom: "-1px", maxWidth: 160 }}>
                            <div style={{ width: 11, height: 11, borderRadius: 3, background: `linear-gradient(135deg,${bAccent},${bAccent}88)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><LogoIcon size={6} color="#fff" strokeWidth={2} /></div>
                            <span style={{ fontSize: 9, fontWeight: 600, color: txtCol, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: 100 }}>{bTitle}</span>
                            <span style={{ fontSize: 11, color: mutCol, marginLeft: 2, flexShrink: 0 }}>×</span>
                        </div>
                        {/* Inactive tab */}
                        <div style={{ padding: "5px 10px 6px", marginBottom: "-1px", opacity: .45 }}>
                            <span style={{ fontSize: 8, color: mutCol }}>New Tab</span>
                        </div>
                        {/* Address bar */}
                        <div style={{ flex: 1, height: 22, borderRadius: 5, background: adrBg, border: `1px solid ${tabBdr}`, display: "flex", alignItems: "center", padding: "0 9px", gap: 6, marginBottom: 5 }}>
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            <span style={{ fontSize: 8, color: urlCol, fontFamily: "'Space Mono',monospace", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{bUrl}</span>
                        </div>
                    </div>
                );
            })()}

            {/* Two-column layout */}
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden", background: BG, position: "relative" }}>

                {/* ── Background scene (spans both cols) ── */}
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 70% at 100% -10%, rgba(249,115,22,0.55) 0%, transparent 55%), radial-gradient(ellipse 60% 60% at 70% 50%, rgba(180,60,0,0.30) 0%, transparent 58%), linear-gradient(155deg,#2a0e00 0%,#100500 55%,#0a0200 100%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(249,115,22,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.04) 1px,transparent 1px)", backgroundSize: "50px 50px", opacity: .6, pointerEvents: "none" }} />
                {/* Orbs */}
                <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(249,115,22,0.25)", filter: "blur(60px)", top: "-40px", right: "30%", pointerEvents: "none" }} />
                <div style={{ position: "absolute", width: 140, height: 140, borderRadius: "50%", background: "rgba(180,60,0,0.20)", filter: "blur(50px)", bottom: "10%", left: "5%", pointerEvents: "none" }} />

                {/* ── LEFT HERO ── */}
                <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "center", padding: "20px 8% 20px 8%", gap: 0 }}>
                    {/* Brand */}
                    <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 20 }}>
                        <div style={{ width: 36, height: 36, background: p, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 4px 16px ${p}55` }}>
                            <LogoIcon size={17} color="#fff" strokeWidth={stroke} />
                        </div>
                        <div>
                            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 900, fontStyle: "italic", color: "#fff", letterSpacing: "-.02em" }}>CCS</div>
                            <div style={{ fontSize: 8, fontWeight: 500, textTransform: "uppercase", letterSpacing: ".2em", color: "rgba(255,255,255,0.32)" }}>Profile System</div>
                        </div>
                    </div>

                    {/* Eyebrow */}
                    <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".28em", color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>
                        <div style={{ width: 18, height: 1.5, background: `linear-gradient(90deg,${p},transparent)`, flexShrink: 0 }} />
                        Academic Portal
                    </div>

                    {/* Hero heading */}
                    <div style={{ marginBottom: 14, lineHeight: .93 }}>
                        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-.04em", display: "block" }}>Track Your</div>
                        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 900, color: p3, letterSpacing: "-.04em", display: "block" }}>{theme.deptAbbrev || "CCS"}</div>
                        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 900, color: "rgba(255,255,255,0.18)", letterSpacing: "-.04em", fontStyle: "italic", display: "block" }}>Journey.</div>
                    </div>

                    {/* Body */}
                    <div style={{ fontSize: 10, fontWeight: 300, color: "rgba(255,255,255,0.42)", lineHeight: 1.8, maxWidth: 200, marginBottom: 18 }}>
                        CCS Profile System centralizes your <span style={{ fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>student records</span>, performance data, and academic identity.
                    </div>

                    {/* Stats */}
                    <div style={{ display: "flex", gap: 0 }}>
                        {[["1.2K", "Students"], ["18", "Programs"], ["99.9%", "Uptime"]].map(([n, l], i) => (
                            <div key={i} style={{ paddingRight: i < 2 ? 16 : 0, marginRight: i < 2 ? 16 : 0, borderRight: i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 900, fontStyle: "italic", color: p3, lineHeight: 1 }}>{n}</div>
                                <div style={{ fontSize: 7, fontWeight: 500, textTransform: "uppercase", letterSpacing: ".12em", color: "rgba(255,255,255,0.25)", marginTop: 3 }}>{l}</div>
                            </div>
                        ))}
                    </div>

                    {/* Social strip */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18, padding: "11px 13px", borderRadius: 11, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div style={{ display: "flex" }}>
                            {["J", "M", "A", "R"].map((l, i) => (
                                <div key={i} style={{ width: 24, height: 24, borderRadius: "50%", background: [p, "#92400E", "#C2410C", "#B45309"][i], border: "2px solid rgba(26,10,0,0.8)", marginLeft: i === 0 ? 0 : -7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "#fff" }}>{l}</div>
                            ))}
                        </div>
                        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>Joined by <span style={{ fontWeight: 600, color: "rgba(255,255,255,0.72)" }}>1,200+ CCS students</span></div>
                    </div>
                </div>

                {/* ── RIGHT — Login Card ── */}
                <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "flex-start", padding: "16px 8%", borderLeft: "1px solid rgba(249,115,22,0.12)" }}>
                    <div style={{ width: "100%", maxWidth: 300, background: CARD, borderRadius: 18, padding: "22px 24px 18px", boxShadow: "0 0 0 1px rgba(249,115,22,0.14), 0 4px 12px rgba(0,0,0,0.22), 0 20px 50px rgba(0,0,0,0.44)", position: "relative", overflow: "hidden" }}>
                        {/* Orange top bar */}
                        <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 3, background: `linear-gradient(90deg,${p2},${p},${p3},rgba(249,115,22,0.2))`, borderRadius: "0 0 4px 4px" }} />

                        {/* Card header */}
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: p }} />
                                    <span style={{ fontSize: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".18em", color: INK2 }}>CCS Profile System</span>
                                </div>
                                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 900, fontStyle: "italic", color: INK, letterSpacing: "-.02em", lineHeight: 1 }}>Welcome back</div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.22)", borderRadius: 99, fontSize: 8, fontWeight: 600, color: p2, whiteSpace: "nowrap" }}>
                                <div style={{ width: 5, height: 5, borderRadius: "50%", background: p }} />
                                Portal live
                            </div>
                        </div>

                        {/* Tab row */}
                        <div style={{ display: "flex", borderBottom: "1.5px solid #EDD9C0", marginBottom: 12 }}>
                            {["Login", "Sign up"].map((t, i) => (
                                <span key={t} style={{ padding: "5px 0", marginRight: 16, marginBottom: "-1.5px", fontFamily: "'Playfair Display',serif", fontSize: 13, fontWeight: 700, fontStyle: "italic", color: i === 0 ? INK : "rgba(26,10,0,0.26)", borderBottom: i === 0 ? "2.5px solid #f97316" : "2.5px solid transparent", cursor: "pointer" }}>{t}</span>
                            ))}
                        </div>

                        {/* Hint box */}
                        <div style={{ fontSize: 9, color: p2, marginBottom: 12, background: "rgba(249,115,22,0.06)", borderLeft: `3px solid ${p}`, padding: "5px 9px", borderRadius: "0 6px 6px 0", lineHeight: 1.6 }}>Enter your credentials to access the CCS academic portal.</div>

                        {/* Fields */}
                        {[["EMAIL ADDRESS", "dean@pnc.edu.ph"], ["PASSWORD", "••••••••••"]].map(([l, ph], i) => (
                            <div key={i} style={{ marginBottom: 9 }}>
                                <label style={{ fontSize: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".14em", color: INK2, display: "block", marginBottom: 4 }}>{l}</label>
                                <div style={{ height: 38, borderRadius: 9, border: `1.5px solid ${i === 0 ? p + "55" : INPBD}`, background: INPBG, display: "flex", alignItems: "center", paddingLeft: 11 }}>
                                    <span style={{ fontSize: 10, color: i === 0 ? INK : "rgba(26,10,0,0.28)" }}>{ph}</span>
                                </div>
                            </div>
                        ))}

                        {/* Remember / Forgot */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "8px 0 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <div style={{ width: 12, height: 12, borderRadius: 3, border: "1.5px solid #F4D5B8", background: INPBG, display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={7} color={p} /></div>
                                <span style={{ fontSize: 9, color: INK2 }}>Remember me</span>
                            </div>
                            <span style={{ fontSize: 9, fontWeight: 500, color: p2, cursor: "pointer" }}>Forgot password?</span>
                        </div>

                        {/* CTA */}
                        <div style={{ height: 40, background: `linear-gradient(135deg,${p2},${p},${p3})`, color: "#fff", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", gap: 8, cursor: "pointer", boxShadow: `0 6px 18px ${p}3a` }}>
                            Get Started →
                        </div>

                        <div style={{ textAlign: "center", marginTop: 12, fontSize: 8, color: INK3, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            Secured with 256-bit SSL encryption
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
/* ══════════════════════════════════════════════════
   DASHBOARD PREVIEW  — warm dark orange palette
══════════════════════════════════════════════════ */
function DashboardPreview({ theme, selectedEl, onSelect, previewContext }) {
    const p = theme.primary || "#f97316";
    const p2 = theme.secondary || p + "aa";
    const p3 = theme.secondary || "#fb923c";
    const p4 = "#fdba74";
    const r = Math.min(theme.radius || 14, 16);
    const stroke = Number(theme.iconStroke) || 1.5;
    const iconSz = { small: 13, medium: 14, large: 16, xl: 18 }[theme.iconSize] || 14;

    // Use theme colors
    const BG = theme.background || "#0d0905";
    const SURF = theme.surface || "#160c06";
    const SURF2 = theme.surface ? theme.surface + "cc" : "#1c1008";
    const BDR = theme.border || "#2a1508";
    const TXT = theme.textPrimary || "#fef3ec";
    const MUT = theme.textMuted || "rgba(254,243,236,0.45)";
    const MUT2 = theme.textMuted ? theme.textMuted + "44" : "rgba(254,243,236,0.22)";

    const navIcons = [
        useIcon(theme, "nav_overview"), useIcon(theme, "nav_students"),
        useIcon(theme, "nav_faculty"), useIcon(theme, "nav_instruction"),
        useIcon(theme, "nav_scheduling"), useIcon(theme, "nav_events"),
        useIcon(theme, "nav_reports"), useIcon(theme, "nav_settings"),
    ];
    const kpiIcons = [
        useIcon(theme, "kpi_students"), useIcon(theme, "kpi_faculty"),
        useIcon(theme, "kpi_sections"), useIcon(theme, "kpi_gwa"),
    ];
    const BellIc = useIcon(theme, "top_bell");
    const SearchIc = useIcon(theme, "top_search");
    const LogoIc = useIcon(theme, "brand_logo");
    const ReportIc = useIcon(theme, "action_report");

    const sW = theme.layout === "iconrail" ? 48 : ["topnav", "gridmode"].includes(theme.layout) ? 0 : Math.min(theme.sidebarW || 240, 200);
    const showSB = !["topnav", "gridmode"].includes(theme.layout);
    const showR = theme.layout === "dualpanel";
    const slim = sW === 48 || theme.layout === "iconrail";

    const baseFS = 14;
    const scale = (theme.fontSize || 14) / baseFS;
    const sf = (s) => Math.round(s * scale);

    const sel = (id) => ({
        outline: selectedEl === id ? `2px solid ${p}` : "2px solid transparent",
        outlineOffset: selectedEl === id ? 2 : 0,
        cursor: "pointer",
        borderRadius: r,
        transition: "outline .1s, box-shadow .12s",
        boxShadow: selectedEl === id ? `0 0 0 4px ${p}28` : "none",
    });

    const NAV_LABELS = ["Overview", "Students", "Faculty", "Instruction", "Scheduling", "Events", "Reports", "Settings"];

    const FullSidebar = () => (
        <div onClick={() => onSelect("sidebar")} style={{ ...sel("sidebar"), width: sW, background: SURF, borderRight: `1px solid ${BDR}`, display: "flex", flexDirection: "column", padding: "13px 9px", flexShrink: 0, gap: 1 }}>
            {/* Brand */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 5px", marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: Math.min(r, 9), background: `linear-gradient(135deg,${p},${p2})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 3px 10px ${p}50`, flexShrink: 0 }}>
                    <LogoIc size={13} color="#fff" strokeWidth={stroke} />
                </div>
                {!slim && <div>
                    <div style={{ fontFamily: theme.displayFont || "'Space Mono',monospace", fontSize: sf(9), fontWeight: 700, color: p, letterSpacing: ".04em" }}>CCS·ProFile</div>
                    <div style={{ fontSize: sf(7), color: MUT }}>{theme.deptAbbrev || "CCS"} · {theme.academicYear || "2025–26"}</div>
                </div>}
            </div>
            {!slim && <div style={{ fontSize: sf(7), fontWeight: 700, color: MUT2, letterSpacing: ".1em", textTransform: "uppercase", padding: "0 5px", marginBottom: 5 }}>Main Menu</div>}
            {navIcons.map((Icon, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: slim ? 0 : 8, padding: slim ? "8px 0" : "7px 9px", borderRadius: Math.min(r, 8), background: i === 0 ? `${p}18` : "transparent", border: i === 0 ? `1px solid ${p}30` : "1px solid transparent", justifyContent: slim ? "center" : "flex-start", marginBottom: 1, cursor: "pointer" }}>
                    <Icon size={iconSz} color={i === 0 ? p : MUT} strokeWidth={stroke} />
                    {!slim && <span style={{ fontSize: sf(9), fontWeight: i === 0 ? 700 : 400, color: i === 0 ? p : MUT }}>{NAV_LABELS[i]}</span>}
                    {!slim && i === 0 && <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: p, boxShadow: `0 0 6px ${p}` }} />}
                </div>
            ))}
        </div>
    );

    const Topbar = () => (
        <div onClick={() => onSelect("topbar")} style={{ ...sel("topbar"), height: Math.min(theme.topbarH || 64, 56), background: SURF, borderBottom: `1px solid ${BDR}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", flexShrink: 0 }}>
            <div>
                <div style={{ fontSize: sf(12), fontWeight: 700, color: TXT, letterSpacing: "-.01em" }}>{theme.institution || "Pamantasan ng Cabuyao"} · <span style={{ color: p }}>{theme.deptAbbrev || "CCS"}</span></div>
                <div style={{ fontSize: sf(8), color: MUT, marginTop: 1 }}>{theme.academicYear || "2025–2026"} · {theme.semester || "1st Semester"} · Dean's View</div>
            </div>
            <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, height: 28, background: `${p}0a`, border: `1px solid ${BDR}`, borderRadius: Math.min(r, 8), padding: "0 10px" }}>
                    <SearchIc size={sf(10)} color={MUT} strokeWidth={stroke} />
                    <span style={{ fontSize: sf(9), color: MUT2 }}>Search…</span>
                </div>
                <div style={{ width: 28, height: 28, borderRadius: Math.min(r, 8), background: `${p}0d`, border: `1px solid ${BDR}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <BellIc size={sf(12)} color={MUT} strokeWidth={stroke} />
                    <div style={{ position: "absolute", top: 5, right: 5, width: 5, height: 5, borderRadius: "50%", background: p, boxShadow: `0 0 6px ${p}`, border: `1.5px solid ${SURF}` }} />
                </div>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${p},${p2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: sf(9), fontWeight: 700, color: "#fff", boxShadow: `0 2px 8px ${p}50` }}>MV</div>
            </div>
        </div>
    );

    const TopNavBar = () => (
        <div onClick={() => onSelect("topbar")} style={{ ...sel("topbar"), height: Math.min(theme.topbarH || 64, 56), background: SURF, borderBottom: `1px solid ${BDR}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 24, height: 24, borderRadius: Math.min(r, 7), background: `linear-gradient(135deg,${p},${p2})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 2px 8px ${p}50` }}>
                    <LogoIc size={sf(11)} color="#fff" strokeWidth={stroke} />
                </div>
                {["Overview", "Students", "Faculty", "Schedule", "Events", "Admin"].map((l, i) => (
                    <div key={i} style={{ padding: "4px 9px", borderRadius: Math.min(r, 6), background: i === 0 ? `${p}18` : "transparent", cursor: "pointer", border: i === 0 ? `1px solid ${p}30` : "1px solid transparent" }}>
                        <span style={{ fontSize: sf(10), fontWeight: i === 0 ? 700 : 500, color: i === 0 ? p : MUT }}>{l}</span>
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                <div style={{ width: 28, height: 28, borderRadius: Math.min(r, 7), background: `${p}0d`, border: `1px solid ${BDR}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <BellIc size={sf(12)} color={MUT} strokeWidth={stroke} />
                    <div style={{ position: "absolute", top: 5, right: 5, width: 5, height: 5, borderRadius: "50%", background: p }} />
                </div>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${p},${p2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: sf(9), fontWeight: 700, color: "#fff" }}>MV</div>
            </div>
        </div>
    );

    // Banner — uses theme.alert* customization fields
    const alertMsg = theme.alertMessage || `Academic Year ${theme.academicYear || "2025–2026"} · ${theme.semester || "1st Semester"} is now active.`;
    const alertBg = (previewContext === "announcement" && theme.alertBg) ? theme.alertBg : previewContext === "announcement" ? p + "14" : `color-mix(in srgb, ${p}, transparent 92%)`;
    const alertBdr = (previewContext === "announcement" && theme.alertBorder) ? theme.alertBorder : previewContext === "announcement" ? p + "30" : `color-mix(in srgb, ${p}, transparent 80%)`;
    const alertTxt = (previewContext === "announcement" && theme.alertText) ? theme.alertText : previewContext === "announcement" ? p3 : p;
    const alertIco = (previewContext === "announcement" && theme.alertIconColor) ? theme.alertIconColor : previewContext === "announcement" ? p : p;
    const alertStyle = theme.alertStyle || "bar";

    const Banner = () => {
        if (theme.showAlerts === false) return null;
        return (
            <>
                {/* Bar style (default) */}
                {(alertStyle === "bar" || alertStyle === "banner") && (
                    <div style={{ background: alertBg, borderBottom: `1px solid ${alertBdr}`, padding: alertStyle === "banner" ? "9px 16px" : "6px 16px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        {alertStyle === "banner" && <div style={{ width: 26, height: 26, borderRadius: 6, background: `${alertIco}18`, border: `1px solid ${alertIco}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><BellIc size={sf(12)} color={alertIco} strokeWidth={stroke} /></div>}
                        {alertStyle === "bar" && <BellIc size={sf(10)} color={alertIco} strokeWidth={stroke} />}
                        <span style={{ fontSize: sf(10), color: alertTxt, fontWeight: 500, flex: 1 }}>{alertMsg}</span>
                        {theme.alertDismissable !== false && <span style={{ fontSize: sf(12), color: alertTxt, opacity: .6, cursor: "pointer" }}>×</span>}
                    </div>
                )}
                {/* Toast style — floating bottom-right */}
                {alertStyle === "toast" && (
                    <div style={{ position: "absolute", bottom: 12, right: 12, zIndex: 20, width: 220, background: alertBg, border: `1px solid ${alertBdr}`, borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "flex-start", gap: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: `${alertIco}18`, border: `1px solid ${alertIco}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><BellIc size={sf(12)} color={alertIco} strokeWidth={stroke} /></div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: sf(9), fontWeight: 700, color: "#fef3ec", marginBottom: 2 }}>System Announcement</div>
                            <div style={{ fontSize: sf(8), color: alertTxt, lineHeight: 1.5 }}>{alertMsg}</div>
                        </div>
                        {theme.alertDismissable !== false && <span style={{ fontSize: sf(11), color: alertTxt, opacity: .6, cursor: "pointer", flexShrink: 0 }}>×</span>}
                    </div>
                )}
            </>
        );
    };

    const kpiData = [
        { v: "1,682", l: "Total Students", badge: "+7%", hi: true },
        { v: "48", l: "Faculty Members", badge: "+3%", hi: false },
        { v: "86", l: "Active Sections", badge: "+5%", hi: false },
    ];

    return (
        <div style={{ width: "100%", height: "100%", overflow: "hidden", background: BG, fontFamily: theme.bodyFont || "'DM Sans',sans-serif", color: TXT, display: "flex", flexDirection: "column", fontSize: theme.fontSize || 14, position: "relative" }}>
            {/* Ambient glow orbs */}
            <div style={{ position: "absolute", top: "-10%", right: "5%", width: 280, height: 280, background: `${p}06`, borderRadius: "50%", filter: "blur(70px)", pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "absolute", bottom: "10%", left: "-5%", width: 200, height: 200, background: `${p2}08`, borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }} />

            {theme.layout === "topnav" && <TopNavBar />}
            <Banner />

            <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative", zIndex: 1 }}>
                {showSB && theme.layout !== "right" && <FullSidebar />}

                <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
                    {theme.layout !== "topnav" && <Topbar />}

                    {/* MAIN CONTENT */}
                    <div onClick={() => onSelect("content")} style={{ ...sel("content"), flex: 1, overflow: "hidden", padding: "13px 14px", display: "flex", flexDirection: "column", gap: 10, background: "transparent" }}>

                        {/* Page heading */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div style={{ fontFamily: theme.displayFont || "'Playfair Display',serif", fontSize: sf(15), fontWeight: 700, color: TXT, letterSpacing: "-.02em" }}>{theme.deptAbbrev || "CCS"} · Dean's Dashboard</div>
                                <div style={{ fontSize: sf(8), color: MUT, marginTop: 2 }}>{theme.academicYear || "2025–2026"} — {theme.semester || "1st Semester"}</div>
                            </div>
                            <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                                <div style={{ padding: "5px 11px", borderRadius: Math.min(r, 8), background: `${p}0a`, border: `1px solid ${BDR}`, fontSize: sf(9), fontWeight: 600, color: MUT, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                                    <ReportIc size={sf(10)} color={p} strokeWidth={stroke} />
                                    Generate Report
                                </div>
                                <div style={{ padding: "5px 13px", borderRadius: Math.min(r, 8), background: `linear-gradient(135deg,${p},${p2})`, fontSize: sf(9), fontWeight: 700, color: "#fff", boxShadow: `0 2px 10px ${p}50`, cursor: "pointer" }}>+ New</div>
                            </div>
                        </div>

                        {/* PENDING ACTIONS — 4-card row matching real DeanDashboardMain */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                            {[
                                { label: "Grade Submissions", count: 14, color: p3 },
                                { label: "Overload Requests", count: 3, color: p },
                                { label: "Curriculum Proposals", count: 5, color: p4 },
                                { label: "Room Conflicts", count: 2, color: p2 },
                            ].map(({ label, count, color }, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 11px", borderRadius: Math.min(r, 10), background: `${p}06`, border: `1px solid ${BDR}`, cursor: "pointer" }}>
                                    <div style={{ width: 28, height: 28, borderRadius: 7, background: `${color}18`, border: `1px solid ${color}28`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: sf(11), fontWeight: 700, color: color }}>{count}</span>
                                    </div>
                                    <div style={{ fontSize: sf(8), fontWeight: 600, color: MUT, lineHeight: 1.3 }}>{label}</div>
                                </div>
                            ))}
                        </div>

                        {/* KPI CARDS */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 9 }}>
                            {kpiData.map(({ v, l, badge, hi }, i) => {
                                const KpiIcon = kpiIcons[i];
                                return (
                                    <div key={i} onClick={e => { e.stopPropagation(); onSelect("kpi" + i); }}
                                        style={{
                                            ...sel("kpi" + i),
                                            background: hi ? `linear-gradient(135deg,${p},${p2})` : SURF,
                                            borderRadius: r, padding: "13px 14px",
                                            boxShadow: hi ? `0 6px 20px ${p}50` : `0 2px 8px rgba(0,0,0,0.4)`,
                                            border: hi ? "none" : `1px solid ${BDR}`,
                                            position: "relative", overflow: "hidden", cursor: "pointer"
                                        }}>
                                        <div style={{ fontSize: sf(8), fontWeight: 700, color: hi ? "rgba(255,255,255,0.7)" : MUT, letterSpacing: ".09em", textTransform: "uppercase", marginBottom: 5 }}>{l}</div>
                                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: sf(22), fontWeight: 700, color: hi ? "#fff" : TXT, letterSpacing: "-.02em", lineHeight: 1 }}>{v}</div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 7 }}>
                                            <span style={{ fontSize: sf(9), fontWeight: 700, padding: "1px 7px", borderRadius: 99, background: hi ? "rgba(255,255,255,0.2)" : `${p}20`, color: hi ? "#fff" : p }}>{badge}</span>
                                            <span style={{ fontSize: sf(8), color: hi ? "rgba(255,255,255,0.55)" : MUT }}>vs last sem</span>
                                        </div>
                                        <div style={{ position: "absolute", bottom: -10, right: -8, opacity: hi ? .12 : .05 }}>
                                            <KpiIcon size={sf(54)} color={hi ? "#fff" : p} strokeWidth={1} />
                                        </div>
                                        {/* Pulse dot on active card */}
                                        {hi && <div style={{ position: "absolute", top: 11, right: 11, width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.6)", boxShadow: "0 0 0 3px rgba(255,255,255,0.2)" }} />}
                                    </div>
                                );
                            })}
                        </div>

                        {/* CHART + PROGRAMS + STUDENTS */}
                        <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 9, flex: 1, minHeight: 0 }}>
                            {/* Enrollment chart */}
                            <div onClick={e => { e.stopPropagation(); onSelect("chart"); }} style={{ ...sel("chart"), background: SURF, borderRadius: r, padding: "13px 14px", border: `1px solid ${BDR}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                                    <div>
                                        <div style={{ fontSize: sf(11), fontWeight: 700, color: TXT, letterSpacing: "-.01em" }}>Enrollment Trend</div>
                                        <div style={{ fontFamily: "'DM Sans',sans-serif", fontStyle: "italic", fontSize: sf(8), color: MUT, marginTop: 1 }}>BSCS · BSIT · per semester</div>
                                    </div>
                                    <div style={{ display: "flex", gap: 9, fontSize: sf(8), color: MUT }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 10, height: 2, background: p, borderRadius: 1 }} /> BSCS</span>
                                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 10, height: 2, background: p4, borderRadius: 1 }} /> BSIT</span>
                                    </div>
                                </div>
                                {/* Bar chart — orange family */}
                                <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 4, paddingBottom: 4, minHeight: 0 }}>
                                    {[{ a: 62, b: 44 }, { a: 72, b: 58 }, { a: 68, b: 50 }, { a: 85, b: 62 }, { a: 78, b: 55 }, { a: 88, b: 66 }, { a: 95, b: 70 }].map((d, i) => (
                                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, height: "100%", justifyContent: "flex-end" }}>
                                            <div style={{ width: "100%", display: "flex", gap: 2, alignItems: "flex-end", height: "80%" }}>
                                                <div style={{ flex: 1, background: i === 6 ? p : `${p}40`, borderRadius: `${Math.min(r / 2, 4)}px ${Math.min(r / 2, 4)}px 0 0`, height: `${d.a}%`, boxShadow: i === 6 ? `0 0 10px ${p}60` : undefined }} />
                                                <div style={{ flex: 1, background: i === 6 ? p4 : `${p4}35`, borderRadius: `${Math.min(r / 2, 4)}px ${Math.min(r / 2, 4)}px 0 0`, height: `${d.b}%` }} />
                                            </div>
                                            <span style={{ fontSize: sf(5), color: MUT2, whiteSpace: "nowrap" }}>{["S1", "S2", "S1", "S2", "S1", "S2", "S1"][i]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right column */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 9, minHeight: 0 }}>
                                {/* By Program */}
                                <div onClick={e => { e.stopPropagation(); onSelect("pie"); }} style={{ ...sel("pie"), background: SURF, borderRadius: r, padding: "11px 13px", border: `1px solid ${BDR}`, flex: 1, overflow: "hidden" }}>
                                    <div style={{ fontSize: sf(10), fontWeight: 700, color: TXT, letterSpacing: "-.01em", marginBottom: 8 }}>By Program</div>
                                    {[["BSCS", "420", 96], ["BSIT", "385", 86], ["BSIS", "290", 65], ["ACT", "182", 41], ["BSEMC", "150", 34]].map(([n, c, pct], i) => {
                                        const barColors = [p, p3, p4, `${p}77`, `${p}44`];
                                        return (
                                            <div key={n} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                                                <div style={{ width: 6, height: 6, borderRadius: 2, flexShrink: 0, background: barColors[i] }} />
                                                <span style={{ fontSize: sf(9), color: MUT, flex: 1, fontWeight: 500 }}>{n}</span>
                                                <div style={{ width: 55, height: 3, borderRadius: 2, background: `${p}18`, overflow: "hidden" }}>
                                                    <div style={{ height: "100%", width: `${pct}%`, background: barColors[i], borderRadius: 2, boxShadow: i === 0 ? `0 0 6px ${p}60` : undefined }} />
                                                </div>
                                                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: sf(8), fontWeight: 700, color: TXT, width: 26, textAlign: "right" }}>{c}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Recent Students */}
                                <div onClick={e => { e.stopPropagation(); onSelect("students"); }} style={{ ...sel("students"), background: SURF, borderRadius: r, padding: "11px 13px", border: `1px solid ${BDR}`, flex: 1, overflow: "hidden" }}>
                                    <div style={{ fontSize: sf(10), fontWeight: 700, color: TXT, letterSpacing: "-.01em", marginBottom: 7 }}>Recent Students</div>
                                    {[["Aaliyah Santos", "BSCS", "Dean's", "#22c55e"], ["Miguel Reyes", "BSIT", "Regular", p4], ["Sophia Cruz", "BSIS", "Grad", p]].map(([n, prog, tag, tc], i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, padding: "4px 0", borderBottom: i < 2 ? `1px solid ${BDR}` : "none" }}>
                                            <div style={{ width: 20, height: 20, borderRadius: Math.min(r, 6), background: `${p}20`, border: `1px solid ${p}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: sf(7), fontWeight: 700, color: p, flexShrink: 0 }}>{n.split(" ").map(w => w[0]).join("")}</div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: sf(9), fontWeight: 600, color: TXT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n}</div>
                                                <div style={{ fontSize: sf(7), color: MUT }}>{prog}</div>
                                            </div>
                                            <span style={{ fontSize: sf(7), fontWeight: 700, padding: "2px 6px", borderRadius: theme.badgeShape === "square" ? 3 : 99, background: `${tc}18`, color: tc, whiteSpace: "nowrap", border: `1px solid ${tc}30` }}>{tag}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {showR && (
                    <div style={{ width: 82, background: SURF, borderLeft: `1px solid ${BDR}`, padding: "9px 7px", display: "flex", flexDirection: "column", gap: 5, flexShrink: 0 }}>
                        <div style={{ fontSize: sf(7), fontWeight: 700, color: MUT2, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 3 }}>Context</div>
                        {["Profile", "Events", "Alerts", "Faculty", "Reports"].map((l, i) => (
                            <div key={i} style={{ padding: "6px 7px", borderRadius: Math.min(r, 7), background: i === 0 ? `${p}14` : SURF2, border: `1px solid ${i === 0 ? p + "30" : BDR}`, fontSize: sf(9), fontWeight: i === 0 ? 600 : 400, color: i === 0 ? p : MUT, cursor: "pointer" }}>{l}</div>
                        ))}
                    </div>
                )}

                {theme.layout === "right" && (
                    <div style={{ width: sW, background: SURF, borderLeft: `1px solid ${BDR}`, flexShrink: 0 }}>
                        <FullSidebar />
                    </div>
                )}
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════
   PROPERTY PANEL
══════════════════════════════════════════════════ */
function PropPanel({ selectedEl, theme, update, onClose }) {
    if (!selectedEl) return null;
    const isTopbar = selectedEl === "topbar", isSidebar = selectedEl === "sidebar";
    const isKpi = selectedEl?.startsWith("kpi"), isContent = selectedEl === "content";
    const isPie = selectedEl === "pie", isStudents = selectedEl === "students";
    const labels = { topbar: "Topbar", sidebar: "Sidebar", content: "Content Area", chart: "Enrollment Chart", pie: "Program Chart", students: "Student Table" };
    const title = labels[selectedEl] || (isKpi ? "KPI Card" : "Element");
    const bgKey = isTopbar ? "topbar" : isSidebar ? "sidebar" : "surface";

    return (
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 272, background: "rgba(10,6,3,0.97)", borderLeft: "1px solid rgba(249,115,22,0.18)", display: "flex", flexDirection: "column", backdropFilter: "blur(20px)", zIndex: 50, boxShadow: "-8px 0 28px rgba(0,0,0,0.5)", animation: "pp-in .2s ease", fontFamily: "'DM Sans',sans-serif" }}>
            <style>{`@keyframes pp-in{from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:translateX(0)}}`}</style>
            <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(249,115,22,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "rgba(249,115,22,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(249,115,22,0.14)", border: "1px solid rgba(249,115,22,0.24)", display: "flex", alignItems: "center", justifyContent: "center" }}><Sparkles size={11} color={O} /></div>
                    <div><div style={{ fontSize: 11, fontWeight: 700, color: "#fef3ec" }}>{title}</div><div style={{ fontSize: 8, color: "rgba(254,243,236,0.35)", marginTop: 1 }}>Element Properties</div></div>
                </div>
                <button onClick={onClose} style={{ width: 20, height: 20, borderRadius: 5, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", color: "rgba(249,115,22,0.7)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={10} /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "13px 14px" }}>
                <ColorRow label="Background" k={bgKey} theme={theme} update={update} />
                <ColorRow label="Accent / Primary" k="primary" theme={theme} update={update} />
                {(isTopbar || isSidebar) && <SliderRow label="Border Radius" k="radius" min={0} max={30} unit="px" theme={theme} update={update} />}
                {isSidebar && <SliderRow label="Sidebar Width" k="sidebarW" min={180} max={300} unit="px" theme={theme} update={update} />}
                {isTopbar && <SliderRow label="Topbar Height" k="topbarH" min={48} max={80} unit="px" theme={theme} update={update} />}
                {(isContent || isKpi) && <SliderRow label="Font Size" k="fontSize" min={12} max={18} unit="px" theme={theme} update={update} />}
                {(isKpi || isPie || isStudents) && <>
                    <SectionDivider label="Card Style" />
                    <ChipRow label="Card Style" k="cardStyle" opts={[{ l: "Flat", v: "flat" }, { l: "Bordered", v: "bordered" }, { l: "Elevated", v: "elevated" }, { l: "Glass", v: "glass" }]} theme={theme} update={update} />
                    <ChipRow label="Shadow" k="shadowDepth" opts={[{ l: "None", v: "none" }, { l: "Subtle", v: "subtle" }, { l: "Medium", v: "medium" }, { l: "Deep", v: "deep" }]} theme={theme} update={update} />
                </>}
                {isStudents && <ChipRow label="Badge Shape" k="badgeShape" opts={[{ l: "Square", v: "square" }, { l: "Rounded", v: "rounded" }, { l: "Pill", v: "pill" }]} theme={theme} update={update} />}
                <SectionDivider label="Interactions" />
                <ChipRow label="Hover Effect" k="hoverEffect" opts={[{ l: "None", v: "none" }, { l: "Lift", v: "lift" }, { l: "Glow", v: "glow" }, { l: "Scale", v: "scale" }]} theme={theme} update={update} />
                <div style={{ marginTop: 14, padding: "8px 10px", borderRadius: 7, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ fontSize: 8, color: "rgba(254,243,236,0.22)", fontFamily: "'Space Mono',monospace", lineHeight: 1.7 }}>
                        <div>id: <span style={{ color: `${O}99` }}>{selectedEl}</span></div>
                        <div>r: <span style={{ color: `${O}99` }}>{theme.radius}px</span> · font: <span style={{ color: `${O}99` }}>{theme.fontSize}px</span></div>
                        <div>color: <span style={{ color: theme.primary }}>{theme.primary}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════
   LAYERS PANEL
══════════════════════════════════════════════════ */
function LayersPanel({ selectedEl, setSelectedEl }) {
    const Item = ({ id, label, icon: Icon, depth = 0, badge }) => (
        <div onClick={() => setSelectedEl(id)} style={{ display: "flex", alignItems: "center", gap: 7, padding: `7px 10px 7px ${10 + depth * 16}px`, borderRadius: 7, cursor: "pointer", background: selectedEl === id ? "rgba(249,115,22,0.1)" : "transparent", border: selectedEl === id ? "1px solid rgba(249,115,22,0.25)" : "1px solid transparent", marginBottom: 2, transition: "all .13s" }}>
            <Icon size={11} color={selectedEl === id ? O : "rgba(249,115,22,0.4)"} />
            <span style={{ fontSize: 10, fontWeight: 600, color: selectedEl === id ? O : "rgba(254,243,236,0.55)", flex: 1 }}>{label}</span>
            {badge && <span style={{ fontSize: 7, fontWeight: 700, padding: "1px 5px", borderRadius: 3, background: "rgba(249,115,22,0.1)", color: "rgba(249,115,22,0.5)", letterSpacing: ".06em" }}>{badge}</span>}
            <Eye size={8} color="rgba(254,243,236,0.18)" />
        </div>
    );
    return (
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 10px" }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: "rgba(249,115,22,0.38)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 8, padding: "0 2px" }}>PAGE LAYERS</div>
            <Item id="topbar" label="Topbar" icon={PanelTop} badge="Layout" />
            <Item id="sidebar" label="Sidebar" icon={PanelLeft} badge="Layout" />
            <Item id="content" label="Content Area" icon={LayoutDashboard} badge="Section" />
            <Item id="kpi0" label="KPI — Students" icon={Users} depth={1} />
            <Item id="kpi1" label="KPI — Faculty" icon={GraduationCap} depth={1} />
            <Item id="kpi2" label="KPI — Sections" icon={Layers} depth={1} />
            <Item id="kpi3" label="KPI — GWA" icon={TrendingUp} depth={1} />
            <Item id="chart" label="Enrollment Chart" icon={BarChart3} depth={1} />
            <Item id="pie" label="Programs Chart" icon={PieChart} depth={1} />
            <Item id="students" label="Student Table" icon={Users} depth={1} />
        </div>
    );
}

/* ══════════════════════════════════════════════════
   ALERTS TAB — full inline editor
══════════════════════════════════════════════════ */
function AlertsTab({ theme, update }) {
    const defaultMsg = `Academic Year ${theme.academicYear || "2025–2026"} · ${theme.semester || "1st Semester"} is now active.`;
    const msg   = theme.alertMessage  || "";
    const title = theme.alertTitle    || "System Announcement";
    const style = theme.alertStyle    || "bar";
    const bg    = theme.alertBg       || "#0a1f0a";
    const bdr   = theme.alertBorder   || "#14532d55";
    const txt   = theme.alertText     || "#4ade80";
    const ico   = theme.alertIconColor|| "#4ade80";

    const inputSt = {
        width: "100%", background: "rgba(249,115,22,0.05)",
        border: "1px solid rgba(249,115,22,0.16)", borderRadius: 8,
        padding: "8px 12px", fontSize: 12, color: "#fef3ec",
        outline: "none", fontFamily: "'DM Sans',sans-serif",
    };

    const ALERT_TYPES = [
        { id: "info",    label: "Info",    color: "#3b82f6", icon: "ℹ" },
        { id: "success", label: "Success", color: "#22c55e", icon: "✓" },
        { id: "warning", label: "Warning", color: "#f59e0b", icon: "⚠" },
        { id: "danger",  label: "Danger",  color: "#ef4444", icon: "✕" },
        { id: "custom",  label: "Custom",  color: ico,       icon: "★" },
    ];

    const applyType = (t) => {
        const map = {
            info:    { bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.28)",  text: "#93c5fd", icon: "#3b82f6" },
            success: { bg: "#0a1f0a",                border: "#14532d55",              text: "#4ade80", icon: "#4ade80" },
            warning: { bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.28)",  text: "#fcd34d", icon: "#f59e0b" },
            danger:  { bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.28)",   text: "#fca5a5", icon: "#ef4444" },
        };
        if (map[t]) {
            update("alertBg",        map[t].bg);
            update("alertBorder",    map[t].border);
            update("alertText",      map[t].text);
            update("alertIconColor", map[t].icon);
        }
    };

    return (
        <div style={{ padding: 14, overflowY: "auto", display: "flex", flexDirection: "column", gap: 0 }}>

            {/* ── EDITOR CARD ── */}
            <div style={{
                background: "rgba(249,115,22,0.04)", border: "1px solid rgba(249,115,22,0.16)",
                borderRadius: 14, padding: 16, marginBottom: 14,
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 24, height: 24, borderRadius: 7, background: "rgba(249,115,22,0.16)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <Bell size={12} color="#f97316" />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#fef3ec" }}>Alert Settings</span>
                    </div>
                </div>

                {/* Main On/Off Toggle */}
                <div style={{
                    marginBottom: 16, padding: "12px 14px", borderRadius: 10,
                    background: theme.showAlerts ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)",
                    border: `1px solid ${theme.showAlerts ? "rgba(34,197,94,0.16)" : "rgba(239,68,68,0.16)"}`,
                    display: "flex", alignItems: "center", justifyContent: "space-between"
                }}>
                    <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: theme.showAlerts ? "#4ade80" : "#fca5a5" }}>
                            {theme.showAlerts ? "Alert System Online" : "Alert System Offline"}
                        </div>
                        <div style={{ fontSize: 9, color: "rgba(254,243,236,0.35)", marginTop: 2 }}>
                            {theme.showAlerts ? "Alerts are currently visible to all users." : "Alerts are hidden from all users."}
                        </div>
                    </div>
                    <div onClick={() => update("showAlerts", !theme.showAlerts)}
                        style={{
                            width: 38, height: 20, borderRadius: 10, cursor: "pointer", transition: "all .2s",
                            background: theme.showAlerts ? "#22c55e" : "rgba(239,68,68,0.2)",
                            border: `1px solid ${theme.showAlerts ? "#22c55e" : "rgba(239,68,68,0.4)"}`,
                            position: "relative",
                        }}>
                        <div style={{
                            position: "absolute", top: 2, left: theme.showAlerts ? 20 : 2,
                            width: 14, height: 14, borderRadius: "50%",
                            background: "#fff", transition: "left .2s",
                        }} />
                    </div>
                </div>

                {/* Alert type chips */}
                <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 8, fontWeight: 700, color: "rgba(254,243,236,0.35)", letterSpacing: ".1em", textTransform: "uppercase", display: "block", marginBottom: 7 }}>Alert Type</label>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {ALERT_TYPES.map(t => (
                            <button key={t.id} onClick={() => t.id !== "custom" && applyType(t.id)}
                                style={{
                                    display: "flex", alignItems: "center", gap: 5,
                                    padding: "5px 10px", borderRadius: 7,
                                    background: `${t.color}18`,
                                    border: `1px solid ${t.color}40`,
                                    color: t.color, fontSize: 9, fontWeight: 700,
                                    cursor: "pointer", fontFamily: "inherit",
                                }}>
                                <span>{t.icon}</span>
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Title */}
                <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 8, fontWeight: 700, color: "rgba(254,243,236,0.35)", letterSpacing: ".1em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>Alert Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => update("alertTitle", e.target.value)}
                        placeholder="System Announcement"
                        style={inputSt}
                    />
                </div>

                {/* Message */}
                <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 8, fontWeight: 700, color: "rgba(254,243,236,0.35)", letterSpacing: ".1em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>Message Body</label>
                    <textarea
                        value={msg}
                        onChange={e => update("alertMessage", e.target.value)}
                        placeholder={defaultMsg}
                        rows={3}
                        style={{ ...inputSt, resize: "vertical", minHeight: 64 }}
                    />
                </div>

                {/* Style + Position row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                    <div>
                        <label style={{ fontSize: 8, fontWeight: 700, color: "rgba(254,243,236,0.35)", letterSpacing: ".1em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>Display Style</label>
                        <select value={style} onChange={e => update("alertStyle", e.target.value)}
                            style={{ ...inputSt, padding: "7px 10px", fontSize: 11, cursor: "pointer" }}>
                            <option value="bar">Bar</option>
                            <option value="toast">Toast</option>
                            <option value="banner">Banner</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: 8, fontWeight: 700, color: "rgba(254,243,236,0.35)", letterSpacing: ".1em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>Position</label>
                        <select value={theme.alertPosition || "top"} onChange={e => update("alertPosition", e.target.value)}
                            style={{ ...inputSt, padding: "7px 10px", fontSize: 11, cursor: "pointer" }}>
                            <option value="top">Top</option>
                            <option value="bottom">Bottom</option>
                            <option value="floating">Floating</option>
                        </select>
                    </div>
                </div>

                {/* Color row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 10 }}>
                    {[["Background", "alertBg", bg], ["Text", "alertText", txt], ["Icon", "alertIconColor", ico]].map(([lbl, key, val]) => (
                        <div key={key}>
                            <label style={{ fontSize: 8, fontWeight: 700, color: "rgba(254,243,236,0.35)", letterSpacing: ".1em", textTransform: "uppercase", display: "block", marginBottom: 4 }}>{lbl}</label>
                            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                                <input type="color" value={val.startsWith("rgba") ? "#4ade80" : val} onChange={e => update(key, e.target.value)}
                                    style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid rgba(249,115,22,0.2)", cursor: "pointer", background: "transparent", padding: 2, flexShrink: 0 }} />
                                <input type="text" value={val} onChange={e => update(key, e.target.value)}
                                    style={{ flex: 1, background: "rgba(249,115,22,0.04)", border: "1px solid rgba(249,115,22,0.1)", borderRadius: 6, padding: "4px 6px", fontSize: 8, fontFamily: "'Space Mono',monospace", color: "#fef3ec", outline: "none", minWidth: 0 }} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dismissable toggle */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid rgba(249,115,22,0.1)" }}>
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#fef3ec" }}>Dismissable</div>
                        <div style={{ fontSize: 9, color: "rgba(254,243,236,0.35)" }}>Show × close button</div>
                    </div>
                    <div onClick={() => update("alertDismissable", !theme.alertDismissable)}
                        style={{
                            width: 36, height: 20, borderRadius: 99, cursor: "pointer", transition: "all .2s",
                            background: theme.alertDismissable ? "#f97316" : "rgba(249,115,22,0.1)",
                            border: theme.alertDismissable ? "1px solid #f97316" : "1px solid rgba(249,115,22,0.2)",
                            position: "relative",
                        }}>
                        <div style={{
                            position: "absolute", top: 2, left: theme.alertDismissable ? 18 : 2,
                            width: 14, height: 14, borderRadius: "50%",
                            background: theme.alertDismissable ? "#fff" : "rgba(249,115,22,0.5)",
                            transition: "left .2s",
                        }} />
                    </div>
                </div>
            </div>

            {/* ── LIVE PREVIEW ── */}
            <div style={{ marginBottom: 14, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(249,115,22,0.18)" }}>
                <div style={{ padding: "5px 10px", background: "rgba(249,115,22,0.06)", borderBottom: "1px solid rgba(249,115,22,0.1)" }}>
                    <span style={{ fontSize: 8, fontWeight: 700, color: "rgba(249,115,22,0.5)", letterSpacing: ".1em", textTransform: "uppercase", fontFamily: "'Space Mono',monospace" }}>Live Preview</span>
                </div>

                {/* Bar */}
                {(style === "bar" || !style) && (
                    <div style={{ padding: "8px 14px", background: bg, borderBottom: `1px solid ${bdr}`, display: "flex", alignItems: "center", gap: 8 }}>
                        <Bell size={12} color={ico} />
                        <span style={{ fontSize: 10, color: txt, fontWeight: 500, flex: 1 }}>{msg || defaultMsg}</span>
                        {theme.alertDismissable && <span style={{ fontSize: 12, color: txt, opacity: .6, cursor: "pointer" }}>×</span>}
                    </div>
                )}
                {/* Toast */}
                {style === "toast" && (
                    <div style={{ padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: 10, background: "#0d0905" }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, border: `1px solid ${bdr}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Bell size={14} color={ico} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#fef3ec", marginBottom: 2 }}>{title}</div>
                            <div style={{ fontSize: 9, color: txt }}>{msg || defaultMsg}</div>
                        </div>
                        {theme.alertDismissable && <span style={{ fontSize: 12, color: "rgba(254,243,236,0.4)", cursor: "pointer" }}>×</span>}
                    </div>
                )}
                {/* Banner */}
                {style === "banner" && (
                    <div style={{ padding: "14px 18px", background: `linear-gradient(135deg,${bg},rgba(0,0,0,0.4))`, display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${ico}18`, border: `1px solid ${ico}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Bell size={16} color={ico} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#fef3ec", marginBottom: 2 }}>{title}</div>
                            <div style={{ fontSize: 10, color: txt }}>{msg || defaultMsg}</div>
                        </div>
                        {theme.alertDismissable && <button style={{ padding: "4px 12px", borderRadius: 6, background: `${ico}18`, border: `1px solid ${ico}40`, color: ico, fontSize: 9, fontWeight: 700, cursor: "pointer" }}>Dismiss</button>}
                    </div>
                )}
                <div style={{ height: 32, background: "#0d0905", display: "flex", alignItems: "center", padding: "0 14px", gap: 6 }}>
                    <div style={{ height: 5, width: 70, borderRadius: 3, background: "rgba(249,115,22,0.08)" }} />
                    <div style={{ height: 5, width: 110, borderRadius: 3, background: "rgba(249,115,22,0.05)" }} />
                </div>
            </div>

            {/* ── QUICK PRESETS ── */}
            <SectionDivider label="Quick Presets" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {[
                    { label: "Success Green", bg: "#0a1f0a", border: "#14532d55", text: "#4ade80", icon: "#4ade80" },
                    { label: "PNC Orange",    bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.28)", text: "#fb923c", icon: "#f97316" },
                    { label: "Info Blue",     bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.28)", text: "#93c5fd", icon: "#3b82f6" },
                    { label: "Warning Amber", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.28)", text: "#fcd34d", icon: "#f59e0b" },
                    { label: "Danger Red",    bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.28)",  text: "#fca5a5", icon: "#ef4444" },
                    { label: "Minimal Dark",  bg: "rgba(255,255,255,0.04)",border: "rgba(255,255,255,0.08)",text: "rgba(254,243,236,0.6)", icon: "rgba(254,243,236,0.4)" },
                ].map((p, i) => (
                    <button key={i} onClick={() => { update("alertBg", p.bg); update("alertBorder", p.border); update("alertText", p.text); update("alertIconColor", p.icon); }}
                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(249,115,22,0.1)", background: "rgba(249,115,22,0.03)", cursor: "pointer", textAlign: "left" }}>
                        <div style={{ width: 20, height: 20, borderRadius: 5, background: p.bg, border: `1px solid ${p.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Bell size={9} color={p.icon} />
                        </div>
                        <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(254,243,236,0.6)" }}>{p.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}





/* ══════════════════════════════════════════════════
   DESIGN PANEL
══════════════════════════════════════════════════ */
function DesignPanel({ theme, update, activeTab, setActiveTab }) {
    const [openSec, setOpenSec] = useState("presets");

    const Acc = ({ id, icon: Icon, title, children }) => {
        const open = openSec === id;
        return (
            <div style={{ borderBottom: "1px solid rgba(249,115,22,0.07)" }}>
                <button onClick={() => setOpenSec(open ? null : id)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 15px", background: open ? "rgba(249,115,22,0.04)" : "transparent", border: "none", cursor: "pointer", color: open ? O : "rgba(254,243,236,0.55)", transition: "all .15s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, background: open ? "rgba(249,115,22,0.15)" : "rgba(249,115,22,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon size={12} color={open ? O : "rgba(249,115,22,0.42)"} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700 }}>{title}</span>
                    </div>
                    {open ? <ChevronUp size={11} color={O} /> : <ChevronDown size={11} color="rgba(249,115,22,0.35)" />}
                </button>
                {open && <div style={{ padding: "2px 14px 14px" }}>{children}</div>}
            </div>
        );
    };

    return (
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", borderBottom: "1px solid rgba(249,115,22,0.1)", padding: "7px 10px 0", gap: 3, flexShrink: 0, background: "rgba(8,5,2,0.5)", overflowX: "auto" }}>
                {[{ id: "theme", l: "Theme" }, { id: "layout", l: "Layout" }, { id: "icons", l: "Icons ✦" }, { id: "components", l: "Components" }, { id: "effects", l: "Effects" }, { id: "branding", l: "Branding" }, { id: "browser-tab", l: "Browser Tab" }, { id: "alerts", l: "Alerts" }].map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "5px 10px", borderRadius: "6px 6px 0 0", fontSize: 9, fontWeight: 600, cursor: "pointer", background: activeTab === t.id ? "rgba(249,115,22,0.12)" : "transparent", color: activeTab === t.id ? O : "rgba(254,243,236,0.32)", border: "none", borderBottom: activeTab === t.id ? `2px solid ${O}` : "2px solid transparent", fontFamily: "inherit", transition: "all .15s", whiteSpace: "nowrap" }}>{t.l}</button>
                ))}
            </div>

            {/* ICONS TAB */}
            {activeTab === "icons" && <IconCustomPanel theme={theme} update={update} />}

            {/* THEME */}
            {activeTab === "theme" && <>
                <Acc id="presets" icon={Sparkles} title="Color Presets">
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 5, marginBottom: 14 }}>
                        {COLOR_PRESETS.map(cp => (
                            <button key={cp.name} onClick={() => { 
                                update("primary", cp.primary); 
                                update("background", cp.bg); 
                                update("surface", cp.surface); 
                                if (cp.secondary) update("secondary", cp.secondary);
                                if (cp.border) update("border", cp.border);
                                if (cp.tp) update("textPrimary", cp.tp);
                                if (cp.tm) update("textMuted", cp.tm);
                            }} style={{ padding: "7px 4px", borderRadius: 8, border: `1px solid ${theme.primary === cp.primary ? "rgba(249,115,22,0.5)" : "rgba(249,115,22,0.1)"}`, background: theme.primary === cp.primary ? "rgba(249,115,22,0.12)" : "rgba(249,115,22,0.03)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, transition: "all .16s" }}>
                                <div style={{ width: 24, height: 13, borderRadius: 4, background: cp.primary, boxShadow: `0 2px 6px ${cp.primary}55` }} />
                                <span style={{ fontSize: 7, fontWeight: 600, color: theme.primary === cp.primary ? O : "rgba(254,243,236,0.4)" }}>{cp.name}</span>
                            </button>
                        ))}
                    </div>
                </Acc>
                <Acc id="colors" icon={Palette} title="Color System">
                    <SectionDivider label="Brand" />
                    <ColorRow label="Primary Accent" k="primary" theme={theme} update={update} sub="Main brand" />
                    <ColorRow label="Secondary Accent" k="secondary" theme={theme} update={update} />
                    <SectionDivider label="Surfaces" />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        {[["Background", "background"], ["Surface", "surface"], ["Sidebar", "sidebar"], ["Topbar", "topbar"]].map(([l, k]) => (
                            <div key={k}>
                                <label style={{ fontSize: 8, fontWeight: 700, color: "rgba(254,243,236,0.32)", display: "block", marginBottom: 4, letterSpacing: ".06em", textTransform: "uppercase" }}>{l}</label>
                                <div style={{ display: "flex", gap: 5 }}><input type="color" value={theme[k] || "#000"} onChange={e => update(k, e.target.value)} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid rgba(249,115,22,0.18)", cursor: "pointer", background: "transparent", padding: 2 }} /><input type="text" value={theme[k] || ""} onChange={e => update(k, e.target.value)} style={{ flex: 1, background: "rgba(249,115,22,0.04)", border: "1px solid rgba(249,115,22,0.1)", borderRadius: 7, padding: "5px 7px", fontSize: 8, fontFamily: "'Space Mono',monospace", color: "#fef3ec", outline: "none" }} /></div>
                            </div>
                        ))}
                    </div>
                    <SectionDivider label="Semantic States" />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        {[["Danger", "danger"], ["Warning", "warning"], ["Success", "success"], ["Info", "info"]].map(([l, k]) => (
                            <div key={k}><label style={{ fontSize: 8, fontWeight: 700, color: "rgba(254,243,236,0.32)", display: "block", marginBottom: 4, letterSpacing: ".06em", textTransform: "uppercase" }}>{l}</label><div style={{ display: "flex", gap: 5 }}><input type="color" value={theme[k] || "#000"} onChange={e => update(k, e.target.value)} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid rgba(249,115,22,0.18)", cursor: "pointer", background: "transparent", padding: 2 }} /><input type="text" value={theme[k] || ""} onChange={e => update(k, e.target.value)} style={{ flex: 1, background: "rgba(249,115,22,0.04)", border: "1px solid rgba(249,115,22,0.1)", borderRadius: 7, padding: "5px 7px", fontSize: 8, fontFamily: "'Space Mono',monospace", color: "#fef3ec", outline: "none" }} /></div></div>
                        ))}
                    </div>
                </Acc>
                <Acc id="typography" icon={Type} title="Typography">
                    <div style={{ marginBottom: 12 }}>
                        <label style={{ fontSize: 9, fontWeight: 700, color: "rgba(254,243,236,0.35)", letterSpacing: ".09em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Font Pairing</label>
                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                            {FONT_PAIRS.map((fp, i) => (
                                <button key={i} onClick={() => { update("displayFont", fp.display); update("bodyFont", fp.body); update("monoFont", fp.mono); }} style={{ padding: "9px 11px", borderRadius: 8, border: `1px solid ${theme.displayFont === fp.display ? "rgba(249,115,22,0.42)" : "rgba(249,115,22,0.1)"}`, background: theme.displayFont === fp.display ? "rgba(249,115,22,0.1)" : "rgba(249,115,22,0.03)", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all .16s" }}>
                                    <div><div style={{ fontFamily: fp.display, fontSize: 12, fontWeight: 700, color: "#fef3ec", lineHeight: 1 }}>{fp.label}</div><div style={{ fontFamily: fp.body, fontSize: 8, color: "rgba(254,243,236,0.42)", marginTop: 2 }}>Body · <span style={{ fontFamily: fp.mono }}>Mono 1234</span></div></div>
                                    {theme.displayFont === fp.display && <div style={{ width: 16, height: 16, borderRadius: "50%", background: O, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Check size={9} color="#fff" /></div>}
                                </button>
                            ))}
                        </div>
                    </div>
                    <SliderRow label="Base Font Size" k="fontSize" min={12} max={18} unit="px" theme={theme} update={update} />
                    <ChipRow label="Line Height" k="lineHeight" opts={[{ l: "Tight", v: "tight" }, { l: "Normal", v: "normal" }, { l: "Relaxed", v: "relaxed" }, { l: "Loose", v: "loose" }]} theme={theme} update={update} />
                </Acc>
                <Acc id="shape" icon={Box} title="Shape & Spacing">
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 5, marginBottom: 10 }}>
                        {RADIUS_PRESETS.map(rp => (
                            <button key={rp.label} onClick={() => update("radius", rp.value)} style={{ padding: "7px 4px", borderRadius: 6, border: `1px solid ${theme.radius === rp.value ? "rgba(249,115,22,0.42)" : "rgba(249,115,22,0.1)"}`, background: theme.radius === rp.value ? "rgba(249,115,22,0.12)" : "rgba(249,115,22,0.03)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                                <div style={{ width: 16, height: 11, borderRadius: rp.value === 0 ? 1 : rp.value === 8 ? 3 : rp.value === 14 ? 5 : 9, background: "rgba(249,115,22,0.4)", border: "1px solid rgba(249,115,22,0.3)" }} />
                                <span style={{ fontSize: 7, fontWeight: 600, color: theme.radius === rp.value ? O : "rgba(254,243,236,0.38)" }}>{rp.label}</span>
                            </button>
                        ))}
                    </div>
                    <SliderRow label="Border Radius" k="radius" min={0} max={30} unit="px" theme={theme} update={update} />
                    <SliderRow label="Card / Grid Gap" k="gap" min={4} max={32} unit="px" theme={theme} update={update} />
                    <ChipRow label="Density" k="density" opts={[{ l: "Compact", v: "compact" }, { l: "Default", v: "default" }, { l: "Comfort", v: "comfortable" }, { l: "Spacious", v: "spacious" }]} theme={theme} update={update} />
                </Acc>
            </>}

            {/* LAYOUT */}
            {activeTab === "layout" && (
                <div style={{ padding: 14 }}>
                    <label style={{ fontSize: 9, fontWeight: 700, color: "rgba(254,243,236,0.35)", letterSpacing: ".1em", textTransform: "uppercase", display: "block", marginBottom: 11 }}>System Layout Preset</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                        {LAYOUT_OPTIONS.map(lo => (
                            <button key={lo.id} onClick={() => update("layout", lo.id)} style={{ padding: "10px 8px", borderRadius: 10, cursor: "pointer", textAlign: "left", background: theme.layout === lo.id ? `linear-gradient(135deg,rgba(249,115,22,0.17),rgba(194,65,12,0.09))` : "rgba(249,115,22,0.03)", border: theme.layout === lo.id ? `1px solid rgba(249,115,22,0.42)` : "1px solid rgba(249,115,22,0.1)", transition: "all .16s" }}>
                                <div style={{ width: "100%", height: 30, borderRadius: 4, background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.1)", marginBottom: 5, overflow: "hidden", display: "flex", position: "relative" }}>
                                    {lo.id === "topnav" && <><div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "rgba(249,115,22,0.28)" }} /><div style={{ position: "absolute", top: 8, left: 3, right: 3, bottom: 3, background: "rgba(249,115,22,0.07)", borderRadius: 2 }} /></>}
                                    {lo.id === "classic" && <><div style={{ width: 11, background: "rgba(249,115,22,0.22)", height: "100%" }} /><div style={{ flex: 1, padding: 3, display: "flex", flexDirection: "column", gap: 2 }}><div style={{ height: 4, background: "rgba(249,115,22,0.17)" }} /><div style={{ flex: 1, background: "rgba(249,115,22,0.07)", borderRadius: 1 }} /></div></>}
                                    {lo.id === "right" && <><div style={{ flex: 1, padding: 3, display: "flex", flexDirection: "column", gap: 2 }}><div style={{ height: 4, background: "rgba(249,115,22,0.17)" }} /><div style={{ flex: 1, background: "rgba(249,115,22,0.07)", borderRadius: 1 }} /></div><div style={{ width: 11, background: "rgba(249,115,22,0.22)", height: "100%" }} /></>}
                                    {lo.id === "iconrail" && <><div style={{ width: 5, background: "rgba(249,115,22,0.32)", height: "100%" }} /><div style={{ flex: 1, padding: 3, display: "flex", flexDirection: "column", gap: 2 }}><div style={{ height: 4, background: "rgba(249,115,22,0.17)" }} /><div style={{ flex: 1, background: "rgba(249,115,22,0.07)", borderRadius: 1 }} /></div></>}
                                    {lo.id === "dualpanel" && <><div style={{ width: 9, background: "rgba(249,115,22,0.22)", height: "100%" }} /><div style={{ flex: 1, padding: "2px 2px", display: "flex", flexDirection: "column", gap: 2 }}><div style={{ height: 3, background: "rgba(249,115,22,0.17)" }} /><div style={{ flex: 1, background: "rgba(249,115,22,0.07)", borderRadius: 1 }} /></div><div style={{ width: 8, background: "rgba(249,115,22,0.13)", height: "100%" }} /></>}
                                    {lo.id === "gridmode" && <div style={{ flex: 1, padding: 3, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>{[1, 2, 3, 4].map(i => <div key={i} style={{ borderRadius: 2, background: "rgba(249,115,22,0.14)" }} />)}</div>}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div><div style={{ fontSize: 9, fontWeight: 700, color: theme.layout === lo.id ? O : "#fef3ec" }}>{lo.label}</div><div style={{ fontSize: 7, color: "rgba(254,243,236,0.3)", marginTop: 1 }}>{lo.desc}</div></div>
                                    {theme.layout === lo.id && <Check size={9} color={O} />}
                                </div>
                            </button>
                        ))}
                    </div>
                    <SectionDivider label="Dimensions" />
                    <SliderRow label="Sidebar Width" k="sidebarW" min={180} max={300} unit="px" theme={theme} update={update} />
                    <SliderRow label="Topbar Height" k="topbarH" min={48} max={80} unit="px" theme={theme} update={update} />
                    <SliderRow label="Design Panel Width" k="designPanelW" min={280} max={520} unit="px" theme={theme} update={update} />
                </div>
            )}

            {/* COMPONENTS */}
            {activeTab === "components" && (
                <div style={{ padding: 14 }}>
                    <SectionDivider label="Buttons" />
                    <ChipRow label="Button Style" k="buttonStyle" opts={[{ l: "Filled", v: "filled" }, { l: "Outlined", v: "outlined" }, { l: "Ghost", v: "ghost" }, { l: "Gradient", v: "gradient" }]} theme={theme} update={update} />
                    <ChipRow label="Button Shape" k="buttonShape" opts={[{ l: "Square", v: "square" }, { l: "Rounded", v: "rounded" }, { l: "Pill", v: "pill" }]} theme={theme} update={update} />
                    <SectionDivider label="Cards" />
                    <ChipRow label="Card Style" k="cardStyle" opts={[{ l: "Flat", v: "flat" }, { l: "Bordered", v: "bordered" }, { l: "Elevated", v: "elevated" }, { l: "Glass", v: "glass" }]} theme={theme} update={update} />
                    <ChipRow label="Shadow Depth" k="shadowDepth" opts={[{ l: "None", v: "none" }, { l: "Subtle", v: "subtle" }, { l: "Medium", v: "medium" }, { l: "Deep", v: "deep" }]} theme={theme} update={update} />
                    <SectionDivider label="Avatars & Badges" />
                    <ChipRow label="Avatar Shape" k="avatarShape" opts={[{ l: "Circle", v: "circle" }, { l: "Rounded", v: "rounded" }, { l: "Square", v: "square" }]} theme={theme} update={update} />
                    <ChipRow label="Badge Shape" k="badgeShape" opts={[{ l: "Square", v: "square" }, { l: "Rounded", v: "rounded" }, { l: "Pill", v: "pill" }]} theme={theme} update={update} />
                    <SectionDivider label="Component Preview" />
                    <div style={{ padding: "12px", borderRadius: 9, background: "rgba(249,115,22,0.04)", border: "1px solid rgba(249,115,22,0.1)" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                            <button style={{ padding: "6px 13px", fontSize: 10, fontWeight: 700, cursor: "pointer", borderRadius: theme.buttonShape === "pill" ? "999px" : theme.buttonShape === "square" ? "4px" : "9px", background: theme.buttonStyle === "filled" ? `linear-gradient(135deg,${O},#c2410c)` : "transparent", color: theme.buttonStyle === "outlined" || theme.buttonStyle === "ghost" ? O : "#fff", border: theme.buttonStyle === "outlined" ? `1px solid ${O}` : theme.buttonStyle === "ghost" ? "1px solid rgba(249,115,22,0.3)" : "none" }}>Button</button>
                            <div style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg,${O},#c2410c)`, borderRadius: theme.avatarShape === "circle" ? "50%" : theme.avatarShape === "square" ? "5px" : "10px" }}>MV</div>
                            {["Dean's List", "Graduating"].map((s, i) => (
                                <span key={i} style={{ fontSize: 8, fontWeight: 700, padding: "2px 7px", borderRadius: theme.badgeShape === "pill" ? "999px" : theme.badgeShape === "square" ? "3px" : "6px", background: i === 0 ? "rgba(249,115,22,0.16)" : "rgba(52,211,153,0.12)", color: i === 0 ? "#fb923c" : "#34d399", border: `1px solid ${i === 0 ? "rgba(249,115,22,0.3)" : "rgba(52,211,153,0.3)"}` }}>{s}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* EFFECTS */}
            {activeTab === "effects" && (
                <div style={{ padding: 14 }}>
                    <ToggleRow label="Dark Mode" sub="Switch between dark/light canvas" k="darkMode" theme={theme} update={update} />
                    <ToggleRow label="Animations" sub="Enable global transitions & motion" k="animations" theme={theme} update={update} />
                    <ToggleRow label="Ambient Glow" sub="Soft radial orb backgrounds" k="ambientGlow" theme={theme} update={update} />
                    <ToggleRow label="High Contrast" sub="Boost contrast for accessibility" k="highContrast" theme={theme} update={update} />
                    <ToggleRow label="Reduced Motion" sub="Disable all animations system-wide" k="reducedMotion" theme={theme} update={update} />
                    <SectionDivider label="Motion & Interaction" />
                    <ChipRow label="Transition Speed" k="transSpeed" opts={[{ l: "Instant", v: "instant" }, { l: "Fast", v: "fast" }, { l: "Normal", v: "normal" }, { l: "Slow", v: "slow" }]} theme={theme} update={update} />
                    <ChipRow label="Hover Effect" k="hoverEffect" opts={[{ l: "None", v: "none" }, { l: "Lift", v: "lift" }, { l: "Glow", v: "glow" }, { l: "Scale", v: "scale" }, { l: "Flash", v: "flash" }]} theme={theme} update={update} />
                    <SectionDivider label="Background" />
                    <ChipRow label="BG Texture" k="bgTexture" opts={[{ l: "None", v: "none" }, { l: "Grid", v: "grid" }, { l: "Dots", v: "dots" }, { l: "Diagonal", v: "diagonal" }, { l: "Noise", v: "noise" }]} theme={theme} update={update} />
                    <SliderRow label="Glass Blur" k="glassBlur" min={0} max={40} unit="px" theme={theme} update={update} />
                </div>
            )}

            {/* BRANDING */}
            {activeTab === "branding" && (
                <div style={{ padding: 14 }}>
                    <SectionDivider label="Institution Identity" />
                    <TextInput label="System Title" k="systemTitle" theme={theme} update={update} placeholder="CCS Comprehensive Profiling System" />
                    <TextInput label="Institution Name" k="institution" theme={theme} update={update} placeholder="Pamantasan ng Cabuyao" />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 0 }}>
                        <TextInput label="Dept. Abbrev." k="deptAbbrev" theme={theme} update={update} placeholder="CCS" />
                        <TextInput label="Academic Year" k="academicYear" theme={theme} update={update} placeholder="2025–2026" />
                    </div>
                    <TextInput label="Semester" k="semester" theme={theme} update={update} placeholder="1st Semester" />
                    <TextInput label="Footer Text" k="footerText" theme={theme} update={update} placeholder="© 2025 Pamantasan ng Cabuyao" />
                    <SectionDivider label="Logo & Media" />
                    <div style={{ marginBottom: 10, padding: "14px", borderRadius: 9, background: "rgba(249,115,22,0.04)", border: "1px dashed rgba(249,115,22,0.22)", textAlign: "center", cursor: "pointer" }}>
                        <Upload size={18} color="rgba(249,115,22,0.45)" style={{ margin: "0 auto 6px" }} />
                        <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(254,243,236,0.5)" }}>Upload Logo / Seal</div>
                        <div style={{ fontSize: 8, color: "rgba(254,243,236,0.25)", marginTop: 2 }}>PNG or SVG · Max 1MB</div>
                    </div>
                    <SectionDivider label="Live Font Preview" />
                    <div style={{ padding: "12px", borderRadius: 9, background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.12)" }}>
                        <div style={{ fontFamily: theme.displayFont, fontSize: 15, fontWeight: 700, color: "#fef3ec", marginBottom: 4 }}>{theme.institution || "Pamantasan ng Cabuyao"}</div>
                        <div style={{ fontFamily: theme.bodyFont, fontSize: 11, color: "rgba(254,243,236,0.55)", marginBottom: 4 }}>{theme.systemTitle || "CCS Comprehensive Profiling System"}</div>
                        <div style={{ fontFamily: theme.monoFont, fontSize: 10, color: O }}>GWA: 2.14 · ID: 2025-CS-001 · {theme.academicYear || "2025–2026"}</div>
                    </div>
                </div>
            )}

            {/* ── BROWSER TAB ── */}
            {activeTab === "browser-tab" && (
                <div style={{ padding: 14, overflowY: "auto" }}>

                    {/* Live preview of the chrome */}
                    <div style={{ marginBottom: 16, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(249,115,22,0.18)", boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
                        {/* Mock browser window */}
                        <div style={{ height: 38, background: theme.browserTabTheme === "light" ? "#f1f5f9" : "#120800", borderBottom: `1px solid ${theme.browserTabTheme === "light" ? "#dde4f0" : "#2a1005"}`, display: "flex", alignItems: "flex-end", padding: "0 12px", gap: 8 }}>
                            <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 7 }}>
                                {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
                            </div>
                            {/* Active tab */}
                            <div style={{ display: "flex", alignItems: "center", gap: 6, background: theme.browserTabTheme === "light" ? "#ffffff" : "#1e0d02", border: `1px solid ${theme.browserTabTheme === "light" ? "#dde4f0" : "#3a1a08"}`, borderBottom: "none", borderRadius: "5px 5px 0 0", padding: "5px 12px 6px", marginBottom: "-1px" }}>
                                <div style={{ width: 11, height: 11, borderRadius: 3, background: `linear-gradient(135deg,${theme.browserTabAccent || O},${theme.browserTabAccent || O}88)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <div style={{ width: 5, height: 5, borderRadius: 1, background: "#fff" }} />
                                </div>
                                <span style={{ fontSize: 9, fontWeight: 600, color: theme.browserTabTheme === "light" ? "#334155" : "#fef3ec", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{theme.browserTabTitle || "CCS ProFile · Login"}</span>
                                <span style={{ fontSize: 11, color: theme.browserTabTheme === "light" ? "#94a3b8" : "rgba(254,243,236,0.4)", marginLeft: 2 }}>×</span>
                            </div>
                            {/* Inactive tab */}
                            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px 6px", opacity: .5, marginBottom: "-1px" }}>
                                <span style={{ fontSize: 8, color: theme.browserTabTheme === "light" ? "#64748b" : "rgba(254,243,236,0.3)" }}>Dashboard</span>
                            </div>
                        </div>
                        {/* Address bar */}
                        <div style={{ height: 30, background: theme.browserTabTheme === "light" ? "#f8fafc" : "#1a0c04", display: "flex", alignItems: "center", padding: "0 12px", gap: 8, borderBottom: `1px solid ${theme.browserTabTheme === "light" ? "#e2e8f0" : "#2a1005"}` }}>
                            <div style={{ flex: 1, height: 22, borderRadius: 5, background: theme.browserTabTheme === "light" ? "#fff" : "#0f0702", border: `1px solid ${theme.browserTabTheme === "light" ? "#e2e8f0" : "#2a1005"}`, display: "flex", alignItems: "center", padding: "0 9px", gap: 6 }}>
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                <span style={{ fontSize: 8, fontFamily: "'Space Mono',monospace", color: theme.browserTabTheme === "light" ? "#64748b" : "rgba(254,243,236,0.45)", flex: 1, overflow: "hidden", whiteSpace: "nowrap" }}>{theme.browserTabUrl || "ccs.pnc.edu.ph/login"}</span>
                            </div>
                        </div>
                        {/* Page content hint */}
                        <div style={{ height: 48, background: theme.browserTabTheme === "light" ? "#f0f4f8" : "#0d0905", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 8, fontWeight: 600, color: theme.browserTabTheme === "light" ? "#94a3b8" : "rgba(254,243,236,0.22)", letterSpacing: ".1em", textTransform: "uppercase", fontFamily: "'Space Mono',monospace" }}>Page Content Area</span>
                        </div>
                    </div>

                    <SectionDivider label="Tab Content" />
                    <TextInput label="Tab Title" k="browserTabTitle" theme={theme} update={update} placeholder="CCS ProFile · Login" />
                    <TextInput label="URL / Address Bar" k="browserTabUrl" theme={theme} update={update} placeholder="ccs.pnc.edu.ph/login" />

                    <SectionDivider label="Chrome Theme" />
                    <ChipRow label="Browser Chrome" k="browserTabTheme" opts={[{ l: "Dark (PNC)", v: "dark" }, { l: "Light", v: "light" }]} theme={theme} update={update} />

                    <SectionDivider label="Tab Accent Color" />
                    <ColorRow label="Favicon / Tab Accent" k="browserTabAccent" theme={theme} update={update} sub="Icon color in tab" />

                    <SectionDivider label="Quick Presets" />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                        {[
                            { label: "PNC Dark", title: "CCS ProFile · Login", url: "ccs.pnc.edu.ph/login", theme: "dark", accent: "#f97316" },
                            { label: "PNC Light", title: "CCS ProFile · Dashboard", url: "ccs.pnc.edu.ph/dashboard", theme: "light", accent: "#f97316" },
                            { label: "Minimal", title: "CCS", url: "pnc.edu.ph/ccs", theme: "light", accent: "#64748b" },
                            { label: "Official", title: "Pamantasan ng Cabuyao · CCS", url: "pnc.edu.ph/ccs/login", theme: "dark", accent: "#f97316" },
                        ].map((p, i) => (
                            <button key={i} onClick={() => { update("browserTabTitle", p.title); update("browserTabUrl", p.url); update("browserTabTheme", p.theme); update("browserTabAccent", p.accent); }}
                                style={{ padding: "9px 10px", borderRadius: 8, border: `1px solid rgba(249,115,22,0.14)`, background: "rgba(249,115,22,0.04)", cursor: "pointer", textAlign: "left", transition: "all .16s" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: 2, background: p.accent }} />
                                    <span style={{ fontSize: 10, fontWeight: 700, color: "#fef3ec" }}>{p.label}</span>
                                </div>
                                <div style={{ fontSize: 8, color: "rgba(254,243,236,0.35)", fontFamily: "'Space Mono',monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.url}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── ALERTS ── */}
            {activeTab === "alerts" && <AlertsTab theme={theme} update={update} />}


        </div>
    );
}

/* ══════════════════════════════════════════════════
   MAIN EDITOR
══════════════════════════════════════════════════ */
export default function WebCustomization({ savedTheme }) {
    const { props } = usePage();
    const userRole = props?.auth?.user?.role || "dean";

    const [theme, setTheme] = useState(savedTheme ? { ...DEFAULT, ...savedTheme, icons: { ...DEFAULT_ICONS, ...savedTheme?.icons } } : { ...DEFAULT });
    const [selectedEl, setSelectedEl] = useState(null);
    const [leftPanel, setLeftPanel] = useState("design");
    const [leftOpen, setLeftOpen] = useState(true);
    const [viewport, setViewport] = useState("desktop");
    const [previewMode, setPreviewMode] = useState("dashboard");
    const [previewRole, setPreviewRole] = useState("dean");
    const [zoom, setZoom] = useState(1);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [history, setHistory] = useState([{ ...DEFAULT }]);
    const [histIdx, setHistIdx] = useState(0);
    const [activeDesignTab, setActiveDesignTab] = useState("theme");
    const [snapshots, setSnapshots] = useState([]);
    const canvasRef = useRef(null);

    // ── TAB FLIP ANIMATION ──
    const PREVIEW_ORDER = ["browser-tab", "login", "dashboard", "announcement", "sidebar"];
    const [flipPhase, setFlipPhase] = useState("idle");
    const [flipDir, setFlipDir] = useState(1);
    const [visibleMode, setVisibleMode] = useState("dashboard");
    const pendingMode = useRef(null);

    const switchTab = useCallback((newMode) => {
        if (newMode === previewMode || flipPhase !== "idle") return;
        const oldIdx = PREVIEW_ORDER.indexOf(previewMode);
        const newIdx = PREVIEW_ORDER.indexOf(newMode);
        setFlipDir(newIdx >= oldIdx ? 1 : -1);
        pendingMode.current = newMode;
        setFlipPhase("out");
    }, [previewMode, flipPhase]);

    useEffect(() => {
        if (flipPhase === "out") {
            const t = setTimeout(() => {
                setPreviewMode(pendingMode.current);
                setVisibleMode(pendingMode.current);
                setFlipPhase("in");
            }, 190);
            return () => clearTimeout(t);
        }
        if (flipPhase === "in") {
            const t = setTimeout(() => setFlipPhase("idle"), 210);
            return () => clearTimeout(t);
        }
    }, [flipPhase]);

    if (!["dean", "super_admin", "admin"].includes(userRole)) {
        return (
            <AppLayout title="Web Customization">
                <div style={{ padding: 60, textAlign: "center", color: "var(--text-primary)", fontFamily: "var(--body-font)" }}>
                    <Lock size={44} color="var(--primary)" style={{ margin: "0 auto 18px" }} />
                    <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Access Restricted</div>
                    <div style={{ color: "var(--text-muted)" }}>Only Dean and Super Admin can access Web Customization.</div>
                </div>
            </AppLayout>
        );
    }

    const update = useCallback((key, value) => {
        setTheme(prev => {
            const next = { ...prev, [key]: value };
            setHistory(h => { const s = h.slice(0, histIdx + 1); return [...s, next].slice(-30); });
            setHistIdx(h => Math.min(h + 1, 29));
            return next;
        });
    }, [histIdx]);

    const undo = () => { if (histIdx > 0) { setHistIdx(h => h - 1); setTheme(history[histIdx - 1]); } };
    const redo = () => { if (histIdx < history.length - 1) { setHistIdx(h => h + 1); setTheme(history[histIdx + 1]); } };
    const reset = () => { if (window.confirm("Reset to PNC Orange baseline?")) setTheme({ ...DEFAULT }); };

    const handleSave = useCallback(() => {
        setSaving(true);
        router.post(route("web-customization.update"), { theme }, {
            preserveScroll: true,
            onSuccess: () => { setSaved(true); setSaving(false); setTimeout(() => setSaved(false), 2200); },
            onError: () => { setSaving(false); },
        });
    }, [theme]);

    // ── AUTOSAVE LOGIC ──
    const firstRender = useRef(true);
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        const timer = setTimeout(() => {
            handleSave();
        }, 1200); // 1.2s debounce
        return () => clearTimeout(timer);
    }, [theme]);

    const exportJSON = () => {
        const b = new Blob([JSON.stringify(theme, null, 2)], { type: "application/json" });
        const u = URL.createObjectURL(b); const a = document.createElement("a");
        a.href = u; a.download = "ccs-theme.json"; a.click();
    };

    const saveSnap = () => setSnapshots(s => [...s.slice(-4), { name: `Snap ${s.length + 1}`, t: JSON.parse(JSON.stringify(theme)) }]);
    const zoomIn = () => setZoom(z => Math.min(z + 0.1, 1.5));
    const zoomOut = () => setZoom(z => Math.max(z - 0.1, 0.4));

    const bgTex = {
        grid: "linear-gradient(rgba(249,115,22,0.028) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.028) 1px,transparent 1px)",
        dots: "radial-gradient(rgba(249,115,22,0.18) 1px,transparent 1px)",
        diagonal: "repeating-linear-gradient(45deg,rgba(249,115,22,0.018) 0,rgba(249,115,22,0.018) 1px,transparent 0,transparent 50%)",
    };
    const bgSz = { grid: "40px 40px", dots: "22px 22px", diagonal: "14px 14px" };

    // Count changed icons
    const changedIconCount = Object.keys(theme.icons || {}).filter(k => (theme.icons[k] !== DEFAULT_ICONS[k])).length;

    return (
        <AppLayout title="Web Customization — CCS Studio" noPadding>
            <Head title="Web Customization | CCS ProFile" />
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,900&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Serif+Display:ital@0;1&family=Fraunces:opsz,wght@9..144,700&family=Outfit:wght@400;600;700&family=Syne:wght@700;800&display=swap');
        .wce *{box-sizing:border-box;margin:0;padding:0;}
        .wce ::-webkit-scrollbar{width:3px;height:3px;}
        .wce ::-webkit-scrollbar-thumb{background:#2a1204;border-radius:2px;}
        .wce input[type=range]{-webkit-appearance:none;appearance:none;height:4px;background:transparent;cursor:pointer;}
        .wce input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:13px;height:13px;border-radius:50%;background:#f97316;border:2px solid #0c0805;box-shadow:0 0 5px rgba(249,115,22,0.5);cursor:pointer;margin-top:-4.5px;}
        .wce input[type=range]::-webkit-slider-track{height:4px;border-radius:2px;background:rgba(249,115,22,0.1);}
        .wce input[type=color]{-webkit-appearance:none;appearance:none;cursor:pointer;}
        .wce input[type=color]::-webkit-color-swatch-wrapper{padding:0;}
        .wce input[type=color]::-webkit-color-swatch{border:none;border-radius:5px;}
        .tb{display:flex;align-items:center;justify-content:center;border:none;cursor:pointer;transition:all .16s;font-family:inherit;}
        .tb:hover{opacity:.82;}
        @keyframes pls{0%,100%{box-shadow:0 0 0 0 rgba(249,115,22,0.5)}50%{box-shadow:0 0 0 5px rgba(249,115,22,0)}}
      `}</style>

            <div className="wce" style={{ flex: 1, fontFamily: "'DM Sans',system-ui,sans-serif", background: "#0c0805", width: "100%", overflow: "hidden", display: "flex", flexDirection: "column", color: "#fef3ec" }}>

                {/* TOP TOOLBAR */}
                <header style={{ height: 50, background: "rgba(10,6,3,0.98)", borderBottom: "1px solid rgba(249,115,22,0.15)", display: "flex", alignItems: "center", padding: "0 14px", flexShrink: 0, backdropFilter: "blur(20px)", zIndex: 50, boxShadow: "0 2px 18px rgba(0,0,0,0.4)" }}>
                    {/* Logo */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: 13, borderRight: "1px solid rgba(249,115,22,0.12)", marginRight: 11, height: "100%" }}>
                        <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg,#f97316,#9a3412)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Wand2 size={13} color="#fff" /></div>
                        <div><div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, fontWeight: 700, color: O, letterSpacing: ".04em" }}>CCS Studio</div><div style={{ fontSize: 7, color: "rgba(254,243,236,0.28)" }}>Web Customization</div></div>
                    </div>

                    {/* Panels */}
                    <div style={{ display: "flex", gap: 2, paddingRight: 11, borderRight: "1px solid rgba(249,115,22,0.1)", marginRight: 11 }}>
                        {[{ id: "design", icon: Brush, tip: "Design" }, { id: "layers", icon: Layers, tip: "Layers" }].map(({ id, icon: Icon, tip }) => (
                            <button key={id} className="tb" onClick={() => { leftPanel === id && leftOpen ? setLeftOpen(false) : (setLeftPanel(id), setLeftOpen(true)); }} title={tip} style={{ width: 33, height: 33, borderRadius: 8, background: leftPanel === id && leftOpen ? "rgba(249,115,22,0.15)" : "transparent", border: leftPanel === id && leftOpen ? `1px solid rgba(249,115,22,0.28)` : "1px solid transparent", color: leftPanel === id && leftOpen ? O : "rgba(254,243,236,0.42)" }}>
                                <Icon size={14} />
                            </button>
                        ))}
                    </div>

                    {/* Undo/Redo/Reset */}
                    <div style={{ display: "flex", gap: 2, paddingRight: 11, borderRight: "1px solid rgba(249,115,22,0.1)", marginRight: 11 }}>
                        <button className="tb" onClick={undo} style={{ width: 30, height: 30, borderRadius: 7, background: "transparent", border: "1px solid transparent", color: histIdx > 0 ? "rgba(254,243,236,0.5)" : "rgba(254,243,236,0.16)" }}><Undo2 size={13} /></button>
                        <button className="tb" onClick={redo} style={{ width: 30, height: 30, borderRadius: 7, background: "transparent", border: "1px solid transparent", color: histIdx < history.length - 1 ? "rgba(254,243,236,0.5)" : "rgba(254,243,236,0.16)" }}><Redo2 size={13} /></button>
                        <button className="tb" onClick={reset} style={{ width: 30, height: 30, borderRadius: 7, background: "transparent", border: "1px solid transparent", color: "rgba(254,243,236,0.36)" }}><RefreshCw size={13} /></button>
                    </div>



                    {/* Viewport */}
                    <div style={{ display: "flex", gap: 1, padding: "2px", background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.14)", borderRadius: 9, marginRight: 11 }}>
                        {[{ id: "desktop", icon: Monitor }, { id: "tablet", icon: Tablet }, { id: "mobile", icon: Smartphone }].map(({ id, icon: Icon }) => (
                            <button key={id} className="tb" onClick={() => setViewport(id)} style={{ width: 29, height: 27, borderRadius: 7, background: viewport === id ? `linear-gradient(135deg,${O},#c2410c)` : "transparent", border: "none", color: viewport === id ? "#fff" : "rgba(254,243,236,0.36)" }}><Icon size={13} /></button>
                        ))}
                    </div>

                    {/* Zoom */}
                    <div style={{ display: "flex", alignItems: "center", gap: 4, paddingRight: 11, borderRight: "1px solid rgba(249,115,22,0.1)", marginRight: 11 }}>
                        <button className="tb" onClick={zoomOut} style={{ width: 25, height: 25, borderRadius: 6, background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.12)", color: "rgba(254,243,236,0.48)" }}><ZoomOut size={11} /></button>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, fontWeight: 700, color: "rgba(249,115,22,0.8)", width: 34, textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
                        <button className="tb" onClick={zoomIn} style={{ width: 25, height: 25, borderRadius: 6, background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.12)", color: "rgba(254,243,236,0.48)" }}><ZoomIn size={11} /></button>
                    </div>

                    {/* Role selector */}
                    <select value={previewRole} onChange={e => setPreviewRole(e.target.value)} style={{ background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.14)", borderRadius: 8, padding: "5px 9px", color: "rgba(254,243,236,0.58)", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", outline: "none", marginRight: 11 }}>
                        <option value="dean">Dean View</option>
                        <option value="faculty">Faculty View</option>
                        <option value="student">Student View</option>
                    </select>

                    {/* Color swatches + icon count badge */}
                    <div style={{ display: "flex", gap: 4, alignItems: "center", paddingRight: 11, borderRight: "1px solid rgba(249,115,22,0.1)", marginRight: "auto" }}>
                        {[theme.primary, theme.secondary, theme.background, theme.surface, theme.border].map((c, i) => (
                            <div key={i} style={{ width: 14, height: 14, borderRadius: 3, background: c, border: "1px solid rgba(249,115,22,0.2)", cursor: "pointer" }} title={c} />
                        ))}
                        {changedIconCount > 0 && (
                            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 7px", borderRadius: 5, background: "rgba(249,115,22,0.14)", border: "1px solid rgba(249,115,22,0.28)" }}>
                                <Sparkles size={9} color={O} />
                                <span style={{ fontSize: 8, fontWeight: 700, color: O, fontFamily: "'Space Mono',monospace" }}>{changedIconCount} icon{changedIconCount !== 1 ? "s" : ""}</span>
                            </div>
                        )}
                    </div>

                    {/* Right actions */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 11 }}>
                        <button className="tb" onClick={saveSnap} title="Save Snapshot" style={{ width: 30, height: 30, borderRadius: 7, background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.14)", color: "rgba(254,243,236,0.46)" }}><Copy size={12} /></button>
                        <button className="tb" onClick={exportJSON} title="Export JSON" style={{ width: 30, height: 30, borderRadius: 7, background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.14)", color: "rgba(254,243,236,0.46)" }}><Download size={12} /></button>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, paddingVertical: 4, paddingHorizontal: 12, borderRadius: 9, background: saved ? "rgba(34,197,94,0.12)" : "rgba(249,115,22,0.06)", border: `1px solid ${saved ? "rgba(34,197,94,0.2)" : "rgba(249,115,22,0.12)"}`, transition: "all .3s" }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: saved ? "#22c55e" : saving ? O : "rgba(254,243,236,0.2)", animation: saving ? "pls 1.5s infinite" : "none" }} />
                            <span style={{ fontSize: 9, fontWeight: 700, color: saved ? "#22c55e" : "rgba(254,243,236,0.48)", fontFamily: "'Space Mono',monospace", letterSpacing: ".07em" }}>
                                {saved ? "SYNCED" : saving ? "SAVING..." : "AUTO-SAVE"}
                            </span>
                        </div>
                    </div>
                </header>

                {/* EDITOR BODY */}
                <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

                    {/* LEFT PANEL */}
                    {leftOpen && (
                        <div style={{ width: theme.designPanelW || 520, flexShrink: 0, background: "rgba(10,6,3,0.98)", borderRight: "1px solid rgba(249,115,22,0.12)", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "4px 0 20px rgba(0,0,0,0.35)", transition: "width .15s ease-out" }}>


                            <div style={{ padding: "10px 13px", borderBottom: "1px solid rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "rgba(249,115,22,0.03)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                    {leftPanel === "design" ? <Palette size={12} color={O} /> : <Layers size={12} color={O} />}
                                    <span style={{ fontSize: 11, fontWeight: 700, color: "#fef3ec" }}>{leftPanel === "design" ? "Design Panel" : "Layers"}</span>
                                </div>
                                <button onClick={() => setLeftOpen(false)} style={{ width: 19, height: 19, borderRadius: 5, background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.14)", color: "rgba(249,115,22,0.5)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronLeft size={10} /></button>
                            </div>
                            {leftPanel === "design"
                                ? <DesignPanel theme={theme} update={update} activeTab={activeDesignTab} setActiveTab={(tab) => {
                                    setActiveDesignTab(tab);
                                    // Auto-switch canvas preview when clicking these tabs
                                    if (tab === "browser-tab") switchTab("browser-tab");
                                    else if (tab === "alerts") switchTab("announcement");
                                    else if (tab === "branding") switchTab("login");
                                    else if (tab === "layout") switchTab("sidebar");
                                }} />
                                : <LayersPanel selectedEl={selectedEl} setSelectedEl={setSelectedEl} />
                            }
                            {snapshots.length > 0 && leftPanel === "design" && (
                                <div style={{ padding: "10px 13px", borderTop: "1px solid rgba(249,115,22,0.1)", flexShrink: 0 }}>
                                    <div style={{ fontSize: 8, fontWeight: 700, color: "rgba(249,115,22,0.38)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>SNAPSHOTS</div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                        {snapshots.map((s, i) => (
                                            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 8px", borderRadius: 7, background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.1)" }}>
                                                <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(254,243,236,0.55)" }}>{s.name}</span>
                                                <button onClick={() => setTheme(s.t)} style={{ fontSize: 8, fontWeight: 700, color: O, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 5, padding: "2px 8px", cursor: "pointer" }}>Restore</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── 3D FLOATING PREVIEW CANVAS ── */}
                    <div
                        ref={canvasRef}
                        onClick={() => setSelectedEl(null)}
                        style={{
                            flex: 1, overflow: "auto",
                            background: "#0c0804",
                            backgroundImage: "radial-gradient(circle, rgba(249,115,22,0.2) 1px, transparent 1px)",
                            backgroundSize: "24px 24px",
                            display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "flex-start",
                            padding: "28px 24px 32px",
                            position: "relative",
                        }}
                    >
                        {/* Subtle ambient gradient overlay */}
                        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.09) 0%, transparent 60%)", pointerEvents: "none" }} />

                        {/* ── FLOATING TOP ICON SWITCHER (icon row like screenshot) ── */}
                        <div style={{ position: "relative", zIndex: 20, marginBottom: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                            {/* Icon pill row */}
                            <div style={{ display: "flex", alignItems: "center", gap: 2, background: "rgba(255,255,255,0.96)", border: "1px solid #dde4f0", borderRadius: 99, padding: "5px 10px", boxShadow: "0 2px 12px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)", backdropFilter: "blur(16px)" }}>
                                {[
                                    { id: "browser-tab", label: "Browser Tab", icon: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 9h20" /><circle cx="6" cy="6.5" r="0.8" fill="currentColor" /><circle cx="9" cy="6.5" r="0.8" fill="currentColor" /></svg> },
                                    { id: "login", label: "Login Page", icon: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="12" cy="10" r="3" /><path d="M7 20c0-3 2-5 5-5s5 2 5 5" /></svg> },
                                    { id: "dashboard", label: "Dashboard", icon: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
                                    { id: "announcement", label: "Alerts", icon: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l8-8 8 8" /><path d="M5 9v11h6v-5h2v5h6V9" /></svg> },
                                    { id: "sidebar", label: "Sidebar", icon: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2" /><path d="M9 2v20" /></svg> },
                                ].map(item => {
                                    const isActive = previewMode === item.id;
                                    return (
                                        <button key={item.id} onClick={e => { e.stopPropagation(); switchTab(item.id); }}
                                            title={item.label}
                                            style={{
                                                width: 32, height: 32, borderRadius: 99, border: "none", cursor: "pointer",
                                                background: isActive ? theme.primary : "transparent",
                                                color: isActive ? "#fff" : "#64748b",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                transition: "all .18s",
                                                boxShadow: isActive ? `0 2px 8px ${theme.primary}55` : "none",
                                            }}>
                                            <item.icon />
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Text label switcher below icons */}
                            <div style={{ display: "flex", alignItems: "center", gap: 2, background: "rgba(255,255,255,0.92)", border: "1px solid #dde4f0", borderRadius: 99, padding: "3px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
                                {["browser-tab", "login", "dashboard", "announcement", "sidebar"].map((id, i) => {
                                    const labels = ["Browser Tab", "Login Page", "Dashboard", "Alerts", "Sidebar"];
                                    const isActive = previewMode === id;
                                    return (
                                        <button key={id} onClick={e => { e.stopPropagation(); switchTab(id); }}
                                            style={{ padding: "5px 13px", borderRadius: 99, border: "none", cursor: "pointer", fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? "#fff" : "#64748b", background: isActive ? theme.primary : "transparent", transition: "all .18s", letterSpacing: ".01em", whiteSpace: "nowrap" }}>
                                            {labels[i]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── 3D TILTED CARD FRAME ── */}
                        <div style={{
                            position: "relative", zIndex: 10,
                            width: viewport === "mobile" ? "375px" : viewport === "tablet" ? "680px" : "min(860px, calc(100% - 0px))",
                            perspective: "1200px",
                            flexShrink: 0,
                        }}>
                            {/* Soft shadow blob behind card */}
                            <div style={{
                                position: "absolute", bottom: "-28px", left: "50%", transform: "translateX(-50%)",
                                width: "80%", height: 40,
                                background: "rgba(249,115,22,0.18)",
                                filter: "blur(36px)", borderRadius: "50%", zIndex: 0, pointerEvents: "none",
                            }} />

                            {/* ── CSS keyframes — flip only, no hover tilt ever ── */}
                            <style>{`
                @keyframes flip-out-left  {
                  0%   { opacity:1; transform:perspective(900px) rotateY(  0deg) scale(1);    }
                  100% { opacity:0; transform:perspective(900px) rotateY(-88deg) scale(0.86); }
                }
                @keyframes flip-out-right {
                  0%   { opacity:1; transform:perspective(900px) rotateY(  0deg) scale(1);    }
                  100% { opacity:0; transform:perspective(900px) rotateY( 88deg) scale(0.86); }
                }
                @keyframes flip-in-left {
                  0%   { opacity:0; transform:perspective(900px) rotateY( 88deg) scale(0.86); }
                  100% { opacity:1; transform:perspective(900px) rotateY(  0deg) scale(1);    }
                }
                @keyframes flip-in-right {
                  0%   { opacity:0; transform:perspective(900px) rotateY(-88deg) scale(0.86); }
                  100% { opacity:1; transform:perspective(900px) rotateY(  0deg) scale(1);    }
                }
                /* ALWAYS flat — no hover tilt, no transform on idle */
                .preview-card-flat {
                  transform: none !important;
                  transition: box-shadow 0.25s ease;
                }
                .preview-card-flat:hover {
                  transform: none !important;
                  box-shadow: 0 6px 10px rgba(0,0,0,0.06),
                              0 16px 40px rgba(0,0,0,0.12),
                              0 32px 64px rgba(0,0,0,0.08) !important;
                }
              `}</style>

                            {/* ── Preview card — always flat, flip animation on tab switch ── */}
                            <div
                                className={flipPhase === "idle" ? "preview-card-flat" : ""}
                                style={{
                                    width: "100%",
                                    height: viewport === "mobile" ? "580px" : viewport === "tablet" ? "480px" : "460px",
                                    borderRadius: 18,
                                    overflow: "hidden",
                                    border: "1px solid rgba(249,115,22,0.14)",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.06), 0 12px 32px rgba(0,0,0,0.10), 0 32px 64px rgba(0,0,0,0.07)",
                                    position: "relative", zIndex: 1,
                                    background: "#0c0805",
                                    transformOrigin: "center center",
                                    transform: "none",
                                    ...(flipPhase === "out" ? {
                                        animation: `${flipDir === 1 ? "flip-out-left" : "flip-out-right"} 0.18s cubic-bezier(0.55,0,1,0.45) forwards`,
                                    } : flipPhase === "in" ? {
                                        animation: `${flipDir === 1 ? "flip-in-left" : "flip-in-right"} 0.22s cubic-bezier(0,0.55,0.45,1) forwards`,
                                    } : {}),
                                }}
                            >
                                {/* Render the correct preview */}
                                {(visibleMode === "dashboard" || visibleMode === "sidebar" || visibleMode === "announcement") && (
                                    <DashboardPreview theme={theme} selectedEl={selectedEl} onSelect={setSelectedEl} previewContext={visibleMode} />
                                )}
                                {(visibleMode === "login" || visibleMode === "browser-tab") && (
                                    <LoginPreview theme={theme} showBrowserChrome={visibleMode === "browser-tab"} />
                                )}

                                {/* Click-to-edit hint */}
                                {!selectedEl && (visibleMode === "dashboard" || visibleMode === "sidebar") && (
                                    <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", padding: "5px 12px", borderRadius: 17, background: "rgba(255,255,255,0.94)", border: "1px solid #dde3ec", backdropFilter: "blur(10px)", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", fontSize: 8, fontWeight: 700, color: "#94a3b8", letterSpacing: ".09em", fontFamily: "'Space Mono',monospace", pointerEvents: "none", whiteSpace: "nowrap" }}>
                                        ✦ CLICK AN ELEMENT TO EDIT
                                    </div>
                                )}
                            </div>

                            {/* Viewport size label */}
                            <div style={{ textAlign: "center", marginTop: 14, fontSize: 9, fontFamily: "'Space Mono',monospace", fontWeight: 700, color: "#94a3b8", letterSpacing: ".08em", textTransform: "uppercase" }}>
                                {viewport === "mobile" ? "375 × 580 · Mobile" : viewport === "tablet" ? "768 × 480 · Tablet" : "Desktop Preview · Live"}
                            </div>
                        </div>
                    </div>

                    {/* PROPERTY PANEL */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                        {selectedEl && <PropPanel selectedEl={selectedEl} theme={theme} update={update} onClose={() => setSelectedEl(null)} />}
                    </div>
                </div>

                {/* STATUS BAR */}
                <div style={{ height: 27, background: "rgba(8,5,2,0.98)", borderTop: "1px solid rgba(249,115,22,0.09)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", flexShrink: 0 }}>
                    <div style={{ display: "flex", gap: 16, fontSize: 8, fontFamily: "'Space Mono',monospace", fontWeight: 700, color: "rgba(254,243,236,0.2)", letterSpacing: ".07em", textTransform: "uppercase" }}>
                        <span>R: {theme.radius}px</span>
                        <span>Gap: {theme.gap}px</span>
                        <span>SB: {theme.sidebarW}px</span>
                        <span>Font: {theme.fontSize}px</span>
                        <span style={{ color: "rgba(249,115,22,0.45)" }}>Layout: {theme.layout}</span>
                        <span style={{ color: "rgba(249,115,22,0.45)" }}>Mode: {previewMode}</span>
                        {changedIconCount > 0 && <span style={{ color: O }}>Icons: {changedIconCount} changed</span>}
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 8, fontFamily: "'Space Mono',monospace", color: "rgba(254,243,236,0.2)", letterSpacing: ".06em" }}>
                        {selectedEl && <span style={{ color: O, fontWeight: 700 }}>✦ {selectedEl.toUpperCase()} SELECTED</span>}
                        <span>H: {histIdx + 1}/{history.length}</span>
                        <span>Snaps: {snapshots.length}</span>
                        <div style={{ display: "flex", gap: 2 }}>
                            {[theme.primary, theme.secondary, theme.background, theme.surface, theme.border].map((c, i) => (
                                <div key={i} style={{ width: 11, height: 11, borderRadius: 2, background: c, border: "1px solid rgba(249,115,22,0.14)" }} title={c} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}