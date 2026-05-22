import { CVData } from "../types";
import { Plus, Trash2, Briefcase, GraduationCap, ListChecks, Edit3 } from "lucide-react";

interface Props {
  data: CVData;
  onChange: (data: CVData) => void;
}

export default function CVEditor({ data, onChange }: Props) {
  const updateExperience = (index: number, field: string, value: string) => {
    const newExp = [...data.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    onChange({ ...data, experience: newExp });
  };

  const addExperience = () => {
    onChange({
      ...data,
      experience: [...data.experience, { role: "", company: "", period: "", description: "" }]
    });
  };

  const removeExperience = (index: number) => {
    const newExp = data.experience.filter((_, i) => i !== index);
    onChange({ ...data, experience: newExp });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const newEdu = [...data.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    onChange({ ...data, education: newEdu });
  };

  const addEducation = () => {
    onChange({
      ...data,
      education: [...data.education, { degree: "", institution: "", year: "" }]
    });
  };

  const removeEducation = (index: number) => {
    const newEdu = data.education.filter((_, i) => i !== index);
    onChange({ ...data, education: newEdu });
  };

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...data.skills];
    newSkills[index] = value;
    onChange({ ...data, skills: newSkills });
  };

  const addSkill = () => {
    onChange({ ...data, skills: [...data.skills, ""] });
  };

  const removeSkill = (index: number) => {
    const newSkills = data.skills.filter((_, i) => i !== index);
    onChange({ ...data, skills: newSkills });
  };

  return (
    <div className="space-y-8 pb-32 max-w-4xl mx-auto">
      {/* Basic Info */}
      <section className="bg-bg-panel p-10 rounded-[32px] border border-white/5 shadow-2xl">
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand mb-8 flex items-center gap-3">
          <Edit3 className="w-4 h-4" />
          Identification & Summary
        </h3>
        <div className="grid gap-8">
          <div>
            <label className="block text-[9px] font-black mb-3 uppercase tracking-[0.2em] text-white/30 italic">Anonymized Initials</label>
            <input
              type="text"
              value={data.initials}
              onChange={(e) => onChange({ ...data, initials: e.target.value })}
              className="w-full p-5 bg-white/[0.03] rounded-2xl border border-white/10 focus:border-brand/50 focus:bg-white/[0.05] outline-none transition-all font-light text-2xl italic tracking-tighter text-white"
              placeholder="e.g. J. D."
            />
          </div>
          <div>
            <label className="block text-[9px] font-black mb-3 uppercase tracking-[0.2em] text-white/30 italic">Executive Summary</label>
            <textarea
              value={data.summary}
              onChange={(e) => onChange({ ...data, summary: e.target.value })}
              rows={4}
              className="w-full p-5 bg-white/[0.03] rounded-2xl border border-white/10 focus:border-brand/50 focus:bg-white/[0.05] outline-none transition-all resize-none leading-relaxed text-white/80 font-light"
              placeholder="Brief professional profile..."
            />
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="bg-bg-panel p-10 rounded-[32px] border border-white/5 shadow-2xl">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand flex items-center gap-3">
            <Briefcase className="w-4 h-4" />
            Professional Trajectory
          </h3>
          <button
            onClick={addExperience}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-full border border-white/10 transition-all text-white/60 hover:text-white"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Entry
          </button>
        </div>
        <div className="grid gap-6">
          {data.experience.map((exp, index) => (
            <div key={index} className="relative p-8 bg-white/[0.02] border border-white/5 rounded-3xl group">
              <button
                onClick={() => removeExperience(index)}
                className="absolute top-4 right-4 w-10 h-10 bg-bg-dark border border-white/10 text-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:text-brand hover:border-brand/30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div>
                  <label className="block text-[8px] font-black mb-2 uppercase tracking-widest text-white/20">Function / Role</label>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => updateExperience(index, "role", e.target.value)}
                    className="w-full p-3 bg-white/[0.02] rounded-xl border border-white/10 focus:bg-white/[0.05] focus:border-brand/50 outline-none transition-all font-medium text-white"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-black mb-2 uppercase tracking-widest text-white/20">Corporate Entity</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, "company", e.target.value)}
                    className="w-full p-3 bg-white/[0.02] rounded-xl border border-white/10 focus:bg-white/[0.05] focus:border-brand/50 outline-none transition-all font-medium text-white"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-[8px] font-black mb-2 uppercase tracking-widest text-white/20">Temporal Range</label>
                <input
                  type="text"
                  value={exp.period}
                  onChange={(e) => updateExperience(index, "period", e.target.value)}
                  className="w-full p-3 bg-white/[0.02] rounded-xl border border-white/10 focus:bg-white/[0.05] focus:border-brand/50 outline-none transition-all font-mono text-[10px] tracking-tighter text-brand"
                />
              </div>
              <div>
                <label className="block text-[8px] font-black mb-2 uppercase tracking-widest text-white/20">Operational Description</label>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(index, "description", e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-white/[0.02] rounded-xl border border-white/10 focus:bg-white/[0.05] focus:border-brand/50 outline-none transition-all resize-none leading-relaxed text-sm text-white/60 font-light"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="bg-bg-panel p-10 rounded-[32px] border border-white/5 shadow-2xl">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand flex items-center gap-3">
            <ListChecks className="w-4 h-4" />
            Core Capabilities
          </h3>
          <button
            onClick={addSkill}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-full border border-white/10 transition-all text-white/60 hover:text-white"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Badge
          </button>
        </div>
        <div className="flex flex-wrap gap-4">
          {data.skills.map((skill, index) => (
            <div key={index} className="flex items-center bg-white/[0.03] border border-white/10 rounded-full px-5 py-2 transition-all focus-within:bg-white/[0.08] focus-within:border-brand/50 group">
              <input
                type="text"
                value={skill}
                onChange={(e) => updateSkill(index, e.target.value)}
                className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-widest w-28 text-white/80"
              />
              <button
                onClick={() => removeSkill(index)}
                className="ml-3 text-white/20 hover:text-brand transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="bg-bg-panel p-10 rounded-[32px] border border-white/5 shadow-2xl">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand flex items-center gap-3">
            <GraduationCap className="w-4 h-4" />
            Academic Foundations
          </h3>
          <button
            onClick={addEducation}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-full border border-white/10 transition-all text-white/60 hover:text-white"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Entry
          </button>
        </div>
        <div className="grid gap-6">
          {data.education.map((edu, index) => (
            <div key={index} className="relative p-8 bg-white/[0.02] border border-white/5 rounded-3xl group grid md:grid-cols-3 gap-6">
              <button
                onClick={() => removeEducation(index)}
                className="absolute top-4 right-4 w-10 h-10 bg-bg-dark border border-white/10 text-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:text-brand hover:border-brand/30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div>
                <label className="block text-[8px] font-black mb-2 uppercase tracking-widest text-white/20">Attained Degree</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, "degree", e.target.value)}
                  className="w-full p-3 bg-white/[0.02] rounded-xl border border-white/10 focus:bg-white/[0.05] focus:border-brand/50 outline-none transition-all font-bold text-[11px] uppercase tracking-wide text-white"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-[8px] font-black mb-2 uppercase tracking-widest text-white/20">Institutional Body</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, "institution", e.target.value)}
                  className="w-full p-3 bg-white/[0.02] rounded-xl border border-white/10 focus:bg-white/[0.05] focus:border-brand/50 outline-none transition-all font-medium text-[11px] text-white/60"
                />
              </div>
              <div>
                <label className="block text-[8px] font-black mb-2 uppercase tracking-widest text-white/20">Conferral Year</label>
                <input
                  type="text"
                  value={edu.year}
                  onChange={(e) => updateEducation(index, "year", e.target.value)}
                  className="w-full p-3 bg-white/[0.02] rounded-xl border border-white/10 focus:bg-white/[0.05] focus:border-brand/50 outline-none transition-all font-mono text-[10px] text-brand"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

