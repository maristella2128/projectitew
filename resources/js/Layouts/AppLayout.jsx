import React, { useEffect } from 'react';
import Sidebar from '@/Components/Sidebar';
import Topbar from '@/Components/Topbar';
import { Head, usePage } from '@inertiajs/react';

export default function AppLayout({ title, children, noPadding = false }) {
    const { props } = usePage();
    const customization = props.customization || {};

    // ── REAL-TIME THEME SYNCHRONIZATION ──
    useEffect(() => {
        if (!customization || Object.keys(customization).length === 0) return;
        
        // Update browser tab title dynamically
        if (customization.browserTabTitle) {
            document.title = title ? `${title} | ${customization.browserTabTitle}` : customization.browserTabTitle;
        }

        // Apply CSS Variables to :root
        const root = document.documentElement;
        const vars = {
            '--primary': customization.primary,
            '--secondary': customization.secondary,
            '--primary-glow': customization.primary ? `${customization.primary}1f` : 'rgba(249,115,22,0.12)',
            '--primary-border': customization.primary ? `${customization.primary}40` : 'rgba(249,115,22,0.25)',
            '--primary-dark': customization.secondary || customization.primary, 
            '--background': customization.background,
            '--surface': customization.surface,
            '--border': customization.border,
            '--text-primary': customization.textPrimary,
            '--text-muted': customization.textMuted,
            '--sidebar-w': `${customization.sidebarW}px`,
            '--topbar-h': `${customization.topbarH}px`,
            '--radius': `${customization.radius}px`,
            '--gap': `${customization.gap}px`,
            '--display-font': customization.displayFont,
            '--body-font': customization.bodyFont,
            '--mono-font': customization.monoFont,
            '--font-size': `${customization.fontSize}px`,
            '--line-height': customization.lineHeight === 'tight' ? '1.2' : 
                            customization.lineHeight === 'relaxed' ? '1.64' : 
                            customization.lineHeight === 'loose' ? '2.0' : '1.45',
        };

        Object.entries(vars).forEach(([key, val]) => {
            if (val) root.style.setProperty(key, val);
        });

        // Global convenience object
        window.customization = customization;
    }, [customization, title]);

    return (
        <div className="h-screen w-full bg-background flex overflow-hidden">
            <Head title={title} />
            
            <Sidebar />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
                <Topbar />

                <main className={noPadding ? "flex-1 flex flex-col" : "p-8 pb-12 flex-1"}>
                    <div className={noPadding ? "flex-1 flex flex-col animate-in fade-in duration-700 relative" : "max-w-[1400px] mx-auto animate-in fade-in duration-700 w-full"}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
