import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { metMuseumAPI } from '../services/api';

const { width } = Dimensions.get('window');

export default function ArtistDetailScreen({ route, navigation }) {
  const { artist } = route.params;
  const [allArtworks, setAllArtworks] = useState(artist.artworks);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadAllArtworks();
  }, []);

  const loadAllArtworks = async () => {
    setLoadingMore(true);
    try {
      const artworks = await metMuseumAPI.getArtistAllArtworks(artist.artistName, artist.totalWorks);
      if (artworks.length > 0) {
        setAllArtworks(artworks);
      }
    } catch (error) {
      console.error('Error loading all artworks:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#5145e5', '#9233ea']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết nghệ sĩ</Text>
        <View style={styles.headerSpace} />
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Artist Profile Card */}
        <View style={styles.profileCard}>
          {/* Artist Avatar */}
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: artist.artworks[0]?.primaryImage }}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View style={styles.badge}>
              <Text style={styles.badgeIcon}>👤</Text>
            </View>
          </View>

          {/* Artist Name */}
          <Text style={styles.artistName}>{artist.artistName}</Text>
          <Text style={styles.nationality}>{artist.nationality || 'Unknown'}</Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{artist.totalWorks}</Text>
              <Text style={styles.statLabel}>Tác phẩm</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{artist.birthYear || '?'}</Text>
              <Text style={styles.statLabel}>Năm sinh</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{artist.deathYear || '?'}</Text>
              <Text style={styles.statLabel}>Năm mất</Text>
            </View>
          </View>

          {/* Style Tag */}
          <LinearGradient
            colors={['#667eea', '#d8277b']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.styleTag}
          >
            <Text style={styles.styleText}>{artist.nationality || 'Artist'}</Text>
          </LinearGradient>
        </View>

        {/* Biography Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Text style={styles.sectionIcon}>📖</Text>
            </View>
            <Text style={styles.sectionTitle}>Tiểu sử</Text>
          </View>
          <Text style={styles.bioText}>
            {artist.artistBio || `${artist.artistName} là một nghệ sĩ nổi tiếng với nhiều tác phẩm nghệ thuật xuất sắc.`}
          </Text>
        </View>

        {/* Artworks Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconContainer, { backgroundColor: '#E91E63' }]}>
              <Text style={styles.sectionIcon}>🎨</Text>
            </View>
            <Text style={styles.sectionTitle}>Tác phẩm của nghệ sĩ</Text>
          </View>

          {/* Artworks Grid */}
          {allArtworks.map((artwork, index) => (
            <View key={index} style={styles.artworkCard}>
              <Image
                source={{ uri: artwork.primaryImage }}
                style={styles.artworkImage}
                resizeMode="cover"
              />
              <View style={styles.artworkInfo}>
                <Text style={styles.artworkTitle} numberOfLines={2}>
                  {artwork.title || 'Untitled'}
                </Text>
                <Text style={styles.artworkDate}>
                  {artwork.objectDate || 'Date unknown'}
                </Text>
              </View>
            </View>
          ))}

          {/* Loading indicator */}
          {loadingMore && (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color="#667eea" />
              <Text style={styles.loadingText}>Đang tải thêm tác phẩm...</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  headerSpace: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
    borderWidth: 4,
    borderColor: '#fff',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7C4DFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  badgeIcon: {
    fontSize: 16,
  },
  artistName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    textAlign: 'center',
  },
  nationality: {
    fontSize: 14,
    color: '#7C4DFF',
    marginBottom: 20,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    justifyContent: 'space-around',
    gap: 9,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    padding: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,

  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  styleTag: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  styleText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7C4DFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionIcon: {
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  bioText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  artworkCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  artworkImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#F5F5F5',
  },
  artworkInfo: {
    padding: 16,
  },
  artworkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  artworkDate: {
    fontSize: 13,
    color: '#E91E63',
    fontWeight: '500',
  },
  loadingMore: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
});