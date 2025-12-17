const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';

// Hàm delay để tránh vượt quá API rate limit (80 req/sec)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Lấy danh sách tất cả phòng ban
export const fetchDepartments = async () => {
  try {
    const response = await fetch(`${BASE_URL}/departments`);
    if (!response.ok) {
      throw new Error('Failed to fetch departments');
    }
    const data = await response.json();
    console.log('Fetched departments:', data.departments?.length || 0);
    return data.departments || [];
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
};

// Lấy danh sách Object IDs theo phòng ban
export const fetchObjectsByDepartment = async (departmentId: number, limit: number = 50) => {
  try {
    const url = `${BASE_URL}/objects?departmentIds=${departmentId}`;
    console.log('Fetching objects from URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch objects: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const data = await response.json();
    console.log('Fetched object IDs count:', data.objectIDs?.length || 0);
    // Trả về danh sách IDs, giới hạn theo limit
    return (data.objectIDs || []).slice(0, limit);
  } catch (error) {
    console.error('Error fetching objects - Full error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Fallback: Return some demo object IDs for testing
    console.log('Using fallback object IDs for department:', departmentId);
    const demoIds = [436974, 436975, 436976, 436977, 436978, 436979];
    return demoIds.slice(0, limit);
  }
};

// Lấy chi tiết một tác phẩm
export const fetchObjectDetail = async (objectId: number) => {
  try {
    const url = `${BASE_URL}/objects/${objectId}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`Failed to fetch object ${objectId}: ${response.status}`);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching object detail for ${objectId}:`, error);
    return null;
  }
};

// Lấy chi tiết nhiều tác phẩm (parallel requests với delay)
export const fetchMultipleObjectDetails = async (objectIds: number[]) => {
  try {
    const results = [];
    for (let i = 0; i < objectIds.length; i++) {
      if (i > 0) {
        // Delay 100ms giữa mỗi request để tránh rate limit
        await delay(100);
      }
      const result = await fetchObjectDetail(objectIds[i]);
      if (result) {
        results.push(result);
      }
    }
    console.log('Fetched object details:', results.length);
    return results;
  } catch (error) {
    console.error('Error fetching multiple object details:', error);
    return [];
  }
};

// Tìm kiếm tác phẩm
export const searchObjects = async (query: string, departmentId?: number) => {
  try {
    let url = `${BASE_URL}/search?q=${encodeURIComponent(query)}`;
    if (departmentId) {
      url += `&departmentId=${departmentId}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to search objects');
    }
    const data = await response.json();
    return (data.objectIDs || []).slice(0, 50);
  } catch (error) {
    console.error('Error searching objects:', error);
    return [];
  }
};

// Lấy ảnh đại diện của phòng ban từ tác phẩm đầu tiên
export const fetchDepartmentImage = async (departmentId: number): Promise<string | undefined> => {
  try {
    const objectIds = await fetchObjectsByDepartment(departmentId, 5);
    if (objectIds.length === 0) return undefined;

    // Lấy chi tiết tác phẩm đầu tiên có ảnh
    for (const id of objectIds) {
      const detail = await fetchObjectDetail(id);
      if (detail && detail.primaryImageSmall && detail.isPublicDomain) {
        return detail.primaryImageSmall;
      }
    }
    return undefined;
  } catch (error) {
    console.error('Error fetching department image:', error);
    return undefined;
  }
};
