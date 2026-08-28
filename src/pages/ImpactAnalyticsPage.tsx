import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  ShieldCheck,
  Globe2,
  Users,
  CheckCircle2,
  Sparkles,
  Layers,
  GraduationCap,
  Building2,
} from 'lucide-react';
import { CivicChallenge } from '../types';

interface ImpactAnalyticsPageProps {
  challenges: CivicChallenge[];
}

export const ImpactAnalyticsPage: React.FC<ImpactAnalyticsPageProps> = ({ challenges }) => {
  // Aggregate metrics
  const totalReports = 142 + challenges.length;
  const affectedPopulation = challenges.reduce((acc, c) => acc + (c.affectedPeople || 0), 125000);
  const avgSynergy = Math.round(
    challenges.reduce((acc, c) => acc + (c.collaborationMatchScore || 90), 0) / (challenges.length || 1)
  );

  // Category breakdown
  const categoryCounts: Record<string, number> = {};
  challenges.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  // Language Breakdown
  const languageDistribution = [
    { lang: 'Tamil (தமிழ்)', percent: 58, color: 'bg-emerald-400' },
    { lang: 'Tanglish (Mix)', percent: 27, color: 'bg-cyan-400' },
    { lang: 'English', percent: 15, color: 'bg-indigo-400' },
  ];

  // SDG breakdown
  const sdgList = [
    { name: 'SDG 11: Sustainable Cities & Communities', count: 8, color: 'text-amber-400 bg-amber-950/40 border-amber-800/40' },
    { name: 'SDG 6: Clean Water & Sanitation', count: 5, color: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40' },
    { name: 'SDG 7: Affordable & Clean Energy', count: 3, color: 'text-yellow-400 bg-yellow-950/40 border-yellow-800/40' },
    { name: 'SDG 9: Industry, Innovation & Infrastructure', count: 6, color: 'text-purple-400 bg-purple-950/40 border-purple-800/40' },
    { name: 'SDG 3: Good Health & Well-Being', count: 4, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight font-mono">
              Civic Impact & AI Telemetry
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time analytics across citizen voice ingestion, language detection, and collaborative resolution
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/40">
            Prototype Demo Telemetry
          </span>
        </div>
      </div>

      {/* Top Aggregate Key Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>TOTAL VOICE SIGNALS</span>
            <Globe2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            {totalReports}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1">Across 14 Municipal Wards</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>AFFECTED CITIZENS</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            ~{affectedPopulation.toLocaleString()}
          </div>
          <p className="text-[11px] text-cyan-400 mt-1">Target Beneficiary Pool</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>AVG COLLAB SYNERGY</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            {avgSynergy}%
          </div>
          <p className="text-[11px] text-purple-400 mt-1">Uni + Industry Capability Fit</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>PILOT CONVERSION RATE</span>
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            91.4%
          </div>
          <p className="text-[11px] text-amber-400 mt-1">From Grievance to Challenge</p>
        </div>
      </div>

      {/* Grid: Multilingual Voice Share + UN SDG Alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Multilingual Voice Distribution */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Multilingual Voice Distribution
            </h3>
            <span className="text-xs font-mono text-slate-400">Gemini Live STT</span>
          </div>

          <div className="space-y-4">
            {languageDistribution.map((item) => (
              <div key={item.lang} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{item.lang}</span>
                  <span className="font-mono text-slate-400">{item.percent}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400">
            <span className="font-semibold text-emerald-400">Key Insight:</span> Over 85% of citizen grievances in Tamil Nadu urban wards are spoken in colloquial Tamil or Tanglish phrasing that standard English civic portals fail to categorize accurately.
          </div>
        </div>

        {/* UN SDG Alignment */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              UN Sustainable Development Goals (SDGs)
            </h3>
            <span className="text-xs font-mono text-slate-400">Automated Alignment</span>
          </div>

          <div className="space-y-2.5">
            {sdgList.map((sdg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-center justify-between ${sdg.color}`}
              >
                <span className="text-xs font-semibold">{sdg.name}</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-950/80">
                  {sdg.count} Challenges
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown Matrix */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Problem Domain Categorization Breakdown
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Active Challenge Matrix</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <div key={cat} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-[11px] font-semibold text-slate-300 block line-clamp-1">
                {cat}
              </span>
              <span className="text-2xl font-extrabold font-mono text-emerald-400 mt-1 block">
                {count}
              </span>
              <span className="text-[10px] font-mono text-slate-500 block">Challenges</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
