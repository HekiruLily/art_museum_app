import { Artist, Category, Room, Artwork } from '@/models/types';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Tác phẩm',
    icon: 'color-palette',
    color: '#3B82F6',
    route: '/artworks',
  },
  {
    id: '2',
    name: 'Nghệ sĩ',
    icon: 'people',
    color: '#8B5CF6',
    route: '/artists',
  },
  {
    id: '3',
    name: 'Phòng ban',
    icon: 'business',
    color: '#10B981',
    route: '/rooms',
  },
  {
    id: '4',
    name: 'Timeline',
    icon: 'time',
    color: '#F59E0B',
    route: '/timeline',
  },
];

export const MOCK_ARTISTS: Artist[] = [
  {
    id: '1',
    name: 'Vincent van Gogh',
    artworkCount: 45,
    color: '#8B5CF6',
  },
  {
    id: '2',
    name: 'Salvador Dalí',
    artworkCount: 38,
    color: '#3B82F6',
  },
  {
    id: '3',
    name: 'Johannes Vermeer',
    artworkCount: 34,
    color: '#EC4899',
  },
  {
    id: '4',
    name: 'Katsushika Hokusai',
    artworkCount: 52,
    color: '#F59E0B',
  },
];

export const MOCK_ROOMS: Room[] = [
  {
    id: '1',
    name: 'Post-Impressionism',
    artworkCount: 45,
    icon: 'business',
    color: '#10B981',
    route: '/rooms/post-impressionism',
  },
  {
    id: '2',
    name: 'Surrealism',
    artworkCount: 38,
    icon: 'business',
    color: '#3B82F6',
    route: '/rooms/surrealism',
  },
  {
    id: '3',
    name: 'Dutch Golden Age',
    artworkCount: 34,
    icon: 'business',
    color: '#F59E0B',
    route: '/rooms/dutch-golden-age',
  },
];

export const MOCK_ARTWORKS: Artwork[] = [
  {
    id: '1',
    title: 'Starry Night',
    artistName: 'Vincent van Gogh',
    year: 1889,
    imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400',
    isFeatured: true,
    isNew: true,
  },
  {
    id: '2',
    title: 'The Persistence of Memory',
    artistName: 'Salvador Dalí',
    year: 1931,
    imageUrl: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=400',
    isFeatured: true,
  },
  {
    id: '3',
    title: 'Girl with a Pearl Earring',
    artistName: 'Johannes Vermeer',
    year: 1665,
    imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400',
    isFeatured: true,
  },
  {
    id: '4',
    title: 'The Great Wave off Kanagawa',
    artistName: 'Katsushika Hokusai',
    year: 1831,
    imageUrl: 'https://images.unsplash.com/photo-1615887023516-3883689e5e2a?w=400',
    isFeatured: true,
    isNew: true,
  },
];
