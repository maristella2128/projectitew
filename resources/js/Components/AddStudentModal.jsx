import React, { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, UserPlus, Check, X, ShieldCheck } from 'lucide-react';
import { router } from '@inertiajs/react';

const modalCss = `
    .asm-backdrop {
        position: fixed; inset: 0; z-index: 100;
        background: rgba(0,0,0,0.75); backdrop-filter: blur(6px);
        display: flex; align-items: center; justify-content: center;
        animation: asm-fade-in 0.25s ease-out both;
    }
    .asm-modal {
        background: #160e08; border: 1px solid rgba(249,115,22,0.15);
        border-radius: 20px; width: 100%; max-width: 520px; max-height: 85vh;
        display: flex; flex-direction: column; overflow: hidden;
        box-shadow: 0 25px 60px -10px rgba(0,0,0,0.8), 0 0 0 1px rgba(249,115,22,0.1);
        animation: asm-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
        font-family: 'DM Sans', sans-serif; color: rgba(254,243,236,0.9);
    }
    @keyframes asm-fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes asm-slide-up { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: none; } }
    
    .asm-header {
        padding: 24px; border-bottom: 1px solid rgba(249,115,22,0.1);
        background: linear-gradient(135deg, rgba(249,115,22,0.06), rgba(0,0,0,0.3));
    }
    .asm-eyebrow {
        font-size: 10px; font-weight: 700; text-transform: uppercase;
        letter-spacing: 0.15em; color: rgba(249,115,22,0.5); margin-bottom: 6px;
    }
    .asm-title {
        font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 800;
        font-style: italic; color: #fef3ec; line-height: 1.1; margin-bottom: 16px;
    }
    .asm-search-wrapper { position: relative; }
    .asm-search-icon { position: absolute; left: 16px; top: 14px; color: rgba(249,115,22,0.4); }
    .asm-search-input {
        width: 100%; padding: 14px 16px 14px 44px;
        background: rgba(0,0,0,0.4); border: 1px solid rgba(249,115,22,0.2);
        border-radius: 12px; color: #fef3ec; font-size: 14px; font-family: inherit;
        transition: all 0.2s; outline: none;
    }
    .asm-search-input:focus {
        background: rgba(249,115,22,0.05); border-color: rgba(249,115,22,0.4);
        box-shadow: 0 0 0 3px rgba(249,115,22,0.1);
    }
    .asm-search-input::placeholder { color: rgba(254,243,236,0.3); }
    
    .asm-body { flex: 1; overflow-y: auto; padding: 12px; background: rgba(0,0,0,0.2); min-height: 200px; }
    .asm-body::-webkit-scrollbar { width: 6px; }
    .asm-body::-webkit-scrollbar-track { background: transparent; }
    .asm-body::-webkit-scrollbar-thumb { background: rgba(249,115,22,0.2); border-radius: 10px; }
    
    .asm-empty { padding: 40px 20px; text-align: center; color: rgba(254,243,236,0.4); }
    .asm-empty-icon { margin-bottom: 12px; opacity: 0.3; }
    
    .asm-row {
        display: flex; align-items: center; gap: 14px; padding: 12px 16px;
        border-radius: 12px; transition: all 0.2s;
        border: 1px solid transparent; margin-bottom: 8px;
    }
    .asm-row-available { cursor: pointer; background: rgba(255,255,255,0.02); border-color: rgba(255,255,255,0.04); }
    .asm-row-available:hover { background: rgba(52,211,153,0.08); border-color: rgba(52,211,153,0.2); }
    .asm-row-taken { background: rgba(255,255,255,0.01); opacity: 0.6; pointer-events: none; }
    .asm-row-success { background: rgba(52,211,153,0.15) !important; border-color: rgba(52,211,153,0.4) !important; }
    
    .asm-avatar {
        width: 40px; height: 40px; border-radius: 10px;
        background: rgba(249,115,22,0.15); border: 1px solid rgba(249,115,22,0.3);
        display: flex; align-items: center; justify-content: center;
        font-family: 'Space Mono', monospace; font-size: 13px; font-weight: 700; color: #f97316;
        flex-shrink: 0;
    }
    .asm-row-success .asm-avatar {
        background: rgba(52,211,153,0.2); border-color: #34d399; color: #34d399;
    }
    
    .asm-info { flex: 1; min-width: 0; }
    .asm-name { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; color: #fef3ec; margin-bottom: 2px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .asm-sub { font-size: 11px; color: rgba(254,243,236,0.4); display: flex; gap: 8px; font-family: 'Space Mono', monospace; }
    
    .asm-action {
        padding: 6px 14px; border-radius: 8px; font-size: 10px; font-weight: 700;
        text-transform: uppercase; letter-spacing: 0.08em; display: flex; align-items: center; gap: 6px;
    }
    .asm-action-add { background: rgba(52,211,153,0.1); color: #34d399; border: 1px solid rgba(52,211,153,0.25); }
    .asm-row-available:hover .asm-action-add { background: #34d399; color: #000; box-shadow: 0 4px 12px rgba(52,211,153,0.25); }
    .asm-action-taken { background: rgba(255,255,255,0.05); color: rgba(254,243,236,0.3); border: 1px solid rgba(255,255,255,0.1); }
    .asm-action-success { background: transparent; color: #34d399; }
    
    .asm-footer {
        padding: 16px 24px; border-top: 1px solid rgba(249,115,22,0.15);
        display: flex; justify-content: space-between; align-items: center;
        background: #160e08;
    }
    .asm-count { font-size: 12px; color: rgba(254,243,236,0.5); font-weight: 500; }
    .asm-close-btn {
        padding: 10px 24px; border-radius: 10px; background: rgba(249,115,22,0.1);
        border: 1px solid rgba(249,115,22,0.2); color: #f97316; font-size: 12px;
        font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
        cursor: pointer; transition: all 0.2s;
    }
    .asm-close-btn:hover { background: rgba(249,115,22,0.2); border-color: rgba(249,115,22,0.4); color: #fdba74; }
`;

