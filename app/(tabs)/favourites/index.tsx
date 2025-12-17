import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useFavorites } from '@/context/FavoritesContext';
import { metMuseumAPI } from '@/services/met-api';

interface FavoriteArtwork {
  objectID: number;
  title: string;
  artistDisplayName: string;
  primaryImageSmall: string;
}

function FavouriteCard({ 
  item, 
  onToggle, 
  onPress 
}: { 
  item: FavoriteArtwork; 
  onToggle: (id: number) => void;
  onPress: (id: number) => void;
}) {
  return (
    <Pressable style={styles.card} onPress={() => onPress(item.objectID)}>
      <Image 
        source={{ uri: item.primaryImageSmall || 'https://via.placeholder.com/150' }} 
        style={styles.image} 
        resizeMode="cover"
      />
      <Pressable style={styles.heart} onPress={() => onToggle(item.objectID)}>
        <View style={styles.heartInner}>
          <MaterialIcons name="favorite" size={18} color="#ff2d6f" />
        </View>
      </Pressable>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {item.title || 'Không có tiêu đề'}
        </Text>
        <Text style={styles.author}>
          {item.artistDisplayName || 'Nghệ sĩ không xác định'}
        </Text>
      </View>
    </Pressable>
  );
}

export default function FavouritesScreen() {
  const router = useRouter();
  const { favorites, toggleFavorite } = useFavorites();
  const [artworks, setArtworks] = useState<FavoriteArtwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavoriteArtworks();
  }, [favorites]);

  const loadFavoriteArtworks = async () => {
    try {
      setLoading(true);
      const artworkPromises = favorites.map(id => metMuseumAPI.getArtworkById(id));
      const artworkData = await Promise.all(artworkPromises);
      setArtworks(artworkData.filter(art => art !== null));
    } catch (error) {
      console.error('Error loading favorite artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const onExplore = () => {
    router.push('/artworks');
  };

  const onToggle = (id: number) => {
    toggleFavorite(id);
  };

  const onArtworkPress = (id: number) => {
    router.push(`/artwork-detail?artworkId=${id}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Yêu thích</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.heartCircle}>
            <MaterialIcons name="favorite" size={42} color="#fff" />
          </View>
          <Text style={styles.emptyTitle}>Chưa có tác phẩm yêu thích</Text>
          <Text style={styles.emptySubtitle}>
            Hãy khám phá và thêm tác phẩm vào danh sách yêu thích của bạn
          </Text>
          <Pressable style={styles.exploreButton} onPress={onExplore}>
            <View style={styles.exploreInner}>
              <MaterialIcons name="collections" size={18} color="#fff" />
              <Text style={styles.exploreText}>  Khám phá tác phẩm</Text>
            </View>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={artworks}
          keyExtractor={(i) => i.objectID.toString()}
          contentContainerStyle={styles.list}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => (
            <FavouriteCard item={item} onToggle={onToggle} onPress={onArtworkPress} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 80,
    paddingTop: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8e3cff',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  back: {
    position: 'absolute',
    left: 12,
    top: 38,
  },
  headerTitle: { color: '#fff', fontWeight: '700', fontSize: 18 },
  emptyContainer: { alignItems: 'center', paddingTop: 40 },
  heartCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#ff7fb3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  emptySubtitle: { 
    color: '#7a7a7a', 
    marginBottom: 18, 
    textAlign: 'center', 
    paddingHorizontal: 40 
  },
  exploreButton: { marginTop: 8 },
  exploreInner: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7c3aed',
  },
  exploreText: { color: '#fff', fontWeight: '700' },
  list: { padding: 12, paddingTop: 18 },
  // Card styles
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  image: {
    height: 140,
    width: '100%',
  },
  info: {
    padding: 10,
  },
  title: {
    fontWeight: '700',
    marginBottom: 6,
    fontSize: 13,
  },
  author: {
    color: '#9b4dff',
    fontSize: 12,
  },
  heart: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  heartInner: {
    backgroundColor: '#fff',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
});
