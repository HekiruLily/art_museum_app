// services/moodAnalyzer.ts

interface Artwork {
  classification?: string;
  objectDate?: string;
  medium?: string;
  culture?: string;
  tags?: string[];
  [key: string]: any;
}

interface MoodVector {
  [key: string]: number;
}

// Định nghĩa mood mappings
const MOOD_MAPPINGS = {
  classification: {
    'Paintings': { serene: 0.6, contemplative: 0.5 },
    'Sculpture': { calm: 0.7, introspective: 0.6 },
    'Photography': { modern: 0.6, expressive: 0.5 },
    'Drawings': { intimate: 0.7, delicate: 0.6 },
    'Prints': { bold: 0.6, graphic: 0.5 },
  },
  
  period: {
    'Renaissance': { classical: 0.8, harmonious: 0.7 },
    'Baroque': { dramatic: 0.9, dark: 0.7, intense: 0.6 },
    'Impressionism': { dreamy: 0.8, light: 0.7, peaceful: 0.6 },
    'Post-Impressionism': { vibrant: 0.7, expressive: 0.8 },
    'Modern': { bold: 0.7, experimental: 0.6 },
    'Contemporary': { eclectic: 0.6, innovative: 0.7 },
    'Abstract': { contemplative: 0.7, mysterious: 0.6 },
    'Realism': { grounded: 0.7, detailed: 0.6 },
  },
  
  medium: {
    'Oil': { rich: 0.7, deep: 0.6 },
    'Watercolor': { light: 0.8, ethereal: 0.7 },
    'Marble': { calm: 0.8, timeless: 0.7 },
    'Bronze': { powerful: 0.7, enduring: 0.6 },
    'Ink': { delicate: 0.7, precise: 0.6 },
    'Charcoal': { moody: 0.7, dramatic: 0.6 },
  },
  
  culture: {
    'Italian': { passionate: 0.7, romantic: 0.6 },
    'French': { elegant: 0.7, refined: 0.6 },
    'Dutch': { serene: 0.7, luminous: 0.6 },
    'Japanese': { zen: 0.8, minimalist: 0.7 },
    'Chinese': { harmonious: 0.7, philosophical: 0.6 },
    'American': { bold: 0.6, dynamic: 0.7 },
  },
  
  tags: {
    'religious': { sacred: 0.9, spiritual: 0.8 },
    'portrait': { intimate: 0.7, personal: 0.6 },
    'landscape': { peaceful: 0.8, expansive: 0.7 },
    'still life': { contemplative: 0.7, quiet: 0.8 },
    'abstract': { experimental: 0.7, cerebral: 0.6 },
    'nature': { organic: 0.8, tranquil: 0.7 },
  },
};

// Ánh xạ mood sang đặc trưng âm nhạc
const MOOD_TO_AUDIO_FEATURES: Record<string, any> = {
  calm: { valence: 0.3, energy: 0.2, tempo: 80, acousticness: 0.7 },
  dramatic: { valence: 0.4, energy: 0.8, tempo: 130, instrumentalness: 0.6 },
  dreamy: { valence: 0.5, energy: 0.3, tempo: 90, acousticness: 0.6 },
  serene: { valence: 0.6, energy: 0.2, tempo: 75, acousticness: 0.8 },
  vibrant: { valence: 0.8, energy: 0.7, tempo: 120, danceability: 0.6 },
  dark: { valence: 0.2, energy: 0.5, tempo: 100, acousticness: 0.4 },
  peaceful: { valence: 0.7, energy: 0.2, tempo: 70, acousticness: 0.8 },
  intense: { valence: 0.5, energy: 0.9, tempo: 140, instrumentalness: 0.7 },
  contemplative: { valence: 0.4, energy: 0.3, tempo: 85, acousticness: 0.6 },
  light: { valence: 0.8, energy: 0.4, tempo: 100, acousticness: 0.5 },
  bold: { valence: 0.6, energy: 0.7, tempo: 125, danceability: 0.5 },
  intimate: { valence: 0.5, energy: 0.3, tempo: 80, acousticness: 0.7 },
  mysterious: { valence: 0.3, energy: 0.4, tempo: 95, acousticness: 0.5 },
  romantic: { valence: 0.7, energy: 0.4, tempo: 90, acousticness: 0.6 },
  powerful: { valence: 0.6, energy: 0.8, tempo: 135, instrumentalness: 0.6 },
};

