# 🏛️ Estrutura e Navegação da API do Acervo Hip Hop DF

## 📋 Análise Estrutural do Acervo

### 🎯 **Composição Total do Acervo**
- **39 objetos informacionais** total
- **36 descrições de nível superior** (coleções principais)
- **3 imagens digitais** (sempre subordinadas a documentos)
- **Estrutura hierárquica** pai-filho identificada

### 📊 **Distribuição por Tipologia**

#### 🎵 **Composições Musicais** (6+ itens)
```javascript
const compositions = {
  'composic-ao-6-dino-black-boicote': 'Boicote',
  'composic-ao-6-dino-black-alienac-ao-global': 'Alienação Global (1994)',
  'composic-ao-5-dino-black-periferia-vigora': 'Periferia Vigora',
  'composic-ao-4-dino-black-dias-tristes': 'Dias Tristes',
  'composic-ao-2-dino-black-tdz-movimento-verdade': 'Movimento Verdade',
  'composic-ao-3': 'Composição 3'
};
```

#### 📸 **Objetos Digitais** (3 itens)
```javascript
const digitalObjects = {
  'image-01': {
    filename: 'ADHH_DINOBLACK_TIPO_-001.jpg',
    parent: 'capa-do-caderno-cultura-correio-brasiliense-13-de-marco-de-2024-2',
    context: 'Matéria Correio Brasiliense'
  },
  'image-03': {
    filename: 'ADHH_DINOBLACK_TIPO_-033.jpg',
    parent: 'composic-ao-6-dino-black-boicote',
    context: 'Composição Boicote'
  },
  'image-05': {
    filename: 'ADHH_DINOBLACK_TIPO_-032.jpg',
    parent: 'composic-ao-6-dino-black-boicote',
    context: 'Composição Boicote'
  }
};
```

#### 📰 **Material de Imprensa** (2+ itens)
- **Correio Brasiliense** (2004) - Matéria "Rimas Sociais"
- **Revista Cavaco** (1999) - Matéria sobre GOG

#### 📄 **Documentos Textuais** (20+ itens)
- Traduções de músicas
- Textos sobre Malcolm X
- Documentos biográficos e históricos

---

## 🗺️ **Estrutura Geográfica para Mapeamento**

### 📍 **Distribuição Espacial Identificada**

#### 🏠 **Candangolândia/DF** (Concentração Principal)
```javascript
const candangolandiaItems = {
  location: "Candangolândia/DF",
  coordinates: [-47.9376, -15.8267],
  itemCount: 30+,
  content: {
    compositions: "6+ composições do Dino Black",
    period: "1994-1995 (criação original)",
    context: "Região administrativa do DF, berço do rap brasiliense"
  },
  mapVisualization: {
    markerSize: "large", // Concentração principal
    clusterRadius: 500, // metros
    popupContent: "Centro de criação do Hip Hop DF"
  }
};
```

#### 🌊 **Rio de Janeiro/RJ** (Conexão Externa)
```javascript
const rioItems = {
  location: "Rio de Janeiro/RJ",
  coordinates: [-43.1729, -22.9068],
  itemCount: 1,
  content: {
    press: "Revista Cavaco - matéria sobre GOG",
    period: "1999-09-01",
    context: "Conexão com cenário nacional do Hip Hop"
  },
  mapVisualization: {
    markerSize: "medium",
    connectionLine: "Candangolândia → Rio", // Fluxo de influência
    popupContent: "Repercussão nacional do Hip Hop DF"
  }
};
```

### 🗺️ **Implementação de Mapa Estruturado**

