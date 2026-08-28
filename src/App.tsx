import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { CommandCenter } from './pages/CommandCenter';
import { CivicVoicePage } from './pages/CivicVoicePage';
import { ChallengesPage } from './pages/ChallengesPage';
import { UniversityNetworkPage } from './pages/UniversityNetworkPage';
import { IndustryNetworkPage } from './pages/IndustryNetworkPage';
import { CollaborationHubPage } from './pages/CollaborationHubPage';
import { ImpactAnalyticsPage } from './pages/ImpactAnalyticsPage';
import { AiPipelineModal } from './components/AiPipelineModal';
import { apiService } from './services/apiService';
import {
  CivicChallenge,
  University,
  IndustryPartner,
  LiveCivicEvent,
  DemoScenario,
  AIAnalysisResult,
} from './types';
import {
  INITIAL_CHALLENGES,
  INITIAL_UNIVERSITIES,
  INITIAL_INDUSTRY_PARTNERS,
  INITIAL_LIVE_EVENTS,
} from './data/initialData';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('command-center');
  const [challenges, setChallenges] = useState<CivicChallenge[]>(INITIAL_CHALLENGES);
  const [universities, setUniversities] = useState<University[]>(INITIAL_UNIVERSITIES);
  const [industryPartners, setIndustryPartners] = useState<IndustryPartner[]>(INITIAL_INDUSTRY_PARTNERS);
  const [liveEvents, setLiveEvents] = useState<LiveCivicEvent[]>(INITIAL_LIVE_EVENTS);

  // AI Pipeline Modal State
  const [isAiPipelineOpen, setIsAiPipelineOpen] = useState<boolean>(false);
  const [lastGeneratedChallenge, setLastGeneratedChallenge] = useState<CivicChallenge | null>(null);
  const [lastAnalysisData, setLastAnalysisData] = useState<AIAnalysisResult | null>(null);
  const [isProcessingChallenge, setIsProcessingChallenge] = useState<boolean>(false);

  // Fetch live store from backend on mount
  useEffect(() => {
    async function loadBackendData() {
      try {
        const [cList, pData, eList] = await Promise.all([
          apiService.getChallenges(),
          apiService.getPartners(),
          apiService.getEvents(),
        ]);
        if (cList && cList.length > 0) setChallenges(cList);
        if (pData?.universities && pData.universities.length > 0) setUniversities(pData.universities);
        if (pData?.industryPartners && pData.industryPartners.length > 0) setIndustryPartners(pData.industryPartners);
        if (eList && eList.length > 0) setLiveEvents(eList);
      } catch (err) {
        console.warn('Using local fallback dataset:', err);
      }
    }
    loadBackendData();
  }, []);

  // Handle Challenge Synthesis from Spoken Voice or Text Input
  const handleGenerateChallenge = async (transcriptText: string, language?: string) => {
    setIsProcessingChallenge(true);
    setIsAiPipelineOpen(true);

    try {
      // Call backend AI service
      const res = await apiService.analyzeAndSynthesize(transcriptText, language);
      if (res && res.challenge) {
        setLastGeneratedChallenge(res.challenge);
        setLastAnalysisData(res.analysis);
        setChallenges((prev) => [res.challenge, ...prev.filter((c) => c.id !== res.challenge.id)]);

        // Add live event
        const newEvent: LiveCivicEvent = {
          id: `evt-${Date.now()}`,
          type: 'challenge_created',
          message: `New challenge structured: "${res.challenge.title}" (${res.challenge.severity})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category: res.challenge.category,
        };
        setLiveEvents((prev) => [newEvent, ...prev]);
      }
    } catch (err) {
      console.error('Error generating challenge from transcript:', err);
    } finally {
      setIsProcessingChallenge(false);
    }
  };

  // Complete AI Pipeline and Navigate to the created Challenge
  const handleCompletePipeline = () => {
    setIsAiPipelineOpen(false);
    setCurrentTab('challenges');
  };

  // Handle demo scenario trigger
  const handleSelectScenario = (scenario: DemoScenario) => {
    setCurrentTab('voice-reports');
  };

  // Quick inspect from command center
  const handleViewChallengeDetails = (challenge: CivicChallenge) => {
    setCurrentTab('challenges');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onQuickStartCall={() => setCurrentTab('voice-reports')}
        isCallActive={false}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'command-center' && (
          <CommandCenter
            challenges={challenges}
            liveEvents={liveEvents}
            onStartCall={() => setCurrentTab('voice-reports')}
            onOpenTextDemo={() => setCurrentTab('voice-reports')}
            onSelectScenario={handleSelectScenario}
            onViewChallengeDetails={handleViewChallengeDetails}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'voice-reports' && (
          <CivicVoicePage
            onGenerateChallenge={handleGenerateChallenge}
            isProcessingChallenge={isProcessingChallenge}
          />
        )}

        {currentTab === 'challenges' && (
          <ChallengesPage
            challenges={challenges}
            onStartNewReport={() => setCurrentTab('voice-reports')}
          />
        )}

        {currentTab === 'universities' && (
          <UniversityNetworkPage
            universities={universities}
            challenges={challenges}
          />
        )}

        {currentTab === 'industries' && (
          <IndustryNetworkPage
            industryPartners={industryPartners}
            challenges={challenges}
          />
        )}

        {currentTab === 'collaboration' && (
          <CollaborationHubPage
            challenges={challenges}
            universities={universities}
            industryPartners={industryPartners}
            onStartNewReport={() => setCurrentTab('voice-reports')}
          />
        )}

        {currentTab === 'analytics' && (
          <ImpactAnalyticsPage challenges={challenges} />
        )}
      </main>

      {/* AI Pipeline Synthesis Modal */}
      <AiPipelineModal
        isOpen={isAiPipelineOpen}
        onComplete={handleCompletePipeline}
        analysisData={lastAnalysisData}
      />

      {/* Subtle Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">CIVICSYNC AI</span>
            <span>•</span>
            <span>University Hackathon Prototype</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Powered by Gemini 3.1 Live API & Multilingual Natural Dialogue • All partner entities are prototype demonstrations
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
