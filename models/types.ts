// Core types for the Art Museum App

export interface Artist {
  id: string;
  name: string;
  artworkCount: number;
  avatar?: string;
  primaryImage?: string;
  color: string;
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
