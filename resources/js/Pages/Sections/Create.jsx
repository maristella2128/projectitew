import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm, Link } from '@inertiajs/react';
import { Save, ArrowLeft, ArrowRight, Layers, User, Calendar } from 'lucide-react';

export default function SectionCreate({ teachers }) {
    const { data, setData, post, processing, errors, transform } = useForm({
        name: '',
        program_code: '',
        block: '',
        grade_level: '',
        school_year: '2025-2026',
        adviser_id: '',
    });

    // Synchronously transform the body data right before submission
    transform((data) => ({
        ...data,
        name: `${data.program_code}-${data.block}`
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('sections.store'));
    };

    return (
        <AppLayout title="Create Section" noPadding>
            <div className="relative min-h-screen p-8 lg:p-12" style={{ backgroundColor: '#0c0805', color: '#fef3ec', fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
                    backgroundImage: 'linear-gradient(rgba(249,115,22,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.022) 1px, transparent 1px)',
                    backgroundSize: '48px 48px'
                }}></div>
                <div style={{
                    position: 'absolute', top: '-8%', right: '-4%', width: 500, height: 500, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(249,115,22,0.055) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0
                }}></div>

                <div className="relative z-10 max-w-3xl mx-auto space-y-10 mt-8">
                    <div>
                        <Link href={route('sections.index')} className="text-[#f97316]/60 hover:text-[#f97316] transition-colors flex items-center gap-2 text-[10px] font-bold mb-4 uppercase tracking-widest w-fit">
                            <ArrowLeft size={14} /> Back to Courses
                        </Link>
                        <h1 className="text-4xl font-serif font-black text-[#fef3ec] italic">Establish Section</h1>
                        <p className="text-[#fef3ec]/40 text-sm mt-2">
                            To create a new program card (like BSIS), simply create a section using that prefix (e.g. "BSIS-1A").
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 rounded-2xl shadow-2xl space-y-8 relative overflow-hidden"
                          style={{ background: 'linear-gradient(180deg, #160e08, #0c0805)', border: '1px solid #2a1508' }}>
                          
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-orange-500/50 uppercase tracking-[0.15em]">Program Code</label>
                                <input
                                    type="text"
                                    className={`w-full border-none rounded-xl px-5 py-4 text-sm outline-none transition-all ${errors.name ? 'ring-1 ring-red-500/50' : 'focus:ring-1 focus:ring-orange-500/50'}`}
                                    style={{ background: 'rgba(0,0,0,0.3)', color: '#fef3ec' }}
                                    value={data.program_code || ''}
                                    onChange={e => setData('program_code', e.target.value.toUpperCase())}
                                    placeholder="e.g. BSIS, BSIT"
                                    required
                                />
                                <p className="text-[10px] text-white/30 italic mt-2">The course prefix (creates a new map card if unique).</p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-orange-500/50 uppercase tracking-[0.15em]">Section Block</label>
                                <input
                                    type="text"
                                    className={`w-full border-none rounded-xl px-5 py-4 text-sm outline-none transition-all ${errors.name ? 'ring-1 ring-red-500/50' : 'focus:ring-1 focus:ring-orange-500/50'}`}
                                    style={{ background: 'rgba(0,0,0,0.3)', color: '#fef3ec' }}
                                    value={data.block || ''}
                                    onChange={e => setData('block', e.target.value.toUpperCase())}
                                    placeholder="e.g. 1A, 2B"
                                    required
                                />
                                <p className="text-[10px] text-white/30 italic mt-2">The class block identifier.</p>
                            </div>
                        </div>

                        {data.program_code && data.block && (
                            <div className="px-4 py-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300 font-mono flex items-center gap-2">
                                <ArrowRight size={14} /> Final Database Name: <strong className="text-white">{data.program_code}-{data.block}</strong>
                            </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-orange-500/50 uppercase tracking-[0.15em]">Year Level</label>
                                <select
                                    className={`w-full border-none rounded-xl px-4 py-4 text-sm outline-none transition-all ${errors.grade_level ? 'ring-1 ring-red-500/50' : 'focus:ring-1 focus:ring-orange-500/50'}`}
                                    style={{ background: 'rgba(0,0,0,0.3)', color: data.grade_level ? '#fef3ec' : 'rgba(254,243,236,0.5)' }}
                                    value={data.grade_level}
                                    onChange={e => setData('grade_level', e.target.value)}
                                >
                                    <option value="" disabled style={{ color: 'black' }}>Select Year</option>
                                    <option value="1st Year" style={{ color: 'black' }}>1st Year</option>
                                    <option value="2nd Year" style={{ color: 'black' }}>2nd Year</option>
                                    <option value="3rd Year" style={{ color: 'black' }}>3rd Year</option>
                                    <option value="4th Year" style={{ color: 'black' }}>4th Year</option>
                                </select>
                                {errors.grade_level && <p className="text-[10px] text-red-400 font-bold mt-1 uppercase tracking-widest">{errors.grade_level}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-orange-500/50 uppercase tracking-[0.15em]">School Year</label>
                                <input
                                    type="text"
                                    className={`w-full border-none rounded-xl px-5 py-4 text-sm outline-none transition-all ${errors.school_year ? 'ring-1 ring-red-500/50' : 'focus:ring-1 focus:ring-orange-500/50'}`}
                                    style={{ background: 'rgba(0,0,0,0.3)', color: '#fef3ec' }}
                                    value={data.school_year}
                                    onChange={e => setData('school_year', e.target.value)}
                                />
                                {errors.school_year && <p className="text-[10px] text-red-400 font-bold mt-1 uppercase tracking-widest">{errors.school_year}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-orange-500/50 uppercase tracking-[0.15em]">Faculty Adviser (Optional)</label>
                            <select
                                className={`w-full border-none rounded-xl px-4 py-4 text-sm outline-none transition-all ${errors.adviser_id ? 'ring-1 ring-red-500/50' : 'focus:ring-1 focus:ring-orange-500/50'}`}
                                style={{ background: 'rgba(0,0,0,0.3)', color: data.adviser_id ? '#fef3ec' : 'rgba(254,243,236,0.5)' }}
                                value={data.adviser_id}
                                onChange={e => setData('adviser_id', e.target.value)}
                            >
                                <option value="" style={{ color: 'black' }}>Leave Unassigned</option>
                                {teachers.map(teacher => (
                                    <option key={teacher.id} value={teacher.id} style={{ color: 'black' }}>{teacher.name}</option>
                                ))}
                            </select>
                            {errors.adviser_id && <p className="text-[10px] text-red-400 font-bold mt-1 uppercase tracking-widest">{errors.adviser_id}</p>}
                        </div>

                        <div className="pt-6 border-t border-orange-500/10 flex items-center justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 px-8 py-4 rounded-xl text-xs font-bold transition-all shadow-lg"
                                style={{
                                    background: 'linear-gradient(135deg, #f97316, #c2410c)',
                                    color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em'
                                }}
                            >
                                <Save size={16} /> Establish Section
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
