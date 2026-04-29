import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm, Head } from '@inertiajs/react';
import { 
    Search, Users, Target, Trophy, Crown 
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────────────────────
   STYLES (Premium Dark Orange Theme)
   ────────────────────────────────────────────────────────────────────────── */
const C = {
    bg: '#0c0805', surf: '#160e08', surf2: '#1c1208', bdr: '#2a1508', bdr2: '#3a1e0a',
    orange: '#f97316', o2: '#fb923c', o3: '#fdba74', o4: '#c2410c',
    txt: '#fef3ec', muted: 'rgba(254,243,236,0.35)', dim: 'rgba(254,243,236,0.18)',
    faint: 'rgba(254,243,236,0.06)',
    green: '#10b981', amber: '#f59e0b', red: '#ef4444', teal: '#14b8a6', blue: '#3b82f6', purple: '#8b5cf6'
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,900&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');

.gr-root {
    background: ${C.bg}; min-height: 100vh; flex: 1; display: flex; flex-direction: column;
    font-family: 'DM Sans', system-ui, sans-serif; color: ${C.txt}; padding: 32px 40px 80px; position: relative;
    overflow-x: hidden;
}
.gr-grid-tex { position: fixed; inset: 0; pointer-events: none; z-index: 0; background-size: 56px 56px; background-image: linear-gradient(${C.faint} 1px, transparent 1px), linear-gradient(90deg, ${C.faint} 1px, transparent 1px); }
.gr-orb1 { position: fixed; top: -10%; right: -5%; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%); pointer-events: none; z-index: 0; }

.gr-hdr { display: flex; align-items: flex-end; justify-content: space-between; position: relative; z-index: 10; margin-bottom: 40px; }
.gr-title { font-family: 'Playfair Display', serif; font-size: 44px; font-weight: 900; color: ${C.txt}; line-height: 1.1; letter-spacing: -0.02em; }
.gr-title i { color: ${C.orange}; font-style: italic; }

.gr-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 40px; position: relative; z-index: 10; }
.gr-stat-card { background: ${C.surf}; border: 1px solid ${C.bdr}; border-radius: 20px; padding: 24px; position: relative; overflow: hidden; }
.gr-stat-icon { color: ${C.o4}; opacity: 0.3; position: absolute; right: 20px; top: 20px; }
.gr-stat-lbl { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: ${C.orange}; margin-bottom: 8px; }
.gr-stat-val { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 900; font-style: italic; color: ${C.txt}; line-height: 1; }

.gr-filters { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 12px; background: ${C.surf2}; border: 1px solid ${C.bdr2}; border-radius: 24px; padding: 12px; position: relative; z-index: 10; margin-bottom: 24px; }
.gr-select, .gr-input { background: ${C.bg}; border: 1px solid ${C.bdr}; border-radius: 14px; padding: 0 16px; height: 48px; color: ${C.txt}; font-size: 14px; font-weight: 600; outline: none; transition: all 0.2s; width: 100%; appearance: none; }
.gr-select:focus, .gr-input:focus { border-color: ${C.orange}; box-shadow: 0 0 0 4px rgba(249,115,22,0.1); }
.gr-select-wrap { position: relative; }
.gr-select-wrap::after { content: '▾'; position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: ${C.orange}; pointer-events: none; font-size: 12px; }

