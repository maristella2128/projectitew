import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm, router, Link } from '@/inertia-adapter'; // Ensure using the custom adapter
import { 
    Award, Star, Trophy, Palette, 
    Plus, Trash2, User, Calendar, 
    Medal, Sparkles, Search, Filter,
    Layers, ShieldCheck, X, Save, Edit,
    ArrowRight, Bookmark, Download, FileText, LayoutGrid, List, Users,
    Globe, Terminal, Lightbulb, Music, GraduationCap, ChevronRight, AlertCircle, Upload
} from 'lucide-react';
import Modal from '@/Components/Modal';

/* ─────────────────────────────────────
   STYLES (Three-Channel Achievement System)
───────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,900&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');

.ac-root {
  background: #0d0b04; min-height: 100%; flex: 1; display: flex; flex-direction: column;
  font-family: 'DM Sans', sans-serif; color: #fef3ec; padding: 28px 32px 56px;
}
.ac-content { max-width: 1400px; margin: 0 auto; width: 100%; }

.ac-title { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 900; color: #fef3ec; line-height: 1.1; }
.ac-title em { color: #e87c1e; font-style: italic; }

/* Stats Strip */
.ac-stats-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
.ac-stat-card { background: rgba(22, 17, 10, 0.6); border: 1px solid rgba(255,255,255,0.03); border-radius: 20px; padding: 24px; position: relative; overflow: hidden; backdrop-filter: blur(10px); }
.ac-stat-val { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 900; line-height: 1; margin-bottom: 6px; }
.ac-stat-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.3); }
.ac-stat-note { font-size: 9px; color: rgba(255,255,255,0.15); margin-top: 8px; font-style: italic; }

.text-gold { color: #c89030; }
.text-teal { color: #30a8c0; }
.text-purple { color: #9070d0; }

/* Channel Navigation */
.ac-nav { display: flex; gap: 40px; border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 32px; padding-bottom: 2px; }
.ac-nav-item { display: flex; align-items: center; gap: 10px; padding: 12px 4px; cursor: pointer; transition: all 0.3s; position: relative; opacity: 0.4; filter: grayscale(1); }
.ac-nav-item.active { opacity: 1; filter: grayscale(0); }
.ac-nav-dot { width: 8px; height: 8px; border-radius: 50%; }
.ac-nav-label { font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; }
.ac-nav-indicator { position: absolute; bottom: -2px; left: 0; right: 0; height: 2px; transform: scaleX(0); transition: transform 0.3s; border-radius: 2px; }
.ac-nav-item.active .ac-nav-indicator { transform: scaleX(1); }

/* Filters & Pills */
.ac-pills-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; gap: 20px; }
.ac-pills { display: flex; gap: 8px; flex-wrap: wrap; }
.ac-pill { padding: 8px 16px; border-radius: 100px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }

/* Grid & Cards */
.ac-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 24px; }
.ac-card { background: #16110a; border: 1px solid rgba(255,255,255,0.04); border-radius: 24px; padding: 28px; position: relative; overflow: hidden; transition: all 0.3s; border-top-width: 4px; display: flex; flex-direction: column; }
.ac-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.5); }

