import { useState, useEffect } from 'react';
import { getFeaturedArtists, getHighlightArtworks, getRecentArtworks, getFeaturedDepartments, getTimelineArtworks, MetObject } from '@/services/met-api';

export interface FeaturedArtist {
  name: string;
  artworkCount: number;
  artworks: MetObject[];
  primaryImage?: string;
}

export interface FeaturedDepartment {
  id: string;
  name: string;
  artworkCount: number;
  departmentId: number;
}

/**
 * Hook để fetch nghệ sĩ nổi bật từ Met Museum API
 */
export function useMetArtists(count: number = 4) {
  const [artists, setArtists] = useState<FeaturedArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchArtists() {
      try {
        setLoading(true);
        const data = await getFeaturedArtists(count);
        
        if (isMounted) {
          setArtists(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          console.error('Error fetching artists:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchArtists();

    return () => {
      isMounted = false;
    };
  }, [count]);

  return { artists, loading, error };
}

/**
 * Hook để fetch departments nổi bật từ Met Museum API
 */
export function useMetDepartments(count: number = 3) {
  const [departments, setDepartments] = useState<FeaturedDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchDepartments() {
      try {
        setLoading(true);
        const data = await getFeaturedDepartments(count);
        
        if (isMounted) {
          setDepartments(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          console.error('Error fetching departments:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDepartments();

    return () => {
      isMounted = false;
    };
  }, [count]);

  return { departments, loading, error };
}

/**
 * Hook để fetch artworks nổi bật
 */
export function useMetArtworks(limit: number = 10) {
  const [artworks, setArtworks] = useState<MetObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchArtworks() {
      try {
        setLoading(true);
        const data = await getHighlightArtworks(limit);
        
        if (isMounted) {
          setArtworks(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          console.error('Error fetching artworks:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchArtworks();

    return () => {
      isMounted = false;
    };
  }, [limit]);

  return { artworks, loading, error };
}

/**
 * Hook để fetch artworks mới cập nhật
 */
export function useRecentArtworks(limit: number = 10) {
  const [artworks, setArtworks] = useState<MetObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchArtworks() {
      try {
        setLoading(true);
        const data = await getRecentArtworks(limit);
        
        if (isMounted) {
          setArtworks(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          console.error('Error fetching recent artworks:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchArtworks();

    return () => {
      isMounted = false;
    };
  }, [limit]);

  return { artworks, loading, error };
}

/**
 * Hook để fetch artworks cho timeline - được sắp xếp theo thứ tự thời gian
 */
export function useMetTimeline() {
  const [artworks, setArtworks] = useState<MetObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchTimeline() {
      try {
        setLoading(true);
        const data = await getTimelineArtworks();
        
        if (isMounted) {
          setArtworks(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          console.error('Error fetching timeline artworks:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchTimeline();

    return () => {
      isMounted = false;
    };
  }, []);

  return { artworks, loading, error };
}
