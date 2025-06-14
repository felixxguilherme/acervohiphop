// RESPOSTA PARA ESTATÍSTICAS DO ACERVO
export default atomStatisticsResponse = {
  "overview": {
    "totalItems": 847,
    "totalCollections": 1,
    "totalDigitalObjects": 1254,
    "totalFileSize": "12.8 GB",
    "lastUpdate": "2024-12-15T16:45:00Z"
  },
  "byYear": [
    { "year": "1980-1989", "count": 23 },
    { "year": "1990-1999", "count": 156 },
    { "year": "2000-2009", "count": 287 },
    { "year": "2010-2019", "count": 298 },
    { "year": "2020-2024", "count": 83 }
  ],
  "byRegion": [
    { "region": "Ceilândia", "count": 145 },
    { "region": "Samambaia", "count": 98 },
    { "region": "Planaltina", "count": 76 },
    { "region": "Taguatinga", "count": 87 },
    { "region": "Brasília", "count": 234 },
    { "region": "Outras", "count": 207 }
  ],
  "byMediaType": [
    { "type": "Fotografia", "count": 445 },
    { "type": "Vídeo", "count": 167 },
    { "type": "Áudio", "count": 234 },
    { "type": "Documento", "count": 189 },
    { "type": "Outros", "count": 167 }
  ],
  "bySubject": [
    { "subject": "Hip Hop", "count": 156 },
    { "subject": "Rap", "count": 134 },
    { "subject": "MC", "count": 112 },
    { "subject": "DJ", "count": 98 },
    { "subject": "Breaking", "count": 89 }
  ],
  "digitalObjectsSize": [
    { "type": "image/jpeg", "count": 567, "totalSize": "4.2 GB" },
    { "type": "video/mp4", "count": 123, "totalSize": "6.8 GB" },
    { "type": "audio/mp3", "count": 189, "totalSize": "1.1 GB" },
    { "type": "application/pdf", "count": 234, "totalSize": "0.5 GB" },
    { "type": "others", "count": 141, "totalSize": "0.2 GB" }
  ]
}