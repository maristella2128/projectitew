import React from 'react';
import StudentLayout from '@/Layouts/StudentLayout';

export default function Id() {
    return (
        <StudentLayout title="ID & Photo">
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: '60vh', flexDirection: 'column', gap: '12px',
            }}>
                <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '24px', fontWeight: 900, fontStyle: 'italic',
                    color: 'rgba(254,243,236,0.2)',
                }}>
                    ID & Photo
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(254,243,236,0.1)' }}>
                    Coming soon · Student ID and photo
                </div>
            </div>
        </StudentLayout>
    );
}
