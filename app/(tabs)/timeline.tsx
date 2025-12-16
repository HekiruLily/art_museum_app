import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { TimelineCard } from '@/components/timeline/timeline-card';
import { useMetTimeline } from '@/hooks/use-met-api';

export default function TimelineScreen() {
  const [activeTab, setActiveTab] = useState('timeline');
  const { artworks, loading, error } = useMetTimeline();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.replace('/(tabs)/')}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dòng thời gian nghệ thuật</Text>
      </View>

      {/* Timeline Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.timelineContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF6B35" />
              <Text style={styles.loadingText}>Đang tải timeline...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Không thể tải dữ liệu</Text>
              <Text style={styles.errorSubtext}>{error.message}</Text>
            </View>
          ) : artworks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Không có dữ liệu timeline</Text>
            </View>
          ) : (
            artworks.map((artwork, index) => (
              <TimelineCard
                key={artwork.objectID}
                artwork={artwork}
                isLast={index === artworks.length - 1}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
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
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#FF6B35',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  timelineContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
});
