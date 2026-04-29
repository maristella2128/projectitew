import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@/inertia-adapter';
import { 
    User, Mail, Calendar, MapPin, ShieldCheck, 
    Phone, GraduationCap, Upload, Plus, X, 
    CheckCircle2, ArrowRight, Loader2, Fingerprint,
    BookOpen, Search, AlertCircle
} from 'lucide-react';
import axios from 'axios';

// ── Palette matching screenshots ─────────────────────────────────────
const C = {
    bg: '#0a0502', card: '#120a06', border: '#2a1508',
    orange: '#d4885c', orangeDim: 'rgba(212,136,92,0.1)',
    text: '#fef3ec', muted: 'rgba(254,243,236,0.3)',
    dim: 'rgba(254,243,236,0.15)',
};

// ── Mini components ─────────────────────────────────────────────────
const Label = ({ children }) => (
    <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.muted, marginBottom: 8 }}>{children}</div>
);

const Field = ({ label, children }) => (
    <div>
        <Label>{label}</Label>
        {children}
    </div>
);

const CardHeader = ({ icon: Icon, title, subtitle }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ padding: 8, borderRadius: 10, background: 'rgba(212,136,92,0.1)', color: '#d4885c', flexShrink: 0 }}>
            <Icon size={16} />
        </div>
        <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fef3ec', letterSpacing: '-0.02em' }}>{title}</div>
            {subtitle && <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(254,243,236,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>{subtitle}</div>}
        </div>
    </div>
);

const ErrMsg = ({ msg }) => msg ? <div style={{ fontSize: 10, color: '#fca5a5', fontWeight: 700, textTransform: 'uppercase', marginTop: 5 }}>{msg}</div> : null;

const inputStyle = (hasError) => ({
    width: '100%', backgroundColor: 'rgba(0,0,0,0.3)',
    border: `1.5px solid ${hasError ? '#fca5a5' : C.border}`,
    borderRadius: 12, padding: '12px 14px', color: C.text,
    fontSize: 13, fontWeight: 600, outline: 'none',
    boxSizing: 'border-box', transition: 'border-color .15s',
});

const selectStyle = (hasError) => ({
    ...inputStyle(hasError), appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23d4885c' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
    paddingRight: 38,
});

const readonlyStyle = {
    padding: '12px 14px',
    width: '100%',
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 600,
    boxSizing: 'border-box',
    backgroundColor: 'rgba(212,136,92,0.1)',
    border: `1.7px solid rgba(212,136,92,0.25)`,
    color: 'rgba(254,243,236,0.6)',
    cursor: 'not-allowed',
};

const card = { backgroundColor: C.card, border: `1.2px solid ${C.border}`, borderRadius: 20, padding: 24, marginBottom: 16 };
const grid2 = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 };
const grid3 = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 };

