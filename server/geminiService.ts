import { GoogleGenAI, Modality, Type } from '@google/genai';
import { AIAnalysisResult } from '../src/types';

// Lazy initialization of GoogleGenAI SDK to avoid startup crashes if key is pending
let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION_VOICE_AGENT = `You are CivicSync AI, a multilingual civic innovation assistant designed for a university hackathon prototype.
Your job is to understand societal challenges reported by citizens in Tamil, English, or Tanglish (Tamil-English code-switching).

Personality & Guidelines:
- Be respectful, concise, empathetic, professional, natural, and easy to understand.
- Never overwhelm the citizen with many questions at once.
- Always ask at most ONE most useful follow-up question per turn.
- Automatically detect the citizen's language (Tamil, English, or Tanglish) and respond naturally in the exact same language/dialect.
- If the citizen speaks Tamil, respond in clean, natural, colloquial spoken Tamil script.
- If the citizen speaks Tanglish (e.g. "Enga area la water supply romba irregular ah iruku"), respond in friendly, understandable Tanglish or Tamil.
- If the citizen speaks English, respond in clear, empathetic English.
- Collect critical context: what the core problem is, location, duration, number of affected people, urgency/safety risks, and root context.
- Keep spoken replies short (under 2 sentences) so voice conversation flows smoothly.
- Do NOT claim that CivicSync has directly contacted a real government department or real company. Clearly maintain prototype transparency.`;

