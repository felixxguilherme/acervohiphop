# 📚 API do Acervo Hip Hop DF - Guia Completo

## 🎯 Visão Geral

A API do Acervo Hip Hop DF é baseada no sistema **AtoM** (Access to Memory), uma plataforma profissional de gestão de arquivos digitais. Ela fornece acesso REST aos **39 documentos** preservados da história do Hip Hop no Distrito Federal.

### 📊 Estrutura do Acervo
- **39 itens totais** no acervo
- **36 coleções/documentos** de nível superior (textuais)
- **3 imagens digitais** históricas
- **Período:** 1994-2025 (criação + digitalização)

---

## 🔗 Configuração da API

### Endpoint Base
```
https://acervodistritohiphop.com.br/index.php/api/
```

### Autenticação
```javascript
Headers: {
  'REST-API-Key': 'af5067ab9869c4cc',
  'Content-Type': 'application/json'
}
```

### Configuração no Projeto
```javascript
// .env
NEXT_PUBLIC_API_KEY=af5067ab9869c4cc

// atomService.js
this.apiKey = process.env.NEXT_PUBLIC_API_KEY;
```

---

## 🛠 Endpoints Principais

### 1. `/informationobjects` - Buscar Todos os Itens

#### Busca Básica
```javascript
// Buscar todos os 39 itens
const response = await atomService.getItems({ 
  limit: 39, 
  sort: 'alphabetic' 
});
```

#### Busca com Filtros
```javascript
// Parâmetros disponíveis
{
  limit: number,      // Máximo de resultados
  skip: number,       // Offset para paginação
  sort: string,       // 'alphabetic' | 'date' | 'identifier' | 'lastUpdated'
  
  // Filtros especiais
  topLod: 1,          // Apenas coleções de nível superior (36 itens)
  onlyMedia: 1,       // Apenas itens com imagens (3 itens)
  
  // Busca textual
  sq0: string,        // Termo de busca
  sf0: string,        // Campo de busca ('title' | 'identifier' | 'scopeAndContent')
  so0: string,        // Operador ('and' | 'or' | 'not')
  
  // Filtros por data
  startDate: 'YYYY-MM-DD',
  endDate: 'YYYY-MM-DD'
}
```

### 2. `/informationobjects/{slug}` - Item Específico

```javascript
// Buscar detalhes de um item específico
const item = await atomService.getItem('composic-ao-6-dino-black-boicote');
```

### 3. `/taxonomies/{id}` - Vocabulários Controlados

```javascript
// IDs das taxonomias disponíveis
const taxonomies = {
  subjects: 35,        // Assuntos (Dino Black, GOG, Rap, etc.)
  places: 42,          // Lugares (Candangolândia/DF, Rio de Janeiro/RJ)
  genres: 78,          // Gêneros (Photographs, Music, Correspondence)
  levels: 34,          // Níveis (Arquivo, Coleção, etc.)
  actors: 32           // Tipos de entidade (Person, Corporate body)
};

// Buscar termos de uma taxonomia
const subjects = await atomService.getTaxonomy(35);
```

---

## 📋 Estrutura dos Dados

### Campos Principais de um Item
```javascript
{
  slug: string,                    // Identificador único
  title: string,                   // Título do documento
  reference_code: string,          // Código de referência (YYYY-MM-DD/NNN)
  level_of_description: string,    // "Arquivo" | "Grupo de documentos/arquivos"
  
  // Datas e localização
  creation_dates: string[],        // Datas de criação ["1994-07-23"]
  place_access_points: string[],   // Locais ["Candangolândia/DF"]
  
  // Descrição física
  physical_characteristics: string, // Características físicas do documento
  
  // Objetos digitais (apenas para imagens)
  thumbnail_url?: string,          // Miniatura (142px)
  reference_url?: string,          // Tamanho médio (141px)
  url?: string,                   // Resolução original
  
  // Metadados adicionais
  parent?: string,                // Item pai (para hierarquia)
  publication_status?: string,    // Status de publicação
  creators?: object[],           // Informações dos criadores
  digital_object?: object       // Detalhes do arquivo digital
}
```

### Exemplo de Item Completo
```javascript
{
  "slug": "composic-ao-6-dino-black-boicote",
  "title": "Composição 6 - Dino Black - \"Boicote\"",
  "reference_code": "2025-08-19/033",
  "level_of_description": "Grupo de documentos/arquivos",
  "physical_characteristics": "Folha escrita. Contém algumas dobras e cortes. Observam-se também algumas rasuras.",
  "creation_dates": ["1994-07-23"],
  "place_access_points": ["Candangolândia/DF"]
}
```

---

## 🎨 Casos de Uso Práticos

