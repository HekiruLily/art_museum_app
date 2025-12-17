// Metropolitan Museum of Art Collection API Service
const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';

export interface MetObject {
  objectID: number;
  isHighlight: boolean;
  primaryImage: string;
  primaryImageSmall: string;
  additionalImages: string[];
  title: string;
  artistDisplayName: string;
  artistDisplayBio: string;
  artistNationality: string;
  artistBeginDate: string;
  artistEndDate: string;
  objectDate: string;
  objectBeginDate: number;
  objectEndDate: number;
  medium: string;
  department: string;
  culture: string;
  period: string;
  classification: string;
  objectURL: string;
  isPublicDomain: boolean;
  country?: string;
  city?: string;
  tags?: Array<{ term: string; AAT_URL: string; Wikidata_URL: string }>;
}

export interface SearchResponse {
  total: number;
  objectIDs: number[] | null;
}

// Danh sách nghệ sĩ nổi tiếng để tìm kiếm
const FAMOUS_ARTISTS = [
  'Vincent van Gogh',
  'Pablo Picasso',
  'Claude Monet',
  'Rembrandt',
  'Leonardo da Vinci',
  'Michelangelo',
  'Johannes Vermeer',
  'Paul Cézanne',
  'Edgar Degas',
  'Pierre-Auguste Renoir',
  'Henri Matisse',
  'Édouard Manet',
  'Katsushika Hokusai',
  'Utagawa Hiroshige',
  'El Greco',
  'Francisco Goya',
  'Diego Velázquez',
  'Raphael',
  'Caravaggio',
  'Peter Paul Rubens',
];

/**
 * Helper function to safely parse JSON responses
 */
async function safeFetch<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      // Don't log 403/404 errors as they're expected for restricted/unavailable objects
      if (response.status !== 403 && response.status !== 404) {
        console.error(`HTTP error! status: ${response.status} for URL: ${url}`);
      }
      return null;
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`Invalid content-type: ${contentType} for URL: ${url}`);
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

/**
 * Tìm kiếm artworks theo query
 */
export async function searchArtworks(query: string, options?: {
  hasImages?: boolean;
  isHighlight?: boolean;
  departmentId?: number;
}): Promise<SearchResponse> {
  const params = new URLSearchParams({ q: query });
  
  if (options?.hasImages) params.append('hasImages', 'true');
  if (options?.isHighlight) params.append('isHighlight', 'true');
  if (options?.departmentId) params.append('departmentId', options.departmentId.toString());
  
  const data = await safeFetch<SearchResponse>(`${BASE_URL}/search?${params}`);
  return data || { total: 0, objectIDs: null };
}

/**
 * Lấy thông tin chi tiết của 1 object
 */
export async function getObject(objectID: number): Promise<MetObject | null> {
  const data = await safeFetch<MetObject>(`${BASE_URL}/objects/${objectID}`);
  return data;
}

/**
 * Lấy danh sách artworks của 1 nghệ sĩ
 */
export async function getArtistArtworks(artistName: string, limit: number = 10): Promise<MetObject[]> {
  try {
    // Search artworks của nghệ sĩ có hình ảnh
    const searchResult = await searchArtworks(artistName, { 
      hasImages: true,
      isHighlight: false 
    });
    
    if (!searchResult.objectIDs || searchResult.objectIDs.length === 0) {
      return [];
    }
    
    // Lấy tối đa {limit} artworks đầu tiên
    const objectIDs = searchResult.objectIDs.slice(0, limit);
    const artworks: MetObject[] = [];
    
    for (const objectID of objectIDs) {
      try {
        const artwork = await getObject(objectID);
        // Chỉ lấy artwork có hình ảnh và đúng nghệ sĩ
        if (artwork && artwork.primaryImage && artwork.artistDisplayName.toLowerCase().includes(artistName.toLowerCase())) {
          artworks.push(artwork);
        }
      } catch (error) {
        console.error(`Error fetching object ${objectID}:`, error);
      }
    }
    
    return artworks;
  } catch (error) {
    console.error(`Error fetching artworks for ${artistName}:`, error);
    return [];
  }
}

/**
 * Lấy 4 nghệ sĩ nổi bật ngẫu nhiên với artworks
 */
