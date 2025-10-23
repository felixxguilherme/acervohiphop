'use client';

import { useState, useEffect } from 'react';
import { getLatestItems } from '@/services/atomApi';
import { CartoonButton } from '@/components/ui/cartoon-button';
import PolaroidPhoto from '@/components/PolaroidPhoto';

export default function ApiResults() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestItems = async () => {
      try {
        setLoading(true);
        const response = await getLatestItems(6); // Buscar os 6 últimos itens
        setItems(response.results || []);
      } catch (err) {
        console.error('Erro ao buscar itens da API:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestItems();
  }, []);

  if (loading) {
    return (
      <section style={{ position: 'relative', zIndex: 10, backgroundColor: '#1a1a1a', color: 'white', padding: '4rem 2rem' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-6xl font-dirty-stains text-center mb-8">ÚLTIMAS ADIÇÕES</h2>
          <div className="flex justify-center">
            <div className="text-2xl font-sometype-mono">Carregando...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section style={{ position: 'relative', zIndex: 10, backgroundColor: '#1a1a1a', color: 'white', padding: '4rem 2rem' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-6xl font-dirty-stains text-center mb-8">ÚLTIMAS ADIÇÕES</h2>
          <div className="text-center">
            <div className="text-xl font-sometype-mono mb-4">Não foi possível carregar os dados.</div>
            <div className="text-lg text-gray-400">{error}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ position: 'relative', zIndex: 10, backgroundColor: '#1a1a1a', color: 'white', padding: '4rem 2rem' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-6xl font-dirty-stains text-center mb-8">ÚLTIMAS ADIÇÕES</h2>
        <p className="text-xl font-sometype-mono text-center mb-12 text-gray-300">
          Confira os documentos mais recentes do nosso acervo digital
        </p>
        
        {items.length === 0 ? (
          <div className="text-center">
            <div className="text-xl font-sometype-mono">Nenhum item encontrado.</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {items.map((item, index) => (
                <div key={item.id || index} className="group">
                  <PolaroidPhoto
                    imageSrc={item.digital_object?.thumbnail_url || item.thumbnail_url || '/placeholder-image.webp'}
                    title={item.title}
                    subtitle={item.level_of_description}
                    description={item.scope_and_content || item.physical_characteristics}
                    width={300}
                    height={200}
                    tapeRotation={index % 2 === 0 ? -2 : 2}
                    polaroidRotation={index % 3 === 0 ? -1 : index % 3 === 1 ? 1 : 0}
                  />
                  
                  <div className="mt-4 text-center">
                    <h3 className="text-lg font-sometype-mono font-bold mb-2 truncate">
                      {item.title}
                    </h3>
                    {item.creation_dates && item.creation_dates.length > 0 && (
                      <p className="text-sm text-gray-400 mb-2">
                        {new Date(item.creation_dates[0]).getFullYear()}
                      </p>
                    )}
                    {item.reference_code && (
                      <p className="text-xs text-gray-500 mb-3">
                        Ref: {item.reference_code}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <CartoonButton 
                textSize="text-xl" 
                text="VER ACERVO COMPLETO" 
                backgroundMode="static" 
                imagePath="marca-texto-amarelo.webp"
                onClick={() => window.location.href = '/acervo'}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}