#### **Componente MapaEstruturalAcervo**
```javascript
const MapaEstruturalAcervo = () => {
  const [geoData, setGeoData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [temporalFilter, setTemporalFilter] = useState('all');

  // Processar dados geográficos da API
  const processGeoData = async () => {
    const allItems = await atomService.getItems({ limit: 1000 });
    
    const geoStructure = {
      features: [],
      temporal: {
        '1990s': [],
        '2000s': [],
        '2020s': [] // Digitalização
      },
      thematic: {
        'musical-creation': [],
        'press-coverage': [],
        'personal-documents': [],
        'digital-preservation': []
      }
    };

    // Agrupar por localização e contexto
    allItems.results.forEach(item => {
      if (item.place_access_points && item.place_access_points[0]) {
        const location = item.place_access_points[0];
        const feature = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: getCoordinatesForLocation(location)
          },
          properties: {
            location,
            item,
            cluster: determineThematicCluster(item),
            period: extractPeriod(item),
            significance: calculateSignificance(item)
          }
        };
        geoStructure.features.push(feature);
      }
    });

    return geoStructure;
  };

  // Determinar cluster temático
  const determineThematicCluster = (item) => {
    if (item.title.includes('Composição') || item.title.includes('Dino Black')) {
      return 'musical-creation';
    }
    if (item.title.includes('Revista') || item.title.includes('Correio')) {
      return 'press-coverage';
    }
    if (item.title.includes('Malcolm X') || item.title.includes('Tradução')) {
      return 'personal-documents';
    }
    if (item.thumbnail_url || new Date(item.reference_code).getFullYear() >= 2020) {
      return 'digital-preservation';
    }
    return 'uncategorized';
  };

  // Calcular significância para tamanho do marcador
  const calculateSignificance = (item) => {
    let score = 1;
    if (item.creation_dates && item.creation_dates[0]) score += 2; // Tem data histórica
    if (item.thumbnail_url) score += 2; // Tem imagem
    if (item.title.includes('Dino Black')) score += 3; // Figura central
    if (item.title.includes('GOG')) score += 2; // Referência importante
    return Math.min(score, 5); // Max 5
  };

  return (
    <MapContainer center={[-15.7942, -47.8826]} zoom={10} style={{ height: '600px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* Marcadores por localização */}
      {geoData?.features.map((feature, index) => (
        <Marker
          key={index}
          position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
          icon={createThematicIcon(feature.properties.cluster, feature.properties.significance)}
          eventHandlers={{
            click: () => setSelectedLocation(feature.properties)
          }}
        >
          <Popup>
            <LocationPopup location={feature.properties} />
          </Popup>
        </Marker>
      ))}
      
      {/* Linha de conexão entre localizações */}
      <Polyline
        positions={[
          [-15.8267, -47.9376], // Candangolândia
          [-22.9068, -43.1729]  // Rio de Janeiro
        ]}
        pathOptions={{ 
          color: '#f8e71c', 
          weight: 3, 
          opacity: 0.7,
          dashArray: '10, 10'
        }}
      />
    </MapContainer>
  );
};
```

---

## 🕒 **Estrutura Temporal para Timeline**

### 📅 **Periodização Identificada**

#### **1994: Gênese Criativa**
```javascript
const period1994 = {
  year: 1994,
  context: "Período de criação musical intensa",
  items: [
    {
      date: "1994-07-23",
      title: "Composição 6 - Alienação Global",
      significance: "Marco temporal do acervo",
      location: "Candangolândia/DF"
    }
  ],
  visualization: {
    timelineColor: "#ff6b6b",
    markerSize: "large",
    description: "Nascimento do rap consciente no DF"
  }
};
```

#### **1999: Repercussão Nacional**
```javascript
const period1999 = {
  year: 1999,
  context: "Reconhecimento da cena hip hop de Brasília",
  items: [
    {
      date: "1999-09-01",
      title: "Revista Cavaco - Matéria sobre GOG",
      significance: "Projeção nacional do hip hop brasiliense",
      location: "Rio de Janeiro/RJ"
    }
  ],
  visualization: {
    timelineColor: "#4ecdc4",
    markerSize: "medium",
    description: "Hip hop DF ganha visibilidade nacional"
  }
};
```

#### **2025: Preservação Digital**
```javascript
const period2025 = {
  year: 2025,
  context: "Processo de digitalização e preservação",
  items: "Majority of reference codes 2025-*",
  significance: "Salvaguarda da memória hip hop",
  visualization: {
    timelineColor: "#45b7d1",
    markerSize: "medium",
    description: "Digitalização para as futuras gerações"
  }
};
```