export async function getFeaturedArtists(count: number = 4): Promise<{
  name: string;
  artworkCount: number;
  artworks: MetObject[];
  primaryImage?: string;
}[]> {
  // Chọn ngẫu nhiên {count} nghệ sĩ từ danh sách
  const shuffled = [...FAMOUS_ARTISTS].sort(() => 0.5 - Math.random());
  const selectedArtists = shuffled.slice(0, count);
  
  const results = [];
  
  for (const artistName of selectedArtists) {
    try {
      // Tìm tổng số artworks của nghệ sĩ
      const searchResult = await searchArtworks(artistName, { hasImages: true });
      const artworkCount = searchResult.total || 0;
      
      // Lấy một số artworks để hiển thị (và lấy hình ảnh đầu tiên)
      const artworks = await getArtistArtworks(artistName, 5);
      
      results.push({
        name: artistName,
        artworkCount,
        artworks,
        primaryImage: artworks[0]?.primaryImageSmall || artworks[0]?.primaryImage,
      });
      
      // Delay nhỏ để tránh rate limit (80 requests/second)
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error fetching artist ${artistName}:`, error);
    }
  }
  
  return results.filter(artist => artist.artworkCount > 0);
}

/**
 * Lấy artworks nổi bật ngẫu nhiên
 */
export async function getHighlightArtworks(limit: number = 10): Promise<MetObject[]> {
  try {
    const searchResult = await searchArtworks('', { 
      isHighlight: true,
      hasImages: true 
    });
    
    if (!searchResult.objectIDs || searchResult.objectIDs.length === 0) {
      return [];
    }
    
    // Chọn ngẫu nhiên {limit} artworks từ tất cả highlights
    const shuffled = [...searchResult.objectIDs].sort(() => 0.5 - Math.random());
    const selectedIDs = shuffled.slice(0, Math.min(limit * 3, shuffled.length)); // Lấy nhiều hơn để đảm bảo có đủ
    const artworks: MetObject[] = [];
    
    for (const objectID of selectedIDs) {
      if (artworks.length >= limit) break;
      
      try {
        const artwork = await getObject(objectID);
        // Chỉ lấy artwork có đầy đủ thông tin
        if (artwork && artwork.primaryImage && artwork.title && artwork.objectDate) {
          artworks.push(artwork);
        }
        
        // Delay nhỏ để tránh rate limit
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error fetching object ${objectID}:`, error);
      }
    }
    
    return artworks;
  } catch (error) {
    console.error('Error fetching highlight artworks:', error);
    return [];
  }
}

/**
 * Lấy artworks mới từ một department cụ thể
 */
