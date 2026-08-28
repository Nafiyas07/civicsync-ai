import React from 'react';
import {
  Mic,
  Activity,
  Layers,
  GraduationCap,
  Building2,
  Share2,
  BarChart3,
  Radio,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export type NavTab =
  | 'command-center'
  | 'voice-reports'
  | 'challenges'
  | 'universities'
  | 'industries'
  | 'collaboration'
  | 'analytics';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onQuickStartCall: () => void;
  isCallActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onQuickStartCall,
  isCallActive = false,
}) => {
  const navItems: Array<{ id: NavTab; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'command-center', label: 'Command Center', icon: <Activity className="w-4 h-4" /> },
    { id: 'voice-reports', label: 'Civic Voice', icon: <Mic className="w-4 h-4" />, badge: isCallActive ? 'LIVE' : undefined },
    { id: 'challenges', label: 'Civic Challenges', icon: <Layers className="w-4 h-4" /> },
    { id: 'universities', label: 'University Network', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'industries', label: 'Industry Network', icon: <Building2 className="w-4 h-4" /> },
    { id: 'collaboration', label: 'Collaboration Hub', icon: <Share2 className="w-4 h-4" /> },
    { id: 'analytics', label: 'Impact Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      {/* Top status notification strip */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border-b border-slate-800/40 px-4 py-1 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px] text-emerald-400 font-semibold tracking-wide">
            GEMINI 3.1 LIVE ENGINE READY
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 hidden sm:inline">Multilingual Voice Support (Tamil • English • Tanglish)</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span className="px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300 border border-slate-700/60">
            University Hackathon Prototype
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div
            id="brand-logo"
            onClick={() => onSelectTab('command-center')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-[1px] shadow-lg shadow-emerald-950/50">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Radio className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-100 via-white to-slate-300 bg-clip-text text-transparent">
                  CIVICSYNC
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded-md font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-tight -mt-0.5 hidden sm:block">
                From Citizen Voice to Collective Action
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-rose-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* CTA Action */}
          <div className="flex items-center gap-2.5">
            <button
              id="header-start-call-btn"
              onClick={onQuickStartCall}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 ${
                isCallActive
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40 animate-pulse'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-950/50 hover:shadow-emerald-500/20'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{isCallActive ? 'Call in Progress' : 'Start Civic Call'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Scroll */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-900/60 no-scrollbar">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                  isActive
                    ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-800/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
