import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm, router, Link } from '@inertiajs/react';
import { 
    Plus, Trash2, Edit, Save, X, Search, 
    Layers, User, CheckCircle, Activity,
    Globe, Compass, Users, Target, BookOpen,
    Filter, ArrowRight, ShieldCheck, Bookmark
} from 'lucide-react';
import Modal from '@/Components/Modal';

/* ─────────────────────────────────────
   STYLES (Dashboard Premium Theme)
───────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,900&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');

.ex-root {
  background: #0c0805;
  min-height: 100%;
  flex: 1; display: flex; flex-direction: column;
  font-family: 'DM Sans', system-ui, sans-serif;
  color: #fef3ec;
  padding: 28px 32px 56px;
  position: relative;
}
.ex-grid {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    linear-gradient(rgba(249,115,22,0.022) 1px, transparent 1px),
    linear-gradient(90deg, rgba(249,115,22,0.022) 1px, transparent 1px);
  background-size: 48px 48px;
}
.ex-orb1 {
  position: fixed; top: -10%; left: -5%;
  width: 500px; height: 500px; border-radius: 50%;
  background: radial-gradient(circle, rgba(249,115,22,0.03) 0%, transparent 70%);
  pointer-events: none; z-index: 0;
}
.ex-content { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; width: 100%; }

.ex-title {
  font-family: 'Playfair Display', serif;
  font-size: 48px; font-weight: 900; color: #fef3ec;
  line-height: 1.1; text-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
.ex-title em { color: #f97316; font-style: italic; }
.ex-sub { font-size: 13px; font-weight: 800; color: rgba(254,243,236,0.3); text-transform: uppercase; letter-spacing: .25em; margin-top: 10px; display: flex; align-items: center; gap: 8px; }

.ex-filters {
  display: flex; gap: 16px; margin-bottom: 24px;
}
.ex-filter-box {
  flex: 1; background: #160e08; border: 1px solid #2a1508;
  border-radius: 14px; padding: 12px 16px;
  display: flex; align-items: center; gap: 10px;
}
.ex-select {
  flex: 1; background: transparent; border: none; outline: none;
  font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; color: #fef3ec;
}
.ex-select option { background: #1c1208; color: #fef3ec; }

.ex-grid-view { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }

.ex-card {
  background: #160e08; border: 1px solid #2a1508; border-radius: 24px;
  padding: 32px; transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative; display: flex; flex-direction: column;
}
.ex-card:hover { transform: translateY(-5px); border-color: rgba(249,115,22,0.3); box-shadow: 0 20px 60px rgba(0,0,0,0.6); }

.ex-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 12px; border-radius: 99px; font-size: 9px; font-weight: 900;
  text-transform: uppercase; letter-spacing: .12em; margin-bottom: 20px;
  background: rgba(249,115,22,0.08); border: 1px solid rgba(249,115,22,0.15); color: #f97316;
}

.ex-name { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 900; color: #fef3ec; font-style: italic; line-height: 1.1; margin-bottom: 8px; }
.ex-role { font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700; color: #f97316; margin-bottom: 16px; text-transform: uppercase; letter-spacing: .05em; }
.ex-desc { font-size: 13px; color: rgba(254,243,236,0.4); line-height: 1.6; margin-bottom: 24px; }

.ex-footer {
  margin-top: auto; padding-top: 24px; border-top: 1px solid #1f140c;
  display: flex; justify-content: space-between; align-items: center;
}

.ex-tag {
  display: flex; align-items: center; gap: 8px; text-decoration: none;
}
.ex-initials {
  width: 32px; height: 32px; border-radius: 10px;
  background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.2);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700; color: #f97316;
}

.ex-modal { background: #160e08; color: #fef3ec; border: 1px solid #2a1508; border-radius: 24px; }
.ex-input {
  width: 100%; background: #0c0805; border: 1px solid #2a1508;
  border-radius: 12px; padding: 12px 16px; color: #fef3ec; font-size: 13px;
}
.ex-label { font-family: 'Space Mono', monospace; font-size: 9px; font-weight: 700; color: rgba(254,243,236,0.3); text-transform: uppercase; letter-spacing: .12em; margin-bottom: 6px; }
`;

export default function ExtracurricularIndex({ activities = { data: [] }, categories = [], filters = {} }) {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState(null);

    const { data, setData, post, put, processing, reset } = useForm({
        name: '',
        activity_category_id: '',
        activity_type: 'Organization',
        base_points: 10,
        description: '',
        recommended_for_courses: [],
        recommended_for_skills: [],
        is_active: true,
    });

    const [searchTerm, setSearchTerm] = React.useState(filters.search || '');

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                router.get(route('extracurriculars.index'), { ...filters, search: searchTerm }, { preserveState: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleFilter = (key, value) => {
        router.get(route('extracurriculars.index'), { ...filters, [key]: value }, { preserveState: true });
    };

    const openModal = (activity = null) => {
        if (activity) {
            setEditingId(activity.id);
            setData({
                name: activity.name,
                activity_category_id: activity.activity_category_id,
                activity_type: activity.activity_type,
                base_points: activity.base_points,
                description: activity.description || '',
                recommended_for_courses: activity.recommended_for_courses || [],
                recommended_for_skills: activity.recommended_for_skills || [],
                is_active: activity.is_active,
            });
        } else {
            setEditingId(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route('extracurriculars.update', editingId), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        } else {
            post(route('extracurriculars.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

    return (
        <AppLayout title="Extracurricular Catalog" noPadding>
            <style>{css}</style>
            <div className="ex-root">
                <div className="ex-grid" />
                <div className="ex-orb1" />
                
                <div className="ex-content">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h1 className="ex-title">
                                Activity <em>Catalog</em>
                            </h1>
                            <p className="ex-sub">
                                <span className="w-8 h-px bg-orange-500/50"></span>
                                College of Computing Studies · Official Registry of Approved Organizations & Events
                            </p>
                        </div>
                        <button onClick={() => openModal()} className="gr-btn-primary" style={{ background: 'linear-gradient(135deg, #f97316, #9a3412)', boxShadow: '0 4px 18px rgba(249,115,22,0.3)' }}>
                            <Plus size={14} /> Register Activity
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="ex-filters">
                        <div className="ex-filter-box">
                            <Layers size={16} className="text-orange-500" />
                            <select 
                                className="ex-select"
                                value={filters.category || ''}
                                onChange={e => handleFilter('category', e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="ex-filter-box">
                            <Search size={16} className="text-orange-500" />
                            <input
                                className="ex-select"
                                placeholder="Search catalog..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Involvement Grid */}
                    <div className="ex-grid-view">
                        {activities.data.length > 0 ? activities.data.map((activity) => (
                            <div key={activity.id} className="ex-card">
                                <div className="flex justify-between items-start">
                                    <div className="ex-badge">
                                        {activity.activity_type}
                                    </div>
                                    <div className="text-[10px] font-mono text-orange-500 font-bold bg-orange-500/10 px-2 py-1 rounded-md">
                                        +{activity.base_points} PT
                                    </div>
                                </div>
                                <h3 className="ex-name">{activity.name}</h3>
                                <div className="ex-role">{categories.find(c => c.id === activity.activity_category_id)?.name || 'Uncategorized'}</div>
                                <p className="ex-desc">
                                    {activity.description || 'No description provided for this activity.'}
                                </p>
                                <div className="ex-footer">
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => openModal(activity)}
                                            className="text-white/20 hover:text-orange-400 transition-colors p-2"
                                            title="Edit Activity"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button 
                                            onClick={() => router.delete(route('extracurriculars.destroy', activity.id), {
                                                onBefore: () => confirm('Delete this activity from the catalog?'),
                                                preserveScroll: true
                                            })}
                                            className="text-white/20 hover:text-red-500 transition-colors p-2"
                                            title="Delete Activity"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <div className="ex-label">Status</div>
                                        <div className={`text-[10px] font-mono font-bold ${activity.is_active ? 'text-orange-400' : 'text-red-400'}`}>
                                            {activity.is_active ? 'ACTIVE' : 'INACTIVE'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-2 si-card p-32 text-center border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center">
                                <Compass size={48} className="text-white/5 mb-6" />
                                <h3 className="font-serif text-2xl italic font-bold text-white/20 mb-2">Catalog Empty</h3>
                                <p className="text-sm text-white/10 max-w-xs">No organizational activities match your current filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="xl">
                <div className="ex-modal">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-orange-500/10 to-transparent">
                        <div>
                            <div className="ex-label" style={{ color: '#f97316' }}>Institutional Catalog</div>
                            <h3 className="font-serif text-2xl font-black italic text-white leading-tight">
                                {editingId ? 'Update Activity' : 'Register Activity'}
                            </h3>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="text-white/20 hover:text-white"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="ex-label">Activity Name</label>
                                <input className="ex-input" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g. IT Society, Hackathon 2026" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="ex-label">Category Pathway</label>
                                    <select className="ex-input" value={data.activity_category_id} onChange={e => setData('activity_category_id', e.target.value)} required>
                                        <option value="">Select Category...</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="ex-label">Classification Type</label>
                                    <select className="ex-input" value={data.activity_type} onChange={e => setData('activity_type', e.target.value)} required>
                                        <option value="Organization">Organization</option>
                                        <option value="Club">Club</option>
                                        <option value="Event">Event</option>
                                        <option value="Competition">Competition</option>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Seminar">Seminar</option>
                                        <option value="Sport">Sport</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="ex-label">Base Engagement Points</label>
                                    <input type="number" min="1" max="100" className="ex-input" value={data.base_points} onChange={e => setData('base_points', parseInt(e.target.value))} required />
                                </div>
                                <div>
                                    <label className="ex-label">Status</label>
                                    <select className="ex-input" value={data.is_active ? '1' : '0'} onChange={e => setData('is_active', e.target.value === '1')}>
                                        <option value="1">Active</option>
                                        <option value="0">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="ex-label">Activity Description</label>
                                <textarea 
                                    className="ex-input h-24 resize-none font-sans" 
                                    value={data.description} 
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder="Brief summary of the organization or event..."
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white/5 text-white/30 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-colors">Cancel</button>
                            <button type="submit" disabled={processing} className="flex-[2] at-btn-save justify-center" style={{ background: 'linear-gradient(135deg, #f97316, #9a3412)' }}>
                                <Save size={16} /> {editingId ? 'Update Activity' : 'Save to Catalog'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AppLayout>
    );
}
