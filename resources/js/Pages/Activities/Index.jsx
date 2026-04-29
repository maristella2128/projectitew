import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm, router, Link, usePage } from '@inertiajs/react';
import {
    Plus, Trash2, Edit, Save, X, Search,
    Layers, User, CheckCircle, Activity,
    Globe, Compass, Users, Target, BookOpen,
    Filter, ArrowRight, ShieldCheck, Bookmark,
    Calendar, UserCheck, Users as UsersIcon
} from 'lucide-react';
import Modal from '@/Components/Modal';

/* ─────────────────────────────────────
   STYLES (Activity Catalog Premium Theme)
───────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,900&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');

.ac-root {
  background: #0c0805;
  min-height: 100%;
  flex: 1; display: flex; flex-direction: column;
  font-family: 'DM Sans', system-ui, sans-serif;
  color: #fef3ec;
  padding: 28px 32px 56px;
  position: relative;
}
.ac-grid {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    linear-gradient(rgba(249,115,22,0.022) 1px, transparent 1px),
    linear-gradient(90deg, rgba(249,115,22,0.022) 1px, transparent 1px);
  background-size: 48px 48px;
}
.ac-orb1 {
  position: fixed; top: -10%; left: -5%;
  width: 500px; height: 500px; border-radius: 50%;
  background: radial-gradient(circle, rgba(249,115,22,0.03) 0%, transparent 70%);
  pointer-events: none; z-index: 0;
}
.ac-content { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; width: 100%; }

.ac-title {
  font-family: 'Playfair Display', serif;
  font-size: 48px; font-weight: 900; color: #fef3ec;
  line-height: 1.1; text-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
.ac-title em { color: #f97316; font-style: italic; }
.ac-sub { font-size: 13px; font-weight: 800; color: rgba(254,243,236,0.3); text-transform: uppercase; letter-spacing: .25em; margin-top: 10px; display: flex; align-items: center; gap: 8px; }

.ac-filters {
  display: flex; gap: 16px; margin-bottom: 24px;
}
.ac-filter-box {
  flex: 1; background: #160e08; border: 1px solid #2a1508;
  border-radius: 14px; padding: 12px 16px;
  display: flex; align-items: center; gap: 10px;
}
.ac-select {
  flex: 1; background: transparent; border: none; outline: none;
  font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; color: #fef3ec;
}
.ac-select option { background: #1c1208; color: #fef3ec; }

.ac-grid-view { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }

.ac-card {
  background: #160e08; border: 1px solid #2a1508; border-radius: 24px;
  padding: 32px; transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative; display: flex; flex-direction: column;
}
.ac-card:hover { transform: translateY(-5px); border-color: rgba(249,115,22,0.3); box-shadow: 0 20px 60px rgba(0,0,0,0.6); }

.ac-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 12px; border-radius: 99px; font-size: 9px; font-weight: 900;
  text-transform: uppercase; letter-spacing: .12em; margin-bottom: 20px;
}

.ac-name { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 900; color: #fef3ec; font-style: italic; line-height: 1.1; margin-bottom: 8px; }
.ac-category { font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700; color: #f97316; margin-bottom: 16px; text-transform: uppercase; letter-spacing: .05em; }
.ac-desc { font-size: 13px; color: rgba(254,243,236,0.4); line-height: 1.6; margin-bottom: 24px; }

.ac-footer {
  margin-top: auto; padding-top: 24px; border-top: 1px solid #1f140c;
  display: flex; justify-content: space-between; align-items: center;
}

.ac-modal { background: #160e08; color: #fef3ec; border: 1px solid #2a1508; border-radius: 24px; overflow: hidden; }
.ac-input {
  width: 100%; background: #0c0805; border: 1px solid #2a1508;
  border-radius: 12px; padding: 12px 16px; color: #fef3ec; font-size: 13px;
  outline: none; transition: border-color 0.2s;
}
.ac-input:focus { border-color: #f97316; }
.ac-label { font-family: 'Space Mono', monospace; font-size: 9px; font-weight: 700; color: rgba(254,243,236,0.3); text-transform: uppercase; letter-spacing: .12em; margin-bottom: 6px; }

.slot-bar { margin-top: 12px; position: relative; background: rgba(255,255,255,0.05); height: 6px; border-radius: 3px; overflow: hidden; }
.slot-fill { height: 100%; transition: width 0.5s ease; }
.slot-label { font-size: 10px; font-family: 'Space Mono', monospace; color: rgba(254,243,236,0.3); margin-top: 4px; display: block; }

.full-badge {
    background: rgba(226,75,74,0.15); color: #E24B4A; padding: 4px 12px; border-radius: 99px; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: .12em;
}
`;

const STATUS_COLORS = {
    draft: { bg: 'rgba(136,135,128,0.15)', color: '#888780', label: 'Draft' },
    active: { bg: 'rgba(29,158,117,0.15)', color: '#1D9E75', label: 'Active' },
    inactive: { bg: 'rgba(226,75,74,0.15)', color: '#E24B4A', label: 'Inactive' },
    completed: { bg: 'rgba(127,119,221,0.15)', color: '#7F77DD', label: 'Completed' },
    archived: { bg: 'rgba(136,135,128,0.10)', color: '#5F5E5A', label: 'Archived' },
};

export default function ActivityIndex({ activities, professors, userRole, filters }) {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingActivity, setEditingActivity] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState(filters.search || '');

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '',
        type: 'Organization',
        category: 'Tech',
        description: '',
        points: 20,
        max_slots: '',
        status: 'draft',
        is_recurring: false,
        start_date: '',
        end_date: '',
        advisor_id: '',
    });

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                router.get(route('activities.index'), { ...filters, search: searchTerm }, { preserveState: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleFilter = (key, value) => {
        router.get(route('activities.index'), { ...filters, [key]: value }, { preserveState: true });
    };

    const openModal = (activity = null) => {
        if (activity) {
            setEditingActivity(activity);
            setData({
                name: activity.name,
                type: activity.type,
                category: activity.category,
                description: activity.description || '',
                points: activity.points,
                max_slots: activity.max_slots || '',
                status: activity.status,
                is_recurring: activity.is_recurring,
                start_date: activity.start_date || '',
                end_date: activity.end_date || '',
                advisor_id: activity.advisor_id || '',
            });
        } else {
            setEditingActivity(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        };

        if (editingActivity) {
            put(route('activities.update', editingActivity.id), options);
        } else {
            post(route('activities.store'), options);
        }
    };

    const renderAction = (activity) => {
        if (userRole === 'dean') {
            return (
                <div className="flex gap-2">
                    <button
                        onClick={() => openModal(activity)}
                        className="text-white/20 hover:text-orange-400 transition-colors p-2"
                        title="Edit Activity"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => {
                            if (confirm('Delete this activity from the catalog?')) {
                                router.delete(route('activities.destroy', activity.id));
                            }
                        }}
                        className="text-white/20 hover:text-red-500 transition-colors p-2"
                        title="Delete Activity"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            );
        }

        if (userRole === 'student' || userRole === 'students') {
            if (activity.is_enrolled) {
                return (
                    <button
                        onClick={() => router.patch(route('activities.withdraw', activity.id))}
                        className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
                    >
                        Withdraw
                    </button>
                );
            }
            if (activity.is_full) {
                return <span className="full-badge">Full</span>;
            }
            return (
                <button
                    onClick={() => router.post(route('activities.enroll', activity.id))}
                    className="px-6 py-2 rounded-xl bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                >
                    Join Activity
                </button>
            );
        }

        return null;
    };

    const flash = usePage().props.flash;

    return (
        <AppLayout title="Activity Catalog" noPadding>
            <style>{css}</style>

            {/* Flash Messages */}
            <div className="fixed top-6 right-6 z-[100] space-y-3 pointer-events-none">
                {flash.success && (
                    <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-right-10 flex items-center gap-3 pointer-events-auto border border-emerald-400/20">
                        <CheckCircle size={18} />
                        <span className="text-[13px] font-bold">{flash.success}</span>
                    </div>
                )}
                {flash.error && (
                    <div className="bg-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-right-10 flex items-center gap-3 pointer-events-auto border border-red-400/20">
                        <X size={18} />
                        <span className="text-[13px] font-bold">{flash.error}</span>
                    </div>
                )}
            </div>

            <div className="ac-root">
                <div className="ac-grid" />
                <div className="ac-orb1" />

                <div className="ac-content">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h1 className="ac-title">
                                Activity <em>Catalog</em>
                            </h1>
                            <p className="ac-sub">
                                <span className="w-8 h-px bg-orange-500/50"></span>
                                CCS ProFile · Engagement & Leadership Tracking System
                            </p>
                        </div>
                        {userRole === 'dean' && (
                            <button onClick={() => openModal()} className="px-6 py-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 text-white text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-orange-500/20">
                                <Plus size={14} /> Register Activity
                            </button>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="ac-filters">
                        <div className="ac-filter-box">
                            <Layers size={16} className="text-orange-500" />
                            <select
                                className="ac-select"
                                value={filters.category || ''}
                                onChange={e => handleFilter('category', e.target.value)}
                            >
                                <option value="">All Categories</option>
                                <option value="Tech">Tech</option>
                                <option value="Leadership">Leadership</option>
                                <option value="Academic">Academic</option>
                                <option value="Sports">Sports</option>
                                <option value="Arts">Arts</option>
                                <option value="Community">Community</option>
                            </select>
                        </div>
                        <div className="ac-filter-box">
                            <Search size={16} className="text-orange-500" />
                            <input
                                className="ac-select"
                                placeholder="Search by name or description..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Activity Grid */}
                    <div className="ac-grid-view">
                        {activities.data.length > 0 ? activities.data.map((activity) => {
                            const status = STATUS_COLORS[activity.status] || STATUS_COLORS.draft;
                            return (
                                <div key={activity.id} className="ac-card">
                                    <div className="flex justify-between items-start">
                                        <div className="ac-badge" style={{ background: status.bg, color: status.color, border: `1px solid ${status.color}20` }}>
                                            {status.label}
                                        </div>
                                        <div className="text-[10px] font-mono text-orange-500 font-bold bg-orange-500/10 px-2 py-1 rounded-md">
                                            +{activity.points} PT
                                        </div>
                                    </div>

                                    <Link href={route('activities.show', activity.id)} className="block group">
                                        <h3 className="ac-name group-hover:text-orange-500 transition-colors">{activity.name}</h3>
                                    </Link>
                                    <div className="ac-category">{activity.category} · {activity.type}</div>

                                    <p className="ac-desc">
                                        {activity.description || 'No description provided for this activity.'}
                                    </p>

                                    {activity.max_slots && (
                                        <div className="mb-6">
                                            <div className="slot-bar">
                                                <div
                                                    className="slot-fill"
                                                    style={{
                                                        width: `${Math.min((activity.enrollments_count / activity.max_slots) * 100, 100)}%`,
                                                        background: activity.is_full ? '#E24B4A' : '#1D9E75',
                                                    }}
                                                />
                                            </div>
                                            <span className="slot-label">
                                                {activity.enrollments_count} / {activity.max_slots} slots filled
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 mb-6">
                                        {activity.advisor && (
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                                                <User size={12} className="text-orange-500" />
                                                <span className="text-[10px] font-medium text-white/60">Advisor: {activity.advisor.name}</span>
                                            </div>
                                        )}
                                        {activity.start_date && (
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                                                <Calendar size={12} className="text-orange-500" />
                                                <span className="text-[10px] font-medium text-white/60">{new Date(activity.start_date).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="ac-footer">
                                        {renderAction(activity)}
                                        {userRole === 'dean' && (
                                            <div className="text-right">
                                                <div className="ac-label">Created By</div>
                                                <div className="text-[10px] font-mono text-white/40">ADMINISTRATOR</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="col-span-2 py-32 text-center border-2 border-dashed border-white/5 rounded-[32px] bg-white/[0.01] flex flex-col items-center justify-center">
                                <Compass size={48} className="text-white/5 mb-6" />
                                <h3 className="font-serif text-2xl italic font-bold text-white/20 mb-2">Catalog Empty</h3>
                                <p className="text-sm text-white/10 max-w-xs">No activities match your current selection.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <div className="ac-modal">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-orange-500/10 to-transparent">
                        <div>
                            <div className="ac-label" style={{ color: '#f97316' }}>Activity Management</div>
                            <h3 className="font-serif text-2xl font-black italic text-white leading-tight">
                                {editingActivity ? 'Update Catalog Entry' : 'Register New Activity'}
                            </h3>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="text-white/20 hover:text-white p-2"><X size={20} /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="ac-label">Activity Name</label>
                                <input className="ac-input" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g. Google Developer Student Club" required />
                                {errors.name && <div className="text-red-500 text-[10px] mt-1">{errors.name}</div>}
                            </div>

                            <div>
                                <label className="ac-label">Activity Type</label>
                                <select className="ac-input" value={data.type} onChange={e => setData('type', e.target.value)} required>
                                    <option value="Organization">Organization</option>
                                    <option value="Competition">Competition</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Academic">Academic</option>
                                    <option value="Event">Event</option>
                                </select>
                            </div>

                            <div>
                                <label className="ac-label">Pathway Category</label>
                                <select className="ac-input" value={data.category} onChange={e => setData('category', e.target.value)} required>
                                    <option value="Tech">Tech</option>
                                    <option value="Leadership">Leadership</option>
                                    <option value="Academic">Academic</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Arts">Arts</option>
                                    <option value="Community">Community</option>
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="ac-label">Description / Mission</label>
                                <textarea
                                    className="ac-input h-24 resize-none font-sans"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder="Brief summary of the organization's goals or the event's purpose..."
                                />
                            </div>

                            <div>
                                <label className="ac-label">Engagement Points</label>
                                <input type="number" min="1" max="100" className="ac-input" value={data.points} onChange={e => setData('points', e.target.value)} required />
                            </div>

                            <div>
                                <label className="ac-label">Max Slots (Optional)</label>
                                <input type="number" min="1" className="ac-input" value={data.max_slots} onChange={e => setData('max_slots', e.target.value)} placeholder="Unlimited" />
                            </div>

                            <div>
                                <label className="ac-label">Current Status</label>
                                <select className="ac-input" value={data.status} onChange={e => setData('status', e.target.value)} required>
                                    <option value="draft">Draft (Private)</option>
                                    <option value="active">Active (Visible)</option>
                                    <option value="inactive">Inactive</option>
                                    {editingActivity && <option value="completed">Completed</option>}
                                    {editingActivity && <option value="archived">Archived</option>}
                                </select>
                            </div>

                            <div>
                                <label className="ac-label">Assigned Advisor</label>
                                <select className="ac-input" value={data.advisor_id} onChange={e => setData('advisor_id', e.target.value)}>
                                    <option value="">No advisor assigned</option>
                                    {professors.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="ac-label">Start Date</label>
                                <input type="date" className="ac-input" value={data.start_date} onChange={e => setData('start_date', e.target.value)} />
                            </div>

                            <div>
                                <label className="ac-label">End Date</label>
                                <input type="date" className="ac-input" value={data.end_date} onChange={e => setData('end_date', e.target.value)} />
                            </div>

                            <div className="col-span-2 flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                                <input
                                    type="checkbox"
                                    id="is_recurring"
                                    className="w-4 h-4 rounded border-white/10 bg-black text-orange-500 focus:ring-orange-500"
                                    checked={data.is_recurring}
                                    onChange={e => setData('is_recurring', e.target.checked)}
                                />
                                <label htmlFor="is_recurring" className="text-[11px] font-bold text-white/60 cursor-pointer uppercase tracking-wider">
                                    Recurring activity (Organization / Club)
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-white/5">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white/5 text-white/30 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-colors">Cancel</button>
                            <button type="submit" disabled={processing} className="flex-[2] bg-gradient-to-br from-orange-500 to-orange-700 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                                <Save size={16} /> {editingActivity ? 'Update Catalog Entry' : 'Save to Catalog'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AppLayout>
    );
}
