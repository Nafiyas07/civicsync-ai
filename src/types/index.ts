export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ChallengeStatus = 'NEW' | 'MATCHED' | 'IN_PROGRESS' | 'SOLVED';

export interface CivicChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  duration: string;
  affectedPeople: number;
  severity: SeverityLevel;
  language: string; // 'Tamil' | 'English' | 'Tanglish'
  sdg: string;
  requiredSkills: string[];
  universityDisciplines: string[];
  industryCapabilities: string[];
  solutionConcept: string;
  impact: string;
  status: ChallengeStatus;
  createdAt: string;
  rootCauseHypothesis?: string;
  citizenVoiceSnippet?: string;
  matchedUniversityId?: string;
  matchedIndustryId?: string;
  universityMatchScore?: number;
  industryMatchScore?: number;
  collaborationMatchScore?: number;
  universityMatchReasons?: string[];
  industryMatchReasons?: string[];
}

export interface University {
  id: string;
  name: string;
  focus: string;
  location: string;
  disciplines: string[];
  skills: string[];
  activeProjects: number;
  verifiedBadge: boolean;
  avatarColor: string;
}

export interface IndustryPartner {
  id: string;
  name: string;
  sector: string;
  capabilities: string[];
  pilotReadiness: 'High (1-2 Weeks)' | 'Medium (1 Month)' | 'Enterprise Pilot';
  prototypePartnerLabel: string;
  avatarColor: string;
  headquarters: string;
}

export interface VoiceSessionMessage {
  id: string;
  sender: 'citizen' | 'ai';
  text: string;
  timestamp: string;
  language?: string;
  audioBase64?: string;
}

export interface LiveCivicEvent {
  id: string;
  timestamp: string;
  type:
    | 'voice_call'
    | 'lang_detect'
    | 'problem_classified'
    | 'severity_calc'
    | 'university_match'
    | 'industry_match'
    | 'solution_gen'
    | 'challenge_created';
  message: string;
  category: string;
  badgeColor?: string;
}

export interface DemoScenario {
  id: string;
  title: string;
  language: 'Tamil' | 'English' | 'Tanglish';
  prompt: string;
  category: string;
  location: string;
  description: string;
}

export interface AIAnalysisResult {
  title: string;
  description: string;
  category: string;
  location: string;
  duration: string;
  affectedPeople: number;
  severity: SeverityLevel;
  language: string;
  sdg: string;
  requiredSkills: string[];
  universityDisciplines: string[];
  industryCapabilities: string[];
  rootCauseHypothesis: string;
  solutionConcept: string;
  impact: string;
  matchedUniversity: {
    name: string;
    score: number;
    reasons: string[];
  };
  matchedIndustry: {
    name: string;
    score: number;
    reasons: string[];
  };
  collaborationScore: number;
}