// Genre suggestions dựa trên mood
const MOOD_TO_GENRES: Record<string, string[]> = {
  calm: ['ambient', 'classical', 'new-age', 'piano'],
  dramatic: ['classical', 'orchestral', 'opera', 'cinematic'],
  dreamy: ['ambient', 'chillout', 'electronic', 'indie'],
  serene: ['classical', 'acoustic', 'folk', 'meditation'],
  vibrant: ['pop', 'indie', 'electronic', 'world'],
  dark: ['gothic', 'industrial', 'dark-ambient', 'post-rock'],
  peaceful: ['ambient', 'classical', 'acoustic', 'nature'],
  intense: ['rock', 'metal', 'electronic', 'industrial'],
  contemplative: ['classical', 'ambient', 'jazz', 'instrumental'],
  light: ['indie', 'folk', 'acoustic', 'pop'],
  bold: ['rock', 'electronic', 'funk', 'disco'],
  intimate: ['acoustic', 'folk', 'singer-songwriter', 'jazz'],
  mysterious: ['dark-ambient', 'experimental', 'electronic', 'trip-hop'],
  romantic: ['classical', 'jazz', 'soul', 'r-n-b'],
  powerful: ['orchestral', 'rock', 'metal', 'epic'],
};

const MOOD_DESCRIPTIONS: Record<string, string> = {
  calm: 'Êm dịu, thư giãn',
  dramatic: 'Kịch tính, mạnh mẽ',
  dreamy: 'Mơ màng, lãng mạn',
  serene: 'Thanh thản, bình yên',
  vibrant: 'Sôi động, tươi vui',
  dark: 'U ám, huyền bí',
  peaceful: 'Yên bình, tĩnh lặng',
  intense: 'Mãnh liệt, căng thẳng',
  contemplative: 'Trầm tư, suy ngẫm',
  light: 'Nhẹ nhàng, tươi sáng',
  bold: 'Táo bạo, đầy năng lượng',
  intimate: 'Thân mật, gần gũi',
  mysterious: 'Bí ẩn, khó hiểu',
  romantic: 'Lãng mạn, say đắm',
  powerful: 'Hùng vĩ, uy nghiêm',
};

