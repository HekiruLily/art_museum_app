// Mock data: Bổ sung thông tin tầng (floor) và người quản lý (curator) 
// vì API Met Museum không cung cấp thông tin này

export const departmentMockData: Record<
  number,
  {
    floor: string;
    curator: string;
    description: string;
    image?: string;
  }
> = {
  1: {
    floor: '3',
    curator: 'Dr. Michael Langdon',
    description:
      'American Decorative Arts department features a comprehensive collection of furniture, silver, ceramics, and textiles from 1650 to the present.',
    image: 'https://images.metmuseum.org/CRDImages/ad/original/DT9644.jpg',
  },
  3: {
    floor: '2',
    curator: 'Dr. Joan Aruz',
    description:
      'Ancient Near Eastern Art includes art and artifacts from ancient Mesopotamia, the Levant, Persia, and the Arabian Peninsula.',
    image: 'https://images.metmuseum.org/CRDImages/an/original/DT245876.jpg',
  },
  4: {
    floor: '1',
    curator: 'Dr. Peter Lacovara',
    description:
      'Arms and Armor presents a world-class collection of European, Middle Eastern, and Oriental weaponry and protective equipment.',
    image: 'https://images.metmuseum.org/CRDImages/aa/original/ADA4891.jpg',
  },
  5: {
    floor: '1',
    curator: 'Dr. Christine Giuntini',
    description:
      'Arts of Africa, Oceania, and the Americas encompasses a vast array of sculptural and decorative art forms.',
    image: 'https://images.metmuseum.org/CRDImages/ao/original/DP367236.jpg',
  },
  6: {
    floor: '2',
    curator: 'Dr. James C. Y. Watt',
    description:
      'Asian Art represents one of the world\'s greatest collections of sculpture, painting, decorative arts, and calligraphy from East, South, and Southeast Asia.',
    image: 'https://images.metmuseum.org/CRDImages/as/original/DP367297.jpg',
  },
  7: {
    floor: 'Fort Tryon',
    curator: 'Dr. Peter Barnet',
    description:
      'The Cloisters is a branch museum dedicated to the art, architecture, and gardens of medieval Europe.',
    image: 'https://images.metmuseum.org/CRDImages/cl/original/DP108609.jpg',
  },
  8: {
    floor: '1',
    curator: 'Dr. Andrew Bolton',
    description:
      'The Costume Institute presents exhibitions exploring fashion history, contemporary design, and cultural perspectives on dress.',
    image: 'https://images.metmuseum.org/CRDImages/ci/original/CI64_11_77_a_CP4.jpg',
  },
  9: {
    floor: '2',
    curator: 'Dr. Nadine M. Orenstein',
    description:
      'Drawings and Prints includes masterpieces by Old Masters and modern artists, ranging from paper works to etchings and engravings.',
    image: 'https://images.metmuseum.org/CRDImages/dp/original/DP823899.jpg',
  },
  10: {
    floor: '1',
    curator: 'Dr. Denise Doxey',
    description:
      'Egyptian Art features one of the finest collections of Egyptian artifacts spanning from the predynastic period to the Graeco-Roman era.',
    image: 'https://images.metmuseum.org/CRDImages/eg/original/DT211820.jpg',
  },
  11: {
    floor: '2',
    curator: 'Dr. Keith Christiansen',
    description:
      'European Paintings presents masterworks of painting from the 15th through the 18th century, featuring works by Renaissance and Baroque masters.',
    image: 'https://images.metmuseum.org/CRDImages/ep/original/DT1567.jpg',
  },
  12: {
    floor: '1',
    curator: 'Dr. George R. Goldner',
    description:
      'European Sculpture and Decorative Arts showcases sculpture, furniture, and decorative objects from medieval times through the 19th century.',
    image: 'https://images.metmuseum.org/CRDImages/es/original/DT10589.jpg',
  },
  13: {
    floor: '2',
    curator: 'Dr. Seán Hemingway',
    description:
      'Greek and Roman Art includes one of the most comprehensive collections of classical antiquities in the world.',
    image: 'https://images.metmuseum.org/CRDImages/gr/original/DP103268.jpg',
  },
  14: {
    floor: '2',
    curator: 'Dr. Navina Haidar',
    description:
      'Islamic Art features an exceptional collection of art and artifacts from the Islamic world spanning thirteen centuries.',
    image: 'https://images.metmuseum.org/CRDImages/is/original/DP369408.jpg',
  },
  15: {
    floor: '1',
    curator: 'Dr. Everett Fahy',
    description:
      'The Robert Lehman Collection consists of masterpieces of European painting and sculpture collected over the span of nearly a century.',
    image: 'https://images.metmuseum.org/CRDImages/rl/original/DT11.jpg',
  },
  17: {
    floor: '1',
    curator: 'Dr. Barbara Drake Boehm',
    description:
      'Medieval Art encompasses a wide variety of artistic traditions from the early medieval period through the Renaissance.',
    image: 'https://images.metmuseum.org/CRDImages/md/original/DP369298.jpg',
  },
  18: {
    floor: '1',
    curator: 'Dr. Suzanne Tenney',
    description:
      'Musical Instruments represents one of the world\'s most important collections of musical instruments from diverse cultures.',
    image: 'https://images.metmuseum.org/CRDImages/mi/original/DP368885.jpg',
  },
  19: {
    floor: '2',
    curator: 'Dr. Jeff L. Rosenheim',
    description:
      'Photographs features a comprehensive collection of photographs from the earliest daguerreotypes to contemporary digital works.',
    image: 'https://images.metmuseum.org/CRDImages/ph/original/DP284696.jpg',
  },
  21: {
    floor: '3',
    curator: 'Dr. Roxana Robinson',
    description:
      'Modern Art showcases exceptional works spanning painting, sculpture, and decorative arts of the late 19th and 20th centuries.',
    image: 'https://images.metmuseum.org/CRDImages/mo/original/DP369409.jpg',
  },
};

export const getDepartmentMockData = (departmentId: number) => {
  return departmentMockData[departmentId] || {
    floor: 'TBA',
    curator: 'Department Staff',
    description: 'Explore artworks and collections from this department.',
    image: undefined,
  };
};
