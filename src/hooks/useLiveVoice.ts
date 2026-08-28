import { useState, useRef, useEffect, useCallback } from 'react';
import { VoiceSessionMessage } from '../types';
import { floatTo16BitPCM, arrayBufferToBase64, GaplessAudioQueuePlayer, speakBrowserText } from '../services/audioUtils';
import { apiService } from '../services/apiService';

export type VoiceState = 'IDLE' | 'CONNECTING' | 'LISTENING' | 'AI_SPEAKING' | 'PROCESSING' | 'ERROR' | 'ENDED';

export function useLiveVoice() {
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [transcript, setTranscript] = useState<VoiceSessionMessage[]>([]);
  const [currentInterimText, setCurrentInterimText] = useState<string>('');
  const [detectedLanguage, setDetectedLanguage] = useState<string>('Detecting...');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMicPermissionGranted, setIsMicPermissionGranted] = useState<boolean | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);
  const playerRef = useRef<GaplessAudioQueuePlayer>(new GaplessAudioQueuePlayer(24000));
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const animFrameRef = useRef<number | null>(null);
  const transcriptRef = useRef<VoiceSessionMessage[]>([]);

  // Sync ref
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Call timer
  useEffect(() => {
    if (voiceState === 'LISTENING' || voiceState === 'AI_SPEAKING' || voiceState === 'CONNECTING') {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [voiceState]);

  // Audio level monitoring
  const updateAudioVisualizer = useCallback(() => {
    if (analyserRef.current && (voiceState === 'LISTENING' || voiceState === 'AI_SPEAKING')) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;
      setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
    } else {
      setAudioLevel(0);
    }
    animFrameRef.current = requestAnimationFrame(updateAudioVisualizer);
  }, [voiceState]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(updateAudioVisualizer);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [updateAudioVisualizer]);

  // Handle AI turn reply with speech playback
  const handleAITurnResponse = useCallback(async (userText: string) => {
    setVoiceState('PROCESSING');
    try {
      // Add citizen message to transcript
      const citizenMsg: VoiceSessionMessage = {
        id: `msg-${Date.now()}-c`,
        sender: 'citizen',
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };

      const updatedTranscript = [...transcriptRef.current, citizenMsg];
      setTranscript(updatedTranscript);

      // Call API server for smart turn response
      const replyData = await apiService.sendVoiceTurn(
        updatedTranscript.map((m) => ({ sender: m.sender, text: m.text })),
        userText
      );

      setDetectedLanguage(replyData.language);

      const aiMsg: VoiceSessionMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        text: replyData.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        language: replyData.language,
      };

      setTranscript((prev) => [...prev, aiMsg]);
      setVoiceState('AI_SPEAKING');

      // Play audio response: check if server provided Gemini TTS PCM or fallback to Web Speech API
      if (replyData.audioBase64) {
        playerRef.current.enqueuePcmChunk(replyData.audioBase64);
        setTimeout(() => {
          setVoiceState('LISTENING');
        }, 3500);
      } else {
        await speakBrowserText(replyData.text, replyData.language === 'Tamil' ? 'ta-IN' : 'en-IN');
        setVoiceState('LISTENING');
      }
    } catch (err: any) {
      console.error('Error in handleAITurnResponse:', err);
      setVoiceState('LISTENING');
    }
  }, []);

  // Initialize Web Speech Recognition
  const setupSpeechRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Browser does not support SpeechRecognition. Direct audio PCM streaming is used.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    // Set to Tamil / English multi-mode
    recognition.lang = 'ta-IN'; // Will pick up Tamil & English phonetics smoothly

    recognition.onresult = (event: any) => {
      let interim = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalTranscript += item[0].transcript;
        } else {
          interim += item[0].transcript;
        }
      }

      if (interim) {
        setCurrentInterimText(interim);
      }

      if (finalTranscript && finalTranscript.trim().length > 1) {
        setCurrentInterimText('');
        handleAITurnResponse(finalTranscript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('SpeechRecognition error:', event.error);
      if (event.error === 'not-allowed') {
        setIsMicPermissionGranted(false);
        setErrorMessage('Microphone access was denied. Please allow microphone permissions in your browser.');
      }
    };

    recognitionRef.current = recognition;
  }, [handleAITurnResponse]);

  // Start Civic Voice Call
  const startCall = useCallback(async () => {
    setErrorMessage(null);
    setVoiceState('CONNECTING');
    setCallDuration(0);
    setTranscript([]);
    setCurrentInterimText('');

    try {
      // 1. Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;
      setIsMicPermissionGranted(true);

      // 2. Audio Context & Analyser
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioCtxClass({ sampleRate: 16000 });
      inputAudioCtxRef.current = inputCtx;

      const source = inputCtx.createMediaStreamSource(stream);
      const analyser = inputCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      source.connect(analyser);

      // 3. Audio processor for 16kHz PCM streaming to Gemini Live
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorNodeRef.current = processor;

      // 4. WebSocket setup
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live-ws`;

      try {
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
          console.log('CivicSync Live Voice WebSocket Connected');
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'audio' && data.audio) {
              setVoiceState('AI_SPEAKING');
              playerRef.current.enqueuePcmChunk(data.audio);
            } else if (data.type === 'turn_complete') {
              setVoiceState('LISTENING');
            } else if (data.type === 'interrupted') {
              playerRef.current.stop();
              setVoiceState('LISTENING');
            } else if (data.type === 'text_reply' && data.text) {
              setVoiceState('AI_SPEAKING');
              if (data.language) setDetectedLanguage(data.language);
              if (data.audio) {
                playerRef.current.enqueuePcmChunk(data.audio);
              } else {
                speakBrowserText(data.text, data.language === 'Tamil' ? 'ta-IN' : 'en-IN');
              }
            }
          } catch (e) {
            console.warn('WS message parse error:', e);
          }
        };

        socket.onerror = (e) => {
          console.warn('Live WebSocket warning (fallback mode active):', e);
        };
      } catch (wsErr) {
        console.warn('WebSocket connection init notice:', wsErr);
      }

      processor.onaudioprocess = (e) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0);
          const pcmBuffer = floatTo16BitPCM(inputData);
          const base64 = arrayBufferToBase64(pcmBuffer);
          socketRef.current.send(JSON.stringify({ type: 'audio', audio: base64 }));
        }
      };

      source.connect(processor);
      processor.connect(inputCtx.destination);

      // 5. Speech recognition fallback / transcript engine
      setupSpeechRecognition();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (rErr) {
          console.warn('Recognition start notice:', rErr);
        }
      }

      // Initial Greeting from CivicSync AI
      setTimeout(async () => {
        setVoiceState('AI_SPEAKING');
        setDetectedLanguage('Tamil / English / Tanglish');

        const initialGreeting = 'வணக்கம்! CivicSync AI-க்கு வரவேற்கிறோம். உங்கள் பகுதியில் உள்ள மக்கள் பிரச்சனையை கூறுங்கள்.';
        const greetingMsg: VoiceSessionMessage = {
          id: 'msg-initial-greeting',
          sender: 'ai',
          text: initialGreeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          language: 'Tamil',
        };
        setTranscript([greetingMsg]);

        await speakBrowserText(initialGreeting, 'ta-IN');
        setVoiceState('LISTENING');
      }, 700);
    } catch (err: any) {
      console.error('Failed to start voice call:', err);
      setVoiceState('ERROR');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setIsMicPermissionGranted(false);
        setErrorMessage('Microphone access was denied. Please grant microphone permission in your browser settings to speak, or use the Text Demo.');
      } else {
        setErrorMessage(err.message || 'Unable to initialize audio device. Please try again or use the Text Demo.');
      }
    }
  }, [handleAITurnResponse, setupSpeechRecognition]);

  // End Call
  const endCall = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    if (processorNodeRef.current) {
      processorNodeRef.current.disconnect();
      processorNodeRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (inputAudioCtxRef.current) {
      try {
        inputAudioCtxRef.current.close();
      } catch {}
      inputAudioCtxRef.current = null;
    }

    if (socketRef.current) {
      try {
        socketRef.current.close();
      } catch {}
      socketRef.current = null;
    }

    playerRef.current.stop();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setVoiceState('ENDED');
    setAudioLevel(0);
  }, []);

  // Send typed message in conversation
  const sendTextMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      await handleAITurnResponse(text.trim());
    },
    [handleAITurnResponse]
  );

  return {
    voiceState,
    setVoiceState,
    callDuration,
    transcript,
    setTranscript,
    currentInterimText,
    detectedLanguage,
    audioLevel,
    errorMessage,
    isMicPermissionGranted,
    startCall,
    endCall,
    sendTextMessage,
  };
}
