import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  Search,
  Filter,
  AlertOctagon,
  AlertTriangle,
  Sparkles,
  MapPin,
  Clock,
  Users,
  GraduationCap,
  Building2,
  Lightbulb,
  ArrowUpRight,
  X,
  Share2,
} from 'lucide-react';
import { CivicChallenge, SeverityLevel } from '../types';
import { CIVIC_CATEGORIES } from '../data/initialData';
import { CollaborationNetworkGraph } from '../components/CollaborationNetworkGraph';

interface ChallengesPageProps {
  challenges: CivicChallenge[];
  onStartNewReport: () => void;
}

export const ChallengesPage: React.FC<ChallengesPageProps> = ({
  challenges,
  onStartNewReport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [activeModalChallenge, setActiveModalChallenge] = useState<CivicChallenge | null>(null);

  const filteredChallenges = challenges.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchesSeverity = selectedSeverity === 'ALL' || c.severity === selectedSeverity;

    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const getSeverityBadge = (sev: SeverityLevel) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-950/80 text-rose-400 border border-rose-800/60';
      case 'HIGH':
        return 'bg-amber-950/80 text-amber-400 border border-amber-800/60';
      case 'MEDIUM':
        return 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/60';
      case 'LOW':
        return 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight font-mono">
              Structured Civic Challenges
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Community bottlenecks transformed into multidisciplinary research and pilot challenges
          </p>
        </div>

        <button
          onClick={onStartNewReport}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/50"
        >
          <Sparkles className="w-4 h-4" />
          <span>Report New Challenge</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, location, ID or keywords..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500/60 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            {CIVIC_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500/60 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChallenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            whileHover={{ y: -3 }}
            className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all"
          >
            <div>
              {/* Header tags */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  #{challenge.id}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${getSeverityBadge(challenge.severity)}`}>
                  {challenge.severity}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-white tracking-tight line-clamp-1 mb-1.5">
                {challenge.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                {challenge.description}
              </p>

              {/* Key metadata pills */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{challenge.location}</span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>~{challenge.affectedPeople?.toLocaleString()} citizens affected</span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Duration: {challenge.duration}</span>
                </div>
              </div>

              {/* Academic & Industry Match Previews */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 mb-4">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1.5 font-mono">
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-400" /> Uni Match:
                  </span>
                  <span className="font-mono font-bold text-cyan-300">
                    {challenge.universityMatchScore || 94}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1.5 font-mono">
                    <Building2 className="w-3.5 h-3.5 text-purple-400" /> Industry Match:
                  </span>
                  <span className="font-mono font-bold text-purple-300">
                    {challenge.industryMatchScore || 92}%
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom button */}
            <button
              onClick={() => setActiveModalChallenge(challenge)}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-bold text-slate-200 hover:text-white transition-colors"
            >
              <span>Inspect Collaboration Blueprint</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            </button>
          </motion.div>
        ))}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm">No civic challenges match your filter.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setSelectedSeverity('ALL');
            }}
            className="mt-3 text-xs font-mono text-emerald-400 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Challenge Detailed Modal */}
      <AnimatePresence>
        {activeModalChallenge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8"
            >
              <button
                onClick={() => setActiveModalChallenge(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="mb-6 border-b border-slate-800 pb-4 pr-12">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                    #{activeModalChallenge.id}
                  </span>
                  <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded ${getSeverityBadge(activeModalChallenge.severity)}`}>
                    {activeModalChallenge.severity} SEVERITY
                  </span>
                  <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                    {activeModalChallenge.category}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {activeModalChallenge.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  {activeModalChallenge.sdg} • Reported in {activeModalChallenge.language}
                </p>
              </div>

              {/* Problem statement */}
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Problem Statement
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    {activeModalChallenge.description}
                  </p>
                </div>

                {activeModalChallenge.rootCauseHypothesis && (
                  <div>
                    <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
                      Root Cause Hypothesis (AI Estimate)
                    </h4>
                    <p className="text-xs text-slate-300 bg-amber-950/20 p-3 rounded-xl border border-amber-900/30">
                      {activeModalChallenge.rootCauseHypothesis}
                    </p>
                  </div>
                )}
              </div>

              {/* Interactive Network Graph */}
              <div className="mb-6">
                <CollaborationNetworkGraph challenge={activeModalChallenge} />
              </div>

              {/* Solution & Impact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40">
                  <div className="flex items-center gap-2 mb-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                    <Lightbulb className="w-4 h-4" />
                    <span>AI Solution Concept</span>
                  </div>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    {activeModalChallenge.solutionConcept}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40">
                  <div className="flex items-center gap-2 mb-2 text-cyan-400 font-mono text-xs font-bold uppercase">
                    <Sparkles className="w-4 h-4" />
                    <span>Expected Societal Impact</span>
                  </div>
                  <p className="text-xs text-cyan-200/90 leading-relaxed">
                    {activeModalChallenge.impact}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
