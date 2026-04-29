import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm, Link } from '@inertiajs/react';
import { Save, ArrowLeft, User, Phone, BookOpen, GraduationCap } from 'lucide-react';
import { css } from './Theme';

export default function StudentEdit({ student, sections }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PATCH',
        first_name: student.first_name,
        last_name: student.last_name,
        middle_name: student.middle_name || '',
        email: student.user.email,
        birthdate: student.birthdate,
        gender: student.gender,
        address: student.address,
        guardian_name: student.guardian_name,
        guardian_contact: student.guardian_contact,
        guardian_relationship: student.guardian_relationship,
        grade_level: student.grade_level,
        section_id: student.section_id || '',
        enrollment_status: student.enrollment_status,
        school_year: student.school_year,
        photo: null,
        skills: student.skills || [],
        activities: student.activities || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('students.update', student.id));
    };

    const SectionTitle = ({ icon: Icon, title }) => (
        <div className="si-card-hdr" style={{ padding: '0 0 14px 0', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ padding: 6, borderRadius: 8, background: 'rgba(249,115,22,0.1)', color: '#f97316' }}>
                    <Icon size={16} />
                </div>
                <h3 className="si-card-title">{title}</h3>
            </div>
        </div>
    );

    const FormInput = ({ label, id, type = 'text', value, onChange, error, ...props }) => (
        <div style={{ marginBottom: 16 }}>
            <label htmlFor={id} className="si-filter-label" style={{ border: 'none', padding: 0, display: 'block', marginBottom: 8, color: 'rgba(254,243,236,0.5)' }}>
                {label}
            </label>
            {type === 'select' ? (
                <select
                    id={id}
                    className={`si-select ${error ? 'error' : ''}`}
                    style={{ width: '100%', padding: '12px 14px' }}
                    value={value}
                    onChange={onChange}
                    {...props}
                >
                    {props.children}
                </select>
            ) : type === 'textarea' ? (
                <div className={`si-search-wrap ${error ? 'error' : ''}`} style={{ padding: 0 }}>
                    <textarea
                        id={id}
                        value={value}
                        onChange={onChange}
                        style={{ padding: '12px 14px', minHeight: 120, resize: 'vertical' }}
                        {...props}
                    />
                </div>
            ) : (
                <div className={`si-search-wrap ${error ? 'error' : ''}`} style={{ padding: '2px 14px' }}>
                    <input
                        id={id}
                        type={type}
                        value={value}
                        onChange={onChange}
                        style={{ padding: '10px 0' }}
                        {...props}
                    />
                </div>
            )}
            {error && <div style={{ fontSize: 10, color: '#fca5a5', marginTop: 6, fontWeight: 700, textTransform: 'uppercase' }}>{error}</div>}
        </div>
    );

    return (
        <AppLayout title={`Edit ${student.first_name}'s Profile`} noPadding>
            <style>{css}</style>
            <div className="si-root">
                <div className="si-grid" />
                <div className="si-content" style={{ maxWidth: 900, margin: '0 auto', width: '100%' }}>
                    
                    {/* ── PAGE HEADER ── */}
                    <div className="si-hdr si-fade">
                        <div>
                            <Link href={route('students.show', student.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', textDecoration: 'none', marginBottom: 12, letterSpacing: '.1em' }}>
                                <ArrowLeft size={12} /> Back to Profile
                            </Link>
                            <h1 className="si-hdr-title">Update <span>Profile</span></h1>
                            <p className="si-hdr-sub">Modify student information and academic placement</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Identity & Basic Info */}
                        <div className="si-card si-fade si-fade-1" style={{ padding: 24, position: 'relative' }}>
                            <SectionTitle icon={User} title="Student Identity" />
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                                <FormInput label="First Name" id="first_name" value={data.first_name} onChange={e => setData('first_name', e.target.value)} error={errors.first_name} />
                                <FormInput label="Last Name" id="last_name" value={data.last_name} onChange={e => setData('last_name', e.target.value)} error={errors.last_name} />
                                <FormInput label="Middle Name" id="middle_name" value={data.middle_name} onChange={e => setData('middle_name', e.target.value)} error={errors.middle_name} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 4 }}>
                                <FormInput label="Official Email" id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} error={errors.email} />
                                <FormInput label="Gender" id="gender" type="select" value={data.gender} onChange={e => setData('gender', e.target.value)} error={errors.gender}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </FormInput>
                            </div>
                        </div>

                        <div className="si-card si-fade si-fade-2" style={{ padding: 24 }}>
                            <SectionTitle icon={GraduationCap} title="Academic Status" />
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                                <FormInput label="Year Level" id="grade_level" type="select" value={data.grade_level} onChange={e => setData('grade_level', e.target.value)} error={errors.grade_level}>
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                    <option value="Irregular">Irregular</option>
                                </FormInput>
                                <FormInput label="Section / Block" id="section_id" type="select" value={data.section_id} onChange={e => setData('section_id', e.target.value)} error={errors.section_id}>
                                    <option value="">Select Section</option>
                                    {sections.map(section => (
                                        <option key={section.id} value={section.id}>{section.name} ({section.grade_level})</option>
                                    ))}
                                </FormInput>
                                <FormInput label="Enrollment Status" id="enrollment_status" type="select" value={data.enrollment_status} onChange={e => setData('enrollment_status', e.target.value)} error={errors.enrollment_status}>
                                    <option value="enrolled">Enrolled</option>
                                    <option value="dropped">Dropped</option>
                                    <option value="transferred">Transferred</option>
                                    <option value="graduated">Graduated</option>
                                </FormInput>
                            </div>
                        </div>

                        {/* Contact & Guardian */}
                        <div className="si-card si-fade si-fade-3" style={{ padding: 24 }}>
                            <SectionTitle icon={Phone} title="Guardian Information" />
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <FormInput label="Guardian Full Name" id="guardian_name" value={data.guardian_name} onChange={e => setData('guardian_name', e.target.value)} error={errors.guardian_name} />
                                <FormInput label="Contact Number" id="guardian_contact" value={data.guardian_contact} onChange={e => setData('guardian_contact', e.target.value)} error={errors.guardian_contact} />
                                <FormInput label="Relationship" id="guardian_relationship" value={data.guardian_relationship} onChange={e => setData('guardian_relationship', e.target.value)} error={errors.guardian_relationship} />
                                <FormInput label="Residence Address" id="address" type="textarea" value={data.address} onChange={e => setData('address', e.target.value)} error={errors.address} />
                            </div>
                        </div>

                        {/* Skills & Activities */}
                        <div className="si-card si-fade si-fade-4" style={{ padding: 24 }}>
                            <SectionTitle icon={BookOpen} title="Skills & Activities" />
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                                <div>
                                    <label className="si-filter-label" style={{ border: 'none', padding: 0, display: 'block', marginBottom: 12, color: 'rgba(254,243,236,0.5)' }}>
                                        Skills
                                    </label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                        {['Basketball','Programming','Singing','Drawing','Dancing','Chess'].map(skill => (
                                            <label key={skill} className="si-checkbox-wrapper">
                                                <input type="checkbox" className="si-checkbox"
                                                    checked={data.skills?.includes(skill)}
                                                    onChange={e => {
                                                        const next = e.target.checked
                                                            ? [...(data.skills||[]), skill]
                                                            : (data.skills||[]).filter(s => s !== skill);
                                                        setData('skills', next);
                                                    }} />
                                                {skill}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="si-filter-label" style={{ border: 'none', padding: 0, display: 'block', marginBottom: 12, color: 'rgba(254,243,236,0.5)' }}>
                                        Activities
                                    </label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                        {['Student Council','Science Club','Sports','Arts & Culture'].map(activity => (
                                            <label key={activity} className="si-checkbox-wrapper">
                                                <input type="checkbox" className="si-checkbox"
                                                    checked={data.activities?.includes(activity)}
                                                    onChange={e => {
                                                        const next = e.target.checked
                                                            ? [...(data.activities||[]), activity]
                                                            : (data.activities||[]).filter(a => a !== activity);
                                                        setData('activities', next);
                                                    }} />
                                                {activity}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="si-fade si-fade-5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, paddingBottom: 32 }}>
                            <Link href={route('students.show', student.id)} className="si-enroll-btn secondary">
                                Discard
                            </Link>
                            <button type="submit" disabled={processing} className="si-enroll-btn">
                                <Save size={14} /> Update Record
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