export async function getRecentArtworks(limit: number = 10): Promise<MetObject[]> {
  try {
    // Lấy artworks từ các departments khác nhau
    const departmentIds = [11, 21, 6]; // European Paintings, Modern Art, Asian Art
    const artworks: MetObject[] = [];
    
    for (const deptId of departmentIds) {
      if (artworks.length >= limit) break;
      
      try {
        const data = await safeFetch<{ objectIDs: number[]; total: number }>(`${BASE_URL}/objects?departmentIds=${deptId}`);
        
        if (data && data.objectIDs && data.objectIDs.length > 0) {
          // Chọn ngẫu nhiên từ department này
          const shuffled = [...data.objectIDs].sort(() => 0.5 - Math.random());
          const selectedIDs = shuffled.slice(0, Math.ceil(limit / departmentIds.length) + 5);
          
          for (const objectID of selectedIDs) {
            if (artworks.length >= limit) break;
            
            try {
              const artwork = await getObject(objectID);
              // Chỉ lấy artwork có đầy đủ thông tin và có hình ảnh
              if (artwork && artwork.primaryImage && artwork.title && artwork.objectDate) {
                artworks.push(artwork);
              }
              
              // Delay nhỏ để tránh rate limit
              await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
              console.error(`Error fetching object ${objectID}:`, error);
            }
          }
        }
        
        // Delay giữa các department
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Error fetching objects for department ${deptId}:`, error);
      }
    }
    
    return artworks;
  } catch (error) {
    console.error('Error fetching recent artworks:', error);
    return [];
  }
}

/**
 * Interface cho Department
 */
export interface Department {
  departmentId: number;
  displayName: string;
}

/**
 * Lấy danh sách tất cả departments
 */
export async function getDepartments(): Promise<Department[]> {
  try {
    const data = await safeFetch<{ departments: Department[] }>(`${BASE_URL}/departments`);
    return data?.departments || [];
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
}

/**
 * Lấy số lượng artworks trong 1 department
 */
export async function getDepartmentArtworkCount(departmentId: number): Promise<number> {
  try {
    const data = await safeFetch<{ total: number }>(`${BASE_URL}/objects?departmentIds=${departmentId}`);
    return data?.total || 0;
  } catch (error) {
    console.error(`Error fetching artwork count for department ${departmentId}:`, error);
    return 0;
  }
}

/**
 * Lấy 3 departments ngẫu nhiên với số lượng artworks
 */
export async function getFeaturedDepartments(count: number = 3): Promise<{
  id: string;
  name: string;
  artworkCount: number;
  departmentId: number;
}[]> {
  try {
    // Lấy tất cả departments
    const allDepartments = await getDepartments();
    
    if (allDepartments.length === 0) {
      return [];
    }
    
    // Chọn ngẫu nhiên {count} departments
    const shuffled = [...allDepartments].sort(() => 0.5 - Math.random());
    const selectedDepartments = shuffled.slice(0, count);
    
    const results = [];
    
    for (const dept of selectedDepartments) {
      try {
        // Lấy số lượng artworks của department
        const artworkCount = await getDepartmentArtworkCount(dept.departmentId);
        
        results.push({
          id: dept.departmentId.toString(),
          name: dept.displayName,
          artworkCount,
          departmentId: dept.departmentId,
        });
        
        // Delay nhỏ để tránh rate limit
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error fetching department ${dept.displayName}:`, error);
      }
    }
    
    return results.filter(dept => dept.artworkCount > 0);
  } catch (error) {
    console.error('Error fetching featured departments:', error);
    return [];
  }
}

/**
 * Lấy artworks cho timeline - 7 tác phẩm ngẫu nhiên được sắp xếp theo thứ tự thời gian
 */
export async function getTimelineArtworks(): Promise<MetObject[]> {
  try {
    // Lấy artworks từ nhiều departments để đảm bảo đa dạng
    const departmentIds = [10, 11, 13, 6, 21]; // Egyptian, European Paintings, Greek/Roman, Asian, Modern
    const allObjectIDs: number[] = [];
    
    // Lấy object IDs từ mỗi department
    for (const deptId of departmentIds) {
      try {
        const data = await safeFetch<{ objectIDs: number[] }>(`${BASE_URL}/objects?departmentIds=${deptId}`);
        
        if (data && data.objectIDs && data.objectIDs.length > 0) {
          // Lấy 20 IDs ngẫu nhiên từ mỗi department
          const shuffled = [...data.objectIDs].sort(() => 0.5 - Math.random());
          allObjectIDs.push(...shuffled.slice(0, 20));
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error fetching objects for department ${deptId}:`, error);
      }
    }
    
    if (allObjectIDs.length === 0) {
      return [];
    }
    
    // Shuffle tất cả IDs và chọn 30 để thử
    const shuffled = [...allObjectIDs].sort(() => 0.5 - Math.random());
    const selectedIDs = shuffled.slice(0, 30);
    
    const artworks: MetObject[] = [];
    
    for (const objectID of selectedIDs) {
      if (artworks.length >= 7) break;
      
      try {
        const artwork = await getObject(objectID);
        
        // Chỉ lấy artwork có đầy đủ thông tin cần thiết
        if (
          artwork && 
          artwork.primaryImage && 
          artwork.title && 
          artwork.objectBeginDate !== undefined &&
          artwork.objectBeginDate !== null &&
          artwork.objectBeginDate !== 0
        ) {
          artworks.push(artwork);
        }
        
        // Delay nhỏ để tránh rate limit
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error fetching timeline object ${objectID}:`, error);
      }
    }
    
    // Sắp xếp theo năm (objectBeginDate) từ cũ đến mới
    return artworks.sort((a, b) => a.objectBeginDate - b.objectBeginDate);
  } catch (error) {
    console.error('Error fetching timeline artworks:', error);
    return [];
  }
}

