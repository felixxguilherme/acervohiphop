// dRESPOSTA PARA MAPA/GEOLOCALIZAÇÃO
import { generateRandomPoints } from '@/utils/randomPoints';

const atomMapResponse = {
  "locations": [
    {
      "id": "map-ceilandia",
      "name": "Ceilândia",
      "coordinates": {
        "lat": -15.8419,
        "lng": -48.1094
      },
      "itemCount": 145,
      "description": "Região Administrativa com forte tradição no Hip Hop",
      "items": [
        {
          "id": "ahhdf-001",
          "title": "1º Encontro de Hip Hop de Ceilândia",
          "date": "1995-08-15",
          "thumbnail": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=150&fit=crop"
        }
      ]
    },
    {
      "id": "map-samambaia",
      "name": "Samambaia",
      "coordinates": {
        "lat": -15.8756,
        "lng": -48.0942
      },
      "itemCount": 98,
      "description": "Centro importante da cultura Hip Hop nos anos 90",
      "items": [
        {
          "id": "ahhdf-002",
          "title": "Festa Hip Hop Samambaia",
          "date": "1998-11-20",
          "thumbnail": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=150&fit=crop"
        }
      ]
    },
    {
      "id": "map-planaltina",
      "name": "Planaltina",
      "coordinates": {
        "lat": -15.6233,
        "lng": -47.6614
      },
      "itemCount": 76,
      "description": "Região com tradição em breaking e battles",
      "items": [
        {
          "id": "ahhdf-003",
          "title": "Competição de Breaking",
          "date": "2001-07-28",
          "thumbnail": "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=200&h=150&fit=crop"
        }
      ]
    },
    {
      "id": "map-taguatinga",
      "name": "Taguatinga",
      "coordinates": {
        "lat": -15.8335,
        "lng": -48.0548
      },
      "itemCount": 87,
      "description": "Centro de produção de grafite e arte urbana",
      "items": [
        {
          "id": "ahhdf-004",
          "title": "Mural de Grafite - Estação Taguatinga",
          "date": "2003-09-12",
          "thumbnail": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=150&fit=crop"
        }
      ]
    },
    {
      "id": "map-brasilia",
      "name": "Brasília (Plano Piloto)",
      "coordinates": {
        "lat": -15.7801,
        "lng": -47.9292
      },
      "itemCount": 234,
      "description": "Centro político e cultural, palco de grandes eventos",
      "items": [
        {
          "id": "ahhdf-007",
          "title": "Festival Hip Hop Esplanada",
          "date": "2010-09-07",
          "thumbnail": "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=150&fit=crop"
        }
      ]
    }
  ],
  "bounds": {
    "north": -15.4000,
    "south": -16.1000,
    "east": -47.2000,
    "west": -48.5000
  },
  "center": {
    "lat": -15.7801,
    "lng": -47.9292
  }
};

// AIDEV-NOTE: Add random points to existing locations for enhanced map experience
const randomPoints = generateRandomPoints(15);
atomMapResponse.locations = [...atomMapResponse.locations, ...randomPoints];

export default atomMapResponse;