export async function generateCivicAnalysis(
  conversationOrText: string,
  declaredLanguage?: string
): Promise<AIAnalysisResult> {
  const ai = getGeminiClient();

  if (!ai) {
    return getFallbackAnalysis(conversationOrText, declaredLanguage);
  }

  try {
    const prompt = `Analyze this citizen civic report or multi-turn voice conversation into a structured Civic Challenge and academic/industry matching solution.

Report Transcript:
"""
${conversationOrText}
"""

Ensure you strictly extract or realistically estimate all fields.
Match with relevant university capabilities (e.g. IoT, Embedded Systems, Data Science, Environmental Engineering, Robotics, AI, Hydrology) and industry capabilities (Smart City IoT, Dynamic Telematics, Waste Operations, Acoustic Water Sensing, Low-power LoRaWAN).
Estimate affected people and severity (LOW | MEDIUM | HIGH | CRITICAL).
Map to appropriate UN Sustainable Development Goal (SDG).
Label all estimates honestly.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are the CivicSync AI Challenge Generation Engine. Return clean structured JSON mapping citizen voice to university and industry innovation.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Clear, compelling civic challenge title' },
            description: { type: Type.STRING, description: 'One-paragraph problem statement' },
            category: {
              type: Type.STRING,
              description: 'One of: Waste Management, Water & Sanitation, Public Safety, Transportation, Education, Healthcare, Environment, Energy, Accessibility, Agriculture, Digital Governance, Other',
            },
            location: { type: Type.STRING, description: 'Extracted or inferred locality/city' },
            duration: { type: Type.STRING, description: 'How long the problem has persisted (e.g. 14 days)' },
            affectedPeople: { type: Type.INTEGER, description: 'Estimated number of affected citizens' },
            severity: {
              type: Type.STRING,
              enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
              description: 'Calculated urgency and safety risk',
            },
            language: { type: Type.STRING, description: 'Detected language (Tamil, English, or Tanglish)' },
            sdg: { type: Type.STRING, description: 'Mapped UN SDG (e.g. SDG 11: Sustainable Cities & Communities)' },
            requiredSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-5 key technical disciplines or skills needed',
            },
            universityDisciplines: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2-4 academic departments best suited to research and prototype solutions',
            },
            industryCapabilities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2-4 industry capabilities needed for field scaling and deployment',
            },
            rootCauseHypothesis: { type: Type.STRING, description: 'Plausible root cause of this civic bottleneck' },
            solutionConcept: { type: Type.STRING, description: 'Concise initial AI & engineering collaborative solution concept' },
            impact: { type: Type.STRING, description: 'Expected societal metric and improvement' },
            matchedUniversity: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: 'e.g. Tech University Alpha or Engineering University Beta or Green University Gamma' },
                score: { type: Type.INTEGER, description: 'Match score between 80 and 98' },
                reasons: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '2-3 specific capability overlap reasons',
                },
              },
              required: ['name', 'score', 'reasons'],
            },
            matchedIndustry: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: 'e.g. UrbanTech Solutions, EcoRoute Systems, SafeGrid Technologies, AquaSense Innovations' },
                score: { type: Type.INTEGER, description: 'Match score between 80 and 98' },
                reasons: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '2-3 specific industry capability overlap reasons',
                },
              },
              required: ['name', 'score', 'reasons'],
            },
            collaborationScore: { type: Type.INTEGER, description: 'Overall joint synergy percentage (80-98)' },
          },
          required: [
            'title',
            'description',
            'category',
            'location',
            'duration',
            'affectedPeople',
            'severity',
            'language',
            'sdg',
            'requiredSkills',
            'universityDisciplines',
            'industryCapabilities',
            'rootCauseHypothesis',
            'solutionConcept',
            'impact',
            'matchedUniversity',
            'matchedIndustry',
            'collaborationScore',
          ],
        },
      },
    });

    const jsonText = response.text?.trim() || '{}';
    const parsed = JSON.parse(jsonText) as AIAnalysisResult;
    return parsed;
  } catch (error) {
    console.error('Error in generateCivicAnalysis with Gemini:', error);
    return getFallbackAnalysis(conversationOrText, declaredLanguage);
  }
}

export async function generateVoiceTurnReply(
  history: Array<{ sender: 'citizen' | 'ai'; text: string }>,
  currentMessage: string
): Promise<{ text: string; language: string; isFollowUp: boolean }> {
  const ai = getGeminiClient();

  if (!ai) {
    return getFallbackTurnReply(currentMessage);
  }

  try {
    const formattedHistory = history
      .slice(-6)
      .map((m) => `${m.sender === 'citizen' ? 'Citizen' : 'CivicSync AI'}: ${m.text}`)
      .join('\n');

    const prompt = `Conversation history:
${formattedHistory}
Citizen: ${currentMessage}

Respond naturally as CivicSync AI.
If you need more details, ask ONE brief empathetic follow-up question (e.g. location, duration, or how many people are affected).
If enough information has been given (problem, location/context, and duration or impact), acknowledge with empathy and inform them that CivicSync is ready to synthesize the Civic Challenge.
Keep reply under 25 words in the exact same language (Tamil, Tanglish, or English).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_VOICE_AGENT,
        temperature: 0.7,
      },
    });

    const text = response.text?.trim() || 'I understand your concern. Could you tell me which area or locality this is in?';

    // Simple language detector
    const hasTamilChar = /[\u0B80-\u0BFF]/.test(text + currentMessage);
    const isTanglish = /(enga|romba|iruku|illa|aache|panna|la|da|anna)/i.test(currentMessage);
    const language = hasTamilChar ? 'Tamil' : isTanglish ? 'Tanglish' : 'English';

    return {
      text,
      language,
      isFollowUp: text.includes('?') || text.includes('எத்தனை') || text.includes('எந்த'),
    };
  } catch (err) {
    console.error('Error generating voice turn reply:', err);
    return getFallbackTurnReply(currentMessage);
  }
}

export async function generateSpeechTTS(text: string): Promise<string | null> {
  const ai = getGeminiClient();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.warn('TTS generation notice (will use browser client audio playback fallback):', error);
    return null;
  }
}

function getFallbackTurnReply(text: string): { text: string; language: string; isFollowUp: boolean } {
  const lower = text.toLowerCase();
  const hasTamil = /[\u0B80-\u0BFF]/.test(text);

  if (hasTamil) {
    if (text.includes('நாட்கள்') || text.includes('வாரம்') || text.includes('two') || text.includes('2')) {
      return {
        text: 'புரிகிறது. இந்த பிரச்சனையால் சுமார் எத்தனை குடும்பங்கள் பாதிக்கப்படுகிறார்கள்?',
        language: 'Tamil',
        isFollowUp: true,
      };
    }
    return {
      text: 'புரிகிறது. இந்த பிரச்சனை எத்தனை நாட்களாக நீடிக்கிறது?',
      language: 'Tamil',
      isFollowUp: true,
    };
  }

  if (lower.includes('enga') || lower.includes('romba') || lower.includes('iruku') || lower.includes('illa')) {
    return {
      text: 'Romba clear ah purithu. Intha problem approximately ethana days ah iruku?',
      language: 'Tanglish',
      isFollowUp: true,
    };
  }

  if (lower.includes('week') || lower.includes('day') || lower.includes('month') || lower.includes('long')) {
    return {
      text: 'Thank you for explaining. Approximately how many residents or households are affected in this neighborhood?',
      language: 'English',
      isFollowUp: true,
    };
  }

  return {
    text: 'I understand the situation. Which specific neighborhood or landmark is this located in?',
    language: 'English',
    isFollowUp: true,
  };
}

