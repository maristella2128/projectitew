import StudentLayout from '@/Layouts/StudentLayout';
import { usePage } from '@inertiajs/react';

const Field = ({ label, value }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{
            fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '.08em', color: 'rgba(249,115,22,0.5)',
            fontFamily: "'DM Sans', sans-serif",
        }}>{label}</span>
        <span style={{
            fontSize: 13, fontWeight: 600,
            color: value ? '#fef3ec' : 'rgba(254,243,236,0.25)',
            fontFamily: "'DM Sans', sans-serif",
        }}>{value || '—'}</span>
    </div>
);

const Section = ({ title, children }) => (
    <div style={{
        background: 'linear-gradient(145deg, rgba(249,115,22,0.06), rgba(0,0,0,0.3))',
        border: '1px solid rgba(249,115,22,0.12)',
        borderRadius: 14, padding: '20px 24px', marginBottom: 16,
    }}>
        <div style={{
            fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '.1em', color: 'rgba(249,115,22,0.6)',
            marginBottom: 18, paddingBottom: 10,
            borderBottom: '1px solid rgba(249,115,22,0.1)',
            fontFamily: "'DM Sans', sans-serif",
        }}>{title}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '18px 24px' }}>
            {children}
        </div>
    </div>
);

export default function PersonalInfo() {
    const { user, student, section } = usePage().props;

    return (
        <StudentLayout title="Personal Info">
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 6 }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: 13, flexShrink: 0,
                        background: 'rgba(249,115,22,0.15)',
                        border: '1.5px solid rgba(249,115,22,0.35)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, fontWeight: 800, color: '#f97316',
                        fontFamily: "'DM Sans', sans-serif",
                    }}>
                        {user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? 'S'}
                    </div>
                    <div>
                        <h1 style={{
                            fontSize: 22, fontWeight: 700, color: '#fef3ec',
                            fontFamily: "'Playfair Display', serif",
                        }}>{user?.name ?? '—'}</h1>
                        <div style={{ fontSize: 11, color: 'rgba(254,243,236,0.4)', marginTop: 2 }}>
                            {student?.student_number ?? 'No student number'} &nbsp;·&nbsp;
                            {student?.program ?? 'No program'} &nbsp;·&nbsp;
                            {student?.enrollment_status ?? 'Unknown status'}
                        </div>
                    </div>
                </div>
            </div>

            {!student ? (
                <div style={{
                    textAlign: 'center', padding: '60px 24px',
                    color: 'rgba(254,243,236,0.3)', fontSize: 13,
                    background: 'rgba(249,115,22,0.04)',
                    border: '1px solid rgba(249,115,22,0.1)',
                    borderRadius: 14,
                }}>
                    No student record found. Please contact the registrar.
                </div>
            ) : (
                <>
                    {/* Personal Information */}
                    <Section title="Personal Information">
                        <Field label="First Name"     value={student.first_name} />
                        <Field label="Last Name"      value={student.last_name} />
                        <Field label="Middle Name"    value={student.middle_name} />
                        <Field label="Suffix"         value={student.suffix} />
                        <Field label="Gender"         value={student.gender} />
                        <Field label="Date of Birth"  value={student.date_of_birth} />
                        <Field label="Place of Birth" value={student.place_of_birth} />
                        <Field label="Civil Status"   value={student.civil_status} />
                        <Field label="Nationality"    value={student.nationality} />
                        <Field label="Religion"       value={student.religion} />
                    </Section>

                    {/* Contact Information */}
                    <Section title="Contact Information">
                        <Field label="Email"    value={user?.email} />
                        <Field label="Phone"    value={student.phone} />
                        <Field label="Address"  value={student.address} />
                        <Field label="City"     value={student.city} />
                        <Field label="Province" value={student.province} />
                        <Field label="Zip Code" value={student.zip_code} />
                    </Section>

                    {/* Academic Information */}
                    <Section title="Academic Information">
                        <Field label="Student Number"     value={student.student_number} />
                        <Field label="Program"            value={student.program} />
                        <Field label="Year Level"         value={student.year_level} />
                        <Field label="Section"            value={student.section} />
                        <Field label="Academic Year"      value={student.academic_year} />
                        <Field label="Semester"           value={student.semester} />
                        <Field label="Enrollment Status"  value={student.enrollment_status} />
                    </Section>

                    {/* Section Information */}
                    {section ? (
                        <div style={{
                            background: 'linear-gradient(145deg, rgba(249,115,22,0.08), rgba(0,0,0,0.3))',
                            border: '1px solid rgba(249,115,22,0.2)',
                            borderRadius: 14, padding: '20px 24px', marginBottom: 16,
                        }}>
                            {/* Section header */}
                            <div style={{
                                fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
                                letterSpacing: '.1em', color: 'rgba(249,115,22,0.6)',
                                marginBottom: 16, paddingBottom: 10,
                                borderBottom: '1px solid rgba(249,115,22,0.1)',
                                fontFamily: "'DM Sans', sans-serif",
                            }}>Section Assignment</div>

                            {/* Section name highlight banner */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 16,
                                background: 'rgba(249,115,22,0.1)',
                                border: '1px solid rgba(249,115,22,0.25)',
                                borderRadius: 10, padding: '14px 18px', marginBottom: 18,
                            }}>
                                <div style={{
                                    width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                                    background: 'linear-gradient(135deg, #f97316, #c2410c)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 16, fontWeight: 900, color: '#fff',
                                    fontFamily: "'DM Sans', sans-serif",
                                }}>
                                    {section.code?.[0] ?? section.name?.[0] ?? 'S'}
                                </div>
                                <div>
                                    <div style={{
                                        fontSize: 16, fontWeight: 800, color: '#fef3ec',
                                        fontFamily: "'Playfair Display', serif",
                                    }}>
                                        {section.name ?? '—'}
                                    </div>
                                    <div style={{
                                        fontSize: 11, color: 'rgba(254,243,236,0.45)', marginTop: 2,
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}>
                                        {section.program_name ?? 'No program'} &nbsp;·&nbsp; {section.code ?? ''}
                                    </div>
                                </div>
                                {/* Status badge */}
                                <div style={{ marginLeft: 'auto' }}>
                                    <span style={{
                                        fontSize: 9, fontWeight: 800, padding: '4px 12px',
                                        borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.1em',
                                        background: 'rgba(34,197,94,0.12)',
                                        color: '#4ade80',
                                        border: '1px solid rgba(34,197,94,0.3)',
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}>Enrolled</span>
                                </div>
                            </div>

                            {/* Section detail grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                gap: '16px 24px',
                            }}>
                                {[
                                    ['Section Code',   section.code],
                                    ['Program',        section.program_name],
                                    ['Program Code',   section.program_code],
                                    ['Year Level',     section.year_level ? `${section.year_level} Year` : null],
                                    ['Semester',       section.semester],
                                    ['Academic Year',  section.academic_year],
                                    ['Room',           section.room],
                                    ['Schedule Type',  section.schedule_type],
                                    ['Max Students',   section.max_students],
                                ].map(([label, value]) => (
                                    <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <span style={{
                                            fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                                            letterSpacing: '.08em', color: 'rgba(249,115,22,0.5)',
                                            fontFamily: "'DM Sans', sans-serif",
                                        }}>{label}</span>
                                        <span style={{
                                            fontSize: 13, fontWeight: 600,
                                            color: value ? '#fef3ec' : 'rgba(254,243,236,0.25)',
                                            fontFamily: "'DM Sans', sans-serif",
                                        }}>{value || '—'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            padding: '20px 24px', borderRadius: 14, marginBottom: 16,
                            background: 'rgba(249,115,22,0.04)',
                            border: '1px solid rgba(249,115,22,0.1)',
                            fontSize: 12, color: 'rgba(254,243,236,0.3)',
                            fontFamily: "'DM Sans', sans-serif",
                            textAlign: 'center',
                        }}>
                            No section assigned yet. Please contact your registrar.
                        </div>
                    )}

                    {/* Emergency Contact */}
                    <Section title="Emergency Contact">
                        <Field label="Name"         value={student.emergency_contact_name} />
                        <Field label="Phone"        value={student.emergency_contact_phone} />
                        <Field label="Relationship" value={student.emergency_contact_relation} />
                    </Section>
                </>
            )}
        </StudentLayout>
    );
}
