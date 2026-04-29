import Checkbox from '@/Components/Checkbox';
import { Head, Link, useForm } from '@inertiajs/react';
import { GraduationCap, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        registration_code: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Enroll | CCS Profile System" />

            <div className="text-center mb-8">
                <h1 className="font-serif text-2xl font-black text-primary italic uppercase tracking-tighter leading-none mb-2 text-balance">Join CCS</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">Create your CCS Identity</p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Registration Code</label>
                    <div className="relative">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                        <input
                            id="registration_code"
                            value={data.registration_code}
                            className="w-full bg-background border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all placeholder:text-primary/10 uppercase"
                            onChange={(e) => setData('registration_code', e.target.value)}
                            placeholder="Enter your 8-character code"
                            required
                        />
                    </div>
                    {errors.registration_code && <p className="text-[8px] font-black uppercase tracking-widest text-danger ml-4">{errors.registration_code}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Full Identity</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                        <input
                            id="name"
                            value={data.name}
                            className="w-full bg-background border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all placeholder:text-primary/10"
                            autoComplete="name"
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Professor John Doe"
                            required
                        />
                    </div>
                    {errors.name && <p className="text-[8px] font-black uppercase tracking-widest text-danger ml-4">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Registry Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            className="w-full bg-background border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all placeholder:text-primary/10"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="identity@ccs.edu"
                            required
                        />
                    </div>
                    {errors.email && <p className="text-[8px] font-black uppercase tracking-widest text-danger ml-4">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Secure Key</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                className="w-full bg-background border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {errors.password && <p className="text-[8px] font-black uppercase tracking-widest text-danger ml-4">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Confirm Key</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                            <input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                className="w-full bg-background border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 space-y-4">
                    <button 
                        className="w-full group bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
                        disabled={processing}
                    >
                        Initialize Identity
                        <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} />
                    </button>

                    <div className="text-center">
                        <Link
                            href={route('login')}
                            className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
                        >
                            Return to Authentication
                        </Link>
                    </div>
                </div>

                <div className="pt-6 flex items-center justify-center gap-2 text-primary/10 border-t border-[#f4f1ec]">
                    <ShieldCheck size={12} />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">CCS Core Identity Protocol</span>
                </div>
            </form>
        </GuestLayout>
    );
}
