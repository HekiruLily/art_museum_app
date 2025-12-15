import React from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFavorites } from '../context/FavoritesContext';

const { width, height } = Dimensions.get('window');

export default function DetailScreen({ route, navigation }) {
  const { artwork } = route.params;
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(artwork.objectID);

  const openInBrowser = () => {
    if (artwork.objectURL) {
      Linking.openURL(artwork.objectURL);
    }
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
        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: artwork.primaryImage }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>

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

            {/* Location Card */}
            {(artwork.galleryNumber || artwork.objectName || artwork.culture) && (
              <View style={styles.infoCardWrapper}>
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
                  </View>
                </LinearGradient>
              </View>
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
  },
  mainImage: {
    width: '100%',
    height: '100%',
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
