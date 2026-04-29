import StudentLayout from '@/Layouts/StudentLayout';
import { usePage } from '@inertiajs/react';

const Field = ({ label, value, highlight }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'rgba(249,115,22,0.5)', fontFamily: "'DM Sans',sans-serif" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: highlight ? 800 : 600, color: value ? (highlight ? '#f97316' : '#fef3ec') : 'rgba(254,243,236,0.25)', fontFamily: "'DM Sans',sans-serif" }}>{value || '—'}</span>
    </div>
);

const StatusBadge = ({ status }) => {
    const map = {
        Enrolled:   { bg: 'rgba(34,197,94,0.12)',   color: '#4ade80', border: 'rgba(34,197,94,0.3)' },
        Ongoing:    { bg: 'rgba(96,165,250,0.12)',   color: '#60a5fa', border: 'rgba(96,165,250,0.3)' },
        Passed:     { bg: 'rgba(34,197,94,0.12)',    color: '#4ade80', border: 'rgba(34,197,94,0.3)' },
        Failed:     { bg: 'rgba(239,68,68,0.12)',    color: '#fca5a5', border: 'rgba(239,68,68,0.3)' },
        Dropped:    { bg: 'rgba(148,163,184,0.1)',   color: '#94a3b8', border: 'rgba(148,163,184,0.25)' },
        Incomplete: { bg: 'rgba(245,158,11,0.12)',   color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
    };
    const s = map[status] ?? map.Ongoing;
    return (
        <span style={{ fontSize: 9, fontWeight: 800, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.08em', background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontFamily: "'DM Sans',sans-serif" }}>
            {status ?? '—'}
        </span>
    );
};

export default function EnrollmentDetails() {
    const { currentEnrollment, subjects, history } = usePage().props;

    return (
        <StudentLayout title="Enrollment Details">

            {/* ── Current Enrollment Banner ── */}
            {currentEnrollment ? (
                <div style={{
                    background: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(194,65,12,0.06))',
                    border: '1px solid rgba(249,115,22,0.25)', borderRadius: 16,
                    padding: '22px 26px', marginBottom: 20,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
                        <div>
                            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: 'rgba(249,115,22,0.6)', marginBottom: 4, fontFamily: "'DM Sans',sans-serif" }}>Current Enrollment</div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: '#fef3ec', fontFamily: "'Playfair Display',serif" }}>
                                {currentEnrollment.academic_year ?? '—'} &nbsp;·&nbsp;
                                <span style={{ color: '#f97316', fontStyle: 'italic' }}>{currentEnrollment.semester ?? '—'}</span>
                            </div>
                        </div>
                        <StatusBadge status={currentEnrollment.status} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px 24px' }}>
                        <Field label="Program"       value={currentEnrollment.program} />
                        <Field label="Program Code"  value={currentEnrollment.program_code} />
                        <Field label="Section"       value={currentEnrollment.section} highlight />
                        <Field label="Section Code"  value={currentEnrollment.section_code} />
                        <Field label="Year Level"    value={currentEnrollment.year_level ? `${currentEnrollment.year_level} Year` : null} />
                        <Field label="Semester"      value={currentEnrollment.semester} />
                        <Field label="Academic Year" value={currentEnrollment.academic_year} />
                        <Field label="Date Enrolled" value={currentEnrollment.enrolled_at} />
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px 24px', borderRadius: 14, marginBottom: 20, background: 'rgba(249,115,22,0.04)', border: '1px solid rgba(249,115,22,0.1)', color: 'rgba(254,243,236,0.3)', fontSize: 13 }}>
                    No current enrollment found. Please contact the registrar.
                </div>
            )}

            {/* ── Enrolled Subjects Table ── */}
            <div style={{ background: 'linear-gradient(145deg, rgba(249,115,22,0.06), rgba(0,0,0,0.3))', border: '1px solid rgba(249,115,22,0.12)', borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
                <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fef3ec', fontFamily: "'Playfair Display',serif" }}>Enrolled Subjects</div>
                    <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 10px', borderRadius: 20, background: 'rgba(249,115,22,0.14)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.3)', fontFamily: "'DM Sans',sans-serif" }}>
                        {subjects?.length ?? 0} subjects
                    </span>
                </div>

                {subjects?.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(249,115,22,0.08)' }}>
                                    {['Code', 'Subject Name', 'Units', 'Schedule', 'Instructor', 'Room', 'Status'].map(h => (
                                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 8, fontWeight: 700, letterSpacing: '.1em', color: 'rgba(249,115,22,0.42)', textTransform: 'uppercase', fontFamily: "'DM Sans',sans-serif", whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map((sub, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid rgba(249,115,22,0.05)', transition: 'background .15s' }}
                                        onMouseOver={e => e.currentTarget.style.background = 'rgba(249,115,22,0.04)'}
                                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '11px 16px', fontSize: 11, fontWeight: 700, color: '#f97316', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{sub.code ?? '—'}</td>
                                        <td style={{ padding: '11px 16px', fontSize: 12, fontWeight: 600, color: '#fef3ec', fontFamily: "'DM Sans',sans-serif" }}>{sub.name ?? '—'}</td>
                                        <td style={{ padding: '11px 16px', fontSize: 12, color: 'rgba(254,243,236,0.6)', textAlign: 'center', fontFamily: "'DM Sans',sans-serif" }}>{sub.units ?? '—'}</td>
                                        <td style={{ padding: '11px 16px', fontSize: 11, color: 'rgba(254,243,236,0.5)', fontFamily: "'DM Sans',sans-serif", whiteSpace: 'nowrap' }}>{sub.schedule ?? '—'}</td>
                                        <td style={{ padding: '11px 16px', fontSize: 11, color: 'rgba(254,243,236,0.5)', fontFamily: "'DM Sans',sans-serif" }}>{sub.instructor ?? '—'}</td>
                                        <td style={{ padding: '11px 16px', fontSize: 11, color: 'rgba(254,243,236,0.5)', fontFamily: "'DM Sans',sans-serif" }}>{sub.room ?? '—'}</td>
                                        <td style={{ padding: '11px 16px' }}><StatusBadge status={sub.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ padding: '40px 24px', textAlign: 'center', color: 'rgba(254,243,236,0.25)', fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>
                        No subjects found for this enrollment.
                    </div>
                )}
            </div>

            {/* ── Enrollment History ── */}
            <div style={{ background: 'linear-gradient(145deg, rgba(249,115,22,0.04), rgba(0,0,0,0.3))', border: '1px solid rgba(249,115,22,0.1)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(249,115,22,0.08)' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fef3ec', fontFamily: "'Playfair Display',serif" }}>Enrollment History</div>
                    <div style={{ fontSize: 10, color: 'rgba(254,243,236,0.3)', marginTop: 2, fontFamily: "'DM Sans',sans-serif" }}>Previous semesters and academic years</div>
                </div>

                {history?.length > 0 ? (
                    <div style={{ padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {history.map((h, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(249,115,22,0.04)', border: '1px solid rgba(249,115,22,0.09)', borderRadius: 10, flexWrap: 'wrap', gap: 8 }}>
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fef3ec', fontFamily: "'DM Sans',sans-serif" }}>
                                        {h.academic_year ?? '—'} · {h.semester ?? '—'}
                                    </div>
                                    <div style={{ fontSize: 11, color: 'rgba(254,243,236,0.4)', marginTop: 2, fontFamily: "'DM Sans',sans-serif" }}>
                                        {h.program ?? '—'} · {h.section ?? '—'} · {h.year_level ? `${h.year_level} Year` : '—'}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    {h.enrolled_at && <span style={{ fontSize: 10, color: 'rgba(254,243,236,0.3)', fontFamily: "'DM Sans',sans-serif" }}>{h.enrolled_at}</span>}
                                    <StatusBadge status={h.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '40px 24px', textAlign: 'center', color: 'rgba(254,243,236,0.25)', fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>
                        No enrollment history found.
                    </div>
                )}
            </div>

        </StudentLayout>
    );
}