### ⏰ **Componente TimelineEstruturalAcervo**
```javascript
const TimelineEstruturalAcervo = () => {
  const [timelineData, setTimelineData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [viewMode, setViewMode] = useState('chronological'); // 'chronological' | 'thematic'

  const processTimelineData = async () => {
    const allItems = await atomService.getItems({ limit: 1000 });
    
    const timeline = allItems.results
      .filter(item => item.creation_dates && item.creation_dates[0])
      .map(item => ({
        date: new Date(item.creation_dates[0]),
        item,
        period: categorizePeriod(item.creation_dates[0]),
        theme: determineTheme(item)
      }))
      .sort((a, b) => a.date - b.date);
    
    return timeline;
  };

  const categorizePeriod = (dateString) => {
    const year = new Date(dateString).getFullYear();
    if (year >= 1990 && year < 2000) return 'genesis';
    if (year >= 2000 && year < 2010) return 'consolidation';
    if (year >= 2020) return 'preservation';
    return 'unknown';
  };

  return (
    <div className="timeline-container">
      {/* Controles de visualização */}
      <div className="timeline-controls">
        <button 
          className={viewMode === 'chronological' ? 'active' : ''}
          onClick={() => setViewMode('chronological')}
        >
          📅 Cronológica
        </button>
        <button 
          className={viewMode === 'thematic' ? 'active' : ''}
          onClick={() => setViewMode('thematic')}
        >
          🎭 Temática
        </button>
      </div>

      {/* Timeline visual */}
      <div className="timeline-track">
        {timelineData.map((entry, index) => (
          <TimelineMarker
            key={index}
            entry={entry}
            position={calculatePosition(entry, timelineData)}
            onClick={() => setSelectedPeriod(entry)}
          />
        ))}
      </div>

      {/* Detalhes do período selecionado */}
      {selectedPeriod && (
        <PeriodDetails period={selectedPeriod} />
      )}
    </div>
  );
};
```

---

## 🔍 **Sistema de Busca Estruturado**

### 🎯 **Busca Hierárquica**

#### **Nível 1: Coleções Principais**
```javascript
const searchCollections = async (query) => {
  // Usar topLod=1 para buscar apenas coleções principais
  return await atomService.search({
    q: query,
    field: 'title',
    topLod: true, // Apenas 36 coleções principais
    limit: 50
  });
};
```

#### **Nível 2: Busca Contextual**
```javascript
const searchByContext = async (context, location, period) => {
  const params = {
    limit: 100,
    sort: 'date'
  };

  // Filtro contextual
  if (context === 'musical') {
    params.sq0 = 'Composição OR Dino Black';
    params.sf0 = 'title';
  } else if (context === 'press') {
    params.sq0 = 'Revista OR Correio OR Cavaco';
    params.sf0 = 'title';
  }

  // Filtro temporal
  if (period === '1990s') {
    params.startDate = '1990-01-01';
    params.endDate = '1999-12-31';
  }

  return await atomService.search(params);
};
```

#### **Nível 3: Busca Semântica**
```javascript
const searchSemantic = async (concept) => {
  const semanticMaps = {
    'hip-hop-origins': ['Dino Black', 'Composição', 'Candangolândia', 'rap'],
    'media-coverage': ['Revista', 'Correio', 'Cavaco', 'GOG', 'imprensa'],
    'social-consciousness': ['Malcolm X', 'Boicote', 'Alienação', 'Movimento'],
    'cultural-preservation': ['digitalização', 'acervo', 'memória', 'arquivo']
  };

  const searchTerms = semanticMaps[concept] || [concept];
  const results = await Promise.all(
    searchTerms.map(term => 
      atomService.search({
        q: term,
        field: 'title',
        limit: 20
      })
    )
  );

  // Combinar e deduplificar resultados
  const combined = results.flatMap(r => r.results);
  const unique = combined.filter((item, index, self) => 
    index === self.findIndex(i => i.slug === item.slug)
  );

  return { results: unique, total: unique.length };
};
```

