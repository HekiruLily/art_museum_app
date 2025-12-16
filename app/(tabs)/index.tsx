import React, { useState, useMemo } from 'react';
import { StyleSheet, ScrollView, View, Alert } from 'react-native';
import { router } from 'expo-router';
import { HomeHeader } from '@/components/home/home-header';
import { QuickAccessSection } from '@/components/home/quick-access-section';
import { FeaturedArtistsSection } from '@/components/home/featured-artists-section';
import { PopularRoomsSection } from '@/components/home/popular-rooms-section';
import { FeaturedArtworksGrid } from '@/components/home/featured-artworks-grid';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { MOCK_CATEGORIES, MOCK_ROOMS, MOCK_ARTWORKS } from '@/data/mock-data';
import { Artist, Category, Room, Artwork } from '@/models/types';
import { useMetArtists, useMetDepartments, useMetArtworks, useRecentArtworks } from '@/hooks/use-met-api';

/**
 * Helper function to parse year from objectDate string
 * Examples: "1889", "ca. 1889", "1860-1870", "17th century"
 */
function parseYear(objectDate: string): number {
  if (!objectDate) return 0;
  
  // Extract first 4-digit number from the string
  const yearMatch = objectDate.match(/\b(\d{4})\b/);
  if (yearMatch) {
    return parseInt(yearMatch[1]);
  }
  
  // Handle century format like "17th century"
  const centuryMatch = objectDate.match(/(\d{1,2})(?:st|nd|rd|th)\s+century/i);
  if (centuryMatch) {
    const century = parseInt(centuryMatch[1]);
    return (century - 1) * 100 + 50; // Return middle year of century
  }
  
  return 0; // Return 0 if unable to parse
}

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch featured artists from Met Museum API
  const { artists: metArtists, loading: artistsLoading } = useMetArtists(4);
  
  // Fetch featured departments from Met Museum API
  const { departments: metDepartments, loading: departmentsLoading } = useMetDepartments(3);
  
  // Fetch featured artworks from Met Museum API
  const { artworks: metArtworks, loading: artworksLoading } = useMetArtworks(10);
  
  // Fetch recent artworks from Met Museum API
  const { artworks: metRecentArtworks, loading: recentArtworksLoading } = useRecentArtworks(10);
  
  // Transform Met API data to our Artist type
  const artists: Artist[] = useMemo(() => {
    const colors = ['#8B5CF6', '#3B82F6', '#EC4899', '#F59E0B', '#10B981'];
    
    return metArtists.map((metArtist, index) => ({
      id: `met-${index}`,
      name: metArtist.name,
      artworkCount: metArtist.artworkCount,
      primaryImage: metArtist.primaryImage,
      color: colors[index % colors.length],
    }));
  }, [metArtists]);

  // Transform Met API departments to our Room type
  const rooms: Room[] = useMemo(() => {
    const colors = ['#EC4899', '#8B5CF6', '#F59E0B'];
    
    return metDepartments.map((dept, index) => ({
      id: `dept-${dept.departmentId}`,
      name: dept.name,
      artworkCount: dept.artworkCount,
      departmentId: dept.departmentId,
      color: colors[index % colors.length],
    }));
  }, [metDepartments]);

  // Transform Met API artworks to our Artwork type
  const featuredArtworks: Artwork[] = useMemo(() => {
    return metArtworks.map((metArtwork, index) => ({
      id: `artwork-${metArtwork.objectID}`,
      title: metArtwork.title,
      artistName: metArtwork.artistDisplayName || 'Unknown Artist',
      year: parseYear(metArtwork.objectDate),
      imageUrl: metArtwork.primaryImage,
      isFeatured: true,
    }));
  }, [metArtworks]);

  // Transform Met API recent artworks to our Artwork type
  const recentArtworks: Artwork[] = useMemo(() => {
    return metRecentArtworks.map((metArtwork, index) => ({
      id: `recent-${metArtwork.objectID}`,
      title: metArtwork.title,
      artistName: metArtwork.artistDisplayName || 'Unknown Artist',
      year: parseYear(metArtwork.objectDate),
      imageUrl: metArtwork.primaryImage,
      isNew: true,
    }));
  }, [metRecentArtworks]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Implement search logic here
  };

  const handleCategoryPress = (category: Category) => {
    // Navigate to timeline screen if Timeline category
    if (category.id === '4' || category.name === 'Timeline') {
      router.push('/timeline');
    } else {
      Alert.alert('Category', `Navigating to ${category.name}`);
      // Navigate to other category screens
    }
  };

  const handleArtistPress = (artist: Artist) => {
    Alert.alert('Artist', `Viewing ${artist.name}`);
    // Navigate to artist detail screen
  };

  const handleRoomPress = (room: Room) => {
    Alert.alert('Room', `Viewing ${room.name}`);
    // Navigate to room detail screen
  };

  const handleArtworkPress = (artwork: Artwork) => {
    Alert.alert('Artwork', `Viewing ${artwork.title}`);
    // Navigate to artwork detail screen
  };

  const handleViewAllArtists = () => {
    Alert.alert('View All', 'Viewing all artists');
    // Navigate to artists list screen
  };

  const handleViewAllRooms = () => {
    Alert.alert('View All', 'Viewing all rooms');
    // Navigate to rooms list screen
  };

  const handleTabPress = (tab: 'home' | 'artworks' | 'search' | 'favorites') => {
    Alert.alert('Navigation', `Navigating to ${tab}`);
    // Navigate to different tabs
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader onSearch={handleSearch} />
        
        <View style={styles.content}>
          <QuickAccessSection 
            categories={MOCK_CATEGORIES}
            onCategoryPress={handleCategoryPress}
          />
          
          <FeaturedArtistsSection 
            artists={artists}
            loading={artistsLoading}
            onArtistPress={handleArtistPress}
            onViewAll={handleViewAllArtists}
          />
          
          <PopularRoomsSection 
            rooms={rooms}
            loading={departmentsLoading}
            onRoomPress={handleRoomPress}
            onViewAll={handleViewAllRooms}
          />

          <FeaturedArtworksGrid
            featuredArtworks={featuredArtworks}
            recentArtworks={recentArtworks}
            featuredLoading={artworksLoading}
            recentLoading={recentArtworksLoading}
            onArtworkPress={handleArtworkPress}
          />
        </View>
      </ScrollView>

      <BottomNavigation 
        activeTab="home"
        onTabPress={handleTabPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 20,
    paddingBottom: 40,
  },
});
