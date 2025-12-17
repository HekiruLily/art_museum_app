import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Platform } from 'react-native';

interface Track {
  id: string | number;
  name: string;
  preview_url: string;
  artists: { name: string }[];
  album: {
    images: { url: string }[];
  };
  duration?: number;
}

interface MusicContextType {
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  mood: string;
  moodDescription: string;
  playableTracks: Track[];
  currentTrack: Track | null;
  loadTracks: (newTracks: Track[], newMood: string, newMoodDescription: string) => void;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  selectTrack: (index: number) => void;
  stopAndClear: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

interface MusicProviderProps {
  children: ReactNode;
}

export function MusicProvider({ children }: MusicProviderProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mood, setMood] = useState('');
  const [moodDescription, setMoodDescription] = useState('');
  const isLoadingRef = useRef(false);
  
  // Filter tracks with preview_url
  const playableTracks = tracks.filter(t => t.preview_url);
  const currentTrack = playableTracks[currentTrackIndex] || null;
  
  // Use expo-audio hook - only create player when we have a valid URL
  const player = useAudioPlayer(currentTrack?.preview_url || '');
  const status = useAudioPlayerStatus(player);

  // Sync playing state with audio status
  useEffect(() => {
    if (status.playing !== isPlaying) {
      setIsPlaying(status.playing);
    }
  }, [status.playing, isPlaying]);

  // Auto play next when finished
  useEffect(() => {
    if (status.didJustFinish && playableTracks.length > 0) {
      const nextIndex = (currentTrackIndex + 1) % playableTracks.length;
      setCurrentTrackIndex(nextIndex);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.didJustFinish, playableTracks.length]);

  // Auto-play when track changes
  useEffect(() => {
    if (currentTrack?.preview_url && playableTracks.length > 0 && !isLoadingRef.current) {
      isLoadingRef.current = true;
      
      // Use a small delay to ensure player is ready
      const timer = setTimeout(() => {
        try {
          if (player && typeof player.play === 'function') {
            player.play();
          }
        } catch (error) {
          console.error('Auto-play error:', error);
        } finally {
          isLoadingRef.current = false;
        }
      }, 500);
      
      return () => {
        clearTimeout(timer);
        isLoadingRef.current = false;
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex, currentTrack?.preview_url]);

  const loadTracks = (newTracks: Track[], newMood: string, newMoodDescription: string) => {
    setTracks(newTracks);
    setMood(newMood);
    setMoodDescription(newMoodDescription);
    setCurrentTrackIndex(0);
  };

  const play = () => {
    if (currentTrack?.preview_url && player && typeof player.play === 'function') {
      try {
        player.play();
      } catch (error) {
        console.error('Play error:', error);
      }
    }
  };

  const pause = () => {
    if (player && typeof player.pause === 'function') {
      try {
        player.pause();
      } catch (error) {
        console.error('Pause error:', error);
      }
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const playNext = () => {
    if (playableTracks.length === 0) return;
    if (player && typeof player.pause === 'function') {
      try {
        player.pause();
      } catch (error) {
        console.error('Pause error on next:', error);
      }
    }
    const nextIndex = (currentTrackIndex + 1) % playableTracks.length;
    setCurrentTrackIndex(nextIndex);
  };

  const playPrevious = () => {
    if (playableTracks.length === 0) return;
    if (player && typeof player.pause === 'function') {
      try {
        player.pause();
      } catch (error) {
        console.error('Pause error on previous:', error);
      }
    }
    const prevIndex = currentTrackIndex === 0 ? playableTracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
  };

  const selectTrack = (index: number) => {
    if (index >= 0 && index < playableTracks.length) {
      if (player && typeof player.pause === 'function') {
        try {
          player.pause();
        } catch (error) {
          console.error('Pause error on select:', error);
        }
      }
      setCurrentTrackIndex(index);
    }
  };

  const stopAndClear = () => {
    if (player && typeof player.pause === 'function') {
      try {
        player.pause();
      } catch (error) {
        console.error('Stop error:', error);
      }
    }
    setTracks([]);
    setCurrentTrackIndex(0);
    setMood('');
    setMoodDescription('');
  };

  return (
    <MusicContext.Provider
      value={{
        tracks,
        currentTrackIndex,
        isPlaying,
        mood,
        moodDescription,
        playableTracks,
        currentTrack,
        loadTracks,
        play,
        pause,
        togglePlayPause,
        playNext,
        playPrevious,
        selectTrack,
        stopAndClear,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
