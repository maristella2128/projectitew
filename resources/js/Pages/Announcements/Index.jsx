import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm, router, usePage } from '@inertiajs/react';
import { 
    Bell, Megaphone, AlertTriangle, 
    BookOpen, Plus, Trash2, 
    User, Clock, Layers,
    Search, X, Save, ShieldAlert,
    Radio, Activity, ChevronRight,
    Zap, ChevronDown, CheckCircle2,
    Calendar, Pin, BarChart2, Check,
    Archive, Edit3, Send
} from 'lucide-react';
import Modal from '@/Components/Modal';

/* ─────────────────────────────────────
   STYLES (Enhanced Premium Command Center Theme)
───────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,900&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');

.an-root {
  background: radial-gradient(circle at 50% 0%, #1a0f08 0%, #0c0805 100%);
  min-height: 100%;
  flex: 1; display: flex; flex-direction: column;
  font-family: 'DM Sans', system-ui, sans-serif;
  color: #fef3ec;
  padding: 40px 32px 80px;
  position: relative;
  overflow: hidden;
}

/* Background Effects */
.an-grid {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    linear-gradient(rgba(249,115,22,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(249,115,22,0.03) 1px, transparent 1px);
  background-size: 64px 64px;
}
.an-scanline {
  position: fixed; top: 0; left: 0; width: 100%; height: 2px;
  background: linear-gradient(90deg, transparent, rgba(249,115,22,0.1), transparent);
  animation: scan 8s linear infinite;
  z-index: 1; pointer-events: none;
}
@keyframes scan {
  0% { transform: translateY(-100vh); }
  100% { transform: translateY(100vh); }
}

.an-orb {
  position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(80px);
}
.an-orb-1 { top: -10%; left: -5%; width: 600px; height: 600px; background: rgba(249,115,22,0.05); }
.an-orb-2 { bottom: -5%; right: -5%; width: 500px; height: 500px; background: rgba(239,68,68,0.04); }

.an-content { position: relative; z-index: 10; max-width: 1200px; margin: 0 auto; width: 100%; }

/* Typography Enhancements */
.an-header-group { margin-bottom: 32px; position: relative; }
.an-title {
  font-family: 'Playfair Display', serif;
  font-size: 52px; font-weight: 900; color: #fef3ec;
  line-height: 0.9; letter-spacing: -.04em;
}
.an-title em { color: #f97316; font-style: italic; display: block; filter: drop-shadow(0 0 15px rgba(249,115,22,0.3)); }
.an-sub { 
  font-family: 'Space Mono', monospace;
  font-size: 10px; color: rgba(254,243,236,0.3); 
  margin-top: 16px; text-transform: uppercase; letter-spacing: 0.3em;
  display: flex; align-items: center; gap: 12px;
}
.an-sub::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, rgba(254,243,236,0.1), transparent); }

