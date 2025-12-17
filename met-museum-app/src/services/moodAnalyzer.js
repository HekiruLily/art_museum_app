// services/moodAnalyzer.js

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

// Ánh xạ mood sang đặc trưng âm nhạc Spotify
const MOOD_TO_AUDIO_FEATURES = {
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
const MOOD_TO_GENRES = {
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

export class MoodAnalyzer {
  static analyzeMood(artwork) {
    const moodVector = {};
    
    // Analyze classification
    if (artwork.classification) {
      const classification = artwork.classification;
      Object.keys(MOOD_MAPPINGS.classification).forEach(key => {
        if (classification.toLowerCase().includes(key.toLowerCase())) {
          Object.assign(moodVector, MOOD_MAPPINGS.classification[key]);
        }
      });
    }
    
    // Analyze period/date
    if (artwork.objectDate) {
      const date = artwork.objectDate.toLowerCase();
      Object.keys(MOOD_MAPPINGS.period).forEach(period => {
        if (date.includes(period.toLowerCase())) {
          Object.assign(moodVector, MOOD_MAPPINGS.period[period]);
        }
      });
    }
    
    // Analyze medium
    if (artwork.medium) {
      const medium = artwork.medium.toLowerCase();
      Object.keys(MOOD_MAPPINGS.medium).forEach(med => {
        if (medium.includes(med.toLowerCase())) {
          Object.assign(moodVector, MOOD_MAPPINGS.medium[med]);
        }
      });
    }
    
    // Analyze culture
    if (artwork.culture) {
      const culture = artwork.culture;
      Object.keys(MOOD_MAPPINGS.culture).forEach(cult => {
        if (culture.includes(cult)) {
          Object.assign(moodVector, MOOD_MAPPINGS.culture[cult]);
        }
      });
    }
    
    // Analyze tags
    if (artwork.tags) {
      artwork.tags.forEach(tag => {
        const tagLower = tag.term.toLowerCase();
        Object.keys(MOOD_MAPPINGS.tags).forEach(key => {
          if (tagLower.includes(key)) {
            Object.assign(moodVector, MOOD_MAPPINGS.tags[key]);
          }
        });
      });
    }
    
    // Fallback if no mood detected
    if (Object.keys(moodVector).length === 0) {
      moodVector.contemplative = 0.6;
      moodVector.serene = 0.5;
    }
    
    return moodVector;
  }
  
  static getDominantMood(moodVector) {
    let dominantMood = 'contemplative';
    let maxScore = 0;
    
    Object.entries(moodVector).forEach(([mood, score]) => {
      if (score > maxScore) {
        maxScore = score;
        dominantMood = mood;
      }
    });
    
    return dominantMood;
  }
  
  static getAudioFeatures(moodVector) {
    const dominantMood = this.getDominantMood(moodVector);
    return MOOD_TO_AUDIO_FEATURES[dominantMood] || MOOD_TO_AUDIO_FEATURES.contemplative;
  }
  
  static getGenres(moodVector) {
    const dominantMood = this.getDominantMood(moodVector);
    return MOOD_TO_GENRES[dominantMood] || MOOD_TO_GENRES.contemplative;
  }
  
  static getMoodDescription(mood) {
    const descriptions = {
      calm: 'Yên bình và thư giãn',
      dramatic: 'Kịch tính và mạnh mẽ',
      dreamy: 'Mơ màng và lãng mạn',
      serene: 'Thanh thản và êm đềm',
      vibrant: 'Sôi động và năng lượng',
      dark: 'Tối tăm và bí ẩn',
      peaceful: 'Hòa bình và tĩnh lặng',
      intense: 'Mãnh liệt và căng thẳng',
      contemplative: 'Chiêm nghiệm và suy tư',
      light: 'Nhẹ nhàng và tươi sáng',
      bold: 'Táo bạo và nổi bật',
      intimate: 'Riêng tư và gần gũi',
      mysterious: 'Huyền bí và khó hiểu',
      romantic: 'Lãng mạn và đam mê',
      powerful: 'Hùng mạnh và uy lực',
    };
    
    return descriptions[mood] || 'Độc đáo và đặc biệt';
  }
}
