import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Calendar, User, Clock, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

export default function History({ attendance, student }) {
    const statusMap = {
        present: { color: 'text-success', bg: 'bg-success/10', icon: CheckCircle, label: 'Present' },
        absent: { color: 'text-danger', bg: 'bg-danger/10', icon: XCircle, label: 'Absent' },
        late: { color: 'text-accent', bg: 'bg-accent/10', icon: Clock, label: 'Late' },
        excused: { color: 'text-primary/60', bg: 'bg-primary/5', icon: Info, label: 'Excused' },
    };

    return (
        <AppLayout title="Attendance History">
            <div className="space-y-8 max-w-5xl mx-auto pb-24">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-serif font-black text-primary italic uppercase tracking-tight">Attendance Log</h1>
                        <p className="text-primary/50 font-sans mt-1">Detailed history for {student?.first_name} {student?.last_name}</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] border border-[#e8e0d4] shadow-subtle overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-background/30 border-b border-[#f4f1ec]">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">Date</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">Recorded By</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f4f1ec]">
                                {attendance.data.map((record) => {
                                    const StatusIcon = statusMap[record.status]?.icon || AlertCircle;
                                    return (
                                        <tr key={record.id} className="hover:bg-background/20 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-background rounded-xl text-primary/40">
                                                        <Calendar size={16} />
                                                    </div>
                                                    <span className="font-sans text-sm font-bold text-primary">
                                                        {new Date(record.date).toLocaleDateString('en-US', { 
                                                            weekday: 'long', 1: 'numeric', month: 'long', day: 'numeric', year: 'numeric' 
                                                        })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${statusMap[record.status]?.bg} ${statusMap[record.status]?.color} text-[10px] font-black uppercase tracking-widest`}>
                                                    <StatusIcon size={12} />
                                                    {statusMap[record.status]?.label}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-black text-accent uppercase">
                                                        {record.recorder?.name.charAt(0)}
                                                    </div>
                                                    <span className="text-xs text-primary/60 font-medium">{record.recorder?.name}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {attendance.data.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-8 py-12 text-center text-primary/30 font-serif italic text-lg">
                                            No attendance records found yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
