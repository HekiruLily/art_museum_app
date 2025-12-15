const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';

// Helper function để delay giữa các requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const metMuseumAPI = {
  // Tìm kiếm artworks theo nghệ sỹ
  searchByArtist: async (artistName) => {
    try {
      await delay(100); // Delay 100ms giữa mỗi request
      const response = await fetch(
        `${BASE_URL}/search?artistOrCulture=true&hasImages=true&q=${artistName}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching by artist:', error);
      return { objectIDs: [], total: 0 };
    }
  },

  // Lấy thông tin chi tiết artwork
  getArtworkDetails: async (objectId) => {
    try {
      await delay(100); // Delay 100ms giữa mỗi request
      const response = await fetch(`${BASE_URL}/objects/${objectId}`);
      
      if (!response.ok) {
        // Bỏ qua lỗi 404 (không tồn tại) và 403 (bị chặn) - không log
        if (response.status === 404 || response.status === 403) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      // Chỉ log lỗi không phải 404/403
      if (!error.message.includes('404') && !error.message.includes('403')) {
        console.error(`Error fetching artwork ${objectId}:`, error.message);
      }
      return null;
    }
  },

  // Tìm kiếm nghệ sỹ phổ biến
  searchPopularArtists: async () => {
    const popularArtists = [
      'Vincent van Gogh',
      'Pablo Picasso',
      'Claude Monet',
      'Leonardo da Vinci',
      'Rembrandt',
      'Johannes Vermeer',
      'Michelangelo',
      'Paul Cézanne',
      'Edgar Degas',
      'Pierre-Auguste Renoir'
    ];
    
    return popularArtists;
  },

  // Lấy artworks của nhiều nghệ sỹ
  getArtistPortfolios: async (artistNames) => {
    try {
      const portfolios = [];
      
      // Xử lý tuần tự thay vì parallel để tránh rate limit
      for (const artistName of artistNames) {
        try {
          const searchResult = await metMuseumAPI.searchByArtist(artistName);
          
          if (searchResult.objectIDs && searchResult.objectIDs.length > 0) {
            // Lấy nhiều hơn để đảm bảo có đủ 3 artwork hợp lệ
            const artworkIds = searchResult.objectIDs.slice(0, 10);
            const artworks = [];
            
            // Lấy từng artwork tuần tự
            for (const id of artworkIds) {
              // Dừng khi đã có đủ 3 artworks
              if (artworks.length >= 3) break;
              
              const artwork = await metMuseumAPI.getArtworkDetails(id);
              if (artwork && artwork.primaryImage) {
                artworks.push(artwork);
              }
            }
            
            if (artworks.length > 0) {
              // Lấy thông tin nghệ sỹ từ artwork đầu tiên
              const firstArtwork = artworks[0];
              const artistDisplayName = firstArtwork.artistDisplayName || artistName;
              const artistBio = firstArtwork.artistDisplayBio || '';
              
              // Parse năm sinh/mất từ artistDisplayBio (format: "Dutch, 1853–1890")
              let birthYear = null;
              let deathYear = null;
              const yearMatch = artistBio.match(/(\d{4})[–-](\d{4})/);
              if (yearMatch) {
                birthYear = yearMatch[1];
                deathYear = yearMatch[2];
              }
              
              // Lấy nationality từ artistBio
              const nationalityMatch = artistBio.match(/^([^,]+)/);
              const nationality = nationalityMatch ? nationalityMatch[1] : '';
              
              portfolios.push({
                artistName: artistDisplayName,
                artworks,
                totalWorks: searchResult.total,
                birthYear,
                deathYear,
                nationality,
                artistBio
              });
            }
          }
        } catch (error) {
          console.error(`Error processing artist ${artistName}:`, error);
          // Tiếp tục với nghệ sỹ tiếp theo
          continue;
        }
      }
      
      return portfolios;
    } catch (error) {
      console.error('Error fetching artist portfolios:', error);
      return [];
    }
  },

  // Lấy tất cả artworks của một nghệ sỹ (cho trang chi tiết)
  getArtistAllArtworks: async (artistName, limit = 20) => {
    try {
      const searchResult = await metMuseumAPI.searchByArtist(artistName);
      
      if (!searchResult.objectIDs || searchResult.objectIDs.length === 0) {
        return [];
      }

      const artworkIds = searchResult.objectIDs.slice(0, limit);
      const artworks = [];
      
      // Lấy từng artwork tuần tự
      for (const id of artworkIds) {
        const artwork = await metMuseumAPI.getArtworkDetails(id);
        if (artwork && artwork.primaryImage) {
          artworks.push(artwork);
        }
      }
      
      return artworks;
    } catch (error) {
      console.error(`Error fetching all artworks for ${artistName}:`, error);
      return [];
    }
  }
};
