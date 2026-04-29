import { Head, Link, useForm } from '@/inertia-adapter';
import { GraduationCap, Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck, User, KeyRound } from 'lucide-react';
import { useState } from 'react';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Outfit:wght@300;400;500;600;700&display=swap');

/* ── Hard-reset everything Breeze injects ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { height: 100%; }
body {
  height: 100%; margin: 0 !important; padding: 0 !important;
  background: #1A0A00 !important;
  font-family: 'Outfit', sans-serif !important;
  overflow: hidden !important;
}
#app {
  height: 100%; width: 100%;
  display: flex; flex-direction: column;
}

:root {
  --amber:    #F97316;
  --amber-lt: #FB923C;
  --amber-dk: #C2410C;
  --white:    #ffffff;
  --ink:      #1A0A00;
  --ink-soft: rgba(26,10,0,0.45);
  --ink-dim:  rgba(26,10,0,0.22);
  --card-bg:  rgba(255,255,255,0.97);
  --input-bg: #FEF3E8;
  --input-bd: #F4D5B8;
  --err:      #DC2626;
}

/* ══════════════════════════════════════
   SINGLE ROOT DIV  .page
══════════════════════════════════════ */
.page {
  position: fixed; inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-family: 'Outfit', sans-serif;
  background: var(--ink);
  overflow: hidden;
  z-index: 0;
}

/* ── Background scene (spans full .page) ── */
.scene {
  position: absolute; inset: 0;
  pointer-events: none; overflow: hidden;
  z-index: 0;
}
.scene-grad {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 80% 70% at 100% -10%, rgba(249,115,22,0.55) 0%, transparent 55%),
    radial-gradient(ellipse 60% 60% at 70%  50%,  rgba(180,60,0,0.30)   0%, transparent 58%),
    radial-gradient(ellipse 55% 55% at  0% 100%,  rgba(40,12,0,0.80)    0%, transparent 60%),
    linear-gradient(155deg, #2a0e00 0%, #100500 55%, #0a0200 100%);
}
.scene-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(249,115,22,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(249,115,22,0.04) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 75%);
}
.scene-ring {
  position: absolute; width: 700px; height: 700px; border-radius: 50%;
  border: 1px solid rgba(249,115,22,0.10);
  top: 50%; left: 50%; transform: translate(-50%,-50%);
  animation: spin-slow 40s linear infinite;
}
.scene-ring::before {
  content: ''; position: absolute; width: 500px; height: 500px; border-radius: 50%;
  border: 1px solid rgba(249,115,22,0.07);
  top: 50%; left: 50%; transform: translate(-50%,-50%);
}
@keyframes spin-slow { to { transform: translate(-50%,-50%) rotate(360deg); } }

.orb { position: absolute; border-radius: 50%; filter: blur(60px); animation: float 8s ease-in-out infinite; }
.orb-1 { width: 300px; height: 300px; background: rgba(249,115,22,0.25); top: -80px; right: 15%; }
.orb-2 { width: 200px; height: 200px; background: rgba(180,60,0,0.20); bottom: 10%; left: 5%; animation-delay: -3s; }
.orb-3 { width: 160px; height: 160px; background: rgba(249,115,22,0.12); top: 50%; right: 30%; animation-delay: -5s; }
@keyframes float { 0%,100%{ transform:translateY(0) scale(1); } 50%{ transform:translateY(-20px) scale(1.04); } }

/* ══════════════════════════════════════
   LEFT COLUMN
══════════════════════════════════════ */
/* ── LEFT COLUMN ── */
.col-left {
  position: relative; z-index: 2;
  display: flex; flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  padding-right: 12%; 
  height: 100%;
  /* no background – inherits .page dark bg */
}

/* Brand – pinned top */
.brand {
  position: absolute; top: 44px; left: 8%;
  display: flex; align-items: center; gap: 14px;
  animation: fade-up 0.6s ease both;
}
.brand-icon {
  width: 46px; height: 46px; background: var(--amber); border-radius: 12px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  box-shadow: 0 0 0 1px rgba(249,115,22,0.3), 0 6px 24px rgba(249,115,22,0.45);
  transition: transform 0.3s, box-shadow 0.3s;
}
.brand-icon:hover { transform: rotate(-8deg) scale(1.08); box-shadow: 0 0 0 1px rgba(249,115,22,0.5), 0 10px 32px rgba(249,115,22,0.55); }
.brand-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 16px; font-weight: 900; font-style: italic;
  color: var(--white); letter-spacing: -0.02em; line-height: 1;
}
.brand-sub {
  font-size: 9px; font-weight: 500; text-transform: uppercase;
  letter-spacing: 0.25em; color: rgba(255,255,255,0.35); margin-top: 3px;
}