export default function AddStudentModal({
    isOpen,
    onClose,
    section,
    searchRoute = 'students.search',
    assignRoute = 'sections.assign-student',
    onAssigned
}) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addedIds, setAddedIds] = useState(new Set());
    const [addedCount, setAddedCount] = useState(0);

    // Reset when opened
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setResults([]);
            setAddedIds(new Set());
            setAddedCount(0);
        }
    }, [isOpen]);

    // Handle ESC key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Debounced search
    useEffect(() => {
        if (!isOpen) return;

        const timer = setTimeout(() => {
            if (query.trim().length === 0) {
                setResults([]);
                return;
            }

            setLoading(true);
            const params = new URLSearchParams({
                query: query.trim(),
                exclude_section: section?.id || ''
            });

            fetch(route(searchRoute) + '?' + params.toString(), {
                headers: { 'Accept': 'application/json' }
            })
            .then(res => res.json())
            .then(data => {
                setResults(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Search failed", err);
                setLoading(false);
            });
        }, 320);

        return () => clearTimeout(timer);
    }, [query, isOpen, section, searchRoute]);

    const handleAssign = (student) => {
        if (student.section_id || addedIds.has(student.id)) return;
        
        router.patch(route(assignRoute, section.id), { student_id: student.id }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setAddedIds(prev => new Set(prev).add(student.id));
                setAddedCount(prev => prev + 1);
                if (onAssigned) onAssigned(student);
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="asm-backdrop" onClick={onClose}>
            <style>{modalCss}</style>
            <div className="asm-modal" onClick={e => e.stopPropagation()}>
                
                <div className="asm-header">
                    <div className="asm-eyebrow">Assign to Section</div>
                    <div className="asm-title">{section?.name || 'Loading...'}</div>
                    <div className="asm-search-wrapper">
                        <Search className="asm-search-icon" size={16} />
                        <input
                            type="text"
                            autoFocus
                            placeholder="Search by name or ID..."
                            className="asm-search-input"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="asm-body">
                    {loading ? (
                        <div className="asm-empty">
                            <Loader2 className="asm-empty-icon animate-spin mx-auto" size={32} />
                            <div>Searching students...</div>
                        </div>
                    ) : results.length > 0 ? (
                        results.map(student => {
                            const isAdded = addedIds.has(student.id);
                            const isTaken = !isAdded && student.section_id && student.section_id !== section.id;
                            
                            let rowClass = "asm-row ";
                            if (isAdded) rowClass += "asm-row-success";
                            else if (isTaken) rowClass += "asm-row-taken";
                            else rowClass += "asm-row-available";
                            
                            const initials = student.name ? student.name.substring(0,2).toUpperCase() : '??';

                            return (
                                <div 
                                    key={student.id} 
                                    className={rowClass}
                                    onClick={() => handleAssign(student)}
                                >
                                    <div className="asm-avatar">{initials}</div>
                                    <div className="asm-info">
                                        <div className="asm-name">{student.name}</div>
                                        <div className="asm-sub">
                                            <span>{student.student_id}</span>
                                            {student.course && <span>· {student.course}</span>}
                                        </div>
                                    </div>
                                    <div>
                                        {isAdded ? (
                                            <div className="asm-action asm-action-success flex items-center justify-center">
                                                <Check size={14} /> <span className="ml-1">Added</span>
                                            </div>
                                        ) : isTaken ? (
                                            <div className="asm-action asm-action-taken">
                                                Taken ({student.section_name})
                                            </div>
                                        ) : (
                                            <div className="asm-action asm-action-add">
                                                <UserPlus size={13} /> Add
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : query.length > 0 ? (
                        <div className="asm-empty">
                            <ShieldCheck className="asm-empty-icon mx-auto" size={32} />
                            <div>No available students found for "{query}"</div>
                        </div>
                    ) : (
                        <div className="asm-empty">
                            <Search className="asm-empty-icon mx-auto" size={32} />
                            <div>Type a name or ID to search for students</div>
                        </div>
                    )}
                </div>
                
                <div className="asm-footer">
                    <div className="asm-count">
                        {addedCount > 0 ? (
                            <span style={{ color: '#34d399', fontWeight: 700 }}>✓ {addedCount} student{addedCount !== 1 ? 's' : ''} added</span>
                        ) : (
                            "Select students to add"
                        )}
                    </div>
                    <button className="asm-close-btn" onClick={onClose}>
                        {addedCount > 0 ? 'Done' : 'Close'}
                    </button>
                </div>
                
            </div>
        </div>
    );
}
