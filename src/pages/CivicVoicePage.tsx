import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  PhoneOff,
  Sparkles,
  Radio,
  FileText,
  Volume2,
  AlertCircle,
  Clock,
  Languages,
  CheckCircle2,
  Send,
  RefreshCw,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { useLiveVoice } from '../hooks/useLiveVoice';
import { AudioWaveform } from '../components/AudioWaveform';
import { DEMO_SCENARIOS } from '../data/initialData';
import { DemoScenario, VoiceSessionMessage } from '../types';

interface CivicVoicePageProps {
  onGenerateChallenge: (transcriptText: string, language?: string) => void;
  isProcessingChallenge?: boolean;
}

export const CivicVoicePage: React.FC<CivicVoicePageProps> = ({
  onGenerateChallenge,
  isProcessingChallenge = false,
}) => {
  const {
    voiceState,
    callDuration,
    transcript,
    currentInterimText,
    detectedLanguage,
    audioLevel,
    errorMessage,
    isMicPermissionGranted,
    startCall,
    endCall,
    sendTextMessage,
  } = useLiveVoice();

  const [activeTab, setActiveTab] = useState<'voice' | 'text'>('voice');
  const [typedInput, setTypedInput] = useState<string>('');
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario | null>(null);

  const isCallActive = voiceState === 'LISTENING' || voiceState === 'AI_SPEAKING' || voiceState === 'CONNECTING' || voiceState === 'PROCESSING';

  // Format call duration MM:SS
  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Compile full transcript for synthesis
  const compileTranscriptText = () => {
    if (transcript.length === 0 && typedInput.trim()) {
      return typedInput.trim();
    }
    return transcript.map((m) => `${m.sender === 'citizen' ? 'Citizen' : 'CivicSync'}: ${m.text}`).join('\n');
  };

  const handleRunChallengeGeneration = () => {
    const fullText = compileTranscriptText();
    if (!fullText) return;
    onGenerateChallenge(fullText, detectedLanguage);
  };

  const handleApplyScenario = (scenario: DemoScenario) => {
    setSelectedScenario(scenario);
    setTypedInput(scenario.prompt);
    setActiveTab('text');
  };

  const handleSendTyped = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedInput.trim()) return;
    const textToSend = typedInput;
    setTypedInput('');
    await sendTextMessage(textToSend);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Mic className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight font-mono">
              Civic Voice Interaction
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time spoken dialogue with Gemini 3.1 Live API • Multilingual Tamil, English, and Tanglish
          </p>
        </div>

        {/* Voice vs Text Toggle */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'voice'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Call</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'text'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Text Demo</span>
          </button>
        </div>
      </div>

      {/* Mic permission or general error banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-200 flex items-start gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-rose-300 font-mono">Microphone / Audio Alert</h4>
            <p className="mt-0.5 text-rose-200/90 leading-relaxed">{errorMessage}</p>
            <div className="mt-2.5 flex items-center gap-3">
              <button
                onClick={() => setActiveTab('text')}
                className="px-3 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800 border border-rose-700 text-[11px] font-semibold text-white"
              >
                Switch to Text Demo Fallback
              </button>
              <button
                onClick={startCall}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300"
              >
                Retry Voice Permission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Central Interaction Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Central Call Sphere & Status */}
        <div className="lg:col-span-7 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-[460px]">
          {/* Ambient pulse */}
          <div className={`absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none ${
            voiceState === 'AI_SPEAKING' ? 'bg-cyan-500/20' : isCallActive ? 'bg-emerald-500/20' : 'bg-emerald-500/5'
          }`} />

          {/* Top Status Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-10">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${
                voiceState === 'AI_SPEAKING'
                  ? 'bg-cyan-400 animate-pulse'
                  : voiceState === 'LISTENING'
                  ? 'bg-emerald-400 animate-ping'
                  : voiceState === 'CONNECTING'
                  ? 'bg-amber-400 animate-spin'
                  : 'bg-slate-600'
              }`} />
              <span className="text-xs font-mono font-bold text-slate-200">
                {voiceState === 'AI_SPEAKING'
                  ? 'CivicSync is speaking...'
                  : voiceState === 'LISTENING'
                  ? 'Listening to citizen...'
                  : voiceState === 'CONNECTING'
                  ? 'Initializing Gemini Live session...'
                  : voiceState === 'PROCESSING'
                  ? 'Analyzing citizen speech...'
                  : voiceState === 'ENDED'
                  ? 'Call Completed'
                  : 'Ready for Civic Call'}
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatDuration(callDuration)}</span>
            </div>
          </div>

          {/* Center Call Sphere / Visualizer */}
          <div className="my-auto py-8 text-center relative z-10 flex flex-col items-center justify-center">
            {/* Pulsing Orb */}
            <div className="relative mb-6">
              <motion.div
                animate={{
                  scale: isCallActive ? [1, 1.08, 1] : 1,
                  opacity: isCallActive ? [0.6, 0.9, 0.6] : 0.4,
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: 'easeInOut',
                }}
                className={`absolute inset-0 rounded-full blur-2xl ${
                  voiceState === 'AI_SPEAKING'
                    ? 'bg-cyan-500'
                    : isCallActive
                    ? 'bg-emerald-500'
                    : 'bg-slate-700'
                }`}
              />

              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center p-1 border-2 transition-all relative ${
                  voiceState === 'AI_SPEAKING'
                    ? 'border-cyan-400 bg-slate-950 shadow-xl shadow-cyan-500/40'
                    : isCallActive
                    ? 'border-emerald-400 bg-slate-950 shadow-xl shadow-emerald-500/40'
                    : 'border-slate-700 bg-slate-900 shadow-lg'
                }`}
              >
                {voiceState === 'AI_SPEAKING' ? (
                  <Volume2 className="w-12 h-12 text-cyan-300 animate-bounce" />
                ) : isCallActive ? (
                  <Mic className="w-12 h-12 text-emerald-400" />
                ) : (
                  <Mic className="w-12 h-12 text-slate-500" />
                )}
              </div>
            </div>

            {/* Prompt Prompt / Subtitle */}
            {!isCallActive ? (
              <div className="max-w-md">
                <h3 className="text-base font-bold text-white mb-1">
                  Tell CivicSync about a problem in your community.
                </h3>
                <p className="text-xs text-slate-400">
                  Speak naturally in Tamil (தமிழ்), English, or Tanglish. CivicSync will listen and ask relevant follow-up questions.
                </p>
              </div>
            ) : (
              <div className="w-full max-w-md">
                <AudioWaveform
                  isActive={isCallActive}
                  isAiSpeaking={voiceState === 'AI_SPEAKING'}
                  level={audioLevel}
                  barCount={32}
                />
                {currentInterimText && (
                  <p className="text-xs font-mono text-cyan-300 mt-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-cyan-800/40">
                    "{currentInterimText}..."
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Call Buttons */}
          <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
            {!isCallActive ? (
              <button
                id="btn-start-civic-call"
                onClick={startCall}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:brightness-110 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-950/60 active:scale-95 transition-all"
              >
                <Mic className="w-5 h-5" />
                <span>🎙 START CIVIC CALL</span>
              </button>
            ) : (
              <div className="flex items-center gap-3 w-full">
                <button
                  id="btn-end-civic-call"
                  onClick={endCall}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-950/60 active:scale-95 transition-all"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>END CIVIC CALL</span>
                </button>
              </div>
            )}

            {/* Generate Civic Challenge CTA */}
            <button
              id="btn-generate-challenge"
              disabled={transcript.length === 0 && !typedInput.trim()}
              onClick={handleRunChallengeGeneration}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-bold font-mono transition-all ${
                transcript.length > 0 || typedInput.trim()
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-950/50 cursor-pointer active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Civic Challenge</span>
            </button>
          </div>
        </div>

        {/* Right 5 cols: Live Transcript & Multi-turn Feed */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Live Transcript & Dialogue
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                {detectedLanguage}
              </span>
            </div>

            {/* Transcript Messages Scroll */}
            <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
              {transcript.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  <p>No conversation yet.</p>
                  <p className="mt-1">Click "Start Civic Call" or type a problem below.</p>
                </div>
              ) : (
                transcript.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-2xl text-xs ${
                      msg.sender === 'citizen'
                        ? 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-100 ml-4'
                        : 'bg-slate-950/80 border border-slate-800 text-slate-200 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 font-mono text-[10px]">
                      <span className={msg.sender === 'citizen' ? 'text-emerald-400 font-bold' : 'text-cyan-400 font-bold'}>
                        {msg.sender === 'citizen' ? '👤 Citizen Voice' : '🤖 CivicSync AI'}
                      </span>
                      <span className="text-slate-500">{msg.timestamp}</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Text input for multi-turn typing fallback */}
          <form onSubmit={handleSendTyped} className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
            <input
              id="citizen-text-input"
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="Type in Tamil, English, or Tanglish..."
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-emerald-500/60 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none font-sans"
            />
            <button
              type="submit"
              disabled={!typedInput.trim()}
              className={`p-2.5 rounded-xl transition-all ${
                typedInput.trim()
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  : 'bg-slate-800 text-slate-600'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Curated Demo Scenarios */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Curated Hackathon Demo Scenarios
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Click any scenario to simulate citizen voice input
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {DEMO_SCENARIOS.map((sc) => (
            <div
              key={sc.id}
              onClick={() => handleApplyScenario(sc)}
              className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                    {sc.language}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{sc.location}</span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {sc.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  "{sc.prompt}"
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-emerald-400">
                <span>Load Scenario</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
