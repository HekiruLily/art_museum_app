const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';

export const metAPI = {
  searchArtworks: async (query = 'sunflowers', departmentKey = 'all', isOnView = false) => {
    try {
      // Build simple URL without departmentId (causes 403 errors)
      let url = `${BASE_URL}/search?hasImages=true&q=${encodeURIComponent(query)}`;
      
      // Filter only on-view artworks
      if (isOnView) {
        url += `&isOnView=true`;
      }
      
      console.log('🔗 API URL:', url);
      const response = await fetch(url);
      
      // Check if response is OK
      if (!response.ok) {
        console.warn(`⚠️ API returned status ${response.status}`);
        return [];
      }
      
      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return [];
      }
      
      const data = await response.json();
      const results = data.objectIDs || [];
      console.log(`✅ Tìm thấy ${results.length} tác phẩm`);
      
      // Limit results for better performance
      return results.slice(0, 50);
    } catch (error) {
      console.error('❌ Error searching artworks:', error.message);
      return [];
    }
  },

  // Search by department only (no query)
  getObjectsByDepartment: async (departmentId) => {
    try {
      const url = `${BASE_URL}/objects?departmentIds=${departmentId}`;
      console.log('🔗 Getting objects by department:', url);
      
      const response = await fetch(url);
      if (!response.ok) return [];
      
      const data = await response.json();
      const results = data.objectIDs || [];
      console.log(`✅ Department có ${results.length} tác phẩm`);
      
      return results.slice(0, 50);
    } catch (error) {
      return [];
    }
  },

  getArtworkDetails: async (objectID) => {
    try {
      const response = await fetch(`${BASE_URL}/objects/${objectID}`);
      
      // Check if response is OK
      if (!response.ok) {
        return null;
      }
      
      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return null;
      }
      
      const data = await response.json();
      
      // Validate data has required fields
      if (!data || !data.objectID) {
        return null;
      }
      
      return data;
    } catch (error) {
      return null;
    }
  },

  getDepartments: async () => {
    try {
      const response = await fetch(`${BASE_URL}/departments`);
      
      if (!response.ok) {
        return [];
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return [];
      }
      
      const data = await response.json();
      return data.departments || [];
    } catch (error) {
      console.error('Error fetching departments:', error.message);
      return [];
    }
  }
};
