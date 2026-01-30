import React, { useState } from 'react';
import { Download, Loader2, Save, Trash, Plus, LayoutTemplate, Briefcase, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { downloadPDF } from '../utils/helpers';

const ResumeBuilder = ({ builderData, setBuilderData, saveResume, loading }) => {
    const [template, setTemplate] = useState('modern');

    // --- DOCX GENERATION (The "100% Success" Fix) ---
    const generateDocx = () => {
        // Shared styles for paragraphs
        // Harvard style usually implies Serif font, but docx default is Calibri.
        // We can force fonts but standard "Heading 1" etc is safest for ATS.

        let docChildren = [];

        // --- HARVARD / PROFESSIONAL STYLE (Strict ATS) ---
        if (template === 'harvard' || template === 'professional') {
            docChildren = [
                // Name (Centered, Caps)
                new Paragraph({
                    text: (builderData.personal.fullName || "Your Name").toUpperCase(),
                    heading: HeadingLevel.TITLE,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 100 }
                }),
                // Contact Info (Centered, Single Line)
                new Paragraph({
                    text: `${builderData.personal.location} | ${builderData.personal.phone} | ${builderData.personal.email}`,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 300 },
                    border: { bottom: { style: BorderStyle.SINGLE, size: 6, space: 1, color: "000000" } }
                }),

                // Summary
                ...(builderData.personal.bio ? [
                    new Paragraph({ text: "PROFESSIONAL SUMMARY", heading: HeadingLevel.HEADING_2 }),
                    new Paragraph({ text: builderData.personal.bio }),
                    new Paragraph({ text: "" })
                ] : []),

                // Experience
                new Paragraph({ text: "EXPERIENCE", heading: HeadingLevel.HEADING_2 }),
                ...builderData.experience.map(exp =>
                    new Paragraph({
                        children: [
                            new TextRun({ text: exp.company, bold: true }),
                            new TextRun({ text: `  |  ${exp.role}`, italics: true }),
                            new TextRun({ text: `   (${exp.period})` })
                        ]
                    })
                ).flatMap(p => [p,
                    // Add details as separate paragraphs or one big one? 
                    // Let's rely on finding details in the builder data.
                    // We need to map details.
                    ...builderData.experience.map(e => new Paragraph({ text: e.details })),
                    new Paragraph({ text: "" })
                ]),
                // (Note: The map above is slightly bugged in logic, let's fix the flatMap structure below)
            ];

            // CORRECTED LOOP FOR DOCX
            docChildren = [
                new Paragraph({
                    text: (builderData.personal.fullName || "Your Name").toUpperCase(),
                    heading: HeadingLevel.TITLE,
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    text: `${builderData.personal.location} | ${builderData.personal.phone} | ${builderData.personal.email}`,
                    alignment: AlignmentType.CENTER,
                    border: { bottom: { style: BorderStyle.SINGLE, size: 6, space: 4, color: "000000" } },
                    spacing: { after: 200 }
                }),
                new Paragraph({ text: "" }),

                // Summary
                ...(builderData.personal.bio ? [
                    new Paragraph({ text: "PROFESSIONAL SUMMARY", heading: HeadingLevel.HEADING_2 }),
                    new Paragraph({ text: builderData.personal.bio, spacing: { after: 200 } }),
                ] : []),

                // Experience
                new Paragraph({ text: "EXPERIENCE", heading: HeadingLevel.HEADING_2 }),
                ...builderData.experience.flatMap(exp => [
                    new Paragraph({
                        children: [
                            new TextRun({ text: exp.company.toUpperCase(), bold: true }),
                            new TextRun({ text: ` - ${exp.role}`, bold: true }),
                            new TextRun({ text: `\t${exp.period}`, italics: true }) // Tab requires setting tab stops in properties, ignoring for simple MVP
                        ]
                    }),
                    new Paragraph({ text: exp.details, bullet: { level: 0 } }),
                    new Paragraph({ text: "" })
                ]),

                // Education
                new Paragraph({ text: "EDUCATION", heading: HeadingLevel.HEADING_2 }),
                ...builderData.education.flatMap(edu => [
                    new Paragraph({
                        children: [
                            new TextRun({ text: edu.school, bold: true }),
                            new TextRun({ text: `, ${edu.degree}` }),
                            new TextRun({ text: ` (${edu.year})` })
                        ]
                    })
                ]),
                new Paragraph({ text: "" }),

                // Skills
                new Paragraph({ text: "SKILLS & INTERESTS", heading: HeadingLevel.HEADING_2 }),
                new Paragraph({ text: builderData.skills })
            ];
        } else {
            // Modern / Default Simple
            docChildren = [
                new Paragraph({
                    text: builderData.personal.fullName,
                    heading: HeadingLevel.TITLE,
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    text: `${builderData.personal.email} | ${builderData.personal.phone}`,
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({ text: "" }),
                new Paragraph({ text: "Summary", heading: HeadingLevel.HEADING_2 }),
                new Paragraph({ text: builderData.personal.bio }),
                new Paragraph({ text: "" }),
                new Paragraph({ text: "Experience", heading: HeadingLevel.HEADING_2 }),
                ...builderData.experience.flatMap(exp => [
                    new Paragraph({ text: `${exp.role} at ${exp.company}`, bold: true }),
                    new Paragraph({ text: exp.details })
                ]),
                new Paragraph({ text: "Education", heading: HeadingLevel.HEADING_2 }),
                ...builderData.education.flatMap(edu => [
                    new Paragraph({ text: `${edu.school} - ${edu.degree}` })
                ]),
                new Paragraph({ text: "Skills", heading: HeadingLevel.HEADING_2 }),
                new Paragraph({ text: builderData.skills })
            ];
        }

        const doc = new Document({
            sections: [{
                properties: {},
                children: docChildren,
            }],
        });

        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, `${builderData.personal.fullName || 'Resume'}_${template}.docx`);
        });
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8 py-4">
            {/* LEFT: EDITOR */}
            <div className="space-y-6 overflow-y-auto max-h-[800px] pr-2 custom-scrollbar">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-black text-slate-800">Resume Builder</h2>
                    <button onClick={saveResume} disabled={loading} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-700 shadow-lg disabled:opacity-50">
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}Save
                    </button>
                </div>

                {/* Template Selector */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest flex items-center gap-2 mb-3"><LayoutTemplate size={14} /> Choose Style</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {['modern', 'professional', 'harvard', 'creative'].map(t => (
                            <button
                                key={t}
                                onClick={() => setTemplate(t)}
                                className={`p-2 rounded-lg text-[10px] font-black uppercase tracking-wide border-2 transition-all ${template === t ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-indigo-200'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form Sections */}
                <div className="card space-y-4">
                    <h3 className="form-section-title">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Full Name" value={builderData.personal.fullName} onChange={(e) => setBuilderData({ ...builderData, personal: { ...builderData.personal, fullName: e.target.value } })} className="input-field" />
                        <input type="email" placeholder="Email" value={builderData.personal.email} onChange={(e) => setBuilderData({ ...builderData, personal: { ...builderData.personal, email: e.target.value } })} className="input-field" />
                        <input type="text" placeholder="Phone" value={builderData.personal.phone} onChange={(e) => setBuilderData({ ...builderData, personal: { ...builderData.personal, phone: e.target.value } })} className="input-field" />
                        <input type="text" placeholder="Location" value={builderData.personal.location} onChange={(e) => setBuilderData({ ...builderData, personal: { ...builderData.personal, location: e.target.value } })} className="input-field" />
                    </div>
                    <textarea placeholder="Professional Bio / Summary" value={builderData.personal.bio} onChange={(e) => setBuilderData({ ...builderData, personal: { ...builderData.personal, bio: e.target.value } })} className="input-field h-32" />
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
                    <div className="flex justify-between items-center"><h3 className="form-section-title">Work Experience</h3><button onClick={() => setBuilderData({ ...builderData, experience: [...builderData.experience, { id: Date.now(), company: '', role: '', period: '', details: '' }] })} className="text-indigo-600 hover:bg-indigo-50 p-1 rounded"><Plus size={20} /></button></div>
                    {builderData.experience.map((exp, index) => (
                        <div key={exp.id} className="p-4 bg-slate-50 rounded-2xl relative space-y-3 border border-slate-100">
                            <button onClick={() => setBuilderData({ ...builderData, experience: builderData.experience.filter(e => e.id !== exp.id) })} className="absolute top-2 right-2 text-rose-300 hover:text-rose-500"><Trash size={16} /></button>
                            <div className="grid grid-cols-2 gap-3">
                                <input type="text" placeholder="Company" value={exp.company} onChange={(e) => { const n = [...builderData.experience]; n[index].company = e.target.value; setBuilderData({ ...builderData, experience: n }); }} className="input-field bg-white" />
                                <input type="text" placeholder="Role" value={exp.role} onChange={(e) => { const n = [...builderData.experience]; n[index].role = e.target.value; setBuilderData({ ...builderData, experience: n }); }} className="input-field bg-white" />
                            </div>
                            <input type="text" placeholder="Period (e.g. Jan 2020 - Present)" value={exp.period} onChange={(e) => { const n = [...builderData.experience]; n[index].period = e.target.value; setBuilderData({ ...builderData, experience: n }); }} className="input-field bg-white" />
                            <textarea placeholder="Key Achievements..." value={exp.details} onChange={(e) => { const n = [...builderData.experience]; n[index].details = e.target.value; setBuilderData({ ...builderData, experience: n }); }} className="input-field bg-white h-24" />
                        </div>
                    ))}
                </div>

                <div className="card space-y-4">
                    <h3 className="form-section-title">Technical Skills</h3>
                    <textarea placeholder="React, Node.js, Python, AWS..." value={builderData.skills} onChange={(e) => setBuilderData({ ...builderData, skills: e.target.value })} className="input-field h-24" />
                </div>
            </div>

            {/* RIGHT: PREVIEW */}
            <div className="sticky top-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-500 text-xs uppercase">Live Preview ({template})</h3>
                    <div className="flex gap-2">
                        <button onClick={generateDocx} className="flex items-center gap-2 text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 shadow-md transition-all">
                            <Download size={14} /> Download DOCX
                        </button>
                    </div>
                </div>

                {/* PREVIEW CONTAINER */}
                <div id="resume-preview" className={`bg-white shadow-2xl rounded-sm min-h-[842px] border text-slate-800 font-sans transition-all duration-300 origin-top scale-[0.95] ${template === 'modern' ? 'p-10' :
                        template === 'professional' ? 'p-12 font-serif text-black' :
                            template === 'harvard' ? 'p-14 font-serif text-black' :
                                'p-0 grid grid-cols-[1fr_2fr]'
                    }`}>

                    {/* --- HARVARD STYLE PREVIEW --- */}
                    {template === 'harvard' && (
                        <>
                            <div className="text-center mb-4">
                                <h1 className="text-2xl font-bold uppercase tracking-wide text-black mb-1">{builderData.personal.fullName || 'YOUR NAME'}</h1>
                                <p className="text-black text-sm">
                                    {builderData.personal.location} | {builderData.personal.phone} | {builderData.personal.email}
                                </p>
                            </div>
                            <div className="border-b-2 border-black w-full mb-4"></div>

                            {builderData.personal.bio && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-bold uppercase mb-1">Professional Summary</h4>
                                    <p className="text-sm text-black leading-snug">{builderData.personal.bio}</p>
                                </div>
                            )}

                            <div className="mb-4">
                                <h4 className="text-sm font-bold uppercase mb-1">Experience</h4>
                                <div className="space-y-3">
                                    {builderData.experience.map(exp => (
                                        <div key={exp.id}>
                                            <div className="flex justify-between text-black mb-0.5">
                                                <div className="font-bold text-sm">{exp.company}</div>
                                                <div className="text-sm">{exp.period}</div>
                                            </div>
                                            <div className="italic text-sm mb-1">{exp.role}</div>
                                            <p className="text-sm leading-snug">{exp.details}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="text-sm font-bold uppercase mb-1">Education</h4>
                                {builderData.education.map(edu => (
                                    <div key={edu.id} className="flex justify-between text-sm mb-1">
                                        <div><span className="font-bold">{edu.school}</span>, {edu.degree}</div>
                                        <div>{edu.year}</div>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <h4 className="text-sm font-bold uppercase mb-1">Skills</h4>
                                <p className="text-sm">{builderData.skills}</p>
                            </div>
                        </>
                    )}

                    {/* --- MODERN & PROFESSIONAL TEMPLATES --- */}
                    {(template === 'modern' || template === 'professional') && (
                        <>
                            <div className={`text-center border-b-2 ${template === 'modern' ? 'border-slate-900' : 'border-black'} pb-6 mb-6`}>
                                <h1 className={`text-4xl uppercase tracking-tighter mb-2 ${template === 'modern' ? 'font-black text-slate-900' : 'font-bold text-black'}`}>{builderData.personal.fullName || 'YOUR NAME'}</h1>
                                <div className={`flex justify-center gap-4 text-sm ${template === 'modern' ? 'font-medium text-slate-600' : 'text-black'}`}>
                                    <span>{builderData.personal.email}</span>
                                    {builderData.personal.phone && <span>• {builderData.personal.phone}</span>}
                                    {builderData.personal.location && <span>• {builderData.personal.location}</span>}
                                </div>
                            </div>

                            {builderData.personal.bio && <div className="mb-6"><p className="text-sm leading-relaxed">{builderData.personal.bio}</p></div>}

                            {builderData.skills && (
                                <div className="mb-6">
                                    <h4 className={`text-xs uppercase tracking-widest border-b mb-2 pb-1 ${template === 'modern' ? 'font-black border-slate-200' : 'font-bold text-black border-black'}`}>Skills</h4>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        {builderData.skills}
                                    </div>
                                </div>
                            )}

                            <div className="mb-6">
                                <h4 className={`text-xs uppercase tracking-widest border-b mb-3 pb-1 ${template === 'modern' ? 'font-black border-slate-200' : 'font-bold text-black border-black'}`}>Experience</h4>
                                <div className="space-y-4">
                                    {builderData.experience.map(exp => (
                                        <div key={exp.id}>
                                            <div className="flex justify-between items-baseline">
                                                <h5 className={`text-sm ${template === 'modern' ? 'font-bold text-slate-900' : 'font-bold text-black'}`}>{exp.role}</h5>
                                                <span className="text-[10px] font-bold uppercase opacity-70">{exp.period}</span>
                                            </div>
                                            <div className="text-xs font-bold text-indigo-600 mb-1 italic">{exp.company}</div>
                                            <p className="text-[11px] leading-relaxed whitespace-pre-line opacity-90">{exp.details}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className={`text-xs uppercase tracking-widest border-b mb-3 pb-1 ${template === 'modern' ? 'font-black border-slate-200' : 'font-bold text-black border-black'}`}>Education</h4>
                                <div className="space-y-2">
                                    {builderData.education.map(edu => (
                                        <div key={edu.id} className="flex justify-between items-start">
                                            <div>
                                                <h5 className="text-xs font-bold">{edu.school}</h5>
                                                <p className="text-[11px] italic">{edu.degree}</p>
                                            </div>
                                            <span className="text-[10px] font-bold">{edu.year}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* --- CREATIVE TEMPLATE (Sidebar) --- */}
                    {template === 'creative' && (
                        <>
                            <div className="bg-slate-900 text-white p-8 h-full min-h-[842px]">
                                <h1 className="text-3xl font-black uppercase tracking-tighter mb-6 leading-tight text-emerald-400">{builderData.personal.fullName || 'YOUR NAME'}</h1>
                                <div className="space-y-3 text-xs opacity-80 mb-8">
                                    <div className="flex items-center gap-2"><Mail size={10} /> {builderData.personal.email}</div>
                                    <div className="flex items-center gap-2"><Phone size={10} /> {builderData.personal.phone}</div>
                                    <div className="flex items-center gap-2"><MapPin size={10} /> {builderData.personal.location}</div>
                                </div>

                                <div className="mb-8">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4 border-b border-slate-700 pb-2">Skills</h4>
                                    <div className="flex flex-wrap gap-2 text-xs">
                                        {builderData.skills && builderData.skills.split(',').map((s, i) => (
                                            <span key={i} className="block w-full">{s.trim()}</span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4 border-b border-slate-700 pb-2">Education</h4>
                                    <div className="space-y-4">
                                        {builderData.education.map(edu => (
                                            <div key={edu.id}>
                                                <div className="font-bold text-sm text-white">{edu.school}</div>
                                                <div className="text-xs text-slate-400">{edu.degree}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 h-full bg-white">
                                {builderData.personal.bio && (
                                    <div className="mb-8">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-2">Profile</h4>
                                        <p className="text-sm leading-relaxed text-slate-700">{builderData.personal.bio}</p>
                                    </div>
                                )}
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-6">Experience</h4>
                                    <div className="space-y-6">
                                        {builderData.experience.map(exp => (
                                            <div key={exp.id} className="relative pl-4 border-l-2 border-slate-100">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h5 className="font-bold text-slate-900 text-base">{exp.role}</h5>
                                                </div>
                                                <div className="text-xs font-bold text-emerald-600 mb-2 uppercase tracking-wide flex justify-between">
                                                    {exp.company}
                                                    <span className="text-slate-400 normal-case">{exp.period}</span>
                                                </div>
                                                <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-line">{exp.details}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