// Helper function để delay giữa các requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Tìm kiếm artworks theo nghệ sỹ
async function searchByArtist(artistName: string): Promise<SearchResponse> {
  try {
    await delay(100);
    const data = await safeFetch<SearchResponse>(
      `${BASE_URL}/search?artistOrCulture=true&hasImages=true&q=${artistName}`
    );
    
    return data || { objectIDs: null, total: 0 };
  } catch (error) {
    console.error('Error searching by artist:', error);
    return { objectIDs: null, total: 0 };
  }
}

// Lấy thông tin chi tiết artwork
async function getArtworkDetails(objectId: number): Promise<MetObject | null> {
  try {
    await delay(100);
    const data = await safeFetch<MetObject>(`${BASE_URL}/objects/${objectId}`);
    return data;
  } catch (error) {
    const err = error as Error;
    if (!err.message?.includes('404') && !err.message?.includes('403')) {
      console.error(`Error fetching artwork ${objectId}:`, err.message);
    }
    return null;
  }
}

/**
 * Tìm kiếm nghệ sỹ phổ biến
 */
export function searchPopularArtists(): string[] {
  return [
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
}

/**
 * Interface cho ArtistPortfolio
 */
export interface ArtistPortfolio {
  artistName: string;
  artworks: MetObject[];
  totalWorks: number;
  birthYear: string | null;
  deathYear: string | null;
  nationality: string;
  artistBio: string;
}

/**
 * Lấy artworks của nhiều nghệ sỹ
 */
export async function getArtistPortfolios(artistNames: string[]): Promise<ArtistPortfolio[]> {
  try {
    const portfolios: ArtistPortfolio[] = [];
    
    for (const artistName of artistNames) {
      try {
        const searchResult = await searchByArtist(artistName);
        
        if (searchResult.objectIDs && searchResult.objectIDs.length > 0) {
          const artworkIds = searchResult.objectIDs.slice(0, 10);
          const artworks: MetObject[] = [];
          
          for (const id of artworkIds) {
            if (artworks.length >= 3) break;
            
            const artwork = await getArtworkDetails(id);
            if (artwork && artwork.primaryImage) {
              artworks.push(artwork);
            }
          }
          
          if (artworks.length > 0) {
            const firstArtwork = artworks[0];
            const artistDisplayName = firstArtwork.artistDisplayName || artistName;
            const artistBio = firstArtwork.artistDisplayBio || '';
            
            let birthYear: string | null = null;
            let deathYear: string | null = null;
            const yearMatch = artistBio.match(/(\d{4})[–-](\d{4})/);
            if (yearMatch) {
              birthYear = yearMatch[1];
              deathYear = yearMatch[2];
            }
            
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
        continue;
      }
    }
    
    return portfolios;
  } catch (error) {
    console.error('Error fetching artist portfolios:', error);
    return [];
  }
}

/**
 * Lấy tất cả artworks của một nghệ sỹ (cho trang chi tiết)
 */
export async function getArtistAllArtworks(artistName: string, limit: number = 20): Promise<MetObject[]> {
  try {
    const searchResult = await searchByArtist(artistName);
    
    if (!searchResult.objectIDs || searchResult.objectIDs.length === 0) {
      return [];
    }

    const artworkIds = searchResult.objectIDs.slice(0, limit);
    const artworks: MetObject[] = [];
    
    for (const id of artworkIds) {
      const artwork = await getArtworkDetails(id);
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

// Alias cho getObject để dễ sử dụng
export const getArtworkById = getObject;

// Export object để dễ dàng sử dụng
export const metMuseumAPI = {
  searchArtworks,
  getObject,
  getArtworkById,
  getArtistArtworks,
  getFeaturedArtists,
  getHighlightArtworks,
  getRecentArtworks,
  getDepartments,
  getDepartmentArtworkCount,
  getFeaturedDepartments,
  getTimelineArtworks,
  searchPopularArtists,
  getArtistPortfolios,
  getArtistAllArtworks,
};
