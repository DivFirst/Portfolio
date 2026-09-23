import React from 'react';
import { Briefcase, Calendar, MapPin, Award, GraduationCap, FileText, CheckCircle2 } from 'lucide-react';
import { portfolioData } from '../../../data/portfolioData';

export const ProfessionalDossier: React.FC = () => {
  const { professional, profile } = portfolioData;

  return (
    <div className="space-y-6 text-slate-200">
      {/* Experience Stats Card */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-blue-300">
              {professional.yearsOfExperience} Industry Experience
            </span>
          </div>
          <p className="text-sm text-slate-300 mt-1 font-medium">{professional.headline}</p>
        </div>
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all"
        >
          <FileText className="w-3.5 h-3.5" />
          Resume PDF
        </a>
      </div>

      {/* Experience Timeline */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-blue-400" />
          Career History
        </h4>
        <div className="space-y-4">
          {professional.experiences.map((exp, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/30 transition-all space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h5 className="text-base font-bold text-white">{exp.role}</h5>
                  <span className="text-sm font-semibold text-blue-400">{exp.company}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-400" />
                    {exp.period}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {exp.location}
                  </span>
                </div>
              </div>

              {/* Highlights */}
              <ul className="space-y-1.5 pt-1">
                {exp.highlights.map((h, hIdx) => (
                  <li key={hIdx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                {exp.technologies.map((t, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-blue-950/60 text-blue-300 border border-blue-900/60 font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Competencies */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
          Skills & Technical Proficiencies
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {professional.coreCompetencies.map((cat, i) => (
            <div key={i} className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60">
              <h6 className="text-xs font-bold text-blue-300 mb-2">{cat.category}</h6>
              <div className="flex flex-wrap gap-1">
                {cat.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-700/80"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="space-y-2">
        <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
          Education
        </h4>
        {professional.education.map((edu, idx) => (
          <div key={idx} className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-white">{edu.degree}</span>
              <p className="text-xs text-slate-400">{edu.institution}</p>
            </div>
            <span className="text-xs font-mono text-blue-400">{edu.year}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
