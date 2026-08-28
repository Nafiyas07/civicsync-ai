import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Cpu,
  MapPin,
  CheckCircle2,
  Share2,
  Search,
  ExternalLink,
  Award,
} from 'lucide-react';
import { University, CivicChallenge } from '../types';

interface UniversityNetworkPageProps {
  universities: University[];
  challenges: CivicChallenge[];
  onSelectChallenge?: (challenge: CivicChallenge) => void;
}

export const UniversityNetworkPage: React.FC<UniversityNetworkPageProps> = ({
  universities,
  challenges,
  onSelectChallenge,
}) => {
  const [selectedUni, setSelectedUni] = useState<University | null>(universities[0] || null);
  const [filterSkill, setFilterSkill] = useState<string>('ALL');

  const allSkills = Array.from(new Set(universities.flatMap((u) => u.skills)));

  const filteredUnis = universities.filter((u) => {
    if (filterSkill === 'ALL') return true;
    return u.skills.includes(filterSkill);
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight font-mono">
              University R&D Capability Network
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Matching civic engineering challenges to specialized academic research labs & student innovators
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-3 py-1.5 rounded-xl border border-cyan-800/40">
            {universities.length} Academic Labs Indexed
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setFilterSkill('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            filterSkill === 'ALL'
              ? 'bg-cyan-500 text-slate-950 font-bold'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          All Capabilities ({universities.length})
        </button>
        {allSkills.map((skill) => (
          <button
            key={skill}
            onClick={() => setFilterSkill(skill)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filterSkill === skill
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {skill}
          </button>
        ))}
      </div>

      {/* University Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUnis.map((uni) => {
          const matchedChallengesCount = challenges.filter(
            (c) => c.matchedUniversityId === uni.id || c.universityDisciplines.some((d) => uni.disciplines.includes(d))
          ).length;

          return (
            <motion.div
              key={uni.id}
              whileHover={{ y: -3 }}
              onClick={() => setSelectedUni(uni)}
              className={`bg-slate-900/80 border rounded-2xl p-5 shadow-xl flex flex-col justify-between cursor-pointer transition-all ${
                selectedUni?.id === uni.id
                  ? 'border-cyan-500 ring-1 ring-cyan-500/50 shadow-cyan-950/40'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${uni.avatarColor} flex items-center justify-center text-slate-950 font-bold shadow-md`}>
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {uni.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{uni.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {uni.focus}
                </p>

                {/* Skills tags */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                    Core Technical Competencies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {uni.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-950 text-cyan-300 border border-slate-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Disciplines */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                    Academic Departments
                  </span>
                  <p className="text-xs text-slate-400 font-mono">
                    {uni.disciplines.join(' • ')}
                  </p>
                </div>
              </div>

              {/* Bottom stats */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">
                  {uni.activeProjects} Active Hackathon Pilots
                </span>
                <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  {matchedChallengesCount} Matched Challenges
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* University Matching Engine Explainer Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
            AI Academic Matchmaking Methodology
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          CivicSync AI parses unstructured citizen problem reports to extract required technical competencies (e.g. Ultrasonic IoT, Acoustic Telemetry, LoRaWAN mesh). It computes multidimensional cosine similarity across university research publications, active lab hardware facilities, and faculty patents to deliver transparent match reasons rather than an opaque score.
        </p>
      </div>
    </div>
  );
};
