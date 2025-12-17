import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Modal, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SearchBar } from '@/components/search/SearchBar';
import SearchFiltersContent from '@/components/search/SearchFiltersContent';
import { SearchResultCard } from '@/components/search/SearchResultCard';
import { useSearch } from '@/hooks/search/useSearch';
import { LinearGradient } from 'expo-linear-gradient';
import { metMuseumAPI } from '@/services/met-api';

export default function SearchScreen() {
  const router = useRouter();
  const s = useSearch();
  const [showFilters, setShowFilters] = React.useState(false);
  const tint = '#8B5CF6'; // Purple color to match the app theme

  // Handle navigation to artwork detail page
  const handleArtworkPress = (item: any) => {
    router.push({
      pathname: '/artwork-detail',
      params: { artworkId: item.objectID }
    });
  };

  // Handle navigation to artist detail page
  const handleArtistPress = async (item: any) => {
    if (!item.artistDisplayName || item.artistDisplayName.trim() === '') {
      return;
    }

    try {
      // Fetch artist portfolio data
      const portfolios = await metMuseumAPI.getArtistPortfolios([item.artistDisplayName]);
      
      if (portfolios.length > 0) {
        const artistData = portfolios[0];
        router.push({
          pathname: '/artist-detail',
          params: {
            artistData: JSON.stringify(artistData)
          }
        });
      }
    } catch (error) {
      console.error('Error loading artist details:', error);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* HEADER GRADIENT */}
        <LinearGradient
        colors={['#5145e5', '#9233ea']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Pressable style={styles.back} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </Pressable>

        <Text style={styles.headerTitle}>Tìm kiếm</Text>
      </LinearGradient>

      <SearchBar
        value={s.query}
        onChange={s.setQuery}
        onSearch={s.applySearch}
        onOpenFilters={() => setShowFilters(true)}
      />

      <Modal
        visible={showFilters}
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
        transparent
      >
        <View style={styles.filterBackdrop}>
          <View style={styles.filterSheet}>
            <View style={styles.filterHeaderRow}>
              <Text style={styles.filterTitle}>Bộ lọc</Text>

              <Pressable onPress={() => setShowFilters(false)} style={{ padding: 6 }}>
                <MaterialIcons name="close" size={22} color="#333" />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-evenly', paddingVertical: 8, paddingBottom: 50 }}>
              <SearchFiltersContent
                departments={s.departments}
                selected={s.selectedDepartments}
                toggleDept={s.toggleDepartment}
                selectedLocations={s.selectedLocations}
                toggleLocation={s.toggleLocation}
                selectedThemes={s.selectedThemes}
                toggleTheme={s.toggleTheme}
                clearFilters={s.clearFilters}
                hideActions
                availableThemes={s.availableThemes}
                availableLocations={s.availableLocations}
              />
            </ScrollView>

            <View style={styles.filterFooter}>
              <Pressable onPress={() => { s.clearFilters(); }} style={styles.filterClearBtn}>
                <Text style={{ color: tint, fontWeight: '700' }}>Xóa bộ lọc</Text>
              </Pressable>

              <Pressable
                onPress={() => { setShowFilters(false); s.applySearch(); }}
                style={[styles.filterApplyBtn, { backgroundColor: tint }]}
              >
                <Text style={{ color: '#fff', fontWeight: '700' }}>Áp dụng</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ paddingHorizontal: 12, paddingTop: 12, flex: 1 }}>
        <Text style={{ fontWeight: '700', marginBottom: 8 }}>Kết quả ({s.results.length})</Text>

        <FlatList
          data={s.results}
          keyExtractor={(i) => String(i.objectID)}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => (
            <SearchResultCard 
              item={item} 
              onPressArtwork={() => handleArtworkPress(item)}
              onPressArtist={() => handleArtistPress(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="search" size={64} color="#ccc" />
              <Text style={styles.emptyText}>
                {s.loading ? 'Đang tìm kiếm...' : 'Không tìm thấy kết quả'}
              </Text>
              <Text style={styles.emptySubText}>
                Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
              </Text>
            </View>
          }
        />
      </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  header: { paddingTop: 48, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  back: { padding: 6, marginRight: 10 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  filterBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' },
  filterSheet: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '80%' },
  filterHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  filterTitle: { fontSize: 18, fontWeight: '700' },
  filterFooter: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0', backgroundColor: '#fff' },
  filterClearBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: '#8B5CF6', borderRadius: 8, marginRight: 8 },
  filterApplyBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});
