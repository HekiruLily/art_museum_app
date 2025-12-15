import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';

export default function ArtworkCard({ artwork, onPress }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Check if artwork is currently on display
  const isOnDisplay = (artwork.GalleryNumber && artwork.GalleryNumber !== '') || artwork.isOnView === true;
  const liked = isFavorite(artwork.objectID);
  
  const handleFavoritePress = () => {
    toggleFavorite(artwork.objectID);
  };
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: artwork.primaryImage }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {artwork.title || 'Untitled'}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {artwork.artistDisplayName || 'Unknown'}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.date} numberOfLines={1}>{artwork.objectDate || 'N/A'}</Text>
          {isOnDisplay && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Trưng bày</Text>
            </View>
          )}
          <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
            <Text style={[styles.favoriteIcon, liked && styles.favoriteIconActive]}>
              {liked ? '❤️' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#F5F5F5',
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  artist: {
    fontSize: 12,
    color: '#5E35B1',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 11,
    color: '#999',
    flex: 1,
    marginRight: 4,
  },
  badge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 18,
    color: '#FF9800',
  },
});
