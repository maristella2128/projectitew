import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { User, Shield, Key, AlertTriangle } from 'lucide-react';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AppLayout title="Account Settings">
            <div className="space-y-10 max-w-5xl mx-auto pb-24">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-black text-primary italic">Account Persona</h1>
                        <p className="text-primary/50 font-sans mt-1">Manage your digital identity and security credentials</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12">
                    {/* Information Section */}
                    <section className="bg-white rounded-3xl border border-[#e8e0d4] shadow-subtle overflow-hidden">
                        <div className="bg-background/30 p-6 border-b border-[#f4f1ec] flex items-center gap-3">
                            <User size={20} className="text-accent" />
                            <h3 className="font-serif text-lg font-bold text-primary italic">Identity Details</h3>
                        </div>
                        <div className="p-8">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>
                    </section>

                    {/* Security Section */}
                    <section className="bg-white rounded-3xl border border-[#e8e0d4] shadow-subtle overflow-hidden">
                        <div className="bg-background/30 p-6 border-b border-[#f4f1ec] flex items-center gap-3">
                            <Key size={20} className="text-accent" />
                            <h3 className="font-serif text-lg font-bold text-primary italic">Security Credentials</h3>
                        </div>
                        <div className="p-8">
                            <UpdatePasswordForm className="max-w-xl" />
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <section className="bg-danger/5 rounded-3xl border border-danger/10 overflow-hidden">
                        <div className="bg-danger/10 p-6 border-b border-danger/20 flex items-center gap-3">
                            <AlertTriangle size={20} className="text-danger" />
                            <h3 className="font-serif text-lg font-bold text-danger italic">Danger Zone</h3>
                        </div>
                        <div className="p-8">
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
