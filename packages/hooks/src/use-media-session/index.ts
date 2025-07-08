import { useEffect, useCallback, useRef } from "react";

interface MediaImage {
  src: string;
  sizes?: string;
  type?: string;
}

interface MediaMetadataInit {
  title?: string;
  artist?: string;
  album?: string;
  artwork?: MediaImage[];
}

type MediaSessionAction =
  | "play"
  | "pause"
  | "stop"
  | "seekbackward"
  | "seekforward"
  | "seekto"
  | "skipad"
  | "previoustrack"
  | "nexttrack";

type MediaSessionPlaybackState = "none" | "paused" | "playing";

type MediaSessionActionHandler = (details?: any) => void;

interface UseMediaSessionOptions {
  metadata?: MediaMetadataInit;
  playbackState?: MediaSessionPlaybackState;
  actionHandlers?: Partial<
    Record<MediaSessionAction, MediaSessionActionHandler>
  >;
}

interface UseMediaSessionReturn {
  isSupported: boolean;
  setMetadata: (metadata: MediaMetadataInit) => void;
  setPlaybackState: (state: MediaSessionPlaybackState) => void;
  setActionHandler: (
    action: MediaSessionAction,
    handler: MediaSessionActionHandler | null
  ) => void;
  clearActionHandlers: () => void;
}

const useMediaSession = (
  options?: UseMediaSessionOptions
): UseMediaSessionReturn => {
  const actionHandlersRef = useRef<Set<MediaSessionAction>>(new Set());

  const isSupported =
    typeof navigator !== "undefined" && "mediaSession" in navigator;

  const setMetadata = useCallback(
    (metadata: MediaMetadataInit) => {
      if (!isSupported) return;

      try {
        navigator.mediaSession.metadata = new MediaMetadata(metadata);
      } catch (error) {
        console.warn("Failed to set media metadata:", error);
      }
    },
    [isSupported]
  );

  const setPlaybackState = useCallback(
    (state: MediaSessionPlaybackState) => {
      if (!isSupported) return;

      try {
        navigator.mediaSession.playbackState = state;
      } catch (error) {
        console.warn("Failed to set playback state:", error);
      }
    },
    [isSupported]
  );

  const setActionHandler = useCallback(
    (action: MediaSessionAction, handler: MediaSessionActionHandler | null) => {
      if (!isSupported) return;

      try {
        navigator.mediaSession.setActionHandler(action, handler);
        if (handler) {
          actionHandlersRef.current.add(action);
        } else {
          actionHandlersRef.current.delete(action);
        }
      } catch (error) {
        console.warn(`Failed to set action handler for ${action}:`, error);
      }
    },
    [isSupported]
  );

  const clearActionHandlers = useCallback(() => {
    if (!isSupported) return;

    actionHandlersRef.current.forEach((action) => {
      try {
        navigator.mediaSession.setActionHandler(action, null);
      } catch (error) {
        console.warn(`Failed to clear action handler for ${action}:`, error);
      }
    });
    actionHandlersRef.current.clear();
  }, [isSupported]);

  // Set initial metadata if provided
  useEffect(() => {
    if (options?.metadata) {
      setMetadata(options.metadata);
    }
  }, [setMetadata, options?.metadata]);

  // Set initial playback state if provided
  useEffect(() => {
    if (options?.playbackState) {
      setPlaybackState(options.playbackState);
    }
  }, [setPlaybackState, options?.playbackState]);

  // Set initial action handlers if provided
  useEffect(() => {
    if (options?.actionHandlers) {
      Object.entries(options.actionHandlers).forEach(([action, handler]) => {
        if (handler) {
          setActionHandler(action as MediaSessionAction, handler);
        }
      });
    }

    // Cleanup function to clear all action handlers when component unmounts
    return () => {
      clearActionHandlers();
    };
  }, [setActionHandler, clearActionHandlers, options?.actionHandlers]);

  return {
    isSupported,
    setMetadata,
    setPlaybackState,
    setActionHandler,
    clearActionHandlers,
  };
};

export { useMediaSession };
export type {
  MediaImage,
  MediaMetadataInit,
  MediaSessionAction,
  MediaSessionPlaybackState,
  MediaSessionActionHandler,
  UseMediaSessionOptions,
  UseMediaSessionReturn,
};
