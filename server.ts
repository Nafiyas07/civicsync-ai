import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import { WebSocket, WebSocketServer } from 'ws';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import {
  generateCivicAnalysis,
  generateVoiceTurnReply,
  generateSpeechTTS,
  SYSTEM_INSTRUCTION_VOICE_AGENT,
  getGeminiClient,
} from './server/geminiService';
import {
  INITIAL_CHALLENGES,
  INITIAL_UNIVERSITIES,
  INITIAL_INDUSTRY_PARTNERS,
  INITIAL_LIVE_EVENTS,
} from './src/data/initialData';
import { CivicChallenge, LiveCivicEvent } from './src/types';

dotenv.config();

const PORT = 3000;
const app = express();
app.use(express.json({ limit: '15mb' }));

// In-memory runtime database for the prototype
let challengesStore: CivicChallenge[] = [...INITIAL_CHALLENGES];
let liveEventsStore: LiveCivicEvent[] = [...INITIAL_LIVE_EVENTS];

// ----------------- API ROUTES ----------------- //

// Health check & environment validation
app.get('/api/health', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'ok',
    appName: 'CivicSync AI',
    tagline: 'From Citizen Voice to Collective Action',
    geminiConfigured: hasKey,
    version: '1.0.0-hackathon-preview',
  });
});

