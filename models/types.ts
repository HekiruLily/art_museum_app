// Core types for the Art Museum App

export interface Artist {
  id: string;
  name: string;
  artworkCount: number;
  avatar?: string;
  primaryImage?: string;
  color: string;
}

// Met Museum API Types
export interface MetArtwork {
  objectID: number;
  primaryImage: string;
  primaryImageSmall?: string;
  title: string;
  artistDisplayName?: string;
  artistDisplayBio?: string;
  objectDate?: string;
}

export interface ArtistPortfolio {
  artistName: string;
  artworks: MetArtwork[];
  totalWorks: number;
  birthYear?: string | null;
  deathYear?: string | null;
  nationality?: string;
  artistBio?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  route: string;
}

export interface Room {
  id: string;
  name: string;
  artworkCount: number;
  icon?: string;
  color: string;
  route?: string;
  departmentId?: number;
}

export interface Artwork {
  id: string;
  title: string;
  artistName: string;
  year: number;
  imageUrl: string;
  isFeatured?: boolean;
  isNew?: boolean;
  artistId?: string;
  roomId?: string;
  description?: string;
  categories?: string[];
  location?: string;
}
