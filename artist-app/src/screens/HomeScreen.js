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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { metMuseumAPI } from '../services/api';
import ArtistCard from '../components/ArtistCard';

export default function HomeScreen({ navigation }) {
  const [artists, setArtists] = useState([]);
  const [allArtistNames, setAllArtistNames] = useState([]);
  const [displayedCount, setDisplayedCount] = useState(5); // Số lượng nghệ sĩ hiển thị ban đầu
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const ITEMS_PER_PAGE = 5; // Số lượng nghệ sĩ mỗi lần tải thêm

  useEffect(() => {
    loadPopularArtists();
  }, []);

  const loadPopularArtists = async () => {
    setLoading(true);
    try {
      const popularArtistNames = await metMuseumAPI.searchPopularArtists();
      setAllArtistNames(popularArtistNames);
      
      // Tải 5 nghệ sĩ đầu tiên
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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('ArtistDetail', { artist: item })}
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
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
    fontSize: 20,
    color: '#fff',
  },
  listContent: {
    paddingTop: 20,
    paddingBottom: 32,
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
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
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
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});