// Ephemeral Live Token endpoint (for client-to-Gemini direct or bridge verification)
app.post('/api/ephemeral-token', async (req, res) => {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        available: false,
        message: 'GEMINI_API_KEY not set on server. Using server-assisted bridge & fallback.',
      });
    }
    // Return connection config status
    res.json({
      available: true,
      model: 'gemini-3.1-flash-live-preview',
      voice: 'Kore',
      supportedLanguages: ['Tamil', 'English', 'Tanglish'],
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get all civic challenges
app.get('/api/challenges', (req, res) => {
  res.json({
    challenges: challengesStore,
    total: challengesStore.length,
  });
});

// Post a new civic challenge
app.post('/api/challenges', (req, res) => {
  const newChallenge = req.body as CivicChallenge;
  if (!newChallenge.id) {
    newChallenge.id = `CS-${String(challengesStore.length + 1).padStart(3, '0')}`;
  }
  if (!newChallenge.createdAt) {
    newChallenge.createdAt = new Date().toISOString();
  }

  challengesStore.unshift(newChallenge);

  // Push new live event
  const newEvt: LiveCivicEvent = {
    id: `evt-${Date.now()}`,
    timestamp: 'Just now',
    type: 'solution_gen',
    message: `Challenge #${newChallenge.id} registered: "${newChallenge.title}"`,
    category: newChallenge.category,
    badgeColor: 'emerald',
  };
  liveEventsStore.unshift(newEvt);

  res.status(201).json({ success: true, challenge: newChallenge });
});

// Partners data
app.get('/api/partners', (req, res) => {
  res.json({
    universities: INITIAL_UNIVERSITIES,
    industryPartners: INITIAL_INDUSTRY_PARTNERS,
  });
});

// Live activity events feed
app.get('/api/events', (req, res) => {
  res.json({
    events: liveEventsStore.slice(0, 20),
  });
});

// Voice Multi-Turn Conversational Reply
app.post('/api/voice/turn', async (req, res) => {
  try {
    const { history = [], message = '' } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const reply = await generateVoiceTurnReply(history, message);

    // Attempt optional server-side TTS for natural voice playback
    let audioBase64: string | null = null;
    try {
      audioBase64 = await generateSpeechTTS(reply.text);
    } catch {
      audioBase64 = null;
    }

    res.json({
      text: reply.text,
      language: reply.language,
      isFollowUp: reply.isFollowUp,
      audioBase64,
    });
  } catch (err: any) {
    console.error('Error handling /api/voice/turn:', err);
    res.status(500).json({
      error: 'Failed to process voice turn',
      fallback: 'புரிகிறது. இந்த பிரச்சனை குறித்து மேலும் சில விவரங்களை கூற முடியுமா?',
    });
  }
});

// Deep Challenge Synthesis from Voice Transcript
app.post('/api/voice/analyze', async (req, res) => {
  try {
    const { transcript, language } = req.body;
    if (!transcript) {
      return res.status(400).json({ error: 'Transcript or problem text is required' });
    }

    const analysis = await generateCivicAnalysis(transcript, language);

    // Create a new CivicChallenge instance
    const newId = `CS-${String(challengesStore.length + 1).padStart(3, '0')}`;
    const matchedUniObj = INITIAL_UNIVERSITIES.find((u) => u.name === analysis.matchedUniversity.name) || INITIAL_UNIVERSITIES[0];
    const matchedIndObj = INITIAL_INDUSTRY_PARTNERS.find((i) => i.name === analysis.matchedIndustry.name) || INITIAL_INDUSTRY_PARTNERS[0];

    const challengeObj: CivicChallenge = {
      id: newId,
      title: analysis.title,
      description: analysis.description,
      category: analysis.category,
      location: analysis.location,
      duration: analysis.duration,
      affectedPeople: analysis.affectedPeople,
      severity: analysis.severity,
      language: analysis.language,
      sdg: analysis.sdg,
      requiredSkills: analysis.requiredSkills,
      universityDisciplines: analysis.universityDisciplines,
      industryCapabilities: analysis.industryCapabilities,
      solutionConcept: analysis.solutionConcept,
      impact: analysis.impact,
      status: 'NEW',
      createdAt: new Date().toISOString(),
      rootCauseHypothesis: analysis.rootCauseHypothesis,
      citizenVoiceSnippet: transcript.slice(0, 180),
      matchedUniversityId: matchedUniObj.id,
      matchedIndustryId: matchedIndObj.id,
      universityMatchScore: analysis.matchedUniversity.score,
      industryMatchScore: analysis.matchedIndustry.score,
      collaborationMatchScore: analysis.collaborationScore,
      universityMatchReasons: analysis.matchedUniversity.reasons,
      industryMatchReasons: analysis.matchedIndustry.reasons,
    };

    // Save to runtime store
    challengesStore.unshift(challengeObj);

    // Add activity events
    liveEventsStore.unshift(
      {
        id: `evt-${Date.now()}-1`,
        timestamp: 'Just now',
        type: 'voice_call',
        message: `New civic report analyzed in ${analysis.language} from ${analysis.location}`,
        category: analysis.category,
        badgeColor: 'emerald',
      },
      {
        id: `evt-${Date.now()}-2`,
        timestamp: 'Just now',
        type: 'university_match',
        message: `${matchedUniObj.name} matched (${analysis.matchedUniversity.score}% score)`,
        category: 'Academic Network',
        badgeColor: 'cyan',
      },
      {
        id: `evt-${Date.now()}-3`,
        timestamp: 'Just now',
        type: 'industry_match',
        message: `${matchedIndObj.name} matched (${analysis.matchedIndustry.score}% score)`,
        category: 'Industry Network',
        badgeColor: 'purple',
      }
    );

    res.json({
      success: true,
      challenge: challengeObj,
      analysis,
    });
  } catch (err: any) {
    console.error('Error in /api/voice/analyze:', err);
    res.status(500).json({ error: err.message || 'Failed to synthesize challenge' });
  }
});

// TTS audio synthesis
app.post('/api/voice/tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });
    const audioBase64 = await generateSpeechTTS(text);
    res.json({ audioBase64 });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- SERVER START & VITE ----------------- //

async function startServer() {
  const server = http.createServer(app);

  // Setup WebSocket bridge for Real-time Gemini Live API
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const pathname = request.url ? new URL(request.url, `http://${request.headers.host}`).pathname : '';
    if (pathname === '/api/live-ws') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  wss.on('connection', async (clientWs: WebSocket) => {
    console.log('Client connected to CivicSync Live Voice WebSocket');
    let geminiLiveSession: any = null;

    try {
      const ai = getGeminiClient();
      if (!ai) {
        clientWs.send(
          JSON.stringify({
            type: 'error',
            message: 'GEMINI_API_KEY is not configured on server. Switching to fallback speech bridge.',
          })
        );
        return;
      }

      // Connect to Gemini Live API
      geminiLiveSession = await ai.live.connect({
        model: 'gemini-3.1-flash-live-preview',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
          systemInstruction: SYSTEM_INSTRUCTION_VOICE_AGENT,
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              clientWs.send(JSON.stringify({ type: 'audio', audio: audioData }));
            }
            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ type: 'interrupted' }));
            }
            if (message.serverContent?.turnComplete) {
              clientWs.send(JSON.stringify({ type: 'turn_complete' }));
            }
          },
          onerror: (err: any) => {
            console.error('Gemini Live API Error:', err);
            clientWs.send(JSON.stringify({ type: 'error', message: err?.message || 'Live session error' }));
          },
          onclose: () => {
            clientWs.send(JSON.stringify({ type: 'closed' }));
          },
        },
      });

      clientWs.send(JSON.stringify({ type: 'connected', message: 'Gemini Live Session initialized' }));
    } catch (err: any) {
      console.warn('Live API connection initialization notice:', err?.message);
      clientWs.send(
        JSON.stringify({
          type: 'notice',
          message: 'Live API server bridge active with conversational fallback.',
        })
      );
    }

    clientWs.on('message', async (data: Buffer | string) => {
      try {
        const payload = JSON.parse(data.toString());
        if (payload.type === 'audio' && payload.audio) {
          if (geminiLiveSession) {
            geminiLiveSession.sendRealtimeInput({
              audio: { data: payload.audio, mimeType: 'audio/pcm;rate=16000' },
            });
          }
        } else if (payload.type === 'text' && payload.text) {
          // Handle conversational text turn
          const reply = await generateVoiceTurnReply([], payload.text);
          let audio = null;
          try {
            audio = await generateSpeechTTS(reply.text);
          } catch {}
          clientWs.send(
            JSON.stringify({
              type: 'text_reply',
              text: reply.text,
              language: reply.language,
              audio,
            })
          );
        }
      } catch (err) {
        console.error('Error handling WebSocket client message:', err);
      }
    });

    clientWs.on('close', () => {
      if (geminiLiveSession && typeof geminiLiveSession.close === 'function') {
        geminiLiveSession.close();
      }
    });
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`CivicSync AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