/* Social strip – pinned bottom */
.tstrip {
  position: absolute; bottom: 36px; left: 8%; 
  display: flex; align-items: center; gap: 14px;
  padding: 14px 18px; border-radius: 14px;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(8px);
  animation: fade-up 0.6s 0.5s ease both;
}
.avatars { display: flex; }
.av {
  width: 30px; height: 30px; border-radius: 50%;
  border: 2px solid rgba(26,10,0,0.8); margin-left: -8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; color: white;
  background: var(--amber);
}
.av:first-child { margin-left: 0; }
.av-b { background: #92400E; }
.av-c { background: #C2410C; }
.av-d { background: #B45309; }
.ttext { font-size: 12px; color: rgba(255,255,255,0.45); line-height: 1.45; }
.ttext strong { font-weight: 600; color: rgba(255,255,255,0.75); }

/* Hero – vertically centered */
.hero { display: flex; flex-direction: column; }

.eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 10px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.3em; color: rgba(255,255,255,0.32); margin-bottom: 22px;
  animation: fade-up 0.6s 0.12s ease both;
}
.eyebrow::before { content: ''; width: 22px; height: 1.5px; background: linear-gradient(90deg, var(--amber), transparent); flex-shrink: 0; }

.hero-h {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(40px, 4.5vw, 64px); font-weight: 900;
  line-height: 0.93; letter-spacing: -0.04em; margin-bottom: 24px;
  animation: fade-up 0.6s 0.22s ease both;
}
.hw { color: var(--white); display: block; }
.ha { color: var(--amber-lt); display: block; }
.hd { color: rgba(255,255,255,0.20); display: block; font-style: italic; }

.hero-p {
  font-size: 13.5px; font-weight: 300; color: rgba(255,255,255,0.44);
  line-height: 1.8; max-width: 290px; margin-bottom: 34px;
  animation: fade-up 0.6s 0.32s ease both;
}
.hero-p strong { font-weight: 600; color: rgba(255,255,255,0.68); }

.stats { display: flex; animation: fade-up 0.6s 0.42s ease both; }
.st { padding-right: 24px; margin-right: 24px; border-right: 1px solid rgba(255,255,255,0.10); }
.st:last-child { border: none; padding: 0; margin: 0; }
.st-n {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 28px; font-weight: 900; font-style: italic; color: var(--amber-lt); line-height: 1;
}
.st-l { font-size: 9px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.25); margin-top: 4px; }

/* ══════════════════════════════════════
   RIGHT COLUMN
══════════════════════════════════════ */
.col-right {
  position: relative; z-index: 2;
  display: flex; align-items: center; justify-content: flex-start;
  padding-left: 12%;
  height: 100%;
  /* no background – inherits .page dark bg */
}

/* Subtle divider between columns */
.col-right::before {
  content: ''; position: absolute; left: 0; top: 12%; bottom: 12%; width: 1px;
  background: linear-gradient(to bottom, transparent, rgba(249,115,22,0.18) 35%, rgba(249,115,22,0.18) 65%, transparent);
}

/* ══════════════════════════════════════
   CARD
══════════════════════════════════════ */
.card {
  position: relative; background: var(--card-bg); border-radius: 26px;
  padding: 38px 42px 34px; width: 100%; max-width: 430px;
  box-shadow:
    0 0 0 1px rgba(249,115,22,0.14),
    0 4px 12px rgba(0,0,0,0.22),
    0 20px 50px rgba(0,0,0,0.44),
    0 48px 78px rgba(0,0,0,0.26);
  animation: card-in 0.8s 0.1s cubic-bezier(0.22,1,0.36,1) both;
}
@keyframes card-in { from { opacity:0; transform:translateY(22px) scale(0.97); } to { opacity:1; transform:none; } }
.card::before {
  content: ''; position: absolute; top: 0; left: 46px; right: 46px; height: 3px;
  background: linear-gradient(90deg, var(--amber-dk), var(--amber), var(--amber-lt), rgba(249,115,22,0.2));
  border-radius: 0 0 4px 4px;
}

.card-hd { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
.c-pill { display: flex; align-items: center; gap: 7px; margin-bottom: 5px; }
.c-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--amber); }
.c-lbl { font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em; color: var(--ink-soft); }
.c-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 25px; font-weight: 900; font-style: italic; color: var(--ink); letter-spacing: -0.02em; line-height: 1;
}
.live-badge {
  display: flex; align-items: center; gap: 5px; padding: 5px 11px;
  background: rgba(249,115,22,0.08); border: 1px solid rgba(249,115,22,0.22);
  border-radius: 999px; font-size: 9px; font-weight: 600; color: var(--amber-dk);
  white-space: nowrap; flex-shrink: 0; margin-top: 4px;
}
.live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--amber); animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%,100%{ opacity:1; transform:scale(1); } 50%{ opacity:0.3; transform:scale(0.8); } }