### 1. Buscar Coleções para Navegação
```javascript
// Interface de navegação - buscar apenas coleções principais
const collections = await atomService.getCollections({
  limit: 50,
  sort: 'alphabetic'
});

// Usar topLod=1 para filtrar apenas itens de nível superior
console.log(`${collections.total} coleções encontradas`); // 36 coleções
```

### 2. Galeria de Imagens
```javascript
// Buscar apenas itens com objetos digitais
const mediaItems = await atomService.getMediaItems({
  limit: 20,
  sort: 'alphabetic'
});

// Renderizar galeria
mediaItems.results.map(item => (
  <img src={item.thumbnail_url} alt={item.title} />
));
```

### 3. Busca Textual Avançada
```javascript
// Buscar por "Dino Black" no título
const searchResults = await atomService.search({
  q: 'Dino Black',
  field: 'title',
  operator: 'and',
  limit: 20
});

// Buscar documentos de 1994
const documents1994 = await atomService.search({
  startDate: '1994-01-01',
  endDate: '1994-12-31',
  limit: 50
});
```

### 4. Classificação por Localização (Mapa)
```javascript
// Agrupar itens por localização para visualização em mapa
const allItems = await atomService.getItems({ limit: 1000 });

const itemsByLocation = allItems.results.reduce((acc, item) => {
  if (item.place_access_points && item.place_access_points[0]) {
    const location = item.place_access_points[0];
    if (!acc[location]) acc[location] = [];
    acc[location].push(item);
  }
  return acc;
}, {});

// Resultado: 
// {
//   "Candangolândia/DF": [30+ itens],
//   "Rio de Janeiro/RJ": [1 item - Revista Cavaco]
// }
```

### 5. Timeline Histórica
```javascript
// Agrupar itens por período para timeline
const itemsWithDates = allItems.results
  .filter(item => item.creation_dates && item.creation_dates[0])
  .sort((a, b) => new Date(a.creation_dates[0]) - new Date(b.creation_dates[0]));

const timeline = itemsWithDates.reduce((acc, item) => {
  const year = new Date(item.creation_dates[0]).getFullYear();
  if (!acc[year]) acc[year] = [];
  acc[year].push(item);
  return acc;
}, {});

// Resultado:
// {
//   1994: [Composições do Dino Black],
//   1999: [Revista Cavaco],
//   2025: [Itens digitalizados]
// }
```

---

## 🗺 Implementação para Mapa

### Estrutura de Dados para Visualização Geográfica
```javascript
// Processar dados para mapa
const processForMap = async () => {
  const items = await atomService.getItems({ limit: 1000 });
  
  const mapData = {
    type: "FeatureCollection",
    features: []
  };
  
  // Agrupar por localização
  const locationGroups = items.results.reduce((acc, item) => {
    if (item.place_access_points && item.place_access_points[0]) {
      const location = item.place_access_points[0];
      if (!acc[location]) {
        acc[location] = {
          name: location,
          items: [],
          coordinates: getCoordinatesForLocation(location) // Função helper
        };
      }
      acc[location].items.push(item);
    }
    return acc;
  }, {});
  
  // Converter para GeoJSON
  Object.values(locationGroups).forEach(group => {
    mapData.features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: group.coordinates
      },
      properties: {
        name: group.name,
        itemCount: group.items.length,
        items: group.items,
        // Categorizar por tipo
        hasImages: group.items.some(item => item.thumbnail_url),
        hasCompositions: group.items.some(item => item.title.includes('Composição')),
        timeRange: getTimeRange(group.items)
      }
    });
  });
  
  return mapData;
};

// Função helper para coordenadas
const getCoordinatesForLocation = (location) => {
  const coordinates = {
    "Candangolândia/DF": [-47.9376, -15.8267],
    "Rio de Janeiro/RJ": [-43.1729, -22.9068]
  };
  return coordinates[location] || [-47.8826, -15.7942]; // Brasília default
};
```

### Componente de Mapa
```javascript
const MapaAcervo = () => {
  const [mapData, setMapData] = useState(null);
  
  useEffect(() => {
    const loadMapData = async () => {
      const data = await processForMap();
      setMapData(data);
    };
    loadMapData();
  }, []);
  
  return (
    <MapContainer center={[-15.7942, -47.8826]} zoom={10}>
      {mapData?.features.map((feature, index) => (
        <Marker 
          key={index}
          position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
        >
          <Popup>
            <div>
              <h3>{feature.properties.name}</h3>
              <p>{feature.properties.itemCount} documentos</p>
              <ul>
                {feature.properties.items.slice(0, 5).map(item => (
                  <li key={item.slug}>{item.title}</li>
                ))}
              </ul>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
```