export default function StudentForm({ success, message }) {
    const [step, setStep] = useState(1);
    const [verifying, setVerifying] = useState(false);
    const [registrationCode, setRegistrationCode] = useState('');
    const [error, setError] = useState(null);
    const [sections, setSections] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
        first_name: '',
        last_name: '',
        middle_name: '',
        lrn: '',
        email: '',
        birthdate: '',
        gender: '',
        address: '',
        guardian_name: '',
        guardian_contact: '',
        guardian_relationship: '',
        year_level: '',
        year_level_applied: '',
        section_id: '',
        school_year: '',
        skills: [],
        activities: [],
    });

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setVerifying(true);
        setError(null);

        try {
            const response = await axios.post(route('public.form.validate'), {
                code: registrationCode
            });

            if (response.data.valid) {
                const s = response.data.student;
                setData(prev => ({
                    ...prev,
                    code: registrationCode,
                    first_name: s.first_name,
                    last_name: s.last_name,
                    email: s.email,
                    year_level_applied: s.year_level_applied || '',
                }));
                setSections(response.data.sections);
                setStep(2);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired code.');
        } finally {
            setVerifying(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('public.form.submit'), {
            onSuccess: () => setStep(3),
        });
    };



    if (success || step === 3) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <Head title="Success - Student Registration" />
                <div style={{ maxWidth: 520, width: '100%', backgroundColor: C.card, border: '1px solid rgba(52,211,153,0.2)', borderRadius: 28, padding: 48, textAlign: 'center' }}>
                    <div style={{ width: 72, height: 72, borderRadius: 20, backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 40px rgba(16,185,129,0.3)' }}>
                        <ShieldCheck size={36} color="#000" />
                    </div>
                    <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Form Submitted!</h1>
                    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6, marginBottom: 36 }}>
                        {message || 'Form submitted successfully! Your registrar will review your profile and notify you of the next steps.'}
                    </p>

                </div>
            </div>
        );
    }

    return (
        <div style={{ height: '100vh', width: '100%', backgroundColor: C.bg, color: C.text, fontFamily: 'Inter, sans-serif', overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
            <Head title={step === 1 ? "Verify Enrollment" : "Complete Profile"} />

            {/* Grid Background Effect */}
            <div style={{ position: 'fixed', inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: '40px 40px', opacity: 0.1, pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
                
                {step === 1 ? (
                    <div style={{ maxWidth: 450, margin: '80px auto', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', padding: 12, borderRadius: 16, background: C.orangeDim, color: C.orange, marginBottom: 24 }}>
                            <Fingerprint size={32} />
                        </div>
                        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>Student Identity</h1>
                        <p style={{ color: C.muted, fontSize: 14, marginBottom: 32 }}>Enter your 8-character registration code to access the enrollment form.</p>

                        <form onSubmit={handleVerifyCode} style={{ textAlign: 'left' }}>
                            <div style={{ position: 'relative', marginBottom: 16 }}>
                                <input
                                    type="text"
                                    maxLength="8"
                                    value={registrationCode}
                                    onChange={(e) => setRegistrationCode(e.target.value.toUpperCase())}
                                    placeholder="REG-1234"
                                    style={{ ...inputStyle(!!error), fontSize: 24, padding: '20px', textAlign: 'center', letterSpacing: '0.3em', fontFamily: 'monospace' }}
                                />
                                {verifying && <Loader2 size={24} color={C.orange} style={{ position: 'absolute', right: 20, top: 22, animation: 'spin 1s linear infinite' }} />}
                            </div>

                            {error && <div style={{ fontSize: 11, color: '#fca5a5', fontWeight: 700, textAlign: 'center', textTransform: 'uppercase', marginBottom: 16 }}>{error}</div>}

                            <button
                                type="submit"
                                disabled={verifying || registrationCode.length !== 8}
                                style={{ width: '100%', padding: '16px', borderRadius: 14, background: registrationCode.length === 8 ? C.orange : 'rgba(212,136,92,0.2)', color: '#000', fontWeight: 900, fontSize: 13, border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                            >
                                Verify Identity
                            </button>
                        </form>
                    </div>
                ) : (
                    <div style={{ animation: 'fadeIn .4s ease' }}>
                        <div style={{ marginBottom: 40 }}>
                            <div style={{ background: C.orangeDim, border: `1px solid ${C.border}`, borderRadius: 16, padding: '14px 18px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <ShieldCheck size={18} color={C.orange} />
                                <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>
                                    You are registering as: <span style={{ color: C.orange }}>{data.first_name} {data.last_name}</span> — <span style={{ color: C.orange }}>{data.year_level_applied}</span>
                                </div>
                            </div>
                            <h1 style={{ fontSize: 36, fontWeight: 900, fontStyle: 'italic', fontFamily: 'serif', letterSpacing: '-0.02em', color: C.text, margin: 0, lineHeight: 1.1 }}>
                                Student <span style={{ color: C.orange }}>Profiling</span>
                            </h1>
                            <p style={{ color: C.muted, fontSize: 14, marginTop: 8, lineHeight: 1.5 }}>
                                Welcome! Please complete the missing details to build your student identity.
                            </p>
                        </div>


                        <form onSubmit={handleSubmit}>
                            {/* IDENTITY SECTION */}
                            <div style={card}>
                                <CardHeader icon={User} title="Student Identity" subtitle="Basic Personal Information" />
                                <div style={{ ...grid3, marginBottom: 20 }}>
                                    <Field label="First Name">
                                        <input style={inputStyle(errors.first_name)} value={data.first_name} onChange={e => setData('first_name', e.target.value)} />
                                        <ErrMsg msg={errors.first_name} />
                                    </Field>
                                    <Field label="Last Name">
                                        <input style={inputStyle(errors.last_name)} value={data.last_name} onChange={e => setData('last_name', e.target.value)} />
                                        <ErrMsg msg={errors.last_name} />
                                    </Field>
                                    <Field label="Middle Name">
                                        <input style={inputStyle(errors.middle_name)} value={data.middle_name} onChange={e => setData('middle_name', e.target.value)} placeholder="Optional" />
                                        <ErrMsg msg={errors.middle_name} />
                                    </Field>
                                </div>
                                <div style={grid2}>
                                    <Field label="LRN (12 digits)">
                                        <input style={inputStyle(errors.lrn)} value={data.lrn} onChange={e => setData('lrn', e.target.value)} maxLength="12" placeholder="Optional" />
                                        <ErrMsg msg={errors.lrn} />
                                    </Field>
                                    <Field label="Official Email">
                                        <input style={inputStyle(errors.email)} value={data.email} onChange={e => setData('email', e.target.value)} />
                                        <ErrMsg msg={errors.email} />
                                    </Field>
                                    <Field label="Birthdate">
                                        <input type="date" style={inputStyle(errors.birthdate)} value={data.birthdate} onChange={e => setData('birthdate', e.target.value)} />
                                        <ErrMsg msg={errors.birthdate} />
                                    </Field>
                                    <Field label="Gender">
                                        <select style={selectStyle(errors.gender)} value={data.gender} onChange={e => setData('gender', e.target.value)}>
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <ErrMsg msg={errors.gender} />
                                    </Field>
                                </div>
                            </div>

                            {/* ACADEMIC PLACEMENT SECTION */}
                            <div style={card}>
                                <CardHeader icon={GraduationCap} title="Academic Placement" subtitle="Assign Section and School Year" />
                                <div style={grid3}>
                                    <Field label="Year Level (Applied)">
                                        <input style={inputStyle(errors.year_level_applied)} value={data.year_level_applied} onChange={e => setData('year_level_applied', e.target.value)} />
                                        <ErrMsg msg={errors.year_level_applied} />
                                    </Field>
                                    <Field label="Section Allocation">
                                        <div style={{ ...readonlyStyle, fontStyle: 'italic', color: C.orange }}>
                                            Your section will be assigned by your registrar after review.
                                        </div>
                                    </Field>
                                    <Field label="Registration Status">
                                        <div style={readonlyStyle}>Valid Code Applied</div>
                                    </Field>
                                </div>
                            </div>

                            {/* GUARDIAN SECTION */}
                            <div style={card}>
                                <CardHeader icon={Phone} title="Guardian Information" subtitle="Emergency Contact Details" />
                                <div style={{ ...grid2, marginBottom: 16 }}>
                                    <Field label="Guardian Full Name">
                                        <input style={inputStyle(errors.guardian_name)} value={data.guardian_name} onChange={e => setData('guardian_name', e.target.value)} />
                                        <ErrMsg msg={errors.guardian_name} />
                                    </Field>
                                    <Field label="Contact Number">
                                        <input style={inputStyle(errors.guardian_contact)} value={data.guardian_contact} onChange={e => setData('guardian_contact', e.target.value)} />
                                        <ErrMsg msg={errors.guardian_contact} />
                                    </Field>
                                    <Field label="Relationship">
                                        <input style={inputStyle(errors.guardian_relationship)} value={data.guardian_relationship} onChange={e => setData('guardian_relationship', e.target.value)} />
                                        <ErrMsg msg={errors.guardian_relationship} />
                                    </Field>
                                    <Field label="Residence Address">
                                        <textarea style={{ ...inputStyle(errors.address), minHeight: 48, resize: 'vertical' }} value={data.address} onChange={e => setData('address', e.target.value)} />
                                        <ErrMsg msg={errors.address} />
                                    </Field>
                                </div>
                            </div>

                            {/* SKILLS & ACTIVITIES SECTION */}
                            <div style={card}>
                                <CardHeader icon={BookOpen} title="Skills & Activities" subtitle="Optional — Extracurricular Profile" />
                                <div style={grid2}>
                                    <Field label="Skills">
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                            {['Programming','Web Design','Technical Writing','Hardware Repair','Networking','Cybersecurity'].map(skill => (
                                                <label key={skill} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', backgroundColor: data.skills.includes(skill) ? C.orangeDim : 'rgba(0,0,0,0.2)', border: `1px solid ${data.skills.includes(skill) ? C.orange : C.border}`, borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: data.skills.includes(skill) ? C.orange : C.muted }}>
                                                    <input type="checkbox" style={{ display: 'none' }} checked={data.skills.includes(skill)} onChange={e => setData('skills', e.target.checked ? [...data.skills, skill] : data.skills.filter(s => s !== skill))} />
                                                    {skill}
                                                </label>
                                            ))}
                                        </div>
                                    </Field>
                                    <Field label="Activities">
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                            {['Hackathons','IT Society','E-Sports','Research Club','Robotics'].map(act => (
                                                <label key={act} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', backgroundColor: data.activities.includes(act) ? C.orangeDim : 'rgba(0,0,0,0.2)', border: `1px solid ${data.activities.includes(act) ? C.orange : C.border}`, borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: data.activities.includes(act) ? C.orange : C.muted }}>
                                                    <input type="checkbox" style={{ display: 'none' }} checked={data.activities.includes(act)} onChange={e => setData('activities', e.target.checked ? [...data.activities, act] : data.activities.filter(a => a !== act))} />
                                                    {act}
                                                </label>
                                            ))}
                                        </div>
                                    </Field>
                                </div>
                            </div>

                            {/* SUBMIT BUTTON */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 32px', borderRadius: 16, background: C.orange, color: '#000', fontWeight: 900, fontSize: 14, border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all .2s' }}
                                >
                                    {processing ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle2 size={18} /> Finalize Submission</>}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-spin { animation: spin 1.s linear infinite; }
                input:focus, select:focus, textarea:focus { border-color: ${C.orange} !important; border-width: 1.5px !important; }
                input::placeholder { color: rgba(254,243,236,0.15); }
                option { background: #1a0f06; }
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: ${C.bg}; }
                ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: ${C.orange}; }
            `}</style>
        </div>
    );
}
