// components/MusicPlayer.js
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMusic } from '../context/MusicContext';

const { width } = Dimensions.get('window');

export default function MusicPlayer({ visible, onClose, artwork }) {
  const {
    currentTrack,
    currentTrackIndex,
    playableTracks,
    isPlaying,
    mood,
    moodDescription,
    togglePlayPause,
    playNext,
    playPrevious,
    selectTrack,
  } = useMusic();

  const [loading, setLoading] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotation.stopAnimation();
      rotation.setValue(0);
    }
  }, [isPlaying]);

  const handleTogglePlay = () => {
    setLoading(true);
    togglePlayPause();
    setTimeout(() => setLoading(false), 300);
  };

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Show message if no playable tracks
  if (playableTracks.length === 0) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={onClose}
        statusBarTranslucent
      >
        <View style={styles.container}>
          <LinearGradient
            colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)']}
            style={styles.overlay}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.content}>
            <Text style={styles.noTracksText}>😔</Text>
            <Text style={styles.noTracksMessage}>Không tìm thấy bài hát có preview</Text>
            <Text style={styles.noTracksSubtext}>Vui lòng thử với tác phẩm khác</Text>
          </View>
        </View>
      </Modal>
    );
  }

  if (!currentTrack) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* Background with artwork */}
        <Image
          source={{ uri: artwork?.primaryImage }}
          style={styles.backgroundImage}
          blurRadius={50}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          style={styles.overlay}
        />

        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Mood indicator */}
          <View style={styles.moodContainer}>
            <Text style={styles.moodEmoji}>🎵</Text>
            <Text style={styles.moodText}>{mood?.toUpperCase() || 'MUSIC'}</Text>
            <Text style={styles.moodDescription}>{moodDescription || ''}</Text>
          </View>

          {/* Album art */}
          <Animated.View style={[styles.albumArtContainer, { transform: [{ rotate: spin }] }]}>
            <Image
              source={{ uri: currentTrack.album?.images?.[0]?.url || artwork?.primaryImage }}
              style={styles.albumArt}
            />
          </Animated.View>

          {/* Track info */}
          <View style={styles.trackInfo}>
            <Text style={styles.trackName} numberOfLines={2}>
              {currentTrack.name || currentTrack.title}
            </Text>
            <Text style={styles.artistName} numberOfLines={1}>
              {currentTrack.artists?.map(a => a.name).join(', ') || currentTrack.artist?.name}
            </Text>
            <Text style={styles.previewNote}>
              🎧 Preview 30 giây • {playableTracks.length} bài hát
            </Text>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton} onPress={playPrevious}>
              <Text style={styles.controlIcon}>⏮</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.playButton}
              onPress={handleTogglePlay}
              disabled={loading}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.playButtonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={playNext}>
              <Text style={styles.controlIcon}>⏭</Text>
            </TouchableOpacity>
          </View>

          {/* Track counter */}
          <Text style={styles.trackCounter}>
            {currentTrackIndex + 1} / {playableTracks.length}
          </Text>

          {/* Track list */}
          <View style={styles.trackListContainer}>
            <Text style={styles.trackListTitle}>Danh sách phát</Text>
            {playableTracks.map((track, index) => (
              <TouchableOpacity
                key={track.id || index}
                style={[
                  styles.trackItem,
                  index === currentTrackIndex && styles.trackItemActive
                ]}
                onPress={() => selectTrack(index)}
              >
                <Image
                  source={{ uri: track.album?.images?.[0]?.url || artwork?.primaryImage }}
                  style={styles.trackItemImage}
                />
                <View style={styles.trackItemInfo}>
                  <Text 
                    style={[
                      styles.trackItemName,
                      index === currentTrackIndex && styles.trackItemNameActive
                    ]} 
                    numberOfLines={1}
                  >
                    {track.name || track.title}
                  </Text>
                  <Text style={styles.trackItemArtist} numberOfLines={1}>
                    {track.artists?.map(a => a.name).join(', ') || track.artist?.name}
                  </Text>
                </View>
                {index === currentTrackIndex && isPlaying && (
                  <Text style={styles.playingIndicator}>🎵</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100,
    paddingBottom: 40,
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 100,
  },
  moodContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  moodEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  moodText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 5,
  },
  moodDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  albumArtContainer: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 30,
    borderRadius: (width * 0.6) / 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  albumArt: {
    width: '100%',
    height: '100%',
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
    paddingHorizontal: 20,
  },
  trackName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  artistName: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  previewNote: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
  },
  controlButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    color: '#fff',
    fontSize: 30,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
  },
  playButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: '#fff',
    fontSize: 30,
    marginLeft: 4,
  },
  trackCounter: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginTop: 20,
  },
  noTracksText: {
    fontSize: 60,
    marginBottom: 20,
  },
  noTracksMessage: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  noTracksSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
  },
  trackListContainer: {
    width: '100%',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  trackListTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  trackItemActive: {
    backgroundColor: 'rgba(102, 126, 234, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.5)',
  },
  trackItemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  trackItemInfo: {
    flex: 1,
  },
  trackItemName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  trackItemNameActive: {
    color: '#667eea',
  },
  trackItemArtist: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  playingIndicator: {
    fontSize: 18,
    marginLeft: 8,
  },
});
