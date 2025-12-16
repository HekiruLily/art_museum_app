import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SectionHeader } from '@/components/ui/section-header';
import { ArtistCard } from '@/components/home/artist-card';
import { Artist } from '@/models/types';

interface FeaturedArtistsSectionProps {
  artists: Artist[];
  loading?: boolean;
  onArtistPress?: (artist: Artist) => void;
  onViewAll?: () => void;
}

export function FeaturedArtistsSection({ 
  artists, 
  loading = false,
  onArtistPress, 
  onViewAll 
}: FeaturedArtistsSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <SectionHeader title="Nghệ sĩ nổi bật" onViewAll={onViewAll} />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Đang tải nghệ sĩ...</Text>
        </View>
      ) : artists.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không có dữ liệu nghệ sĩ</Text>
        </View>
      ) : (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {artists.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onPress={() => onArtistPress?.(artist)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerContainer: {
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});
