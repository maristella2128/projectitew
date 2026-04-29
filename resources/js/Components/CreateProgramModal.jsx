import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Save, X, BookOpen, Layers } from 'lucide-react';

export default function CreateProgramModal({ isOpen, onClose }) {
    const { data, setData, post, processing, errors, reset, transform } = useForm({
        program_code: '',
        block: '1A',
        grade_level: '1st Year',
        school_year: '2025-2026',
        adviser_id: '',
    });

    // We generate the section name right before posting
    transform((data) => ({
        ...data,
        name: `${data.program_code}-${data.block}`
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('sections.store'), {
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
                style={{ animation: 'sx-fade-in 0.2s ease-out' }}
            />

            {/* Modal Box */}
            <div 
                className="relative w-full max-w-lg bg-[#160e08] border border-[#2a1508] rounded-2xl shadow-2xl overflow-hidden"
                style={{ animation: 'sx-slide-up 0.3s ease-out' }}
            >
                {/* Header */}
                <div className="p-6 border-b border-orange-500/10 flex items-start justify-between bg-gradient-to-b from-[#1c120a] to-[#160e08]">
                    <div>
                        <div className="flex items-center gap-2 text-orange-500 mb-2">
                            <BookOpen size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Initialization</span>
                        </div>
                        <h2 className="text-2xl font-serif italic font-bold text-[#fef3ec]">Establish Program</h2>
                        <p className="text-xs text-white/30 mt-1">
                            Programs require at least one starting section to be initialized.
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-white/30 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    
                    <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-orange-500/50 uppercase tracking-[0.15em]">
                            New Program Code
                        </label>
                        <input
                            autoFocus
                            type="text"
                            className={`w-full border-none rounded-xl px-4 py-3 text-sm outline-none transition-all ${errors.name ? 'ring-1 ring-red-500/50' : 'focus:ring-1 focus:ring-orange-500/50'}`}
                            style={{ background: 'rgba(0,0,0,0.3)', color: '#fef3ec' }}
                            value={data.program_code}
                            onChange={e => setData('program_code', e.target.value.toUpperCase())}
                            placeholder="e.g. BSIS, BSBA, BSED"
                            required
                        />
                    </div>

                    <div className="p-4 rounded-xl border border-dashed border-orange-500/20 bg-orange-500/5">
                        <h3 className="text-[10px] font-bold text-orange-500/70 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Layers size={13} /> Initial Section Details
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">
                                    Year Level
                                </label>
                                <select
                                    className="w-full border-none rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-orange-500/50"
                                    style={{ background: 'rgba(0,0,0,0.4)', color: '#fef3ec' }}
                                    value={data.grade_level}
                                    onChange={e => setData('grade_level', e.target.value)}
                                >
                                    <option value="1st Year" style={{color:'black'}}>1st Year</option>
                                    <option value="2nd Year" style={{color:'black'}}>2nd Year</option>
                                    <option value="3rd Year" style={{color:'black'}}>3rd Year</option>
                                    <option value="4th Year" style={{color:'black'}}>4th Year</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">
                                    Block Identifier
                                </label>
                                <input
                                    type="text"
                                    className="w-full border-none rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-orange-500/50"
                                    style={{ background: 'rgba(0,0,0,0.4)', color: '#fef3ec' }}
                                    value={data.block}
                                    onChange={e => setData('block', e.target.value.toUpperCase())}
                                    placeholder="e.g. 1A"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {errors.name && (
                        <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">{errors.name}</p>
                    )}

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-orange-500/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-xs font-bold text-white/50 hover:text-white transition-colors"
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all shadow-lg disabled:opacity-50"
                            style={{
                                background: 'linear-gradient(135deg, #f97316, #c2410c)',
                                color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em'
                            }}
                        >
                            <Save size={14} /> Establish Program
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
