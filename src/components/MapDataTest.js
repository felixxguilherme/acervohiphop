'use client';

import { useEffect } from 'react';
import { useAcervo } from '@/contexts/AcervoContext';

export default function MapDataTest() {
  const { 
    mapData, 
    geoJson, 
    mapStatistics, 
    loadMapData, 
    isLoading, 
    getError 
  } = useAcervo();

  useEffect(() => {
    loadMapData();
  }, [loadMapData]);

  if (isLoading('map')) {
    return (
      <div className="p-6 bg-white border-2 border-black">
        <h2 className="text-xl font-dirty-stains mb-4">Teste dos Dados do Mapa</h2>
        <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full"></div>
        <p className="mt-2 font-sometype-mono">Carregando dados do mapa...</p>
      </div>
    );
  }

  const error = getError('map');
  if (error) {
    return (
      <div className="p-6 bg-white border-2 border-red-500">
        <h2 className="text-xl font-dirty-stains mb-4 text-red-600">Erro nos Dados do Mapa</h2>
        <p className="font-sometype-mono text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border-2 border-black">
      <h2 className="text-xl font-dirty-stains mb-4">Teste dos Dados do Mapa</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estatísticas */}
        <div className="border border-gray-300 p-4">
          <h3 className="font-dirty-stains text-lg mb-2">Estatísticas</h3>
          <div className="font-sometype-mono text-sm space-y-1">
            <p>Total de itens: {mapStatistics.totalItems}</p>
            <p>Com coordenadas: {mapStatistics.itemsWithCoordinates}</p>
            <p>Sem coordenadas: {mapStatistics.itemsWithoutCoordinates}</p>
            <p>Taxa de sucesso: {mapStatistics.extractionSuccessRate}</p>
          </div>
        </div>

        {/* Dados brutos */}
        <div className="border border-gray-300 p-4">
          <h3 className="font-dirty-stains text-lg mb-2">Dados Brutos</h3>
          <div className="font-sometype-mono text-sm">
            <p>MapData length: {mapData.length}</p>
            <p>GeoJSON features: {geoJson?.features?.length || 0}</p>
            <p>GeoJSON metadata: {geoJson?.metadata ? '✅' : '❌'}</p>
          </div>
        </div>
      </div>

      {/* Primeiros itens */}
      {mapData.length > 0 && (
        <div className="mt-6 border border-gray-300 p-4">
          <h3 className="font-dirty-stains text-lg mb-2">Primeiros 3 Itens</h3>
          <div className="space-y-2">
            {mapData.slice(0, 3).map((item, index) => (
              <div key={item.slug} className="border-l-4 border-blue-500 pl-3 py-1">
                <p className="font-dirty-stains">{item.title}</p>
                <p className="font-sometype-mono text-xs text-gray-600">
                  {item.slug} | {item.notes?.[0] ? 'Com coordenadas' : 'Sem coordenadas'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GeoJSON info */}
      {geoJson && (
        <div className="mt-6 border border-gray-300 p-4">
          <h3 className="font-dirty-stains text-lg mb-2">GeoJSON Info</h3>
          <div className="font-sometype-mono text-sm">
            <p>Type: {geoJson.type}</p>
            <p>Features: {geoJson.features.length}</p>
            <p>Generated: {geoJson.metadata?.generated_at}</p>
            <p>Success Rate: {geoJson.metadata?.coordinate_statistics?.extraction_success_rate}</p>
          </div>
        </div>
      )}
    </div>
  );
}