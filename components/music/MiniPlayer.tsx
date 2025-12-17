// components/music/MiniPlayer.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMusic } from '@/context/MusicContext';

interface MiniPlayerProps {
  artwork: any;
  onExpand: () => void;
  visible?: boolean;
}

export default function MiniPlayer({ 
  artwork, 
  onExpand,
  visible = true 
}: MiniPlayerProps) {
  const {
    currentTrack,
    playableTracks,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrevious,
  } = useMusic();

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [loading, setLoading] = useState(false);

  // Pulse animation when playing
  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  const handleTogglePlay = () => {
    setLoading(true);
    togglePlayPause();
    setTimeout(() => setLoading(false), 300);
  };

  if (!visible || playableTracks.length === 0 || !currentTrack) {
    return null;
  }

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onExpand}
      activeOpacity={0.95}
    >
      <LinearGradient
        colors={['rgba(102, 126, 234, 0.95)', 'rgba(118, 75, 162, 0.95)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Album art with pulse */}
        <Animated.View style={[styles.albumContainer, { transform: [{ scale: pulseAnim }] }]}>
          <Image
            source={{ uri: currentTrack.album?.images?.[0]?.url || artwork?.primaryImage }}
            style={styles.albumArt}
          />
        </Animated.View>

        {/* Track info */}
        <View style={styles.trackInfo}>
          <Text style={styles.trackName} numberOfLines={1}>
            {currentTrack.name}
          </Text>
          <Text style={styles.artistName} numberOfLines={1}>
            {currentTrack.artists?.map(a => a.name).join(', ')}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={(e) => {
              e.stopPropagation();
              playPrevious();
            }}
          >
            <Text style={styles.controlIcon}>⏮</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playButton}
            onPress={(e) => {
              e.stopPropagation();
              handleTogglePlay();
            }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={(e) => {
              e.stopPropagation();
              playNext();
            }}
          >
            <Text style={styles.controlIcon}>⏭</Text>
          </TouchableOpacity>
        </View>

        {/* Expand hint */}
        <View style={styles.expandHint}>
          <Text style={styles.expandIcon}>▲</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingRight: 8,
  },
  albumContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  albumArt: {
    width: '100%',
    height: '100%',
  },
  trackInfo: {
    flex: 1,
    marginRight: 8,
  },
  trackName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  artistName: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    color: '#fff',
    fontSize: 18,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  playIcon: {
    color: '#fff',
    fontSize: 18,
  },
  expandHint: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  expandIcon: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
  },
});
