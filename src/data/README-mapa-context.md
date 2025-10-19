# Context do Mapa - Acervo Hip-Hop DF

## 🗺️ **Funcionalidades Implementadas**

O AcervoContext agora inclui funcionalidades completas para gerenciar dados do mapa:

### **Estados Disponíveis**
- `mapData`: Array com todos os itens do mapa com detalhes completos
- `geoJson`: Objeto GeoJSON pronto para uso em mapas
- `mapStatistics`: Estatísticas sobre extração de coordenadas
- `loading.map`: Estado de carregamento dos dados do mapa
- `errors.map`: Erros relacionados ao carregamento do mapa

### **Funções Disponíveis**
- `loadMapData(creatorId, forceReload)`: Carrega todos os dados do mapa
- `generateGeoJson(items)`: Gera GeoJSON a partir dos dados
- `updateGeoJsonFeature(featureId, updates)`: Atualiza feature específica

## 🚀 **Como Usar**

### **1. Carregar Dados do Mapa**

```javascript
import { useAcervo } from '@/contexts/AcervoContext';

function MapComponent() {
  const { 
    mapData, 
    geoJson, 
    mapStatistics, 
    loadMapData, 
    isLoading, 
    getError 
  } = useAcervo();

  useEffect(() => {
    loadMapData(); // Carrega dados do creator 3312 por padrão
    // ou loadMapData('3312', true); // Para forçar recarregamento
  }, [loadMapData]);

  if (isLoading('map')) return <div>Carregando mapa...</div>;
  
  const error = getError('map');
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <p>Total de pontos: {mapStatistics.totalItems}</p>
      <p>Com coordenadas: {mapStatistics.itemsWithCoordinates}</p>
      <p>Taxa de sucesso: {mapStatistics.extractionSuccessRate}</p>
      
      {/* Usar geoJson em componente de mapa */}
      <MapRenderer geoJson={geoJson} />
    </div>
  );
}
```

### **2. Integrar com Mapbox/Leaflet**

```javascript
// Exemplo com Mapbox
function MapboxComponent() {
  const { geoJson } = useAcervo();
  
  useEffect(() => {
    if (geoJson && map) {
      map.addSource('acervo-data', {
        type: 'geojson',
        data: geoJson
      });
      
      map.addLayer({
        id: 'acervo-points',
        type: 'circle',
        source: 'acervo-data',
        paint: {
          'circle-radius': 8,
          'circle-color': '#f8e71c'
        }
      });
    }
  }, [geoJson, map]);
}
```

### **3. Atualizar Features Dinamicamente**

```javascript
function MapControls() {
  const { updateGeoJsonFeature } = useAcervo();
  
  const handleFeatureUpdate = (featureId) => {
    updateGeoJsonFeature(featureId, {
      highlighted: true,
      lastViewed: new Date().toISOString()
    });
  };
}
```

## 📊 **Estrutura dos Dados**

### **mapData - Array de Items**
```javascript
[
  {
    slug: "batalha-do-di",
    title: "Batalha do DI.",
    thumbnail_url: "https://base.acervodistrito...",
    archival_history: "Sexta-feira - 19h30 - semanal",
    place_access_points: ["Taguatinga"],
    notes: ["-15.826426423871808, -48.05788009445245"],
    reference_code: "2025-10-13/093B",
    // ... outros campos
  }
]
```

### **geoJson - Formato Padrão**
```javascript
{
  type: "FeatureCollection",
  metadata: {
    title: "Acervo Hip-Hop DF - Creator 3312",
    total_features: 93,
    coordinate_statistics: {
      items_with_real_coordinates: 85,
      items_with_default_coordinates: 8,
      extraction_success_rate: "91.4%"
    },
    generated_at: "2025-10-19T03:27:00.000Z"
  },
  features: [
    {
      type: "Feature",
      properties: {
        id: "batalha-do-di",
        title: "Batalha do DI.",
        thumbnail_url: "https://base.acervodistrito...",
        has_real_coordinates: true,
        coordinate_source: "extracted_from_notes",
        detail_url: "https://base.acervo...",
        // ... todos os campos do item
      },
      geometry: {
        type: "Point",
        coordinates: [-48.05788009445245, -15.826426423871808]
      }
    }
  ]
}
```

### **mapStatistics - Estatísticas**
```javascript
{
  totalItems: 93,
  itemsWithCoordinates: 85,
  itemsWithoutCoordinates: 8,
  extractionSuccessRate: "91.4%"
}
```

## ⚡ **Funcionalidades Automáticas**

### **1. Extração de Coordenadas**
- Extrai automaticamente coordenadas do campo `notes`
- Suporta múltiplos formatos: `lat, lng`, `lat|lng`, etc.
- Fallback para coordenadas de Brasília se não encontrar

### **2. Correção de URLs**
- Corrige automaticamente thumbnails de `acervodistrito` para `base.acervodistrito`
- Garante que todas as imagens funcionem corretamente

### **3. Paginação Inteligente**
- Busca todos os itens disponíveis com paginação automática
- Detecta duplicatas e para quando não há mais dados
- Logs detalhados para monitoramento

### **4. Cache Inteligente**
- Dados carregados apenas uma vez por sessão
- Opção de forçar recarregamento quando necessário
- Estado de loading independente para UX melhor

## 🎯 **Próximos Passos**

1. **Remover Componente de Teste**: Remover `MapDataTest` da página de acervo
2. **Integrar no Mapa Real**: Usar o contexto na página `/mapa`
3. **Implementar Interatividade**: Conectar cliques do mapa com busca
4. **Otimizar Performance**: Implementar virtualização se necessário

## 🔧 **Debug e Monitoramento**

O contexto inclui logs detalhados:
- `[AcervoContext] 🗺️` - Carregamento do mapa
- `[AcervoContext] 📊` - Estatísticas de paginação  
- `[AcervoContext] ✅` - Sucessos
- `[AcervoContext] ⚠️` - Avisos
- `[AcervoContext] ❌` - Erros

Monitore o console do navegador para acompanhar o processo de carregamento.