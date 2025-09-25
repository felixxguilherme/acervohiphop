// AIDEV-NOTE: Utility to generate random points within Federal District bounds
import { getRandomIcon } from '@/components/mapa/MapIcons';

// Federal District bounds from mapa.js
const DF_BOUNDS = {
  north: -15.4000,
  south: -16.1000,
  east: -47.2000,
  west: -48.5000
};

// Hip Hop related location names for random points
const HIP_HOP_LOCATIONS = [
  'Battle Ground', 'Cypher Point', 'Beat Corner', 'Flow Junction', 
  'Scratch Spot', 'Breakdance Plaza', 'Mic Check Arena', 'Urban Vibes',
  'Street Sound', 'Hip Hop Haven', 'Culture Corner', 'Rhythm Point',
  'Freestyle Zone', 'Beats Station', 'Rap Corner', 'Graffiti Wall',
  'Sound System Base', 'DJ Corner', 'MC Stage', 'B-Boy Spot',
  'Tape Deck Point', 'Vinyl Corner', 'Block Party Plaza', 'Jam Session',
  'Popping Point', 'Locking Lane', 'Krump Corner', 'House Corner'
];

// Generate random coordinate within DF bounds
export const generateRandomCoordinate = () => {
  const lat = Math.random() * (DF_BOUNDS.north - DF_BOUNDS.south) + DF_BOUNDS.south;
  const lng = Math.random() * (DF_BOUNDS.east - DF_BOUNDS.west) + DF_BOUNDS.west;
  
  return { lat, lng };
};

// Generate multiple random points with Hip Hop icons
export const generateRandomPoints = (count = 15) => {
  const points = [];
  const usedNames = new Set();
  
  for (let i = 0; i < count; i++) {
    // Get a unique location name
    let locationName;
    do {
      locationName = HIP_HOP_LOCATIONS[Math.floor(Math.random() * HIP_HOP_LOCATIONS.length)];
    } while (usedNames.has(locationName) && usedNames.size < HIP_HOP_LOCATIONS.length);
    usedNames.add(locationName);
    
    const coordinates = generateRandomCoordinate();
    const icon = getRandomIcon();
    
    points.push({
      id: `random-point-${i + 1}`,
      name: locationName,
      coordinates: coordinates,
      iconType: icon.name,
      iconLabel: icon.label,
      description: `Ponto cultural do Hip Hop - ${icon.label}`,
      itemCount: Math.floor(Math.random() * 50) + 5, // 5-54 items
      isRandomPoint: true,
      items: [{
        id: `random-item-${i + 1}`,
        title: `Evento Hip Hop - ${locationName}`,
        date: generateRandomDate(),
        thumbnail: generateRandomThumbnail()
      }]
    });
  }
  
  return points;
};

// Generate random date between 1995 and 2024
const generateRandomDate = () => {
  const start = new Date(1995, 0, 1);
  const end = new Date(2024, 11, 31);
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime).toISOString().split('T')[0];
};

// Generate random thumbnail URL
const generateRandomThumbnail = () => {
  const hipHopImages = [
    'photo-1571019613454-1cb2f99b2d8b', // Hip hop event
    'photo-1493225457124-a3eb161ffa5f', // DJ mixing
    'photo-1547036967-23d11aacaee0', // Breaking
    'photo-1578662996442-48f60103fc96', // Graffiti
    'photo-1459749411175-04bf5292ceea', // Concert
    'photo-1516450360452-9312f5e86fc7', // Microphone
    'photo-1571019614242-c5c5dee9f50b', // Turntables
    'photo-1493225457124-a3eb161ffa5f', // Music production
  ];
  
  const randomImage = hipHopImages[Math.floor(Math.random() * hipHopImages.length)];
  return `https://images.unsplash.com/${randomImage}?w=200&h=150&fit=crop`;
};