export class MoodAnalyzer {
  static analyzeMood(artwork: Artwork): MoodVector {
    const moodVector: MoodVector = {};
    
    // Analyze classification
    if (artwork.classification) {
      const classification = artwork.classification;
      Object.keys(MOOD_MAPPINGS.classification).forEach(key => {
        if (classification.toLowerCase().includes(key.toLowerCase())) {
          Object.assign(moodVector, MOOD_MAPPINGS.classification[key as keyof typeof MOOD_MAPPINGS.classification]);
        }
      });
    }
    
    // Analyze period from objectDate
    if (artwork.objectDate) {
      const objectDate = artwork.objectDate.toLowerCase();
      Object.keys(MOOD_MAPPINGS.period).forEach(key => {
        if (objectDate.includes(key.toLowerCase())) {
          Object.assign(moodVector, MOOD_MAPPINGS.period[key as keyof typeof MOOD_MAPPINGS.period]);
        }
      });
    }
    
    // Analyze medium
    if (artwork.medium) {
      const medium = artwork.medium;
      Object.keys(MOOD_MAPPINGS.medium).forEach(key => {
        if (medium.toLowerCase().includes(key.toLowerCase())) {
          Object.assign(moodVector, MOOD_MAPPINGS.medium[key as keyof typeof MOOD_MAPPINGS.medium]);
        }
      });
    }
    
    // Analyze culture
    if (artwork.culture) {
      const culture = artwork.culture;
      Object.keys(MOOD_MAPPINGS.culture).forEach(key => {
        if (culture.toLowerCase().includes(key.toLowerCase())) {
          Object.assign(moodVector, MOOD_MAPPINGS.culture[key as keyof typeof MOOD_MAPPINGS.culture]);
        }
      });
    }
    
    // Analyze tags
    if (artwork.tags && Array.isArray(artwork.tags)) {
      artwork.tags.forEach((tag: any) => {
        // Tags in Met API are objects with { term: string, AAT_URL: string, Wikidata_URL: string }
        const tagTerm = typeof tag === 'string' ? tag : tag?.term;
        if (tagTerm && typeof tagTerm === 'string') {
          Object.keys(MOOD_MAPPINGS.tags).forEach(key => {
            if (tagTerm.toLowerCase().includes(key)) {
              Object.assign(moodVector, MOOD_MAPPINGS.tags[key as keyof typeof MOOD_MAPPINGS.tags]);
            }
          });
        }
      });
    }
    
    // Nếu không có mood nào được phát hiện, dùng contemplative mặc định
    if (Object.keys(moodVector).length === 0) {
      moodVector.contemplative = 0.7;
    }
    
    return moodVector;
  }
  
  static getDominantMood(moodVector: MoodVector): string {
    // Simple mood categories we use for music selection
    const simpleMoods = [
      'calm', 'dramatic', 'dreamy', 'serene', 'vibrant',
      'dark', 'peaceful', 'intense', 'contemplative', 'light',
      'bold', 'intimate', 'mysterious', 'romantic', 'powerful'
    ];
    
    // Find the highest scoring mood from our simple moods
    let maxScore = 0;
    let dominantMood = 'contemplative';
    
    Object.keys(moodVector).forEach(mood => {
      if (simpleMoods.includes(mood) && moodVector[mood] > maxScore) {
        maxScore = moodVector[mood];
        dominantMood = mood;
      }
    });
    
    // Fallback: map complex moods to simple ones
    if (maxScore === 0) {
      const moodMappings: Record<string, string> = {
        'classical': 'calm',
        'harmonious': 'peaceful',
        'introspective': 'contemplative',
        'modern': 'bold',
        'expressive': 'vibrant',
        'delicate': 'light',
        'graphic': 'bold',
        'rich': 'dramatic',
        'ethereal': 'dreamy',
        'timeless': 'serene',
        'enduring': 'powerful',
        'precise': 'calm',
        'moody': 'dark',
        'passionate': 'romantic',
        'elegant': 'serene',
        'refined': 'calm',
        'luminous': 'light',
        'zen': 'peaceful',
        'minimalist': 'calm',
        'philosophical': 'contemplative',
        'dynamic': 'vibrant',
        'sacred': 'serene',
        'spiritual': 'peaceful',
        'personal': 'intimate',
        'expansive': 'powerful',
        'quiet': 'calm',
        'experimental': 'mysterious',
        'cerebral': 'contemplative',
        'organic': 'peaceful',
        'tranquil': 'serene',
      };
      
      Object.keys(moodVector).forEach(mood => {
        if (moodMappings[mood] && moodVector[mood] > maxScore) {
          maxScore = moodVector[mood];
          dominantMood = moodMappings[mood];
        }
      });
    }
    
    return dominantMood;
  }
  
  static getMoodDescription(mood: string): string {
    return MOOD_DESCRIPTIONS[mood] || 'Trầm tư, suy ngẫm';
  }
  
  static getAudioFeatures(mood: string) {
    return MOOD_TO_AUDIO_FEATURES[mood] || MOOD_TO_AUDIO_FEATURES.contemplative;
  }
  
  static getGenres(mood: string): string[] {
    return MOOD_TO_GENRES[mood] || MOOD_TO_GENRES.contemplative;
  }
}