.gr-card { background: ${C.surf}; border: 1px solid ${C.bdr}; border-radius: 32px; padding: 8px; position: relative; z-index: 10; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
.gr-table { width: 100%; border-collapse: collapse; }
.gr-th { text-align: left; padding: 20px 24px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; color: ${C.orange}; border-bottom: 1px solid ${C.bdr2}; }
.gr-td { padding: 20px 24px; border-bottom: 1px solid ${C.bdr}; vertical-align: middle; }
.gr-tr { transition: background 0.2s; }
.gr-tr:hover { background: rgba(255,255,255,0.02); }
.gr-tr:last-child .gr-td { border-bottom: none; }

.gr-meter-track { height: 4px; border-radius: 2px; background: rgba(255,255,255,0.1); max-width: 80px; }
.gr-meter-fill { height: 100%; border-radius: 2px; background: ${C.orange}; }

.podium-container { display: flex; justify-content: center; align-items: flex-end; gap: 24px; margin-bottom: 50px; position: relative; z-index: 10; margin-top: 20px; }
.podium-card { background: ${C.surf}; border: 1px solid ${C.bdr}; border-radius: 32px; padding: 28px; text-align: center; width: 280px; position: relative; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
.podium-card:hover { transform: translateY(-10px); }
.podium-card.rank-1 { width: 320px; border-color: rgba(245, 158, 11, 0.4); background: linear-gradient(180deg, ${C.surf} 0%, rgba(245, 158, 11, 0.05) 100%); z-index: 2; margin-bottom: 20px; box-shadow: 0 0 50px rgba(245, 158, 11, 0.1); }
.podium-card.rank-2 { border-color: rgba(200, 200, 200, 0.3); }
.podium-card.rank-3 { border-color: rgba(205, 127, 50, 0.3); }
.podium-avatar { width: 80px; height: 80px; border-radius: 40px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 900; color: #fff; box-shadow: 0 10px 20px rgba(0,0,0,0.5); }
.rank-1 .podium-avatar { width: 100px; height: 100px; border-radius: 50px; font-size: 36px; background: linear-gradient(135deg, ${C.amber}, #a16207); border: 4px solid rgba(245, 158, 11, 0.3); box-shadow: 0 0 30px rgba(245, 158, 11, 0.3); }
.rank-2 .podium-avatar { background: linear-gradient(135deg, #d4d4d8, #71717a); }
.rank-3 .podium-avatar { background: linear-gradient(135deg, #f5a65b, #9a5316); }
.podium-rank-badge { position: absolute; top: -20px; left: 50%; transform: translateX(-50%); width: 44px; height: 44px; border-radius: 22px; display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 900; color: #fff; box-shadow: 0 8px 16px rgba(0,0,0,0.4); border: 2px solid ${C.bg}; }
.rank-1 .podium-rank-badge { background: ${C.amber}; width: 56px; height: 56px; border-radius: 28px; font-size: 28px; top: -28px; }
.rank-2 .podium-rank-badge { background: #a1a1aa; border-color: #d4d4d8; }
.rank-3 .podium-rank-badge { background: #cd7f32; border-color: #f5a65b; }
`;

export default function LeaderboardIndex({ leaderboard, filters, categories, courses, topThree, stats }) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
        course: filters.course || '',
        year_level: filters.year_level || '',
        category_id: filters.category_id || '',
    });

    const handleFilter = (key, val) => {
        const newData = { ...data, [key]: val };
        get(route('leaderboard.index'), { data: newData, preserveState: true });
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return <div style={{ width: 24, height: 24, borderRadius:'50%', background: C.amber, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize: 12, fontWeight: 900 }}>1</div>;
        if (rank === 2) return <div style={{ width: 24, height: 24, borderRadius:'50%', background: '#a1a1aa', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize: 12, fontWeight: 900 }}>2</div>;
        if (rank === 3) return <div style={{ width: 24, height: 24, borderRadius:'50%', background: '#cd7f32', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize: 12, fontWeight: 900 }}>3</div>;
        return <span style={{ fontFamily:'Space Mono', fontSize:14, fontWeight:900, color:C.muted }}>{rank}</span>;
    };

    return (
        <AppLayout>
            <Head title="Student Leaderboard | Pamantasan ng Cabuyao · CCS" />
            <style>{css}</style>

            <div className="gr-root">
                <div className="gr-grid-tex" />
                <div className="gr-orb1" />

                <div className="gr-hdr">
                    <div>
                        <div style={{ fontSize:12, fontWeight:900, letterSpacing:'.3em', color:C.orange, textTransform:'uppercase', marginBottom:12 }}>
                            Engagement & Excellence
                        </div>
                        <h1 className="gr-title">
                            Student <i>Leaderboard</i>
                        </h1>
                    </div>
                </div>

                {/* Summary Metrics */}
                <div className="gr-metrics">
                    <div className="gr-stat-card">
                        <Users size={40} className="gr-stat-icon" />
                        <div className="gr-stat-lbl">Total Participants</div>
                        <div className="gr-stat-val">{stats.total_participants}</div>
                    </div>
                    <div className="gr-stat-card">
                        <Target size={40} className="gr-stat-icon" />
                        <div className="gr-stat-lbl">Average Points</div>
                        <div className="gr-stat-val" style={{ color:C.orange }}>{stats.average_points}</div>
                    </div>
                    <div className="gr-stat-card">
                        <Trophy size={40} className="gr-stat-icon" />
                        <div className="gr-stat-lbl">Most Active Category</div>
                        <div className="gr-stat-val" style={{ color:C.amber, fontSize: 30, lineHeight: 1.2 }}>
                            {stats.most_active_category}
                        </div>
                    </div>
                </div>

                {/* Podium Section */}
                {topThree && topThree.length > 0 && (
                    <div className="podium-container">
                        {/* Rank 2 */}
                        {topThree[1] && (
                            <div className="podium-card rank-2">
                                <div className="podium-rank-badge">2</div>
                                <div className="podium-avatar">
                                    {topThree[1].full_name.split(' ').map(n=>n[0]).slice(0,2).join('')}
                                </div>
                                <h3 style={{ fontSize: 16, fontWeight: 900, color: C.txt, marginBottom: 4 }}>{topThree[1].full_name}</h3>
                                <p style={{ fontSize: 10, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>{topThree[1].course} · {topThree[1].year_level} Year</p>
                                <div style={{ fontFamily: 'Playfair Display', fontSize: 32, fontWeight: 900, color: '#a1a1aa', fontStyle: 'italic', lineHeight: 1 }}>
                                    {topThree[1].total_points}
                                </div>
                                <div style={{ fontSize: 9, fontWeight: 900, color: C.dim, textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 4 }}>Total Points</div>
                            </div>
                        )}

                        {/* Rank 1 */}
                        {topThree[0] && (
                            <div className="podium-card rank-1">
                                <div className="podium-rank-badge">1</div>
                                <div className="podium-avatar">
                                    {topThree[0].full_name.split(' ').map(n=>n[0]).slice(0,2).join('')}
                                </div>
                                <h3 style={{ fontSize: 20, fontWeight: 900, color: C.txt, marginBottom: 4 }}>{topThree[0].full_name}</h3>
                                <p style={{ fontSize: 11, fontWeight: 800, color: C.orange, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 20 }}>{topThree[0].course} · {topThree[0].year_level} Year</p>
                                <div style={{ fontFamily: 'Playfair Display', fontSize: 48, fontWeight: 900, color: C.amber, fontStyle: 'italic', lineHeight: 1 }}>
                                    {topThree[0].total_points}
                                </div>
                                <div style={{ fontSize: 10, fontWeight: 900, color: C.orange, textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 6, opacity: 0.8 }}>Total Points</div>
                            </div>
                        )}

                        {/* Rank 3 */}
                        {topThree[2] && (
                            <div className="podium-card rank-3">
                                <div className="podium-rank-badge">3</div>
                                <div className="podium-avatar">
                                    {topThree[2].full_name.split(' ').map(n=>n[0]).slice(0,2).join('')}
                                </div>
                                <h3 style={{ fontSize: 16, fontWeight: 900, color: C.txt, marginBottom: 4 }}>{topThree[2].full_name}</h3>
                                <p style={{ fontSize: 10, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>{topThree[2].course} · {topThree[2].year_level} Year</p>
                                <div style={{ fontFamily: 'Playfair Display', fontSize: 32, fontWeight: 900, color: '#cd7f32', fontStyle: 'italic', lineHeight: 1 }}>
                                    {topThree[2].total_points}
                                </div>
                                <div style={{ fontSize: 9, fontWeight: 900, color: C.dim, textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 4 }}>Total Points</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Filters */}
                <div className="gr-filters">
                    <div style={{ position:'relative' }}>
                        <Search size={18} style={{ position:'absolute', left:16, top:15, color:C.orange, opacity:0.5 }} />
                        <input 
                            type="text" 
                            className="gr-input" 
                            placeholder="Student Name or ID..." 
                            style={{ paddingLeft:44 }}
                            value={data.search}
                            onChange={e => setData('search', e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleFilter('search', data.search)}
                        />
                    </div>
                    <div className="gr-select-wrap">
                        <select className="gr-select" value={data.course} onChange={e => handleFilter('course', e.target.value)}>
                            <option value="">All Programs</option>
                            {courses.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="gr-select-wrap">
                        <select className="gr-select" value={data.year_level} onChange={e => handleFilter('year_level', e.target.value)}>
                            <option value="">All Years</option>
                            {[1,2,3,4,5].map(y => <option key={y} value={y}>{y} Year</option>)}
                        </select>
                    </div>
                    <div className="gr-select-wrap">
                        <select className="gr-select" value={data.category_id} onChange={e => handleFilter('category_id', e.target.value)}>
                            <option value="">All Categories</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="gr-card">
                    <div style={{ overflowX:'auto' }}>
                        <table className="gr-table">
                            <thead>
                                <tr>
                                    <th className="gr-th" style={{ width:60, textAlign:'center' }}>Rank</th>
                                    <th className="gr-th">Student</th>
                                    <th className="gr-th">Course & Section</th>
                                    <th className="gr-th" style={{ textAlign:'right' }}>Points</th>
                                    <th className="gr-th" style={{ textAlign:'center' }}>Activities</th>
                                    <th className="gr-th" style={{ textAlign:'center' }}>Leadership</th>
                                    <th className="gr-th">Top Category</th>
                                    <th className="gr-th">Engagement</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.data && leaderboard.data.length > 0 ? leaderboard.data.map((student) => (
                                    <tr key={student.student_id} className="gr-tr">
                                        <td className="gr-td" style={{ textAlign:'center' }}>
                                            {getRankIcon(student.rank)}
                                        </td>
                                        <td className="gr-td">
                                            <div style={{ fontSize:14, fontWeight:700, color:C.txt, marginBottom:2 }}>{student.full_name}</div>
                                            <div style={{ fontFamily:'Space Mono', fontSize:10, fontWeight:700, color:C.muted }}>{student.student_id}</div>
                                        </td>
                                        <td className="gr-td">
                                            <div style={{ fontSize:12, fontWeight:800, color:C.orange, letterSpacing:'.05em' }}>{student.course}</div>
                                            <div style={{ fontSize:10, fontWeight:700, color:C.muted }}>
                                                {student.year_level}{['st','nd','rd','th'][student.year_level-1] || 'th'} Year · {student.section_name}
                                            </div>
                                            {student.course_rank && (
                                                <div style={{ display:'inline-flex', alignItems:'center', gap:4, marginTop:4, padding:'2px 8px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:6 }}>
                                                    <Trophy size={10} className="text-emerald-500" />
                                                    <span style={{ fontSize:8, fontWeight:900, color:C.green, textTransform:'uppercase' }}>Rank #{student.course_rank} in {student.course}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="gr-td" style={{ textAlign:'right' }}>
                                            <span style={{ fontFamily:'Playfair Display', fontSize:24, fontWeight:900, color:C.amber, fontStyle:'italic' }}>
                                                {student.total_points}
                                            </span>
                                        </td>
                                        <td className="gr-td" style={{ textAlign:'center' }}>
                                            <span style={{ fontFamily:'Space Mono', fontSize:13, fontWeight:900, color:C.txt }}>
                                                {student.activity_count}
                                            </span>
                                        </td>
                                        <td className="gr-td" style={{ textAlign:'center' }}>
                                            {student.leadership_count > 0 ? (
                                                <div className="flex items-center justify-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg inline-flex">
                                                    <Crown size={12} className="text-amber-500" />
                                                    <span style={{ fontFamily:'Space Mono', fontSize:11, fontWeight:900, color:C.amber }}>{student.leadership_count}</span>
                                                </div>
                                            ) : (
                                                <span style={{ color:C.dim }}>-</span>
                                            )}
                                        </td>
                                        <td className="gr-td">
                                            {student.top_category && student.top_category !== 'N/A' ? (
                                                <div style={{ 
                                                    display:'inline-flex', alignItems:'center', gap:6, 
                                                    padding:'4px 10px', background:`${C.orange}10`, border:`1px solid ${C.orange}20`, 
                                                    borderRadius:8, fontSize:9, fontWeight:900, textTransform:'uppercase', color:C.orange 
                                                }}>
                                                    {student.top_category}
                                                </div>
                                            ) : (
                                                <span style={{ fontSize:9, color:C.dim }}>-</span>
                                            )}
                                        </td>
                                        <td className="gr-td text-right">
                                            <div className="flex items-center gap-3">
                                                <div className="gr-meter-track" style={{ flex: 1 }}>
                                                    <div className="gr-meter-fill" style={{ width:`${Math.min((student.engagement_score / 150)*100, 100)}%` }} />
                                                </div>
                                                <span style={{ fontFamily:'Space Mono', fontSize:12, fontWeight:900, color:C.green }}>
                                                    {student.engagement_score}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="8" className="gr-td" style={{ textAlign:'center', padding:'60px 20px', color:C.muted, fontStyle:'italic', fontSize:14 }}>
                                            No students found matching these filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {leaderboard.last_page > 1 && (
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px', borderTop:`1px solid ${C.bdr2}` }}>
                            <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'.1em' }}>
                                Showing {leaderboard.from || 0} to {leaderboard.to || 0} of {leaderboard.total} entries
                            </div>
                            <div className="flex gap-2">
                                {leaderboard.links.map((link, i) => {
                                    if (link.url === null) {
                                        return <div key={i} dangerouslySetInnerHTML={{ __html: link.label }} style={{ padding:'8px 12px', fontSize:12, fontWeight:800, color:C.dim, cursor:'not-allowed' }} />;
                                    }
                                    const isActive = link.active;
                                    return (
                                        <button 
                                            key={i} 
                                            onClick={() => get(link.url)}
                                            style={{ 
                                                padding:'6px 14px', borderRadius:10, fontSize:12, fontWeight:900, transition:'all .2s',
                                                background: isActive ? C.orange : 'transparent',
                                                color: isActive ? '#fff' : C.muted,
                                                border: isActive ? `1px solid ${C.orange}` : `1px solid ${C.bdr2}`,
                                            }}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
