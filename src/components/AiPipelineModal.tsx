import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Loader2,
  Sparkles,
  Cpu,
  GraduationCap,
  Building2,
  Lightbulb,
  ShieldAlert,
  Languages,
  Radio,
} from 'lucide-react';
import { AIAnalysisResult } from '../types';

interface AiPipelineModalProps {
  isOpen: boolean;
  onComplete: () => void;
  analysisData?: AIAnalysisResult | null;
}

const PIPELINE_STAGES = [
  { id: 'input', label: 'Citizen Voice Ingestion', icon: Radio, sub: 'Parsing audio waveform & transcripts' },
  { id: 'lang', label: 'Multilingual Detection', icon: Languages, sub: 'Recognizing Tamil / English / Tanglish' },
  { id: 'understanding', label: 'Problem Understanding', icon: Cpu, sub: 'Extracting root cause & locality' },
  { id: 'severity', label: 'Severity & SDG Analysis', icon: ShieldAlert, sub: 'Estimating affected population & urgency' },
  { id: 'challenge', label: 'Civic Challenge Generation', icon: Sparkles, sub: 'Structuring CS-ID & parameters' },
  { id: 'university', label: 'University Matchmaking', icon: GraduationCap, sub: 'Evaluating academic lab capabilities' },
  { id: 'industry', label: 'Industry Matchmaking', icon: Building2, sub: 'Matching smart city enterprise capacity' },
  { id: 'solution', label: 'Collaborative Solution', icon: Lightbulb, sub: 'Synthesizing actionable innovation concept' },
];

export const AiPipelineModal: React.FC<AiPipelineModalProps> = ({
  isOpen,
  onComplete,
  analysisData,
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStageIndex(0);
      setIsFinished(false);
      return;
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex += 1;
      if (currentIndex < PIPELINE_STAGES.length) {
        setCurrentStageIndex(currentIndex);
      } else {
        clearInterval(interval);
        setIsFinished(true);
      }
    }, 450); // Fast, realistic, responsive transition

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/60 overflow-hidden relative"
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Civic AI Synthesis Engine
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Transforming Citizen Voice into Multidisciplinary Action
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
              {isFinished ? '100% COMPLETE' : `${Math.round(((currentStageIndex + 1) / PIPELINE_STAGES.length) * 100)}%`}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-6 relative z-10">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400"
            initial={{ width: '0%' }}
            animate={{
              width: `${Math.min(100, Math.round(((currentStageIndex + 1) / PIPELINE_STAGES.length) * 100))}%`,
            }}
            transition={{ ease: 'easeInOut', duration: 0.3 }}
          />
        </div>

        {/* Pipeline Stage List */}
        <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1 relative z-10">
          {PIPELINE_STAGES.map((stage, idx) => {
            const isCompleted = isFinished || idx < currentStageIndex;
            const isCurrent = !isFinished && idx === currentStageIndex;
            const isPending = !isFinished && idx > currentStageIndex;
            const StageIcon = stage.icon;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                    : isCurrent
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 shadow-md shadow-cyan-950/40'
                    : 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : isCurrent
                        ? 'bg-cyan-500/20 text-cyan-400 animate-pulse'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <StageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-mono tracking-tight text-white">
                      {stage.label}
                    </h4>
                    <p className="text-[11px] text-slate-400">{stage.sub}</p>
                  </div>
                </div>

                <div>
                  {isCompleted && (
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="hidden sm:inline">DONE</span>
                    </div>
                  )}
                  {isCurrent && (
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">ANALYZING...</span>
                    </div>
                  )}
                  {isPending && (
                    <span className="text-[11px] font-mono text-slate-600">
                      PENDING
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Completion Preview & Action */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="text-xs text-slate-400">
            {isFinished ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Challenge structured & matched successfully!
              </span>
            ) : (
              <span className="text-slate-400 flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" /> Computing university and industry synergy scores...
              </span>
            )}
          </div>

          <button
            id="view-synthesized-challenge-btn"
            disabled={!isFinished}
            onClick={onComplete}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 ${
              isFinished
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-950/60 cursor-pointer active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>VIEW CIVIC CHALLENGE</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