### 🔎 **Interface de Busca Facetada**
```javascript
const BuscaEstruturadaAcervo = () => {
  const [searchMode, setSearchMode] = useState('simple');
  const [facets, setFacets] = useState({
    temporal: 'all',
    geographic: 'all',
    thematic: 'all',
    media: 'all'
  });
  const [results, setResults] = useState([]);

  const performStructuredSearch = async () => {
    let searchParams = {
      limit: 50,
      sort: 'alphabetic'
    };

    // Aplicar facetas
    if (facets.temporal !== 'all') {
      const periods = {
        '1990s': { start: '1990-01-01', end: '1999-12-31' },
        '2000s': { start: '2000-01-01', end: '2009-12-31' },
        '2020s': { start: '2020-01-01', end: '2030-12-31' }
      };
      if (periods[facets.temporal]) {
        searchParams.startDate = periods[facets.temporal].start;
        searchParams.endDate = periods[facets.temporal].end;
      }
    }

    if (facets.media === 'images-only') {
      searchParams.onlyMedia = 1;
    } else if (facets.media === 'documents-only') {
      searchParams.topLod = 1;
    }

    if (facets.thematic !== 'all') {
      const themes = {
        'musical': 'Composição OR Dino Black',
        'press': 'Revista OR Correio',
        'biographical': 'Malcolm X OR biografia'
      };
      if (themes[facets.thematic]) {
        searchParams.sq0 = themes[facets.thematic];
        searchParams.sf0 = 'title';
      }
    }

    const searchResults = await atomService.search(searchParams);
    setResults(searchResults.results);
  };

  return (
    <div className="busca-estruturada">
      {/* Controles de facetas */}
      <div className="facet-controls">
        <FacetSelector
          label="Período"
          value={facets.temporal}
          options={[
            { value: 'all', label: 'Todos os períodos' },
            { value: '1990s', label: 'Anos 1990 (Criação)' },
            { value: '2000s', label: 'Anos 2000 (Consolidação)' },
            { value: '2020s', label: 'Anos 2020 (Digitalização)' }
          ]}
          onChange={(value) => setFacets({...facets, temporal: value})}
        />

        <FacetSelector
          label="Tipologia"
          value={facets.thematic}
          options={[
            { value: 'all', label: 'Todos os tipos' },
            { value: 'musical', label: 'Composições musicais' },
            { value: 'press', label: 'Material de imprensa' },
            { value: 'biographical', label: 'Documentos biográficos' }
          ]}
          onChange={(value) => setFacets({...facets, thematic: value})}
        />

        <FacetSelector
          label="Mídia"
          value={facets.media}
          options={[
            { value: 'all', label: 'Todos os formatos' },
            { value: 'images-only', label: 'Apenas imagens (3)' },
            { value: 'documents-only', label: 'Apenas documentos (36)' }
          ]}
          onChange={(value) => setFacets({...facets, media: value})}
        />
      </div>

      {/* Botão de busca */}
      <button onClick={performStructuredSearch}>
        🔍 Buscar com Facetas
      </button>

      {/* Resultados */}
      <div className="search-results">
        <SearchResultsList results={results} />
      </div>
    </div>
  );
};
```

---

## 📊 **Taxonomias e Classificação**

### 🏷️ **Sistema Taxonômico Identificado**

#### **ID 35: Subjects (Assuntos)**
```javascript
const subjects = await atomService.getTaxonomy(35);
// Retorna: ["Batalha", "Dino Black", "GOG", "Rap", ...]
```

#### **ID 42: Places (Lugares)**
```javascript
const places = await atomService.getTaxonomy(42);
// Retorna: ["Candangolândia/DF", "Rio de Janeiro/RJ"]
```

#### **ID 78: Genres (Gêneros)**
```javascript
const genres = await atomService.getTaxonomy(78);
// Retorna: ["Photographs", "Music", "Correspondence", ...]
```

