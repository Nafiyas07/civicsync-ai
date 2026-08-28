import React from 'react';
import { motion } from 'motion/react';

interface AudioWaveformProps {
  isActive: boolean;
  isAiSpeaking: boolean;
  level: number;
  barCount?: number;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isActive,
  isAiSpeaking,
  level,
  barCount = 28,
}) => {
  return (
    <div className="flex items-center justify-center gap-1.5 h-20 px-4">
      {Array.from({ length: barCount }).map((_, index) => {
        // Calculate dynamic height based on audio level and center-weighted curve
        const centerDistance = Math.abs(index - barCount / 2) / (barCount / 2);
        const weight = 1 - centerDistance * 0.65;
        const normalizedLevel = Math.max(8, (level * weight) % 100);

        const baseHeight = isActive
          ? isAiSpeaking
            ? Math.max(12, Math.sin((index + Date.now() / 150) * 0.5) * 28 + 36)
            : Math.max(8, normalizedLevel * 0.75 + (index % 3) * 4)
          : 6;

        const colorClass = isAiSpeaking
          ? 'bg-gradient-to-t from-cyan-500 to-indigo-400 shadow-cyan-500/40 shadow-sm'
          : isActive
          ? 'bg-gradient-to-t from-emerald-500 to-teal-300 shadow-emerald-500/40 shadow-sm'
          : 'bg-slate-700/60';

        return (
          <motion.div
            key={index}
            animate={{
              height: `${Math.min(72, Math.max(6, baseHeight))}px`,
              opacity: isActive ? 0.95 : 0.4,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              mass: 0.5,
            }}
            className={`w-1.5 rounded-full transition-colors duration-200 ${colorClass}`}
          />
        );
      })}
    </div>
  );
};
