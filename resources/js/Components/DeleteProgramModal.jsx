import React, { useState } from 'react';
import { AlertOctagon, X, Trash2 } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function DeleteProgramModal({ isOpen, onClose, programCode }) {
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen) return null;

    const handleDelete = (e) => {
        e.preventDefault();
        if (confirmText !== 'DELETE') return;
        
        setIsDeleting(true);
        router.delete(route('sections.destroy_program', { course: programCode }), {
            preserveState: true,
            onSuccess: () => {
                setIsDeleting(false);
                setConfirmText('');
                onClose();
            },
            onError: () => {
                setIsDeleting(false);
            }
        });
    };

    const handleClose = () => {
        if (!isDeleting) {
            setConfirmText('');
            onClose();
        }
    };

    const isMatch = confirmText === 'DELETE';

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={handleClose}
                style={{ animation: 'sx-fade-in 0.2s ease-out' }}
            />

            {/* Modal Box */}
            <div 
                className="relative w-full max-w-md bg-[#160e08] border border-red-900/30 rounded-2xl shadow-2xl overflow-hidden"
                style={{ animation: 'sx-slide-up 0.3s ease-out' }}
            >
                {/* Header */}
                <div className="p-6 border-b border-red-500/10 flex items-start justify-between bg-gradient-to-b from-[#251010] to-[#160e08]">
                    <div>
                        <div className="flex items-center gap-2 text-red-500 mb-2">
                            <AlertOctagon size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">Destructive Action</span>
                        </div>
                        <h2 className="text-2xl font-serif italic font-bold text-[#fef3ec]">Delete Program</h2>
                        <p className="text-xs text-red-400/80 mt-1">
                            This will permanently eradicate <strong className="text-white">{programCode}</strong> and all of its sections.
                        </p>
                    </div>
                    <button 
                        onClick={handleClose}
                        className="text-white/30 hover:text-white transition-colors"
                        disabled={isDeleting}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleDelete} className="p-6 space-y-6">
                    <div className="p-4 rounded-xl border border-red-900/30 bg-red-950/20 text-xs text-white/60 leading-relaxed">
                        You are about to irreversibly destroy the entire <strong>{programCode}</strong> directory. This action <span className="text-red-400 font-bold uppercase">cannot be undone</span> and will sever all database linkages associated with these sections.
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-red-500/50 uppercase tracking-[0.15em]">
                            Verification Required
                        </label>
                        <p className="text-[10px] text-white/30 mb-2">Please type <strong className="text-red-400 font-mono text-xs select-all">DELETE</strong> to confirm.</p>
                        
                        <input
                            autoFocus
                            type="text"
                            className={`w-full bg-black/50 border ${isMatch ? 'border-red-500/50 ring-1 ring-red-500/50' : 'border-red-900/30'} rounded-xl px-4 py-3 text-sm text-center text-[#fef3ec] font-mono tracking-widest outline-none transition-all placeholder:text-white/10`}
                            value={confirmText}
                            onChange={e => setConfirmText(e.target.value)}
                            placeholder="TYPE HERE"
                            disabled={isDeleting}
                        />
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-red-500/10">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 rounded-lg text-xs font-bold text-white/50 hover:text-white transition-colors"
                            disabled={isDeleting}
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            disabled={!isMatch || isDeleting}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background: isMatch ? 'linear-gradient(135deg, #ef4444, #991b1b)' : 'rgba(239, 68, 68, 0.1)',
                                color: isMatch ? '#fff' : 'rgba(239, 68, 68, 0.5)', 
                                border: isMatch ? 'none' : '1px solid rgba(239, 68, 68, 0.2)',
                                textTransform: 'uppercase', letterSpacing: '0.05em'
                            }}
                        >
                            <Trash2 size={14} /> Obliterate Program
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
