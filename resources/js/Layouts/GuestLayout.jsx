import { GraduationCap } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#fcfaf7] selection:bg-accent selection:text-white flex flex-col items-center justify-center p-8 font-sans overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-50"></div>

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block group">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                            <GraduationCap className="text-accent" size={24} />
                        </div>
                    </Link>
                </div>

                <div className="bg-white p-10 rounded-[40px] shadow-3xl border border-[#e8e0d4]">
                    {children}
                </div>
            </div>
        </div>
    );
}
