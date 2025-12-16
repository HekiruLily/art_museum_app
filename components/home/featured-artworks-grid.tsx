import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArtworkCard } from '@/components/home/artwork-card';
import { Artwork } from '@/models/types';

interface FeaturedArtworksGridProps {
  featuredArtworks: Artwork[];
  recentArtworks: Artwork[];
  featuredLoading?: boolean;
  recentLoading?: boolean;
  onArtworkPress?: (artwork: Artwork) => void;
}

export function FeaturedArtworksGrid({ 
  featuredArtworks, 
  recentArtworks,
  featuredLoading = false,
  recentLoading = false,
  onArtworkPress 
}: FeaturedArtworksGridProps) {
  const [activeTab, setActiveTab] = useState<'featured' | 'recent'>('featured');

  const currentArtworks = activeTab === 'featured' ? featuredArtworks : recentArtworks;
  const currentLoading = activeTab === 'featured' ? featuredLoading : recentLoading;

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'featured' && styles.activeTab]}
          onPress={() => setActiveTab('featured')}
        >
          <Text style={[styles.tabText, activeTab === 'featured' && styles.activeTabText]}>
            Nổi bật
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recent' && styles.activeTab]}
          onPress={() => setActiveTab('recent')}
        >
          <Text style={[styles.tabText, activeTab === 'recent' && styles.activeTabText]}>
            Mới cập nhật
          </Text>
        </TouchableOpacity>
      </View>

      {/* Artwork Grid */}
      {currentLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Đang tải tác phẩm...</Text>
        </View>
      ) : currentArtworks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không có tác phẩm nào</Text>
        </View>
      ) : (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {currentArtworks.map((artwork) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              onPress={() => onArtworkPress?.(artwork)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeTab: {
    backgroundColor: '#8B5CF6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#FFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  loadingContainer: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  emptyContainer: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
