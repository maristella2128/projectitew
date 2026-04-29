import React from 'react';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/30">Full Name</label>
                        <input
                            type="text"
                            className="w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent/20 outline-none font-sans"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                        />
                        {errors.name && <p className="text-[9px] text-danger font-bold uppercase italic mt-1">{errors.name}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/30">Email Address</label>
                        <input
                            type="email"
                            className="w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent/20 outline-none font-sans"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />
                        {errors.email && <p className="text-[9px] text-danger font-bold uppercase italic mt-1">{errors.email}</p>}
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="bg-accent/5 border border-accent/20 p-4 rounded-2xl flex items-start gap-3">
                        <AlertCircle className="text-accent shrink-0" size={18} />
                        <div>
                            <p className="text-xs text-primary/70 font-sans">Your email address is currently unverified.</p>
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="text-[10px] font-black uppercase tracking-widest text-accent hover:text-accent/80 transition-colors mt-1"
                            >
                                Re-send Verification Email
                            </Link>
                            {status === 'verification-link-sent' && (
                                <p className="text-[9px] text-success font-bold mt-2">A new verification link has been sent to your email.</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t border-[#f4f1ec]">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-primary text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-primary/95 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {processing ? 'Processing...' : <><Save size={14} /> Update Identity</>}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-x-4"
                        enterTo="opacity-100 translate-x-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0 translate-x-4"
                    >
                        <div className="flex items-center gap-2 text-success font-bold text-[10px] uppercase tracking-widest">
                            <CheckCircle size={14} />
                            Changes Saved Successfully
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
