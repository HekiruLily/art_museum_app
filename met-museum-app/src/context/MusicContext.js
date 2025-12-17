// context/MusicContext.js
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

const MusicContext = createContext();

export function MusicProvider({ children }) {
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mood, setMood] = useState('');
  const [moodDescription, setMoodDescription] = useState('');
  
  // Filter tracks with preview_url
  const playableTracks = tracks.filter(t => t.preview_url);
  const currentTrack = playableTracks[currentTrackIndex] || null;
  
  // Use expo-audio hook
  const player = useAudioPlayer(currentTrack?.preview_url || '');
  const status = useAudioPlayerStatus(player);

  // Sync playing state with audio status
  useEffect(() => {
    if (status.playing) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [status.playing]);

  // Auto play next when finished
  useEffect(() => {
    if (status.didJustFinish && playableTracks.length > 0) {
      const nextIndex = (currentTrackIndex + 1) % playableTracks.length;
      setCurrentTrackIndex(nextIndex);
    }
  }, [status.didJustFinish]);

  // Auto-play when track changes
  useEffect(() => {
    if (currentTrack?.preview_url && playableTracks.length > 0) {
      setTimeout(() => {
        player.play();
      }, 300);
    }
  }, [currentTrackIndex, currentTrack?.preview_url]);

  const loadTracks = (newTracks, newMood, newMoodDescription) => {
    setTracks(newTracks);
    setMood(newMood);
    setMoodDescription(newMoodDescription);
    setCurrentTrackIndex(0);
  };

  const play = () => {
    if (currentTrack?.preview_url) {
      player.play();
    }
  };

  const pause = () => {
    player.pause();
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
    player.pause();
    const nextIndex = (currentTrackIndex + 1) % playableTracks.length;
    setCurrentTrackIndex(nextIndex);
  };

  const playPrevious = () => {
    if (playableTracks.length === 0) return;
    player.pause();
    const prevIndex = currentTrackIndex === 0 ? playableTracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
  };

  const selectTrack = (index) => {
    if (index >= 0 && index < playableTracks.length) {
      player.pause();
      setCurrentTrackIndex(index);
    }
  };

  const stopAndClear = () => {
    player.pause();
    setTracks([]);
    setCurrentTrackIndex(0);
    setMood('');
    setMoodDescription('');
  };

  const value = {
    tracks,
    playableTracks,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    mood,
    moodDescription,
    status,
    loadTracks,
    play,
    pause,
    togglePlayPause,
    playNext,
    playPrevious,
    selectTrack,
    stopAndClear,
  };

  return (
    <MusicContext.Provider value={value}>
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
