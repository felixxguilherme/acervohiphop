// Serviço para buscar coordenadas de municípios brasileiros
class MunicipiosService {
  constructor() {
    this.cache = new Map();
    this.municipiosData = null;
    this.isLoading = false;
  }

  // Carrega dados dos municípios do IBGE
  async loadMunicipiosData() {
    if (this.municipiosData || this.isLoading) {
      return this.municipiosData;
    }

    try {
      this.isLoading = true;
      console.log('[MunicipiosService] Carregando dados dos municípios...');
      
      const response = await fetch('https://servicodados.ibge.gov.br/api/v4/malhas/municipios?formato=application/vnd.geo+json');
      if (!response.ok) {
        throw new Error('Erro ao carregar dados dos municípios');
      }

      const geojson = await response.json();
      this.municipiosData = geojson;
      
      console.log(`[MunicipiosService] ${geojson.features.length} municípios carregados`);
      return this.municipiosData;
    } catch (error) {
      console.error('[MunicipiosService] Erro:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  // Busca coordenadas de um município pelo nome
  async findMunicipioCoordinates(municipioName) {
    if (!municipioName) return null;

    // Verifica cache primeiro
    const cacheKey = municipioName.toLowerCase().trim();
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Carrega dados se necessário
      const data = await this.loadMunicipiosData();
      if (!data) return null;

      // Normaliza o nome do município para busca
      const searchName = this.normalizeName(municipioName);

      // Busca o município
      const municipio = data.features.find(feature => {
        const props = feature.properties;
        const municipioNome = this.normalizeName(props.nome || props.NM_MUN || props.name);
        
        return municipioNome.includes(searchName) || searchName.includes(municipioNome);
      });

      if (municipio) {
        // Calcula centroid do polígono
        const coordinates = this.calculateCentroid(municipio.geometry);
        const result = {
          lat: coordinates[1],
          lng: coordinates[0],
          source: 'ibge_municipios',
          municipioName: municipio.properties.nome || municipio.properties.NM_MUN || municipio.properties.name,
          uf: municipio.properties.sigla_uf || municipio.properties.UF
        };

        // Cache o resultado
        this.cache.set(cacheKey, result);
        return result;
      }

      // Cache resultado negativo
      this.cache.set(cacheKey, null);
      return null;

    } catch (error) {
      console.warn(`[MunicipiosService] Erro ao buscar município "${municipioName}":`, error);
      return null;
    }
  }

  // Normaliza nome para comparação
  normalizeName(name) {
    if (!name) return '';
    return name
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, ' '); // Normaliza espaços
  }

  // Calcula centroid de um polígono
  calculateCentroid(geometry) {
    if (geometry.type === 'Polygon') {
      return this.getPolygonCentroid(geometry.coordinates[0]);
    } else if (geometry.type === 'MultiPolygon') {
      // Para MultiPolygon, pega o maior polígono
      let largestPolygon = geometry.coordinates[0];
      let largestArea = 0;

      geometry.coordinates.forEach(polygon => {
        const area = this.calculatePolygonArea(polygon[0]);
        if (area > largestArea) {
          largestArea = area;
          largestPolygon = polygon;
        }
      });

      return this.getPolygonCentroid(largestPolygon[0]);
    }
    
    return [0, 0];
  }

  // Calcula centroid de um polígono simples
  getPolygonCentroid(coordinates) {
    let x = 0;
    let y = 0;
    let area = 0;
    
    for (let i = 0; i < coordinates.length - 1; i++) {
      const [x1, y1] = coordinates[i];
      const [x2, y2] = coordinates[i + 1];
      const a = x1 * y2 - x2 * y1;
      x += (x1 + x2) * a;
      y += (y1 + y2) * a;
      area += a;
    }
    
    area *= 0.5;
    return [x / (6 * area), y / (6 * area)];
  }

  // Calcula área aproximada de um polígono
  calculatePolygonArea(coordinates) {
    let area = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
      const [x1, y1] = coordinates[i];
      const [x2, y2] = coordinates[i + 1];
      area += x1 * y2 - x2 * y1;
    }
    return Math.abs(area) / 2;
  }

  // Limpa cache
  clearCache() {
    this.cache.clear();
  }
}

// Instância singleton
const municipiosService = new MunicipiosService();

export default municipiosService;