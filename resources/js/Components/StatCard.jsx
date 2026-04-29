import React from 'react';

export default function StatCard({ title, value, icon: Icon, trend, color = 'accent' }) {
    const colorClasses = {
        accent: 'border-accent text-accent bg-accent/5',
        success: 'border-success text-success bg-success/5',
        danger: 'border-danger text-danger bg-danger/5',
        primary: 'border-primary text-primary bg-primary/5',
    };

    const borderStripClasses = {
        accent: 'bg-accent',
        success: 'bg-success',
        danger: 'bg-danger',
        primary: 'bg-primary',
    };

    return (
        <div className="bg-white rounded-xl border border-[#e8e0d4] overflow-hidden shadow-subtle hover:shadow-md transition-shadow relative">
            <div className={`h-1.5 w-full ${borderStripClasses[color]}`}></div>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-sans uppercase tracking-widest text-primary/40 font-bold">
                        {title}
                    </span>
                    <div className={`p-2.5 rounded-lg ${colorClasses[color]} border`}>
                        <Icon size={18} />
                    </div>
                </div>
                
                <div className="flex items-end gap-3">
                    <h3 className="text-3xl font-serif font-black text-primary">
                        {value}
                    </h3>
                    {trend && (
                        <span className={`text-xs font-sans font-bold mb-1.5 ${trend > 0 ? 'text-success' : 'text-danger'}`}>
                            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
