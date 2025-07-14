"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseAudioRecorderOptions {
  audioBitsPerSecond?: number;
  mimeType?: string;
  timeslice?: number;
  enableAnalysis?: boolean;
  fftSize?: number;
}

interface AudioAnalysisData {
  frequencyData: Uint8Array;
  timeData: Uint8Array;
  volume: number;
}

interface UseAudioRecorderReturn {
  isSupported: boolean;
  isRecording: boolean;
  isPaused: boolean;
  stream: MediaStream | null;
  mediaRecorder: MediaRecorder | null;
  audioBlob: Blob | null;
  audioUrl: string | null;
  duration: number;
  error: string | null;
  analysisData: AudioAnalysisData | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  clearRecording: () => void;
  downloadRecording: (filename?: string) => void;
}

const useAudioRecorder = (
  options: UseAudioRecorderOptions = {}
): UseAudioRecorderReturn => {
  const {
    audioBitsPerSecond = 128000,
    mimeType = "audio/webm",
    timeslice,
    enableAnalysis = false,
    fftSize = 2048,
  } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AudioAnalysisData | null>(
    null
  );

  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const isSupported =
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices &&
    !!navigator.mediaDevices.getUserMedia &&
    !!window.MediaRecorder;

  const updateDuration = useCallback(() => {
    if (startTimeRef.current) {
      const elapsed = Date.now() - startTimeRef.current - pausedTimeRef.current;
      setDuration(Math.floor(elapsed / 1000));
    }
  }, []);

  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current || !enableAnalysis) return;

    const frequencyData = new Uint8Array(analyserRef.current.frequencyBinCount);
    const timeData = new Uint8Array(analyserRef.current.fftSize);

    analyserRef.current.getByteFrequencyData(frequencyData);
    analyserRef.current.getByteTimeDomainData(timeData);

    // Calculate volume (RMS)
    let sum = 0;
    for (let i = 0; i < timeData.length; i++) {
      const sample = ((timeData[i] ?? 0) - 128) / 128;
      sum += sample * sample;
    }
    const volume = Math.sqrt(sum / timeData.length);

    setAnalysisData({
      frequencyData: frequencyData.slice(),
      timeData: timeData.slice(),
      volume,
    });

    if (isRecording && !isPaused) {
      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
    }
  }, [isRecording, isPaused, enableAnalysis]);

  const setupAudioAnalysis = useCallback(
    (mediaStream: MediaStream) => {
      if (!enableAnalysis) return;

      try {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        sourceRef.current =
          audioContextRef.current.createMediaStreamSource(mediaStream);

        analyserRef.current.fftSize = fftSize;
        analyserRef.current.smoothingTimeConstant = 0.8;

        sourceRef.current.connect(analyserRef.current);

        analyzeAudio();
      } catch (err) {
        console.warn("Failed to setup audio analysis:", err);
      }
    },
    [enableAnalysis, fftSize, analyzeAudio]
  );

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setError("Audio recording is not supported in this browser");
      return;
    }

    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      setStream(mediaStream);
      setupAudioAnalysis(mediaStream);

      const recorder = new MediaRecorder(mediaStream, {
        audioBitsPerSecond,
        mimeType: MediaRecorder.isTypeSupported(mimeType)
          ? mimeType
          : "audio/webm",
      });

      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setIsRecording(false);
        setIsPaused(false);

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      };

      recorder.onpause = () => {
        setIsPaused(true);
        pausedTimeRef.current += Date.now() - startTimeRef.current;
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      };

      recorder.onresume = () => {
        setIsPaused(false);
        startTimeRef.current = Date.now();
        if (enableAnalysis) {
          analyzeAudio();
        }
      };

      recorder.onerror = (event) => {
        setError(`Recording error: ${event.error?.message || "Unknown error"}`);
        setIsRecording(false);
        setIsPaused(false);
      };

      setMediaRecorder(recorder);
      recorder.start(timeslice);
      setIsRecording(true);
      startTimeRef.current = Date.now();
      pausedTimeRef.current = 0;
      setDuration(0);

      intervalRef.current = setInterval(updateDuration, 1000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to start recording";
      setError(errorMessage);
    }
  }, [
    isSupported,
    audioBitsPerSecond,
    mimeType,
    timeslice,
    setupAudioAnalysis,
    updateDuration,
    enableAnalysis,
    analyzeAudio,
  ]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, [mediaRecorder, stream]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.pause();
    }
  }, [mediaRecorder]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === "paused") {
      mediaRecorder.resume();
    }
  }, [mediaRecorder]);

  const clearRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setAnalysisData(null);
    setError(null);
  }, [audioUrl]);

  const downloadRecording = useCallback(
    (filename = "recording.webm") => {
      if (!audioUrl) return;

      const link = document.createElement("a");
      link.href = audioUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [audioUrl]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [stream, audioUrl]);

  return {
    isSupported,
    isRecording,
    isPaused,
    stream,
    mediaRecorder,
    audioBlob,
    audioUrl,
    duration,
    error,
    analysisData,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording,
    downloadRecording,
  };
};

export { useAudioRecorder };
export type {
  UseAudioRecorderOptions,
  AudioAnalysisData,
  UseAudioRecorderReturn,
};
