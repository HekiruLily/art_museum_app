import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ArtistCard({ artist }) {
  const firstArtwork = artist.artworks[0];
  
  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        {/* Artist Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: firstArtwork.primaryImageSmall || firstArtwork.primaryImage }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.badge}
          >
            <Text style={styles.badgeIcon}>👤</Text>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.rightSection}>
        {/* Artist Info */}
        <Text style={styles.artistName} numberOfLines={1}>
          {artist.artistName}
        </Text>
        <Text style={styles.artistStyle} numberOfLines={1}>
          {artist.nationality || 'Unknown'}
        </Text>
        
        {/* Dates and Works */}
        <View style={styles.infoRow}>
          <Text style={styles.dates}>
            {artist.birthYear && artist.deathYear 
              ? `${artist.birthYear} - ${artist.deathYear}`
              : 'Unknown'}
          </Text>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.worksTag}
          >
            <Text style={styles.worksText}>{artist.totalWorks} tác phẩm</Text>
          </LinearGradient>
        </View>
      </View>

      {/* Arrow */}
      <Text style={styles.arrow}>›</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  leftSection: {
    marginRight: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
  },
  badge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  badgeIcon: {
    fontSize: 12,
  },
  rightSection: {
    flex: 1,
  },
  artistName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  artistStyle: {
    fontSize: 13,
    color: '#7C4DFF',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dates: {
    fontSize: 12,
    color: '#999',
  },
  worksTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  worksText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  arrow: {
    fontSize: 24,
    color: '#CCCCCC',
    marginLeft: 8,
  },
});