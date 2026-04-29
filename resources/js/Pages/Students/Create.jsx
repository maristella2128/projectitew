import React, { useState, useEffect, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm, Link, usePage, Head } from '@inertiajs/react';
import {
    Save, ArrowLeft, User, Phone, BookOpen,
    GraduationCap, Search, ShieldCheck, Copy,
    ClipboardCheck, Loader2, AlertCircle, ArrowRight,
    ChevronDown, CheckCircle2, X
} from 'lucide-react';
import axios from 'axios';

// ─── Local debounce ───────────────────────────────────────────────────
function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// ─── Palette ──────────────────────────────────────────────────────────
const C = {
    bg: '#0c0805', card: '#160e08', border: '#2a1508',
    orange: '#f97316', orangeDim: 'rgba(249,115,22,0.1)',
    text: '#fef3ec', muted: 'rgba(254,243,236,0.3)',
    dim: 'rgba(254,243,236,0.15)',
};

export default function StudentCreate() {
    const { flash } = usePage().props;

    const [searchQuery, setSearchQuery]       = useState('');
    const [applicants, setApplicants]         = useState([]);
    const [searching, setSearching]           = useState(false);
    const [showDropdown, setShowDropdown]     = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [sections, setSections]             = useState([]);
    const [loadingSections, setLoadingSections] = useState(false);
    const [copied, setCopied]                 = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        application_id: '', lrn: '', first_name: '', last_name: '',
        middle_name: '', email: '', birthdate: '', gender: '',
        address: '', guardian_name: '', guardian_contact: '',
        guardian_relationship: '', grade_level: '', section_id: '',
        enrollment_status: 'enrolled',
        school_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        skills: [], activities: [],
    });

    // ── Search ──────────────────────────────────────────────────────────
    const fetchAll = async (q = '') => {
        setSearching(true);
        try {
            const res = await axios.get(route('admissions.search'), { params: { q } });
            setApplicants(res.data);
        } catch { setApplicants([]); }
        finally { setSearching(false); }
    };

    const debouncedFetch = useMemo(() => debounce(fetchAll, 300), []);

    useEffect(() => { fetchAll(''); }, []);
    useEffect(() => { debouncedFetch(searchQuery); }, [searchQuery]);

    // ── Selection ───────────────────────────────────────────────────────
    const handleSelect = async (app) => {
        setShowDropdown(false);
        setSearchQuery(`${app.first_name} ${app.last_name}`);
        setSelectedApplicant(app);
        setData(prev => ({
            ...prev, application_id: app.id,
            first_name: app.first_name, last_name: app.last_name,
            email: app.email, grade_level: app.year_level_applied, section_id: '',
        }));
        setLoadingSections(true);
        try {
            const res = await axios.get(route('sections.index'), { params: { grade_level_id: app.year_level_applied } });
            setSections(res.data);
        } catch { setSections([]); }
        finally { setLoadingSections(false); }
    };

    const clearSelection = () => {
        setSelectedApplicant(null);
        setSearchQuery('');
        setSections([]);
        setData(prev => ({
            ...prev, application_id: '', first_name: '', last_name: '',
            email: '', grade_level: '', section_id: '',
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admissions.enroll', data.application_id));
    };

    const copyCode = () => {
        navigator.clipboard.writeText(flash.registration_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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

    const inputStyle = (hasError) => ({
        width: '100%', backgroundColor: 'rgba(0,0,0,0.3)',
        border: `1.5px solid ${hasError ? '#f87171' : C.border}`,
        borderRadius: 12, padding: '11px 14px', color: C.text,
        fontSize: 13, fontWeight: 600, outline: 'none',
        boxSizing: 'border-box', transition: 'border-color .15s',
    });

    const selectStyle = (hasError) => ({
        ...inputStyle(hasError), appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23f97316' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
        paddingRight: 38,
    });

    const readonlyStyle = {
        ...inputStyle(false),
        backgroundColor: C.orangeDim,
        border: `1.5px solid rgba(249,115,22,0.25)`,
        color: 'rgba(254,243,236,0.6)',
        cursor: 'not-allowed',
    };

    const CardHeader = ({ icon: Icon, title, subtitle }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ padding: 8, borderRadius: 10, background: C.orangeDim, color: C.orange, flexShrink: 0 }}>
                <Icon size={16} />
            </div>
            <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.text, letterSpacing: '-0.02em' }}>{title}</div>
                {subtitle && <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>{subtitle}</div>}
            </div>
        </div>
    );

    const card = { backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, marginBottom: 16 };
    const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };
    const grid3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 };
    const ErrMsg = ({ msg }) => msg ? <div style={{ fontSize: 10, color: '#fca5a5', fontWeight: 700, textTransform: 'uppercase', marginTop: 5 }}>{msg}</div> : null;

    // ── SUCCESS SCREEN ──────────────────────────────────────────────────
    if (flash.enrollment_success && flash.registration_code) {
        return (
            <AppLayout title="Enrollment Complete" noPadding>
                <Head title="Enrollment Complete" />
                <div style={{ minHeight: '100vh', backgroundColor: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                    <div style={{ maxWidth: 520, width: '100%', backgroundColor: C.card, border: '1px solid rgba(52,211,153,0.2)', borderRadius: 28, padding: 48, textAlign: 'center' }}>
                        <div style={{ width: 72, height: 72, borderRadius: 20, backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 40px rgba(16,185,129,0.3)' }}>
                            <ShieldCheck size={36} color="#000" />
                        </div>
                        <h1 style={{ fontSize: 28, fontWeight: 900, fontStyle: 'italic', fontFamily: 'serif', color: '#fff', marginBottom: 8 }}>{flash.enrollment_success}</h1>
                        <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6, marginBottom: 36 }}>
                            Share this registration code with the student. It expires in 7 days.
                        </p>
                        <div style={{ backgroundColor: '#000', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 20, padding: 32, marginBottom: 24 }}>
                            <div style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#10b981', marginBottom: 12 }}>Registration OTP</div>
                            <div style={{ fontSize: 52, fontWeight: 900, fontFamily: 'monospace', letterSpacing: '0.2em', color: '#34d399', marginBottom: 20, textShadow: '0 0 20px rgba(52,211,153,0.4)' }}>
                                {flash.registration_code}
                            </div>
                            <button onClick={copyCode} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, border: '1px solid rgba(52,211,153,0.3)', background: copied ? '#10b981' : 'rgba(16,185,129,0.1)', color: copied ? '#000' : '#10b981', fontWeight: 900, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', transition: 'all .2s' }}>
                                {copied ? <ClipboardCheck size={14} /> : <Copy size={14} />}
                                {copied ? 'Copied!' : 'Copy Code'}
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                            <button onClick={() => { reset(); setSelectedApplicant(null); setSearchQuery(''); }} style={{ padding: '12px 20px', borderRadius: 12, background: C.orangeDim, color: C.orange, border: `1px solid rgba(249,115,22,0.2)`, fontWeight: 800, fontSize: 12, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Enroll Another
                            </button>
                            <Link href={route('students.index')} style={{ padding: '12px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', color: C.text, border: `1px solid ${C.border}`, fontWeight: 800, fontSize: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Back to Registry
                            </Link>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout title="Enroll New Student" noPadding>
            <Head title="Enroll Student" />

            <div style={{ minHeight: '100vh', backgroundColor: C.bg, color: C.text, fontFamily: 'Inter, sans-serif' }}>
                {/* Background grid */}
                <div style={{ position: 'fixed', inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: '40px 40px', opacity: 0.07, pointerEvents: 'none', zIndex: 0 }} />

                <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>

                    {/* ── HEADER ── */}
                    <div style={{ marginBottom: 40 }}>
                        <Link href={route('students.index')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: C.orange, textDecoration: 'none', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>
                            <ArrowLeft size={12} /> Back to Registry
                        </Link>
                        <h1 style={{ fontSize: 40, fontWeight: 900, fontStyle: 'italic', fontFamily: 'Georgia, serif', letterSpacing: '-0.02em', color: C.text, margin: 0, lineHeight: 1.1 }}>
                            Enrollment <span style={{ color: C.orange }}>Intelligence</span>
                        </h1>
                        <p style={{ color: C.muted, fontSize: 14, marginTop: 8, lineHeight: 1.5 }}>
                            Search an accepted applicant to build their student profile and generate their registration code
                        </p>
                    </div>

                    {/* ── STEP INDICATOR ── */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
                        {[
                            { n: 1, label: 'Select Applicant', done: !!selectedApplicant },
                            { n: 2, label: 'Complete Profile', done: false },
                        ].map((step, i) => (
                            <React.Fragment key={step.n}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: step.done ? C.orange : (i === 0 ? C.orangeDim : 'rgba(255,255,255,0.05)'), border: `2px solid ${step.done ? C.orange : (i === 0 ? 'rgba(249,115,22,0.4)' : C.border)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {step.done ? <CheckCircle2 size={14} color="#000" /> : <span style={{ fontSize: 11, fontWeight: 900, color: i === 0 ? C.orange : C.muted }}>{step.n}</span>}
                                    </div>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: step.done ? C.orange : C.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{step.label}</span>
                                </div>
                                {i < 1 && <div style={{ flex: 1, height: 1, backgroundColor: selectedApplicant ? C.orange : C.border, maxWidth: 60 }} />}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* ── SEARCH CARD ── */}
                    <div style={{ ...card, overflow: 'visible', position: 'relative', zIndex: 100 }}>
                        <CardHeader icon={Search} title="Step 1 — Select Applicant" subtitle="Search among accepted applications" />

                        {/* Selected badge */}
                        {selectedApplicant ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', backgroundColor: C.orangeDim, border: `1.5px solid rgba(249,115,22,0.3)`, borderRadius: 14 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: C.orange, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontStyle: 'italic', fontFamily: 'serif', fontSize: 16, flexShrink: 0 }}>
                                    {selectedApplicant.first_name[0]}{selectedApplicant.last_name[0]}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 800, color: C.text, fontSize: 14 }}>{selectedApplicant.first_name} {selectedApplicant.last_name}</div>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', marginTop: 2 }}>{selectedApplicant.email} · {selectedApplicant.year_level_applied}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    <CheckCircle2 size={14} /> Selected
                                </div>
                                <button onClick={clearSelection} style={{ padding: 6, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: 'none', color: C.muted, cursor: 'pointer', display: 'flex' }}>
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <div style={{ position: 'relative' }}>
                                {/* Search input */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, backgroundColor: 'rgba(0,0,0,0.4)', border: `1.5px solid ${showDropdown ? C.orange : C.border}`, borderRadius: 14, padding: '12px 16px', transition: 'border-color .2s' }}>
                                    <Search size={16} color={showDropdown ? C.orange : C.muted} style={{ flexShrink: 0 }} />
                                    <input
                                        type="text"
                                        placeholder="Click here to see all accepted applicants, or type to filter..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        onFocus={() => setShowDropdown(true)}
                                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                        style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: C.text, fontSize: 14, fontWeight: 500 }}
                                    />
                                    {searching
                                        ? <Loader2 size={16} color={C.orange} style={{ flexShrink: 0, animation: 'spin 1s linear infinite' }} />
                                        : <ChevronDown size={16} color={C.muted} style={{ flexShrink: 0 }} />
                                    }
                                </div>

                                {/* Dropdown */}
                                {showDropdown && (
                                    <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, backgroundColor: '#1a0f06', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.7)', zIndex: 999 }}>
                                        {applicants.length === 0 ? (
                                            <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                                <AlertCircle size={28} color={C.muted} />
                                                <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>No accepted applicants found</span>
                                            </div>
                                        ) : applicants.map(app => (
                                            <button
                                                key={app.id}
                                                onMouseDown={() => handleSelect(app)}
                                                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: 'none', border: 'none', borderBottom: `1px solid ${C.border}`, color: C.text, textAlign: 'left', cursor: 'pointer', transition: 'background .15s' }}
                                                onMouseEnter={e => e.currentTarget.style.background = C.orangeDim}
                                                onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                            >
                                                <div style={{ width: 36, height: 36, borderRadius: 9, background: C.orangeDim, color: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontStyle: 'italic', fontFamily: 'serif', fontSize: 14, flexShrink: 0 }}>
                                                    {app.first_name[0]}{app.last_name[0]}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{app.first_name} {app.last_name}</div>
                                                    <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {app.email} · {app.year_level_applied}
                                                    </div>
                                                </div>
                                                <ArrowRight size={14} color={C.orange} style={{ flexShrink: 0, opacity: 0.6 }} />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── ENROLLMENT FORM ── */}
                    <form onSubmit={handleSubmit}>

                        {!selectedApplicant && (
                            <div style={{ textAlign: 'center', padding: '40px 24px', color: C.muted, fontSize: 13, fontWeight: 600, backgroundColor: C.card, border: `1px dashed ${C.border}`, borderRadius: 20, marginBottom: 16 }}>
                                <GraduationCap size={36} color={C.border} style={{ margin: '0 auto 12px' }} />
                                Select an accepted applicant above to fill out the enrollment form
                            </div>
                        )}

                        {selectedApplicant && (
                            <>
                                {/* ── IDENTITY ── */}
                                <div style={card}>
                                    <CardHeader icon={User} title="Student Identity" subtitle="Basic personal information" />
                                    <div style={{ ...grid3, marginBottom: 16 }}>
                                        <Field label="First Name">
                                            <input style={readonlyStyle} value={data.first_name} readOnly />
                                        </Field>
                                        <Field label="Last Name">
                                            <input style={readonlyStyle} value={data.last_name} readOnly />
                                        </Field>
                                        <Field label="Middle Name">
                                            <input style={inputStyle(errors.middle_name)} value={data.middle_name} onChange={e => setData('middle_name', e.target.value)} placeholder="Optional" />
                                            <ErrMsg msg={errors.middle_name} />
                                        </Field>
                                    </div>
                                    <div style={grid2}>
                                        <Field label="LRN (12 digits)">
                                            <input style={inputStyle(errors.lrn)} value={data.lrn} onChange={e => setData('lrn', e.target.value)} placeholder="Optional" />
                                            <ErrMsg msg={errors.lrn} />
                                        </Field>
                                        <Field label="Official Email">
                                            <input style={readonlyStyle} value={data.email} readOnly />
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

                                {/* ── ACADEMIC PLACEMENT ── */}
                                <div style={card}>
                                    <CardHeader icon={GraduationCap} title="Academic Placement" subtitle="Assign section and school year" />
                                    <div style={grid3}>
                                        <Field label="Year Level (from application)">
                                            <input style={readonlyStyle} value={data.grade_level} readOnly />
                                        </Field>
                                        <Field label="Section / Block">
                                            <select style={selectStyle(errors.section_id)} value={data.section_id} onChange={e => setData('section_id', e.target.value)}>
                                                <option value="">{loadingSections ? 'Loading sections...' : 'Select Section'}</option>
                                                {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </select>
                                            {!loadingSections && sections.length === 0 && (
                                                <div style={{ fontSize: 10, color: '#fca5a5', fontWeight: 700, textTransform: 'uppercase', marginTop: 5 }}>No sections for this year level. Create one first.</div>
                                            )}
                                            <ErrMsg msg={errors.section_id} />
                                        </Field>
                                        <Field label="School Year">
                                            <input style={inputStyle(errors.school_year)} value={data.school_year} onChange={e => setData('school_year', e.target.value)} />
                                            <ErrMsg msg={errors.school_year} />
                                        </Field>
                                    </div>
                                </div>

                                {/* ── GUARDIAN ── */}
                                <div style={card}>
                                    <CardHeader icon={Phone} title="Guardian Information" subtitle="Emergency contact details" />
                                    <div style={grid2}>
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
                                            <textarea style={{ ...inputStyle(errors.address), minHeight: 80, resize: 'vertical' }} value={data.address} onChange={e => setData('address', e.target.value)} />
                                            <ErrMsg msg={errors.address} />
                                        </Field>
                                    </div>
                                </div>

                                {/* ── SKILLS & ACTIVITIES ── */}
                                <div style={card}>
                                    <CardHeader icon={BookOpen} title="Skills & Activities" subtitle="Optional — extracurricular profile" />
                                    <div style={grid2}>
                                        <Field label="Skills">
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                                {['Basketball','Programming','Singing','Drawing','Dancing','Chess'].map(skill => (
                                                    <label key={skill} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', backgroundColor: data.skills?.includes(skill) ? C.orangeDim : 'rgba(0,0,0,0.2)', border: `1px solid ${data.skills?.includes(skill) ? 'rgba(249,115,22,0.4)' : C.border}`, borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: data.skills?.includes(skill) ? C.orange : C.muted, transition: 'all .15s' }}>
                                                        <input type="checkbox" style={{ display: 'none' }}
                                                            checked={data.skills?.includes(skill)}
                                                            onChange={e => setData('skills', e.target.checked ? [...(data.skills||[]), skill] : (data.skills||[]).filter(s => s !== skill))}
                                                        />
                                                        {skill}
                                                    </label>
                                                ))}
                                            </div>
                                        </Field>
                                        <Field label="Activities">
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                                {['Student Council','Science Club','Sports','Arts & Culture'].map(act => (
                                                    <label key={act} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', backgroundColor: data.activities?.includes(act) ? C.orangeDim : 'rgba(0,0,0,0.2)', border: `1px solid ${data.activities?.includes(act) ? 'rgba(249,115,22,0.4)' : C.border}`, borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: data.activities?.includes(act) ? C.orange : C.muted, transition: 'all .15s' }}>
                                                        <input type="checkbox" style={{ display: 'none' }}
                                                            checked={data.activities?.includes(act)}
                                                            onChange={e => setData('activities', e.target.checked ? [...(data.activities||[]), act] : (data.activities||[]).filter(a => a !== act))}
                                                        />
                                                        {act}
                                                    </label>
                                                ))}
                                            </div>
                                        </Field>
                                    </div>
                                </div>

                                {/* ── SUBMIT BAR ── */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 20 }}>
                                    <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>
                                        Enrolling: <strong style={{ color: C.text }}>{data.first_name} {data.last_name}</strong>
                                    </div>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <Link href={route('students.index')} style={{ padding: '12px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', color: C.muted, border: `1px solid ${C.border}`, fontWeight: 700, fontSize: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                            Discard
                                        </Link>
                                        <button type="submit" disabled={processing || !data.section_id} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, background: data.section_id ? C.orange : 'rgba(249,115,22,0.3)', color: '#000', fontWeight: 900, fontSize: 12, border: 'none', cursor: data.section_id ? 'pointer' : 'not-allowed', textTransform: 'uppercase', letterSpacing: '0.08em', transition: 'all .2s', boxShadow: data.section_id ? '0 8px 24px rgba(249,115,22,0.3)' : 'none' }}>
                                            {processing ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Enrolling...</> : <><Save size={14} /> Finalize Enrollment</>}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                input::placeholder { color: rgba(254,243,236,0.2); }
                input:focus, select:focus, textarea:focus { border-color: rgba(249,115,22,0.6) !important; box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
                option { background: #1c1208; }
            `}</style>
        </AppLayout>
    );
}
