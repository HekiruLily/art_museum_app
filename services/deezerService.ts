// services/deezerService.ts
import { Platform } from 'react-native';
import { MoodAnalyzer } from './moodAnalyzer';

const DEEZER_API = 'https://api.deezer.com';

// Mood to search keywords mapping
const MOOD_TO_KEYWORDS: Record<string, string[]> = {
  calm: ['relaxing piano', 'calm ambient', 'peaceful music'],
  dramatic: ['epic orchestral', 'dramatic classical', 'intense symphony'],
  dreamy: ['dreamy ambient', 'ethereal music', 'soft piano'],
  serene: ['serene classical', 'peaceful nature', 'calm meditation'],
  vibrant: ['upbeat jazz', 'happy acoustic', 'cheerful music'],
  dark: ['dark ambient', 'mysterious classical', 'melancholic piano'],
  peaceful: ['peaceful guitar', 'relaxing nature', 'soft acoustic'],
  intense: ['intense orchestra', 'powerful symphony', 'epic music'],
  contemplative: ['contemplative piano', 'thoughtful classical', 'reflective music'],
  light: ['light acoustic', 'gentle piano', 'soft jazz'],
  bold: ['bold orchestra', 'powerful brass', 'strong classical'],
  intimate: ['intimate jazz', 'soft vocal', 'acoustic love'],
  mysterious: ['mysterious soundtrack', 'enigmatic music', 'dark classical'],
  romantic: ['romantic piano', 'love songs instrumental', 'romantic classical'],
  powerful: ['powerful symphony', 'epic trailer', 'heroic music'],
};

interface DeezerTrack {
  id: number;
  title: string;
  preview: string;
  artist: {
    name: string;
  };
  album: {
    cover_big?: string;
    cover_medium?: string;
    cover?: string;
  };
  duration: number;
}

interface Track {
  id: string | number;
  name: string;
  preview_url: string;
  artists: { name: string }[];
  album: {
    images: { url: string }[];
  };
  duration: number;
}

interface SearchResult {
  tracks: Track[];
  mood: string;
  moodDescription: string;
}

export class DeezerService {
  static async searchTracks(artwork: any): Promise<SearchResult> {
    // Check if running on web - Deezer API has CORS restrictions
    if (Platform.OS === 'web') {
      console.log('⚠️ Music feature is not available on web due to CORS restrictions');
      return {
        tracks: [],
        mood: 'contemplative',
        moodDescription: 'Tính năng nhạc chỉ khả dụng trên mobile',
      };
    }

    // Analyze mood from artwork
    const moodVector = MoodAnalyzer.analyzeMood(artwork);
    const dominantMood = MoodAnalyzer.getDominantMood(moodVector);
    const moodDescription = MoodAnalyzer.getMoodDescription(dominantMood);
    
    // Get keywords for this mood
    const keywords = MOOD_TO_KEYWORDS[dominantMood] || MOOD_TO_KEYWORDS.contemplative;
    
    let allTracks: DeezerTrack[] = [];
    
    // Search with multiple keywords to get variety
    for (const keyword of keywords) {
      try {
        console.log('Searching Deezer for:', keyword);
        const response = await fetch(
          `${DEEZER_API}/search?q=${encodeURIComponent(keyword)}&limit=20`
        );
        
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          // Filter tracks with preview
          const tracksWithPreview = data.data.filter((track: DeezerTrack) => track.preview);
          console.log(`Found ${tracksWithPreview.length} tracks with preview for "${keyword}"`);
          allTracks = [...allTracks, ...tracksWithPreview];
        }
        
        // Stop if we have enough tracks
        if (allTracks.length >= 15) break;
        
      } catch (error) {
        console.error('Deezer search error:', error);
      }
    }
    
    // Remove duplicates by track id
    const uniqueTracks = allTracks.filter((track, index, self) =>
      index === self.findIndex(t => t.id === track.id)
    );
    
    console.log(`Total unique tracks with preview: ${uniqueTracks.length}`);
    
    // Transform to standard format
    const formattedTracks: Track[] = uniqueTracks.slice(0, 20).map(track => ({
      id: track.id,
      name: track.title,
      preview_url: track.preview,
      artists: [{ name: track.artist?.name || 'Unknown Artist' }],
      album: {
        images: [{ url: track.album?.cover_big || track.album?.cover_medium || track.album?.cover || '' }]
      },
      duration: track.duration,
    }));
    
    return {
      tracks: formattedTracks,
      mood: dominantMood,
      moodDescription: moodDescription,
    };
  }
}
