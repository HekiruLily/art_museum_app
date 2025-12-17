import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { metMuseumAPI } from '@/services/met-api';
import { ArtworkCard } from '@/components/home/artwork-card';

interface Tab {
  id: string;
  label: string;
  searchQuery: string;
}

interface Filter {
  id: string;
  label: string;
}

interface TabCounts {
  [key: string]: number;
}

interface FilterCounts {
  all: number;
  featured: number;
  displaying: number;
}

export default function ArtworksScreen() {
  const [, setArtworks] = useState<any[]>([]);
  const [allArtworks, setAllArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [objectIds, setObjectIds] = useState<number[]>([]);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [tabCounts, setTabCounts] = useState<TabCounts>({ all: 0, painting: 0, sculpture: 0 });
  const [filterCounts, setFilterCounts] = useState<FilterCounts>({ all: 0, featured: 0, displaying: 0 });
  const ITEMS_PER_PAGE = 10;

  // Tabs data - using specific search queries for each category
  const tabs: Tab[] = [
    { id: 'all', label: 'Tất cả', searchQuery: 'van gogh' },
    { id: 'painting', label: 'Tranh vẽ', searchQuery: 'oil canvas' },
    { id: 'sculpture', label: 'Điêu khắc', searchQuery: 'marble statue' },
  ];

  // Filter chips
  const filters: Filter[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'featured', label: 'Nổi bật' },
    { id: 'displaying', label: 'Đang trưng bày' },
  ];

  useEffect(() => {
    loadInitialArtworks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadInitialArtworks = async () => {
    setLoading(true);
    try {
      const currentTab = tabs.find(t => t.id === selectedTab);
      if (!currentTab) return;
      
      // Fetch all artworks count
      const searchResult = await metMuseumAPI.searchArtworks(currentTab.searchQuery);
      
      // Fetch on-view artworks count
      const onViewResult = await metMuseumAPI.searchArtworks(currentTab.searchQuery, { hasImages: true, isHighlight: true });
      
      if (searchResult && searchResult.objectIDs && searchResult.objectIDs.length > 0) {
        setObjectIds(searchResult.objectIDs);
        setTabCounts(prev => ({ ...prev, [selectedTab]: searchResult.objectIDs?.length || 0 }));
        
        // Set initial filter counts from API
        setFilterCounts({
          all: searchResult.objectIDs.length,
          featured: 0, // Will be updated after loading details
          displaying: onViewResult?.objectIDs ? onViewResult.objectIDs.length : 0
        });
        
        await loadArtworksByPage(searchResult.objectIDs, 0);
      } else {
        setArtworks([]);
        setAllArtworks([]);
      }
    } catch (error) {
      console.error('Error loading initial artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadArtworksByPage = async (ids: number[], pageNum: number) => {
    const start = pageNum * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageIds = ids.slice(start, end);

    const artworkDetails = await Promise.all(
      pageIds.map(async (id) => {
        try {
          const details = await metMuseumAPI.getArtworkById(id);
          if (details && details.primaryImage) {
            return details;
          }
          return null;
        } catch {
          return null;
        }
      })
    );

    const validArtworks = artworkDetails.filter((artwork): artwork is NonNullable<typeof artwork> => artwork !== null);
    
    if (pageNum === 0) {
      setAllArtworks(validArtworks);
      setArtworks(validArtworks);
      updateFilterCounts(validArtworks);
    } else {
      // Remove duplicates when adding new artworks
      setAllArtworks((prev) => {
        const existingIds = new Set(prev.map(a => a.objectID));
        const newArtworks = validArtworks.filter(a => !existingIds.has(a.objectID));
        const combined = [...prev, ...newArtworks];
        updateFilterCounts(combined);
        return combined;
      });
      setArtworks((prev) => {
        const existingIds = new Set(prev.map(a => a.objectID));
        const newArtworks = validArtworks.filter(a => !existingIds.has(a.objectID));
        return [...prev, ...newArtworks];
      });
    }
    setPage(pageNum);
  };

  const updateFilterCounts = (artworksList: any[]) => {
    const featured = artworksList.filter(a => a.isHighlight || a.isPublicDomain).length;
    
    // Update featured count but keep displaying count from API
    setFilterCounts(prev => ({
      ...prev,
      all: prev.all, // Keep from API
      featured,
      displaying: prev.displaying // Keep from API
    }));
  };

  const getFilteredArtworks = () => {
    if (selectedFilter === 'all') {
      return allArtworks;
    } else if (selectedFilter === 'featured') {
      return allArtworks.filter(a => a.isHighlight || a.isPublicDomain);
    } else if (selectedFilter === 'displaying') {
      return allArtworks.filter(a => 
        (a.GalleryNumber && a.GalleryNumber !== '') || 
        a.isOnView === true
      );
    }
    return allArtworks;
  };

  const handleTabChange = async (tabId: string) => {
    setSelectedTab(tabId);
    setSelectedFilter('all');
    setLoading(true);
    setAllArtworks([]);
    setArtworks([]);
    
    const currentTab = tabs.find(t => t.id === tabId);
    if (!currentTab) return;
    
    console.log(`📑 Chuyển sang tab: ${currentTab?.label}`);
    
    try {
      // Fetch all artworks
      const searchResult = await metMuseumAPI.searchArtworks(currentTab.searchQuery);
      
      // Fetch on-view artworks count
      const onViewResult = await metMuseumAPI.searchArtworks(currentTab.searchQuery, { hasImages: true, isHighlight: true });
      
      if (searchResult?.objectIDs && searchResult.objectIDs.length > 0) {
        setObjectIds(searchResult.objectIDs);
        setTabCounts(prev => ({ ...prev, [tabId]: searchResult.objectIDs?.length || 0 }));
        
        // Set filter counts from API
        setFilterCounts({
          all: searchResult.objectIDs.length,
          featured: 0,
          displaying: onViewResult?.objectIDs ? onViewResult.objectIDs.length : 0
        });
        
        await loadArtworksByPage(searchResult.objectIDs, 0);
        console.log(`✅ Đã tải ${searchResult.objectIDs.length} tác phẩm`);
      } else {
        setArtworks([]);
        setAllArtworks([]);
        setTabCounts(prev => ({ ...prev, [tabId]: 0 }));
        setFilterCounts({ all: 0, featured: 0, displaying: 0 });
      }
    } catch (error) {
      console.error('Error changing tab:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (filterId: string) => {
    console.log(`🔍 Áp dụng bộ lọc: ${filters.find(f => f.id === filterId)?.label}`);
    setSelectedFilter(filterId);
    
    // If switching to "displaying", reload with isOnView=true for better results
    if (filterId === 'displaying') {
      setLoading(true);
      try {
        const currentTab = tabs.find(t => t.id === selectedTab);
        if (!currentTab) return;
        
        const searchResult = await metMuseumAPI.searchArtworks(currentTab.searchQuery, { hasImages: true, isHighlight: true });
        if (searchResult?.objectIDs && searchResult.objectIDs.length > 0) {
          setObjectIds(searchResult.objectIDs);
          await loadArtworksByPage(searchResult.objectIDs, 0);
          console.log(`✅ Tìm thấy ${searchResult.objectIDs.length} tác phẩm đang trưng bày`);
        } else {
          console.log('❌ Không có tác phẩm đang trưng bày');
        }
      } catch (error) {
        console.error('Error loading on-view artworks:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    console.log('🔍 Đang tìm kiếm:', searchQuery.trim());
    setLoading(true);
    setShowSearchModal(false);
    setPage(0);
    setAllArtworks([]);
    setArtworks([]);
    
    try {
      const searchResult = await metMuseumAPI.searchArtworks(searchQuery.trim());
      if (searchResult?.objectIDs && searchResult.objectIDs.length > 0) {
        console.log(`✅ Tìm thấy ${searchResult.objectIDs.length} tác phẩm`);
        setObjectIds(searchResult.objectIDs);
        await loadArtworksByPage(searchResult.objectIDs, 0);
      } else {
        console.log('❌ Không tìm thấy kết quả nào');
        setArtworks([]);
        setAllArtworks([]);
        setObjectIds([]);
      }
    } catch (error) {
      console.error('❌ Lỗi tìm kiếm:', error);
      setArtworks([]);
      setAllArtworks([]);
      setObjectIds([]);
    } finally {
      setLoading(false);
      console.log('✅ Hoàn thành tìm kiếm');
    }
  };

  const clearSearch = () => {
    console.log('🔄 Xóa tìm kiếm và quay về danh sách ban đầu');
    setSearchQuery('');
    setShowSearchModal(false);
    loadInitialArtworks();
  };

  const loadMore = () => {
    if (!loading && objectIds.length > (page + 1) * ITEMS_PER_PAGE) {
      console.log(`📥 Đang tải thêm... (Trang ${page + 2}/${Math.ceil(objectIds.length / ITEMS_PER_PAGE)})`);
      setLoading(true);
      loadArtworksByPage(objectIds, page + 1).finally(() => {
        setLoading(false);
      });
    }
  };

  // Check if there are more items to load
  const hasMoreItems = objectIds.length > (page + 1) * ITEMS_PER_PAGE;

  const renderItem = ({ item }: { item: any }) => (
    <ArtworkCard
      artwork={item}
      onPress={() => router.push({
        pathname: '/artwork-detail',
        params: { artworkId: item.objectID }
      })}
    />
  );

  const renderFooter = () => {
    if (loading && allArtworks.length > 0) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#5E35B1" />
          <Text style={styles.footerText}>Đang tải thêm...</Text>
        </View>
      );
    }
    
    if (!hasMoreItems && allArtworks.length > 0) {
      return (
        <View style={styles.footerEnd}>
          <Text style={styles.footerEndText}>Đã hiển thị tất cả {allArtworks.length} tác phẩm</Text>
        </View>
      );
    }
    
    return null;
  };

  const filteredArtworks = getFilteredArtworks();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5E35B1" />
      
      {/* Header */}
      <LinearGradient
        colors={['#2961eb', '#d6277e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tất cả tác phẩm</Text>
          <TouchableOpacity onPress={() => setShowSearchModal(true)}>
            <Text style={styles.searchButton}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                selectedTab === tab.id && styles.tabActive
              ]}
              onPress={() => handleTabChange(tab.id)}
            >
              <Text style={[
                styles.tabText,
                selectedTab === tab.id && styles.tabTextActive
              ]}>
                {tab.label}
                {tabCounts[tab.id] > 0 && ` (${tabCounts[tab.id]})`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Filter Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                selectedFilter === filter.id && styles.filterChipActive
              ]}
              onPress={() => handleFilterChange(filter.id)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter.id && styles.filterTextActive
              ]}>
                {filter.label}
                {filterCounts[filter.id as keyof FilterCounts] > 0 && ` (${filterCounts[filter.id as keyof FilterCounts]})`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Artworks Grid */}
      {loading && allArtworks.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5E35B1" />
          <Text style={styles.loadingText}>Đang tải tác phẩm...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredArtworks}
          renderItem={renderItem}
          keyExtractor={(item) => item.objectID.toString()}
          numColumns={2}
          columnWrapperStyle={filteredArtworks.length > 1 ? styles.row : undefined}
          contentContainerStyle={styles.listContent}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Không tìm thấy tác phẩm</Text>
                <Text style={styles.emptySubtext}>Thử thay đổi bộ lọc hoặc tab</Text>
              </View>
            ) : null
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
              <Text style={styles.modalTitle}>Tìm kiếm tác phẩm</Text>
              <TouchableOpacity onPress={() => setShowSearchModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder="Nhập từ khóa (ví dụ: sunflower, picasso)..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <View style={styles.modalButtonGroup}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={clearSearch}
              >
                <Text style={styles.modalButtonTextSecondary}>Xóa & Quay lại</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSearch}
              >
                <Text style={styles.modalButtonText}>Tìm kiếm</Text>
              </TouchableOpacity>
            </View>
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
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
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
  tabsContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
  },
  tabActive: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#5E35B1',
  },
  filtersContainer: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#7C4DFF',
  },
  filterText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#5E35B1',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#5E35B1',
  },
  footerEnd: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerEndText: {
    fontSize: 13,
    color: '#999',
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
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#CCC',
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
  modalButtonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#5E35B1',
  },
  modalButtonSecondary: {
    backgroundColor: '#E0E0E0',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextSecondary: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});