function getFallbackAnalysis(text: string, declaredLanguage?: string): AIAnalysisResult {
  const lower = text.toLowerCase();
  const hasTamil = /[\u0B80-\u0BFF]/.test(text);

  if (lower.includes('garbage') || lower.includes('waste') || lower.includes('குப்பை') || lower.includes('சாக்கடை')) {
    return {
      title: 'Smart Waste Collection & Overflow Mitigation Grid',
      description: 'Irregular solid waste collection schedules causing sanitary overflow, foul odors, and pedestrian disruption in residential corridors.',
      category: 'Waste Management',
      location: 'Velachery, Chennai (AI Estimated)',
      duration: '14 days',
      affectedPeople: 4500,
      severity: 'HIGH',
      language: hasTamil ? 'Tamil' : declaredLanguage || 'Tamil',
      sdg: 'SDG 11: Sustainable Cities & Communities',
      requiredSkills: ['IoT Ultrasonic Fill-Level Sensors', 'Dynamic Vehicle Routing Algorithms', 'Municipal Telematics', 'Citizen Mobile Reporting'],
      universityDisciplines: ['Data Science', 'Urban Informatics', 'Environmental Engineering'],
      industryCapabilities: ['Route Optimization', 'Smart City IoT', 'Waste Operations'],
      rootCauseHypothesis: 'Static municipal truck dispatch schedules failing to accommodate commercial packaging volume spikes.',
      solutionConcept: 'Solar-powered optical fill-level monitoring bins paired with an automated dynamic routing engine for municipal collection fleets.',
      impact: 'AI estimate: 85% reduction in public overflow duration and 32% lower municipal truck fuel consumption.',
      matchedUniversity: {
        name: 'Tech University Alpha',
        score: 94,
        reasons: ['IoT sensor telemetry lab', 'Urban Data Science research team', 'Proven computer vision edge classification thesis'],
      },
      matchedIndustry: {
        name: 'EcoRoute Systems',
        score: 92,
        reasons: ['Commercial fleet routing platform', 'Active municipal gateway integration', 'Real-time dispatch APIs'],
      },
      collaborationScore: 93,
    };
  }

  if (lower.includes('light') || lower.includes('dark') || lower.includes('விளக்கு') || lower.includes('night') || lower.includes('safety')) {
    return {
      title: 'Adaptive Solar-Assisted Street Illumination Corridor',
      description: 'Persistent street lighting failure across critical pedestrian avenues leading to safety risks for night commuters and students.',
      category: 'Public Safety',
      location: 'Gandhipuram, Coimbatore (AI Estimated)',
      duration: '14 days',
      affectedPeople: 8200,
      severity: 'HIGH',
      language: hasTamil ? 'Tamil' : declaredLanguage || 'English',
      sdg: 'SDG 7: Affordable & Clean Energy',
      requiredSkills: ['Microcontroller Firmware', 'Solar Battery Management', 'LoRaWAN Mesh', 'Pedestrian Motion Sensing'],
      universityDisciplines: ['Robotics Engineering', 'Electrical Engineering', 'Mechatronics'],
      industryCapabilities: ['Public Safety', 'Low-power LoRaWAN', 'Grid Automation'],
      rootCauseHypothesis: 'Subterranean feeder cable moisture degradation following monsoon rainfall.',
      solutionConcept: 'Mesh-networked adaptive solar LED luminaires with PIR motion-boosted luminescence and remote health telemetry.',
      impact: 'AI estimate: 100% illumination reliability across a 2.5km corridor with zero reliance on fluctuating grid power.',
      matchedUniversity: {
        name: 'Engineering University Beta',
        score: 91,
        reasons: ['Embedded Systems & Microgrid testbed', 'Hardware rapid-prototyping lab', 'Renewable electronics patents'],
      },
      matchedIndustry: {
        name: 'SafeGrid Technologies',
        score: 89,
        reasons: ['City-wide LoRaWAN gateway operations', 'Smart pole hardware certification', '24/7 remote diagnostic NOC'],
      },
      collaborationScore: 90,
    };
  }

  if (lower.includes('water') || lower.includes('தண்ணீர்') || lower.includes('tanker') || lower.includes('pipe') || lower.includes('pressure')) {
    return {
      title: 'Acoustic-Monitored Equitable Water Distribution Grid',
      description: 'Severe water pressure asymmetry resulting in dry taps for tail-end households while intermediate junctions face pipe bursts.',
      category: 'Water & Sanitation',
      location: 'Anna Nagar, Madurai (AI Estimated)',
      duration: '21 days',
      affectedPeople: 12000,
      severity: 'CRITICAL',
      language: hasTamil ? 'Tamil' : declaredLanguage || 'Tanglish',
      sdg: 'SDG 6: Clean Water & Sanitation',
      requiredSkills: ['Acoustic Leak Detection', 'Hydraulic Grid Simulation', 'Motorized Balancing Valves', 'Citizen Water Status Portal'],
      universityDisciplines: ['Hydrology', 'Environmental Engineering', 'Civil Infrastructure'],
      industryCapabilities: ['Acoustic Sensing', 'Water Quality Analytics', 'Valve Automation'],
      rootCauseHypothesis: 'Unregulated upstream booster pumps creating localized vacuum and pressure starvation at gradient extremes.',
      solutionConcept: 'Clamp-on acoustic pressure telemetry sensors coupled with automated motorized micro-balancing valves.',
      impact: 'AI estimate: Equitable 4-hour daily potable water access for 12,000 residents and 28% reduction in pipeline losses.',
      matchedUniversity: {
        name: 'Green University Gamma',
        score: 96,
        reasons: ['Regional Hydrology modeling laboratory', 'Water distribution sensor testbench', 'Active municipal advisory council'],
      },
      matchedIndustry: {
        name: 'AquaSense Innovations',
        score: 95,
        reasons: ['Industrial acoustic pipe clamp sensors', 'Low-power telemetry backend', 'Rapid municipal field deployment team'],
      },
      collaborationScore: 95,
    };
  }

  return {
    title: 'Civic Community Infrastructure Optimization',
    description: `Reported community challenge: ${text.slice(0, 180)}... requires multi-disciplinary academic and industry intervention.`,
    category: 'Environment',
    location: 'Tamil Nadu Urban Sector (AI Estimated)',
    duration: '10 days',
    affectedPeople: 3500,
    severity: 'MEDIUM',
    language: hasTamil ? 'Tamil' : declaredLanguage || 'English',
    sdg: 'SDG 11: Sustainable Cities & Communities',
    requiredSkills: ['IoT Sensor Telemetry', 'Civic Data Analytics', 'Mobile Citizen Alerting'],
    universityDisciplines: ['Urban Informatics', 'Computer Science', 'Environmental Engineering'],
    industryCapabilities: ['Smart City IoT', 'Cloud Platforms', 'Sensors'],
    rootCauseHypothesis: 'Lack of automated real-time field status visibility for municipal zone supervisors.',
    solutionConcept: 'Edge-connected diagnostic telemetry nodes feeding an open civic analytics dashboard for prioritized maintenance dispatch.',
    impact: 'AI estimate: 60% faster resolution turnaround and direct transparency for 3,500 residents.',
    matchedUniversity: {
      name: 'Tech University Alpha',
      score: 89,
      reasons: ['Urban Informatics research unit', 'Rapid IoT hardware fabrication', 'Citizen science data pipelines'],
    },
    matchedIndustry: {
      name: 'UrbanTech Solutions',
      score: 87,
      reasons: ['Cloud sensor gateway integration', 'Smart city dashboard suite', 'Production-grade field support'],
    },
    collaborationScore: 88,
  };
}
export { SYSTEM_INSTRUCTION_VOICE_AGENT };
