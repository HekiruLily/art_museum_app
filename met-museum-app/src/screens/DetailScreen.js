import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Linking,
  StatusBar,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useFavorites } from '../context/FavoritesContext';
import { useMusic } from '../context/MusicContext';
import MusicPlayer from '../components/MusicPlayer';
import MiniPlayer from '../components/MiniPlayer';
import { DeezerService } from '../services/deezerService';

const { width, height } = Dimensions.get('window');

export default function DetailScreen({ route, navigation }) {
  const { artwork } = route.params;
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(artwork.objectID);
  
  // Use shared music context
  const { loadTracks, playableTracks, stopAndClear, pause } = useMusic();

  // UI states
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [loadingMusic, setLoadingMusic] = useState(false);
  const [musicLoaded, setMusicLoaded] = useState(false);

  const openInBrowser = () => {
    if (artwork.objectURL) {
      Linking.openURL(artwork.objectURL);
    }
  };

  const openGoogleMaps = async () => {
    // The Metropolitan Museum of Art coordinates
    const metMuseumLat = 40.7794;
    const metMuseumLng = -73.9632;
    
    try {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        // Get current location
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        const userLat = location.coords.latitude;
        const userLng = location.coords.longitude;
        
        // Open Google Maps with directions from current location
        const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${metMuseumLat},${metMuseumLng}&travelmode=transit`;
        
        Linking.openURL(url);
      } else {
        // Permission denied - open maps without origin (user can set manually)
        Alert.alert(
          'Quyền vị trí bị từ chối',
          'Bạn có muốn mở bản đồ mà không có vị trí hiện tại không?',
          [
            { text: 'Hủy', style: 'cancel' },
            { 
              text: 'Mở bản đồ', 
              onPress: () => {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${metMuseumLat},${metMuseumLng}&travelmode=transit`;
                Linking.openURL(url);
              }
            },
          ]
        );
      }
    } catch (error) {
      console.error('Location error:', error);
      // Fallback - open maps without origin
      const url = `https://www.google.com/maps/dir/?api=1&destination=${metMuseumLat},${metMuseumLng}&travelmode=transit`;
      Linking.openURL(url);
    }
  };

  const handleImagePress = async () => {
    setShowFullImage(true);
    
    // Only load music if not already loaded
    if (!musicLoaded) {
      setLoadingMusic(true);
      
      try {
        // Search for tracks based on artwork mood using Deezer
        const result = await DeezerService.searchTracks(artwork);
        
        if (result.tracks.length > 0) {
          // Load tracks into shared context
          loadTracks(result.tracks, result.mood, result.moodDescription);
          setMusicLoaded(true);
        }
      } catch (error) {
        console.error('Music analysis error:', error);
      } finally {
        setLoadingMusic(false);
      }
    }
  };

  const handleExpandPlayer = () => {
    setShowMusicPlayer(true);
  };

  const closeFullImage = () => {
    setShowFullImage(false);
    setShowMusicPlayer(false);
    // Stop music when closing fullscreen
    pause();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#2c5feb', '#9034ea']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết tác phẩm</Text>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(artwork.objectID)}
        >
          <Text style={[styles.favoriteIcon, favorited && styles.favoriteIconActive]}>
            {favorited ? '❤️' : '♡'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Main Image - Tap to open fullscreen with music */}
        <TouchableOpacity 
          style={styles.imageContainer}
          onPress={handleImagePress}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: artwork.primaryImage }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          <View style={styles.imageTapHint}>
            <Text style={styles.imageTapHintText}>🎵 Nhấn để thưởng thức</Text>
          </View>
        </TouchableOpacity>

        {/* Content Card */}
        <View style={styles.contentCard}>
          {/* Title */}
          <Text style={styles.title}>{artwork.title || 'Untitled'}</Text>

          {/* Artist Name */}
          {artwork.artistDisplayName && (
            <Text style={styles.artist}>{artwork.artistDisplayName}</Text>
          )}

          {/* Date */}
          {artwork.objectDate && (
            <Text style={styles.date}>{artwork.objectDate}</Text>
          )}

          {/* Info Cards */}
          <View style={styles.infoCardsContainer}>
            {/* Medium Card */}
            {artwork.medium && (
              <View style={styles.infoCardWrapper}>
                <LinearGradient
                  colors={['#f7f5ff', '#f3f5ff']}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.infoCard}
                >
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.iconCircle}
                  >
                    <Text style={styles.iconText}>🎨</Text>
                  </LinearGradient>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Chất liệu</Text>
                    <Text style={styles.infoValue}>{artwork.medium}</Text>
                  </View>
                </LinearGradient>
              </View>
            )}

            {/* Dimensions Card */}
            {artwork.dimensions && (
              <View style={styles.infoCardWrapper}>
                <LinearGradient
                  colors={['#fcf2f9', '#fbf3fc']}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.infoCard}
                >
                  <LinearGradient
                    colors={['#f093fb', '#f5576c']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.iconCircle}
                  >
                    <Text style={styles.iconText}>📏</Text>
                  </LinearGradient>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Kích thước</Text>
                    <Text style={styles.infoValue}>{artwork.dimensions}</Text>
                  </View>
                </LinearGradient>
              </View>
            )}

            {/* Department Card */}
            {artwork.department && (
              <View style={styles.infoCardWrapper}>
                <LinearGradient
                  colors={['#fff1f4', '#fef2f6']}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.infoCard}
                >
                  <LinearGradient
                    colors={['#f14378', '#9c4e93ff']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.iconCircle}
                  >
                    <Text style={styles.iconText}>🏛️</Text>
                  </LinearGradient>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Phòng ban</Text>
                    <Text style={styles.infoValue}>{artwork.department}</Text>
                  </View>
                </LinearGradient>
              </View>
            )}

            {/* Location Card - Tap to open Google Maps */}
            {(artwork.galleryNumber || artwork.objectName || artwork.culture) && (
              <TouchableOpacity 
                style={styles.infoCardWrapper}
                onPress={openGoogleMaps}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#ecfdf5', '#eefdf4']}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.infoCard}
                >
                  <LinearGradient
                    colors={['#43e97b', '#38f9d7']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.iconCircle}
                  >
                    <Text style={styles.iconText}>📍</Text>
                  </LinearGradient>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Vị trí trưng bày</Text>
                    <Text style={styles.infoValue}>
                      {artwork.galleryNumber ? `Gallery ${artwork.galleryNumber}` : 
                       artwork.objectName || artwork.culture || 'Đang trưng bày'}
                    </Text>
                    <Text style={styles.infoHint}>🗺️ Nhấn để xem chỉ đường</Text>
                  </View>
                  <Text style={styles.arrowIcon}>→</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          {/* Description Section */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Mô tả</Text>
            <Text style={styles.descriptionText}>
              {artwork.artistDisplayBio || 'Thông tin về tác phẩm nghệ thuật này từ bộ sưu tập của Bảo tàng Metropolitan.'}
            </Text>
          </View>

          {/* Additional Images */}
          {artwork.additionalImages && artwork.additionalImages.length > 0 && (
            <View style={styles.additionalSection}>
              <Text style={styles.sectionTitle}>Hình ảnh khác</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.additionalScrollView}
              >
                {artwork.additionalImages.map((imageUrl, index) => (
                  <Image
                    key={index}
                    source={{ uri: imageUrl }}
                    style={styles.additionalImage}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* View on Website Button */}
          {artwork.objectURL && (
            <TouchableOpacity style={styles.websiteButton} onPress={openInBrowser}>
              <Text style={styles.websiteButtonText}>XEM TRÊN TRANG WEB MET MUSEUM</Text>
            </TouchableOpacity>
          )}
          
          {/* Spacer for floating button */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Fullscreen Image Modal with Music */}
      <Modal
        visible={showFullImage}
        animationType="fade"
        onRequestClose={closeFullImage}
        statusBarTranslucent
      >
        <View style={styles.fullImageContainer}>
          <StatusBar barStyle="light-content" />
          
          {/* Background blur */}
          <Image
            source={{ uri: artwork.primaryImage }}
            style={styles.fullImageBackground}
            blurRadius={30}
          />
          <View style={styles.fullImageOverlay} />
          
          {/* Close button */}
          <TouchableOpacity style={styles.closeFullImageButton} onPress={closeFullImage}>
            <Text style={styles.closeFullImageText}>✕</Text>
          </TouchableOpacity>
          
          {/* Main image */}
          <Image
            source={{ uri: artwork.primaryImage }}
            style={styles.fullImage}
            resizeMode="contain"
          />
          
          {/* Artwork info */}
          <View style={styles.fullImageInfo}>
            <Text style={styles.fullImageTitle} numberOfLines={2}>{artwork.title}</Text>
            {artwork.artistDisplayName && (
              <Text style={styles.fullImageArtist}>{artwork.artistDisplayName}</Text>
            )}
          </View>
          
          {/* Music loading indicator */}
          {loadingMusic && (
            <View style={styles.musicLoadingContainer}>
              <ActivityIndicator color="#fff" size="large" />
              <Text style={styles.musicLoadingText}>Đang phân tích cảm xúc...</Text>
            </View>
          )}

          {/* Mini Player */}
          {!loadingMusic && playableTracks.length > 0 && (
            <MiniPlayer
              artwork={artwork}
              onExpand={handleExpandPlayer}
              visible={showFullImage}
            />
          )}
        </View>
      </Modal>

      {/* Music Player Modal */}
      <MusicPlayer
        visible={showMusicPlayer}
        onClose={() => setShowMusicPlayer(false)}
        artwork={artwork}
      />

      {/* Floating Like Button */}
      <View style={styles.floatingButtonContainer}>
        <LinearGradient
          colors={favorited ? ['#4CAF50', '#66BB6A'] : ['#E91E63', '#FF5252']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.floatingButton}
        >
          <TouchableOpacity 
            style={styles.floatingButtonTouchable}
            onPress={() => toggleFavorite(artwork.objectID)}
          >
            <Text style={styles.floatingButtonIcon}>{favorited ? '❤️' : '♡'}</Text>
            <Text style={styles.floatingButtonText}>
              {favorited ? 'Đã thêm vào yêu thích' : 'Thêm vào yêu thích'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#5E35B1',
    paddingTop: 40,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: {
    color: '#fff',
    fontSize: 24,
  },
  favoriteIconActive: {
    color: '#FF5252',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: height * 0.35,
    width: width,
    backgroundColor: '#000',
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageTapHint: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  imageTapHintText: {
    color: '#fff',
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  contentCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  artist: {
    fontSize: 16,
    color: '#5E35B1',
    marginBottom: 4,
    fontWeight: '600',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  infoCardsContainer: {
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  infoHint: {
    fontSize: 11,
    color: '#43e97b',
    marginTop: 4,
  },
  arrowIcon: {
    fontSize: 18,
    color: '#43e97b',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  additionalSection: {
    marginBottom: 24,
  },
  additionalScrollView: {
    marginTop: 12,
  },
  additionalImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
  },
  websiteButton: {
    backgroundColor: '#5E35B1',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  websiteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  fullImageContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImageBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  fullImageOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  closeFullImageButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeFullImageText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  fullImage: {
    width: width,
    height: height * 0.6,
  },
  fullImageInfo: {
    position: 'absolute',
    bottom: 140,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  fullImageTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  fullImageArtist: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    textAlign: 'center',
  },
  musicLoadingContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
  },
  musicLoadingText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 10,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  floatingButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  floatingButtonIcon: {
    fontSize: 24,
    color: '#fff',
    marginRight: 10,
  },
  floatingButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
