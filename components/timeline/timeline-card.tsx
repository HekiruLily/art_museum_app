import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MetObject } from '@/services/met-api';

interface TimelineCardProps {
  artwork: MetObject;
  isLast?: boolean;
}

export function TimelineCard({ artwork, isLast = false }: TimelineCardProps) {
  // Extract categories from tags or classification
  const categories = artwork.tags 
    ? artwork.tags.slice(0, 2).map(tag => tag.term)
    : artwork.classification 
    ? [artwork.classification]
    : [];

  // Get location from country or culture
  const location = artwork.country || artwork.culture || artwork.department;

  // Format year for display (handle negative years for BC)
  const displayYear = artwork.objectBeginDate < 0 
    ? `${Math.abs(artwork.objectBeginDate)} BC`
    : artwork.objectBeginDate;

  return (
    <View style={styles.container}>
      {/* Timeline Line and Year Badge */}
      <View style={styles.timelineLeft}>
        <View style={styles.yearBadge}>
          <Text style={styles.yearText}>
            {artwork.objectBeginDate < 0 ? `-${Math.abs(artwork.objectBeginDate)}` : artwork.objectBeginDate}
          </Text>
        </View>
        {!isLast && <View style={styles.timelineLine} />}
      </View>

      {/* Artwork Card */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          {/* Artwork Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: artwork.primaryImageSmall || artwork.primaryImage }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>

          {/* Artwork Info */}
          <View style={styles.infoContainer}>
            {/* Title */}
            <Text style={styles.title} numberOfLines={2}>
              {artwork.title}
            </Text>

            {/* Artist Name */}
            <Text style={styles.artistName}>
              {artwork.artistDisplayName || 'Unknown'}
            </Text>

            {/* Category Tags */}
            {categories.length > 0 && (
              <View style={styles.tagsContainer}>
                {categories.map((category, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{category}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Location */}
            {location && (
              <View style={styles.locationContainer}>
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={styles.locationText}>{location}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  timelineLeft: {
    width: 60,
    alignItems: 'center',
    position: 'relative',
  },
  yearBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  yearText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  timelineLine: {
    width: 3,
    flex: 1,
    backgroundColor: '#FF6B35',
    position: 'absolute',
    top: 45,
    bottom: -16,
  },
  cardContainer: {
    flex: 1,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#F0F0F0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  artistName: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#666666',
  },
});
