import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  Sparkles,
  ShieldCheck,
  Zap,
  MapPin,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Tag,
} from 'lucide-react';
import { IndustryPartner, CivicChallenge } from '../types';

interface IndustryNetworkPageProps {
  industryPartners: IndustryPartner[];
  challenges: CivicChallenge[];
}

export const IndustryNetworkPage: React.FC<IndustryNetworkPageProps> = ({
  industryPartners,
  challenges,
}) => {
  const [selectedPartner, setSelectedPartner] = useState<IndustryPartner | null>(industryPartners[0] || null);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Building2 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight font-mono">
              Industry Innovation Partners
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise scale, IoT cloud backends, and field deployment capacity for civic pilots
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-purple-300 bg-purple-950/60 px-3 py-1.5 rounded-xl border border-purple-800/40">
            {industryPartners.length} Enterprise Capabilities Mapped
          </span>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {industryPartners.map((partner) => {
          const matchedChallenges = challenges.filter(
            (c) => c.matchedIndustryId === partner.id || c.industryCapabilities.some((cap) => partner.capabilities.includes(cap))
          );

          return (
            <motion.div
              key={partner.id}
              whileHover={{ y: -3 }}
              onClick={() => setSelectedPartner(partner)}
              className={`bg-slate-900/80 border rounded-2xl p-5 shadow-xl flex flex-col justify-between cursor-pointer transition-all ${
                selectedPartner?.id === partner.id
                  ? 'border-purple-500 ring-1 ring-purple-500/50 shadow-purple-950/40'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${partner.avatarColor} flex items-center justify-center text-slate-950 font-bold shadow-md`}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {partner.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{partner.headquarters}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/50 whitespace-nowrap">
                    {partner.prototypePartnerLabel}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {partner.sector}
                </p>

                {/* Capabilities tags */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                    Enterprise Capabilities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {partner.capabilities.map((cap) => (
                      <span
                        key={cap}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-950 text-purple-300 border border-slate-800"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pilot readiness */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Pilot Deployment Readiness
                  </span>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{partner.pilotReadiness}</span>
                  </div>
                </div>
              </div>

              {/* Matched challenge count */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">
                  {matchedChallenges.length} Challenges Aligned
                </span>
                <span className="text-[11px] font-mono text-purple-300 hover:underline">
                  Inspect Capability Map →
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
            Prototype Partner Transparency Notice
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          All industry profiles listed are conceptual prototype partners designed to demonstrate the feasibility of public-private-academic collaboration. CivicSync AI matches municipal challenges to enterprise capacity without implying existing legal contracts or emergency dispatch mandates.
        </p>
      </div>
    </div>
  );
};