#### **ID 34: Level of Description (Níveis)**
```javascript
const levels = await atomService.getTaxonomy(34);
// Retorna: ["Arquivo", "Coleção", "Grupo de documentos/arquivos"]
```

### 🗂️ **Classificação Automática por IA**
```javascript
const classifyItemAutomatically = (item) => {
  const classification = {
    primary: null,
    secondary: [],
    significance: 1,
    connections: []
  };

  // Classificação primária por título
  if (item.title.includes('Composição') || item.title.includes('Dino Black')) {
    classification.primary = 'musical-creation';
    classification.significance = 4;
  } else if (item.title.includes('Revista') || item.title.includes('Correio')) {
    classification.primary = 'press-coverage';
    classification.significance = 3;
  } else if (item.title.includes('Malcolm X')) {
    classification.primary = 'biographical-reference';
    classification.significance = 2;
  } else if (item.thumbnail_url) {
    classification.primary = 'visual-document';
    classification.significance = 3;
  }

  // Classificação secundária por contexto
  if (item.creation_dates && new Date(item.creation_dates[0]).getFullYear() === 1994) {
    classification.secondary.push('foundational-period');
  }
  
  if (item.place_access_points?.includes('Candangolândia/DF')) {
    classification.secondary.push('local-origin');
  }
  
  if (item.place_access_points?.includes('Rio de Janeiro/RJ')) {
    classification.secondary.push('national-projection');
  }

  // Identificar conexões
  if (item.title.includes('GOG')) {
    classification.connections.push('gog-reference');
  }
  
  if (item.parent) {
    classification.connections.push('hierarchical-relationship');
  }

  return classification;
};
```

---

## 📱 **Interfaces de Navegação Propostas**

### 🗺️ **1. Mapa Temático Interativo**
- **Marcadores por significância** (tamanho variável)
- **Clusters por contexto** (cores diferentes)
- **Linhas de conexão** entre localidades
- **Timeline integrada** no popup

### 📚 **2. Navegador Hierárquico**
- **Árvore de coleções** expandível
- **Visualização pai-filho** clara
- **Breadcrumbs** para contexto
- **Busca em árvore** em tempo real

### 🕒 **3. Timeline Narrativa**
- **Marcos temporais** destacados
- **Contexto histórico** integrado
- **Zoom temporal** (década → ano → mês)
- **Sincronização com mapa**

### 🔍 **4. Busca Semântica Avançada**
- **Sugestões contextuais** baseadas em taxonomias
- **Busca por similaridade** de conteúdo
- **Filtros combinados** inteligentes
- **Resultados agrupados** por relevância

---

## 🎯 **Roadmap de Implementação**

### 🚀 **Fase 1: Estrutura Base** (1-2 semanas)
1. ✅ Análise completa da API e documentação
2. ✅ Implementação do atomService sem fallbacks
3. ✅ Interface de navegação básica
4. 🔄 Sistema de busca estruturada

### 🗺️ **Fase 2: Mapeamento** (2-3 semanas)
1. 📍 Componente de mapa com marcadores temáticos
2. 🔗 Sistema de conexões geográficas
3. 📊 Integração com dados temporais
4. 🎨 Visualizações personalizadas

### ⏰ **Fase 3: Timeline** (2-3 semanas)
1. 📅 Componente de timeline interativo
2. 🎭 Modos de visualização (cronológico/temático)
3. 🔄 Sincronização mapa-timeline
4. 📖 Narrativa histórica contextual

### 🔍 **Fase 4: Busca Avançada** (3-4 semanas)
1. 🏷️ Sistema de taxonomias dinâmicas
2. 🤖 Classificação automática por IA
3. 🔎 Busca semântica e facetada
4. 📈 Analytics de uso e relevância

### 🎨 **Fase 5: UX/UI Avançada** (2-3 semanas)
1. 📱 Interface responsiva completa
2. ♿ Acessibilidade total
3. 🎯 Otimizações de performance
4. 📊 Dashboard administrativo

---

*Estruturação baseada na análise completa da API ATOM do Acervo Hip Hop DF • Versão 1.0 • 2025*