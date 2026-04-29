import { Head, Link, useForm } from '@/inertia-adapter';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Outfit:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --amber:    #F97316;
  --amber-lt: #FB923C;
  --amber-dk: #C2410C;
  --white:    #ffffff;
  --ink:      #1A0A00;
  --ink-soft: rgba(26,10,0,0.45);
  --ink-dim:  rgba(26,10,0,0.22);
  --card-bg:  #ffffff;
  --input-bg: #FEF3E8;
  --input-bd: #F4D5B8;
  --err:      #DC2626;
}

.page {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-family: 'Outfit', sans-serif;
  background: var(--ink);
  overflow: hidden;
}

/* ── LEFT COLUMN ── */
.col-left {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 8%;
  height: 100%;
}

.brand {
  position: absolute;
  top: 44px;
  left: 8%;
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-icon {
  width: 46px;
  height: 46px;
  background: var(--amber);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 24px rgba(249,115,22,0.45);
}

.brand-name {
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  font-weight: 900;
  font-style: italic;
  color: var(--white);
  line-height: 1;
}

.brand-sub {
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(255,255,255,0.4);
  margin-top: 4px;
}

.hero {
    max-width: 400px;
}

.hero-h {
  font-family: 'Playfair Display', serif;
  font-size: clamp(40px, 5vw, 64px);
  font-weight: 900;
  line-height: 1;
  color: var(--white);
  margin-bottom: 24px;
}

.hero-h span {
    display: block;
}

.hero-h .accent {
    color: var(--amber-lt);
}

.hero-p {
  font-size: 16px;
  font-weight: 300;
  color: rgba(255,255,255,0.5);
  line-height: 1.6;
}

.social-strip {
  position: absolute;
  bottom: 36px;
  left: 8%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.avatars {
    display: flex;
}

.avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid var(--ink);
    margin-left: -8px;
    background: var(--amber);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    color: white;
}

.avatar:first-child { margin-left: 0; }

.social-text {
    font-size: 12px;
    color: rgba(255,255,255,0.4);
}

/* ── RIGHT COLUMN ── */
.col-right {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.card {
  background: var(--card-bg);
  width: 100%;
  max-width: 420px;
  padding: 48px;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
}

.card-title {
  font-family: 'Playfair Display', serif;
  font-size: 32px;
  font-weight: 900;
  font-style: italic;
  color: var(--ink);
  margin-bottom: 8px;
}

.card-sub {
    font-size: 14px;
    color: var(--ink-soft);
    margin-bottom: 32px;
}

.tabs {
    display: flex;
    gap: 24px;
    border-bottom: 1px solid #eee;
    margin-bottom: 32px;
}

.tab {
    padding-bottom: 12px;
    font-size: 14px;
    font-weight: 600;
    color: var(--ink-dim);
    text-decoration: none;
    position: relative;
}

.tab.active {
    color: var(--amber);
}

.tab.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--amber);
}

/* Form Styles */
.field {
    margin-bottom: 20px;
}

.label {
    display: block;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--ink-soft);
    margin-bottom: 8px;
}

.input-wrapper {
    position: relative;
}

.input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--ink-dim);
}

.input {
    width: 100%;
    height: 50px;
    padding: 0 16px 0 44px;
    background: var(--input-bg);
    border: 1px solid var(--input-bd);
    border-radius: 12px;
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    color: var(--ink);
    outline: none;
    transition: all 0.2s;
}

.input:focus {
    border-color: var(--amber);
    background: white;
    box-shadow: 0 0 0 4px rgba(249,115,22,0.1);
}

.input.error {
    border-color: var(--err);
    background: #fff5f5;
}

.error-msg {
    color: var(--err);
    font-size: 12px;
    margin-top: 6px;
}

.toggle-pw {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--ink-dim);
    cursor: pointer;
    display: flex;
    align-items: center;
}

.row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
}

.remember {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
    color: var(--ink-soft);
}

.remember input {
    accent-color: var(--amber);
}

.forgot {
    font-size: 13px;
    font-weight: 600;
    color: var(--amber);
    text-decoration: none;
}

.btn {
    width: 100%;
    height: 54px;
    background: var(--amber);
    color: white;
    border: none;
    border-radius: 14px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.2s;
    box-shadow: 0 8px 24px rgba(249,115,22,0.3);
}

.btn:hover {
    background: var(--amber-dk);
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(249,115,22,0.4);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

@media (max-width: 900px) {
    .page {
        grid-template-columns: 1fr;
    }
    .col-left {
        display: none;
    }
}
`;

export default function Login({ status, canResetPassword }) {
    const [showPw, setShowPw] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        if (processing) return;
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="page">
            <Head title="Log in" />
            <style>{css}</style>

            <div className="col-left">
                <div className="brand">
                    <div className="brand-icon">
                        <GraduationCap size={24} color="#fff" />
                    </div>
                    <div>
                        <div className="brand-name">CCS</div>
                        <div className="brand-sub">Profile System</div>
                    </div>
                </div>

                <div className="hero">
                    <h1 className="hero-h">
                        <span>The Modern</span>
                        <span className="accent">Academic</span>
                        <span>Experience.</span>
                    </h1>
                    <p className="hero-p">
                        Access your academic records, track progress, and stay connected with the CCS community through our unified portal.
                    </p>
                </div>

                <div className="social-strip">
                    <div className="avatars">
                        <div className="avatar">A</div>
                        <div className="avatar">B</div>
                        <div className="avatar">C</div>
                    </div>
                    <p className="social-text">Joined by 1,200+ students</p>
                </div>
            </div>

            <div className="col-right">
                <div className="card">
                    <div className="card-title">Welcome back</div>
                    <p className="card-sub">Please enter your details to sign in.</p>

                    <nav className="tabs">
                        <span className="tab active">Log in</span>
                        <Link href={route('register')} className="tab">Sign up</Link>
                    </nav>

                    {status && <div className="status-msg">{status}</div>}

                    <form onSubmit={submit}>
                        <div className="field">
                            <label className="label" htmlFor="email">Email or Student Number</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={18} />
                                <input
                                    id="email"
                                    type="text"
                                    className={`input ${errors.email ? 'error' : ''}`}
                                    placeholder="Enter your email or student #"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            {errors.email && <p className="error-msg">{errors.email}</p>}
                        </div>

                        <div className="field">
                            <label className="label" htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} />
                                <input
                                    id="password"
                                    type={showPw ? 'text' : 'password'}
                                    className={`input ${errors.password ? 'error' : ''}`}
                                    placeholder="Enter password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-pw"
                                    onClick={() => setShowPw(!showPw)}
                                >
                                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="error-msg">{errors.password}</p>}
                        </div>

                        <div className="row">
                            <label className="remember">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                Remember me
                            </label>
                            {canResetPassword && (
                                <Link href={route('password.request')} className="forgot">
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <button className="btn" type="submit" disabled={processing}>
                            {processing ? 'Signing in...' : 'Sign in'}
                            {!processing && <ArrowRight size={18} />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
