const atomSearchResponse = {
  "query": "breaking",
  "results": [
    {
      "id": "ahhdf-003",
      "slug": "video-breaking-planaltina-2001",
      "title": "Competição de Breaking - Planaltina 2001",
      "levelOfDescription": "Item",
      "identifier": "AHHDF-VID-003",
      "dates": [
        {
          "startDate": "2001-07-28",
          "type": "creation"
        }
      ],
      "scopeAndContent": "Registro audiovisual de competição de breaking realizada no centro de Planaltina...",
      "subjects": ["Breaking", "B-boying", "Dança urbana", "Planaltina", "Competição"],
      "thumbnail": "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop",
      "relevanceScore": 0.95
    },
    {
      "id": "ahhdf-006",
      "slug": "foto-crew-breaking-brasilia-2002",
      "title": "Crew de Breaking - Brasília 2002",
      "levelOfDescription": "Item",
      "identifier": "AHHDF-FOT-006",
      "dates": [
        {
          "startDate": "2002-03-10",
          "type": "creation"
        }
      ],
      "scopeAndContent": "Fotografia de crew de breaking durante treino no Eixão Sul...",
      "subjects": ["Breaking", "Crew", "Eixão", "Treino", "B-boys"],
      "thumbnail": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "relevanceScore": 0.88
    }
  ],
  "total": 23,
  "offset": 0,
  "limit": 10,
  "facets": {
    "subjects": [
      { "term": "Breaking", "count": 23 },
      { "term": "Hip Hop", "count": 18 },
      { "term": "Dança urbana", "count": 15 },
      { "term": "B-boying", "count": 12 }
    ],
    "dates": [
      { "term": "2000-2004", "count": 8 },
      { "term": "1995-1999", "count": 7 },
      { "term": "2005-2009", "count": 5 },
      { "term": "2010-2015", "count": 3 }
    ],
    "places": [
      { "term": "Planaltina", "count": 6 },
      { "term": "Ceilândia", "count": 5 },
      { "term": "Brasília", "count": 4 },
      { "term": "Taguatinga", "count": 3 }
    ]
  },
  "_links": {
    "self": {
      "href": "/api/search?q=breaking&offset=0&limit=10"
    }
  }
};

export default atomSearchResponse;