import { useAudioRecorder } from "./index.js";

export function AudioRecorderComponent() {
  const {
    isSupported,
    isRecording,
    isPaused,
    duration,
    error,
    analysisData,
    audioUrl,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording,
    downloadRecording,
  } = useAudioRecorder({
    audioBitsPerSecond: 128000,
    enableAnalysis: true,
    fftSize: 2048,
  });

  if (!isSupported) {
    return <div>Audio recording not supported in this browser</div>;
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="audio-recorder">
      <h2>Audio Recorder</h2>

      {error && <div className="error">{error}</div>}

      <div className="controls">
        {!isRecording ? (
          <button onClick={startRecording}>Start Recording</button>
        ) : (
          <>
            <button onClick={stopRecording}>Stop</button>
            {isPaused ? (
              <button onClick={resumeRecording}>Resume</button>
            ) : (
              <button onClick={pauseRecording}>Pause</button>
            )}
          </>
        )}
      </div>

      <div className="status">
        <p>Duration: {formatDuration(duration)}</p>
        <p>
          Status:{" "}
          {isRecording ? (isPaused ? "Paused" : "Recording") : "Stopped"}
        </p>
      </div>

      {analysisData && (
        <div className="analysis">
          <p>Volume: {Math.round(analysisData.volume * 100)}%</p>
          <div className="visualizer">
            {/* Render frequency bars */}
            {Array.from(analysisData.frequencyData.slice(0, 50)).map(
              (value, index) => (
                <div
                  key={index}
                  className="frequency-bar"
                  style={{
                    height: `${(value / 255) * 100}px`,
                    backgroundColor: `hsl(${(value / 255) * 120}, 100%, 50%)`,
                  }}
                />
              )
            )}
          </div>
        </div>
      )}

      {audioUrl && (
        <div className="playback">
          <audio controls src={audioUrl} />
          <div className="actions">
            <button onClick={() => downloadRecording("my-recording.webm")}>
              Download
            </button>
            <button onClick={clearRecording}>Clear</button>
          </div>
        </div>
      )}
    </div>
  );
}
