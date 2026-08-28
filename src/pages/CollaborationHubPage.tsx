import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Share2,
  Sparkles,
  GraduationCap,
  Building2,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react';
import { CivicChallenge, University, IndustryPartner } from '../types';
import { CollaborationNetworkGraph } from '../components/CollaborationNetworkGraph';

interface CollaborationHubPageProps {
  challenges: CivicChallenge[];
  universities: University[];
  industryPartners: IndustryPartner[];
  onStartNewReport: () => void;
}

export const CollaborationHubPage: React.FC<CollaborationHubPageProps> = ({
  challenges,
  universities,
  industryPartners,
  onStartNewReport,
}) => {
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(challenges[0]?.id || 'CS-001');

  const currentChallenge = challenges.find((c) => c.id === selectedChallengeId) || challenges[0];

  const matchedUni =
    universities.find((u) => u.id === currentChallenge?.matchedUniversityId) ||
    universities[0];

  const matchedIndustry =
    industryPartners.find((i) => i.id === currentChallenge?.matchedIndustryId) ||
    industryPartners[0];

  // 4-Phase Joint Roadmap
  const roadmapPhases = [
    {
      phase: 'Phase 1 (Week 1-2)',
      title: 'Problem Verification & Sensor Mesh Prototyping',
      lead: `Academic Lead: ${matchedUni?.name}`,
      deliverable: 'Lab bench-tested sensor firmware & edge gateway calibration',
      icon: GraduationCap,
      color: 'text-cyan-400 border-cyan-800/40 bg-cyan-950/30',
    },
    {
      phase: 'Phase 2 (Week 3-4)',
      title: 'Cloud Telematics & Municipal API Integration',
      lead: `Industry Lead: ${matchedIndustry?.name}`,
      deliverable: 'Commercial-grade vehicle routing API & telemetry ingestion pipeline',
      icon: Building2,
      color: 'text-purple-400 border-purple-800/40 bg-purple-950/30',
    },
    {
      phase: 'Phase 3 (Week 5-6)',
      title: 'Field Pilot Deployment in Neighborhood Zone',
      lead: 'Joint Civic Taskforce (Citizen + University + Industry)',
      deliverable: `Live deployment in ${currentChallenge?.location || 'Chennai'} with citizen verification`,
      icon: Lightbulb,
      color: 'text-emerald-400 border-emerald-800/40 bg-emerald-950/30',
    },
    {
      phase: 'Phase 4 (Week 7+)',
      title: 'Impact Auditing & Municipal Scale-Out',
      lead: 'CivicSync Open Impact Evaluation',
      deliverable: `Target: ${currentChallenge?.impact || '85% resolution rate and measurable community ROI'}`,
      icon: TrendingUp,
      color: 'text-amber-400 border-amber-800/40 bg-amber-950/30',
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Share2 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight font-mono">
              Civic Collaboration Hub
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tripartite synergy engine: Citizen Voice + Academic R&D + Industry Enterprise Capacity
          </p>
        </div>

        {/* Challenge Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Select Challenge:</span>
          <select
            value={selectedChallengeId}
            onChange={(e) => setSelectedChallengeId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none"
          >
            {challenges.map((c) => (
              <option key={c.id} value={c.id}>
                #{c.id}: {c.title.slice(0, 32)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Network Graph for the Active Challenge */}
      {currentChallenge && (
        <div className="space-y-3">
          <CollaborationNetworkGraph challenge={currentChallenge} />
        </div>
      )}

      {/* Tripartite Stakeholder Matrix */}
      {currentChallenge && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Citizen Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-900/40 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                  1. Citizen Role
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/40">
                  Originator
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">
                Ground Truth Problem Reporting
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                "{currentChallenge.citizenVoiceSnippet || 'Citizen voice report captured via CivicSync AI'}"
              </p>
            </div>
            <div className="text-[11px] text-slate-400 font-mono pt-3 border-t border-slate-800">
              Locality: {currentChallenge.location} • ~{currentChallenge.affectedPeople?.toLocaleString()} citizens
            </div>
          </div>

          {/* University Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-900/40 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                  2. Academic R&D Role
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                  {currentChallenge.universityMatchScore || 94}% Match
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                {matchedUni?.name}
              </h4>
              <p className="text-xs text-slate-400 mb-3">
                {matchedUni?.focus}
              </p>
              <div className="space-y-1 text-xs text-slate-300">
                {currentChallenge.universityMatchReasons?.map((r, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="line-clamp-1">{r}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-[11px] text-cyan-400 font-mono pt-3 border-t border-slate-800">
              Department: {currentChallenge.universityDisciplines?.[0] || 'Data Science'}
            </div>
          </div>

          {/* Industry Partner Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-900/40 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase">
                  3. Industry Partner Role
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/40">
                  {currentChallenge.industryMatchScore || 92}% Pilot Ready
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                {matchedIndustry?.name}
              </h4>
              <p className="text-xs text-slate-400 mb-3">
                {matchedIndustry?.sector}
              </p>
              <div className="space-y-1 text-xs text-slate-300">
                {currentChallenge.industryMatchReasons?.map((r, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="line-clamp-1">{r}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-[11px] text-purple-400 font-mono pt-3 border-t border-slate-800">
              Deployment SLA: {matchedIndustry?.pilotReadiness}
            </div>
          </div>
        </div>
      )}

      {/* 4-Phase Joint Implementation Roadmap */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold font-mono text-white tracking-tight">
              Actionable Joint Implementation Roadmap
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
            6-Week Pilot Plan
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roadmapPhases.map((phase, i) => {
            const PhaseIcon = phase.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {phase.phase}
                    </span>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${phase.color}`}>
                      <PhaseIcon className="w-4 h-4" />
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-white mb-2 leading-snug">
                    {phase.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 mb-3 font-mono">
                    {phase.lead}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">
                    Deliverable
                  </span>
                  <p className="text-xs text-slate-200 mt-0.5 leading-snug">
                    {phase.deliverable}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
