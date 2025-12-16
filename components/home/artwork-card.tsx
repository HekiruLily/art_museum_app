import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Artwork } from '@/models/types';

interface ArtworkCardProps {
  artwork: Artwork;
  onPress?: () => void;
}

export function ArtworkCard({ artwork, onPress }: ArtworkCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: artwork.imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
        {artwork.isNew && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>MỚI</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {artwork.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {artwork.artistName}
        </Text>
        {artwork.year > 0 && (
          <Text style={styles.year}>{artwork.year}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    marginRight: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  artist: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  year: {
    fontSize: 12,
    color: '#999',
  },
});
