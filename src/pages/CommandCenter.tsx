import React from 'react';
import { motion } from 'motion/react';
import {
  Mic,
  AlertOctagon,
  AlertTriangle,
  Layers,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Activity,
  ArrowRight,
  Radio,
  Clock,
  ShieldCheck,
  Building2,
  GraduationCap,
  FileText,
} from 'lucide-react';
import { CivicChallenge, LiveCivicEvent, DemoScenario } from '../types';
import { CollaborationNetworkGraph } from '../components/CollaborationNetworkGraph';
import { DEMO_SCENARIOS } from '../data/initialData';

interface CommandCenterProps {
  challenges: CivicChallenge[];
  liveEvents: LiveCivicEvent[];
  onStartCall: () => void;
  onOpenTextDemo: () => void;
  onSelectScenario: (scenario: DemoScenario) => void;
  onViewChallengeDetails: (challenge: CivicChallenge) => void;
  onNavigateTab: (tab: any) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  challenges,
  liveEvents,
  onStartCall,
  onOpenTextDemo,
  onSelectScenario,
  onViewChallengeDetails,
  onNavigateTab,
}) => {
  const criticalCount = challenges.filter((c) => c.severity === 'CRITICAL').length;
  const highCount = challenges.filter((c) => c.severity === 'HIGH').length;
  const inProgressCount = challenges.filter((c) => c.status === 'IN_PROGRESS' || c.status === 'MATCHED').length;
  const solvedCount = challenges.filter((c) => c.status === 'SOLVED').length;
  const activeCount = challenges.length;

  const featuredChallenge = challenges[0] || null;

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Mission Control Header */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 p-6 sm:p-10 overflow-hidden shadow-2xl">
        {/* Glow ambient meshes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/50 text-emerald-400 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MULTILINGUAL CIVIC INNOVATION HUB</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-none">
              CIVICSYNC <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">AI</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-medium">
              From Citizen Voice to Collective Action
            </p>

            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering citizens to articulate hyper-local community challenges through natural voice in Tamil, English, and Tanglish. Our AI pipeline bridges spoken grievances into structured civic engineering challenges, academic R&D matches, and industry-backed deployments.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-start-voice-call"
                onClick={onStartCall}
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-950/60 hover:shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Mic className="w-4 h-4" />
                <span>Start Civic Call</span>
              </button>

              <button
                id="hero-open-text-demo"
                onClick={onOpenTextDemo}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-slate-200 font-semibold text-sm hover:text-white transition-all active:scale-95"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Try Text Demo</span>
              </button>

              <button
                id="hero-view-challenges"
                onClick={() => onNavigateTab('challenges')}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors"
              >
                <span>Browse All Challenges</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Demo Scenarios Selector Card */}
          <div className="w-full lg:w-96 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Test Demo Scenarios
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                1-Click Run
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Experience the end-to-end voice and challenge pipeline with curated scenarios:
            </p>

            <div className="space-y-2">
              {DEMO_SCENARIOS.slice(0, 3).map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => onSelectScenario(scenario)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/40 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">
                      {scenario.title}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                      {scenario.language}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-1 font-mono">
                    "{scenario.prompt}"
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 1. LIVE CIVIC SIGNALS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold font-mono text-white uppercase tracking-wider">
              1. Live Civic Signals
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Real-time Community Telemetry
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Critical Card */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-rose-900/40 shadow-lg shadow-rose-950/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-rose-400">CRITICAL</span>
              <AlertOctagon className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              {criticalCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Severe urgency / dry zones</p>
          </div>

          {/* High Priority */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-900/40 shadow-lg shadow-amber-950/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-amber-400">HIGH PRIORITY</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              {highCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Active risk mitigation</p>
          </div>

          {/* Active Challenges */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-900/40 shadow-lg shadow-cyan-950/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-cyan-400">ACTIVE CHALLENGES</span>
              <Layers className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              {activeCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Structured civic nodes</p>
          </div>

          {/* Solutions in Progress */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-indigo-900/40 shadow-lg shadow-indigo-950/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-indigo-400">IN PROGRESS</span>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              {inProgressCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Joint Uni-Industry pilots</p>
          </div>

          {/* Solved */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-900/40 shadow-lg shadow-emerald-950/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-emerald-400">SOLVED</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              {solvedCount || 12}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">De-bottlenecked areas</p>
          </div>
        </div>
      </div>

      {/* Grid for Featured Challenge & Live AI Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3. FEATURED CIVIC CHALLENGE (Left 7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/40">
                  FEATURED CIVIC CHALLENGE
                </span>
                <span className="text-xs font-mono text-slate-400">
                  #{featuredChallenge?.id || 'CS-001'}
                </span>
              </div>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                featuredChallenge?.severity === 'CRITICAL'
                  ? 'bg-rose-950/80 text-rose-400 border border-rose-800/50'
                  : 'bg-amber-950/80 text-amber-400 border border-amber-800/50'
              }`}>
                {featuredChallenge?.severity || 'HIGH'} PRIORITY
              </span>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight mb-2">
              {featuredChallenge?.title || 'Smart Waste Collection Optimization'}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {featuredChallenge?.description || 'Irregular solid waste collection schedules causing overflowing bins in residential zones.'}
            </p>

            {/* Parameter badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">CATEGORY</span>
                <span className="text-xs font-bold text-slate-200 mt-0.5 block">
                  {featuredChallenge?.category || 'Waste Management'}
                </span>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">LOCATION</span>
                <span className="text-xs font-bold text-slate-200 mt-0.5 block">
                  {featuredChallenge?.location || 'Chennai'}
                </span>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">COLLABORATION SYNERGY</span>
                <span className="text-xs font-bold text-emerald-400 mt-0.5 block">
                  {featuredChallenge?.collaborationMatchScore || 94}% Match
                </span>
              </div>
            </div>

            {/* Solution Concept snippet */}
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/30 mb-4">
              <span className="text-[10px] font-mono text-emerald-400 font-bold block uppercase">
                AI Solution Concept
              </span>
              <p className="text-xs text-emerald-200/90 mt-1 leading-relaxed">
                {featuredChallenge?.solutionConcept || 'Solar-powered fill-level sensor network combined with dynamic municipal collection routing.'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="text-xs text-slate-400 font-mono">
              Impact: {featuredChallenge?.impact?.slice(0, 48) || '85% reduction in bin overflow'}...
            </span>
            <button
              onClick={() => featuredChallenge && onViewChallengeDetails(featuredChallenge)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
            >
              <span>Inspect Challenge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. LIVE AI ACTIVITY (Right 5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold font-mono text-white tracking-tight">
                  2. Live AI Activity
                </h3>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                STREAMING
              </span>
            </div>

            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {liveEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    {evt.type === 'voice_call' ? (
                      <Mic className="w-3.5 h-3.5 text-emerald-400" />
                    ) : evt.type === 'university_match' ? (
                      <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                    ) : evt.type === 'industry_match' ? (
                      <Building2 className="w-3.5 h-3.5 text-purple-400" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-200 leading-tight">
                      {evt.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-slate-500">
                        {evt.timestamp}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                        {evt.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-4 text-center">
            <span className="text-[11px] font-mono text-slate-400">
              Auto-indexing Gemini Voice & Academic Matched Events
            </span>
          </div>
        </div>
      </div>

      {/* 4. COLLABORATION NETWORK (Citizen -> Challenge -> University -> Industry -> Solution -> Impact) */}
      {featuredChallenge && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold font-mono text-white uppercase tracking-wider">
                4. Collaboration Network
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Interactive Synergy Pipeline
            </span>
          </div>

          <CollaborationNetworkGraph challenge={featuredChallenge} />
        </div>
      )}
    </div>
  );
};