/* Analytics Strip */
.an-analytics {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px;
}
.an-metric-card {
    background: rgba(22, 14, 8, 0.6); backdrop-filter: blur(10px);
    border: 1px solid rgba(254,243,236,0.05); border-radius: 20px;
    padding: 24px; position: relative; overflow: hidden;
    transition: all 0.3s;
}
.an-metric-card:hover {
    border-color: rgba(249,115,22,0.2);
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
.an-metric-value {
    font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 900; 
    color: #fef3ec; line-height: 1; margin-bottom: 8px;
}
.an-metric-label {
    font-family: 'Space Mono', monospace; font-size: 10px; color: rgba(254,243,236,0.4);
    text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;
}
.an-metric-trend {
    position: absolute; top: 24px; right: 24px; font-size: 11px; font-weight: 700;
    color: #34d399; background: rgba(52, 211, 153, 0.1); padding: 4px 8px; border-radius: 6px;
}

/* Tabs */
.an-tabs {
    display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid rgba(254,243,236,0.05);
    padding-bottom: 16px;
}
.an-tab {
    padding: 10px 20px; border-radius: 12px; font-size: 13px; font-weight: 700;
    color: rgba(254,243,236,0.4); transition: all 0.2s;
    display: flex; align-items: center; gap: 8px; cursor: pointer;
}
.an-tab:hover { background: rgba(254,243,236,0.05); color: rgba(254,243,236,0.8); }
.an-tab.active { background: rgba(249,115,22,0.1); color: #f97316; border: 1px solid rgba(249,115,22,0.2); }

/* Buttons */
.an-btn-broadcast {
  background: #f97316;
  color: #000; font-weight: 900; font-size: 11px; letter-spacing: 0.1em;
  padding: 16px 32px; border-radius: 12px;
  display: flex; align-items: center; gap: 10px;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 0 20px rgba(249,115,22,0.2);
}
.an-btn-broadcast:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(249,115,22,0.4);
  background: #ff8533;
}

/* Filters & Toolbars */
.an-toolbar {
  display: flex; gap: 12px; margin-bottom: 40px;
  background: rgba(22, 14, 8, 0.5); backdrop-filter: blur(10px);
  padding: 8px; border-radius: 18px; border: 1px solid rgba(254,243,236,0.05);
  align-items: center;
}
.an-search {
    flex: 1; position: relative;
}
.an-search input {
    width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(254,243,236,0.05);
    border-radius: 12px; padding: 16px 16px 16px 48px; color: #fef3ec; font-size: 14px;
    transition: all 0.3s;
}
.an-search input:focus { border-color: rgba(249,115,22,0.5); background: rgba(0,0,0,0.5); outline: none; }
.an-search svg { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: rgba(254,243,236,0.3); }

/* Custom Select Styling */
.an-custom-select { position: relative; width: 100%; }
.an-select-trigger {
  width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(254,243,236,0.05);
  border-radius: 12px; padding: 16px; display: flex; align-items: center; justify-content: space-between;
  cursor: pointer; transition: all 0.3s;
}
.an-select-trigger:hover { background: rgba(0,0,0,0.4); border-color: rgba(249,115,22,0.2); }
.an-select-trigger.active { border-color: #f97316; background: rgba(0,0,0,0.5); }

.an-select-options {
  position: absolute; top: calc(100% + 8px); left: 0; width: 100%; 
  background: #1c120a; border: 1px solid rgba(254,243,236,0.1);
  border-radius: 16px; overflow: hidden; z-index: 100;
  box-shadow: 0 20px 40px rgba(0,0,0,0.6);
  backdrop-filter: blur(20px);
  animation: slideIn 0.2s ease-out;
  max-height: 300px; overflow-y: auto;
}
@keyframes slideIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.an-option {
  padding: 14px 20px; font-size: 13px; font-weight: 500; color: rgba(254,243,236,0.6);
  cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; justify-content: space-between;
}
.an-option:hover { background: rgba(249,115,22,0.1); color: #f97316; }
.an-option.selected { background: rgba(249,115,22,0.2); color: #f97316; font-weight: 700; }

/* Cards */
.an-card {
  background: linear-gradient(165deg, rgba(28, 18, 10, 0.8) 0%, rgba(12, 8, 5, 0.9) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(254,243,236,0.05); border-radius: 28px;
  padding: 40px; margin-bottom: 24px;
  position: relative; overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.an-card.pinned {
    border-left: 4px solid #f97316;
    background: linear-gradient(165deg, rgba(38, 22, 10, 0.8) 0%, rgba(16, 10, 5, 0.9) 100%);
}
.an-card:hover {
  transform: translateX(8px);
  border-color: rgba(249,115,22,0.2);
  box-shadow: -20px 20px 60px rgba(0,0,0,0.5);
}

.an-card-type {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 14px; border-radius: 8px;
  font-family: 'Space Mono', monospace; font-size: 9px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.1em;
  margin-bottom: 24px;
}
.an-card-type.general { background: rgba(59,130,246,0.05); color: #60a5fa; border: 1px solid rgba(59,130,246,0.1); }
.an-card-type.academic { background: rgba(245,158,11,0.05); color: #fbbf24; border: 1px solid rgba(245,158,11,0.1); }
.an-card-type.urgent { background: rgba(239,68,68,0.1); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
.an-card-type.health { background: rgba(16,185,129,0.05); color: #34d399; border: 1px solid rgba(16,185,129,0.1); }

.an-card-subject {
  font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 900; 
  color: #fef3ec; margin-bottom: 16px; font-style: italic; line-height: 1.1;
  display: flex; align-items: center; gap: 12px;
}
.an-card-body {
  font-size: 16px; color: rgba(254,243,236,0.6); line-height: 1.7;
  margin-bottom: 32px; white-space: pre-wrap; font-weight: 400;
}

.an-card-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 24px; border-top: 1px solid rgba(254,243,236,0.05);
}
.an-card-meta { display: flex; gap: 24px; align-items: center; }
.an-meta-tag {
  display: flex; align-items: center; gap: 8px;
  font-family: 'Space Mono', monospace; font-size: 10px; color: rgba(254,243,236,0.3);
}
.an-meta-tag b { color: rgba(254,243,236,0.8); font-weight: 400; }

/* Read Rate Bar */
.an-read-rate {
    display: flex; align-items: center; gap: 12px; cursor: pointer; padding: 8px 12px; border-radius: 8px;
    background: rgba(254,243,236,0.03); border: 1px solid transparent; transition: all 0.2s;
}
.an-read-rate:hover { border-color: rgba(249,115,22,0.3); background: rgba(249,115,22,0.05); }
.an-read-bar-bg { width: 100px; height: 6px; background: rgba(254,243,236,0.1); border-radius: 3px; overflow: hidden; }
.an-read-bar-fill { height: 100%; background: #f97316; border-radius: 3px; transition: width 1s cubic-bezier(0.23, 1, 0.32, 1); }
.an-read-pct { font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700; color: #f97316; }

/* Modal Enhancements */
.an-modal-content {
  background: #110905; border: 1px solid rgba(254,243,236,0.1);
  border-radius: 32px; overflow: visible; box-shadow: 0 40px 100px rgba(0,0,0,0.8);
}
.an-field { margin-bottom: 24px; }
.an-label {
  display: block; font-family: 'Space Mono', monospace;
  font-size: 9px; font-weight: 700; color: rgba(249,115,22,0.6);
  text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 10px;
}
.an-input-wrapper {
  background: rgba(0,0,0,0.3); border: 1px solid rgba(254,243,236,0.05);
  border-radius: 12px; transition: all 0.3s;
}
.an-input-wrapper:focus-within { border-color: rgba(249,115,22,0.5); background: rgba(0,0,0,0.5); }
.an-input {
  width: 100%; background: transparent; border: none; outline: none;
  padding: 16px; color: #fef3ec; font-size: 14px;
}
.an-textarea { min-height: 160px; resize: none; }

/* Toggle Switch */
.an-toggle {
    position: relative; width: 44px; height: 24px; background: rgba(254,243,236,0.1);
    border-radius: 12px; cursor: pointer; transition: all 0.3s;
}
.an-toggle.active { background: #f97316; }
.an-toggle-knob {
    position: absolute; top: 2px; left: 2px; width: 20px; height: 20px;
    background: #fff; border-radius: 50%; transition: all 0.3s;
}
.an-toggle.active .an-toggle-knob { transform: translateX(20px); }

/* Pulse Animation */
@keyframes pulse-ring {
  0% { transform: scale(.7); opacity: 0; }
  50% { opacity: 0.5; }
  100% { transform: scale(1.5); opacity: 0; }
}
.urgent-indicator {
  width: 6px; height: 6px; background: #ef4444; border-radius: 50%;
  position: relative; margin-right: 8px;
}
.urgent-indicator::after {
  content: ''; position: absolute; inset: -4px; border: 2px solid #ef4444; border-radius: 50%;
  animation: pulse-ring 2s infinite;
}

/* Scrollbar for select */
.an-select-options::-webkit-scrollbar { width: 6px; }
.an-select-options::-webkit-scrollbar-track { background: transparent; }
.an-select-options::-webkit-scrollbar-thumb { background: rgba(254,243,236,0.1); border-radius: 3px; }
`;

/* ─────────────────────────────────────
   Local Custom Selection Component
───────────────────────────────────── */
const CustomSelect = ({ value, onChange, options, icon: Icon, placeholder = "Select option...", multiple = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = React.useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getLabel = () => {
        if (!value || (multiple && value.length === 0)) return placeholder;
        if (multiple) {
            return `${value.length} selected`;
        }
        const selectedOption = options.find(opt => opt.value == value);
        return selectedOption ? selectedOption.label : placeholder;
    };

    const handleSelect = (optValue) => {
        if (multiple) {
            const newValue = Array.isArray(value) ? [...value] : [];
            if (newValue.includes(optValue)) {
                onChange(newValue.filter(v => v !== optValue));
            } else {
                onChange([...newValue, optValue]);
            }
        } else {
            onChange(optValue);
            setIsOpen(false);
        }
    };

    const isSelected = (optValue) => {
        if (multiple) return Array.isArray(value) && value.includes(optValue);
        return value == optValue;
    };

    return (
        <div className="an-custom-select" ref={containerRef}>
            <div 
                className={`an-select-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    {Icon && <Icon size={14} className={(multiple ? value?.length > 0 : value) ? "text-orange-500" : "text-orange-500/30"} />}
                    <span className={`text-sm font-semibold ${(!value || (multiple && value.length === 0)) ? 'text-white/20' : 'text-fef3ec'}`}>
                        {getLabel()}
                    </span>
                </div>
                <ChevronDown size={14} className={`text-white/20 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && (
                <div className="an-select-options">
                    {options.map(opt => (
                        <div 
                            key={opt.value}
                            className={`an-option ${isSelected(opt.value) ? 'selected' : ''}`}
                            onClick={() => handleSelect(opt.value)}
                        >
                            <span>{opt.label}</span>
                            {isSelected(opt.value) && <Check size={14} className="text-orange-500" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function AnnouncementIndex({ announcements, sections, filters, auth, analytics }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState(null);
    const [receipts, setReceipts] = useState({ read: [], unread: [] });
    const [loadingReceipts, setLoadingReceipts] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    
    const submitStatusRef = React.useRef('published');

    const { data, setData, post, processing, errors, reset, transform } = useForm({
        title: '',
        content: '',
        type: 'general',
        section_id: '',
        target_audience: [], // Store section IDs for now
        scheduled_at: '',
        is_pinned: false,
        status: 'published',
        is_scheduled: false
    });

    transform((data) => ({
        ...data,
        status: submitStatusRef.current,
        scheduled_at: data.is_scheduled ? data.scheduled_at : null,
        target_audience: data.target_audience.length > 0 ? { sections: data.target_audience } : null,
        section_id: data.target_audience.length > 0 ? data.target_audience[0] : null,
    }));

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== filters.search) {
                handleFilter('search', searchQuery);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleFilter = (key, value) => {
        router.get(route('announcements.index'), { ...filters, [key]: value }, { preserveState: true, preserveScroll: true });
    };

    const handleTabChange = (tab) => {
        handleFilter('tab', tab);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('announcements.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            }
        });
    };

    const confirmDelete = () => {
        if (!announcementToDelete) return;
        router.delete(route('announcements.destroy', announcementToDelete.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setDeleteModalOpen(false);
                setAnnouncementToDelete(null);
            }
        });
    };

    const fetchReceipts = async (announcement) => {
        setSelectedAnnouncement(announcement);
        setIsReceiptModalOpen(true);
        setLoadingReceipts(true);
        try {
            const res = await fetch(route('announcements.receipts', announcement.id));
            const data = await res.json();
            setReceipts(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingReceipts(false);
        }
    };

    const markAsRead = async (announcement) => {
        if (!announcement.has_read) {
            try {
                await fetch(route('announcements.read', announcement.id), {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content,
                        'Content-Type': 'application/json'
                    }
                });
                router.reload({ preserveScroll: true, preserveState: true });
            } catch (e) {
                console.error(e);
            }
        }
    };

    const typeConfig = {
        general: { icon: Megaphone, label: 'General Broadcast' },
        academic: { icon: BookOpen, label: 'Academic Directive' },
        urgent: { icon: ShieldAlert, label: 'Critical Alert' },
        health: { icon: Activity, label: 'Health Advisory' },
    };

    const classificationOptions = [
        { value: 'general', label: 'General Broadcast' },
        { value: 'academic', label: 'Academic Directive' },
        { value: 'urgent', label: 'Critical Alert' },
        { value: 'health', label: 'Health Advisory' },
    ];

    const sectionOptions = sections.map(s => ({ value: s.id, label: `${s.name} (${s.grade_level})` }));

    const canManage = ['dean', 'teacher', 'admin'].includes(auth.user.role);
    const activeTab = filters.tab || 'live';

    return (
        <AppLayout title="Broadcast Center" noPadding>
            <style>{css}</style>
            <div className="an-root">
                <div className="an-grid" />
                <div className="an-scanline" />
                <div className="an-orb an-orb-1" />
                <div className="an-orb an-orb-2" />
                
                <div className="an-content">
                    {/* Header Section */}
                    <div className="flex justify-between items-end an-header-group">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-8 h-[1px] bg-orange-500/50" />
                                <span className="font-mono text-[10px] text-orange-500 tracking-[0.4em] uppercase">Control System</span>
                            </div>
                            <h1 className="an-title">
                                Academy
                                <em>Broadcast Center</em>
                            </h1>
                            <p className="an-sub">Institutional Communication & Signal Registry</p>
                        </div>
                        {canManage && (
                            <button onClick={() => setIsCreateModalOpen(true)} className="an-btn-broadcast">
                                <Zap size={14} fill="currentColor" /> CREATE COMMUNIQUÉ
                            </button>
                        )}
                    </div>

                    {/* Analytics Strip */}
                    {canManage && analytics && (
                        <div className="an-analytics">
                            <div className="an-metric-card">
                                <div className="an-metric-trend">↑ 12%</div>
                                <div className="an-metric-value">{analytics.totalSent}</div>
                                <div className="an-metric-label">Total Sent</div>
                            </div>
                            <div className="an-metric-card">
                                <div className="an-metric-value">{analytics.avgOpenRate}%</div>
                                <div className="an-metric-label">Avg Open Rate</div>
                            </div>
                            <div className="an-metric-card">
                                <div className="an-metric-value">{analytics.pendingReads}</div>
                                <div className="an-metric-label">Pending Reads</div>
                            </div>
                            <div className="an-metric-card">
                                <div className="an-metric-value">{analytics.activeRecipients}</div>
                                <div className="an-metric-label">Active Recipients</div>
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="an-tabs">
                        <div className={`an-tab ${activeTab === 'live' ? 'active' : ''}`} onClick={() => handleTabChange('live')}>
                            <Activity size={16} /> Live Feed
                        </div>
                        {canManage && (
                            <>
                                <div className={`an-tab ${activeTab === 'scheduled' ? 'active' : ''}`} onClick={() => handleTabChange('scheduled')}>
                                    <Clock size={16} /> Scheduled Queue
                                </div>
                                <div className={`an-tab ${activeTab === 'drafts' ? 'active' : ''}`} onClick={() => handleTabChange('drafts')}>
                                    <Edit3 size={16} /> Drafts
                                </div>
                                <div className={`an-tab ${activeTab === 'archive' ? 'active' : ''}`} onClick={() => handleTabChange('archive')}>
                                    <Archive size={16} /> Archive
                                </div>
                            </>
                        )}
                    </div>

                    {/* Toolbar Filters */}
                    <div className="an-toolbar">
                        <div className="an-search">
                            <Search size={18} />
                            <input 
                                type="text" 
                                placeholder="Search announcements..." 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="w-56">
                            <CustomSelect 
                                value={filters.type || ''}
                                onChange={val => handleFilter('type', val)}
                                options={[
                                    { value: '', label: 'All Signal Types' },
                                    ...classificationOptions
                                ]}
                                icon={Layers}
                                placeholder="Filter Type..."
                            />
                        </div>
                        <div className="w-56">
                            <CustomSelect 
                                value={filters.section_id || ''}
                                onChange={val => handleFilter('section_id', val)}
                                options={[
                                    { value: '', label: 'Global Frequency' },
                                    ...sectionOptions
                                ]}
                                icon={Radio}
                                placeholder="Target Channel..."
                            />
                        </div>
                    </div>

                    {/* Announcements List */}
                    <div className="an-list">
                        {announcements.data.length > 0 ? announcements.data.map((item, idx) => {
                            const Config = typeConfig[item.type];
                            const Icon = Config.icon;
                            const audienceLabel = item.target_audience?.sections?.length > 0 
                                ? `${item.target_audience.sections.length} Sections` 
                                : item.section ? item.section.name : 'Global';
                            
                            return (
                                <div 
                                    key={item.id} 
                                    className={`an-card group ${item.is_pinned ? 'pinned' : ''}`} 
                                    style={{ transitionDelay: `${idx * 50}ms` }}
                                    onClick={() => !canManage && markAsRead(item)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            {item.is_pinned && (
                                                <div className="flex items-center gap-1 font-mono text-[9px] font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-1 rounded">
                                                    <Pin size={10} /> Pinned
                                                </div>
                                            )}
                                            <div className={`an-card-type ${item.type}`}>
                                                {item.type === 'urgent' && <span className="urgent-indicator" />}
                                                <Icon size={12} />
                                                {Config.label}
                                            </div>
                                        </div>
                                        {canManage && (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setAnnouncementToDelete(item);
                                                    setDeleteModalOpen(true);
                                                }}
                                                className="p-2 bg-red-500/0 hover:bg-red-500/10 text-white/5 hover:text-red-500 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                    <h2 className="an-card-subject">
                                        {item.title}
                                        {item.has_read === false && !canManage && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>}
                                    </h2>
                                    <div className="an-card-body">{item.content}</div>
                                    
                                    <div className="an-card-footer">
                                        <div className="an-card-meta">
                                            <div className="an-meta-tag">
                                                <User size={12} className="text-orange-500/40" /> Author: <b>{item.author?.name}</b>
                                            </div>
                                            <div className="an-meta-tag">
                                                <Clock size={12} className="text-orange-500/40" /> 
                                                {item.scheduled_at && new Date(item.scheduled_at) > new Date() ? 'Scheduled:' : 'Sent:'} <b>{new Date(item.scheduled_at || item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</b>
                                            </div>
                                            <div className="an-meta-tag">
                                                <Radio size={12} className="text-orange-500" /> Channel: <b className="text-orange-500">{audienceLabel}</b>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            {canManage && activeTab !== 'drafts' && (
                                                <div className="an-read-rate" onClick={(e) => { e.stopPropagation(); fetchReceipts(item); }}>
                                                    <div className="an-read-bar-bg">
                                                        <div className="an-read-bar-fill" style={{ width: `${item.read_rate}%` }} />
                                                    </div>
                                                    <span className="an-read-pct">{item.read_rate}%</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="py-40 text-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.02]">
                                <div className="relative w-24 h-24 mx-auto mb-10">
                                    <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-2xl animate-pulse" />
                                    <Bell size={48} className="absolute inset-0 m-auto text-white/10" />
                                </div>
                                <h3 className="font-serif italic text-3xl text-white/20">Frequency Idle</h3>
                                <p className="text-sm text-white/10 mt-4 tracking-widest uppercase font-mono">No transmissions detected in this channel</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="2xl">
                <div className="an-modal-content">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-br from-orange-500/10 to-transparent">
                        <div>
                            <div className="an-label" style={{ color: '#f97316' }}>Signal Generation</div>
                            <h3 className="font-serif text-3xl font-black italic text-white mt-1">New Communiqué</h3>
                        </div>
                        <button onClick={() => setIsCreateModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl border border-white/5">
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">Priority Transmission</h4>
                                <p className="text-xs text-white/40 font-mono">Pin this signal to the top of the feed</p>
                            </div>
                            <div className={`an-toggle ${data.is_pinned ? 'active' : ''}`} onClick={() => setData('is_pinned', !data.is_pinned)}>
                                <div className="an-toggle-knob" />
                            </div>
                        </div>

                        <div className="an-field !mb-0">
                            <label className="an-label">Subject Line</label>
                            <div className="an-input-wrapper">
                                <input 
                                    className="an-input font-serif italic text-xl" 
                                    value={data.title} 
                                    onChange={e => setData('title', e.target.value)} 
                                    placeholder="Enter subject..." 
                                />
                            </div>
                            {errors.title && <p className="text-[10px] text-red-500 mt-2 font-bold uppercase tracking-wider">{errors.title}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="an-field !mb-0">
                                <label className="an-label">Classification</label>
                                <CustomSelect 
                                    value={data.type}
                                    onChange={val => setData('type', val)}
                                    options={classificationOptions}
                                    icon={Layers}
                                />
                                {errors.type && <p className="text-[10px] text-red-500 mt-2 font-bold uppercase tracking-wider">{errors.type}</p>}
                            </div>
                            <div className="an-field !mb-0">
                                <label className="an-label">Target Audience (Sections)</label>
                                <CustomSelect 
                                    value={data.target_audience}
                                    onChange={val => setData('target_audience', val)}
                                    options={sectionOptions}
                                    icon={Radio}
                                    placeholder="Global Frequency"
                                    multiple={true}
                                />
                                {errors.target_audience && <p className="text-[10px] text-red-500 mt-2 font-bold uppercase tracking-wider">{errors.target_audience}</p>}
                            </div>
                        </div>

                        <div className="an-field !mb-0">
                            <label className="an-label">Transmission Metadata (Body)</label>
                            <div className="an-input-wrapper">
                                <textarea 
                                    className="an-input an-textarea leading-relaxed" 
                                    value={data.content} 
                                    onChange={e => setData('content', e.target.value)}
                                    placeholder="Enter communiqué details..."
                                />
                            </div>
                            {errors.content && <p className="text-[10px] text-red-500 mt-2 font-bold uppercase tracking-wider">{errors.content}</p>}
                        </div>

                        <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-1">Schedule Transmission</h4>
                                    <p className="text-xs text-white/40 font-mono">Delay broadcast to a specific time</p>
                                </div>
                                <div className={`an-toggle ${data.is_scheduled ? 'active' : ''}`} onClick={() => setData('is_scheduled', !data.is_scheduled)}>
                                    <div className="an-toggle-knob" />
                                </div>
                            </div>
                            {data.is_scheduled && (
                                <div className="an-input-wrapper">
                                    <input 
                                        type="datetime-local"
                                        className="an-input text-sm" 
                                        value={data.scheduled_at} 
                                        onChange={e => setData('scheduled_at', e.target.value)} 
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="submit" onClick={() => { submitStatusRef.current = 'draft'; }} className="flex-1 py-4 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] bg-white/5 text-white/60 hover:bg-white/10 transition-all">
                                Save Draft
                            </button>
                            <button type="submit" disabled={processing} onClick={() => { submitStatusRef.current = 'published'; }} className="flex-[2] an-btn-broadcast justify-center">
                                <Send size={16} /> {data.is_scheduled ? 'SCHEDULE BROADCAST' : 'AUTHORIZE TRANSMISSION'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Read Receipts Modal */}
            <Modal show={isReceiptModalOpen} onClose={() => setIsReceiptModalOpen(false)} maxWidth="lg">
                <div className="an-modal-content">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="font-serif text-xl font-black italic text-white">Transmission Analytics</h3>
                        <button onClick={() => setIsReceiptModalOpen(false)} className="text-white/40 hover:text-white transition-all">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="p-6">
                        {loadingReceipts ? (
                            <div className="text-center py-10 text-white/40 font-mono text-sm animate-pulse">Scanning databanks...</div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-xs font-mono text-white/40 uppercase mb-3 px-2">
                                        <span>Confirmed Reads ({receipts.read.length})</span>
                                    </div>
                                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                        {receipts.read.map(student => (
                                            <div key={student.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                                                        <CheckCircle2 size={16} />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-white">{student.name}</div>
                                                        <div className="text-[10px] text-white/40 font-mono">{student.section?.name}</div>
                                                    </div>
                                                </div>
                                                <div className="text-[10px] text-white/40 font-mono">
                                                    {new Date(student.pivot?.read_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        ))}
                                        {receipts.read.length === 0 && <div className="text-center text-xs text-white/20 py-4 font-mono">No reads yet</div>}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs font-mono text-white/40 uppercase mb-3 px-2">
                                        <span>Pending Reads ({receipts.unread.length})</span>
                                    </div>
                                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                        {receipts.unread.map(student => (
                                            <div key={student.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 opacity-60">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center">
                                                        <Clock size={16} />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-white">{student.name}</div>
                                                        <div className="text-[10px] text-white/40 font-mono">{student.section?.name}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {receipts.unread.length === 0 && <div className="text-center text-xs text-white/20 py-4 font-mono">All recipients have read</div>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} maxWidth="md">
                <div className="an-modal-content">
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6 text-red-500">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="font-serif text-2xl font-black italic text-white mb-2">Decommission Signal?</h3>
                        <p className="text-sm text-white/60 mb-8 font-mono">
                            Are you sure you want to permanently erase this transmission from the databanks? This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setDeleteModalOpen(false)} className="flex-1 py-4 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] bg-white/5 text-white/60 hover:bg-white/10 transition-all">
                                Cancel
                            </button>
                            <button onClick={confirmDelete} className="flex-1 py-4 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] bg-red-500 hover:bg-red-600 text-white transition-all flex items-center justify-center gap-2">
                                <Trash2 size={14} /> Erase Signal
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}
