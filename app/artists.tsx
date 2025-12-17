import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { metMuseumAPI } from '@/services/met-api';
import { ArtistPortfolio } from '@/models/types';

export default function ArtistsScreen() {
  const [artists, setArtists] = useState<ArtistPortfolio[]>([]);
  const [allArtistNames, setAllArtistNames] = useState<string[]>([]);
  const [displayedCount, setDisplayedCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    loadPopularArtists();
  }, []);

  const loadPopularArtists = async () => {
    setLoading(true);
    try {
      const popularArtistNames = await metMuseumAPI.searchPopularArtists();
      setAllArtistNames(popularArtistNames);
      
      const initialArtists = popularArtistNames.slice(0, ITEMS_PER_PAGE);
      const portfolios = await metMuseumAPI.getArtistPortfolios(initialArtists);
      setArtists(portfolios);
      setDisplayedCount(ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error loading artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreArtists = async () => {
    if (loadingMore || displayedCount >= allArtistNames.length) return;

    setLoadingMore(true);
    try {
      const nextArtists = allArtistNames.slice(displayedCount, displayedCount + ITEMS_PER_PAGE);
      const newPortfolios = await metMuseumAPI.getArtistPortfolios(nextArtists);
      setArtists((prev) => [...prev, ...newPortfolios]);
      setDisplayedCount((prev) => prev + ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error loading more artists:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadPopularArtists();
      return;
    }

    setLoading(true);
    setShowSearchModal(false);
    try {
      const portfolios = await metMuseumAPI.getArtistPortfolios([searchQuery]);
      setArtists(portfolios);
    } catch (error) {
      console.error('Error searching artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: ArtistPortfolio }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push({
        pathname: '/artist-detail',
        params: { artistData: JSON.stringify(item) }
      })}
    >
      <ArtistCard artist={item} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      {/* Header */}
      <LinearGradient
        colors={['#5344e5', '#d8277b']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh sách nghệ sĩ</Text>
        <TouchableOpacity onPress={() => setShowSearchModal(true)}>
          <Text style={styles.searchButton}>🔍</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Artists List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5E35B1" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <FlatList
          data={artists}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.artistName}-${index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreArtists}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#5E35B1" />
                <Text style={styles.loadingMoreText}>Đang tải thêm...</Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            !loading && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Không tìm thấy nghệ sĩ</Text>
              </View>
            )
          }
        />
      )}

      {/* Search Modal */}
      <Modal
        visible={showSearchModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSearchModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tìm kiếm nghệ sĩ</Text>
              <TouchableOpacity onPress={() => setShowSearchModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder="Nhập tên nghệ sĩ..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleSearch}
            >
              <Text style={styles.modalButtonText}>Tìm kiếm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ArtistCard component
function ArtistCard({ artist }: { artist: ArtistPortfolio }) {
  const firstArtwork = artist.artworks[0];
  
  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
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
        <Text style={styles.artistName} numberOfLines={1}>
          {artist.artistName}
        </Text>
        <Text style={styles.artistStyle} numberOfLines={1}>
          {artist.nationality || 'Unknown'}
        </Text>
        
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

      <Text style={styles.arrow}>›</Text>
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
    fontSize: 24,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  searchButton: {
    fontSize: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingMoreText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  modalClose: {
    fontSize: 24,
    color: '#999',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#667eea',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  // Artist Card Styles
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
