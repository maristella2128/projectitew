import React from 'react';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { Save, CheckCircle, Key } from 'lucide-react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = React.useRef();
    const currentPasswordInput = React.useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } =
        useForm({
            current_password: '',
            password: '',
            password_confirmation: '',
        });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (currentPasswordInput) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/30">Current Password</label>
                        <input
                            type="password"
                            className="w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent/20 outline-none"
                            value={data.current_password}
                            ref={currentPasswordInput}
                            onChange={(e) => setData('current_password', e.target.value)}
                            autoComplete="current-password"
                        />
                        {errors.current_password && <p className="text-[9px] text-danger font-bold uppercase italic mt-1">{errors.current_password}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/30">New Password</label>
                        <input
                            type="password"
                            className="w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent/20 outline-none"
                            value={data.password}
                            ref={passwordInput}
                            onChange={(e) => setData('password', e.target.value)}
                            autoComplete="new-password"
                        />
                        {errors.password && <p className="text-[9px] text-danger font-bold uppercase italic mt-1">{errors.password}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/30">Confirm New Password</label>
                        <input
                            type="password"
                            className="w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent/20 outline-none"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            autoComplete="new-password"
                        />
                        {errors.password_confirmation && <p className="text-[9px] text-danger font-bold uppercase italic mt-1">{errors.password_confirmation}</p>}
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-[#f4f1ec]">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-primary text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-primary/95 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {processing ? 'Processing...' : <><Key size={14} /> Update Password</>}
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
                            Password Updated
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
