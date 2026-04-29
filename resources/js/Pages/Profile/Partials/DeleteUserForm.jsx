import React from 'react';
import { useForm } from '@inertiajs/react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = React.useState(false);
    const passwordInput = React.useRef();

    const { data, setData, delete: destroy, processing, reset, errors } =
        useForm({
            password: '',
        });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        reset();
    };

    return (
        <section className={className}>
            <p className="text-xs text-primary/60 font-sans leading-relaxed">
                Once your account is deleted, all of its resources and data will be permanently deleted. 
                Before deleting your account, please download any data or information that you wish to retain.
            </p>

            <button
                type="button"
                onClick={confirmUserDeletion}
                className="mt-6 bg-danger/10 text-danger border border-danger/20 hover:bg-danger hover:text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 shadow-sm"
            >
                <Trash2 size={14} />
                Delete Account
            </button>

            {confirmingUserDeletion && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-primary/20 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-danger/10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="bg-danger/10 p-6 text-danger relative flex items-center gap-3">
                            <AlertTriangle size={20} />
                            <h3 className="font-serif text-lg font-black italic">Final Confirmation</h3>
                            <button onClick={closeModal} className="absolute top-6 right-6 opacity-40 hover:opacity-100 transition-opacity">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={deleteUser} className="p-8 space-y-6">
                            <p className="text-xs text-primary/60 font-sans">
                                Are you sure you want to delete your account? Please enter your password to confirm you would like to permanently delete your account.
                            </p>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/30">Current Password</label>
                                <input
                                    type="password"
                                    className="w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-danger/20 outline-none"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter password..."
                                    required
                                />
                                {errors.password && <p className="text-[9px] text-danger font-bold uppercase italic mt-1">{errors.password}</p>}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 bg-background text-primary/40 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-background/80 transition-all font-sans"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-danger text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-danger/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <Trash2 size={14} />
                                    Confirm Delete
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