.ac-avatar { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 14px; color: #fff; background: rgba(255,255,255,0.05); }
.ac-honor-title { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 900; line-height: 1.1; margin-bottom: 8px; font-style: italic; }
.ac-desc { font-size: 12.5px; color: rgba(255,255,255,0.4); line-height: 1.6; margin-bottom: 24px; flex: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* Group Specific */
.ac-group-list { display: flex; flex-direction: column; gap: 16px; }
.ac-group-card { background: #16110a; border: 1px solid rgba(255,255,255,0.04); border-left: 4px solid #9070d0; border-radius: 20px; padding: 24px 32px; display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: center; transition: all 0.2s; }
.ac-group-card:hover { background: rgba(255,255,255,0.02); }

.ac-member-chip { display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 100px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.6); }
.ac-member-initials { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 900; color: #fff; }

/* Modal */
.ac-modal-root { background: #110d08; color: #fff; border: 1px solid rgba(255,255,255,0.1); border-radius: 28px; overflow: hidden; }
.ac-type-btn { flex: 1; padding: 24px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02); cursor: pointer; transition: all 0.3s; text-align: center; }
.ac-type-btn:hover { background: rgba(255,255,255,0.05); transform: translateY(-2px); }
.ac-type-btn.active-gold { border-color: #c89030; background: rgba(200,144,48,0.05); }
.ac-type-btn.active-teal { border-color: #30a8c0; background: rgba(48,168,192,0.05); }
.ac-type-btn.active-purple { border-color: #9070d0; background: rgba(144,112,208,0.05); }

.ac-input { width: 100%; background: #000; border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 14px 18px; color: #fff; font-size: 13px; outline: none; }
.ac-input:focus { border-color: #e87c1e; }

.ac-card-badge { position: absolute; top: 24px; right: 24px; padding: 4px 10px; border-radius: 8px; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; }
`;

export default function AchievementIndex({ academic, nonAcademic, group, stats, sections, students, filters, auth }) {
    const [channel, setChannel] = useState('academic'); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activePill, setActivePill] = useState('all');
    const [entryStep, setEntryStep] = useState(1); 
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedAward, setSelectedAward] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        channel: 'academic',
        student_id: '',
        team_name: '',
        group_members: [],
        title: '',
        description: '',
        category: 'academic',
        tier: 'bronze',
        date_awarded: new Date().toISOString().split('T')[0],
        countersign: false,
        certificate_file: null
    });

    const channelConfig = {
        academic: {
            color: '#c89030',
            label: 'Academic Achievers',
            pills: ['all', 'Dean\'s List', 'Best Thesis', 'Best in Research', 'Academic Excellence'],
            db_channel: 'academic'
        },
        non_academic: {
            color: '#30a8c0',
            label: 'Non-Academic Achievers',
            pills: ['all', 'Leadership', 'Athletic Mastery', 'Cultural Arts', 'Community Service', 'Innovation'],
            db_channel: 'non_academic'
        },
        group: {
            color: '#9070d0',
            label: 'Group Achievements',
            pills: ['all', 'Competition Team', 'Research Group', 'Organization', 'Event Committee'],
            db_channel: 'group'
        }
    };

    const handleEdit = (award) => {
        setSelectedAward(award);
        setIsEditMode(true);
        setData({
            channel: award.channel || 'academic',
            student_id: award.student_id || '',
            team_name: award.team_name || '',
            group_members: award.group_members || [],
            title: award.title || '',
            description: award.description || '',
            category: award.category || '',
            tier: award.tier || 'bronze',
            date_awarded: award.date_awarded ? award.date_awarded.split('T')[0] : new Date().toISOString().split('T')[0],
            countersign: true,
            certificate_file: null
        });
        setEntryStep(2); 
        setIsModalOpen(true);
    };

    const handleDelete = (award) => {
        setDeleteTarget(award);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        destroy(route('achievements.destroy', deleteTarget.id), {
            onSuccess: () => setDeleteTarget(null),
            preserveScroll: true
        });
    };

    const submit = (e) => {
        e.preventDefault();
        if (!data.countersign) {
            alert('Countersignature required for administrative validation.');
            return;
        }

        const options = {
            onSuccess: () => {
                setIsModalOpen(false);
                setIsEditMode(false);
                setSelectedAward(null);
                setEntryStep(1);
                reset();
            },
            preserveScroll: true
        };

        if (isEditMode && selectedAward) {
            patch(route('achievements.update', selectedAward.id), options);
        } else {
            post(route('achievements.store'), options);
        }
    };

    const openCreateModal = () => {
        setIsEditMode(false);
        setSelectedAward(null);
        setEntryStep(1);
        reset();
        setIsModalOpen(true);
    };

    const getPillStyle = (pill, active, color) => {
        if (active) return { background: `${color}15`, color: color, borderColor: `${color}30` };
        return { background: '#16110a', color: 'rgba(255,255,255,0.3)', borderColor: 'rgba(255,255,255,0.05)' };
    };

    const getAvatarColor = (name) => {
        const colors = ['#e87c1e', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#c89030', '#30a8c0', '#9070d0'];
        const charCode = name?.charCodeAt(0) || 0;
        return colors[charCode % colors.length];
    };

    const handleChannelSwitch = (newChannel) => {
        setChannel(newChannel);
        setActivePill('all');
    };

    const isAdmin = auth.user.role === 'dean' || auth.user.role === 'teacher';

    const currentList = useMemo(() => {
        let list = [];
        if (channel === 'academic') list = academic;
        else if (channel === 'non_academic') list = nonAcademic;
        else list = group;

        if (activePill !== 'all') {
            return list.filter(a => a.category === activePill || a.title.includes(activePill));
        }
        return list;
    }, [channel, academic, nonAcademic, group, activePill]);

    return (
        <AppLayout title="Hall of Honors" noPadding>
            <style>{css}</style>
            <div className="ac-root">
                <div className="ac-content">
                    {/* Header */}
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h1 className="ac-title">Hall of <em>Honors</em></h1>
                            <p className="text-[11px] font-bold text-white/20 uppercase tracking-[0.2em] mt-3">
                                CCS ProFile · Administrative Recognition Registry
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/50 text-[10px] font-black uppercase tracking-widest transition-all">
                                <Download size={14} /> Export Records
                            </button>
                            {isAdmin && (
                                <button onClick={openCreateModal} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#e87c1e] hover:bg-[#d06d19] text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-950/20">
                                    <Plus size={14} /> Record Marker
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Statistics Strip */}
                    <div className="ac-stats-strip">
                        <div className="ac-stat-card">
                            <div className="ac-stat-val text-white">{stats.total}</div>
                            <div className="ac-stat-label">Total Markers</div>
                            <div className="ac-stat-note">Cumulative merit count</div>
                        </div>
                        <div className="ac-stat-card">
                            <div className="ac-stat-val text-gold">{stats.academic}</div>
                            <div className="ac-stat-label">Academic Achievers</div>
                            <div className="ac-stat-note">Dean's List & Research</div>
                        </div>
                        <div className="ac-stat-card">
                            <div className="ac-stat-val text-teal">{stats.non_academic}</div>
                            <div className="ac-stat-label">Non-Academic</div>
                            <div className="ac-stat-note">Leadership & Mastery</div>
                        </div>
                        <div className="ac-stat-card">
                            <div className="ac-stat-val text-purple">{stats.group}</div>
                            <div className="ac-stat-label">Group Honors</div>
                            <div className="ac-stat-note">Team & Org achievements</div>
                        </div>
                    </div>

                    {/* Channel Tabs */}
                    <div className="ac-nav">
                        {Object.entries(channelConfig).map(([key, cfg]) => (
                            <div 
                                key={key} 
                                className={`ac-nav-item ${channel === key ? 'active' : ''}`}
                                onClick={() => handleChannelSwitch(key)}
                            >
                                <div className="ac-nav-dot" style={{ background: cfg.color }}></div>
                                <span className="ac-nav-label" style={{ color: channel === key ? cfg.color : undefined }}>{cfg.label}</span>
                                <div className="ac-nav-indicator" style={{ background: cfg.color }}></div>
                            </div>
                        ))}
                    </div>

                    {/* Filter Pills */}
                    <div className="ac-pills-row">
                        <div className="ac-pills">
                            {channelConfig[channel].pills.map(pill => (
                                <button 
                                    key={pill}
                                    className="ac-pill"
                                    style={getPillStyle(pill, activePill === pill, channelConfig[channel].color)}
                                    onClick={() => setActivePill(pill)}
                                >
                                    {pill}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-4 items-center">
                             <div className="relative group">
                                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-500 transition-colors" />
                                <input type="text" placeholder="Search entries..." className="bg-white/5 border border-white/5 rounded-xl py-2 pl-11 pr-4 text-xs text-white/60 outline-none focus:border-white/10 transition-all w-64" />
                             </div>
                        </div>
                    </div>

                    {/* Channel Views */}
                    {channel !== 'group' ? (
                        <div className="ac-grid">
                            {currentList.length > 0 ? currentList.map(award => (
                                <div key={award.id} className="ac-card" style={{ borderTopColor: award.tier === 'gold' ? (channel === 'academic' ? '#c89030' : '#30a8c0') : '#4b5563' }}>
                                    <div className="ac-card-badge" style={{ background: award.tier === 'gold' ? `${channelConfig[channel].color}15` : 'rgba(255,255,255,0.05)', color: award.tier === 'gold' ? channelConfig[channel].color : 'rgba(255,255,255,0.4)' }}>
                                        {award.tier.toUpperCase()}
                                    </div>
                                    
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="ac-avatar" style={{ background: `${getAvatarColor(award.student?.first_name)}20`, border: `1px solid ${getAvatarColor(award.student?.first_name)}40` }}>
                                            <span style={{ color: getAvatarColor(award.student?.first_name) }}>{award.student?.first_name?.[0]}{award.student?.last_name?.[0]}</span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-white">{award.student?.first_name} {award.student?.last_name}</div>
                                            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{award.student?.student_id} · {award.student?.section?.name}</div>
                                        </div>
                                    </div>

                                    <h3 className="ac-honor-title" style={{ color: channelConfig[channel].color }}>{award.title}</h3>
                                    <p className="ac-desc">{award.description}</p>

                                    <div className="flex items-center gap-4 py-4 border-y border-white/5 mb-6">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Academic Block</span>
                                            <span className="text-xs font-bold text-white/60">2ND SEM 2023-24</span>
                                        </div>
                                        <div className="w-px h-6 bg-white/5"></div>
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Conferred On</span>
                                            <span className="text-xs font-bold text-white/60">{award.date_awarded}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-2">
                                        <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 transition-colors">
                                            Profile
                                        </button>
                                        <a 
                                            href={award.certificate_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-widest transition-colors ${award.certificate_url ? 'text-orange-500 hover:bg-orange-500/10' : 'text-white/20 cursor-not-allowed'}`}
                                            onClick={(e) => !award.certificate_url && e.preventDefault()}
                                        >
                                            <FileText size={12} /> {award.certificate_url ? 'View' : 'None'}
                                        </a>
                                        {isAdmin && (
                                            <>
                                                <button onClick={() => handleEdit(award)} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 transition-colors">
                                                    <Edit size={12} /> Edit
                                                </button>
                                                <button onClick={() => handleDelete(award)} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-widest text-red-500/40 hover:bg-red-500/10 transition-colors">
                                                    <Trash2 size={12} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-32 text-center">
                                    <Bookmark size={40} className="mx-auto text-white/5 mb-4" />
                                    <p className="text-white/20 text-sm font-bold uppercase tracking-widest">Registry Silent</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="ac-group-list">
                            {currentList.length > 0 ? currentList.map(team => (
                                <div key={team.id} className="ac-group-card">
                                    <div className="flex items-center gap-8">
                                        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                            <Globe size={32} className="text-purple-400" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-2xl font-black text-white">{team.team_name}</h3>
                                                <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[9px] font-black text-purple-400 uppercase tracking-widest">
                                                    GROUP {team.tier.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="text-xs font-bold text-white/30 uppercase tracking-[0.15em] mb-4">{team.title} · {team.category}</div>
                                            <p className="text-sm text-white/50 max-w-2xl line-clamp-1">{team.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-6">
                                        <div className="flex items-center gap-2">
                                            {(team.group_members || []).slice(0, 4).map((member, i) => (
                                                <div key={i} className="ac-member-chip">
                                                    <div className="ac-member-initials" style={{ background: getAvatarColor(member) }}>{member[0]}</div>
                                                    {member}
                                                </div>
                                            ))}
                                            {team.group_members?.length > 4 && (
                                                <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold text-white/30">+{team.group_members.length - 4} MORE</div>
                                            )}
                                        </div>
                                        <div className="flex gap-3">
                                            <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 transition-colors">
                                                View Team
                                            </button>
                                            <a 
                                                href={team.certificate_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className={`flex items-center gap-2 px-5 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-colors ${team.certificate_url ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20' : 'bg-white/5 border-transparent text-white/20 cursor-not-allowed'}`}
                                                onClick={(e) => !team.certificate_url && e.preventDefault()}
                                            >
                                                <FileText size={14} /> {team.certificate_url ? 'Certificate' : 'No File'}
                                            </a>
                                            {isAdmin && (
                                                <>
                                                    <button onClick={() => handleEdit(team)} className="p-2.5 rounded-xl bg-white/5 text-white/20 hover:text-white transition-colors">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(team)} className="p-2.5 rounded-xl bg-white/5 text-red-500/20 hover:bg-red-500/10 hover:text-red-500 transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-32 text-center bg-white/[0.01] rounded-3xl border border-dashed border-white/5">
                                    <Users size={40} className="mx-auto text-white/5 mb-4" />
                                    <p className="text-white/20 text-sm font-bold uppercase tracking-widest">No Group Honors Synchronized</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Confirm Delete Modal */}
            <Modal show={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="md">
                <div className="ac-modal-root p-10 text-center">
                    <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Trash2 size={32} className="text-red-500" />
                    </div>
                    <h3 className="text-2xl font-black text-white italic font-serif mb-4">Revoke Honor Marker?</h3>
                    <p className="text-sm text-white/40 leading-relaxed mb-10">
                        Are you sure you want to permanently remove this achievement from the registry?
                    </p>
                    <div className="flex gap-4">
                        <button onClick={() => setDeleteTarget(null)} className="flex-1 py-4 rounded-2xl bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 transition-all">Abort</button>
                        <button onClick={confirmDelete} className="flex-1 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-red-950/20">Confirm</button>
                    </div>
                </div>
            </Modal>

            {/* Record/Edit Modal */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <div className="ac-modal-root">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <div>
                            <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Administrative Action</div>
                            <h2 className="text-2xl font-black text-white italic font-serif">
                                {isEditMode ? `Edit ${channelConfig[data.channel].label}` : (entryStep === 1 ? 'Record Honor Marker' : `New ${channelConfig[data.channel].label}`)}
                            </h2>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="text-white/20 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {entryStep === 1 && !isEditMode && (
                        <div className="p-10">
                            <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mb-8 text-center">Select Channel Identity</h3>
                            <div className="flex gap-6">
                                <button className={`ac-type-btn ${data.channel === 'academic' ? 'active-gold' : ''}`} onClick={() => setData('channel', 'academic')}>
                                    <GraduationCap size={32} className={`mx-auto mb-4 ${data.channel === 'academic' ? 'text-gold' : 'text-white/10'}`} />
                                    <div className={`text-[10px] font-black uppercase tracking-widest ${data.channel === 'academic' ? 'text-gold' : 'text-white/30'}`}>Academic Achiever</div>
                                </button>
                                <button className={`ac-type-btn ${data.channel === 'non_academic' ? 'active-teal' : ''}`} onClick={() => setData('channel', 'non_academic')}>
                                    <Trophy size={32} className={`mx-auto mb-4 ${data.channel === 'non_academic' ? 'text-teal' : 'text-white/10'}`} />
                                    <div className={`text-[10px] font-black uppercase tracking-widest ${data.channel === 'non_academic' ? 'text-teal' : 'text-white/30'}`}>Non-Academic</div>
                                </button>
                                <button className={`ac-type-btn ${data.channel === 'group' ? 'active-purple' : ''}`} onClick={() => setData('channel', 'group')}>
                                    <Users size={32} className={`mx-auto mb-4 ${data.channel === 'group' ? 'text-purple' : 'text-white/10'}`} />
                                    <div className={`text-[10px] font-black uppercase tracking-widest ${data.channel === 'group' ? 'text-purple' : 'text-white/30'}`}>Group Achievement</div>
                                </button>
                            </div>
                            <button className="w-full mt-10 py-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 transition-all flex items-center justify-center gap-2" onClick={() => { setData(prev => ({ ...prev, category: channelConfig[prev.channel].pills[1] })); setEntryStep(2); }}>
                                Continue to Entry <ChevronRight size={14} />
                            </button>
                        </div>
                    )}

                    {entryStep === 2 && (
                        <form onSubmit={submit} className="p-10 space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    {data.channel === 'group' ? (
                                        <>
                                            <div>
                                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 block">Team / Group Name</label>
                                                <input type="text" className="ac-input" placeholder="e.g. CCS Debuggers Squad" value={data.team_name} onChange={e => setData('team_name', e.target.value)} required />
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block">Group Roster ({data.group_members.length})</label>
                                                </div>
                                                <div className="relative mb-4">
                                                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                                                    <select 
                                                        className="ac-input pl-11" 
                                                        onChange={(e) => {
                                                            const student = students.find(s => s.id === parseInt(e.target.value));
                                                            if (student && !data.group_members.includes(`${student.first_name} ${student.last_name}`)) {
                                                                setData('group_members', [...data.group_members, `${student.first_name} ${student.last_name}`]);
                                                            }
                                                            e.target.value = "";
                                                        }}
                                                    >
                                                        <option value="">Add Member...</option>
                                                        {students.map(s => (
                                                            <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-4 bg-black/40 rounded-2xl border border-white/5">
                                                    {data.group_members.map((member, i) => (
                                                        <div key={i} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 flex items-center gap-2">
                                                            {member}
                                                            <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => setData('group_members', data.group_members.filter((_, idx) => idx !== i))} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div>
                                            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 block">Recipient Student</label>
                                            <select className="ac-input" value={data.student_id} onChange={e => setData('student_id', e.target.value)} required>
                                                <option value="">Identify Candidate...</option>
                                                {students.map(s => <option key={s.id} value={s.id}>{s.student_id} | {s.first_name} {s.last_name}</option>)}
                                            </select>
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 block">Honor / Achievement Title</label>
                                        <input type="text" className="ac-input font-serif italic text-lg" placeholder="e.g. Outstanding Leadership" value={data.title} onChange={e => setData('title', e.target.value)} required />
                                    </div>
                                    
                                    <div>
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 block">Digital Certificate (PDF/IMG)</label>
                                        <div className="relative group">
                                            <input 
                                                type="file" 
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                                onChange={e => setData('certificate_file', e.target.files[0])}
                                            />
                                            <div className="ac-input flex items-center gap-3 text-white/40 group-hover:border-orange-500/50 transition-colors">
                                                <Upload size={14} className={data.certificate_file ? 'text-orange-500' : ''} />
                                                <span className="truncate">{data.certificate_file ? data.certificate_file.name : (isEditMode ? 'Replace current file...' : 'Upload certificate...')}</span>
                                            </div>
                                        </div>
                                        {errors.certificate_file && <div className="text-[9px] text-red-500 mt-2 font-bold uppercase">{errors.certificate_file}</div>}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 block">Classification</label>
                                            <select className="ac-input" value={data.category} onChange={e => setData('category', e.target.value)}>
                                                {channelConfig[data.channel].pills.filter(p => p !== 'all').map(p => (
                                                    <option key={p} value={p}>{p}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 block">Tier / Merit</label>
                                            <select className="ac-input" value={data.tier} onChange={e => setData('tier', e.target.value)}>
                                                <option value="gold">Gold (Highest)</option>
                                                <option value="silver">Silver (Distinction)</option>
                                                <option value="bronze">Bronze (Merit)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 block">Date Conferred</label>
                                        <input type="date" className="ac-input" value={data.date_awarded} onChange={e => setData('date_awarded', e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 block">Justification / Basis</label>
                                        <textarea className="ac-input h-24 resize-none text-xs leading-relaxed" placeholder="Detailed justification..." value={data.description} onChange={e => setData('description', e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <input type="checkbox" id="countersign" className="w-5 h-5 rounded-lg border-white/10 bg-black text-orange-500" checked={data.countersign} onChange={e => setData('countersign', e.target.checked)} />
                                    <div>
                                        <label htmlFor="countersign" className="text-xs font-black text-white uppercase tracking-widest cursor-pointer">Administrative Countersign</label>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button type="button" className="text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white" onClick={() => isEditMode ? setIsModalOpen(false) : setEntryStep(1)}>Cancel</button>
                                    <button type="submit" className="px-8 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.2em]" disabled={processing}>
                                        <Save size={14} className="inline mr-2" /> {isEditMode ? 'Update Marker' : 'Seal Marker'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </Modal>
        </AppLayout>
    );
}
