import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm, Link } from '@inertiajs/react';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';

export default function SectionEdit({ section, teachers }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: section.name,
        grade_level: section.grade_level,
        school_year: section.school_year,
        adviser_id: section.adviser_id,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('sections.update', section.id));
    };

    const FormInput = ({ label, id, type = 'text', value, onChange, error, ...props }) => (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-xs font-sans font-bold text-primary/40 uppercase tracking-widest leading-none">
                {label}
            </label>
            {type === 'select' ? (
                <select
                    id={id}
                    className={`w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all font-sans ${error ? 'ring-2 ring-danger/20' : ''}`}
                    value={value}
                    onChange={onChange}
                    {...props}
                />
            ) : (
                <input
                    id={id}
                    type={type}
                    className={`w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all font-sans ${error ? 'ring-2 ring-danger/20' : ''}`}
                    value={value}
                    onChange={onChange}
                    {...props}
                />
            )}
            {error && <p className="text-[10px] text-danger font-bold mt-1 uppercase italic">{error}</p>}
        </div>
    );

    return (
        <AppLayout title="Edit Section">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href={route('sections.index')} className="text-accent hover:text-primary transition-colors flex items-center gap-1 text-xs font-bold mb-2 uppercase tracking-widest font-sans">
                            <ArrowLeft size={14} /> Back to Sections
                        </Link>
                        <h1 className="text-3xl font-serif font-black text-primary italic">Modify Section</h1>
                        <p className="text-primary/50 font-sans mt-1">Update classification and adviser assignment</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-[#e8e0d4] shadow-subtle space-y-6">
                    <FormInput label="Section Name" id="name" value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput label="Grade Level" id="grade_level" type="select" value={data.grade_level} onChange={e => setData('grade_level', e.target.value)} error={errors.grade_level}>
                            <option value="Grade 7">Grade 7</option>
                            <option value="Grade 8">Grade 8</option>
                            <option value="Grade 9">Grade 9</option>
                            <option value="Grade 10">Grade 10</option>
                        </FormInput>
                        <FormInput label="School Year" id="school_year" value={data.school_year} onChange={e => setData('school_year', e.target.value)} error={errors.school_year} />
                    </div>

                    <FormInput label="Faculty Adviser" id="adviser_id" type="select" value={data.adviser_id} onChange={e => setData('adviser_id', e.target.value)} error={errors.adviser_id}>
                        {teachers.map(teacher => (
                            <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                        ))}
                    </FormInput>

                    <div className="pt-4 flex items-center justify-between border-t border-[#f4f1ec]">
                        <button className="text-danger font-bold text-xs hover:bg-danger/5 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                            <Trash2 size={16} /> Delete Section
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-primary text-white px-8 py-3 rounded-xl font-sans font-bold shadow-lg hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                            <Save size={18} /> Update Designation
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
