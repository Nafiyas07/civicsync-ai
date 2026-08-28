import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  AlertTriangle,
  GraduationCap,
  Building2,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { CivicChallenge } from '../types';

interface CollaborationNetworkGraphProps {
  challenge: CivicChallenge;
  onSelectNode?: (nodeKey: string) => void;
}

type NodeKey = 'citizen' | 'challenge' | 'university' | 'industry' | 'solution' | 'impact';

export const CollaborationNetworkGraph: React.FC<CollaborationNetworkGraphProps> = ({
  challenge,
}) => {
  const [selectedNode, setSelectedNode] = useState<NodeKey>('solution');

  const nodes = [
    {
      id: 'citizen' as NodeKey,
      title: '1. Citizen Voice',
      subtitle: challenge.language || 'Tamil / English',
      tag: 'Spoken Report',
      icon: Mic,
      color: 'from-amber-500 to-orange-500',
      borderColor: 'border-amber-500/40',
      activeBorder: 'border-amber-400 shadow-amber-500/30',
      glow: 'bg-amber-500/10',
      summary: challenge.citizenVoiceSnippet || 'Citizen spoken report captured via Gemini Live voice interaction.',
      detailHeader: 'Voice Ingestion & Locality Context',
      details: [
        { label: 'Language', val: `${challenge.language || 'Tamil'} (Auto-detected)` },
        { label: 'Reported Location', val: challenge.location || 'Local Community' },
        { label: 'Problem Duration', val: challenge.duration || '2 weeks' },
        { label: 'Affected Citizens', val: `~${challenge.affectedPeople?.toLocaleString() || '4,500'} residents` },
      ],
    },
    {
      id: 'challenge' as NodeKey,
      title: '2. Civic Challenge',
      subtitle: `#${challenge.id}`,
      tag: challenge.severity + ' SEVERITY',
      icon: AlertTriangle,
      color: 'from-rose-500 to-red-500',
      borderColor: 'border-rose-500/40',
      activeBorder: 'border-rose-400 shadow-rose-500/30',
      glow: 'bg-rose-500/10',
      summary: challenge.title,
      detailHeader: 'Structured Problem Definition',
      details: [
        { label: 'Category', val: challenge.category },
        { label: 'Severity Level', val: challenge.severity },
        { label: 'UN SDG Goal', val: challenge.sdg || 'SDG 11: Sustainable Cities' },
        { label: 'Root Cause', val: challenge.rootCauseHypothesis || 'Infrastructure capacity limits' },
      ],
    },
    {
      id: 'university' as NodeKey,
      title: '3. University Match',
      subtitle: `${challenge.universityMatchScore || 94}% Academic Synergy`,
      tag: 'R&D / Lab Partner',
      icon: GraduationCap,
      color: 'from-cyan-500 to-blue-500',
      borderColor: 'border-cyan-500/40',
      activeBorder: 'border-cyan-400 shadow-cyan-500/30',
      glow: 'bg-cyan-500/10',
      summary: 'Tech University Alpha (Urban Informatics & IoT Systems)',
      detailHeader: 'Academic Capabilities & Research Overlap',
      details: [
        { label: 'Disciplines', val: challenge.universityDisciplines?.join(', ') || 'Data Science, IoT, Embedded Systems' },
        { label: 'Lab Match Score', val: `${challenge.universityMatchScore || 94}% (AI estimate)` },
        { label: 'Key Synergy 1', val: challenge.universityMatchReasons?.[0] || 'IoT Telemetry Hardware Lab' },
        { label: 'Key Synergy 2', val: challenge.universityMatchReasons?.[1] || 'Urban Informatics Research Thesis' },
      ],
    },
    {
      id: 'industry' as NodeKey,
      title: '4. Industry Match',
      subtitle: `${challenge.industryMatchScore || 92}% Pilot Feasibility`,
      tag: 'Prototype Partner',
      icon: Building2,
      color: 'from-purple-500 to-indigo-500',
      borderColor: 'border-purple-500/40',
      activeBorder: 'border-purple-400 shadow-purple-500/30',
      glow: 'bg-purple-500/10',
      summary: 'EcoRoute Systems / UrbanTech Solutions (Smart City Scale)',
      detailHeader: 'Enterprise Capabilities & Deployment Readiness',
      details: [
        { label: 'Capabilities', val: challenge.industryCapabilities?.join(', ') || 'Route Optimization, Waste Ops, Telematics' },
        { label: 'Pilot Readiness', val: 'High (1-2 Weeks turnaround)' },
        { label: 'Industry Reason', val: challenge.industryMatchReasons?.[0] || 'Commercial scale telemetry & fleet cloud integration' },
      ],
    },
    {
      id: 'solution' as NodeKey,
      title: '5. AI Solution Concept',
      subtitle: `${challenge.collaborationMatchScore || 93}% Joint Viability`,
      tag: 'Collaborative Blueprint',
      icon: Lightbulb,
      color: 'from-emerald-500 to-teal-500',
      borderColor: 'border-emerald-500/40',
      activeBorder: 'border-emerald-400 shadow-emerald-500/30',
      glow: 'bg-emerald-500/10',
      summary: challenge.solutionConcept,
      detailHeader: 'Actionable Collaborative Architecture',
      details: [
        { label: 'Required Skills', val: challenge.requiredSkills?.join(' • ') || 'IoT, Telematics, Mobile UX' },
        { label: 'Innovation Model', val: 'University Prototyping + Industry Pilot Deployment' },
        { label: 'Status', val: challenge.status },
      ],
    },
    {
      id: 'impact' as NodeKey,
      title: '6. Expected Impact',
      subtitle: 'Societal Metric',
      tag: 'Measurable Outcome',
      icon: TrendingUp,
      color: 'from-teal-400 to-emerald-400',
      borderColor: 'border-teal-500/40',
      activeBorder: 'border-teal-400 shadow-teal-500/30',
      glow: 'bg-teal-500/10',
      summary: challenge.impact,
      detailHeader: 'Community & Municipal ROI',
      details: [
        { label: 'Target Benefit', val: challenge.impact },
        { label: 'Beneficiaries', val: `${challenge.affectedPeople?.toLocaleString()} Community Members` },
        { label: 'Validation Method', val: 'Real-time sensor telemetry & citizen verification feedback' },
      ],
    },
  ];

  const currentNodeData = nodes.find((n) => n.id === selectedNode) || nodes[4];

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Background illumination */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white font-mono tracking-tight">
              Interactive Civic Collaboration Network
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any node in the pipeline to inspect capability synergy and real-time parameters
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
            {challenge.collaborationMatchScore || 94}% Overall Synergy
          </span>
        </div>
      </div>

      {/* Interactive Horizontal Flow Network */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {nodes.map((node, index) => {
          const isSelected = selectedNode === node.id;
          const NodeIcon = node.icon;

          return (
            <motion.div
              key={node.id}
              onClick={() => setSelectedNode(node.id)}
              whileHover={{ y: -2 }}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                isSelected
                  ? `bg-slate-800/90 ${node.activeBorder} shadow-lg ring-1 ring-white/10`
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-400'
              }`}
            >
              {/* Top Row */}
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${node.color} text-slate-950 font-bold shadow-sm`}>
                  <NodeIcon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700/50">
                  {node.tag}
                </span>
              </div>

              {/* Title & Sub */}
              <div>
                <h4 className="text-xs font-bold text-white font-mono tracking-tight line-clamp-1">
                  {node.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {node.subtitle}
                </p>
              </div>

              {/* Selection indicator pill */}
              {isSelected && (
                <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px] font-mono text-emerald-400">
                  <span>INSPECTING</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Selected Node Deep Inspector Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentNodeData.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 sm:p-5"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${currentNodeData.color} text-slate-950 font-bold`}>
                <currentNodeData.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-mono">
                  {currentNodeData.detailHeader}
                </h4>
                <p className="text-xs text-slate-400">
                  {currentNodeData.summary}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700/60">
                Node ID: {currentNodeData.id.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {currentNodeData.details.map((item, i) => (
              <div key={i} className="bg-slate-900/70 border border-slate-800/60 rounded-lg p-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  {item.label}
                </span>
                <span className="text-xs font-semibold text-slate-200 mt-1 block">
                  {item.val}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
