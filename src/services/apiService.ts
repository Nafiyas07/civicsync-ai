import { CivicChallenge, University, IndustryPartner, LiveCivicEvent, AIAnalysisResult } from '../types';

export const apiService = {
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  async getChallenges(): Promise<CivicChallenge[]> {
    const res = await fetch('/api/challenges');
    const data = await res.json();
    return data.challenges || [];
  },

  async saveChallenge(challenge: Partial<CivicChallenge>): Promise<CivicChallenge> {
    const res = await fetch('/api/challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(challenge),
    });
    const data = await res.json();
    return data.challenge;
  },

  async getPartners(): Promise<{ universities: University[]; industryPartners: IndustryPartner[] }> {
    const res = await fetch('/api/partners');
    return res.json();
  },

  async getEvents(): Promise<LiveCivicEvent[]> {
    const res = await fetch('/api/events');
    const data = await res.json();
    return data.events || [];
  },

  async sendVoiceTurn(
    history: Array<{ sender: 'citizen' | 'ai'; text: string }>,
    message: string
  ): Promise<{ text: string; language: string; isFollowUp: boolean; audioBase64?: string }> {
    const res = await fetch('/api/voice/turn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, message }),
    });
    return res.json();
  },

  async analyzeAndSynthesize(
    transcript: string,
    language?: string
  ): Promise<{ success: boolean; challenge: CivicChallenge; analysis: AIAnalysisResult }> {
    const res = await fetch('/api/voice/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, language }),
    });
    return res.json();
  },

  async requestTTS(text: string): Promise<string | null> {
    try {
      const res = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      return data.audioBase64 || null;
    } catch {
      return null;
    }
  },
};