---

## 📊 Filtros e Classificações Avançadas

### Por Tipo de Conteúdo
```javascript
const classifyByType = (items) => {
  return {
    compositions: items.filter(item => 
      item.title.includes('Composição') || 
      item.title.includes('Dino Black')
    ),
    
    media: items.filter(item => 
      item.thumbnail_url
    ),
    
    press: items.filter(item =>
      item.title.includes('Revista') || 
      item.title.includes('Correio') ||
      item.title.includes('Cavaco')
    ),
    
    translations: items.filter(item =>
      item.title.includes('Tradução')
    ),
    
    biographical: items.filter(item =>
      item.title.includes('Malcolm X') ||
      item.physical_characteristics?.includes('biografia')
    )
  };
};
```

### Por Período Histórico
```javascript
const classifyByPeriod = (items) => {
  const itemsWithDates = items.filter(item => 
    item.creation_dates && item.creation_dates[0]
  );
  
  return {
    early90s: itemsWithDates.filter(item =>
      new Date(item.creation_dates[0]).getFullYear() >= 1990 &&
      new Date(item.creation_dates[0]).getFullYear() < 1995
    ),
    
    late90s: itemsWithDates.filter(item =>
      new Date(item.creation_dates[0]).getFullYear() >= 1995 &&
      new Date(item.creation_dates[0]).getFullYear() < 2000
    ),
    
    digitization: itemsWithDates.filter(item =>
      new Date(item.creation_dates[0]).getFullYear() >= 2020
    )
  };
};
```

---

## 🔍 Otimizações e Boas Práticas

### 1. Cache Inteligente
```javascript
class AtomService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
  }
  
  async _fetchWithCache(key, fetchFn) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    
    const data = await fetchFn();
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }
}
```

### 2. Paginação Eficiente
```javascript
const loadItemsWithPagination = async (limit = 10, offset = 0) => {
  const response = await atomService.getItems({
    limit,
    skip: offset,
    sort: 'alphabetic'
  });
  
  return {
    items: response.results,
    hasMore: offset + limit < response.total,
    total: response.total,
    nextOffset: offset + limit
  };
};
```

### 3. Busca com Debounce
```javascript
const useSearchWithDebounce = (initialQuery = '') => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const searchResults = await atomService.search({
          q: query,
          field: 'title',
          limit: 20
        });
        setResults(searchResults.results);
      } finally {
        setLoading(false);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [query]);
  
  return { query, setQuery, results, loading };
};
```

---

## 🎯 Implementações Sugeridas

### 1. **Dashboard Administrativo**
- Estatísticas em tempo real
- Monitoramento de acessos
- Análise de buscas mais frequentes

### 2. **Interface de Descoberta**
- Busca facetada por múltiplos campos
- Sugestões automáticas baseadas em taxonomias
- Filtros dinâmicos por período/local

### 3. **Visualizações Interativas**
- Timeline histórica navegável
- Mapa com clusters por densidade
- Gráficos de distribuição temporal

### 4. **API Extensions**
- Endpoint de estatísticas consolidadas
- Export em múltiplos formatos (JSON, CSV, XML)
- Webhook para notificações de mudanças

---

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. API Key não funciona
```javascript
// Verificar se a variável está disponível no client
console.log('API Key:', process.env.NEXT_PUBLIC_API_KEY);

// Testar diretamente
curl -H "REST-API-Key: af5067ab9869c4cc" \
  "https://acervodistritohiphop.com.br/index.php/api/informationobjects?limit=1"
```

#### 2. Resultados vazios
```javascript
// Sempre verificar se há dados
const response = await atomService.getItems({ limit: 5 });
if (!response.results || response.results.length === 0) {
  console.log('Nenhum resultado encontrado');
  console.log('Total na API:', response.total);
}
```

#### 3. Campos não encontrados
```javascript
// Verificar estrutura real dos dados
const item = await atomService.getItem('primeiro-slug-disponivel');
console.log('Campos disponíveis:', Object.keys(item));
```

---

## 📈 Monitoramento e Métricas

### Logs Úteis
```javascript
// Adicionar logs para monitoramento
const logApiUsage = (endpoint, params, responseTime, resultCount) => {
  console.log({
    timestamp: new Date().toISOString(),
    endpoint,
    params,
    responseTime: `${responseTime}ms`,
    resultCount,
    success: true
  });
};
```

### Performance
- **Tempo médio de resposta:** ~500ms
- **Cache hit ratio:** 80%+ recomendado
- **Concurrent requests:** Máximo 10 simultâneas

---

*Documentação gerada para o projeto Acervo Hip Hop DF • Versão 1.0 • 2025*