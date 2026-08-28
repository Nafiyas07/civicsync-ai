// Audio utilities for 16kHz PCM recording and 24kHz PCM / Web Audio playback

export function floatTo16BitPCM(input: Float32Array): ArrayBuffer {
  const output = new DataView(new ArrayBuffer(input.length * 2));
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true); // little-endian
  }
  return output.buffer;
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export class GaplessAudioQueuePlayer {
  private audioCtx: AudioContext | null = null;
  private nextStartTime = 0;
  private isPlaying = false;
  private sampleRate = 24000;

  constructor(sampleRate = 24000) {
    this.sampleRate = sampleRate;
  }

  private initCtx() {
    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass({ sampleRate: this.sampleRate });
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public enqueuePcmChunk(base64Audio: string) {
    this.initCtx();
    if (!this.audioCtx) return;

    try {
      const arrayBuffer = base64ToArrayBuffer(base64Audio);
      const dataView = new DataView(arrayBuffer);
      const numSamples = dataView.byteLength / 2;
      const float32Data = new Float32Array(numSamples);

      for (let i = 0; i < numSamples; i++) {
        const int16 = dataView.getInt16(i * 2, true);
        float32Data[i] = int16 < 0 ? int16 / 0x8000 : int16 / 0x7fff;
      }

      const audioBuffer = this.audioCtx.createBuffer(1, numSamples, this.sampleRate);
      audioBuffer.getChannelData(0).set(float32Data);

      const source = this.audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioCtx.destination);

      const currentTime = this.audioCtx.currentTime;
      const startTime = Math.max(currentTime, this.nextStartTime);
      source.start(startTime);
      this.nextStartTime = startTime + audioBuffer.duration;
      this.isPlaying = true;

      source.onended = () => {
        if (this.audioCtx && this.audioCtx.currentTime >= this.nextStartTime - 0.05) {
          this.isPlaying = false;
        }
      };
    } catch (err) {
      console.warn('Error playing PCM audio chunk:', err);
    }
  }

  public stop() {
    if (this.audioCtx) {
      try {
        this.audioCtx.close();
      } catch {}
      this.audioCtx = null;
    }
    this.nextStartTime = 0;
    this.isPlaying = false;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

// Fallback Browser TTS synthesis when Gemini TTS is not connected
export function speakBrowserText(text: string, lang = 'ta-IN'): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Pick best voice for Tamil or English
    const voices = window.speechSynthesis.getVoices();
    const hasTamilChar = /[\u0B80-\u0BFF]/.test(text);

    if (hasTamilChar || lang.startsWith('ta')) {
      const tamilVoice = voices.find((v) => v.lang.includes('ta') || v.name.toLowerCase().includes('tamil'));
      if (tamilVoice) utterance.voice = tamilVoice;
      utterance.lang = 'ta-IN';
      utterance.rate = 0.95;
    } else {
      const engVoice = voices.find((v) => v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en-US'));
      if (engVoice) utterance.voice = engVoice;
      utterance.lang = 'en-IN';
      utterance.rate = 1.0;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}