.tabs { display: flex; border-bottom: 1.5px solid #EDD9C0; margin-bottom: 16px; }
.tab {
  padding: 7px 0; margin-right: 22px; margin-bottom: -1.5px;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 16px; font-weight: 700; font-style: italic;
  color: rgba(26,10,0,0.26); background: none; border: none;
  border-bottom: 2.5px solid transparent;
  cursor: pointer; text-decoration: none; display: inline-block;
  transition: color 0.18s, border-color 0.18s;
}
.tab.act { color: var(--ink); border-bottom-color: var(--amber); }
.tab:hover:not(.act) { color: rgba(26,10,0,0.55); }

.c-sub {
  font-size: 12px; color: var(--amber-dk); margin-bottom: 18px; line-height: 1.6;
  background: rgba(249,115,22,0.06); border-left: 3px solid var(--amber);
  padding: 7px 11px; border-radius: 0 8px 8px 0;
}

/* Fields */
.fw { position: relative; margin-bottom: 10px; }
.f-lbl { font-size: 9.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: var(--ink-soft); margin-bottom: 5px; display: block; }
.f-icon { position: absolute; left: 13px; bottom: 0; height: 46px; display: flex; align-items: center; color: rgba(26,10,0,0.26); pointer-events: none; }
.finput {
  width: 100%; height: 46px; padding: 0 15px 0 38px;
  border: 1.5px solid var(--input-bd); border-radius: 10px;
  font-size: 13px; font-family: 'Outfit', sans-serif;
  color: var(--ink); background: var(--input-bg); outline: none;
  transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
}
.finput::placeholder { color: rgba(26,10,0,0.26); }
.finput:focus { border-color: var(--amber); background: #fffcf8; box-shadow: 0 0 0 4px rgba(249,115,22,0.10); }
.finput.err { border-color: var(--err); background: #FFF5F5; }
.eyebtn {
  position: absolute; right: 12px; bottom: 0; height: 46px;
  background: none; border: none; cursor: pointer;
  color: rgba(26,10,0,0.26); padding: 0 4px;
  display: flex; align-items: center; transition: color 0.15s;
}
.eyebtn:hover { color: var(--amber-dk); }
.errmsg { font-size: 11px; color: var(--err); margin-top: 4px; padding-left: 3px; }

.opt-row { display: flex; align-items: center; justify-content: space-between; margin: 8px 0 18px; }
.rem { display: flex; align-items: center; gap: 7px; cursor: pointer; }
.rem input[type="checkbox"] { width: 14px; height: 14px; accent-color: var(--amber); cursor: pointer; }
.rem-txt { font-size: 12px; color: var(--ink-soft); user-select: none; }
.fgt { font-size: 12px; font-weight: 500; color: var(--amber-dk); text-decoration: none; transition: color 0.18s; }
.fgt:hover { color: var(--amber); text-decoration: underline; }

.sbtn {
  width: 100%; height: 48px;
  background: linear-gradient(135deg, var(--amber-dk) 0%, var(--amber) 60%, var(--amber-lt) 100%);
  color: white; border: none; border-radius: 11px;
  font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.22em;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
  position: relative; overflow: hidden;
  transition: transform 0.16s, box-shadow 0.18s;
  box-shadow: 0 6px 20px rgba(249,115,22,0.36);
}
.sbtn::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
  opacity: 0; transition: opacity 0.2s;
}
.sbtn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(249,115,22,0.46); }
.sbtn:hover::before { opacity: 1; }
.sbtn:active { transform: translateY(0); }
.sbtn:disabled { opacity: 0.50; cursor: not-allowed; transform: none; box-shadow: none; }

.divider { display: flex; align-items: center; gap: 10px; margin: 16px 0 12px; }
.div-ln { flex: 1; height: 1px; background: #EDD9C0; }
.div-txt { font-size: 10px; font-weight: 500; color: rgba(26,10,0,0.24); text-transform: uppercase; letter-spacing: 0.1em; white-space: nowrap; }

.reg-row { text-align: center; font-size: 12px; color: var(--ink-soft); }
.reg-row a { color: var(--amber-dk); font-weight: 600; text-decoration: none; transition: color 0.18s; }
.reg-row a:hover { color: var(--amber); text-decoration: underline; }

.sec { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 12px; font-size: 10px; color: var(--ink-dim); }

@keyframes fade-up { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }

@media (max-width: 860px) {
  .page { grid-template-columns: 1fr; }
  .col-left { display: none; }
  .col-right { padding: 24px 20px; }
  .col-right::before { display: none; }
  .card { padding: 30px 22px 26px; }
}
`;

export default function Login({ auth, customization = {} }) {
  const [showPw, setShowPw]   = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [tab, setTab]         = useState('login');

  const loginForm = useForm({ email: '', password: '', remember: false });
  const regForm   = useForm({
    registration_code: '', name: '', email: '', password: '', password_confirmation: '',
  });

  const submitLogin = (e) => {
    e.preventDefault();
    if (loginForm.processing) return;
    loginForm.post('/login');
  };

  const submitReg = (e) => {
    e.preventDefault();
    if (regForm.processing) return;
    regForm.post('/register', {
      onFinish: () => regForm.reset('password', 'password_confirmation'),
    });
  };

  // aliases for cleaner template
  const { data, setData, processing, errors } = tab === 'login' ? loginForm : regForm;

  // Dynamic CSS variables from customization
  const primaryColor = customization?.primary || '#F97316';
  const secondaryColor = customization?.secondary || '#C2410C';
  const displayFont = customization?.displayFont || "'Playfair Display', serif";
  const bodyFont = customization?.bodyFont || "'Outfit', sans-serif";
  const monoFont = customization?.monoFont || "'Space Mono', monospace";

  const dynamicCss = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

  /* ── Hard-reset everything Breeze injects ── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { height: 100%; }
  body {
    height: 100%; margin: 0 !important; padding: 0 !important;
    background: #1A0A00 !important;
    font-family: ${bodyFont} !important;
    overflow: hidden !important;
  }
  #app {
    height: 100%; width: 100%;
    display: flex; flex-direction: column;
  }

  :root {
    --amber:    ${primaryColor};
    --amber-lt: ${primaryColor}dd;
    --amber-dk: ${secondaryColor};
    --white:    #ffffff;
    --ink:      #1A0A00;
    --ink-soft: rgba(26,10,0,0.45);
    --ink-dim:  rgba(26,10,0,0.22);
    --card-bg:  rgba(255,255,255,0.97);
    --input-bg: ${primaryColor}08;
    --input-bd: ${primaryColor}33;
    --err:      #DC2626;
  }

  .page {
    position: fixed; inset: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: ${bodyFont};
    background: var(--ink);
    overflow: hidden;
    z-index: 0;
  }

  .scene-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(${primaryColor}0a 1px, transparent 1px),
      linear-gradient(90deg, ${primaryColor}0a 1px, transparent 1px);
    background-size: 72px 72px;
    mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 75%);
  }
  
  .brand-name {
    font-family: ${displayFont};
    font-size: 16px; font-weight: 900; font-style: italic;
    color: var(--white); letter-spacing: -0.02em; line-height: 1;
  }
  
  .hero-h {
    font-family: ${displayFont};
    font-size: clamp(40px, 4.5vw, 64px); font-weight: 900;
    line-height: 0.93; letter-spacing: -0.04em; margin-bottom: 24px;
    animation: fade-up 0.6s 0.22s ease both;
  }
  
  .st-n {
    font-family: ${displayFont};
    font-size: 28px; font-weight: 900; font-style: italic; color: var(--amber-lt); line-height: 1;
  }

  .c-title {
    font-family: ${displayFont};
    font-size: 25px; font-weight: 900; font-style: italic; color: var(--ink); letter-spacing: -0.02em; line-height: 1;
  }
  
  .tab {
    padding: 7px 0; margin-right: 22px; margin-bottom: -1.5px;
    font-family: ${displayFont};
    font-size: 16px; font-weight: 700; font-style: italic;
    color: rgba(26,10,0,0.26); background: none; border: none;
    border-bottom: 2.5px solid transparent;
    cursor: pointer; text-decoration: none; display: inline-block;
    transition: color 0.18s, border-color 0.18s;
  }

  .sbtn {
    width: 100%; height: 48px;
    background: linear-gradient(135deg, var(--amber-dk) 0%, var(--amber) 60%, var(--amber-lt) 100%);
    color: white; border: none; border-radius: 11px;
    font-family: ${bodyFont}; font-size: 11px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.22em;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
    position: relative; overflow: hidden;
    transition: transform 0.16s, box-shadow 0.18s;
    box-shadow: 0 6px 20px ${primaryColor}5c;
  }

  ${css.split('/* ── Background scene (spans full .page) ── */')[1] || ''}
  `;

  return (
    <>
      <Head title={`${tab === 'login' ? 'Login' : 'Sign Up'} | ${customization?.browserTabTitle || 'CCS ProFile'}`} />
      <style>{dynamicCss}</style>

      {/* ── Single root div, no wrapper outside ── */}
      <div className="page">

        {/* Scene */}
        <div className="scene">
          <div className="scene-grad" />
          <div className="scene-grid" />
          <div className="scene-ring" />
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>

        {/* ══ LEFT ══ */}
        <div className="col-left">
          <div className="brand">
            <div className="brand-icon">
              <GraduationCap color="#fff" size={22} />
            </div>
            <div>
              <div className="brand-name">{customization?.deptAbbrev || "CCS"}</div>
              <div className="brand-sub">{customization?.systemTitle || "Profile System"}</div>
            </div>
          </div>

          <div className="hero">
            <p className="eyebrow">Academic Portal</p>
            <h1 className="hero-h">
              <span className="hw">Track Your</span>
              <span className="ha">Academic</span>
              <span className="hd">Journey.</span>
            </h1>
            <p className="hero-p">
              {customization?.deptAbbrev || "CCS"} Profile System centralizes your <strong>student records</strong>,
              performance data, and academic identity — your all-in-one companion
              for navigating college life.
            </p>
          </div>
        </div>

        {/* ══ RIGHT ══ */}
        <div className="col-right">
          <div className="card">
            <div className="card-hd">
              <div>
                <div className="c-pill">
                  <span className="c-dot" />
                  <span className="c-lbl">{customization?.institution || "Pamantasan ng Cabuyao"}</span>
                </div>
                <div className="c-title">Welcome back</div>
              </div>
              <div className="live-badge">
                <span className="live-dot" />
                Portal live
              </div>
            </div>

            <div className="tabs">
              <button type="button" onClick={() => setTab('login')} className={`tab${tab==='login' ? ' act' : ''}`}>Login</button>
              <button type="button" onClick={() => setTab('signup')} className={`tab${tab==='signup' ? ' act' : ''}`}>Sign up</button>
            </div>

            <p className="c-sub">
              {tab === 'login' ? 'Enter your credentials to access the academic portal.' : 'Create your institutional identity using your registration code.'}
            </p>

            {tab === 'login' ? (
              <form onSubmit={submitLogin}>
                <div className="fw">
                  <label className="f-lbl" htmlFor="l-email">Email address</label>
                  <span className="f-icon"><Mail size={14} /></span>
                  <input id="l-email" type="email"
                    className={`finput${loginForm.errors.email ? ' err' : ''}`}
                    placeholder="Email or student number"
                    value={loginForm.data.email}
                    onChange={e => loginForm.setData('email', e.target.value)}
                    autoComplete="username" />
                  {loginForm.errors.email && <p className="errmsg">{loginForm.errors.email}</p>}
                </div>

                <div className="fw">
                  <label className="f-lbl" htmlFor="l-password">Password</label>
                  <span className="f-icon"><Lock size={14} /></span>
                  <input id="l-password" type={showPw ? 'text' : 'password'}
                    className={`finput${loginForm.errors.password ? ' err' : ''}`}
                    placeholder="Password"
                    value={loginForm.data.password}
                    onChange={e => loginForm.setData('password', e.target.value)}
                    autoComplete="current-password" />
                  <button type="button" className="eyebtn" onClick={() => setShowPw(v => !v)}>
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  {loginForm.errors.password && <p className="errmsg">{loginForm.errors.password}</p>}
                </div>

                <div className="opt-row">
                  <label className="rem">
                    <input type="checkbox"
                      checked={loginForm.data.remember}
                      onChange={e => loginForm.setData('remember', e.target.checked)} />
                    <span className="rem-txt">Remember me</span>
                  </label>
                  {route().has('password.request') && (
                    <Link href={route('password.request')} className="fgt">Forgot password?</Link>
                  )}
                </div>

                <button type="submit" className="sbtn" disabled={loginForm.processing}>
                  {loginForm.processing ? 'Signing in…' : 'Get Started'}
                  {!loginForm.processing && <ArrowRight size={14} />}
                </button>
              </form>
            ) : (
              <form onSubmit={submitReg}>
                <div className="fw">
                  <label className="f-lbl" htmlFor="reg-code">Registration Code</label>
                  <span className="f-icon"><KeyRound size={14} /></span>
                  <input id="reg-code" type="text"
                    className={`finput${regForm.errors.registration_code ? ' err' : ''}`}
                    placeholder="Enter your 8-character code"
                    value={regForm.data.registration_code}
                    onChange={e => regForm.setData('registration_code', e.target.value.toUpperCase())}
                    style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                  {regForm.errors.registration_code && <p className="errmsg">{regForm.errors.registration_code}</p>}
                </div>

                <div className="fw">
                  <label className="f-lbl" htmlFor="reg-name">Full Name</label>
                  <span className="f-icon"><User size={14} /></span>
                  <input id="reg-name" type="text"
                    className={`finput${regForm.errors.name ? ' err' : ''}`}
                    placeholder="Juan dela Cruz"
                    value={regForm.data.name}
                    onChange={e => regForm.setData('name', e.target.value)}
                    autoComplete="name" />
                  {regForm.errors.name && <p className="errmsg">{regForm.errors.name}</p>}
                </div>

                <div className="fw">
                  <label className="f-lbl" htmlFor="reg-email">Email address</label>
                  <span className="f-icon"><Mail size={14} /></span>
                  <input id="reg-email" type="email"
                    className={`finput${regForm.errors.email ? ' err' : ''}`}
                    placeholder="identity@ccs.edu"
                    value={regForm.data.email}
                    onChange={e => regForm.setData('email', e.target.value)}
                    autoComplete="username" />
                  {regForm.errors.email && <p className="errmsg">{regForm.errors.email}</p>}
                </div>

                <div className="fw">
                  <label className="f-lbl" htmlFor="reg-pw">Password</label>
                  <span className="f-icon"><Lock size={14} /></span>
                  <input id="reg-pw" type={showPw ? 'text' : 'password'}
                    className={`finput${regForm.errors.password ? ' err' : ''}`}
                    placeholder="••••••••"
                    value={regForm.data.password}
                    onChange={e => regForm.setData('password', e.target.value)}
                    autoComplete="new-password" />
                  <button type="button" className="eyebtn" onClick={() => setShowPw(v => !v)}>
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  {regForm.errors.password && <p className="errmsg">{regForm.errors.password}</p>}
                </div>

                <div className="fw" style={{ marginBottom: 18 }}>
                  <label className="f-lbl" htmlFor="reg-pw2">Confirm Password</label>
                  <span className="f-icon"><Lock size={14} /></span>
                  <input id="reg-pw2" type={showPw2 ? 'text' : 'password'}
                    className="finput"
                    placeholder="••••••••"
                    value={regForm.data.password_confirmation}
                    onChange={e => regForm.setData('password_confirmation', e.target.value)}
                    autoComplete="new-password" />
                  <button type="button" className="eyebtn" onClick={() => setShowPw2(v => !v)}>
                    {showPw2 ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>

                <button type="submit" className="sbtn" disabled={regForm.processing}>
                  {regForm.processing ? 'Creating account…' : 'Create Account'}
                  {!regForm.processing && <ArrowRight size={14} />}
                </button>
              </form>
            )}

            <div className="divider">
              <div className="div-ln" />
              <span className="div-txt">{tab === 'login' ? 'New to the Portal?' : 'Already registered?'}</span>
              <div className="div-ln" />
            </div>

            <p className="reg-row">
              {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button type="button" style={{ background:'none',border:'none',cursor:'pointer',color:'var(--amber-dk)',fontWeight:600,fontSize:'inherit',padding:0 }}
                onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}>
                {tab === 'login' ? 'Apply now →' : 'Sign in →'}
              </button>
            </p>

            <div className="sec">
              <ShieldCheck size={11} />
              Secured with 256-bit SSL encryption
            </div>
          </div>
        </div>

      </div>
    </>
  );
}